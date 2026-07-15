/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import MultiPatients from "./MultiPatients";
import { employeeService, patientService } from "../../services";
import { debouncedSetQuery } from "@/utils/utils";

// Stub the MultiSelect maker so we can assert the mapped options the component
// produces and drive its onChange/inputValue callbacks directly, without the
// real react-select internals.
vi.mock("@/utils/Makers", () => ({
  MultiSelect: ({ options, setValue, value, inputValue, overrideStrings }) => (
    <div>
      <span data-testid="placeholder">{overrideStrings?.selectSomeItems}</span>
      <span data-testid="selected-label">
        {overrideStrings?.allItemsAreSelected}
      </span>
      <span data-testid="option-count">{options?.length ?? 0}</span>
      <ul>
        {options?.map((o) => (
          <li key={o.value} data-access={o.accessId}>
            {o.label}
          </li>
        ))}
      </ul>
      <button onClick={() => setValue(options?.length ? [options[0]] : [])}>
        pick first
      </button>
      <input
        aria-label="search"
        onChange={(e) => inputValue && inputValue(e.target.value)}
      />
    </div>
  ),
}));

vi.mock("../../services", () => ({
  employeeService: {
    listUsers: vi.fn(),
    getEmployee: vi.fn(),
  },
  patientService: {
    listForSearch: vi.fn(),
  },
}));

vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (i) => `Name-${i._id}`,
  debouncedSetQuery: vi.fn(),
}));

describe("MultiPatients", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should fetch patients for search by default and map them to options", () => {
    patientService.listForSearch.mockImplementation(({ setResponse }) => {
      setResponse({
        data: {
          docs: [
            { _id: "res-test-001", ahcccsId: "MRN-TEST-001" },
            { _id: "res-test-002", ahcccsId: "MRN-TEST-002" },
          ],
        },
      });
    });

    renderWithProviders(<MultiPatients setValue={vi.fn()} value={[]} />);

    // WHY: the default (non-clinical, non-faciliated) branch lists patients for
    // search and exposes each as a selectable option.
    expect(patientService.listForSearch).toHaveBeenCalledTimes(1);
    expect(employeeService.getEmployee).not.toHaveBeenCalled();
    expect(screen.getByText("Name-res-test-001")).toBeInTheDocument();
    expect(screen.getByText("Name-res-test-002")).toBeInTheDocument();
    expect(screen.getByTestId("option-count")).toHaveTextContent("2");
  });

  it("should fetch clinical employees and keep only Employee userType", () => {
    employeeService.getEmployee.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [
          { _id: "emp-test-001", userType: "Employee" },
          { _id: "res-test-003", userType: "Patient" },
        ],
      });
    });

    renderWithProviders(
      <MultiPatients setValue={vi.fn()} value={[]} isClinical />,
    );

    // WHY: clinical signer lists must only include employees, never patients.
    expect(employeeService.getEmployee).toHaveBeenCalledTimes(1);
    expect(patientService.listForSearch).not.toHaveBeenCalled();
    expect(screen.getByText("Name-emp-test-001")).toBeInTheDocument();
    expect(screen.queryByText("Name-res-test-003")).not.toBeInTheDocument();
  });

  it("should list facility users when isfaciliated with a facilityId", () => {
    employeeService.listUsers.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [{ _id: "res-test-004", ahcccsId: "MRN-TEST-004" }],
      });
    });

    renderWithProviders(
      <MultiPatients
        setValue={vi.fn()}
        value={[]}
        isfaciliated
        facilityId="fac-test-001"
      />,
    );

    // WHY: facility-scoped selection must query users for that specific facility.
    expect(employeeService.listUsers).toHaveBeenCalledTimes(1);
    const callArg = employeeService.listUsers.mock.calls[0][0];
    expect(callArg.queryString).toContain("facilityId=fac-test-001");
    expect(screen.getByText("Name-res-test-004")).toBeInTheDocument();
  });

  it("should render no options when isfaciliated without a facilityId", () => {
    employeeService.listUsers.mockImplementation(({ setResponse }) => {
      setResponse({ data: [{ _id: "res-test-005" }] });
    });

    renderWithProviders(
      <MultiPatients
        setValue={vi.fn()}
        value={[]}
        isfaciliated
        facilityId=""
      />,
    );

    // WHY: without a chosen facility, no patients should be selectable to avoid
    // cross-facility PHI leakage.
    expect(screen.getByTestId("option-count")).toHaveTextContent("0");
  });

  it("should render empty options when the service returns no data", () => {
    patientService.listForSearch.mockImplementation(({ setResponse }) => {
      setResponse({});
    });

    renderWithProviders(<MultiPatients setValue={vi.fn()} value={[]} />);

    // WHY: an empty/loading response must degrade to an empty option list, not
    // crash the search.
    expect(screen.getByTestId("option-count")).toHaveTextContent("0");
  });

  it("should forward a selection to setValue", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    patientService.listForSearch.mockImplementation(({ setResponse }) => {
      setResponse({
        data: { docs: [{ _id: "res-test-001", ahcccsId: "MRN-TEST-001" }] },
      });
    });

    renderWithProviders(<MultiPatients setValue={setValue} value={[]} />);

    await user.click(screen.getByRole("button", { name: /pick first/i }));

    // WHY: picking a patient must propagate the chosen option up to the parent
    // form state.
    expect(setValue).toHaveBeenCalledWith([
      expect.objectContaining({
        value: "res-test-001",
        label: "Name-res-test-001",
      }),
    ]);
  });

  it("should debounce the search query on input change", async () => {
    const user = userEvent.setup();
    patientService.listForSearch.mockImplementation(({ setResponse }) => {
      setResponse({ data: { docs: [] } });
    });

    renderWithProviders(<MultiPatients setValue={vi.fn()} value={[]} />);

    await user.type(screen.getByLabelText("search"), "Test Patient");

    // WHY: typeahead search must be debounced to avoid a request per keystroke.
    expect(debouncedSetQuery).toHaveBeenCalled();
  });

  it("should show selected labels in the override strings", () => {
    patientService.listForSearch.mockImplementation(({ setResponse }) => {
      setResponse({ data: { docs: [] } });
    });

    renderWithProviders(
      <MultiPatients
        setValue={vi.fn()}
        value={[{ value: "res-test-001", label: "Test Patient" }]}
      />,
    );

    // WHY: the collapsed control should summarize the currently selected
    // patients by label.
    expect(screen.getByTestId("selected-label")).toHaveTextContent(
      "Test Patient",
    );
  });
});

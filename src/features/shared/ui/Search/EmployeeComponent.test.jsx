/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import EmployeeComponent from "./EmployeeComponent";

// Stub the SearchEmployees child: it owns the network/search UI, so here we only
// expose the props EmployeeComponent wires into it (isOpen + clickHandler) and
// surface buttons that fire clickHandler with a fake employee record.
vi.mock("./SearchEmployees", () => ({
  default: ({ isOpen, clickHandler, residentName }) => (
    <div data-testid="search-employees">
      <span data-testid="is-open">{String(isOpen)}</span>
      <span data-testid="resident-name-prop">{`prop:${residentName}`}</span>
      <button
        onClick={() =>
          clickHandler({
            _id: "emp-test-001",
            firstName: "Test",
            lastName: "Patient",
          })
        }
      >
        pick named
      </button>
      <button
        onClick={() =>
          clickHandler({ _id: "emp-test-002", fullName: "Full Name" })
        }
      >
        pick fullname
      </button>
    </div>
  ),
}));

describe("EmployeeComponent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the default placeholder when no employee is selected", () => {
    renderWithProviders(<EmployeeComponent />);
    // WHY: until a clinician picks an employee the trigger label must prompt for
    // a selection rather than show a blank name.
    expect(screen.getByText(/Select Employee/i)).toBeInTheDocument();
    expect(screen.getByText(/Employee Name/i)).toBeInTheDocument();
  });

  it("should keep the search panel closed on initial render", () => {
    renderWithProviders(<EmployeeComponent />);
    // WHY: the dropdown only opens on explicit click, so it must start collapsed.
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
  });

  it("should open the search panel when the trigger label is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeeComponent />);

    await user.click(screen.getByText(/Select Employee/i));
    // WHY: clicking the label is the only affordance to reveal the employee
    // search list.
    expect(screen.getByTestId("is-open")).toHaveTextContent("true");
  });

  it("should propagate id and combined name when a first/last-name employee is picked", async () => {
    const user = userEvent.setup();
    const MainPatientId = vi.fn();
    const MainResidentName = vi.fn();
    const setWholeData = vi.fn();
    renderWithProviders(
      <EmployeeComponent
        MainPatientId={MainPatientId}
        MainResidentName={MainResidentName}
        setWholeData={setWholeData}
      />,
    );

    await user.click(screen.getByText(/Select Employee/i));
    await user.click(screen.getByRole("button", { name: /pick named/i }));

    // WHY: selecting an employee must hand the parent the id, a "First Last"
    // display name, and the full record so downstream EHR forms can bind to it.
    expect(MainPatientId).toHaveBeenCalledWith("emp-test-001");
    expect(MainResidentName).toHaveBeenCalledWith("Test Patient");
    expect(setWholeData).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "emp-test-001" }),
    );
    // WHY: the picked name replaces the placeholder on the trigger label.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should use fullName when the employee has no first/last name", async () => {
    const user = userEvent.setup();
    const MainResidentName = vi.fn();
    renderWithProviders(
      <EmployeeComponent MainResidentName={MainResidentName} />,
    );

    await user.click(screen.getByText(/Select Employee/i));
    await user.click(screen.getByRole("button", { name: /pick fullname/i }));

    // WHY: some employee records only carry a single fullName field; the
    // component must fall back to it instead of rendering "undefined undefined".
    expect(MainResidentName).toHaveBeenCalledWith("Full Name");
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("should close the search panel after an employee is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeeComponent />);

    await user.click(screen.getByText(/Select Employee/i));
    expect(screen.getByTestId("is-open")).toHaveTextContent("true");

    await user.click(screen.getByRole("button", { name: /pick named/i }));
    // WHY: picking a result should collapse the dropdown so the user sees their
    // choice instead of a lingering list.
    expect(screen.getByTestId("is-open")).toHaveTextContent("false");
  });

  it("should not throw when selecting without optional callbacks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<EmployeeComponent />);

    await user.click(screen.getByText(/Select Employee/i));
    await user.click(screen.getByRole("button", { name: /pick named/i }));

    // WHY: the callbacks are optional; the component must still update its own
    // label when used standalone.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });
});

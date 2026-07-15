/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@/test-utils";

import SearchEmployees from "./SearchEmployees";
import { employeeService } from "../../services";
import { debouncedSetQuery } from "@/utils/utils";

// framer-motion's animated wrapper is irrelevant to behaviour; render a plain
// div so children are always visible regardless of the isOpen animation.
vi.mock("framer-motion", () => ({
  motion: { div: ({ children, ...rest }) => <div {...rest}>{children}</div> },
}));

// react-infinite-scroll-hook returns a [ref] tuple; the scroll/Intersection
// observer machinery is not under test, so hand back a no-op ref.
vi.mock("react-infinite-scroll-hook", () => ({
  default: () => [vi.fn()],
}));

// Light spinner stub so the loading branch is assertable by an accessible label.
vi.mock("react-spinners", () => ({
  ClipLoader: () => <div role="status" aria-label="loading" />,
}));

// The component imports employeeService from "../../services"; mock so search
// never hits HTTP and we can drive its setResponse/setLoading callbacks.
vi.mock("../../services", () => ({
  employeeService: { search: vi.fn() },
}));

// debouncedSetQuery normally debounces; mock to set the search term synchronously.
vi.mock("@/utils/utils", () => ({
  debouncedSetQuery: vi.fn(({ term, setQuery }) => setQuery(term)),
}));

const makeProps = (overrides = {}) => ({
  isOpen: true,
  clickHandler: vi.fn(),
  setIsOpen: vi.fn(),
  residentName: "Test Patient",
  ...overrides,
});

describe("SearchEmployees", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should call employeeService.search on mount with the default limit", () => {
    render(<SearchEmployees {...makeProps()} />);
    // WHY: the roster must load immediately so the user sees employees to assign.
    expect(employeeService.search).toHaveBeenCalledTimes(1);
    expect(employeeService.search).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 100, search: "" }),
    );
  });

  it("should render the search input with a Search placeholder", () => {
    render(<SearchEmployees {...makeProps()} />);
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("should render the loading spinner while results are loading", () => {
    // Drive the loading flag true via the service's setLoading callback.
    employeeService.search.mockImplementation(({ setLoading }) =>
      setLoading(true),
    );
    render(<SearchEmployees {...makeProps()} />);
    // WHY: a visible spinner tells the clinician the employee list is still fetching.
    expect(screen.getByRole("status", { name: "loading" })).toBeInTheDocument();
  });

  it("should render matching employees by first and last name", () => {
    employeeService.search.mockImplementation(({ setResponse }) =>
      setResponse({
        data: {
          docs: [
            { _id: "emp-test-001", firstName: "Test", lastName: "Employee" },
          ],
          totalDocs: 1,
          hasNextPage: false,
        },
      }),
    );
    render(<SearchEmployees {...makeProps()} />);
    // WHY: employee names drive selection, so first/last name must concatenate.
    expect(screen.getByText("Test Employee")).toBeInTheDocument();
  });

  it("should fall back to fullName when first and last name are absent", () => {
    employeeService.search.mockImplementation(({ setResponse }) =>
      setResponse({
        data: {
          docs: [{ _id: "emp-test-002", fullName: "Test Fullname" }],
          totalDocs: 1,
        },
      }),
    );
    render(<SearchEmployees {...makeProps()} />);
    // WHY: some employee records only carry a combined fullName field.
    expect(screen.getByText("Test Fullname")).toBeInTheDocument();
  });

  it("should show the no-results state when there are no employees", () => {
    employeeService.search.mockImplementation(({ setResponse }) =>
      setResponse({ data: { docs: [], totalDocs: 0 } }),
    );
    render(<SearchEmployees {...makeProps()} />);
    // WHY: an empty roster must signal "No Results Found" rather than a blank list.
    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });

  it("should invoke clickHandler with the employee when a result is clicked", async () => {
    const user = userEvent.setup();
    const employee = {
      _id: "emp-test-003",
      firstName: "Test",
      lastName: "Selectable",
    };
    employeeService.search.mockImplementation(({ setResponse }) =>
      setResponse({
        data: { docs: [employee], totalDocs: 1, hasNextPage: false },
      }),
    );
    const props = makeProps();
    render(<SearchEmployees {...props} />);

    await user.click(screen.getByText("Test Selectable"));
    // WHY: selecting an employee must pass the full record back to the parent.
    expect(props.clickHandler).toHaveBeenCalledWith(employee);
  });

  it("should close the panel when the close icon is clicked", () => {
    const props = makeProps();
    const { container } = render(<SearchEmployees {...props} />);
    fireEvent.click(container.querySelector(".close_btn i"));
    // WHY: the close affordance must collapse the search overlay.
    expect(props.setIsOpen).toHaveBeenCalledWith(false);
  });

  it("should re-run search with the typed term when the user searches", async () => {
    const user = userEvent.setup();
    render(<SearchEmployees {...makeProps()} />);

    await user.type(screen.getByPlaceholderText("Search"), "Test");
    // WHY: typing must update the query and re-fetch the filtered employee list.
    expect(debouncedSetQuery).toHaveBeenCalled();
    expect(employeeService.search).toHaveBeenCalledWith(
      expect.objectContaining({ search: "Test" }),
    );
  });
});

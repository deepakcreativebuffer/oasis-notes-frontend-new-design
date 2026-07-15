/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import MultiEmployee from "./MultiEmployee";
import { employeeService } from "../../services";

// Stub react-multi-select-component: render each option label and a button that
// fires onChange with the first option so we can assert selection forwarding.
vi.mock("react-multi-select-component", () => ({
  MultiSelect: ({ options, onChange, labelledBy }) => (
    <div aria-label={labelledBy}>
      {options?.map((o) => (
        <span key={o.value} data-type={o.type}>
          {o.label}
        </span>
      ))}
      <button onClick={() => onChange([options[0]])}>pick first</button>
    </div>
  ),
}));

// Mock the IO service so the effect never hits the network; capture its args.
vi.mock("../../services", () => ({
  employeeService: { listActive: vi.fn() },
}));

vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (i) => `Name-${i._id}`,
}));

const meState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-me", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-admin", userType: "Admin" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

// Drive the component by resolving its listActive call through setResponse.
function seedResponse(data) {
  employeeService.listActive.mockImplementation(({ setResponse }) => {
    setResponse({ data });
  });
}

const EMPLOYEES = [
  { _id: "emp-1", userType: "Employee", accountType: "regular" },
  { _id: "emp-2", userType: "Employee", accountType: "adminstrator" },
  { _id: "res-1", userType: "Patient", accountType: "regular" },
  { _id: "emp-me", userType: "Employee", accountType: "regular" },
];

describe("MultiEmployee", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should fetch the active employee list on mount", () => {
    seedResponse([]);
    renderWithProviders(<MultiEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: meState,
    });

    // WHY: the employee picker must load the roster once when it opens.
    expect(employeeService.listActive).toHaveBeenCalledTimes(1);
  });

  it("should pass isAdmin=false for a non-admin current user", () => {
    seedResponse([]);
    renderWithProviders(<MultiEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: meState,
    });

    // WHY: a regular employee must not request the admin-scoped roster.
    expect(employeeService.listActive).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: false }),
    );
  });

  it("should pass isAdmin=true when the current user is an Admin", () => {
    seedResponse([]);
    renderWithProviders(<MultiEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: adminState,
    });

    // WHY: admins see the org-wide roster, so the request is admin-scoped.
    expect(employeeService.listActive).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: true }),
    );
  });

  it("should list employees and exclude the current user", () => {
    seedResponse(EMPLOYEES);
    renderWithProviders(<MultiEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: meState,
    });

    expect(screen.getByText("Name-emp-1")).toBeInTheDocument();
    expect(screen.getByText("Name-emp-2")).toBeInTheDocument();
    // WHY: a user can't pick themselves as a co-worker, so they're filtered out.
    expect(screen.queryByText("Name-emp-me")).not.toBeInTheDocument();
  });

  it("should exclude residents by default (employees only)", () => {
    seedResponse(EMPLOYEES);
    renderWithProviders(<MultiEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: meState,
    });

    // WHY: without alsoResident, only staff (userType Employee) are selectable.
    expect(screen.queryByText("Name-res-1")).not.toBeInTheDocument();
  });

  it("should include residents when alsoResident is set", () => {
    seedResponse(EMPLOYEES);
    renderWithProviders(
      <MultiEmployee setValue={vi.fn()} value={[]} alsoResident />,
      { preloadedState: meState },
    );

    // WHY: some flows (e.g. assignments) target both staff and patients.
    expect(screen.getByText("Name-res-1")).toBeInTheDocument();
    expect(screen.getByText("Name-emp-1")).toBeInTheDocument();
  });

  it("should show only residents when onlyResident is set", () => {
    seedResponse(EMPLOYEES);
    renderWithProviders(
      <MultiEmployee setValue={vi.fn()} value={[]} onlyResident alsoResident />,
      { preloadedState: meState },
    );

    // WHY: patient-only pickers must hide staff entirely.
    expect(screen.getByText("Name-res-1")).toBeInTheDocument();
    expect(screen.queryByText("Name-emp-1")).not.toBeInTheDocument();
  });

  it("should restrict to administrator accounts when onlyAdministrator is set", () => {
    seedResponse(EMPLOYEES);
    renderWithProviders(
      <MultiEmployee setValue={vi.fn()} value={[]} onlyAdministrator />,
      { preloadedState: meState },
    );

    // WHY: administrator-only flows must drop regular-account employees.
    expect(screen.getByText("Name-emp-2")).toBeInTheDocument();
    expect(screen.queryByText("Name-emp-1")).not.toBeInTheDocument();
  });

  it("should forward a selection to setValue", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    seedResponse(EMPLOYEES);
    renderWithProviders(<MultiEmployee setValue={setValue} value={[]} />, {
      preloadedState: meState,
    });

    await user.click(screen.getByRole("button", { name: /pick first/i }));
    // WHY: picking an employee must bubble the option up to the parent form.
    expect(setValue).toHaveBeenCalledWith([
      { value: "emp-1", label: "Name-emp-1", type: "Employee" },
    ]);
  });

  it("should render nothing meaningful before the roster resolves", () => {
    // listActive never calls setResponse, so data stays {} and no options exist.
    employeeService.listActive.mockImplementation(() => {});
    renderWithProviders(<MultiEmployee setValue={vi.fn()} value={[]} />, {
      preloadedState: meState,
    });

    // WHY: with no data the options array is empty (truthy []), so the select
    // renders but lists no employees.
    expect(screen.queryByText(/Name-/)).not.toBeInTheDocument();
  });
});

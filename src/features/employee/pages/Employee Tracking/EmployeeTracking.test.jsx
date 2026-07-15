/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import EmployeeTracking from "./EmployeeTracking";

// ---- Hoisted mock handles (vi.mock factories run before module init) ----
const mocks = vi.hoisted(() => ({
  getTracking: vi.fn(),
  create: vi.fn(),
  UploadImage: vi.fn(),
}));

// HOC wraps the page in sidebar/navbar (heavy, irrelevant here). Render the
// inner component directly so we test the form, not the chrome.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

vi.mock("@/features/shared/services", () => ({
  __esModule: true,
  UploadImage: mocks.UploadImage,
  employeeTrackingService: {
    getTracking: mocks.getTracking,
    create: mocks.create,
  },
}));

// Light stub for the employee picker: drives employeeId selection via a button.
vi.mock("@/features/shared/ui/Search/EmployeeComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId, setWholeData, MainResidentName }) => (
    <button
      type="button"
      data-testid="pick-employee"
      onClick={() => {
        MainPatientId("emp-test-001");
        setWholeData({ _id: "emp-test-001" });
        MainResidentName("Test Employee");
      }}
    >
      Select Employee
    </button>
  ),
}));

vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("@/utils/utils", () => ({
  __esModule: true,
  AddSignature: ({ show }) => (
    <div data-testid="add-signature">{show ? "sig-open" : "sig-closed"}</div>
  ),
  formatDateToMMDDYYYY: (v) => v || "",
  signatureFormat: () => <div data-testid="signature-format" />,
}));

vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ placeholderText, onChange }) => (
    <input
      placeholder={placeholderText}
      onChange={(e) => onChange?.(new Date(e.target.value))}
    />
  ),
}));

const stateForRole = (userType, extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test Employee",
      userType,
      hoursFormat: "12",
      ...extra,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("EmployeeTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the tracking form chrome (nav title + signature modal)", () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
    });

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      /Employee Tracking \/ Upload/i,
    );
    // WHY: signature modal starts closed (open=false).
    expect(screen.getByTestId("add-signature")).toHaveTextContent("sig-closed");
  });

  it("fetches tracking data on mount for the current employee", async () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: a logged-in employee loads their own record (isAdmin false, own _id).
    await waitFor(() => expect(mocks.getTracking).toHaveBeenCalled());
    expect(mocks.getTracking).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: false, employeeId: "emp-test-001" }),
    );
  });

  it("shows the upload fields for an Employee role", () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: employees go straight to the upload card (no picker gate).
    expect(screen.getByText("CPR/First Aid")).toBeInTheDocument();
    expect(screen.getByText("APS Search")).toBeInTheDocument();
    expect(
      screen.queryByText(/select an employee first/i),
    ).not.toBeInTheDocument();
  });

  it("gates Admin behind employee selection until one is picked", async () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Admin"),
    });

    // WHY: with no employee chosen, Admin sees the placeholder, not the form.
    expect(screen.getByText(/select an employee first/i)).toBeInTheDocument();
    expect(screen.queryByText("CPR/First Aid")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("pick-employee"));

    await screen.findByText("CPR/First Aid");
  });

  it("re-fetches with the admin flag once an employee is selected", async () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Admin"),
    });

    fireEvent.click(screen.getByTestId("pick-employee"));

    await waitFor(() =>
      expect(mocks.getTracking).toHaveBeenCalledWith(
        expect.objectContaining({ isAdmin: true, employeeId: "emp-test-001" }),
      ),
    );
  });

  it("submits the create payload via the tracking service", async () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
    });

    // The submit button is the only submit-type control in the form.
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => expect(mocks.create).toHaveBeenCalled());
    // WHY: submit posts the current employee's id with the create call.
    expect(mocks.create).toHaveBeenCalledWith(
      expect.objectContaining({ employeeId: "emp-test-001" }),
      expect.objectContaining({ successMsg: "Created !" }),
    );
  });

  it("opens the signature modal when SAVED AND SIGNED is clicked", () => {
    renderWithProviders(<EmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
    });

    fireEvent.click(screen.getByRole("button", { name: /saved and signed/i }));

    expect(screen.getByTestId("add-signature")).toHaveTextContent("sig-open");
  });
});

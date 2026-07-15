/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import CreateMultiEmployeeTracking from "./CreateMultiEmployeeTracking";
import {
  employeeTrackingService,
  updateEmployeeTracking,
  UploadEmployeeTracking,
  ADMIN_APIS,
  EMPLOYEE_APIS,
} from "@/features/shared/services";
import { showNotification } from "@/utils";

// ---------------------------------------------------------------------------
// Mocks — every service/IO + heavy child the source imports. No real HTTP.
// ---------------------------------------------------------------------------

// HOC wraps the page in EmployeeBar/Navbar/Sidebar chrome (heavy, redux+router
// driven). Render the inner component directly so we test the form in isolation.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function HocWrapped() {
      return <Wcomponenet />;
    },
}));

// NavWrapper pulls in InnerSidebars/modals — stub to a title marker.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// EmployeeComponent is an admin-only async employee search picker. Expose the
// setter props so a test can drive an employee selection.
vi.mock("@/features/shared/ui/Search/EmployeeComponent", () => ({
  default: ({ MainPatientId, MainResidentName }) => (
    <button
      type="button"
      data-testid="pick-employee"
      onClick={() => {
        MainPatientId?.("emp-test-001");
        MainResidentName?.("Test Employee");
      }}
    >
      pick-employee
    </button>
  ),
}));

// react-datepicker — jsdom-friendly stub exposing the change handler.
vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="due-date"
      placeholder={placeholderText}
      onChange={(e) => onChange?.(new Date(e.target.value))}
    />
  ),
}));

// Services barrel — all tracking IO + API url builders.
const services = vi.hoisted(() => ({
  employeeTrackingService: { getMultiTracking: vi.fn() },
  updateEmployeeTracking: vi.fn(),
  UploadEmployeeTracking: vi.fn(),
  ADMIN_APIS: {
    ADMIN_ADD_EMPLOYEE_TRACKING: vi.fn(
      (empId) => `admin/add-tracking/${empId}`,
    ),
  },
  EMPLOYEE_APIS: { EMPLOYEE_ADD_EMPLOYEE_TRACKING: "employee/add-tracking" },
}));
vi.mock("@/features/shared/services", () => services);

// File upload hook — controlled return value so tests drive selected file.
const fileUploadState = vi.hoisted(() => ({
  value: { file: null, onSelectFile: vi.fn() },
}));
vi.mock("@shared/hooks", () => ({
  useFileUpload: () => fileUploadState.value,
}));

// utils.jsx helpers used by the date/name display.
vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (u) => u?.name ?? "",
  formatDateToMMDDYYYY: (d) => d ?? "",
}));

// @/utils barrel — only showNotification is used.
vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

const stateForRole = (userType) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "user-test-001", name: "Test User", userType },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("CreateMultiEmployeeTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fileUploadState.value = { file: null, onSelectFile: vi.fn() };
  });

  it("should render the upload form chrome and submit control", () => {
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
      route: "/employee-tracking/create",
    });

    // WHY: the tracking-upload page must surface its title + the core fields
    // (file type, file chooser, due date, submit) for staff to file a record.
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      /Employee Tracking \/ Upload/i,
    );
    expect(screen.getByText("File Name")).toBeInTheDocument();
    expect(screen.getByText("Choose File")).toBeInTheDocument();
    expect(screen.getByText("Due Date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("should NOT show the employee picker for a non-admin (create mode)", () => {
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
      route: "/employee-tracking/create",
    });

    // WHY: employees file tracking against themselves — only admins choose a
    // target employee, so the search picker must stay hidden for staff.
    expect(screen.queryByTestId("pick-employee")).not.toBeInTheDocument();
  });

  it("should show the employee picker for an admin in create mode", () => {
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Admin"),
      route: "/employee-tracking/create",
    });

    expect(screen.getByTestId("pick-employee")).toBeInTheDocument();
  });

  it("should not fetch existing tracking when there is no :id (create mode)", () => {
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
      route: "/employee-tracking/create",
    });

    // WHY: create mode has no record to hydrate — avoid a needless GET.
    expect(employeeTrackingService.getMultiTracking).not.toHaveBeenCalled();
  });

  it("should warn and skip upload when no file is selected on submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
      route: "/employee-tracking/create",
    });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    // WHY: a tracking record is meaningless without its document — block the
    // upload and tell the user, rather than POSTing an empty payload.
    expect(showNotification).toHaveBeenCalledWith({
      message: "Please select a file",
      type: "danger",
    });
    expect(UploadEmployeeTracking).not.toHaveBeenCalled();
  });

  it("should upload via the EMPLOYEE api when a file is selected (no admin target)", async () => {
    const user = userEvent.setup();
    fileUploadState.value = {
      file: new File(["x"], "tb-test.pdf", { type: "application/pdf" }),
      onSelectFile: vi.fn(),
    };
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Employee"),
      route: "/employee-tracking/create",
    });

    await user.click(screen.getByRole("button", { name: /submit/i }));

    // WHY: a self-filing employee posts to the employee endpoint, not the
    // admin-on-behalf-of endpoint.
    expect(UploadEmployeeTracking).toHaveBeenCalledTimes(1);
    expect(UploadEmployeeTracking).toHaveBeenCalledWith(
      expect.objectContaining({
        url: EMPLOYEE_APIS.EMPLOYEE_ADD_EMPLOYEE_TRACKING,
        successMsg: "Uploaded !",
      }),
    );
  });

  it("should upload via the ADMIN api keyed to the chosen employee", async () => {
    const user = userEvent.setup();
    fileUploadState.value = {
      file: new File(["x"], "cpr.pdf", { type: "application/pdf" }),
      onSelectFile: vi.fn(),
    };
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      preloadedState: stateForRole("Admin"),
      route: "/employee-tracking/create",
    });

    // Admin selects a target employee, then submits.
    await user.click(screen.getByTestId("pick-employee"));
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // WHY: an admin filing on behalf of staff routes to the admin endpoint
    // composed with that employee's id.
    expect(ADMIN_APIS.ADMIN_ADD_EMPLOYEE_TRACKING).toHaveBeenCalledWith(
      "emp-test-001",
    );
    expect(UploadEmployeeTracking).toHaveBeenCalledWith(
      expect.objectContaining({ url: "admin/add-tracking/emp-test-001" }),
    );
  });

  it("should fetch existing tracking and use the update flow in edit mode", async () => {
    employeeTrackingService.getMultiTracking.mockImplementation(
      ({ setResponse }) => {
        setResponse?.({
          data: {
            type: "CPR/First Aid",
            dueDate: "06/10/2026",
            userId: { name: "Test Employee" },
          },
        });
      },
    );
    fileUploadState.value = {
      file: new File(["x"], "cpr.pdf", { type: "application/pdf" }),
      onSelectFile: vi.fn(),
    };

    const user = userEvent.setup();
    // Route through a :id param so useParams() exposes the edit id.
    renderWithProviders(
      <Routes>
        <Route
          path="/employee-tracking/edit/:id"
          element={<CreateMultiEmployeeTracking />}
        />
      </Routes>,
      {
        preloadedState: stateForRole("Admin"),
        route: "/employee-tracking/edit/track-test-001",
      },
    );

    // WHY: opening an existing record hydrates it from the server.
    await waitFor(() =>
      expect(employeeTrackingService.getMultiTracking).toHaveBeenCalledWith(
        expect.objectContaining({ id: "track-test-001", isAdmin: true }),
      ),
    );

    await user.click(screen.getByRole("button", { name: /submit/i }));

    // WHY: editing routes through the update service (admin url), not a fresh
    // create upload.
    expect(updateEmployeeTracking).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "admin/update-employee-tracking/track-test-001",
      }),
    );
    expect(UploadEmployeeTracking).not.toHaveBeenCalled();
  });

  it("should mount without crashing when no userProfile/userType is present", () => {
    // Partially hydrated session — empty userProfile.
    renderWithProviders(<CreateMultiEmployeeTracking />, {
      route: "/employee-tracking/create",
    });

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});

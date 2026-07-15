/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import TimeSheet from "./TimeSheet";

// ─── Hoisted mock handles ──────────────────────────────────────────
const h = vi.hoisted(() => ({
  getTimeSheet: vi.fn(),
  updateShiftTime: vi.fn(),
  createTimeSheet: vi.fn(),
  getProfile: vi.fn(),
  getTimeSheetEmployees: vi.fn(),
  useFacilities: vi.fn(() => []),
  showNotification: vi.fn(),
}));

// HOC just renders the wrapped component so we don't pull in the whole
// sidebar/navbar layout (and its socket/router deps).
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  __esModule: true,
  // Real HOC is a HOF returning a component; mirror that so the default
  // export (HOC({ Wcomponenet })) is a renderable component.
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

vi.mock("@/features/shared/services", () => ({
  __esModule: true,
  timesheetService: {
    getTimeSheet: h.getTimeSheet,
    updateShiftTime: h.updateShiftTime,
    createTimeSheet: h.createTimeSheet,
    getProfile: h.getProfile,
    getTimeSheetEmployees: h.getTimeSheetEmployees,
  },
}));

vi.mock("@shared/hooks", () => ({
  __esModule: true,
  useFacilities: h.useFacilities,
}));

vi.mock("@/utils", () => ({
  __esModule: true,
  showNotification: h.showNotification,
}));

// Light stubs for IO/heavy presentational subcomponents.
vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("@/utils/Makers", () => ({
  __esModule: true,
  DefaultInput: ({ value }) => <input readOnly value={value || ""} />,
  BorderlessInput: ({ value, setState, disabled }) => (
    <input
      type="number"
      value={value || ""}
      disabled={disabled}
      onChange={(e) => setState && setState(e.target.value)}
    />
  ),
}));

vi.mock("@/features/shared/ui/Search/EmployeeComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId }) => (
    <button
      type="button"
      data-testid="employee-search"
      onClick={() => MainPatientId && MainPatientId("emp-selected-1")}
    >
      pick-employee
    </button>
  ),
}));

vi.mock("@/features/shared/ui/Search/SignerEmployee.jsx", () => ({
  __esModule: true,
  default: ({ setValue }) => (
    <button
      type="button"
      data-testid="signer-select"
      onClick={() =>
        setValue && setValue({ value: "sig-1", label: "Jane Signer" })
      }
    >
      pick-signer
    </button>
  ),
}));

vi.mock("@/features/shared/ui/TimePicker/CustomTimePicker.jsx", () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <input
      data-testid="time-picker"
      onChange={(e) => onChange && onChange(e, e.target.value)}
    />
  ),
}));

// ─── Helpers ──────────────────────────────────────────────────────
const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "admin-1", userType: "Admin", hoursFormat: "12" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-1", userType: "Employee", hoursFormat: "12" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const scheduleFixture = {
  data: {
    regularHours: 40,
    overtimeHours: 5,
    week1TotalHr: 20,
    week2TotalHr: 20,
    paycheckTotalHr: 1000,
    scheduleData: [
      {
        date: "2026-06-01",
        weekday: "Monday",
        totalTime: "8h",
        work: [
          {
            type: "regular",
            start: "2026-06-01T09:00:00Z",
            end: "2026-06-01T17:00:00Z",
            clockIn: "2026-06-01T09:05:00Z",
            clockOut: "2026-06-01T17:02:00Z",
            timeTaken: "8h",
            shiftId: "shift-1",
            staffScheduleId: "ssid-1",
          },
        ],
      },
    ],
    findStaffScheduleSigner: { employeeSignature: "", signers: [] },
  },
};

describe("TimeSheet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.useFacilities.mockReturnValue([{ _id: "fac-1", name: "Sunrise Care" }]);
    // getProfile populates employeeProfile.data so the facility handler can
    // resolve an employee id and fire the timesheet fetch.
    h.getProfile.mockImplementation(({ setResponse }) => {
      setResponse &&
        setResponse({
          data: {
            _id: "emp-prof-1",
            firstName: "Pat",
            lastName: "Doe",
            fullName: "Pat Doe",
          },
        });
    });
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  it("renders the timesheet shell with the nav title and office-use section", () => {
    renderWithProviders(<TimeSheet />, { preloadedState: employeeState });
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent("Time Sheet");
    expect(screen.getByText("Office Use Only")).toBeInTheDocument();
    // WHY: with no facility selected the empty-state message is shown.
    expect(
      screen.getByText(/No Data Found Select Facility/i),
    ).toBeInTheDocument();
  });

  it("loads the employee profile on mount", () => {
    renderWithProviders(<TimeSheet />, { preloadedState: employeeState });
    expect(h.getProfile).toHaveBeenCalledTimes(1);
    expect(h.getProfile).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: false }),
    );
  });

  it("renders the facility options from useFacilities", () => {
    renderWithProviders(<TimeSheet />, { preloadedState: employeeState });
    const options = screen.getAllByRole("option");
    expect(options.some((o) => o.textContent === "Sunrise Care")).toBe(true);
  });

  it("shows the employee-search picker for Admin users", () => {
    renderWithProviders(<TimeSheet />, { preloadedState: adminState });
    expect(screen.getByTestId("employee-search")).toBeInTheDocument();
    // WHY: Admin getProfile is invoked with isAdmin true.
    expect(h.getProfile).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: true }),
    );
  });

  it("warns the Admin to select an employee before choosing a facility", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TimeSheet />, { preloadedState: adminState });
    // Pick an employee first to enable the (otherwise disabled) facility select.
    await user.click(screen.getByTestId("employee-search"));
    // Facility select is the combobox.
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "fac-1");
    // WHY: handleSelect fires getTimeSheet for the chosen facility.
    await waitFor(() => expect(h.getTimeSheet).toHaveBeenCalled());
  });

  it("fetches the timesheet when an employee selects a facility", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TimeSheet />, { preloadedState: employeeState });
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "fac-1");
    await waitFor(() =>
      expect(h.getTimeSheet).toHaveBeenCalledWith(
        expect.objectContaining({ facilityId: "fac-1", isAdmin: false }),
      ),
    );
  });

  it("renders schedule rows and totals once data resolves", async () => {
    // getTimeSheet drives state via setResponse callback.
    h.getTimeSheet.mockImplementation(({ setResponse }) => {
      setResponse(scheduleFixture);
    });
    const user = userEvent.setup();
    renderWithProviders(<TimeSheet />, { preloadedState: employeeState });
    await user.selectOptions(screen.getByRole("combobox"), "fac-1");

    await screen.findByText("Monday");
    expect(screen.getByText(/WEEK 1 Total Hours/)).toHaveTextContent("20");
    expect(screen.getByText(/PAYCHECK Total Hours/)).toHaveTextContent("1000");
  });
});

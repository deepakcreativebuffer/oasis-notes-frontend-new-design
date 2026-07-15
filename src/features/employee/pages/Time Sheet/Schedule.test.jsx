/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import Schedule from "./Schedule";

// ── Hoisted mock fns so vi.mock factories can reference them safely ──
const h = vi.hoisted(() => ({
  getShiftsByFacility: vi.fn(),
  getStaffScheduleByEmployee: vi.fn(),
  showNotification: vi.fn(),
  PrintThis: vi.fn(),
  usePrint: vi.fn(() => vi.fn()),
  useFacilities: vi.fn(() => []),
}));

// HOC just renders the wrapped component so we test Schedule in isolation.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

vi.mock("@/features/shared/services", () => ({
  timesheetService: {
    getShiftsByFacility: h.getShiftsByFacility,
    getStaffScheduleByEmployee: h.getStaffScheduleByEmployee,
  },
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));

vi.mock("@/utils/utils", () => ({
  convertTimeFormat: (t) => String(t ?? ""),
}));

vi.mock("@shared/hooks", () => ({
  usePrint: h.usePrint,
  useFacilities: h.useFacilities,
}));

vi.mock("@/utils", () => ({
  PrintThis: h.PrintThis,
  showNotification: h.showNotification,
}));

// Loader stub for an easy assertion target.
vi.mock("@/features/shared/ui/Loader/Loader", () => ({
  default: () => <div data-testid="loader">loading...</div>,
}));

const FACILITIES = [
  { _id: "fac-1", name: "Maple House" },
  { _id: "fac-2", name: "Oak House" },
];

const PROFILE = {
  _id: "emp-001",
  userType: "Employee",
  totalShiftCount: 7,
  hoursFormat: "12",
};

const preloaded = {
  auth: {
    isAuthenticated: true,
    userProfile: PROFILE,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  h.useFacilities.mockReturnValue(FACILITIES);
  h.usePrint.mockReturnValue(vi.fn());
});

describe("Schedule", () => {
  it("renders the heading and the total shift count from the profile", () => {
    renderWithProviders(<Schedule />, { preloadedState: preloaded });

    expect(screen.getAllByText("Staff Schedule").length).toBeGreaterThan(0);
    // WHY: totalShiftCount comes straight off the redux user profile.
    expect(screen.getByText(/Total Shifts:/i)).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("populates the facility dropdown from useFacilities", () => {
    renderWithProviders(<Schedule />, { preloadedState: preloaded });

    expect(
      screen.getByRole("option", { name: "Maple House" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Oak House" }),
    ).toBeInTheDocument();
  });

  it("shows the select-facility empty state before a facility is chosen", () => {
    renderWithProviders(<Schedule />, { preloadedState: preloaded });

    expect(screen.getByText(/Please Select Facility/i)).toBeInTheDocument();
  });

  it("requests shifts and staff schedule for the chosen facility", async () => {
    renderWithProviders(<Schedule />, { preloadedState: preloaded });

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "fac-1" } });

    await waitFor(() => {
      expect(h.getShiftsByFacility).toHaveBeenCalled();
    });
    // WHY: selecting a facility triggers both the shifts and schedule fetches.
    expect(h.getShiftsByFacility).toHaveBeenCalledWith(
      expect.objectContaining({ facilityId: "fac-1" }),
    );
    expect(h.getStaffScheduleByEmployee).toHaveBeenCalledWith(
      expect.objectContaining({ employeeId: "emp-001", facilityId: "fac-1" }),
    );
  });

  it("renders the schedule table and PRINT button when data and shifts exist", async () => {
    // Drive both service callbacks to feed data/shift state.
    h.getShiftsByFacility.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [{ _id: "s1", start: "09:00", end: "17:00", type: "day" }],
      });
    });
    h.getStaffScheduleByEmployee.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [
          {
            currentDate: 1,
            schedule: [
              {
                shiftId: { _id: "s1" },
                employeeId: [{ firstName: "Jane" }],
              },
            ],
          },
        ],
        administratorData: {
          administratorAndNumber: "Admin 111",
          registeredNurseAndNumber: "RN 222",
          bhtNameAndNumber: "BHT 333",
        },
      });
    });

    renderWithProviders(<Schedule />, { preloadedState: preloaded });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "fac-1" },
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /PRINT REPORT/i }),
      ).toBeInTheDocument();
    });
    // WHY: footer admin contact info is rendered alongside the table.
    expect(screen.getByText(/Admin 111/)).toBeInTheDocument();
    // WHY: sortedData (which drives the cell names) is populated by an 800ms
    // debounced effect, so the employee name appears slightly after the table.
    await screen.findByText(/Jane/, {
      timeout: 2000,
    });
  });

  it("invokes the print handler when PRINT REPORT is clicked", async () => {
    const printFn = vi.fn();
    h.usePrint.mockReturnValue(printFn);
    h.getShiftsByFacility.mockImplementation(({ setResponse }) => {
      setResponse({ data: [{ _id: "s1", start: "09:00", end: "17:00" }] });
    });
    h.getStaffScheduleByEmployee.mockImplementation(({ setResponse }) => {
      setResponse({ data: [{ currentDate: 1, schedule: [] }] });
    });

    renderWithProviders(<Schedule />, { preloadedState: preloaded });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "fac-1" },
    });

    const btn = await screen.findByRole("button", { name: /PRINT REPORT/i });
    fireEvent.click(btn);
    expect(printFn).toHaveBeenCalled();
  });

  it("shows 'Shift Is Not Assigned!' when a facility has schedule data but no shifts", async () => {
    h.getShiftsByFacility.mockImplementation(({ setResponse }) => {
      setResponse({ data: [] });
    });
    h.getStaffScheduleByEmployee.mockImplementation(({ setResponse }) => {
      setResponse({ data: [{ currentDate: 1, schedule: [] }] });
    });

    renderWithProviders(<Schedule />, { preloadedState: preloaded });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "fac-1" },
    });

    expect(
      await screen.findByText(/Shift Is Not Assigned!/i),
    ).toBeInTheDocument();
  });

  it("notifies when no schedule data is returned", async () => {
    h.getStaffScheduleByEmployee.mockImplementation(({ setResponse }) => {
      setResponse({ data: [] });
    });

    renderWithProviders(<Schedule />, { preloadedState: preloaded });

    // WHY: the debounced effect surfaces an info toast when there is no data.
    await waitFor(
      () => {
        expect(h.showNotification).toHaveBeenCalledWith(
          expect.objectContaining({ message: "No Data Found", type: "info" }),
        );
      },
      { timeout: 2000 },
    );
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import TimeSheetView from "./TimeSheetView";

// ─── Hoisted mock refs (vi.mock factories run before module init) ──────────
const h = vi.hoisted(() => ({
  timesheetService: {
    getProfile: vi.fn(),
    getTimeSheetView: vi.fn(),
    signTimeSheet: vi.fn(),
    updateShiftEntry: vi.fn(),
  },
  logger: { error: vi.fn() },
}));

// Service layer: never hit real HTTP.
vi.mock("@/features/shared/services", () => ({
  timesheetService: h.timesheetService,
}));

// logger lives behind the @/utils barrel.
vi.mock("@/utils", () => ({ logger: h.logger }));

// utils.jsx: signature widgets — light stubs exposing only asserted bits.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) =>
    show ? <div data-testid="add-signature">add-signature</div> : null,
  signatureFormat: ({ sign }) => (
    <span data-testid="sig-format">{sign ? "has-sign" : "no-sign"}</span>
  ),
}));

// Form input makers.
vi.mock("@/utils/Makers", () => ({
  DefaultInput: ({ value }) => <div data-testid="default-input">{value}</div>,
  BorderlessInput: ({ value }) => (
    <input data-testid="borderless-input" readOnly value={value ?? ""} />
  ),
}));

// NavWrapper: page chrome.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// HOC just renders the wrapped component for the test.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// SignerEmployee select — isolate from its own service IO.
vi.mock("@/features/shared/ui/Search/SignerEmployee.jsx", () => ({
  default: () => <div data-testid="signer-employee" />,
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

const adminState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-001", userType: "Admin", hoursFormat: "12" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("TimeSheetView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page chrome and 'No Data Found' when there is no schedule", () => {
    renderWithProviders(<TimeSheetView />, {
      preloadedState: adminState,
      route: "/timesheet",
    });

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent("Time Sheet");
    expect(screen.getByText("Office Use Only")).toBeInTheDocument();
    // WHY: empty data.data?.scheduleData falls through to the empty branch.
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("fetches the profile for an admin on mount (no employeeId route param)", () => {
    renderWithProviders(<TimeSheetView />, {
      preloadedState: adminState,
      route: "/timesheet",
    });

    // WHY: with no employeeId param, getProfile is called and flagged isAdmin.
    expect(h.timesheetService.getProfile).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: true }),
    );
  });

  it("renders schedule rows and totals when the service returns data", async () => {
    // getProfile must resolve an _id so the fetch effect fires getTimeSheetView.
    h.timesheetService.getProfile.mockImplementation(({ setResponse }) => {
      setResponse({ data: { _id: "emp-001" } });
    });
    // getTimeSheetView writes into setResponse with a populated payload.
    h.timesheetService.getTimeSheetView.mockImplementation(
      ({ setResponse }) => {
        setResponse({
          data: {
            employeeName: "Fake Employee",
            regularHours: 40,
            overtimeHours: 2,
            week1TotalHr: 40,
            week2TotalHr: 0,
            paycheckTotalHr: 40,
            signers: [],
            employeeSignature: [],
            scheduleData: [
              {
                weekday: "Monday",
                date: "2026-06-08",
                totalTime: "8",
                work: [
                  {
                    type: "regular",
                    start: "09:00",
                    end: "17:00",
                    clockIn: "09:00",
                    clockOut: "17:00",
                    timeTaken: "8",
                    shiftId: "shift-1",
                    staffScheduleId: "sched-1",
                  },
                ],
              },
            ],
          },
        });
      },
    );

    renderWithProviders(<TimeSheetView />, {
      preloadedState: adminState,
      route: "/timesheet",
    });

    await screen.findByText("Monday");
    // WHY: schedule branch renders the table with the shift window and totals.
    expect(screen.getByText("2026-06-08")).toBeInTheDocument();
    expect(screen.getByText(/WEEK 1 Total Hours/)).toHaveTextContent("40");
    expect(screen.getByText(/PAYCHECK Total Hours/)).toHaveTextContent("40");
    expect(screen.getByTestId("default-input")).toHaveTextContent(
      "Fake Employee",
    );
  });

  it("opens the signature modal when SAVED AND SIGNED is clicked", () => {
    renderWithProviders(<TimeSheetView />, {
      preloadedState: adminState,
      route: "/timesheet",
    });

    // No signature yet -> the sign button is shown for the (non-employeeId) view.
    const signButtons = screen.getAllByRole("button", {
      name: /SAVED AND SIGNED/i,
    });
    expect(signButtons.length).toBeGreaterThan(0);
    expect(screen.queryByTestId("add-signature")).not.toBeInTheDocument();

    fireEvent.click(signButtons[0]);

    // WHY: clicking toggles `open`, which renders the AddSignature modal.
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
  });

  it("submits the timesheet via the service when SUBMIT is clicked", () => {
    renderWithProviders(<TimeSheetView />, {
      preloadedState: adminState,
      route: "/timesheet",
    });

    fireEvent.click(screen.getByRole("button", { name: "SUBMIT" }));

    // WHY: submitHandler forwards to signTimeSheet, passing a { signers } body.
    expect(h.timesheetService.signTimeSheet).toHaveBeenCalledTimes(1);
    expect(h.timesheetService.signTimeSheet.mock.calls[0][1]).toHaveProperty(
      "signers",
    );
  });
});

/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  renderWithProviders,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@/test-utils";
import userEvent from "@testing-library/user-event";

import ActivitySchedule from "./ActivityScheduleEmployeePage";

// ── Hoisted mocks for service/IO modules so we can assert calls ─────────────
const h = vi.hoisted(() => ({
  adminSchedulingService: {
    getAllActivityShifts: vi.fn(),
    addStaffScheduleAdministrator: vi.fn(),
    addShift: vi.fn(),
    addActivityShift: vi.fn(),
  },
  employeeShiftsService: {
    getActivityScheduleForEmployee: vi.fn(),
    addEmployeeActivitySchedule: vi.fn(),
    getActivityScheduleDetails: vi.fn(),
    deleteActivityShiftById: vi.fn(),
  },
  showNotification: vi.fn(),
  logger: { error: vi.fn() },
  useFacilities: vi.fn(),
  usePrint: vi.fn(() => () => {}),
}));

// HOC just renders the wrapped component so this test isolates the page itself
// (not the sidebar/navbar chrome, which has its own coverage).
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// Light stub for the multi-select: render selected labels + expose an onChange
// trigger so the SelectBox -> handleEmployeeChange2 path is reachable.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelect", () => ({
  default: ({ options = [], selected = [], onChange }) => (
    <div data-testid="custom-multi-select">
      <span data-testid="selected-count">{(selected || []).length}</span>
      <button
        type="button"
        data-testid="pick-first"
        onClick={() => onChange([options[0]])}
      >
        pick
      </button>
    </div>
  ),
}));

vi.mock("@/features/shared/services/index", () => ({
  adminSchedulingService: h.adminSchedulingService,
  employeeShiftsService: h.employeeShiftsService,
}));

vi.mock("@/utils", () => ({
  showNotification: h.showNotification,
  logger: h.logger,
}));

vi.mock("@shared/hooks", () => ({
  useFacilities: h.useFacilities,
  usePrint: h.usePrint,
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => () => {},
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));

const FACILITIES = [
  { _id: "fac-1", name: "Sunrise House" },
  { _id: "fac-2", name: "Maple Lodge" },
];

const preloadedState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-001", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const renderPage = () =>
  renderWithProviders(<ActivitySchedule />, { preloadedState });

beforeEach(() => {
  vi.clearAllMocks();
  // jsdom has no canvas 2d context.
  HTMLCanvasElement.prototype.getContext = vi.fn();
  h.useFacilities.mockReturnValue(FACILITIES);
  h.usePrint.mockReturnValue(() => {});
  h.adminSchedulingService.getAllActivityShifts.mockResolvedValue({
    success: true,
    data: [],
  });
  h.employeeShiftsService.getActivityScheduleForEmployee.mockResolvedValue({
    success: true,
    data: [],
  });
  h.employeeShiftsService.getActivityScheduleDetails.mockResolvedValue({
    success: true,
    data: {},
  });
  h.employeeShiftsService.addEmployeeActivitySchedule.mockResolvedValue({
    success: true,
  });
});

describe("ActivityScheduleEmployeePage", () => {
  it("shows the empty-state prompt and facility options before a facility is picked", () => {
    renderPage();

    // WHY: with no facility selected the page must guide the user to choose one
    // rather than render an empty/blank schedule grid.
    expect(
      screen.getByText(/No Activity Schedule Found! Please Select Facility/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Activity Schedule")).toBeInTheDocument();

    // Facility options come from the mocked useFacilities hook.
    expect(
      screen.getByRole("option", { name: "Sunrise House" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Maple Lodge" }),
    ).toBeInTheDocument();
  });

  it("loads shifts + assignments and renders the schedule grid after selecting a facility", async () => {
    renderPage();

    const select = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(select, { target: { value: "fac-1" } });
    });

    // WHY: selecting a facility must trigger the initial data fetches so the
    // schedule reflects the chosen site.
    await waitFor(() => {
      expect(h.adminSchedulingService.getAllActivityShifts).toHaveBeenCalled();
    });
    expect(
      h.employeeShiftsService.getActivityScheduleForEmployee,
    ).toHaveBeenCalledWith(expect.objectContaining({ facility_id: "fac-1" }));

    // Grid + print button replace the empty-state card.
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Print Report/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(/No Activity Schedule Found/i),
    ).not.toBeInTheDocument();
    // The weekday header is rendered by the schedule table.
    expect(screen.getAllByText("Sun").length).toBeGreaterThan(0);
  });

  it("notifies and stops when the assignment fetch reports failure", async () => {
    h.employeeShiftsService.getActivityScheduleForEmployee.mockResolvedValue({
      success: false,
      message: "boom",
      type: "danger",
    });

    renderPage();
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "fac-1" },
      });
    });

    // WHY: a failed fetch should surface a notification rather than silently
    // rendering a stale/empty grid.
    await waitFor(() => {
      expect(h.showNotification).toHaveBeenCalledWith(
        expect.objectContaining({ success: false }),
      );
    });
  });

  it("forwards the selected activity to addEmployeeActivitySchedule when a cell changes", async () => {
    h.employeeShiftsService.getActivityScheduleForEmployee.mockResolvedValue({
      success: true,
      data: [],
    });
    renderPage();

    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "fac-1" },
      });
    });

    await waitFor(() => {
      expect(screen.getAllByTestId("pick-first").length).toBeGreaterThan(0);
    });

    await act(async () => {
      fireEvent.click(screen.getAllByTestId("pick-first")[0]);
    });

    // WHY: choosing an activity in a day cell must persist via the service with
    // the activity value carried in `data`.
    await waitFor(() => {
      expect(
        h.employeeShiftsService.addEmployeeActivitySchedule,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          data: ["Board Games/Arts and Craft"],
        }),
      );
    });
  });

  it("navigates months and refetches assignments via the next-month control", async () => {
    renderPage();
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "fac-1" },
      });
    });
    await waitFor(() =>
      expect(
        h.employeeShiftsService.getActivityScheduleForEmployee,
      ).toHaveBeenCalled(),
    );

    const callsBefore =
      h.employeeShiftsService.getActivityScheduleForEmployee.mock.calls.length;

    // The month nav caret has no accessible name; reach it via the DOM. The
    // ".monthOnLast" container holds the prev/next carets around the label.
    const caretRight = document.querySelector(".monthOnLast .fa-caret-right");
    expect(caretRight).toBeTruthy();

    await act(async () => {
      fireEvent.click(caretRight);
    });

    // WHY: stepping to the next month must refetch the schedule for the new
    // period.
    await waitFor(() => {
      expect(
        h.employeeShiftsService.getActivityScheduleForEmployee.mock.calls
          .length,
      ).toBeGreaterThan(callsBefore);
    });
  });
});

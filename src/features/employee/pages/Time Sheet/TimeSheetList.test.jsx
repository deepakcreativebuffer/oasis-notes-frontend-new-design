/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import TimeSheetList from "./TimeSheetList";

// ─── Hoisted mocks ─────────────────────────────────────────────────
const h = vi.hoisted(() => ({
  listEmployeesTimeSheets: vi.fn(),
}));

// Mock the shared services barrel: TimeSheetList only consumes
// timesheetService.listEmployeesTimeSheets from it.
vi.mock("@/features/shared/services", () => ({
  timesheetService: {
    listEmployeesTimeSheets: h.listEmployeesTimeSheets,
  },
}));

// Light stub for the HOC wrapper so we can exercise the inner page without
// the Sidebar/Navbar shell. HOC({ Wcomponenet }) returns a component that
// renders Wcomponenet — preserve that contract.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function MockedHOC() {
      return <Wcomponenet />;
    },
}));

// Light stub for CreateNav — assert it receives the timesheet title.
vi.mock("@/utils/CreateNav", () => ({
  default: ({ title, isTimesheet }) => (
    <div data-testid="create-nav" data-istimesheet={String(isTimesheet)}>
      {title}
    </div>
  ),
}));

describe("TimeSheetList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches employee timesheets on mount with loading/response setters", () => {
    renderWithProviders(<TimeSheetList />);

    // WHY: the page kicks off a single list request on mount, passing the
    // setLoading + setResponse state setters the service drives.
    expect(h.listEmployeesTimeSheets).toHaveBeenCalledTimes(1);
    const arg = h.listEmployeesTimeSheets.mock.calls[0][0];
    expect(typeof arg.setLoading).toBe("function");
    expect(typeof arg.setResponse).toBe("function");
  });

  it("renders the timesheet nav header and table column titles", () => {
    h.listEmployeesTimeSheets.mockImplementation(() => {});
    renderWithProviders(<TimeSheetList />);

    const nav = screen.getByTestId("create-nav");
    expect(nav).toHaveTextContent("Time Sheet");
    expect(nav).toHaveAttribute("data-istimesheet", "true");
  });

  it("renders a table row per timesheet using fullName when present", async () => {
    // Drive setResponse with a fake list payload.
    h.listEmployeesTimeSheets.mockImplementation(({ setResponse }) => {
      setResponse({
        data: [
          { _id: "ts-1", employeeId: { fullName: "Jordan Fake" } },
          {
            _id: "ts-2",
            employeeId: { firstName: "Casey", lastName: "Stub" },
          },
        ],
      });
    });

    renderWithProviders(<TimeSheetList />);

    // WHY: fullName wins when present; otherwise first+last are concatenated.
    expect(await screen.findByText("Jordan Fake")).toBeInTheDocument();
    expect(screen.getByText("Casey Stub")).toBeInTheDocument();

    // Each row exposes a "View ID" link pointing at the timesheet detail route.
    const links = screen.getAllByRole("link", { name: "View ID" });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/time-sheet/ts-1");
    expect(links[1]).toHaveAttribute("href", "/time-sheet/ts-2");
  });

  it("renders the empty state when the response has no rows", async () => {
    h.listEmployeesTimeSheets.mockImplementation(({ setResponse }) => {
      setResponse({ data: [] });
    });

    renderWithProviders(<TimeSheetList />);

    // No table rows => the View ID links never appear.
    await waitFor(() => expect(h.listEmployeesTimeSheets).toHaveBeenCalled());
    expect(screen.queryByRole("link", { name: "View ID" })).toBeNull();
  });

  it("stays resilient when response data is missing/non-array", async () => {
    h.listEmployeesTimeSheets.mockImplementation(({ setResponse }) => {
      setResponse({ data: undefined });
    });

    // WHY: Array.isArray guard prevents a crash on malformed payloads.
    expect(() => renderWithProviders(<TimeSheetList />)).not.toThrow();
    expect(screen.queryByRole("link", { name: "View ID" })).toBeNull();
  });

  it("shows the loader while the service reports loading", () => {
    h.listEmployeesTimeSheets.mockImplementation(({ setLoading }) => {
      setLoading(true);
    });

    renderWithProviders(<TimeSheetList />);

    // While loading is true the table body/empty-state are not rendered.
    expect(screen.queryByRole("link", { name: "View ID" })).toBeNull();
  });
});

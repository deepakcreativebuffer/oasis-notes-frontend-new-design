/** @format */

import { renderWithProviders, screen } from "@/test-utils";
import ActivityScheduleByUser from "./ActivityScheduleRouter";

// Stub both destination pages so the test asserts only the routing branch,
// not the heavy page subtrees / their service IO.
vi.mock("./ActivityScheduleEmployeePage", () => ({
  default: () => <div data-testid="employee-page">Employee Page</div>,
}));
vi.mock("@/features/admin/pages/Scheduling/ActivityScheduleAdminPage", () => ({
  default: () => <div data-testid="admin-page">Admin Page</div>,
}));

const renderWithProfile = (userProfile) =>
  renderWithProviders(<ActivityScheduleByUser />, {
    preloadedState: { auth: { userProfile } },
  });

describe("ActivityScheduleByUser router", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the employee page for a restricted Employee", () => {
    renderWithProfile({ userType: "Employee", accountType: "restricted" });

    expect(screen.getByTestId("employee-page")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-page")).not.toBeInTheDocument();
  });

  it("renders the admin page for a non-restricted Employee", () => {
    // WHY: userType matches but accountType does not -> admin branch
    renderWithProfile({ userType: "Employee", accountType: "full" });

    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-page")).not.toBeInTheDocument();
  });

  it("renders the admin page for an Admin user", () => {
    renderWithProfile({ userType: "Admin", accountType: "restricted" });

    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-page")).not.toBeInTheDocument();
  });

  it("renders the admin page when profile fields are missing", () => {
    // WHY: empty userProfile must not crash; falls through to admin branch
    renderWithProfile({});

    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
  });
});

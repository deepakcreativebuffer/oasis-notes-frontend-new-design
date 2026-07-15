/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import HOC from "./HOC";

// Stub the heavy sidebar/navbar children so this test isolates the HOC's
// layout + role-based sidebar selection logic (which sidebar, whether the
// navbar renders) without pulling in their data-fetching/icon imports.
vi.mock("./EmployeeSidebar", () => ({
  default: () => <div data-testid="employee-sidebar">EmployeeSidebar</div>,
}));
vi.mock("./ResidentSidebar", () => ({
  default: () => <div data-testid="resident-sidebar">ResidentSidebar</div>,
}));
vi.mock("../Outer/Navbar/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Seeds auth.userProfile so the HOC's useSelector(userProfile) resolves a role
// without dispatching a real login. Fake PHI only.
const stateForRole = (userType) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", name: "Test User", userType },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const Wrapped = () => <div data-testid="wrapped">Wrapped content</div>;

describe("HOC", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the wrapped component, navbar and an employee sidebar by default", () => {
    const Composed = HOC({ Wcomponenet: Wrapped });
    renderWithProviders(<Composed />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: the protected page content must mount inside the chrome so staff see
    // their actual screen, not just the shell.
    expect(screen.getByTestId("wrapped")).toBeInTheDocument();
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("employee-sidebar")).toBeInTheDocument();
    expect(screen.queryByTestId("resident-sidebar")).not.toBeInTheDocument();
  });

  it("should hide the navbar when isNavbar is false", () => {
    const Composed = HOC({ Wcomponenet: Wrapped, isNavbar: false });
    renderWithProviders(<Composed />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: some embedded/full-screen EHR views opt out of the top navbar; the
    // wrapped content must still render.
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
    expect(screen.getByTestId("wrapped")).toBeInTheDocument();
  });

  it("should show the resident sidebar for an Admin on a resident route", () => {
    const Composed = HOC({ Wcomponenet: Wrapped });
    renderWithProviders(<Composed />, {
      preloadedState: stateForRole("Admin"),
      route: "/vitals",
    });

    // WHY: when an admin drills into a resident's chart the sidebar must switch
    // to the resident-specific navigation, not the global admin menu.
    expect(screen.getByTestId("resident-sidebar")).toBeInTheDocument();
    expect(screen.queryByTestId("employee-sidebar")).not.toBeInTheDocument();
  });

  it("should keep the employee sidebar for an Admin off a resident route", () => {
    const Composed = HOC({ Wcomponenet: Wrapped });
    renderWithProviders(<Composed />, {
      preloadedState: stateForRole("Admin"),
      route: "/dashboard/homepage",
    });

    // WHY: outside a resident chart the admin sees the standard sidebar.
    expect(screen.getByTestId("employee-sidebar")).toBeInTheDocument();
    expect(screen.queryByTestId("resident-sidebar")).not.toBeInTheDocument();
  });

  it("should render the employee sidebar (not resident) for a Guardian even on a resident route", () => {
    const Composed = HOC({ Wcomponenet: Wrapped });
    renderWithProviders(<Composed />, {
      preloadedState: stateForRole("Guardian"),
      route: "/vitals",
    });

    // WHY: the resident-sidebar swap is gated on the ADMIN role; non-admins keep
    // the employee sidebar regardless of route.
    expect(screen.getByTestId("employee-sidebar")).toBeInTheDocument();
    expect(screen.queryByTestId("resident-sidebar")).not.toBeInTheDocument();
  });
});

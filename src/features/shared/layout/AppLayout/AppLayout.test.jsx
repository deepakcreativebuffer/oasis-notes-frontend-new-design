/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";

// AppLayout is a persistent shell. We mock the heavy Navbar/Sidebar children so
// the test focuses on AppLayout's own behaviour: role-driven nav items, the
// loading overlay, and rendering children vs the router <Outlet/>.

vi.mock("../Outer/Navbar/Navbar", () => ({
  default: ({ routesMob }) => (
    // Expose the computed nav item count so role-based wiring is assertable.
    <nav aria-label="navbar" data-nav-count={routesMob?.length ?? 0}>
      Navbar
    </nav>
  ),
}));

vi.mock("../Outer/Sidebar", () => ({
  default: () => <aside aria-label="sidebar">Sidebar</aside>,
}));

vi.mock("../../ui/Loader/Loader", () => ({
  default: () => <div role="status">Loading</div>,
}));

// Seed auth.userProfile so useSelector(userProfile) resolves a role. Fake PHI.
const stateForProfile = (userProfile) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const navCount = () =>
  Number(screen.getByLabelText("navbar").getAttribute("data-nav-count"));

describe("AppLayout", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("shell rendering", () => {
    it("should always mount the sidebar and navbar shell", () => {
      renderWithProviders(<AppLayout />);

      // WHY: the shell renders once and must never unmount during navigation,
      // so both chrome elements are present even with an empty profile.
      expect(screen.getByLabelText("sidebar")).toBeInTheDocument();
      expect(screen.getByLabelText("navbar")).toBeInTheDocument();
    });

    it("should render explicit children inside the content area", () => {
      renderWithProviders(
        <AppLayout>
          <div>Route Content</div>
        </AppLayout>,
      );

      expect(screen.getByText("Route Content")).toBeInTheDocument();
    });

    it("should render the router Outlet when no children are provided", () => {
      // WHY: authenticated routes nest under AppLayout and rely on <Outlet/>
      // to swap page content while the shell stays mounted.
      renderWithProviders(
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<div>Outlet Page</div>} />
          </Route>
        </Routes>,
      );

      expect(screen.getByText("Outlet Page")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should show the loader overlay when loading is true", () => {
      renderWithProviders(<AppLayout loading={true} />);

      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("should not show the loader when loading is false (default)", () => {
      renderWithProviders(<AppLayout />);

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("role-based nav items", () => {
    it("should give an Admin nav items including the admin sidebar", () => {
      renderWithProviders(<AppLayout />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
      });

      // WHY: admins get the AdminSidebar set passed to the mobile navbar.
      expect(navCount()).toBeGreaterThan(0);
    });

    it("should add the Notes Library item for Growth-tier admins", () => {
      const { rerender } = renderWithProviders(<AppLayout />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
      });
      const baseCount = navCount();

      // Re-render with the same role but Growth tier; Growth admins get an
      // extra "Notes Library" entry spliced into their sidebar.
      const growth = renderWithProviders(<AppLayout />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
          tier: "Growth",
        }),
      });
      const growthCount = Number(
        growth
          .getAllByLabelText("navbar")
          .at(-1)
          .getAttribute("data-nav-count"),
      );

      // WHY: tier gating controls feature access; Growth unlocks Notes Library.
      expect(growthCount).toBe(baseCount + 1);
    });

    it("should give an Employee nav items", () => {
      renderWithProviders(<AppLayout />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Employee",
        }),
      });

      expect(navCount()).toBeGreaterThan(0);
    });

    it("should give a Patient (resident) nav items", () => {
      renderWithProviders(<AppLayout />, {
        preloadedState: stateForProfile({
          _id: "res-test-001",
          userType: "Patient",
        }),
      });

      expect(navCount()).toBeGreaterThan(0);
    });

    it("should give a Guardian nav items", () => {
      renderWithProviders(<AppLayout />, {
        preloadedState: stateForProfile({
          _id: "res-test-001",
          userType: "Guardian",
        }),
      });

      expect(navCount()).toBeGreaterThan(0);
    });

    it("should leave nav items empty for an unknown/empty profile", () => {
      renderWithProviders(<AppLayout />);

      // WHY: an unauthenticated/partially-hydrated session has no role, so no
      // nav items should be exposed rather than defaulting to a privileged set.
      expect(navCount()).toBe(0);
    });
  });
});

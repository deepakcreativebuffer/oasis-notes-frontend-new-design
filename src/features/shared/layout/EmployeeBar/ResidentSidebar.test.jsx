/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import ResidentSidebar from "./ResidentSidebar";

// Seeds auth.userProfile so useSelector(userProfile) resolves a role without
// dispatching a real login. Fake PHI only.
const stateForRole = (userType, extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", name: "Test User", userType, ...extra },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

// Mirrors residentSidebarNav names from src/features/shared/constants/appConstants.js
const NAV_NAMES = ["Home", "Resident Tracking", "Resident", "All Residents"];

describe("ResidentSidebar", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("admin role", () => {
    it("should render every resident sidebar nav item for an Admin", () => {
      renderWithProviders(<ResidentSidebar />, {
        preloadedState: stateForRole("Admin"),
      });

      // WHY: Admins get the full resident-chart navigation; each menu label must
      // be visible so staff can reach tracking/resident pages.
      NAV_NAMES.forEach((name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it("should highlight the item matching the current route as active", () => {
      renderWithProviders(<ResidentSidebar />, {
        preloadedState: stateForRole("Admin"),
        route: "/dashboard/patient-tracking",
      });

      // WHY: the active class signals to staff which resident section they are
      // currently viewing; query by text then walk to the clickable <li>.
      const activeItem = screen.getByText("Resident Tracking").closest("li");
      expect(activeItem).toHaveClass("active");

      // A non-current item must NOT be marked active.
      const inactiveItem = screen.getByText("Home").closest("li");
      expect(inactiveItem).not.toHaveClass("active");
    });

    it("should navigate to the item's route on click (item becomes active)", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ResidentSidebar />, {
        preloadedState: stateForRole("Admin"),
        route: "/",
      });

      const homeItem = screen.getByText("Home").closest("li");
      // WHY: not active before clicking — route is "/" not "/dashboard/homepage".
      expect(homeItem).not.toHaveClass("active");

      await user.click(homeItem);

      // WHY: clicking navigates to nav.link, so the same item now reflects the
      // active route — proves the click handler wires navigate(nav.link).
      expect(screen.getByText("Home").closest("li")).toHaveClass("active");
    });
  });

  describe("non-admin role", () => {
    it("should render no nav items for an Employee", () => {
      renderWithProviders(<ResidentSidebar />, {
        preloadedState: stateForRole("Employee"),
      });

      // WHY: only Admins populate this resident sidebar; non-admins must not see
      // resident-chart navigation here.
      NAV_NAMES.forEach((name) => {
        expect(screen.queryByText(name)).not.toBeInTheDocument();
      });
    });

    it("should render no nav items when no userType is present", () => {
      // Partially-hydrated session — empty userProfile.
      renderWithProviders(<ResidentSidebar />);

      NAV_NAMES.forEach((name) => {
        expect(screen.queryByText(name)).not.toBeInTheDocument();
      });
    });
  });

  describe("chrome", () => {
    it("should always render the app version footer", () => {
      renderWithProviders(<ResidentSidebar />, {
        preloadedState: stateForRole("Admin"),
      });

      // WHY: the version label is rendered regardless of role/nav contents.
      expect(screen.getByText(/app version 1\.0/i)).toBeInTheDocument();
    });

    it("should mount without crashing for an unauthenticated session", () => {
      const { container } = renderWithProviders(<ResidentSidebar />);
      expect(container.querySelector("aside")).toBeInTheDocument();
    });
  });
});

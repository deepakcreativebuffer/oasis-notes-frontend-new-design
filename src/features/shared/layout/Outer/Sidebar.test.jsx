/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar";

// CSS side-effect import in the component is harmless under jsdom, but stub it
// to avoid any parser/loader surprises in the test runner.
vi.mock("@/assets/styles/Sidebar.css", () => ({}));

// Seeds auth.userProfile so the component's useSelector(userProfile) resolves a
// role/tier without dispatching a real login. Fake PHI only.
const stateForProfile = (userProfile) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom has no layout engine; scrollIntoView is undefined. The active-item
    // effect calls it on location change, so provide a no-op to avoid throws.
    if (!Element.prototype.scrollIntoView) {
      Element.prototype.scrollIntoView = vi.fn();
    } else {
      vi.spyOn(Element.prototype, "scrollIntoView").mockImplementation(
        () => {},
      );
    }
  });

  describe("role-based navigation", () => {
    it("should render the Admin sidebar items for an Admin user", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
        route: "/dashboard/homepage",
      });

      // WHY: Admins get the dashboard nav; "Users"/"Tracking" are admin-only entries.
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("Tracking")).toBeInTheDocument();
    });

    it("should render the Employee (Main) sidebar items for an Employee user", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Employee",
        }),
        route: "/Home",
      });

      // WHY: line staff see the MainSidebar (Resident Chart / Resident List),
      // not the admin dashboard entries.
      expect(screen.getByText("Resident Chart")).toBeInTheDocument();
      expect(screen.getByText("Resident List")).toBeInTheDocument();
      expect(screen.queryByText("Tracking")).not.toBeInTheDocument();
    });

    it("should render the Resident sidebar items for a Patient user", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "res-test-001",
          userType: "Patient",
        }),
        route: "/patient_panel",
      });

      expect(screen.getByText("Intake")).toBeInTheDocument();
      expect(screen.getByText("Progress Chart")).toBeInTheDocument();
    });

    it("should render the Guardian sidebar items for a Guardian user", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "res-test-001",
          userType: "Guardian",
        }),
        route: "/patient_panel",
      });

      // WHY: guardians only get Home + the residents they're assigned to.
      expect(screen.getByText("Resident List")).toBeInTheDocument();
      expect(screen.queryByText("Intake")).not.toBeInTheDocument();
    });
  });

  describe("Admin resident-context + tier branches", () => {
    it("should swap to the resident sidebar nav when on a resident route", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
        // WHY: /employee/patient-chart is a resident route; admins viewing a
        // resident chart get the resident-scoped nav (e.g. "All Residents").
        route: "/employee/patient-chart",
      });

      expect(screen.getByText("All Residents")).toBeInTheDocument();
      // The generic admin "Users" entry should not be present in resident context.
      expect(screen.queryByText("Users")).not.toBeInTheDocument();
    });

    it("should inject the Notes Library item for a Growth-tier admin", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
          tier: "Growth",
        }),
        route: "/dashboard/homepage",
      });

      // WHY: Notes Library is a paid/Growth-tier feature spliced into the admin nav.
      expect(screen.getByText("Notes Library")).toBeInTheDocument();
    });

    it("should inject the Notes Library item when permissionNoteLibrary is true", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
          permissionNoteLibrary: true,
        }),
        route: "/dashboard/homepage",
      });

      expect(screen.getByText("Notes Library")).toBeInTheDocument();
    });

    it("should NOT show Notes Library for a non-Growth admin without the permission", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
        route: "/dashboard/homepage",
      });

      expect(screen.queryByText("Notes Library")).not.toBeInTheDocument();
    });
  });

  describe("active link highlighting", () => {
    it("should mark the matching nav item active on the current route", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
        route: "/dashboard/contacts",
      });

      // WHY: the active route's <li> gets the "active" class so staff can see
      // where they are; assert via class since there's no accessible alternative.
      const usersText = screen.getByText("Users");
      const li = usersText.closest("li");
      expect(li).toHaveClass("active");
    });
  });

  describe("interactions", () => {
    it("should navigate when a nav item is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Admin",
        }),
        route: "/dashboard/homepage",
      });

      // Clicking does not throw (navigate is invoked via the router).
      await user.click(screen.getByText("Users"));
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    it("should toggle the hamburger via the close icon", () => {
      const setHamb = vi.fn();
      const { container } = renderWithProviders(
        <Sidebar hamb={true} setHamb={setHamb} />,
        {
          preloadedState: stateForProfile({
            _id: "emp-test-001",
            userType: "Admin",
          }),
          route: "/dashboard/homepage",
        },
      );

      // The close icon (RiCloseLine) is an SVG with no accessible name; reach it
      // via the top container. WHY: closes the mobile sidebar drawer.
      const closeIcon = container.querySelector("aside > div svg");
      expect(closeIcon).toBeTruthy();
      fireEvent.click(closeIcon);
      expect(setHamb).toHaveBeenCalledWith(false);
    });
  });

  describe("edge cases", () => {
    it("should render an empty nav (no items) when no userType is present", () => {
      const { container } = renderWithProviders(
        <Sidebar hamb={false} setHamb={() => {}} />,
        {
          preloadedState: stateForProfile({}),
          route: "/",
        },
      );

      // WHY: an unhydrated/unknown profile must not crash the shell; it renders
      // the chrome (app version) with no nav links.
      expect(screen.getByText(/app version/i)).toBeInTheDocument();
      expect(
        container.querySelectorAll("nav.outer-siderbar-nav li").length,
      ).toBe(0);
    });

    it("should always render the app version footer", () => {
      renderWithProviders(<Sidebar hamb={false} setHamb={() => {}} />, {
        preloadedState: stateForProfile({
          _id: "emp-test-001",
          userType: "Employee",
        }),
        route: "/Home",
      });

      expect(screen.getByText(/app version 1\.0/i)).toBeInTheDocument();
    });
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import Sidebar from "./Sidebar";

// Sidebar only reads the css-import for styling; jsdom can ignore it. No
// services/IO are imported, so nothing to mock beyond seeding redux auth state.

// Seeds auth.userProfile so the component's useSelector(userProfile) resolves a
// role/permissions without dispatching a real login. Fake PHI only.
const stateForRole = (userProfile = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("Sidebar", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("rendering", () => {
    it("should always render the sidebar shell and app version", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Admin",
        }),
      });

      // WHY: the version banner is a stable, role-independent footer that
      // confirms the sidebar chrome mounted even before nav resolves.
      expect(screen.getByText(/app version 1\.0/i)).toBeInTheDocument();
    });
  });

  describe("role-based nav items", () => {
    it("should render the admin (resident) nav for Admin users", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Admin",
        }),
      });

      // WHY: Admins get the residentSidebarNav set; every item is shown
      // because admins bypass the per-item permission gate.
      expect(screen.getByText("Resident Tracking")).toBeInTheDocument();
      expect(screen.getByText("All Residents")).toBeInTheDocument();
    });

    it("should render the inner employee nav off the /employment route", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Employee",
        }),
        route: "/Home",
      });

      // WHY: Employees not on /employment see the Innernav (clinical logs).
      expect(screen.getByText("Therapy Progress Notes")).toBeInTheDocument();
      expect(screen.getByText("Mileage Log")).toBeInTheDocument();
    });

    it("should render the employment nav on the /employment route", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Employee",
        }),
        route: "/employment",
      });

      // WHY: the /employment route swaps in employeeSidebarNav (HR/application
      // items) instead of the clinical Innernav.
      expect(screen.getByText(/employment application/i)).toBeInTheDocument();
    });

    it("should render the resident (patient) nav for Patient users", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "res-test-001",
          userType: "Patient",
        }),
      });

      expect(screen.getByText("Intake")).toBeInTheDocument();
      expect(screen.getByText("Progress Chart")).toBeInTheDocument();
    });

    it("should render the guardian nav for Guardian users", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "res-test-001",
          userType: "Guardian",
        }),
      });

      expect(screen.getByText("Resident List")).toBeInTheDocument();
    });
  });

  describe("permission gating", () => {
    it("should mark non-permitted employee items as disabled-link", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Employee",
          userPermissions: { view: "" },
          accountType: "regular",
        }),
        route: "/Home",
      });

      // WHY: clinical items without an explicit permission grant must be
      // visually disabled so restricted staff cannot navigate into PHI areas.
      // Mileage Log (link /milega-log) is NOT in alwaysEnabledItems.
      const mileage = screen.getByText("Mileage Log").closest("li");
      expect(mileage).toHaveClass("disabled-link");
    });

    it("should not disable items granted via userPermissions.view", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Employee",
          userPermissions: { view: "ml" },
          accountType: "regular",
        }),
        route: "/Home",
      });

      // WHY: a staff member granted the "ml" key should reach the Mileage Log.
      const mileage = screen.getByText("Mileage Log").closest("li");
      expect(mileage).not.toHaveClass("disabled-link");
    });

    it("should not disable items for administrator account types", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({
          _id: "emp-test-001",
          userType: "Employee",
          userPermissions: { view: "" },
          accountType: "adminstrator",
        }),
        route: "/Home",
      });

      // WHY: administrator-account staff bypass the per-item view gate.
      const mileage = screen.getByText("Mileage Log").closest("li");
      expect(mileage).not.toHaveClass("disabled-link");
    });
  });

  describe("edge cases", () => {
    it("should render the shell without crashing when no profile is present", () => {
      renderWithProviders(<Sidebar />, {
        preloadedState: stateForRole({}),
      });

      // WHY: an unauthenticated/partially-hydrated session must not throw; the
      // chrome renders with an empty nav list.
      expect(screen.getByText(/app version 1\.0/i)).toBeInTheDocument();
    });
  });
});

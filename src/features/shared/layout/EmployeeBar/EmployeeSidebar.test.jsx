/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import EmployeeSidebar from "./EmployeeSidebar";

// navigate() is the only IO the sidebar performs (no services/sockets). Mock it
// so click-to-route assertions don't depend on the real router history.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Seeds auth.userProfile so useSelector(userProfile) resolves a role/account
// type without dispatching a real login. Fake PHI only.
const stateFor = (userProfile = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", name: "Test User", ...userProfile },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("EmployeeSidebar", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("rendering", () => {
    it("should render the sidebar shell with the app version footer", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({ userType: "Admin" }),
      });

      // WHY: the footer is always present regardless of role; its absence would
      // mean the aside failed to mount at all.
      expect(screen.getByText(/app version 1\.0/i)).toBeInTheDocument();
    });
  });

  describe("role-based nav lists", () => {
    it("should show the full admin nav (incl. Employee List) for Admins", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({ userType: "Admin" }),
      });

      // WHY: admins get adminEmployeeSidebarNav, which uniquely contains the
      // Employee List management entry employees never see.
      expect(screen.getByText("Employee List")).toBeInTheDocument();
      expect(screen.getByText(/employment information/i)).toBeInTheDocument();
    });

    it("should show the employee nav (e.g. Time Off Request) for Employees", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({ userType: "Employee" }),
      });

      // WHY: employeeSidebarNav exposes self-service items like Time Off Request
      // that are absent from the admin list.
      expect(screen.getByText(/time off request/i)).toBeInTheDocument();
      // Admin-only management item must NOT appear for a plain employee.
      expect(screen.queryByText("Employee List")).not.toBeInTheDocument();
    });

    it("should show the guardian nav (Resident List) for Guardians", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({ userType: "Guardian" }),
      });

      // WHY: guardians get a minimal sidebar scoped to their assigned residents.
      expect(screen.getByText("Resident List")).toBeInTheDocument();
      expect(screen.queryByText("Employee List")).not.toBeInTheDocument();
    });

    it("should fall back to the admin nav when userType is unknown/missing", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({}),
      });

      // WHY: the effect's else-branch defaults to adminEmployeeSidebarNav, so a
      // partially-hydrated profile still renders something rather than blank.
      expect(screen.getByText("Employee List")).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("should navigate to a nav item's link when clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({ userType: "Admin" }),
      });

      await user.click(screen.getByText("Employee List"));

      // WHY: clicking a sidebar entry routes the user; admins navigate freely.
      expect(mockNavigate).toHaveBeenCalledWith("/employee-list");
    });
  });

  describe("permission gating for employees", () => {
    it("should leave a permitted item enabled for a regular employee with view rights", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({
          userType: "Employee",
          accountType: "regular",
          // "tr" is the Time Off Request permissionKey; granting view keeps it active.
          userPermissions: { view: "tr:timesheet" },
        }),
      });

      const item = screen.getByText(/time off request/i).closest("li");
      // WHY: a regular employee with the matching view permission keeps the
      // item interactive (no disabled-link gate).
      expect(item).not.toHaveClass("disabled-link");
    });

    it("should disable a non-permitted item for a regular employee", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({
          userType: "Employee",
          accountType: "regular",
          userPermissions: { view: "" },
        }),
      });

      const item = screen.getByText(/time off request/i).closest("li");
      // WHY: without the view permission the item is visually disabled so staff
      // can't reach data they're not authorised for.
      expect(item).toHaveClass("disabled-link");
    });

    it("should never disable items for an administrator account type", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({
          userType: "Employee",
          accountType: "adminstrator",
          userPermissions: { view: "" },
        }),
      });

      const item = screen.getByText(/time off request/i).closest("li");
      // WHY: administrator account type bypasses per-item permission gating.
      expect(item).not.toHaveClass("disabled-link");
    });
  });

  describe("active-link highlighting", () => {
    it("should mark the nav item matching the current route as active", () => {
      renderWithProviders(<EmployeeSidebar />, {
        preloadedState: stateFor({ userType: "Admin" }),
        route: "/employee-list",
      });

      const item = screen.getByText("Employee List").closest("li");
      // WHY: the sidebar reflects the current location so staff see where they
      // are in the chart navigation.
      expect(item).toHaveClass("active");
    });
  });
});

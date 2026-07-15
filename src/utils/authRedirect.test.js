/** @format */

import { describe, it, expect, vi } from "vitest";
import {
  getDashboardPathForUserType,
  redirectAuthenticatedUserFromHome,
} from "./authRedirect";
import { ROLES, ROUTES } from "@/features/shared/constants";

describe("authRedirect", () => {
  describe("getDashboardPathForUserType", () => {
    it.each([
      [ROLES.ADMIN, ROUTES.DASHBOARD],
      [ROLES.EMPLOYEE, ROUTES.EMPLOYEE_HOME],
      [ROLES.PATIENT, ROUTES.PATIENT_PANEL],
      [ROLES.GUARDIAN, ROUTES.PATIENT_PANEL],
    ])("should map %s to its dashboard path", (role, expected) => {
      expect(getDashboardPathForUserType(role)).toBe(expected);
    });

    it("should fall back to the patient panel for an unknown role", () => {
      // WHY: an unrecognized role must never land on an admin/employee surface;
      // defaulting to the least-privileged panel is fail-safe.
      expect(getDashboardPathForUserType("Unknown")).toBe(ROUTES.PATIENT_PANEL);
    });
  });

  describe("redirectAuthenticatedUserFromHome", () => {
    it("should redirect to the role dashboard when on the public home route", () => {
      const navigate = vi.fn();
      redirectAuthenticatedUserFromHome(ROLES.ADMIN, ROUTES.HOME, navigate);
      expect(navigate).toHaveBeenCalledWith(ROUTES.DASHBOARD, {
        replace: true,
      });
    });

    it("should not redirect when the user is not on the home route", () => {
      const navigate = vi.fn();
      redirectAuthenticatedUserFromHome(ROLES.ADMIN, "/somewhere", navigate);
      expect(navigate).not.toHaveBeenCalled();
    });

    it("should not redirect when there is no userType", () => {
      const navigate = vi.fn();
      redirectAuthenticatedUserFromHome(undefined, ROUTES.HOME, navigate);
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});

/** @format */

import { ROLES, ROUTES } from "@/features/shared/constants";

/** Dashboard (or home) path for a role — used after login or session refresh. */
export function getDashboardPathForUserType(userType) {
  switch (userType) {
    case ROLES.ADMIN:
      return ROUTES.DASHBOARD;
    case ROLES.EMPLOYEE:
      return ROUTES.EMPLOYEE_HOME;
    case ROLES.PATIENT:
    case ROLES.GUARDIAN:
      return ROUTES.PATIENT_PANEL;
    default:
      return ROUTES.PATIENT_PANEL;
  }
}

/** Navigate to role home when user lands on public login route with a valid session. */
export function redirectAuthenticatedUserFromHome(
  userType,
  pathname,
  navigate,
) {
  if (pathname !== ROUTES.HOME || !userType) return;
  const target = getDashboardPathForUserType(userType);
  navigate(target, { replace: true });
}

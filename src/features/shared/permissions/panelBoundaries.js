/** @format */

/**
 * Tier D — panel boundaries (do NOT merge route trees, sidebars, or form hooks).
 * Use these helpers for role-aware links/permissions only.
 */
import { ROLES } from "../constants";
import { isGuardian } from "./portalRoles";

/** Route registration panels (each has its own route array + allowedRoles in AppRoutes). */
export const ROUTE_PANELS = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  RESIDENT: "resident",
  PROFILE: "profile",
};

/**
 * Must match src/Route/AppRoutes.jsx ProtectedRoute allowedRoles per panel.
 */
export const ALLOWED_ROLES_BY_PANEL = {
  [ROUTE_PANELS.ADMIN]: [ROLES.ADMIN],
  [ROUTE_PANELS.EMPLOYEE]: [ROLES.ADMIN, ROLES.EMPLOYEE, ROLES.GUARDIAN],
  [ROUTE_PANELS.RESIDENT]: [ROLES.PATIENT, ROLES.GUARDIAN],
  [ROUTE_PANELS.PROFILE]: [
    ROLES.ADMIN,
    ROLES.EMPLOYEE,
    ROLES.GUARDIAN,
    ROLES.PATIENT,
  ],
};

/** Guardian-only navigation targets (stay on resident/employee route trees as registered). */
export const GUARDIAN_ONLY_PATHS = [
  "/assign-resident-list",
  "/bookappointment-resident",
];

export const GUARDIAN_BOOK_TRACKING_PATH = "/bookappointment-resident";
export const RESIDENT_SELF_BOOK_PATH = "/booknewappointment";
export const EMPLOYEE_BOOK_APPOINTMENT_PREFIX = "/book-appointment/";
export const GUARDIAN_BOOK_FOR_RESIDENT_PREFIX = "/bookNewAppointment/";

/**
 * Employee intake list permission codes (userPermissions.edit / .delete colon lists).
 * Hooks such as useInitialAssessmentForm enforce these — do not move hooks to shared.
 */
export const INTAKE_PERMISSION_CODES = {
  initialAssessment: "iass",
  nursingAssessment: "nass",
  treatmentPlan: "tp",
  faceSheet: "fs",
  residentIntake: "ri",
  safetyPlan: "sp",
};

export function getAllowedRolesForPanel(panel) {
  return ALLOWED_ROLES_BY_PANEL[panel] ?? [];
}

export function isRoleAllowedForPanel(userType, panel) {
  if (!userType || !panel) return false;
  return getAllowedRolesForPanel(panel).includes(userType);
}

/** Search / document hub: Guardian uses resident view paths; Employee/Admin use employee paths. */
export function getDocumentViewLink(doc, userType, documentId) {
  const base = isGuardian(userType) ? doc?.residentViewLink : doc?.viewLink;
  if (!base) return "";
  return documentId != null && documentId !== ""
    ? `${base}/${documentId}`
    : base;
}

export function getDocumentEditLink(doc, userType, documentId) {
  const base = isGuardian(userType) ? doc?.residentEditLink : doc?.editLink;
  if (!base) return "";
  return documentId != null && documentId !== ""
    ? `${base}/${documentId}`
    : base;
}

export function hasIntakePermission(userPermissions, code, action = "edit") {
  if (!code || !userPermissions) return false;
  const list = userPermissions?.[action]?.split(":") ?? [];
  return list.includes(code);
}

export function isGuardianOnlyPath(pathname = "") {
  return GUARDIAN_ONLY_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

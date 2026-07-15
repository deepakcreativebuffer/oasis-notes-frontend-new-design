/** @format */

/**
 * Cross-panel shared modules (Admin, Employee, Resident, Guardian).
 * Feature-specific code remains under src/Pages, src/admin, src/resident.
 */

export { usePrint, useNavigateWithParams } from "./hooks";

export {
  isResidentPortalUser,
  isGuardian,
  isPatient,
  isAdmin,
  isEmployee,
} from "./permissions/portalRoles";

export {
  ROUTE_PANELS,
  ALLOWED_ROLES_BY_PANEL,
  GUARDIAN_ONLY_PATHS,
  INTAKE_PERMISSION_CODES,
  getAllowedRolesForPanel,
  isRoleAllowedForPanel,
  getDocumentViewLink,
  getDocumentEditLink,
  hasIntakePermission,
  isGuardianOnlyPath,
} from "./permissions/panelBoundaries";

export { default as CustomSelect } from "./ui/selectors/CustomSelect";
export { default as CustomMultiSelect } from "./ui/selectors/CustomMultiSelect";
export { default as CustomMultiSelectInput } from "./ui/selectors/CustomMultiSelectInput";

export { AutoSize } from "./ui/forms/AutoSize";
export { default as AutoSizeDefault } from "./ui/forms/AutoSize";
export { default as AssessmentTypeHeader } from "./ui/forms/AssessmentTypeHeader";

export {
  getIntakeDocumentLinks,
  canCreateIntakeDocument,
} from "./intake/intakeLinks";

export {
  ASSESSMENT_MODES,
  ASSESSMENT_PORTALS,
  EMPLOYEE_ROUTES,
  RESIDENT_ROUTES,
  PRINT_PAGE_STYLE,
} from "./intake/assessmentConstants";

export {
  resolveAssessmentContext,
  mapSelectValuesToArray,
  getApiArrayData,
} from "./intake/assessmentContext";

export { getBookAppointmentPath } from "./intake/appointmentLinks";

export { default as ChangePassword } from "./features/auth/ChangePassword";

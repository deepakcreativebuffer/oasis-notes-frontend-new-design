/** @format */

import {
  ASSESSMENT_MODES,
  ASSESSMENT_PORTALS,
  EMPLOYEE_ROUTES,
  RESIDENT_ROUTES,
} from "./assessmentConstants";

/**
 * Resolves assessment mode and portal from the current pathname.
 */
export function resolveAssessmentContext(pathname) {
  if (!pathname) {
    return {
      mode: ASSESSMENT_MODES.CREATE,
      portal: ASSESSMENT_PORTALS.EMPLOYEE,
      isCreate: true,
      isView: false,
      isEdit: false,
      isReadOnly: false,
    };
  }

  const isResident =
    pathname.includes("resident") ||
    pathname.includes("Assessment-resident") ||
    pathname.includes("assessment-resident");

  const portal = isResident
    ? ASSESSMENT_PORTALS.RESIDENT
    : ASSESSMENT_PORTALS.EMPLOYEE;

  let mode = ASSESSMENT_MODES.EDIT;

  if (pathname === EMPLOYEE_ROUTES.CREATE) {
    mode = ASSESSMENT_MODES.CREATE;
  } else if (
    pathname.startsWith(EMPLOYEE_ROUTES.VIEW_PREFIX) ||
    pathname.startsWith(RESIDENT_ROUTES.VIEW_PREFIX)
  ) {
    mode = ASSESSMENT_MODES.VIEW;
  } else if (
    pathname.startsWith(EMPLOYEE_ROUTES.EDIT_PREFIX) ||
    pathname.startsWith(RESIDENT_ROUTES.EDIT_PREFIX) ||
    pathname.startsWith("/initial-assessment/")
  ) {
    mode = ASSESSMENT_MODES.EDIT;
  }

  const isCreate = mode === ASSESSMENT_MODES.CREATE;
  const isView = mode === ASSESSMENT_MODES.VIEW;
  const isEdit = mode === ASSESSMENT_MODES.EDIT;

  return {
    mode,
    portal,
    isCreate,
    isView,
    isEdit,
    isReadOnly: isView,
  };
}

export function mapSelectValuesToArray(items = []) {
  return items.map((item) => item?.value ?? item);
}

export function getApiArrayData(startIndex, arrayLength, array) {
  if (arrayLength <= startIndex) {
    return [];
  }
  const arr = [];
  for (let i = startIndex; i < arrayLength; i++) {
    arr.push(array[i]);
  }
  return arr;
}

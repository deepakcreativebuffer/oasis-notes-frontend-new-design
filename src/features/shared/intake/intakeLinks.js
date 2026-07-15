/** @format */

import { isResidentPortalUser, isPatient } from "../permissions/portalRoles";

/**
 * Intake document route prefixes (employee vs resident portal).
 * URLs match registered routes — Patient and Guardian use resident paths.
 */
const INTAKE_DOCUMENT_ROUTES = {
  initialAssessment: {
    employee: {
      edit: "/edit-initial-assessment/",
      view: "/view-initial-assessment/",
    },
    resident: {
      edit: "/edit-initial-Assessment-resident/",
      view: "/view-initial-assessment-resident/",
    },
  },
  nursingAssessment: {
    employee: {
      edit: "/edit-nursing-assessment/",
      view: "/view-nursing-assessment/",
    },
    resident: {
      edit: "/edit-nursing-assessment-resident/",
      view: "/view-nursing-assessment-resident/",
    },
  },
  faceSheet: {
    employee: {
      edit: "/edit-face-sheet/",
      view: "/view-face-sheet/",
    },
    resident: {
      edit: "/edit-facesheet-resident/",
      view: "/view-facesheet-resident/",
    },
  },
  safetyPlan: {
    employee: {
      edit: "/edit-safety-plan/",
      view: "/view-safety-plan/",
    },
    resident: {
      edit: "/edit-safetyplan-resident/",
      view: "/view-safety-plan-resident/",
    },
  },
  treatmentPlan: {
    employee: {
      edit: "/edit-treatment-plan/",
      view: "/view-treatment-plan/",
    },
    resident: {
      edit: "/edit-treatmentplan-resident/",
      view: "/view-treatment-plan-resident/",
    },
  },
  residentIntake: {
    employee: {
      edit: "/edit-resident-intake/",
      view: "/view-resident-intake/",
    },
    resident: {
      edit: "/edit-residentintakes-resident/",
      view: "/view-resident-intake-resident/",
    },
  },
};

/**
 * @param {keyof typeof INTAKE_DOCUMENT_ROUTES} formKey
 * @param {string} userType
 * @param {string} documentId
 */
export function getIntakeDocumentLinks(formKey, userType, documentId) {
  const routes = INTAKE_DOCUMENT_ROUTES[formKey];
  if (!routes) {
    throw new Error(`Unknown intake form key: ${formKey}`);
  }
  const portal = isResidentPortalUser(userType) ? "resident" : "employee";
  const base = routes[portal];
  return {
    edit: `${base.edit}${documentId}`,
    view: `${base.view}${documentId}`,
  };
}

/** Create button on intake lists (Guardian may create; Patient may not). */
export function canCreateIntakeDocument(userType) {
  return !isPatient(userType);
}

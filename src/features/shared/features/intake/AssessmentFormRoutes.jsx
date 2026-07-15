/** @format */

import { AssessmentFormProvider } from "@/features/employee/pages/Intake/InitialAssessment/context/AssessmentFormContext";
import { ASSESSMENT_PORTALS } from "../../intake/assessmentConstants";

/**
 * Wraps assessment route components with portal-aware form context.
 */
export function AssessmentFormRoute({ portal, children }) {
  return (
    <AssessmentFormProvider portal={portal}>{children}</AssessmentFormProvider>
  );
}

export function EmployeeAssessmentRoute({ children }) {
  return (
    <AssessmentFormRoute portal={ASSESSMENT_PORTALS.EMPLOYEE}>
      {children}
    </AssessmentFormRoute>
  );
}

export function ResidentAssessmentRoute({ children }) {
  return (
    <AssessmentFormRoute portal={ASSESSMENT_PORTALS.RESIDENT}>
      {children}
    </AssessmentFormRoute>
  );
}

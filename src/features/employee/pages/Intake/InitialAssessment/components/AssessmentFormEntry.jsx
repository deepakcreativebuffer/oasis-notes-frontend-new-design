/** @format */

/**
 * Entry point for shared Initial Assessment UI (all portals/modes).
 * Phase 2: render extracted AssessmentForm sections from this module.
 */
export { ASSESSMENT_MODES, ASSESSMENT_PORTALS } from "../utils/constants";
export { buildAssessmentPayload } from "../utils/payloadMapper";
export { buildAssessmentPayloadForResident } from "../utils/residentPayloadMapper";
export {
  AssessmentFormProvider,
  useAssessmentFormContext,
  useAssessmentFormContextOptional,
} from "../context/AssessmentFormContext";
export { default as NotificationCard } from "./common/NotificationCard";
export { default as PatientInformationSection } from "./PatientInformation/PatientInformationSection";
export { default as MedicalConditionsSection } from "./MedicalHistory/MedicalConditionsSection";
export {
  EmployeeAssessmentRoute,
  ResidentAssessmentRoute,
  AssessmentFormRoute,
} from "./AssessmentFormRoute";
export { default as SubstanceAbuseSection } from "./MedicalHistory/SubstanceAbuseSection";
export { default as AssessmentForm } from "./AssessmentForm";
export { default as SelectSinglePrint } from "./common/SelectSinglePrint";
export { useSignersList } from "../hooks/useSignersList";
export { useResidentStrengths } from "../hooks/useResidentStrengths";
export {
  useAssessmentForm,
  useAssessmentApi,
  usePrintAssessment,
  useSignatureManagement,
} from "../hooks";

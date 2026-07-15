/** @format */

import NotificationCard from "./common/NotificationCard";
import PatientInformationSection from "./PatientInformation/PatientInformationSection";
import MedicalConditionsSection from "./MedicalHistory/MedicalConditionsSection";
import FamilyMentalHealthSection from "./MedicalHistory/FamilyMentalHealthSection";
import SubstanceAbuseSection from "./MedicalHistory/SubstanceAbuseSection";
import { buildPatientInformationProps } from "./PatientInformation/patientInformationProps";
import { buildMedicalConditionsProps } from "./MedicalHistory/medicalConditionsProps";
import { buildFamilyMentalHealthProps } from "./MedicalHistory/familyMentalHealthProps";
import { buildSubstanceAbuseProps } from "./MedicalHistory/substanceAbuseProps";

/**
 * Composes extracted Initial Assessment sections (Phase 4 shell).
 * Remaining inline sections stay as children until extracted.
 */
export default function AssessmentForm({ scope, notificationProps, children }) {
  return (
    <>
      <NotificationCard {...notificationProps} />
      <PatientInformationSection {...buildPatientInformationProps(scope)} />
      <MedicalConditionsSection {...buildMedicalConditionsProps(scope)} />
      <FamilyMentalHealthSection {...buildFamilyMentalHealthProps(scope)} />
      <SubstanceAbuseSection {...buildSubstanceAbuseProps(scope)} />
      {children}
    </>
  );
}

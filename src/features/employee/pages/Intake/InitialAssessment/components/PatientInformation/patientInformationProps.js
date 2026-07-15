/** @format — generated; do not edit by hand */
import { PATIENT_INFORMATION_SECTION_PROP_KEYS } from "./PatientInformationSection";

export function buildPatientInformationProps(scope) {
  const props = {};
  for (const key of PATIENT_INFORMATION_SECTION_PROP_KEYS) {
    props[key] = scope[key];
  }
  return props;
}

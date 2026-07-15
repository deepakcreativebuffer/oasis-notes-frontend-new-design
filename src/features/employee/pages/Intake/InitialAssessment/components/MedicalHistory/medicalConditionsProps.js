/** @format — generated; do not edit by hand */
import { MEDICAL_CONDITIONS_SECTION_PROP_KEYS } from "./MedicalConditionsSection";

export function buildMedicalConditionsProps(scope) {
  const props = {};
  for (const key of MEDICAL_CONDITIONS_SECTION_PROP_KEYS) {
    props[key] = scope[key];
  }
  return props;
}

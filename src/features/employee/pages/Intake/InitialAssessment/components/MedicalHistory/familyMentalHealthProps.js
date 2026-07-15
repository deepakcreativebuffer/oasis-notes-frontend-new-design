/** @format — generated; do not edit by hand */
import { FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS } from "./FamilyMentalHealthSection";

export function buildFamilyMentalHealthProps(scope) {
  const props = {};
  for (const key of FAMILY_MENTAL_HEALTH_SECTION_PROP_KEYS) {
    props[key] = scope[key];
  }
  return props;
}

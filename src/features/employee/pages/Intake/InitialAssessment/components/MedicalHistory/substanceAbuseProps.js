/** @format — generated; do not edit by hand */
import { SUBSTANCE_ABUSE_SECTION_PROP_KEYS } from "./SubstanceAbuseSection";

export function buildSubstanceAbuseProps(scope) {
  const merged = {
    ...(scope.sectionProps ?? {}),
    ...(scope.selectHandlers ?? {}),
    ...(scope.legacy ?? {}),
    ...scope,
  };
  const props = {};
  for (const key of SUBSTANCE_ABUSE_SECTION_PROP_KEYS) {
    props[key] = merged[key];
  }
  return props;
}

/** @format */

import { SUBSTANCE_ABUSE_FIXED_ROWS } from "./substanceAbuseConfig";

const HNADLE_LAST_USE_KEYS = new Set([
  "Cocaine",
  "Hallucinogens",
  "OTC",
  "PCP",
]);
const HNADLE_LENGTH_KEYS = new Set(["Methadone", "Prescription"]);

function fieldSegment(field) {
  if (field === "lastUse") return "LastUse";
  if (field === "frequency") return "Frequency";
  return "LengthOfSobriety";
}

function handlerPrefix(substanceKey, field) {
  if (substanceKey === "Alcohol") return "handlersubstance";
  if (field === "lastUse" && HNADLE_LAST_USE_KEYS.has(substanceKey)) {
    return "hnadlesubstance";
  }
  if (field === "lengthOfSobriety" && HNADLE_LENGTH_KEYS.has(substanceKey)) {
    return "hnadlesubstance";
  }
  return "handlesubstance";
}

function optionsPropPrefix(substanceKey, field) {
  if (
    substanceKey === "Alcohol" &&
    (field === "lastUse" || field === "frequency")
  ) {
    return "selectedsubstance";
  }
  return "optionsubstance";
}

export function getSubstanceSelectPropNames(substanceKey, field) {
  const segment = fieldSegment(field);
  return {
    options: `${optionsPropPrefix(substanceKey, field)}AbuseHistoryData${segment}${substanceKey}`,
    handleKey: `handleKeysubstanceAbuseHistoryData${segment}${substanceKey}`,
    handler: `${handlerPrefix(substanceKey, field)}AbuseHistoryData${segment}${substanceKey}`,
    setter: `setSubstanceAbuseHistoryData${segment}${substanceKey}`,
  };
}

export const SUBSTANCE_SELECT_FIELD_TYPES = [
  "lastUse",
  "frequency",
  "lengthOfSobriety",
];

export const SUBSTANCE_SELECT_SUBSTANCE_KEYS = SUBSTANCE_ABUSE_FIXED_ROWS.map(
  (row) => row.substanceKey,
);

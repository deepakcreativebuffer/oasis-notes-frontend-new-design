/** @format */

import { buildAssessmentPayload } from "./payloadMapper";

/**
 * Resident portal payload — adds `state: true` on medical condition rows (legacy behavior).
 */
export function buildAssessmentPayloadForResident(values) {
  const data = buildAssessmentPayload(values);

  if (Array.isArray(data.medicalConditions)) {
    data.medicalConditions = data.medicalConditions.map((item) => ({
      ...item,
      state: true,
    }));
  }

  return data;
}

/** @format */

import { useLegacyObjectForm } from "./useLegacyObjectForm";
import { MENTAL_STATUS_EXAM_FIELD_REGISTRY } from "../config/legacyFieldRegistries";
import { mapMentalStatusExamFromApi } from "../utils/mentalStatusExamMapper";

export function useMentalStatusExam() {
  return useLegacyObjectForm(MENTAL_STATUS_EXAM_FIELD_REGISTRY, {
    mapFromApi: mapMentalStatusExamFromApi,
  });
}

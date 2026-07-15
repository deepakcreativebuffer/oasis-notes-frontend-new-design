/** @format */

import { useLegacyObjectForm } from "./useLegacyObjectForm";
import { ACTIVE_WITHDRAWAL_FIELD_REGISTRY } from "../config/legacyFieldRegistries";
import { mapActiveWithdrawalFromApi } from "../utils/activeWithdrawalMapper";

export function useActiveWithdrawalSymptoms() {
  return useLegacyObjectForm(ACTIVE_WITHDRAWAL_FIELD_REGISTRY, {
    mapFromApi: mapActiveWithdrawalFromApi,
  });
}

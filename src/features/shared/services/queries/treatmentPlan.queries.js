/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { treatmentPlanService } from "../services/intake";

// ─── Queries ──────────────────────────────────────────────────────────

export function useTreatmentPlanList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.treatmentPlan.list(filters),
    () =>
      treatmentPlanService.list
        ? treatmentPlanService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useTreatmentPlanDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.treatmentPlan.detail(id),
    () =>
      treatmentPlanService.getById
        ? treatmentPlanService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateTreatmentPlan(options = {}) {
  return useServiceMutation(
    (payload) =>
      treatmentPlanService.create
        ? treatmentPlanService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.treatmentPlan.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateTreatmentPlan(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      treatmentPlanService.update
        ? treatmentPlanService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.treatmentPlan.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

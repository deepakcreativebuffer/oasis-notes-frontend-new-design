/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { clinicalOversightService } from "../services/clinicalOversight";

// ─── Queries ──────────────────────────────────────────────────────────

export function useClinicalOversightList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.clinicalOversight.list(filters),
    () =>
      clinicalOversightService.list
        ? clinicalOversightService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useClinicalOversightDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.clinicalOversight.detail(id),
    () =>
      clinicalOversightService.getById
        ? clinicalOversightService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateClinicalOversight(options = {}) {
  return useServiceMutation(
    (payload) =>
      clinicalOversightService.create
        ? clinicalOversightService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.clinicalOversight.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateClinicalOversight(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      clinicalOversightService.update
        ? clinicalOversightService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.clinicalOversight.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { assistanceService } from "../services/assistance";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAssistanceList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.assistance.list(filters),
    () =>
      assistanceService.list
        ? assistanceService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useAssistanceMedList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.assistanceMed.list(filters),
    () => assistanceService.selfAdministration.list(filters),
    options,
  );
}

export function useAssistanceDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.assistance.detail(id),
    () =>
      assistanceService.getById
        ? assistanceService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAssistance(options = {}) {
  return useServiceMutation(
    (payload) =>
      assistanceService.create
        ? assistanceService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.assistance.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAssistance(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      assistanceService.update
        ? assistanceService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.assistance.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

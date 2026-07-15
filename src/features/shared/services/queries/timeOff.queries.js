/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { timeOffService } from "../services/timeOff";

// ─── Queries ──────────────────────────────────────────────────────────

export function useTimeOffList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.timeOff.list(filters),
    () =>
      timeOffService.requests.list
        ? timeOffService.requests.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useTimeOffDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.timeOff.detail(id),
    () =>
      timeOffService.getById
        ? timeOffService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateTimeOff(options = {}) {
  return useServiceMutation(
    (payload) =>
      timeOffService.create
        ? timeOffService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.timeOff.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateTimeOff(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      timeOffService.update
        ? timeOffService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.timeOff.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

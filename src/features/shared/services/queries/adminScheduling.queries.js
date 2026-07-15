/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminSchedulingService } from "@/features/admin/services/admin/scheduling.service";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAdminSchedulingList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminScheduling.list(filters),
    () =>
      adminSchedulingService.list
        ? adminSchedulingService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useAdminSchedulingDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.adminScheduling.detail(id),
    () =>
      adminSchedulingService.getById
        ? adminSchedulingService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminScheduling(options = {}) {
  return useServiceMutation(
    (payload) =>
      adminSchedulingService.create
        ? adminSchedulingService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminScheduling.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAdminScheduling(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      adminSchedulingService.update
        ? adminSchedulingService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminScheduling.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

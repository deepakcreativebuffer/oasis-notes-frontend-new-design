/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminTrackingService } from "@/features/admin/services/admin/tracking.service";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAdminTrackingList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminTracking.list(filters),
    () =>
      adminTrackingService.list
        ? adminTrackingService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useAdminTrackingDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.adminTracking.detail(id),
    () =>
      adminTrackingService.getById
        ? adminTrackingService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminTracking(options = {}) {
  return useServiceMutation(
    (payload) =>
      adminTrackingService.create
        ? adminTrackingService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminTracking.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAdminTracking(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      adminTrackingService.update
        ? adminTrackingService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminTracking.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

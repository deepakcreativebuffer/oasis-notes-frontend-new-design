/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminPortalService } from "@/features/admin/services/adminPortal";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAdminPortalList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminPortal.list(filters),
    () =>
      adminPortalService.list
        ? adminPortalService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useTerminationsList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.terminations.list(filters),
    () => adminPortalService.listTerminations(filters),
    options,
  );
}

export function usePatientTrackingList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminTracking.list(filters),
    () => adminPortalService.listPatientTracking(filters),
    options,
  );
}

export function useAdminPortalDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.adminPortal.detail(id),
    () =>
      adminPortalService.getById
        ? adminPortalService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminPortal(options = {}) {
  return useServiceMutation(
    (payload) =>
      adminPortalService.create
        ? adminPortalService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminPortal.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAdminPortal(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      adminPortalService.update
        ? adminPortalService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminPortal.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

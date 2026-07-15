/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminDataService } from "@/features/admin/services/admin/adminData.service";

// ─── Queries ──────────────────────────────────────────────────────────

/**
 * Generic query for admin data using a dynamic URL.
 */
export function useAdminDataList(url, options = {}) {
  return useServiceQuery(
    queryKeys.adminData.list({ url }),
    () => adminDataService.getAllData(url),
    { enabled: Boolean(url), ...options },
  );
}

export function useAdminDataDetail(url, id, options = {}) {
  return useServiceQuery(
    queryKeys.adminData.detail(`${url}-${id}`),
    () => adminDataService.singleData(url, id),
    { enabled: Boolean(url && id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminData(url, options = {}) {
  return useServiceMutation(
    (payload) => adminDataService.postData(url, payload),
    {
      invalidateKeys: [queryKeys.adminData.list({ url })],
      ...options,
    },
  );
}

export function useUpdateAdminData(url, options = {}) {
  return useServiceMutation(
    ({ id, payload }) => adminDataService.updateData(url, payload, id),
    {
      invalidateKeys: [queryKeys.adminData.list({ url })],
      ...options,
    },
  );
}

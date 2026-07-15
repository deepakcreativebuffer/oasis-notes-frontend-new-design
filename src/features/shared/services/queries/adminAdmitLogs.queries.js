/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminAdmitLogsService } from "@/features/admin/services/admin/admitLogs.service";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAdminAdmitLogsList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminAdmitLogs.list(filters),
    () =>
      adminAdmitLogsService.list
        ? adminAdmitLogsService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useAdminAdmitLogsDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.adminAdmitLogs.detail(id),
    () =>
      adminAdmitLogsService.getById
        ? adminAdmitLogsService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminAdmitLogs(options = {}) {
  return useServiceMutation(
    (payload) =>
      adminAdmitLogsService.create
        ? adminAdmitLogsService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminAdmitLogs.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAdminAdmitLogs(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      adminAdmitLogsService.update
        ? adminAdmitLogsService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminAdmitLogs.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

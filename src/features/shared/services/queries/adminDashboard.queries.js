/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminDashboardService } from "@/features/admin/services/adminDashboard";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAdminDashboardList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminDashboard.list(filters),
    () =>
      adminDashboardService.list
        ? adminDashboardService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useJobDescriptionList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.jobDescription.list(filters),
    () => adminDashboardService.jobDescription.list(filters),
    options,
  );
}

export function useEmployeePerformanceList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.employeePerformance.list(filters),
    () => adminDashboardService.employeePerformance.list(filters),
    options,
  );
}

export function useAdminDashboardDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.adminDashboard.detail(id),
    () =>
      adminDashboardService.getById
        ? adminDashboardService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminDashboard(options = {}) {
  return useServiceMutation(
    (payload) =>
      adminDashboardService.create
        ? adminDashboardService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminDashboard.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAdminDashboard(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      adminDashboardService.update
        ? adminDashboardService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminDashboard.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

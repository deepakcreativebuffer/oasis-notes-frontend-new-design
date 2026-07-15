/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { employeeTrackingService } from "../services/employeeTracking";

// ─── Queries ──────────────────────────────────────────────────────────

export function useEmployeeTrackingList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.employeeTracking.list(filters),
    () =>
      employeeTrackingService.list
        ? employeeTrackingService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useEmployeeTrackingDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.employeeTracking.detail(id),
    () =>
      employeeTrackingService.getById
        ? employeeTrackingService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateEmployeeTracking(options = {}) {
  return useServiceMutation(
    (payload) =>
      employeeTrackingService.create
        ? employeeTrackingService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.employeeTracking.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateEmployeeTracking(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      employeeTrackingService.update
        ? employeeTrackingService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.employeeTracking.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

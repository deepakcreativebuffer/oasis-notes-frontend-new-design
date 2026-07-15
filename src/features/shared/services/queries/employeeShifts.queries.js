/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { employeeShiftsService } from "@/features/employee/services/employee/shifts.service";

// ─── Queries ──────────────────────────────────────────────────────────

export function useEmployeeShiftsList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.employeeShifts.list(filters),
    () =>
      employeeShiftsService.list
        ? employeeShiftsService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useEmployeeShiftsDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.employeeShifts.detail(id),
    () =>
      employeeShiftsService.getById
        ? employeeShiftsService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateEmployeeShifts(options = {}) {
  return useServiceMutation(
    (payload) =>
      employeeShiftsService.create
        ? employeeShiftsService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.employeeShifts.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateEmployeeShifts(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      employeeShiftsService.update
        ? employeeShiftsService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.employeeShifts.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

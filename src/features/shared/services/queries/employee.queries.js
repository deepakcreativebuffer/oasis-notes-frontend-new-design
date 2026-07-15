/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { employeeService } from "@/features/employee/services/employee";

// ─── Queries ──────────────────────────────────────────────────────────

export function useEmployeeProfile(options = {}) {
  return useServiceQuery(
    queryKeys.employee.detail("profile"),
    () => employeeService.getProfile(),
    options,
  );
}

export function useActiveEmployeesList(isAdmin, options = {}) {
  return useServiceQuery(
    queryKeys.employee.list({ active: true, isAdmin }),
    () => employeeService.listActive({ isAdmin }),
    options,
  );
}

export function usePaginatedEmployees(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.employee.list(filters),
    () => employeeService.listPaginated(filters),
    options,
  );
}

export function useListUsers(queryString, options = {}) {
  return useServiceQuery(
    queryKeys.employee.list({ queryString }),
    () => employeeService.listUsers({ queryString }),
    options,
  );
}

export function useEmployeeNotifications(isAdmin, options = {}) {
  return useServiceQuery(
    queryKeys.employee.list({ notifications: true, isAdmin }),
    () => employeeService.getNotifications({ isAdmin }),
    options,
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useUploadEmployeeDocument(options = {}) {
  return useServiceMutation(
    (payload) => employeeService.uploadDocumentForEmployee(payload),
    {
      invalidateKeys: [queryKeys.employee.all()],
      successMsg: "Document uploaded successfully!",
      ...options,
    },
  );
}

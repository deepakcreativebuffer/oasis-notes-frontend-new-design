/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { timesheetService } from "../services/timesheet";

// ─── Queries ──────────────────────────────────────────────────────────

export function useTimesheetList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.timesheet.list(filters),
    () =>
      timesheetService.list
        ? timesheetService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useTimesheetDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.timesheet.detail(id),
    () =>
      timesheetService.getById
        ? timesheetService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateTimesheet(options = {}) {
  return useServiceMutation(
    (payload) =>
      timesheetService.create
        ? timesheetService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.timesheet.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateTimesheet(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      timesheetService.update
        ? timesheetService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.timesheet.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

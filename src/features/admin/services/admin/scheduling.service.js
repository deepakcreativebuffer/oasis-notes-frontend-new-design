/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { EMPLOYEE_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";
import { showNotification } from "@/utils";

export const adminSchedulingService = {
  getAllActivityShifts: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.ACTIVITY_SHIFT_GET_ALL),
      "Fetch All Activity Shifts",
    ),

  getActivityScheduleForAdmin: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ACTIVITY_SCHEDULE_ADMIN, { params }),
      "Fetch Activity Schedule for Admin",
    ),

  addActivitySchedule: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_ACTIVITY_SCHEDULE_ADMIN, payload),
      "Add Activity Schedule",
    ),

  addStaffScheduleAdministrator: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_STAFF_SCHEDULE_ADMIN, payload),
      "Add Staff Schedule Administrator",
    ),

  deleteActivityShift: (id) =>
    handleApiRequest(
      () => api.delete(ADMIN_APIS.ACTIVITY_SHIFT_DELETE(id)),
      "Delete Activity Shift",
    ),

  addActivityShift: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ACTIVITY_SHIFT_ADD, payload),
      "Add Activity Shift",
    ),

  addShift: (payload) =>
    handleApiRequest(
      () => api.post(EMPLOYEE_APIS.SHIFT_ADD, payload),
      "Add Shift",
    ),

  deleteShift: (id) =>
    handleApiRequest(
      () => api.delete(EMPLOYEE_APIS.SHIFT_DELETE(id)),
      "Delete Shift",
    ),

  getStaffScheduleAdministratorForAdmin: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.STAFF_SCHEDULE_ADMIN_GET, { params }),
      "Fetch Staff Schedule for Admin",
    ),

  getStaffScheduleForAdmins: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.STAFF_SCHEDULE_GET, { params }),
      "Fetch Staff Schedule for Admins",
    ),

  addStaffSchedule: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.STAFF_SCHEDULE_ADD, payload),
      "Add Staff Schedule",
    ),

  getActiveEmployees: () =>
    handleApiRequest(
      () =>
        api.get(ADMIN_APIS.GET_USER, {
          params: { isActive: true, userType: "Employee" },
        }),
      "Fetch Active Employees",
    ),

  getShifts: (facilityId) =>
    handleApiRequest(
      () => api.get(EMPLOYEE_APIS.SHIFT_GET_ALL(facilityId)),
      "Fetch All Shifts",
    ),

  getStaffScheduleByEmployeeId: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.STAFF_SCHEDULE_BY_EMPLOYEE, { params }),
      "Fetch Staff Schedule by Employee ID",
    ),

  addTask: (payload) =>
    handleApiRequest(() => api.post(ADMIN_APIS.ADD_TASK, payload), "Add Task"),

  getTasks: () =>
    handleApiRequest(() => api.get(ADMIN_APIS.GET_TASK), "Fetch Tasks"),

  deleteTask: async (id, onSuccess) => {
    const result = await handleApiRequest(
      () => api.delete(ADMIN_APIS.DELETE_TASK(id)),
      "Delete Task",
    );

    if (result.success) {
      if (typeof onSuccess === "function") onSuccess();
      showNotification({
        message: result.message || "Item deleted successfully",
        type: "success",
      });
    } else {
      if (result.status === 404 && typeof onSuccess === "function") {
        onSuccess();
      }
      showNotification(result);
    }

    return result;
  },

  markAsDoneTask: (id) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.MARK_AS_DONE_TASK(id), null),
      "Mark Task as Done",
    ),

  setPayPeriod: (payload) =>
    handleApiRequest(
      () => api.patch(ADMIN_APIS.SET_PAY_PERIOD, payload),
      "Set Pay Period",
    ),
};

export const {
  getAllActivityShifts,
  getActivityScheduleForAdmin,
  addActivitySchedule,
  addStaffScheduleAdministrator,
  deleteActivityShift,
  addActivityShift,
  addShift,
  deleteShift,
  getStaffScheduleAdministratorForAdmin,
  getStaffScheduleForAdmins,
  addStaffSchedule,
  getActiveEmployees,
  getShifts,
  getStaffScheduleByEmployeeId,
  addTask,
  getTasks,
  deleteTask,
  markAsDoneTask,
  setPayPeriod,
} = adminSchedulingService;

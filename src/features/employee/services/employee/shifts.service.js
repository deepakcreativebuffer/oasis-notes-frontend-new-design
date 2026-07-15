/** @format */

import { api } from "@/features/shared/services";
import { EMPLOYEE_APIS, COMMON_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";
import { showNotification } from "@/utils";

export const employeeShiftsService = {
  getActivitySchedule: () =>
    handleApiRequest(
      () => api.get(EMPLOYEE_APIS.GET_ACTIVITY_SCHEDULE),
      "Fetch Activity Schedule",
    ),

  uploadEmployeeTracking: async ({ url, formData, setLoading, navigate }) => {
    if (setLoading) setLoading(true);
    const result = await handleApiRequest(
      () =>
        api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      "Upload Employee Tracking",
    );
    if (result.success) {
      if (navigate) navigate(-1);
    } else {
      showNotification(result);
    }
    if (setLoading) setLoading(false);
    return result;
  },

  updateEmployeeTracking: async ({ url, formData, setLoading, navigate }) => {
    if (setLoading) setLoading(true);
    const result = await handleApiRequest(
      () =>
        api.put(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      "Update Employee Tracking",
    );
    if (result.success) {
      if (navigate) navigate(-1);
    } else {
      showNotification(result);
    }
    if (setLoading) setLoading(false);
    return result;
  },

  getActivityScheduleForEmployee: (params) =>
    handleApiRequest(
      () =>
        api.get(EMPLOYEE_APIS.EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE, {
          params,
        }),
      "Fetch Activity Schedule For Employee",
    ),

  addEmployeeActivitySchedule: (payload) =>
    handleApiRequest(
      () => api.post(EMPLOYEE_APIS.EMPLOYEE_ADDACTIVITYSCHEDULE, payload),
      "Add Activity Schedule",
    ),

  getActivityScheduleDetails: (formattedMonth, year, facilityId) =>
    handleApiRequest(
      () =>
        api.get(
          EMPLOYEE_APIS.EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE_1(
            formattedMonth,
            year,
            facilityId,
          ),
        ),
      "Fetch Activity Schedule Details",
    ),

  deleteActivityShiftById: (id) =>
    handleApiRequest(
      () => api.delete(COMMON_APIS.SHIFT_DELETE(id)),
      "Delete Activity Shift",
    ),
};

export const {
  getActivitySchedule,
  uploadEmployeeTracking: UploadEmployeeTracking,
  updateEmployeeTracking,
  getActivityScheduleForEmployee,
  addEmployeeActivitySchedule,
  getActivityScheduleDetails,
  deleteActivityShiftById,
} = employeeShiftsService;

/** @format */

import {
  ADMIN_APIS,
  COMMON_APIS,
  EMPLOYEE_APIS,
} from "@/features/shared/services/Apis";
import {
  getApi,
  createApi,
  postApi,
  updateApi,
} from "@/features/shared/services/common/common.api";
import { postForRole } from "@/features/shared/services/core/roleAware";
import { pickUiOptions } from "@/features/shared/services/core/uiOptions";

export const adminPortalService = {
  getDashboardInfo: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETDASHBOARDINFO(),
      context: "Admin: Dashboard Info",
      ...ui,
    });
  },

  getNews: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.NEWS_GETNEWS(),
      context: "Admin: News",
      ...ui,
    });
  },

  getSuperAdminList: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.SUPERADMIN_GETADMIN(),
      context: "Admin: Super Admin List",
      ...ui,
    });
  },

  getActiveUsers: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETUSER_1,
      context: "Admin: Active Users",
      ...ui,
    });
  },

  getActivityLogFormTypes: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.GET_ADMIN_ACTIVITY_LOGS_FORM_TYPE,
      context: "Admin: Activity Log Form Types",
      ...ui,
    });
  },

  getActivityLogs: (queryParams, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.GET_ADMIN_ACTIVITY_LOGS(queryParams),
      context: "Admin: Activity Logs",
      ...ui,
    });
  },

  listTerminations: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_LIST_TERMINATIONS(params.page, params.limit),
      context: "Admin: Terminations List",
      ...ui,
    });
  },

  getEmployeeAllForms: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETALLEMPLOYEEINFOALLFORMS(id),
      context: "Admin: Employee All Forms",
      ...ui,
    });
  },

  getUsersByPermission: (permission, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETUSER(permission),
      context: "Admin: Users By Permission",
      ...ui,
    });
  },

  listPatientTracking: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETALLPATIENTTRACKING(
        params.page,
        params.limit,
        params.debouncedQuery,
      ),
      context: "Admin: Patient Tracking List",
      ...ui,
    });
  },

  updateProfile: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: ADMIN_APIS.ADMIN_UPDATEPROFILE(),
      payload,
      context: "Admin: Update Profile",
      ...ui,
    });
  },

  updateNews: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: COMMON_APIS.NEWS_UPDATENEWS(id),
      payload,
      context: "Admin: Update News",
      ...ui,
    });
  },

  updateShift: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: ADMIN_APIS.ADMIN_EDIT_SHIFT(id),
      payload,
      context: "Admin: Update Shift",
      ...ui,
    });
  },

  updateEmployeeOtherInfo: (employeId, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: ADMIN_APIS.GET_ADMIN_EMPLOYEE_OTHER_INFO(employeId),
      payload,
      context: "Admin: Update Employee Other Info",
      ...ui,
    });
  },

  createNews: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: COMMON_APIS.NEWS_ADDNEWS(),
      payload,
      context: "Admin: Create News",
      ...ui,
    });
  },

  createShift: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: COMMON_APIS.SHIFT_ADD(),
      payload,
      context: "Admin: Create Shift",
      ...ui,
    });
  },

  addStaffScheduleAdministrator: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: ADMIN_APIS.ADMIN_ADDSTAFFSCHEDULEADMINISTRATOR(),
      payload,
      context: "Admin: Add Staff Schedule Administrator",
      ...ui,
    });
  },

  addCreatePermission: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: ADMIN_APIS.ADMIN_ADD_CREATE_PERMISSION(),
      payload,
      context: "Admin: Add Create Permission",
      ...ui,
    });
  },

  createPatientTracking: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return postForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_CREATE_PATIENT_TRACKING,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_PATIENT_TRACKING,
      params.payload ?? payload,
      ui,
    );
  },

  forwardStaffSchedule: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      ADMIN_APIS.FORWARD_STAFF_SCHEDULE,
      payload,
      ui.navigate,
      "Admin: Forward Staff Schedule",
    );
  },

  forwardActivitySchedule: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      ADMIN_APIS.FORWARD_ACTIVITY_SCHEDULE,
      payload,
      ui.navigate,
      "Admin: Forward Activity Schedule",
    );
  },
};

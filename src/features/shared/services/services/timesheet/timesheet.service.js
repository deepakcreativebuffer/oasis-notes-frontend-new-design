/** @format */

import { ADMIN_APIS, COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi, createApi } from "../../common/common.api";
import { createForRole, resolveRoleEndpoint } from "../../core/roleAware";
import { pickUiOptions } from "../../core/uiOptions";

export const timesheetService = {
  listEmployeesTimeSheets: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETEMPLOYEESTIMESHEET,
      context: "Time Sheet: List",
      ...ui,
    });
  },

  getTimeSheetEmployees: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETTIMESHEETEMPLOYEES(),
      context: "Time Sheet: Employees",
      ...ui,
    });
  },

  getProfile: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = resolveRoleEndpoint(
      params.isAdmin,
      ADMIN_APIS.ADMIN_GETPROFILE(),
      EMPLOYEE_APIS.EMPLOYEE_GETPROFILE(),
    );
    return getApi({ url, context: "Time Sheet: Profile", ...ui });
  },

  getTimeSheet: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const {
      isAdmin,
      employeeid,
      startDate,
      endDate,
      facilityId,
      routeEmployeeId,
    } = params;

    let url;
    if (isAdmin && !routeEmployeeId) {
      url = ADMIN_APIS.ADMIN_GET_TIMESHEET(
        employeeid,
        startDate,
        endDate,
        facilityId,
      );
    } else if (routeEmployeeId) {
      url = EMPLOYEE_APIS.EMPLOYEE_GET_TIMESHEET_BY_EMPLOYEE(
        routeEmployeeId,
        startDate,
        endDate,
        facilityId,
      );
    } else {
      url = EMPLOYEE_APIS.EMPLOYEE_GET_TIMESHEET(
        startDate,
        endDate,
        facilityId,
      );
    }

    return getApi({ url, context: "Time Sheet: Get", ...ui });
  },

  getTimeSheetView: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { employeeId, signerId, startDate, endDate } = params;

    const url = employeeId
      ? ADMIN_APIS.ADMIN_GET_TIMESHEET_VIEW(startDate, endDate)
      : EMPLOYEE_APIS.EMPLOYEE_GET_TIMESHEET_BY_SIGNER(signerId);

    return getApi({ url, context: "Time Sheet: View", ...ui });
  },

  getShiftsByFacility: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.SHIFT_GETALL(params.facilityId),
      context: "Schedule: Shifts",
      ...ui,
    });
  },

  getStaffScheduleByEmployee: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { year, month, facilityId } = params;
    return getApi({
      url: COMMON_APIS.STAFFSCHEDULE_GETSTAFFSCHEDULEBYEMPLOYEEID(
        year,
        month,
        facilityId,
      ),
      context: "Schedule: Staff Schedule",
      ...ui,
    });
  },

  createTimeSheet: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_CREATETIMESHEET,
      payload,
      context: "Time Sheet: Create",
      ...ui,
    });
  },

  updateShiftTime: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return createForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_UPDATE_SHIFT(params.employeeId),
      EMPLOYEE_APIS.EMPLOYEE_UPDATESHIFT,
      params.payload ?? payload,
      ui,
    );
  },

  signTimeSheet: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.GET_EMPLOYEE_SIGNEMPLOYEESTIMESHEET(id),
      payload,
      context: "Time Sheet: Sign",
      ...ui,
    });
  },

  updateShiftEntry: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_UPDATESHIFT,
      payload,
      context: "Time Sheet: Update Shift Entry",
      ...ui,
    });
  },
};

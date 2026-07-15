/** @format */

import { ADMIN_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi, removeApi, createApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";
import { resolveRoleEndpoint } from "../../core/roleAware";

export const employeeTrackingService = {
  list: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { page, limit, isAdmin } = params;
    const url = resolveRoleEndpoint(
      isAdmin,
      ADMIN_APIS.ADMIN_LIST_EMPLOYEE_TRACKING(page, limit),
      EMPLOYEE_APIS.EMPLOYEE_LIST_EMPLOYEE_TRACKING(page, limit),
    );
    return getApi({ url, context: "Employee Tracking: List", ...ui });
  },

  delete: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = resolveRoleEndpoint(
      params.isAdmin,
      ADMIN_APIS.ADMIN_DELETE_EMPLOYEE_TRACKING(params.id),
      EMPLOYEE_APIS.EMPLOYEE_DELETE_EMPLOYEE_TRACKING(params.id),
    );
    return removeApi({
      url,
      successMsg: "Deleted Successfully !",
      context: "Employee Tracking: Delete",
      ...ui,
    });
  },

  getTracking: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = params.isAdmin
      ? EMPLOYEE_APIS.EMPLOYEE_GET_TRACKING_BY_EMPLOYEE(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_GET_MY_TRACKING(params.employeeId);
    return getApi({ url, context: "Employee Tracking: Get", ...ui });
  },

  getMultiTracking: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = params.isAdmin
      ? ADMIN_APIS.ADMIN_GET_EMPLOYEE_TRACKING(params.id)
      : EMPLOYEE_APIS.EMPLOYEE_GET_EMPLOYEE_TRACKING(params.id);
    return getApi({ url, context: "Employee Tracking: Multi Get", ...ui });
  },

  create: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_CREATEEMPLOYEETRACKING,
      payload,
      context: "Employee Tracking: Create",
      ...ui,
    });
  },
};

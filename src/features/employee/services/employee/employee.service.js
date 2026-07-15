/** @format */

import {
  ADMIN_APIS,
  COMMON_APIS,
  EMPLOYEE_APIS,
} from "@/features/shared/services/Apis";
import {
  getApi,
  createApi,
} from "@/features/shared/services/common/common.api";
import { pickUiOptions } from "@/features/shared/services/core/uiOptions";
import { resolveRoleEndpoint } from "@/features/shared/services/core/roleAware";

export const employeeService = {
  getEmployee: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETEMPLOYEE(),
      context: "Employee: Get",
      ...ui,
    });
  },

  getActiveEmployees: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETEMPLOYEE_2(),
      context: "Employee: Active List",
      ...ui,
    });
  },

  getProfile: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPROFILE(),
      context: "Employee: Profile",
      ...ui,
    });
  },

  getUsers: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.GET_USER,
      context: "Employee: Users",
      ...ui,
    });
  },

  listActive: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = resolveRoleEndpoint(
      params.isAdmin,
      ADMIN_APIS.ADMIN_GET_EMPLOYEE_ACTIVE,
      EMPLOYEE_APIS.EMPLOYEE_GET_ACTIVE_EMPLOYEES,
    );
    return getApi({ url, context: "Employee: List Active", ...ui });
  },

  listPaginated: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_LISTEMPLOYEES(
        params.limit,
        params.page,
        params.query,
      ),
      context: "Employee: List Paginated",
      ...ui,
    });
  },

  search: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_LISTEMPLOYEES_1(params.limit, params.search),
      context: "Employee: Search",
      ...ui,
    });
  },

  searchPatients: (query, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPATIENT(query),
      context: "Employee: Search Patients",
      ...ui,
    });
  },

  getNotifications: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = resolveRoleEndpoint(
      params.isAdmin,
      ADMIN_APIS.ADMIN_ALL_NOTIFICATION,
      EMPLOYEE_APIS.GET_EMPLOYEE_ALLNOTIFICATION(),
    );
    return getApi({ url, context: "Employee: Notifications", ...ui });
  },

  listUsers: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_USERS(params.queryString),
      context: "Employee: List Users",
      ...ui,
    });
  },

  uploadDocumentForEmployee: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_CREATEUPLOADDOCUMENTFOREMPLOYEE(),
      payload,
      context: "Employee: Upload Document",
      ...ui,
    });
  },
};

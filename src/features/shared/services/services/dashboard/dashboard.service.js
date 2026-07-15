/** @format */

import { EMPLOYEE_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";

export const dashboardService = {
  getEmployeeDashboard: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.GET_EMPLOYEE_DASHBOARD,
      context: "Employee Dashboard",
      ...ui,
    });
  },
};

/** @format */

import { COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";
import { postApi } from "../../common/common.api";

export const timeOffService = {
  requests: defineResourceService("Time Off Request", {
    list: ({ page, limit }) => COMMON_APIS.GET_TIME_OFF_REQUEST(page, limit),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETTIMEOFFREQUESTBYID(id),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETETIMEOFFREQUEST(id),
    create: EMPLOYEE_APIS.EMPLOYEE_CREATE_TIMEOFF_REQUEST,
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITTIMEOFFREQUESTBYIDS(id),
  }),

  getRequestById: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return timeOffService.requests.getById(recordId, ui);
  },

  createRequest: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_TIMEOFF_REQUEST,
      payload,
      ui.navigate,
      "Time Off Request: Create",
    );
  },
};

/** @format */

import { COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi, postApi } from "../../common/common.api";
import { buildQueryString } from "../../core/queryBuilder";
import { pickUiOptions } from "../../core/uiOptions";

export const patientService = {
  getById: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPATIENTBYID(patientId),
      context: "Patient: Get By ID",
      ...ui,
    });
  },

  listAssignedResidents: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { search, limit, page, debouncedQuery, mars, queryString } = params;

    const url = queryString
      ? COMMON_APIS.GET_ASSIGNED_RESIDENTS(queryString)
      : COMMON_APIS.GET_ASSIGNED_RESIDENTS(
          buildQueryString({
            isActive: true,
            view: "list",
            ...(mars ? { mars: true } : {}),
            searchQuery: search ?? debouncedQuery,
            limit,
            page,
          }).slice(1),
        );

    return getApi({ url, context: "Patient: Assigned Residents", ...ui });
  },

  getPatientTracking: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: `employee/getAllPatientTracking/${patientId}`,
      context: "Patient: Tracking",
      ...ui,
    });
  },

  listForSearch: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const query = buildQueryString({
      isActive: true,
      view: "list",
      ...(params.mars ? { mars: true } : {}),
      searchQuery: params.search,
      limit: params.limit,
    }).slice(1);

    return getApi({
      url: COMMON_APIS.GET_ASSIGNED_RESIDENTS(query),
      context: "Patient: Search List",
      ...ui,
    });
  },

  createAppointment: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_APPOINTMENT,
      payload,
      ui.navigate,
      "Patient: Create Appointment",
    );
  },
};

/** @format */

import { ADMIN_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { createForRole, updateForRole } from "../../core/roleAware";
import { pickUiOptions } from "../../core/uiOptions";

export const clinicalOversightService = {
  list: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { page, limit } = params;
    return getApi({
      url: `/clinical-oversight?page=${page}&limit=${limit}`,
      context: "Clinical Oversight: List",
      ...ui,
    });
  },

  getNotesById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETNOTESBYID(id),
      context: "Clinical Oversight: Get Notes",
      ...ui,
    });
  },

  update: (id, payload, options = {}) => {
    const { params, ui } = pickUiOptions({ id, payload, ...options });
    const recordId = params.id ?? id;
    const body = params.payload ?? payload;
    return updateForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_EDIT_CLINICAL_OVERSIGHT(recordId),
      EMPLOYEE_APIS.EMPLOYEE_EDIT_CLINICAL_OVERSIGHT(recordId),
      body,
      ui,
    );
  },

  create: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return createForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_ADD_CLINICAL_OVERSIGHT,
      EMPLOYEE_APIS.EMPLOYEE_ADD_CLINICAL_OVERSIGHT,
      params.payload ?? payload,
      ui,
    );
  },
};

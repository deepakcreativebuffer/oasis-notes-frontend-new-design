/** @format */

import { COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";

export const assistanceService = {
  selfAdministration: defineResourceService(
    "Assistance With Self Administration",
    {
      list: ({ page, limit }) =>
        COMMON_APIS.GET_ASSISTANCE_WITH_SELF_ADMINISTRATION(page, limit),
      getById: (id) =>
        COMMON_APIS.GET_ASSISTANCE_WITH_SELF_ADMINISTRATION_1(id),
      remove: (id) =>
        EMPLOYEE_APIS.EMPLOYEE_DELETEASSISTANCEWITHSELFADMINISTRATION(id),
      create: EMPLOYEE_APIS.EMPLOYEE_ADDASSISTANCEWITHSELFADMINISTRATION,
      update: (id) => COMMON_APIS.GET_ASSISTANCE_WITH_SELF_ADMINISTRATION_1(id),
    },
  ),

  getDetailPaginated: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return getApi({
      url: COMMON_APIS.GET_ASSISTANCE_WITH_SELF_ADMINISTRATION_2(
        recordId,
        params.page,
        params.limit,
      ),
      context: "Assistance: Detail Paginated",
      ...ui,
    });
  },
};

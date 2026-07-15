/** @format */

import { ADMIN_APIS, COMMON_APIS } from "../../Apis";
import { getApi, postApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";

export const facilityService = {
  list: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.LIST_FACILITY,
      context: "Facility: List",
      ...ui,
    });
  },

  create: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      ADMIN_APIS.ADMIN_ADD_FACILITY,
      payload,
      ui.navigate,
      "Facility: Create",
    );
  },
};

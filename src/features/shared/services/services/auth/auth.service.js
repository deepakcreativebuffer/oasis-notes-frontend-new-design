/** @format */

import { COMMON_APIS } from "../../Apis";
import { getApi, postApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";

export const authService = {
  logout: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_LOGOUT,
      context: "Auth: Logout",
      ...ui,
    });
  },

  changePassword: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      COMMON_APIS.CHANGE_PASSWORD,
      payload,
      ui.navigate,
      "Auth: Change Password",
    );
  },
};

/** @format */

import api from "../../baseApi";
import { ADMIN_APIS } from "../../Apis";
import { handleApiRequest } from "../../core/errorHandler";
import { showNotification } from "@/utils";

export const updateCompanyLogo = ({ setLoading, payload }) => {
  return async () => {
    if (setLoading) setLoading(true);
    const result = await handleApiRequest(
      () =>
        api.put(ADMIN_APIS.COMPANY_LOGO, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      "Update Company Logo",
    );
    if (result.success) {
      showNotification({
        message: result.message || "Company logo updated successfully",
      });
    } else {
      showNotification(result);
    }
    if (setLoading) setLoading(false);
    return result;
  };
};

export { updateCompanyLogo as UpdateProfileLogo };

export const setPassword = (payload) =>
  handleApiRequest(
    () =>
      api.post(ADMIN_APIS.SET_PASSWORD, payload, {
        withCredentials: true,
      }),
    "Set Password",
  );

/** @format */

import api, { BASE_URL } from "../../baseApi";
import { AUTH_APIS } from "../../Apis";
import { LoginSlice, LOGOUT, UpdateUserProfile } from "@/store/authSlice";
import { handleApiRequest } from "../../core/errorHandler";
import { ROUTES } from "@/features/shared/constants/index";
import ENV from "@/features/shared/config/env";
import { showNotification } from "@/utils";

export const GenerateOtp = async ({ setLoading, payload }) => {
  if (setLoading) setLoading(true);
  const result = await handleApiRequest(
    () =>
      api.post(AUTH_APIS.OTP_CHALLENGE, payload, {
        withCredentials: true,
      }),
    "Generation of OTP",
  );
  if (result.success) {
    showNotification({
      message: result.message || "OTP sent successfully",
    });
  } else {
    showNotification(result);
  }
  if (setLoading) setLoading(false);
  return result;
};

export const LoginUser =
  ({ setLoading, payload }) =>
  async (dispatch) => {
    if (setLoading) setLoading(true);

    try {
      const res = await api.post(AUTH_APIS.OTP_VERIFY_CHALLENGE, payload, {
        withCredentials: true,
      });
      const data = {
        profile: res?.data,
        payload,
      };
      dispatch(LoginSlice(data));
      if (setLoading) setLoading(false);
      return res.data;
    } catch (error) {
      if (setLoading) setLoading(false);
      throw error;
    }
  };

export const LogOutHandler = (navigate) => {
  return async (dispatch) => {
    dispatch(LOGOUT());
    import("@/lib/queryClient").then(({ queryClient }) => {
      queryClient.clear();
    });
    navigate(ROUTES.HOME);
    showNotification({
      message: "Logged Out Successfully",
      type: "success",
    });
  };
};

export const UpdateProfile = ({ setLoading, payload, url, isAdmin }) => {
  return async (dispatch) => {
    if (setLoading) setLoading(true);
    const baseUrl = isAdmin ? ENV.BASE_URL : BASE_URL;
    const fullUrl = url
      ? `${baseUrl}${url}`
      : `${baseUrl}employee/updateProfile`;
    const result = await handleApiRequest(
      () =>
        api.put(fullUrl, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
      "Update Profile",
    );
    if (result.success) {
      dispatch(UpdateUserProfile(result.data));
      showNotification({
        message: result.message || "Profile updated successfully",
      });
    } else {
      showNotification(result);
    }
    if (setLoading) setLoading(false);
    return result;
  };
};

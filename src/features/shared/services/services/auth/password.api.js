/** @format */

import api from "../../baseApi";
import { AUTH_APIS } from "../../Apis";
import { handleApiRequest } from "../../core/errorHandler";

export const requestPasswordReset = (email) =>
  handleApiRequest(
    () => api.post(AUTH_APIS.FORGET_PASSWORD, { email }),
    "Forget Password",
  );

export const verifyForgotPasswordOtp = (email, otp) =>
  handleApiRequest(
    () => api.post(AUTH_APIS.FORGOT_VERIFY_OTP, { email, otp }),
    "Forgot Password OTP Verification",
  );

/** @format */

import {
  GenerateOtp,
  LoginUser,
  LogOutHandler,
  UpdateProfile,
} from "./login.api";
import { UpdateProfileLogo } from "./adminAuth.api";
import {
  getProfileByUserType,
  refreshSession,
  getAdminProfile,
} from "./profile.api";
import { setActiveOrganization } from "./organization.api";
import { requestPasswordReset, verifyForgotPasswordOtp } from "./password.api";

export {
  GenerateOtp,
  LoginUser,
  LogOutHandler,
  UpdateProfile,
  UpdateProfileLogo,
  getProfileByUserType,
  refreshSession,
  getAdminProfile,
  setActiveOrganization,
  requestPasswordReset,
  verifyForgotPasswordOtp,
};

export const authSessionService = {
  generateOtp: GenerateOtp,
  loginUser: LoginUser,
  logOutHandler: LogOutHandler,
  updateProfile: UpdateProfile,
  updateProfileLogo: UpdateProfileLogo,
  getProfileByUserType,
  refreshSession,
  getAdminProfile,
  setActiveOrganization,
  requestPasswordReset,
  verifyForgotPasswordOtp,
};

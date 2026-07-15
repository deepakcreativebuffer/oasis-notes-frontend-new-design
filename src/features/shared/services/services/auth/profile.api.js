/** @format */

import api from "../../baseApi";
import { handleApiRequest } from "../../core/errorHandler";
import {
  ADMIN_APIS,
  EMPLOYEE_APIS,
  RESIDENT_APIS,
  COMMON_APIS,
} from "../../Apis";

const PROFILE_ENDPOINTS = {
  Admin: ADMIN_APIS.ADMIN_GETPROFILE(),
  Employee: EMPLOYEE_APIS.EMPLOYEE_GETPROFILE(),
  Patient: RESIDENT_APIS.PATIENT_GETPROFILE(),
  Guardian: RESIDENT_APIS.PATIENT_GETPROFILE(),
};

export const getProfileByUserType = (userType) => {
  const endpoint = PROFILE_ENDPOINTS[userType];
  if (!endpoint) {
    return Promise.resolve({
      success: false,
      message: "Unknown user type",
    });
  }

  return handleApiRequest(
    () => api.get(endpoint),
    `Fetch Profile: ${userType}`,
  );
};

export const refreshSession = () =>
  handleApiRequest(
    () => api.get(COMMON_APIS.GET_REFRESH_TOKEN),
    "Refresh Session",
  );

export const getAdminProfile = () =>
  handleApiRequest(
    () => api.get(ADMIN_APIS.GET_ADMIN_PROFILE),
    "Fetch Admin Profile",
  );

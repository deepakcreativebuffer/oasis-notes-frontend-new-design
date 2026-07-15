/** @format */

import api from "../../baseApi";
import { ADMIN_APIS, EMPLOYEE_APIS } from "../../Apis";
import { handleApiRequest } from "../../core/errorHandler";
import { ROLES } from "@/features/shared/constants/index";

export const createEmployeeApplication = (payload) =>
  handleApiRequest(
    () => api.post(EMPLOYEE_APIS.EMPLOYEE_ADDEMPLOYEEAPPLICATION, payload),
    "Create Employee Application",
  );

export const updateEmployeeApplication = (employeId, payload) =>
  handleApiRequest(
    () =>
      api.put(ADMIN_APIS.GET_ADMIN_EMPLOYEE_APPLICATION(employeId), payload),
    "Update Employee Application",
  );

export const getEmployeeApplication = (userType, employeId) => {
  const endpoint =
    userType !== ROLES.ADMIN
      ? "employee/viewEmployeeApplication"
      : `employee/viewEmployeeApplicationByEmployeeId/${employeId}`;

  return handleApiRequest(
    () => api.get(endpoint),
    "Fetch Employee Application",
  );
};

export const createEmployeeEducation = (payload) =>
  handleApiRequest(
    () => api.post(EMPLOYEE_APIS.EMPLOYEE_ADDEMPLOYEEEDUCATION, payload),
    "Create Employee Education",
  );

export const updateEmployeeEducation = (employeId, payload) =>
  handleApiRequest(
    () => api.put(ADMIN_APIS.GET_ADMIN_EMPLOYEE_EDUCATION(employeId), payload),
    "Update Employee Education",
  );

export const getEmployeeEducation = (userType, employeId) => {
  const endpoint =
    userType !== ROLES.ADMIN
      ? "employee/viewEmployeeEducation"
      : `employee/viewEmployeeEducationByEmployeeId/${employeId}`;

  return handleApiRequest(() => api.get(endpoint), "Fetch Employee Education");
};

export const createEmployeeHistory = (payload) =>
  handleApiRequest(
    () => api.post(EMPLOYEE_APIS.EMPLOYEE_ADDEMPLOYEEHISTORY, payload),
    "Create Employee History",
  );

export const updateEmployeeHistory = (employeId, payload) =>
  handleApiRequest(
    () => api.put(ADMIN_APIS.GET_ADMIN_EMPLOYEE_HISTORY(employeId), payload),
    "Update Employee History",
  );

export const getEmployeeHistory = (userType, employeId) => {
  const endpoint =
    userType !== ROLES.ADMIN
      ? "employee/viewEmployeeHistory"
      : `employee/viewEmployeeHistoryByEmployeeId/${employeId}`;

  return handleApiRequest(() => api.get(endpoint), "Fetch Employee History");
};

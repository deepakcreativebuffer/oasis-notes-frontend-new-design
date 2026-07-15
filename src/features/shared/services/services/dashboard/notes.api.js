/** @format */

import api from "../../baseApi";
import { EMPLOYEE_APIS } from "../../Apis";
import { handleApiRequest } from "../../core/errorHandler";

export const getEmployeeNotes = () =>
  handleApiRequest(
    () => api.get(EMPLOYEE_APIS.GET_EMPLOYEE_NOTES),
    "Fetch Employee Notes",
  );

export const getDashboardData = () =>
  handleApiRequest(
    () => api.get(EMPLOYEE_APIS.DASHBOARD),
    "Fetch Dashboard Data",
  );

export const getDashboardStats = () =>
  handleApiRequest(
    () => api.get(EMPLOYEE_APIS.DASHBOARD_STATS),
    "Fetch Dashboard Stats",
  );

export const getPatientList = () =>
  handleApiRequest(
    () => api.get(EMPLOYEE_APIS.GET_PATIENT_LIST),
    "Fetch Patient List",
  );

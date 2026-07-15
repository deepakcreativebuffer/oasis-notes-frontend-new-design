/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminAdmitLogsService = {
  getAdminResidents: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ADMIN_RESIDENTS),
      "Fetch Admin Residents",
    ),

  getUsers: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_USER, { params }),
      "Fetch Admin Users",
    ),

  getAdmitDetails: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ADMIT_DETAILS, { params }),
      "Fetch Admit Details",
    ),

  addAdmitDetails: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_ADMIT_DETAILS, payload),
      "Add Admit Details",
    ),

  updateAdmitDetails: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_ADMIT_DETAILS(id), payload),
      "Update Admit Details",
    ),

  updateDueDateInPatientTracking: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_DUE_DATE_PATIENT_TRACKING(id), payload),
      "Update Due Date in Patient Tracking",
    ),
};

export const {
  getAdminResidents,
  getUsers,
  getAdmitDetails,
  addAdmitDetails,
  updateAdmitDetails,
  updateDueDateInPatientTracking,
} = adminAdmitLogsService;

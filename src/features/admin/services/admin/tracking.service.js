/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminTrackingService = {
  getAdminUser: () =>
    handleApiRequest(() => api.get(ADMIN_APIS.GET_USER), "Fetch Admin User"),

  deleteAdminTracking: (id) =>
    handleApiRequest(
      () => api.delete(ADMIN_APIS.DELETE_TRACKING(id)),
      "Delete Admin Tracking",
    ),

  getAdminTracking: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_TRACKING, { params }),
      "Fetch Admin Tracking",
    ),

  addAdminTracking: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_TRACKING, payload),
      "Add Admin Tracking",
    ),

  updateAdminTracking: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_TRACKING(id), payload),
      "Update Admin Tracking",
    ),
};

export const {
  getAdminUser,
  deleteAdminTracking,
  getAdminTracking,
  addAdminTracking,
  updateAdminTracking,
} = adminTrackingService;

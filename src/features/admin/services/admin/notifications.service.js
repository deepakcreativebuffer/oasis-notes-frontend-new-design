/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminNotificationsService = {
  sendNotification: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.SEND_NOTIFICATION, payload),
      "Send Notification",
    ),

  getAllNotifications: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ALL_NOTIFICATIONS),
      "Fetch All Notifications",
    ),

  getSuperadminNotifications: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_SUPERADMIN_NOTIFICATION),
      "Fetch Superadmin Notifications",
    ),
};

export const {
  sendNotification,
  getAllNotifications,
  getSuperadminNotifications,
} = adminNotificationsService;

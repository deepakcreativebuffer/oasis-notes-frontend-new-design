/** @format */
import api from "../../baseApi";
import { EMPLOYEE_APIS, COMMON_APIS } from "../../Apis";
import { handleApiRequest } from "../../core/errorHandler";

export const getNotifications = (page = 1) =>
  handleApiRequest(
    () =>
      api.get(
        COMMON_APIS.GET_BASE_API_1(EMPLOYEE_APIS.GET_NOTIFICATIONS, page),
      ),
    "Fetch Notifications",
  );

export const markNotificationRead = (id) =>
  handleApiRequest(
    () => api.put(EMPLOYEE_APIS.MARK_NOTIFICATION_READ(id)),
    "Mark Notification Read",
  );

/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminTimeOffService = {
  getAllTimeOffRequestsForAdmin: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ALL_TIME_OFF_REQUESTS_FOR_ADMIN),
      "Fetch All Time Off Requests",
    ),

  deleteTimeOffRequest: (id) =>
    handleApiRequest(
      () => api.delete(ADMIN_APIS.DELETE_TIME_OFF_REQUEST(id)),
      "Delete Time Off Request",
    ),

  updateTimeOffRequestStatus: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_TIME_OFF_REQUEST_STATUS(id), payload),
      "Update Time Off Request Status",
    ),
};

export const {
  getAllTimeOffRequestsForAdmin,
  deleteTimeOffRequest,
  updateTimeOffRequestStatus,
} = adminTimeOffService;

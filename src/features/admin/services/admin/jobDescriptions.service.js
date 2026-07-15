/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminJobDescriptionsService = {
  getAllJobDescriptions: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ALL_JOB_DESCRIPTIONS),
      "Fetch All Job Descriptions",
    ),

  addJobDescription: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_JOB_DESCRIPTION, payload),
      "Add Job Description",
    ),
};

export const { getAllJobDescriptions, addJobDescription } =
  adminJobDescriptionsService;

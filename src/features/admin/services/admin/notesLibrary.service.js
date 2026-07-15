/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminNotesLibraryService = {
  getAllBhrfTherapyTopics: (params) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ALL_BHRF_TOPICS, { params }),
      "Fetch All Bhrf Therapy Topics",
    ),

  deleteBhrfTherapyTopic: (id) =>
    handleApiRequest(
      () => api.delete(ADMIN_APIS.DELETE_BHRF_TOPIC(id)),
      "Delete Bhrf Therapy Topic",
    ),

  cloneBhrfTherapyTopic: (id) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.CLONE_BHRF_TOPIC(id)),
      "Clone Bhrf Therapy Topic",
    ),

  addBhrfTherapySuper: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_BHRF_THERAPY_SUPER, payload),
      "Add Bhrf Therapy Super",
    ),

  addBhrfTherapyTopic: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_BHRF_TOPIC, payload),
      "Add Bhrf Therapy Topic",
    ),

  editBhrfTherapyTopic: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.EDIT_BHRF_TOPIC(id), payload),
      "Edit Bhrf Therapy Topic",
    ),
};

export const {
  getAllBhrfTherapyTopics,
  deleteBhrfTherapyTopic,
  cloneBhrfTherapyTopic,
  addBhrfTherapySuper,
  addBhrfTherapyTopic,
  editBhrfTherapyTopic,
} = adminNotesLibraryService;

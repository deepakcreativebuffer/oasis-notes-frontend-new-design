/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminReferenceCheckService = {
  createReferenceCheck: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.CREATE_REFERENCE_CHECK, payload),
      "Create Reference Check",
    ),

  editReferenceCheck: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.EDIT_REFERENCE_CHECK(id), payload),
      "Edit Reference Check",
    ),
};

export const { createReferenceCheck, editReferenceCheck } =
  adminReferenceCheckService;

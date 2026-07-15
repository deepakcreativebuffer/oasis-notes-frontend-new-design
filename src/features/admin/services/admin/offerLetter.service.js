/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";
import { showNotification } from "@/utils";

export const adminOfferLetterService = {
  getOfferLetterByEmployeeId: (employeeId) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_OFFER_LETTER_BY_EMPLOYEE_ID(employeeId)),
      "Fetch Offer Letter by Employee ID",
    ),

  addOfferLetter: async (payload) => {
    const result = await handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_OFFER_LETTER, payload),
      "Add Offer Letter",
    );

    if (!result.success) {
      showNotification(result);
    }

    return result.originalError ? Promise.reject(result.originalError) : result;
  },
};

export const { getOfferLetterByEmployeeId, addOfferLetter } =
  adminOfferLetterService;

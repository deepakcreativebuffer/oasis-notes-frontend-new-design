/** @format */

import api from "../../baseApi";
import { handleApiRequest } from "../../core/errorHandler";
import { EMPLOYEE_APIS } from "../../Apis";

/**
 * Persist active organization on the server (PUT setActiveOrg).
 */
export async function setActiveOrganization(organizationId) {
  if (!organizationId) {
    return {
      success: false,
      message: "No organization selected",
    };
  }

  const result = await handleApiRequest(
    () =>
      api.put(EMPLOYEE_APIS.EMPLOYEE_UPDATE_ACTIVE_ORGANIZATION, {
        activeOrganizationId: organizationId,
      }),
    "Set Active Organization",
  );

  if (result.success) {
    const activeId =
      result.data?.activeOrganizationId ||
      result.data?.organizationId ||
      organizationId;
    return {
      success: true,
      activeOrganizationId: activeId,
    };
  }

  return {
    success: false,
    message: result.message || "Failed to set active organization",
  };
}

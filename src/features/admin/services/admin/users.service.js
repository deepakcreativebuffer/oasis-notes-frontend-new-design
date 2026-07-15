/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS, EMPLOYEE_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";
import { ROLES } from "@/features/shared/constants";

export const adminUsersService = {
  getAdminUsers: () =>
    handleApiRequest(() => api.get(ADMIN_APIS.GET_USER), "Fetch Admin Users"),

  getAdminEmployees: () =>
    handleApiRequest(
      () =>
        api.get(ADMIN_APIS.GET_EMPLOYEE, {
          params: { isActive: true, userType: ROLES.EMPLOYEE },
        }),
      "Fetch Admin Employees",
    ),

  getUsersByRole: (userType) => {
    const endpoint =
      userType === ROLES.ADMIN ? ADMIN_APIS.GET_USER : EMPLOYEE_APIS.GET_USER;

    return handleApiRequest(
      () => api.get(endpoint),
      `Fetch Users: ${userType}`,
    );
  },
};

export const { getAdminUsers, getAdminEmployees, getUsersByRole } =
  adminUsersService;

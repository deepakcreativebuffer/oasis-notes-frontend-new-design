/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminEmployeePerformanceService = {
  createEmployeePerformanceReview: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.CREATE_EMPLOYEE_PERFORMANCE_REVIEW, payload),
      "Create Employee Performance Review",
    ),
};

export const { createEmployeePerformanceReview } =
  adminEmployeePerformanceService;

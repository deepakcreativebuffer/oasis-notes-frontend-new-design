/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminContactsService = {
  getUserById: (id) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_USER_BY_ID(id)),
      "Get User By Id",
    ),
  updateUserStatus: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_USER_STATUS(id), payload),
      "Update User Status",
    ),
  updateAdminUser: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_USER(id), payload),
      "Update Admin User",
    ),
  assignPatientToGuardian: (id, payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ASSIGN_PATIENT_TO_GUARDIAN(id), payload),
      "Assign Patient To Guardian",
    ),
  assignEmployeesToPatient: (id, payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ASSIGN_EMPLOYEES_TO_PATIENT(id), payload),
      "Assign Employees To Patient",
    ),
  removeEmployeeFromPatient: (patientId, employeeId) =>
    handleApiRequest(
      () =>
        api.delete(
          ADMIN_APIS.REMOVE_EMPLOYEE_FROM_PATIENT(patientId, employeeId),
        ),
      "Remove Employee From Patient",
    ),
  createAdminUser: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.CREATE_USER, payload),
      "Create Admin User",
    ),
};

export const {
  getUserById,
  updateUserStatus,
  updateAdminUser,
  assignPatientToGuardian,
  assignEmployeesToPatient,
  removeEmployeeFromPatient,
  createAdminUser,
} = adminContactsService;

/** @format */

import { api } from "@/features/shared/services";
import { ADMIN_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";

export const adminMedicationsService = {
  deleteMedicationEmployee: (id) =>
    handleApiRequest(
      () => api.delete(ADMIN_APIS.DELETE_MEDICATION_EMPLOYEE(id)),
      "Delete Medication Employee",
    ),

  getAllMedicationEmployee: () =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_ALL_MEDICATION_EMPLOYEE),
      "Fetch All Medication Employees",
    ),

  addMedicationEmployee: (payload) =>
    handleApiRequest(
      () => api.post(ADMIN_APIS.ADD_MEDICATION_EMPLOYEE, payload),
      "Add Medication Employee",
    ),

  getAdminMedicationEmployeeById: (id) =>
    handleApiRequest(
      () => api.get(ADMIN_APIS.GET_MEDICATION_EMPLOYEE_BY_ID(id)),
      "Fetch Medication Employee by ID",
    ),

  updateMedicationEmployee: (id, payload) =>
    handleApiRequest(
      () => api.put(ADMIN_APIS.UPDATE_MEDICATION_EMPLOYEE(id), payload),
      "Update Medication Employee",
    ),
};

export const {
  deleteMedicationEmployee,
  getAllMedicationEmployee,
  addMedicationEmployee,
  getAdminMedicationEmployeeById,
  updateMedicationEmployee,
} = adminMedicationsService;

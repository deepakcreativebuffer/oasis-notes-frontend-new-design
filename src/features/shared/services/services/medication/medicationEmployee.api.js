/** @format */

import api from "../../baseApi";
import { ADMIN_APIS, EMPLOYEE_APIS } from "../../Apis";
import { handleApiRequest } from "../../core/errorHandler";
import { ROLES } from "@/features/shared/constants/index";

export const disableMedicationTimeStatus = (medicationId, timeStatus) =>
  handleApiRequest(
    () =>
      api.delete(
        ADMIN_APIS.GET_ADMIN_MEDICATION_DISABLE_TIMESTATUS(medicationId),
        {
          data: { timeStatus },
        },
      ),
    "Disable Medication Time Status",
  );

export const deleteMedicationTimeStatus = (medicationId, timeStatus) =>
  handleApiRequest(
    () =>
      api.delete(ADMIN_APIS.ADMIN_MEDICATION_DELETE_TIMESTATUS(medicationId), {
        data: { timeStatus },
      }),
    "Delete Medication Time Status",
  );

export const getResidentsForMedication = (isAdmin) => {
  const endpoint = isAdmin
    ? "admin/getUser?isActive=true"
    : "get-assigned-residents?isActive=true&view=list";

  return handleApiRequest(
    () => api.get(endpoint),
    "Fetch Residents For Medication",
  );
};

export const addMedicationEmployeeRecord = (isAdmin, formData) => {
  const endpoint = isAdmin
    ? "admin/addMedicationEmployee"
    : "employee/addMedicationEmployee";

  return handleApiRequest(
    () => api.post(endpoint, formData),
    "Add Medication Employee",
  );
};

export const getMedicationEmployeeById = (noteId) =>
  handleApiRequest(
    () => api.get(EMPLOYEE_APIS.EMPLOYEE_GETMEDICATIONEMPLOYEEBYID(noteId)),
    "Fetch Medication Employee By ID",
  );

export const updateMedicationEmployeeRecord = (id, formData) =>
  handleApiRequest(
    () =>
      api.put(EMPLOYEE_APIS.EMPLOYEE_UPDATEMEDICATIONEMPLOYEE(id), formData),
    "Update Medication Employee",
  );

export const toggleMedicationInstructionStatus = (noteId, mainId, status) =>
  handleApiRequest(
    () =>
      api.put(
        EMPLOYEE_APIS.EMPLOYEE_UPDATESTATUSININSTRUCTIONINMEDICATIONEMPLOYEE(
          noteId,
          mainId,
        ),
        { status },
      ),
    "Toggle Medication Instruction Status",
  );

export const deleteMarsMedication = (medId) =>
  handleApiRequest(
    () => api.delete(ADMIN_APIS.GET_ADMIN_MARS_MEDICATION(medId)),
    "Delete Mars Medication",
  );

export const saveMarsMedication = (marsId, medication) =>
  handleApiRequest(
    () =>
      api.put(
        ADMIN_APIS.ADMIN_MEDICATION_ADD_MARS_MEDICATION(marsId),
        medication,
      ),
    "Save Mars Medication",
  );

export const saveMedicationTimeStatus = (medicationId, payload) =>
  handleApiRequest(
    () =>
      api.put(
        ADMIN_APIS.ADMIN_MEDICATION_ADD_TIMESTATUS(medicationId),
        payload,
      ),
    "Save Medication Time Status",
  );

export const filterResidentsForMedication = (result, userType) => {
  if (!result.success) return [];

  const docs =
    result.data?.docs ||
    result.data?.data?.docs ||
    result.data?.data ||
    result.data ||
    [];

  if (userType === ROLES.ADMIN) {
    return Array.isArray(docs)
      ? docs.filter((item) => item.userType === ROLES.PATIENT)
      : [];
  }

  return Array.isArray(docs) ? docs.map((doc) => doc.patientId || doc) : [];
};

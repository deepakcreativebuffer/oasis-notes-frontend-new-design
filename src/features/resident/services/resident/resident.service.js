/** @format */

import { api } from "@/features/shared/services";
import { format } from "date-fns";
import { handleApiRequest } from "@/features/shared/services";
import {
  EMPLOYEE_APIS,
  RESIDENT_APIS,
  COMMON_APIS,
} from "@/features/shared/services";
import { showNotification } from "@/utils";
import { uploadService } from "@/features/shared/services/services/upload/upload.service";
import { UPLOAD_TIMEOUT_MS } from "@/features/shared/constants";

export const residentService = {
  getApiResident: async ({
    url,
    setResponse,
    setLoading,
    additionalFunctions = [],
    isIntake = false,
  }) => {
    if (setLoading) setLoading(true);
    const result = await handleApiRequest(
      () => api.get(url),
      `Resident GET: ${url}`,
    );
    if (result.success) {
      if (setResponse) setResponse(isIntake ? result.data : result.data);
      additionalFunctions.forEach(
        (func) => typeof func === "function" && func(),
      );
    }
    if (setLoading) setLoading(false);
    return result;
  },

  vitalData: async (patient_id, setVitalData) => {
    const patientId = patient_id?._id || patient_id;
    return handleApiRequest(
      () =>
        api.get(EMPLOYEE_APIS.EMPLOYEE_GETPATIENTVITALSBYPATIENTID(patientId)),
      "Fetch Vital Data",
    ).then((res) => {
      if (res.success && setVitalData) setVitalData(res.data);
      return res;
    });
  },

  getAllPatientMedication: async (setScript) => {
    return handleApiRequest(
      () => api.get(RESIDENT_APIS.PATIENT_GETALLPATIENTMEDICATION()),
      "Fetch All Patient Medication",
    ).then((res) => {
      if (res.success && setScript) setScript(res.data);
      return res;
    });
  },

  getResidentIntakeForm: async (id, setGetApiData, setLoading) => {
    if (setLoading) setLoading(true);
    const result = await handleApiRequest(
      () => api.get(RESIDENT_APIS.GET_PATIENT_RESIDENTINTAKE(id)),
      "Fetch Resident Intake Form",
    );
    if (result.success) {
      if (setGetApiData) setGetApiData(result.data);
    } else if (result.status === 404) {
      showNotification({
        message: result.message,
        type: "danger",
      });
    }
    if (setLoading) setLoading(false);
    return result;
  },

  bookAppointment: async (payLoad) => {
    const result = await handleApiRequest(
      () => api.post(RESIDENT_APIS.PATIENT_CREATEAPPOINTMENT(), payLoad),
      "Booking Appointment",
    );
    if (result.success) {
      showNotification({
        message: "Appointment Submitted Successfully",
        type: "success",
      });
    } else {
      showNotification(result);
    }
    return result;
  },

  getUpcomingAppointments: async (setAppoinment) => {
    const result = await handleApiRequest(
      () =>
        api.get(RESIDENT_APIS.PATIENT_GETALLUPCOMINGAPPOINTMENTS(new Date())),
      "Fetch Upcoming Appointments",
    );
    if (result.success) {
      if (setAppoinment) setAppoinment(result.data);
    } else if (setAppoinment) {
      setAppoinment([]);
    }
    return result;
  },

  getPastAppointments: async (setAppoinmentPast) => {
    const result = await handleApiRequest(
      () => api.get(RESIDENT_APIS.PATIENT_GETALLPASTAPPOINTMENTS(new Date())),
      "Fetch Past Appointments",
    );
    if (result.success) {
      if (setAppoinmentPast) setAppoinmentPast(result.data);
    } else if (setAppoinmentPast) {
      setAppoinmentPast([]);
    }
    return result;
  },

  deleteAppointment: async (id) => {
    const result = await handleApiRequest(
      () => api.delete(RESIDENT_APIS.PATIENT_DELETEAPPOINTMENT(id)),
      "Delete Appointment",
    );
    if (result.success) {
      showNotification({
        message: "Appointment Deleted Successfully",
        type: "success",
      });
    } else {
      showNotification(result);
    }
    return result;
  },

  deleteDocument: async (id) => {
    const result = await handleApiRequest(
      () => api.delete(COMMON_APIS.DELETE_USER_DOCUMENT(id)),
      "Delete Document",
    );
    if (result.success) {
      showNotification({
        message: "Document Deleted Successfully",
        type: "success",
      });
    } else {
      showNotification(result);
    }
    return result;
  },

  getTodayMedications: async (setMedication) => {
    const formattedDate = format(new Date(), "MM/dd/yyyy");
    const result = await handleApiRequest(
      () =>
        api.get(RESIDENT_APIS.PATIENT_GETALLTODAYAPPOINTMENTS(formattedDate)),
      "Fetch Today's Medications",
    );
    if (result.success && setMedication) {
      setMedication(result.data);
    }
    return result;
  },

  cancelAppointment: async (id) => {
    const result = await handleApiRequest(
      () => api.put(RESIDENT_APIS.GET_PATIENT_CANCELAPPOINTMENT(id), {}),
      "Cancel Appointment",
    );
    if (result.success) {
      showNotification({
        message: "Status Updated Successfully",
        type: "success",
      });
    } else {
      showNotification(result);
    }
    return result;
  },

  getEmployeeDetails: async (setEmploy) => {
    const result = await handleApiRequest(
      () => api.get(RESIDENT_APIS.PATIENT_GETEMPLOYEE()),
      "Fetch Employee Details",
    );
    if (result.success && setEmploy) {
      setEmploy(result.data);
    }
    return result;
  },

  uploadDocument: async ({ payload, setArr, setLoading }) => {
    if (setLoading) setLoading(true);
    const request =
      payload instanceof FormData
        ? () =>
            api.post(
              EMPLOYEE_APIS.EMPLOYEE_CREATEUPLOADDOCUMENTONEBYONE(),
              payload,
              {
                timeout: UPLOAD_TIMEOUT_MS,
                headers: { "Content-Type": "multipart/form-data" },
              },
            )
        : () => {
            if (
              payload &&
              typeof payload === "object" &&
              !Array.isArray(payload) &&
              !(payload instanceof Blob) &&
              !(payload instanceof File) &&
              "file" in payload
            ) {
              const { file, ...rest } = payload;
              return uploadService.uploadMultiple(
                EMPLOYEE_APIS.EMPLOYEE_CREATEUPLOADDOCUMENTONEBYONE(),
                "file",
                file,
                rest,
              );
            }
            return uploadService.uploadMultiple(
              EMPLOYEE_APIS.EMPLOYEE_CREATEUPLOADDOCUMENTONEBYONE(),
              "file",
              payload,
            );
          };
    const result = await handleApiRequest(request, "Upload Resident Document");
    if (result.success) {
      if (setArr) setArr((prev) => [...prev, result.data]);
    } else {
      showNotification(result);
    }
    if (setLoading) setLoading(false);
    return result;
  },

  deleteInitials: async (medicationId, medicationStatusId, timeStatusId) => {
    const url = `mars-medication/${medicationId}/initials?medicationStatusId=${medicationStatusId}&timeStatusId=${timeStatusId}`;
    const result = await handleApiRequest(
      () => api.delete(url),
      "Delete Medication Initials",
    );
    if (result.success) {
      showNotification({
        message: result.message || "Initials deleted successfully",
        type: "success",
      });
    } else {
      showNotification(result);
    }
    return result;
  },

  getPatientDetails: (id) =>
    handleApiRequest(
      () => api.get(RESIDENT_APIS.PATIENT_GETPATIENTDETAILS(id)),
      "Fetch Patient Details",
    ),
};

/** @deprecated Use residentService — kept for backward-compatible re-exports */
export const getApiResident = residentService.getApiResident;
export const vital_data = residentService.vitalData;
export const getAllPatientMedication = residentService.getAllPatientMedication;
export const Resident_form_get = residentService.getResidentIntakeForm;
export const appoinment_Booking = residentService.bookAppointment;
export const appointment_Upcoming = residentService.getUpcomingAppointments;
export const appointment_get = residentService.getPastAppointments;
export const appointment_delete = residentService.deleteAppointment;
export const document_delete = residentService.deleteDocument;
export const medication_get = residentService.getTodayMedications;
export const change_appointment_status = residentService.cancelAppointment;
export const employ_Detail = residentService.getEmployeeDetails;
export const uploadDocumentResident = residentService.uploadDocument;
export const deleteInitials = residentService.deleteInitials;
export const getPatientDetails = residentService.getPatientDetails;

/** @format */

import { COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";

export const searchService = {
  getPatientById: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPATIENTBYID(patientId),
      context: "Search: Patient",
      ...ui,
    });
  },

  getPatientDocuments: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GETDOCUMENTOFPATIENT(patientId),
      context: "Search: Documents",
      ...ui,
    });
  },

  getPatientVitals: (patientId, options = {}) => {
    const { params, ui } = pickUiOptions({ patientId, ...options });
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPATIENTVITALSBYPATIENTID(
        params.patientId ?? patientId,
        params.vitalLimit,
        params.vitalPage,
      ),
      context: "Search: Vitals",
      ...ui,
    });
  },

  getPatientMedications: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GETMEDICATIONOFPATIENT(patientId),
      context: "Search: Medications",
      ...ui,
    });
  },

  getPatientIntake: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GETINTAKEOFPATIENT(patientId),
      context: "Search: Intake",
      ...ui,
    });
  },

  getPatientAppointments: (patientId, options = {}) => {
    const { params, ui } = pickUiOptions({ patientId, ...options });
    return getApi({
      url: COMMON_APIS.GET_APPOINTMENTS(
        params.patientId ?? patientId,
        params.scheduleLimit,
        params.schedulePage,
      ),
      context: "Search: Appointments",
      ...ui,
    });
  },
};

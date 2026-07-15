/** @format */

import { ADMIN_APIS, COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { createForRole, updateForRole } from "../../core/roleAware";
import { pickUiOptions } from "../../core/uiOptions";

export const vitalsService = {
  listPatients: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPATIENT_1(),
      context: "Vitals: List Patients",
      ...ui,
    });
  },

  getByPatient: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { patientId, forFilter, date, isAdmin } = params;
    const url = isAdmin
      ? date
        ? ADMIN_APIS.ADMIN_GET_PATIENT_VITALS(patientId, forFilter, date)
        : ADMIN_APIS.ADMIN_GET_PATIENT_VITALS_WEEK(patientId)
      : date
        ? EMPLOYEE_APIS.EMPLOYEE_GETPATIENTVITALS_FILTERED(
            patientId,
            forFilter,
            date,
          )
        : EMPLOYEE_APIS.EMPLOYEE_GETPATIENTVITALS_WEEK(patientId);

    return getApi({ url, context: "Vitals: Get By Patient", ...ui });
  },

  getById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_VITAL_BY_ID(id),
      context: "Vitals: Get By ID",
      ...ui,
    });
  },

  getByPatientId: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETPATIENTVITALSBYPATIENTID_1(patientId),
      context: "Vitals: Get By Patient ID",
      ...ui,
    });
  },

  create: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return createForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_CREATE_PATIENT_VITALS,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_PATIENT_VITALS,
      params.payload ?? payload,
      ui,
    );
  },

  update: (id, payload, options = {}) => {
    const { params, ui } = pickUiOptions({ id, payload, ...options });
    const recordId = params.id ?? id;
    const body = params.payload ?? payload;
    return updateForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_UPDATE_PATIENT_VITALS(recordId),
      EMPLOYEE_APIS.EMPLOYEE_UPDATE_PATIENT_VITALS(recordId),
      body,
      ui,
    );
  },
};

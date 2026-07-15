/** @format */

import {
  ADMIN_APIS,
  COMMON_APIS,
  EMPLOYEE_APIS,
  RESIDENT_APIS,
} from "../../Apis";
import { createDomainService } from "../../core/crudServiceFactory";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";
import { getApi, updateApi, postApi } from "../../common/common.api";
import { postForRole } from "../../core/roleAware";

const opioidCountCrud = createDomainService("Medication Opioid Count", {
  list: ({ page, limit }) =>
    COMMON_APIS.GET_MEDICATION_OPIOID_COUNT(page, limit),
  getById: (id, { page, limit }) =>
    COMMON_APIS.GET_MEDICATION_OPIOID_COUNT_1(id, page, limit),
  create: EMPLOYEE_APIS.EMPLOYEE_CREATE_OPIOID_COUNT,
  update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITMEDICATIONOPIOIDCOUNTBYID(id),
  remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEMEDICATIONOPIOIDCOUNT(id),
});

export const medicationService = {
  getOpioidCounts: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return opioidCountCrud.list(params, ui);
  },

  getOpioidCountById: (id, options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return opioidCountCrud.getById(id, params, ui);
  },

  updateOpioidCount: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return opioidCountCrud.update(id, payload, ui);
  },

  createOpioidCount: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_OPIOID_COUNT,
      payload,
      ui.navigate,
      "Medication Opioid Count: Create",
    );
  },

  deleteOpioidCount: (id, options = {}) => {
    if (typeof id === "object" && id !== null) {
      const { params, ui } = pickUiOptions(id);
      return opioidCountCrud.remove(params.id, {
        successMsg: "Deleted Successfully !",
        ...ui,
      });
    }
    return opioidCountCrud.remove(id, {
      successMsg: "Deleted Successfully !",
      ...options,
    });
  },

  /** @deprecated Use deleteOpioidCount */
  deleteMedication: (id, options = {}) =>
    medicationService.deleteOpioidCount(id, options),

  informedConsent: defineResourceService("Informed Consent", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_INFORMED_CONSENT_FOR_MEDICATION(page, limit),
    getById: (id, { page, limit }) =>
      COMMON_APIS.GET_INFORMED_CONSENT_FOR_MEDICATION_1(id, page, limit),
    remove: (id) =>
      EMPLOYEE_APIS.EMPLOYEE_DELETEINFORMEDCONSENTFORMEDICATION(id),
    update: (id) => COMMON_APIS.GET_INFORMED_CONSENT_FOR_MEDICATION_2(id),
  }),

  reconciliation: defineResourceService("Medication Reconciliation", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_MEDICATION_RECONCILIATION(page, limit),
    getById: (id, { page, limit }) =>
      COMMON_APIS.GET_MEDICATION_RECONCILIATION_1(id, page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEMEDICATIONRECONCILIATION(id),
    update: (id) => COMMON_APIS.GET_MEDICATION_RECONCILIATION_2(id),
  }),

  mentalStatus: defineResourceService("Mental Status Report", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_MENTAL_STATUS_REPORT(page, limit),
    getById: (id) => RESIDENT_APIS.GET_PATIENT_MENTALSTATUSREPORT(id),
    getByPatientId: (patientId) =>
      RESIDENT_APIS.PATIENT_GETMENTALSTATUSREPORT(patientId),
    remove: (id) => RESIDENT_APIS.GET_PATIENT_MENTALSTATUSREPORT(id),
    create: RESIDENT_APIS.PATIENT_CREATEMENTALSTATUSREPORT,
    update: (id) => RESIDENT_APIS.GET_PATIENT_MENTALSTATUSREPORT(id),
  }),

  prnLog: defineResourceService("PRN Medication Log", {
    list: ({ page, limit }) => COMMON_APIS.GET_PRN_MEDICATION_LOG(page, limit),
    getById: (id, { page, limit }) =>
      COMMON_APIS.GET_PRN_MEDICATION_LOG_1(id, page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEPRNMEDICATIONLOG(id),
    update: (id) => COMMON_APIS.GET_PRN_MEDICATION_LOG_2(id),
  }),

  trackingLog: defineResourceService("Appointment Tracking Log", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_APPOINTMENT_TRACKING_LOG(page, limit),
    getById: (id) => COMMON_APIS.GET_APPOINTMENT_DETAILS(id),
    remove: (id) => RESIDENT_APIS.PATIENT_DELETEAPPOINTMENT(id),
    update: (id) => COMMON_APIS.UPDATE_APPOINTMENT(id),
  }),

  refusal: defineResourceService("Refusal of Medical Treatment", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_REFUSAL_MEDICAL_TREATMENT(page, limit),
    getById: (id) => RESIDENT_APIS.GET_PATIENT_REFUSALMEDICALTREATMENT(id),
    getByPatientId: (patientId) =>
      RESIDENT_APIS.PATIENT_GETREFUSALMEDICALTREATMENT(patientId),
    remove: (id) => RESIDENT_APIS.GET_PATIENT_REFUSALMEDICALTREATMENT(id),
    create: RESIDENT_APIS.PATIENT_CREATEREFUSALMEDICALTREATMENT,
    update: (id) => RESIDENT_APIS.GET_PATIENT_REFUSALMEDICALTREATMENT(id),
  }),

  medicationEmployee: {
    list: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      const { page, limit, searchQuery, debouncedQuery, isAdmin } = params;
      const search = searchQuery ?? debouncedQuery ?? "";
      const url = isAdmin
        ? `admin/getAllMedicationEmployee?page=${page}&limit=${limit}&searchQuery=${search}`
        : `employee/getAllMedicationEmployee?page=${page}&limit=${limit}&searchQuery=${search}`;
      return getApi({
        url,
        context: "Medication Employee: List",
        ...ui,
      });
    },
  },

  mars: {
    getActiveEmployees: (options = {}) => {
      const { ui } = pickUiOptions(options);
      return getApi({
        url: EMPLOYEE_APIS.EMPLOYEE_GETEMPLOYEE_2(),
        context: "MARS: Active Employees",
        ...ui,
      });
    },

    getByPatient: (patientId, options = {}) => {
      const { ui } = pickUiOptions(options);
      return getApi({
        url: EMPLOYEE_APIS.GET_EMPLOYEE_MARS(patientId),
        context: "MARS: By Patient",
        ...ui,
      });
    },

    getPatientMars: (options = {}) => {
      const { ui } = pickUiOptions(options);
      return getApi({
        url: RESIDENT_APIS.PATIENT_GET_MARS(),
        context: "MARS: Patient",
        ...ui,
      });
    },

    forwardMedication: (marsId, options = {}) => {
      const { ui } = pickUiOptions(options);
      return getApi({
        url: ADMIN_APIS.GET_ADMIN_FORWARD_MEDICATION_EMPLOYEE(marsId),
        context: "MARS: Forward Medication",
        showAlert: true,
        ...ui,
      });
    },

    updateStatus: (marsId, payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return updateApi({
        url: EMPLOYEE_APIS.EMPLOYEE_UPDATE_MARS(marsId),
        payload,
        context: "MARS: Update Status",
        ...ui,
      });
    },

    updateRefillCount: (marsId, payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return updateApi({
        url: ADMIN_APIS.ADMIN_UPDATE_REFILL_COUNT(marsId),
        payload,
        context: "MARS: Update Refill Count",
        ...ui,
      });
    },

    updatePrnRow: (medId, rowId, payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return updateApi({
        url: COMMON_APIS.GET_PRM_MEDICATION_LOG(medId, rowId),
        payload,
        context: "MARS: Update PRN Row",
        ...ui,
      });
    },
  },

  createInformedConsent: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return postForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_CREATE_INFORMED_CONSENT,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_INFORMED_CONSENT,
      params.payload ?? payload,
      ui,
    );
  },

  createPrnLog: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return postForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_CREATE_PRN_LOG,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_PRN_LOG,
      params.payload ?? payload,
      ui,
    );
  },

  createReconciliation: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return postForRole(
      params.isAdmin,
      ADMIN_APIS.ADMIN_CREATE_MEDICATION_RECONCILIATION,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_MEDICATION_RECONCILIATION,
      params.payload ?? payload,
      ui,
    );
  },

  createAppointment: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_APPOINTMENT,
      payload,
      ui.navigate,
      "Appointment: Create",
    );
  },
};

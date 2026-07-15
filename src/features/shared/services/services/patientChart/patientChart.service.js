/** @format */

import { COMMON_APIS, EMPLOYEE_APIS, ADMIN_APIS } from "../../Apis";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";
import { getApi } from "../../common/common.api";

const incidentReportBase = defineResourceService("Incident Report", {
  getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETINCIDENTREPORTBYID(id),
  remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEINCIDENTREPORT(id),
  update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_INCIDENT_REPORT(id),
  getByPatientId: (patientId) =>
    ADMIN_APIS.ADMIN_GET_ALL_INCIDENT_REPORT(patientId),
});

const financialRecordBase = defineResourceService("Financial Record", {
  list: ({ page, limit }) =>
    COMMON_APIS.GET_FINANCIAL_TRANSACTIONS_RECORD_2(page, limit),
  getById: (id) =>
    EMPLOYEE_APIS.EMPLOYEE_GETFINANCIALTRANSACTIONSRECORDBYID(id),
  remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEFINANCIALTRANSACTIONSRECORD(id),
  update: (id) => COMMON_APIS.GET_FINANCIAL_TRANSACTIONS_RECORD(id),
});

export const patientChartService = {
  asam: defineResourceService("ASAM Assessment", {
    list: ({ page, limit }) => COMMON_APIS.GET_ASAM_ASSESSMENT(page, limit),
    getById: (id) => COMMON_APIS.GET_ASAM_ASSESSMENT_1(id),
    remove: (id) => COMMON_APIS.GET_ASAM_ASSESSMENT_1(id),
    getByPatientId: (patientId) =>
      COMMON_APIS.GET_ASAM_ASSESSMENT_PATIENTID(patientId),
    create: "asam-assessment",
    update: (id) => COMMON_APIS.GET_ASAM_ASSESSMENT_1(id),
  }),

  bhpProgress: defineResourceService("BHP Progress", {
    list: ({ page, limit }) => COMMON_APIS.GET_BHP_PROGRESS(page, limit),
    getById: (id) => COMMON_APIS.GET_BHP_PROGRESS_1(id),
    remove: (id) => COMMON_APIS.GET_BHP_PROGRESS_1(id),
    getByPatientId: (patientId) =>
      COMMON_APIS.GET_BHP_PROGRESS_PATIENTID(patientId),
    create: "bhp-progress",
    update: (id) => COMMON_APIS.GET_BHP_PROGRESS_1(id),
  }),

  contactNote: defineResourceService("Contact Note", {
    list: ({ page, limit }) => COMMON_APIS.GET_CONTACT_NOTE(page, limit),
    getById: (id) => `employee/getContactNoteById/${id}`,
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETECONTACTNOTE(id),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITCONTACTNOTEBYID(id),
    getByPatientId: (patientId) =>
      ADMIN_APIS.ADMIN_GET_ALL_CONTACT_NOTE(patientId),
  }),

  authorization: defineResourceService("Authorization", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_AUTHORIZATION_FOR_RELEASE_OF_INFORMATION(page, limit),
    getById: (id) =>
      `employee/getAuthorizationForReleaseOfInformationById/${id}`,
    remove: (id) =>
      EMPLOYEE_APIS.EMPLOYEE_DELETEAUTHORIZATIONFORRELEASEOFINFORMATION(id),
    update: (id) =>
      EMPLOYEE_APIS.EMPLOYEE_EDITAUTHORIZATIONFORRELEASEOFINFORMATIONBYID(id),
    getByPatientId: (patientId) =>
      ADMIN_APIS.ADMIN_GET_ALL_AUTHORIZATION_FOR_RELEASE_OF_INFORMATION(
        patientId,
      ),
  }),

  dischargeSummary: defineResourceService("Discharge Summary", {
    list: ({ page, limit }) => COMMON_APIS.GET_DISCHARGE_SUMMARY(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEDISCHARGESUMMARY(id),
    getByPatientId: (patientId) =>
      ADMIN_APIS.ADMIN_GET_ALL_DISCHARGE_SUMMARY(patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITDISCHARGESUMMARYBYID(id),
  }),

  dischargePlanning: defineResourceService("Discharge Planning", {
    list: ({ page, limit }) => COMMON_APIS.GET_DISCHARGE_PLANNING(page, limit),
    getById: (id) => COMMON_APIS.GET_DISCHARGE_PLANNING_1(id),
    remove: (id) => COMMON_APIS.GET_DISCHARGE_PLANNING_1(id),
    getByPatientId: (patientId) =>
      COMMON_APIS.GET_DISCHARGE_PLANNING_PATIENTID(patientId),
    create: "discharge-planning",
    update: (id) => COMMON_APIS.GET_DISCHARGE_PLANNING_1(id),
  }),

  financialRecord: {
    ...financialRecordBase,
    listWithTransactions: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      const { id, page, limit } = params.params ?? params;
      return getApi({
        url: COMMON_APIS.GET_FINANCIAL_TRANSACTIONS_RECORD_1(id, page, limit),
        context: "Financial Record: List With Transactions",
        ...ui,
      });
    },
  },

  progressNote: defineResourceService("Progress Note", {
    list: ({ page, limit }) => COMMON_APIS.GET_PROGRESS_NOTE(page, limit),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETPROGRESSNOTEBYID(id),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEPROGRESSNOTE(id),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITPROGRESSNOTEBYID(id),
    create: (params = {}) =>
      params.isAdmin
        ? ADMIN_APIS.ADMIN_CREATE_PROGRESS_NOTE
        : EMPLOYEE_APIS.EMPLOYEE_CREATE_PROGRESS_NOTE,
  }),

  staffingNote: defineResourceService("Staffing Note", {
    list: ({ page, limit }) => COMMON_APIS.GET_STAFFING_NOTE(page, limit),
    getById: (id) => `employee/getStaffingNoteById/${id}`,
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETESTAFFINGNOTE(id),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITSTAFFINGNOTEBYID(id),
    getByPatientId: (patientId) =>
      ADMIN_APIS.ADMIN_GET_ALL_STAFFING_NOTE(patientId),
  }),

  recertificationOfNeed: defineResourceService("Recertification of Need", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_RECERTIFICATION_OF_NEED(page, limit),
    getById: (docId) => COMMON_APIS.GET_RECERTIFICATION_OF_NEED_1(docId),
    remove: (docId) => COMMON_APIS.GET_RECERTIFICATION_OF_NEED_1(docId),
    getByPatientId: (patientId) =>
      COMMON_APIS.GET_RECERTIFICATION_OF_NEED_PATIENTID(patientId),
    create: "recertification-of-need",
    update: (docId) => COMMON_APIS.GET_RECERTIFICATION_OF_NEED_1(docId),
  }),

  incidentReport: {
    ...incidentReportBase,
    list: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      const url = params.isAdmin
        ? `admin/get-all-incident-report?limit=${params.limit}&page=${params.page}`
        : `employee/getAllIncidentReport?limit=${params.limit}&page=${params.page}`;
      return getApi({
        url,
        context: "Incident Report: List",
        ...ui,
      });
    },
  },

  adlTracking: defineResourceService("ADL Tracking", {
    list: ({ page, limit }) => COMMON_APIS.GET_ADL_TRACKING(page, limit),
    getById: (id) => `employee/getADLTrackingFormById/${id}`,
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEADLTRACKINGFORM(id),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITADLTRACKINGFORMBYID(id),
    getByPatientId: (patientId) =>
      ADMIN_APIS.ADMIN_GET_ALL_ADL_TRACKING_FORM(patientId),
  }),

  reassessment: defineResourceService("Reassessment", {
    list: ({ page, limit, searchQuery }) =>
      `employee/postPatientDetails?page=${page}&limit=${limit}${searchQuery ? `&searchQuery=${searchQuery}` : ""}`,
    getById: (id) => `employee/getPatientById/${id}`,
    remove: (id) => `employee/postPatientDetails/${id}`,
    getByPatientId: (patientId) => `employee/postPatientDetails/${patientId}`,
    create: (params) =>
      `employee/postPatientDetails/${params?.payload?.patientId || params?.patientId}`,
    update: (id, params) =>
      `employee/postPatientDetails/${params?.payload?.patientId || id}`,
  }),
};

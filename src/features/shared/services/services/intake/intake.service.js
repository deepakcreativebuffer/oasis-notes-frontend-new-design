/** @format */

import { COMMON_APIS, EMPLOYEE_APIS, RESIDENT_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";

export const intakeService = {
  faceSheet: defineResourceService("Face Sheet", {
    list: ({ page, limit }) => COMMON_APIS.GET_FACE_SHEET(page, limit),
    remove: (id) => COMMON_APIS.DELETE_FACE_SHEET(id),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETFACESHEETBYID(id),
    create: (params) =>
      EMPLOYEE_APIS.EMPLOYEE_CREATE_FACE_SHEET(params.patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_FACE_SHEET(id),
  }),

  initialAssessment: defineResourceService("Initial Assessment", {
    list: ({ page, limit }) => COMMON_APIS.GET_INITIAL_ASSESSMENTS(page, limit),
    remove: (id) => COMMON_APIS.DELETE_INITIAL_ASSESSMENT(id),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETINITIALASSESSMENTBYID(id),
    create: (params) =>
      EMPLOYEE_APIS.EMPLOYEE_CREATE_INITAL_ASSESSMENT(params.patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_INITAL_ASSESSMENT(id),
  }),

  nursingAssessment: defineResourceService("Nursing Assessment", {
    list: ({ page, limit }) => COMMON_APIS.GET_NURSING_ASSESSMENTS(page, limit),
    remove: (id) => COMMON_APIS.DELETE_NURSING_ASSESSMENT(id),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETNURSINGASSESSMENTBYID(id),
    create: (params) =>
      EMPLOYEE_APIS.EMPLOYEE_CREATE_NURSING_ASSESSMENT(params.patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_NURSING_ASSESSMENT(id),
  }),

  residentIntake: defineResourceService("Resident Intake", {
    list: ({ page, limit }) => COMMON_APIS.GET_RESIDENT_INTAKE(page, limit),
    remove: (id) => COMMON_APIS.DELETE_RESIDENT_INTAKE(id),
    create: (params) =>
      EMPLOYEE_APIS.EMPLOYEE_CREATE_RESIDENT_INTAKE(params.patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_RESIDENT_INTAKE(id),
  }),

  safetyPlan: defineResourceService("Safety Plan", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_RESIDENT_SAFETY_PLAN(page, limit),
    remove: (id) => COMMON_APIS.DELETE_RESIDENT_SAFETY_PLAN(id),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETRESIDENTSAFETYPLANBYID(id),
    create: (params) =>
      EMPLOYEE_APIS.EMPLOYEE_CREATE_SAFETY_PLAN(params.patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_SAFETY_PLAN(id),
  }),

  treatmentPlan: defineResourceService("Treatment Plan", {
    list: ({ page, limit }) => COMMON_APIS.GET_TREATMENT_PLAN(page, limit),
    remove: (id) => COMMON_APIS.DELETE_TREATMENT_PLAN(id),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETTREATMENTPLANBYID(id),
    create: ({ patientId }) =>
      EMPLOYEE_APIS.EMPLOYEE_CREATE_TREATMENT_PLAN(patientId),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_TREATMENT_PLAN(id),
  }),

  getFaceSheet: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    if (params.patientId) {
      return getApi({
        url: RESIDENT_APIS.PATIENT_GETFACESHEET(params.patientId),
        context: "Face Sheet: Patient",
        ...ui,
      });
    }
    return intakeService.faceSheet.getById(params.id, ui);
  },

  getInitialAssessment: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    if (params.patientId) {
      return getApi({
        url: RESIDENT_APIS.GET_PATIENT_INITIALASSESSMENT(params.patientId),
        context: "Initial Assessment: Patient",
        ...ui,
      });
    }
    return intakeService.initialAssessment.getById(params.id, ui);
  },

  getNursingAssessment: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    if (params.patientId) {
      return getApi({
        url: RESIDENT_APIS.PATIENT_GETNURSINGASSESSMENT(params.patientId),
        context: "Nursing Assessment: Patient",
        ...ui,
      });
    }
    return intakeService.nursingAssessment.getById(params.id, ui);
  },

  getResidentIntake: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    if (params.patientId) {
      return getApi({
        url: RESIDENT_APIS.GET_PATIENT_RESIDENTINTAKE(params.patientId),
        context: "Resident Intake: Patient",
        ...ui,
      });
    }
    return getApi({
      url: COMMON_APIS.GET_PATIENT_INTAKE(params.id),
      context: "Resident Intake: Get",
      ...ui,
    });
  },

  getSafetyPlan: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    if (params.patientId) {
      return getApi({
        url: RESIDENT_APIS.PATIENT_GETRESIDENTSAFETYPLAN(params.patientId),
        context: "Safety Plan: Patient",
        ...ui,
      });
    }
    return intakeService.safetyPlan.getById(params.id, ui);
  },

  getResidentEmployees: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: RESIDENT_APIS.PATIENT_GETEMPLOYEE,
      context: "Intake: Resident Employees",
      ...ui,
    });
  },
};

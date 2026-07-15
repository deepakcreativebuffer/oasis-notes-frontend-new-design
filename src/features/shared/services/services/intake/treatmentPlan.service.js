/** @format */

import { COMMON_APIS, EMPLOYEE_APIS, RESIDENT_APIS } from "../../Apis";
import { createDomainService } from "../../core/crudServiceFactory";
import { pickUiOptions } from "../../core/uiOptions";
import { getApi } from "../../common/common.api";

const treatmentPlanCrud = createDomainService("Treatment Plan", {
  list: ({ page, limit }) => COMMON_APIS.GET_TREATMENT_PLAN(page, limit),
  getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETTREATMENTPLANBYID(id),
  create: ({ patientId }) =>
    EMPLOYEE_APIS.EMPLOYEE_CREATE_TREATMENT_PLAN(patientId),
  update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDIT_TREATMENT_PLAN(id),
  remove: (id) => COMMON_APIS.DELETE_TREATMENT_PLAN(id),
});

export const treatmentPlanService = {
  list: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return treatmentPlanCrud.list(params, ui);
  },

  getById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return treatmentPlanCrud.getById(id, {}, ui);
  },

  getMeasureables: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_TREATMENT_MEASUREABLE_5(),
      context: "Treatment Plan: Measureables",
      ...ui,
    });
  },

  getPatientTreatmentPlan: (patientId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: RESIDENT_APIS.PATIENT_GETTREATMENTPLAN(patientId),
      context: "Treatment Plan: Patient",
      ...ui,
    });
  },

  create: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { patientId, payload } = params;

    return treatmentPlanCrud.create(
      payload,
      { patientId },
      {
        successMsg: "Success !",
        ...ui,
      },
    );
  },

  update: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { id, payload } = params;

    return treatmentPlanCrud.update(id, payload, ui);
  },

  delete: (id, options = {}) => {
    if (typeof id === "object" && id !== null) {
      const { params, ui } = pickUiOptions(id);
      return treatmentPlanCrud.remove(params.id, {
        successMsg: "Deleted Successfully !",
        ...ui,
      });
    }
    return treatmentPlanCrud.remove(id, {
      successMsg: "Deleted Successfully !",
      ...options,
    });
  },
};

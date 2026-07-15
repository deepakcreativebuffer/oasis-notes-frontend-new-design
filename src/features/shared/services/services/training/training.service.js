/** @format */

import { ADMIN_APIS, COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { createDomainService } from "../../core/crudServiceFactory";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";
import { createApi, getApi, updateApi } from "../../common/common.api";

const infectionControlCrud = createDomainService("Infection Control Training", {
  list: ({ page, limit }) =>
    COMMON_APIS.GET_INFECTION_CONTROL_TRAINING_2(page, limit),
  getById: (id) => ADMIN_APIS.ADMIN_GET_INFECTION_CONTROL_TRAINING_BY_ID(id),
  create: () => EMPLOYEE_APIS.EMPLOYEE_ADDINFECTIONCONTROLTRAINING,
  update: (id) => COMMON_APIS.GET_INFECTION_CONTROL_TRAINING(id),
  remove: (id) => ADMIN_APIS.ADMIN_DELETEINFECTIONCONTROLTRAINING(id),
});

export const trainingService = {
  getInfectionControlList: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return infectionControlCrud.list(params, ui);
  },

  getInfectionControlById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    const recordId = id || options.employeeId;
    return infectionControlCrud.getById(recordId, {}, ui);
  },

  getInfectionControlDetail: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return getApi({
      url: COMMON_APIS.GET_INFECTION_CONTROL_TRAINING_1(
        recordId,
        params.page,
        params.limit,
      ),
      context: "Infection Control Training: Detail",
      ...ui,
    });
  },

  createInfectionControl: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return infectionControlCrud.create(
      payload,
      {},
      {
        successMsg: "Created !",
        ...ui,
      },
    );
  },

  updateInfectionControl: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    const body = params.payload;

    return infectionControlCrud.update(recordId, body, {
      successMsg: "Updated !",
      ...ui,
    });
  },

  deleteInfectionControl: (id, options = {}) => {
    if (typeof id === "object" && id !== null) {
      const { params, ui } = pickUiOptions(id);
      return infectionControlCrud.remove(params.id, {
        successMsg: "Deleted Successfully !",
        ...ui,
      });
    }
    return infectionControlCrud.remove(id, {
      successMsg: "Deleted Successfully !",
      ...options,
    });
  },

  getFallPreventionById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    const recordId = id || options.employeeId;
    return getApi({
      url: ADMIN_APIS.ADMIN_GETFALLPREVENTIONANDFALLRECOVERYTRAININGBYID(
        recordId,
      ),
      context: "Fall Prevention Training: Get",
      ...ui,
    });
  },

  getFallPreventionDetail: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return getApi({
      url: COMMON_APIS.GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING_1(
        recordId,
        params.page,
        params.limit,
      ),
      context: "Fall Prevention Training: Detail",
      ...ui,
    });
  },

  createFallPrevention: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_ADDFALLPREVENTIONANDFALLRECOVERYTRAINING,
      payload,
      context: "Fall Prevention Training: Create",
      successMsg: "Created !",
      ...ui,
    });
  },

  updateFallPrevention: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return updateApi({
      url: COMMON_APIS.GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING(recordId),
      payload: params.payload,
      context: "Fall Prevention Training: Update",
      successMsg: "Updated !",
      ...ui,
    });
  },

  getTuberculosisById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    const recordId = id || options.employeeId;
    return getApi({
      url: ADMIN_APIS.ADMIN_GETTUBERCULOSISTRAININGBYID(recordId),
      context: "Tuberculosis Training: Get",
      ...ui,
    });
  },

  getTuberculosisDetail: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return getApi({
      url: COMMON_APIS.GET_TUBERCULOSIS_TRAINING_1(
        recordId,
        params.page,
        params.limit,
      ),
      context: "Tuberculosis Training: Detail",
      ...ui,
    });
  },

  createTuberculosis: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_ADDTUBERCULOSISTRAINING,
      payload,
      context: "Tuberculosis Training: Create",
      successMsg: "Created !",
      ...ui,
    });
  },

  updateTuberculosis: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return updateApi({
      url: COMMON_APIS.GET_TUBERCULOSIS_TRAINING(recordId),
      payload: params.payload,
      context: "Tuberculosis Training: Update",
      successMsg: "Updated !",
      ...ui,
    });
  },

  fallPrevention: defineResourceService("Fall Prevention Training", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING_2(page, limit),
    getById: (id) =>
      ADMIN_APIS.ADMIN_GETFALLPREVENTIONANDFALLRECOVERYTRAININGBYID(id),
    remove: (id) =>
      EMPLOYEE_APIS.EMPLOYEE_DELETEFALLPREVENTIONANDFALLRECOVERYTRAINING(id),
    create: EMPLOYEE_APIS.EMPLOYEE_ADDFALLPREVENTIONANDFALLRECOVERYTRAINING,
    update: (id) =>
      COMMON_APIS.GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING(id),
  }),

  tuberculosis: defineResourceService("Tuberculosis Training", {
    list: ({ page, limit }) =>
      COMMON_APIS.GET_TUBERCULOSIS_TRAINING_2(page, limit),
    getById: (id) => ADMIN_APIS.ADMIN_GETTUBERCULOSISTRAININGBYID(id),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETETUBERCULOSISTRAINING(id),
    create: EMPLOYEE_APIS.EMPLOYEE_ADDTUBERCULOSISTRAINING,
    update: (id) => COMMON_APIS.GET_TUBERCULOSIS_TRAINING(id),
  }),

  skillAndKnowledge: defineResourceService("Skill and Knowledge", {
    list: ({ page, limit }) => COMMON_APIS.GET_SKILL_AND_KNOWLEDGE(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETESKILLANDKNOWLEDGE(id),
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_UPDATESKILLANDKNOWLEDGE(id),
  }),

  onsiteFacility: defineResourceService("Onsite Facility", {
    list: ({ page, limit }) => COMMON_APIS.GET_ONSITE_FACILITY_2(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEONSITEFACILITY(id),
    update: (id) => COMMON_APIS.GET_ONSITE_FACILITY(id),
  }),

  getOnsiteDetail: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const recordId = params.id || params.employeeId;
    return getApi({
      url: COMMON_APIS.GET_ONSITE_FACILITY_1(
        recordId,
        params.page,
        params.limit,
      ),
      context: "Onsite Facility: Detail",
      ...ui,
    });
  },

  createOnsiteFacility: (employeeId, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: ADMIN_APIS.ADMIN_ONSITE_FACILITY(employeeId),
      payload,
      context: "Onsite Facility: Create",
      ...ui,
    });
  },

  createSkillAndKnowledge: (employeeId, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: ADMIN_APIS.ADMIN_SKILL_AND_KNOWLEDGE(employeeId),
      payload,
      context: "Skill And Knowledge: Create",
      ...ui,
    });
  },
};

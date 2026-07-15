/** @format */

import {
  ADMIN_APIS,
  COMMON_APIS,
  EMPLOYEE_APIS,
} from "@/features/shared/services/Apis";
import {
  createApi,
  getApi,
  updateApi,
} from "@/features/shared/services/common/common.api";
import { defineResourceService } from "@/features/shared/services/core/resourceService";
import { pickUiOptions } from "@/features/shared/services/core/uiOptions";

export const adminDashboardService = {
  employeePerformance: defineResourceService("Employee Performance Review", {
    list: ({ page, limit, debouncedQuery }) =>
      COMMON_APIS.GET_EMPLOYEE_PERFORMANCE_REVIEW(page, limit, debouncedQuery),
    remove: (id) => ADMIN_APIS.ADMIN_DELETEEMPLOYEEPERFORMANCEREVIEW(id),
  }),

  jobDescription: defineResourceService("Job Description", {
    list: ({ page, limit, debouncedQuery }) =>
      COMMON_APIS.GET_JOB_DESCRIPTION(page, limit, debouncedQuery),
    remove: (id) => ADMIN_APIS.ADMIN_DELETEJOBDESCRIPTION(id),
  }),

  offerLetter: defineResourceService("Offer Letter", {
    list: ({ page, limit, debouncedQuery }) =>
      COMMON_APIS.GET_OFFER_LETTER(page, limit, debouncedQuery),
    remove: (id) => ADMIN_APIS.ADMIN_DELETEOFFERLETTER(id),
  }),

  bhrfTherapyTopic: defineResourceService("BHRF Therapy Topic", {
    list: ({ page, limit, debouncedQuery }) => {
      const query = new URLSearchParams();
      if (page) query.set("page", page);
      if (limit) query.set("limit", limit);
      if (debouncedQuery) query.set("search", debouncedQuery);
      const qs = query.toString();
      return qs
        ? `${ADMIN_APIS.GET_ALL_BHRF_TOPICS}?${qs}`
        : ADMIN_APIS.GET_ALL_BHRF_TOPICS;
    },
    remove: (id) => ADMIN_APIS.ADMIN_DELETEBHRFTHERAPYTOPIC(id),
  }),

  treatmentMeasureable: {
    listInterventions: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      return getApi({
        url: COMMON_APIS.GET_TREATMENT_MEASUREABLE(
          params.page,
          params.limit,
          params.debouncedQuery,
        ),
        context: "Treatment Measureable: Interventions",
        ...ui,
      });
    },

    listMeasureables: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      return getApi({
        url: COMMON_APIS.GET_TREATMENT_MEASUREABLE_3(
          params.page,
          params.limit,
          params.debouncedQuery,
        ),
        context: "Treatment Measureable: Measureables",
        ...ui,
      });
    },

    listObjectives: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      return getApi({
        url: COMMON_APIS.GET_TREATMENT_MEASUREABLE_4(
          params.page,
          params.limit,
          params.debouncedQuery,
        ),
        context: "Treatment Measureable: Objectives",
        ...ui,
      });
    },

    delete: (id, options = {}) => {
      const { ui } = pickUiOptions(options);
      return defineResourceService("Treatment Measureable", {
        remove: (recordId) => COMMON_APIS.GET_TREATMENT_MEASUREABLE_1(recordId),
      }).remove(id, ui);
    },

    clone: (id, options = {}) => {
      const { ui } = pickUiOptions(options);
      return createApi({
        url: COMMON_APIS.GET_TREATMENT_MEASUREABLE_CLONE(id),
        payload: {},
        successMsg: ui.successMsg || "Cloned !",
        context: "Treatment Measureable: Clone",
        ...ui,
      });
    },

    update: (id, payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return updateApi({
        url: COMMON_APIS.GET_TREATMENT_MEASUREABLE_1(id),
        payload,
        context: "Treatment Measureable: Update",
        ...ui,
      });
    },

    create: (payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return createApi({
        url: COMMON_APIS.GET_TREATMENT_MEASUREABLE_2,
        payload,
        context: "Treatment Measureable: Create",
        ...ui,
      });
    },
  },

  deleteAdminTracking: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return defineResourceService("Admin Tracking", {
      remove: (recordId) => ADMIN_APIS.ADMIN_DELETEADMINTRACKING(recordId),
    }).remove(id, ui);
  },

  deleteAdmitDetails: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return defineResourceService("Admit Details", {
      remove: (recordId) => ADMIN_APIS.ADMIN_DELETEADMITDETAILS(recordId),
    }).remove(id, ui);
  },

  deleteTermination: (employeeId, options = {}) => {
    const { ui } = pickUiOptions(options);
    return defineResourceService("Termination", {
      remove: (id) => ADMIN_APIS.GET_ADMIN_TERMINATION(id),
    }).remove(employeeId, ui);
  },

  deleteReferenceCheck: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return defineResourceService("Reference Check", {
      remove: (recordId) =>
        EMPLOYEE_APIS.EMPLOYEE_DELETEREFERENCECHECK(recordId),
    }).remove(id, ui);
  },

  updateEmployeePerformanceReview: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: EMPLOYEE_APIS.EMPLOYEE_UPDATEEMPLOYEEPERFORMANCEREVIEW(id),
      payload,
      context: "Employee Performance Review: Update",
      ...ui,
    });
  },

  updateTermination: (id, formData, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: ADMIN_APIS.GET_ADMIN_TERMINATION(id),
      payload: formData,
      context: "Termination: Update",
      ...ui,
    });
  },

  updateEmployeeSkillQualification: (employeId, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: ADMIN_APIS.GET_ADMIN_EMPLOYEE_SKILL_AND_QUALIFICATION(employeId),
      payload,
      context: "Employee Skill And Qualification: Update",
      ...ui,
    });
  },

  createEmployeePerformanceReview: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: ADMIN_APIS.ADMIN_CREATEEMPLOYEEPERFORMANCEREVIEW(),
      payload,
      context: "Employee Performance Review: Create",
      ...ui,
    });
  },

  createTermination: (employeeId, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: ADMIN_APIS.GET_ADMIN_TERMINATION(employeeId),
      payload,
      context: "Termination: Create",
      ...ui,
    });
  },

  createEmployeeSkillQualification: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_ADDEMPLOYEESKILLANDQUALIFICATION,
      payload,
      context: "Employee Skill And Qualification: Create",
      ...ui,
    });
  },
};

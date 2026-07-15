/** @format */

import { ADMIN_APIS, COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { defineResourceService } from "../../core/resourceService";
import { pickUiOptions } from "../../core/uiOptions";
import {
  removeApi,
  getApi,
  updateApi,
  createApi,
  postApi,
} from "../../common/common.api";

export const employmentService = {
  fw4: defineResourceService("FW-4", {
    list: ({ page, limit }) => COMMON_APIS.GET_FW4(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEFW4BYID(id),
    update: (id, params = {}) =>
      params.isAdmin
        ? ADMIN_APIS.ADMIN_UPDATE_FW4(id)
        : EMPLOYEE_APIS.EMPLOYEE_UPDATE_FW4(id),
  }),

  fw9: defineResourceService("FW-9", {
    list: ({ page, limit }) => COMMON_APIS.GET_FW9(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEFW9BYID(id),
    update: (id, params = {}) =>
      params.isAdmin
        ? ADMIN_APIS.ADMIN_UPDATE_FW9(id)
        : EMPLOYEE_APIS.EMPLOYEE_UPDATE_FW9(id),
  }),

  i9: defineResourceService("I-9", {
    list: ({ page, limit }) => COMMON_APIS.GET_I9(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEI9BYID(id),
    update: (id, params = {}) =>
      params.isAdmin
        ? ADMIN_APIS.ADMIN_UPDATE_I9(id)
        : EMPLOYEE_APIS.EMPLOYEE_UPDATE_I9(id),
  }),

  aps: defineResourceService("APS Consent", {
    list: ({ page, limit }) => COMMON_APIS.GET_APS_CONSENT(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEAPSCONSENT(id),
    create: EMPLOYEE_APIS.EMPLOYEE_CREATEAPSCONSENT,
    update: (id) => EMPLOYEE_APIS.EMPLOYEE_EDITAPSCONSENTBYID(id),
  }),

  lrc1031: defineResourceService("LRC-1031", {
    list: ({ page, limit }) => COMMON_APIS.GET_LRC1031A(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETELRC1031ABYID(id),
    update: (id, params = {}) =>
      params.isAdmin
        ? ADMIN_APIS.ADMIN_UPDATE_LRC1031(id)
        : EMPLOYEE_APIS.EMPLOYEE_UPDATE_LRC1031(id),
  }),

  forms2023: defineResourceService("2023 Forms", {
    list: ({ page, limit }) => COMMON_APIS.GET_FORMS_2023(page, limit),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEFORMS2023BYID(id),
    create: (params = {}) =>
      params.employeeId
        ? ADMIN_APIS.ADMIN_CREATE_FORMS2023(params.employeeId)
        : EMPLOYEE_APIS.EMPLOYEE_CREATE_FORMS2023,
    update: (id, params = {}) =>
      params.isAdmin
        ? ADMIN_APIS.ADMIN_UPDATE_FORMS2023(id)
        : EMPLOYEE_APIS.EMPLOYEE_UPDATE_FORMS2023(id),
  }),

  appendix: defineResourceService("Appendix TB Screening", {
    list: ({ page, limit }) => COMMON_APIS.GET_APPENDIX(page, limit),
    remove: (id) => ADMIN_APIS.ADMIN_DELETEAPPENDIX(id),
    create: EMPLOYEE_APIS.EMPLOYEE_CREATE_APPENDIX_TB_SCREENING_ASSESSMENT,
    update: (id) =>
      EMPLOYEE_APIS.EMPLOYEE_EDIT_APPENDIX_TB_SCREENING_ASSESSMENT(id),
  }),

  personalInfo: {
    list: (options = {}) =>
      defineResourceService("Personal Information", {
        list: ({ page, limit }) =>
          COMMON_APIS.GET_PERSONAL_INFORMATION(page, limit),
      }).list(options),

    delete: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      const url = params.isAdmin
        ? ADMIN_APIS.ADMIN_DELETE_PERSONAL_INFORMATION(params.id)
        : EMPLOYEE_APIS.EMPLOYEE_DELETEPERSONALINFORMATION;
      return removeApi({
        url,
        successMsg: "Deleted Successfully !",
        context: "Personal Information: Delete",
        ...ui,
      });
    },
  },

  referenceCheck: defineResourceService("Reference Check", {
    list: ({ page, limit, debouncedQuery }) =>
      COMMON_APIS.GET_REFERENCE_CHECK(page, limit, debouncedQuery),
    getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETREFERENCECHECKBYID(id),
    remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEREFERENCECHECK(id),
    update: (id) => EMPLOYEE_APIS.GET_EMPLOYEE_SIGNREFERENCECHECKBYID(id),
  }),

  getAppendixAssessment: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETAPPENDIXTBSCREENINGASSESSMENT,
      context: "Appendix: Assessment",
      ...ui,
    });
  },

  getAppendixById: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETAPPENDIXTBSCREENINGASSESSMENTBYID(id),
      context: "Appendix: Get By ID",
      ...ui,
    });
  },

  getOfferLetter: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    let url;
    if (params.isAdmin && params.employeeId) {
      url = ADMIN_APIS.GET_OFFER_LETTER_BY_EMPLOYEE_ID(params.employeeId);
    } else if (params.signById && params.id) {
      url = EMPLOYEE_APIS.EMPLOYEE_GET_OFFER_LETTER_BY_ID(params.id);
    } else {
      url = EMPLOYEE_APIS.EMPLOYEE_GET_OFFER_LETTER_BY_EMPLOYEE(
        params.id || params.employeeId,
      );
    }
    return getApi({
      url,
      context: "Offer Letter: Get",
      ...ui,
    });
  },

  getJobDescription: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    let url;
    if (params.employeeId) {
      url = ADMIN_APIS.ADMIN_GET_JOB_DESCRIPTION_BY_EMPLOYEE(params.employeeId);
    } else if (params.id) {
      url = EMPLOYEE_APIS.EMPLOYEE_GET_JOB_DESCRIPTION(params.id);
    } else {
      url = EMPLOYEE_APIS.EMPLOYEE_GET_MY_JOB_DESCRIPTION;
    }
    return getApi({ url, context: "Job Description: Get", ...ui });
  },

  getSignReferenceCheck: (id, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: EMPLOYEE_APIS.GET_EMPLOYEE_SIGNREFERENCECHECKBYID(id),
      context: "Reference Check: Sign",
      ...ui,
    });
  },

  getSkillAndQualification: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = params.employeId
      ? EMPLOYEE_APIS.EMPLOYEE_VIEW_SKILL_AND_QUALIFICATION_BY_EMPLOYEE(
          params.employeId,
        )
      : EMPLOYEE_APIS.EMPLOYEE_VIEW_SKILL_AND_QUALIFICATION;
    return getApi({
      url,
      context: "Employment: Skill And Qualification",
      ...ui,
    });
  },

  getOtherInfo: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = params.employeId
      ? EMPLOYEE_APIS.EMPLOYEE_VIEW_OTHER_INFO_BY_EMPLOYEE(params.employeId)
      : EMPLOYEE_APIS.EMPLOYEE_VIEW_OTHER_INFO;
    return getApi({
      url,
      context: "Employment: Other Info",
      ...ui,
    });
  },

  getAllEmployeeInfoAllForms: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = params.employeeId
      ? ADMIN_APIS.ADMIN_GETALLEMPLOYEEINFOALLFORMS(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_GET_ALL_EMPLOYEE_INFO_ALL_FORMS;
    return getApi({
      url,
      context: "Employment: All Forms",
      ...ui,
    });
  },

  getApplicationForms: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const url = params.isAdmin
      ? ADMIN_APIS.ADMIN_VIEW_ALL_EMPLOYEE_FORMS(params.employeId)
      : EMPLOYEE_APIS.EMPLOYEE_ALL_APPLICATION_FORMS;
    return getApi({
      url,
      context: "Employment: Application Forms",
      ...ui,
    });
  },

  signPersonalInfo: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: EMPLOYEE_APIS.GET_EMPLOYEE_SIGNPERSONALINFO(id),
      payload,
      context: "Employment: Sign Personal Info",
      ...ui,
    });
  },

  createEmployeeOtherInfo: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: EMPLOYEE_APIS.EMPLOYEE_ADDEMPLOYEEOTHERINFO(),
      payload,
      context: "Employment: Create Other Info",
      ...ui,
    });
  },

  createFw4: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    const url = params.employeeId
      ? ADMIN_APIS.ADMIN_CREATE_FW4(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_CREATE_FW4;
    return postApi(
      ui.setLoading,
      url,
      params.payload ?? payload,
      ui.navigate,
      "FW-4: Create",
    );
  },

  createFw9: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    const url = params.employeeId
      ? ADMIN_APIS.ADMIN_CREATE_FW9(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_CREATE_FW9;
    return postApi(
      ui.setLoading,
      url,
      params.payload ?? payload,
      ui.navigate,
      "FW-9: Create",
    );
  },

  createI9: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    const url = params.employeeId
      ? ADMIN_APIS.ADMIN_CREATE_I9(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_CREATE_I9;
    return postApi(
      ui.setLoading,
      url,
      params.payload ?? payload,
      ui.navigate,
      "I-9: Create",
    );
  },

  createLrc1031: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    const url = params.employeeId
      ? ADMIN_APIS.ADMIN_CREATE_LRC1031(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_CREATE_LRC1031;
    return postApi(
      ui.setLoading,
      url,
      params.payload ?? payload,
      ui.navigate,
      "LRC-1031: Create",
    );
  },

  createPersonalInfo: (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    const url = params.employeeId
      ? ADMIN_APIS.ADMIN_CREATE_PERSONAL_INFO(params.employeeId)
      : EMPLOYEE_APIS.EMPLOYEE_CREATE_PERSONAL_INFO;
    return postApi(
      ui.setLoading,
      url,
      params.payload ?? payload,
      ui.navigate,
      "Personal Information: Create",
    );
  },

  signOfferLetter: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_SIGN_OFFER_LETTER(id),
      payload,
      ui.navigate,
      "Offer Letter: Sign",
    );
  },

  updateJobDescription: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_UPDATE_JOB_DESCRIPTION,
      payload,
      ui.navigate,
      "Job Description: Update",
    );
  },

  createReferenceCheck: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return postApi(
      ui.setLoading,
      EMPLOYEE_APIS.EMPLOYEE_CREATE_REFERENCE_CHECK,
      payload,
      ui.navigate,
      "Reference Check: Create",
    );
  },
};

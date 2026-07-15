/** @format */

import { ADMIN_APIS, COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi, postApi, updateApi } from "../../common/common.api";
import { getData } from "../../common/dataFetch.api";
import { createDomainService } from "../../core/crudServiceFactory";
import { postForRole, resolveRoleEndpoint } from "../../core/roleAware";
import { pickUiOptions } from "../../core/uiOptions";

const mileageLogCrud = createDomainService("Mileage Log", {
  list: ({ page, limit }) => ADMIN_APIS.GET_ADMIN_MILEAGE_LOG(page, limit),
  getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETMILEAGELOGBYID(id),
  create: ({ isAdmin }) =>
    resolveRoleEndpoint(
      isAdmin,
      ADMIN_APIS.ADMIN_CREATE_MILEAGE_LOG,
      EMPLOYEE_APIS.EMPLOYEE_CREATEMILEAGELOG,
    ),
  update: (id) => EMPLOYEE_APIS.EMPLOYEE_UPDATEMILEAGELOG(id),
  remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETEMILEAGELOG(id),
});

const therapySessionCrud = createDomainService("Therapy Session", {
  list: ({ page, limit }) => COMMON_APIS.GET_THERAPY_SESSION(page, limit),
  getById: (id) => EMPLOYEE_APIS.EMPLOYEE_GETTHERAPYSESSIONBYID(id),
  remove: (id) => EMPLOYEE_APIS.EMPLOYEE_DELETETHERAPYSESSION(id),
});

export const therapyNotesService = {
  mileageLog: {
    list: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      return mileageLogCrud.list(params, ui);
    },

    getPrefillData: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      const url = resolveRoleEndpoint(
        params.isAdmin,
        ADMIN_APIS.ADMIN_GET_ALL_MILEAGE_LOG_PREFILL,
        EMPLOYEE_APIS.EMPLOYEE_GETALLMILEAGELOG,
      );
      return getApi({ url, context: "Mileage Log: Prefill", ...ui });
    },

    getById: (id, options = {}) => {
      const { ui } = pickUiOptions(options);
      const setter = ui.setResponse || ui.setData;
      return getData(setter, EMPLOYEE_APIS.EMPLOYEE_GETMILEAGELOGBYID(id));
    },

    create: (payload, options = {}) => {
      const { params, ui } = pickUiOptions({ payload, ...options });
      return postForRole(
        params.isAdmin,
        ADMIN_APIS.ADMIN_CREATE_MILEAGE_LOG,
        EMPLOYEE_APIS.EMPLOYEE_CREATEMILEAGELOG,
        params.payload ?? payload,
        ui,
      );
    },

    update: (id, payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return updateApi({
        url: EMPLOYEE_APIS.EMPLOYEE_UPDATEMILEAGELOG(id),
        payload,
        context: "Mileage Log: Update",
        ...ui,
      });
    },

    delete: (id, options = {}) => {
      if (typeof id === "object" && id !== null) {
        const { params, ui } = pickUiOptions(id);
        return mileageLogCrud.remove(params.id, {
          successMsg: "Deleted Successfully !",
          ...ui,
        });
      }
      return mileageLogCrud.remove(id, {
        successMsg: "Deleted Successfully !",
        ...options,
      });
    },
  },

  therapySession: {
    list: (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      return therapySessionCrud.list(params, ui);
    },

    getById: (id, options = {}) => {
      const { ui } = pickUiOptions(options);
      const setter = ui.setResponse || ui.setData;
      return getData(setter, EMPLOYEE_APIS.EMPLOYEE_GETTHERAPYSESSIONBYID(id));
    },

    getBhrfTopics: (options = {}) => {
      const { ui } = pickUiOptions(options);
      const setter = ui.setResponse || ui.setData;
      return getData(setter, EMPLOYEE_APIS.EMPLOYEE_GETALLBHRFTHERAPYTOPIC);
    },

    create: (payload, options = {}) => {
      const { params, ui } = pickUiOptions({ payload, ...options });
      return postForRole(
        params.isAdmin,
        ADMIN_APIS.ADMIN_CREATE_THERAPY_SESSION,
        EMPLOYEE_APIS.EMPLOYEE_CREATETHERAPYSESSION,
        params.payload ?? payload,
        ui,
      );
    },

    update: (id, payload, options = {}) => {
      const { ui } = pickUiOptions(options);
      return postApi(
        ui.setLoading,
        EMPLOYEE_APIS.EMPLOYEE_UPDATETHERAPYSESSION(id),
        payload,
        ui.navigate,
        "Therapy Session: Update",
      );
    },

    delete: (id, options = {}) => {
      if (typeof id === "object" && id !== null) {
        const { params, ui } = pickUiOptions(id);
        return therapySessionCrud.remove(params.id, {
          successMsg: "Deleted Successfully !",
          ...ui,
        });
      }
      return therapySessionCrud.remove(id, {
        successMsg: "Deleted Successfully !",
        ...options,
      });
    },
  },
};

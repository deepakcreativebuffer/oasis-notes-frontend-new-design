/** @format */

import {
  getApi,
  createApi,
  updateApi,
  removeApi,
  postApi,
} from "../common/common.api";
import { pickUiOptions } from "./uiOptions";

/**
 * Defines a resource service with standardized methods.
 * All endpoint resolution stays inside the service layer.
 */
export const defineResourceService = (resourceName, endpoints) => {
  const service = {};

  if (endpoints.list) {
    service.list = (options = {}) => {
      const { params, ui } = pickUiOptions(options);
      return getApi({
        url: endpoints.list(params),
        context: `${resourceName}: List`,
        ...ui,
      });
    };
  }

  if (endpoints.getById) {
    service.getById = (id, options = {}) => {
      if (typeof id === "object" && id !== null) {
        const { params, ui } = pickUiOptions(id);
        return getApi({
          url: endpoints.getById(params.id, params),
          context: `${resourceName}: Get`,
          ...ui,
        });
      }
      const { params, ui } = pickUiOptions(options);
      return getApi({
        url: endpoints.getById(id, params),
        context: `${resourceName}: Get`,
        ...ui,
      });
    };
  }

  if (endpoints.getByPatientId) {
    service.getByPatientId = (patientId, options = {}) => {
      const { ui } = pickUiOptions(options);
      return getApi({
        url: endpoints.getByPatientId(patientId),
        context: `${resourceName}: Get By Patient`,
        ...ui,
      });
    };
  }

  if (endpoints.create) {
    service.create = (payload, options = {}) => {
      const { params, ui } = pickUiOptions(
        payload?.payload !== undefined
          ? { ...options, ...payload }
          : { payload, ...options },
      );
      const body = params.payload ?? payload;
      const url =
        typeof endpoints.create === "function"
          ? endpoints.create(params)
          : endpoints.create;

      return createApi({
        url,
        payload: body,
        context: `${resourceName}: Create`,
        ...ui,
      });
    };

    service.post = (payload, options = {}) => {
      const { params, ui } = pickUiOptions(
        payload?.payload !== undefined
          ? { ...options, ...payload }
          : { payload, ...options },
      );
      const body = params.payload ?? payload;
      const url =
        typeof endpoints.create === "function"
          ? endpoints.create(params)
          : endpoints.create;

      return postApi(
        ui.setLoading,
        url,
        body,
        ui.navigate,
        `${resourceName}: Post`,
      );
    };
  }

  if (endpoints.update) {
    service.update = (id, payload, options = {}) => {
      if (typeof id === "object" && id !== null && id.payload !== undefined) {
        const { params, ui } = pickUiOptions(id);
        return updateApi({
          url: endpoints.update(params.id, params),
          payload: params.payload,
          context: `${resourceName}: Update`,
          ...ui,
        });
      }
      const { ui } = pickUiOptions(options);
      return updateApi({
        url: endpoints.update(id),
        payload,
        context: `${resourceName}: Update`,
        ...ui,
      });
    };
  }

  if (endpoints.remove) {
    service.remove = (id, options = {}) => {
      const { params, ui } = pickUiOptions(
        typeof id === "object" && id !== null ? id : { id, ...options },
      );
      return removeApi({
        url: endpoints.remove(params.id),
        successMsg: "Deleted Successfully !",
        context: `${resourceName}: Delete`,
        ...ui,
      });
    };
  }

  return service;
};

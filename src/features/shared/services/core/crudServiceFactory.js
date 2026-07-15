/** @format */

import {
  getApi,
  createApi,
  updateApi,
  removeApi,
  deleteApi,
} from "../common/common.api";

/**
 * Factory for domain services. Endpoints are defined once; components call
 * service methods with business params + optional UI callbacks only.
 *
 * @param {string} serviceName - Used in error/log context strings
 * @param {object} endpoints - Endpoint resolver functions
 */
export const createDomainService = (serviceName, endpoints) => ({
  list: (params = {}, uiOptions = {}) =>
    getApi({
      url: endpoints.list(params),
      context: uiOptions.context || `${serviceName}: List`,
      ...uiOptions,
    }),

  getById: (id, params = {}, uiOptions = {}) =>
    getApi({
      url: endpoints.getById(id, params),
      context: uiOptions.context || `${serviceName}: Get`,
      ...uiOptions,
    }),

  create: (payload, params = {}, uiOptions = {}) =>
    createApi({
      url: endpoints.create(params),
      payload,
      context: uiOptions.context || `${serviceName}: Create`,
      ...uiOptions,
    }),

  update: (id, payload, uiOptions = {}) =>
    updateApi({
      url: endpoints.update(id),
      payload,
      context: uiOptions.context || `${serviceName}: Update`,
      ...uiOptions,
    }),

  remove: (id, uiOptions = {}) =>
    removeApi({
      url: endpoints.remove(id),
      context: uiOptions.context || `${serviceName}: Delete`,
      ...uiOptions,
    }),

  deleteAndNavigate: (id, uiOptions = {}) =>
    deleteApi({
      url: endpoints.remove(id),
      context: uiOptions.context || `${serviceName}: Delete`,
      ...uiOptions,
    }),
});

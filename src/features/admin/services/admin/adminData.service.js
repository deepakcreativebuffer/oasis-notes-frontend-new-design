/** @format */

import { api } from "@/features/shared/services";
import { COMMON_APIS } from "@/features/shared/services";
import { handleApiRequest } from "@/features/shared/services";
import { showNotification } from "@/utils";

export const adminDataService = {
  singleData: async (url, id) => {
    const result = await handleApiRequest(
      () => api.get(COMMON_APIS.GET_BASE_API(url, id)),
      `Admin Get Single: ${url}`,
    );

    if (!result.success) {
      showNotification(result);
    }

    return result.originalError ? Promise.reject(result.originalError) : result;
  },

  getAllData: async (url) => {
    const result = await handleApiRequest(
      () => api.get(url),
      `Admin Get All: ${url}`,
    );

    if (!result.success) {
      showNotification(result);
    }

    return result.originalError ? Promise.reject(result.originalError) : result;
  },

  postData: async (url, data) => {
    const result = await handleApiRequest(
      () => api.post(url, data),
      `Admin Post: ${url}`,
    );

    if (!result.success) {
      showNotification(result);
    }

    return result.originalError ? Promise.reject(result.originalError) : result;
  },

  updateData: async (url, data, id) => {
    const result = await handleApiRequest(
      () => api.put(COMMON_APIS.GET_BASE_API(url, id), data),
      `Admin Update: ${url}`,
    );

    if (!result.success) {
      showNotification(result);
    }

    return result.originalError ? Promise.reject(result.originalError) : result;
  },

  deleteData: async (url, id, getData) => {
    const result = await handleApiRequest(
      () => api.delete(COMMON_APIS.GET_BASE_API(url, id)),
      `Admin Delete: ${url}`,
    );

    if (result.success) {
      if (typeof getData === "function") getData();
      showNotification({
        message: result.message || "Item deleted successfully",
        type: "success",
      });
    } else {
      if (result.status === 404 && typeof getData === "function") {
        getData();
      }
      showNotification(result);
    }

    return result;
  },

  editApi: async (setLoading, url, payload) => {
    if (setLoading) setLoading(true);

    const result = await handleApiRequest(
      () => api.put(url, payload),
      `Admin Edit: ${url}`,
    );

    if (result.success) {
      showNotification({
        message: result.message || "Updated successfully",
        type: "success",
      });
    } else {
      showNotification(result);
    }

    if (setLoading) setLoading(false);
    return result;
  },
};

export const {
  singleData,
  getAllData,
  postData,
  updateData,
  deleteData,
  editApi,
} = adminDataService;

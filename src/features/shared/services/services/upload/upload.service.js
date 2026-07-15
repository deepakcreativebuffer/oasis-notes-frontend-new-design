import api from "../../baseApi";
import { handleApiRequest } from "../../core/errorHandler";
import { createFormData } from "@/utils/upload/uploadHelpers";
import { UPLOAD_TIMEOUT_MS } from "@/features/shared/constants";

export const uploadService = {
  uploadSingle: async (url, key, file, additionalData = {}, onProgress) => {
    const formData = createFormData(key, file, additionalData);

    return handleApiRequest(
      () =>
        api.post(url, formData, {
          timeout: UPLOAD_TIMEOUT_MS,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              onProgress(percentCompleted);
            }
          },
        }),
      `File Upload: ${url}`,
    );
  },

  uploadMultiple: async (url, key, files, additionalData = {}) => {
    const formData = createFormData(key, files, additionalData);
    return handleApiRequest(
      () =>
        api.post(url, formData, {
          timeout: UPLOAD_TIMEOUT_MS,
          headers: { "Content-Type": "multipart/form-data" },
        }),
      `Multiple Files Upload: ${url}`,
    );
  },
};

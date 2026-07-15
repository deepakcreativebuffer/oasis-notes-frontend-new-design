/** @format */

import api from "../../baseApi";
import { handleApiRequest } from "../../core/errorHandler";
import { EMPLOYEE_APIS } from "../../Apis";
import ENV from "@/features/shared/config/env";
import { defaultProfileIcon } from "@/assets";
import { uploadService } from "./upload.service";
import { showNotification, logger } from "@/utils";
import { UPLOAD_TIMEOUT_MS } from "@/features/shared/constants";

export const UploadImage = async (file, setResponse, id, fileName) => {
  const result = await uploadService.uploadSingle(
    EMPLOYEE_APIS.UPDATE_IMAGE(id),
    "image",
    file,
    {
      type: fileName,
    },
  );
  if (result.success && setResponse) {
    setResponse(result.data);
  } else if (!result.success) {
    showNotification(result);
  }
  return result;
};

export const uploadDocument = async ({
  payload,
  setArr,
  setLoading,
  patitentId,
}) => {
  if (setLoading) setLoading(true);
  const request =
    payload instanceof FormData
      ? () =>
          api.post(EMPLOYEE_APIS.CREATE_UPLOAD_DOCUMENT(patitentId), payload, {
            timeout: UPLOAD_TIMEOUT_MS,
            headers: { "Content-Type": "multipart/form-data" },
          })
      : () => {
          if (
            payload &&
            typeof payload === "object" &&
            !Array.isArray(payload) &&
            !(payload instanceof Blob) &&
            !(payload instanceof File) &&
            "file" in payload
          ) {
            const { file, ...rest } = payload;
            return uploadService.uploadMultiple(
              EMPLOYEE_APIS.CREATE_UPLOAD_DOCUMENT(patitentId),
              "file",
              file,
              rest,
            );
          }
          return uploadService.uploadMultiple(
            EMPLOYEE_APIS.CREATE_UPLOAD_DOCUMENT(patitentId),
            "file",
            payload,
          );
        };
  const result = await handleApiRequest(request, "Upload Document");
  if (result.success) {
    if (setArr) setArr((prev) => [...prev, result.data]);
  } else {
    showNotification(result);
  }
  if (setLoading) setLoading(false);
  return result;
};

export function getObjectUrlFromDownloadUrl(downloadUrl) {
  try {
    if (!downloadUrl) {
      return defaultProfileIcon;
    }
    if (downloadUrl.startsWith("blob:")) {
      return downloadUrl;
    }
    const cloudfrontUrl = ENV.CLOUDFRONT_URL;
    return encodeURI(`${cloudfrontUrl}${downloadUrl}`);
  } catch (error) {
    logger.error("Error creating object URL", error);
    return null;
  }
}

export { uploadService };

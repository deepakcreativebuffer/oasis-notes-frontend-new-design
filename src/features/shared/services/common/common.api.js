import { REMOVE_MESSAGE, SUCCESS_MESSAGE } from "../../constants";
import { showNotification } from "@/utils";
import api from "../baseApi";
import { handleApiRequest } from "../core/errorHandler";
import { queryClient } from "@/lib/queryClient";
import { createFormData } from "@/utils/upload/uploadHelpers";

// ─── Refactored Generic Request Helpers ──────────────────────────────

const isFileData = (val) => {
  if (!val) return false;
  if (val instanceof File || val instanceof Blob || val instanceof FileList)
    return true;
  if (Array.isArray(val))
    return val.some((v) => v instanceof File || v instanceof Blob);
  if (
    typeof val === "object" &&
    val.name &&
    val.size !== undefined &&
    val.type !== undefined
  )
    return true;
  return false;
};

export const getApi = async ({
  url,
  setResponse,
  setLoading,
  additionalFunctions = [],
  setErrorMessage,
  showAlert = false,
  context = "Fetch Data",
  signal,
}) => {
  if (typeof setLoading === "function") setLoading(true);

  const result = await handleApiRequest(
    () => api.get(url, signal ? { signal } : undefined),
    context,
  );
  if (result.success) {
    if (setResponse) setResponse({ data: result?.data });
    if (showAlert) showNotification({ message: result.message });
    additionalFunctions.forEach((func) => typeof func === "function" && func());
  } else {
    if (setResponse) setResponse({ data: [] });
    if (setErrorMessage) setErrorMessage(result.message);
    if (showAlert) showNotification(result);
  }

  if (typeof setLoading === "function") setLoading(false);
  return result;
};

export const postApi = async (
  setLoading,
  url,
  payload,
  navigate,
  context = "Submit Data",
) => {
  if (typeof setLoading === "function") setLoading(true);

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    !(payload instanceof FormData) &&
    !(payload instanceof Blob) &&
    !(payload instanceof File)
  ) {
    let keyToConvert = null;
    if ("file" in payload && isFileData(payload.file)) {
      keyToConvert = "file";
    } else if ("image" in payload && isFileData(payload.image)) {
      keyToConvert = "image";
    }

    if (keyToConvert) {
      const { [keyToConvert]: fileData, ...rest } = payload;
      payload = createFormData(keyToConvert, fileData, rest);
    }
  }

  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const result = await handleApiRequest(
    () => api.post(url, payload, config),
    context,
  );

  if (result.success) {
    showNotification({
      message: result.message || SUCCESS_MESSAGE,
      type: "success",
    });
    queryClient.invalidateQueries();
    if (navigate) navigate(-1);
  } else {
    showNotification(result);
  }

  if (typeof setLoading === "function") setLoading(false);
  return result;
};

export const createApi = async ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  navigate,
  showAlert = true,
  successMsg = false,
  context = "Create Item",
}) => {
  if (typeof setLoading === "function") setLoading(true);

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    !(payload instanceof FormData) &&
    !(payload instanceof Blob) &&
    !(payload instanceof File)
  ) {
    let keyToConvert = null;
    if ("file" in payload && isFileData(payload.file)) {
      keyToConvert = "file";
    } else if ("image" in payload && isFileData(payload.image)) {
      keyToConvert = "image";
    }

    if (keyToConvert) {
      const { [keyToConvert]: fileData, ...rest } = payload;
      payload = createFormData(keyToConvert, fileData, rest);
    }
  }

  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const result = await handleApiRequest(
    () => api.post(url, payload, config),
    context,
  );

  if (result.success) {
    if (showAlert) {
      showNotification({
        message: successMsg || result.message || SUCCESS_MESSAGE,
      });
    }
    additionalFunctions.forEach((func) => typeof func === "function" && func());
    queryClient.invalidateQueries();
    if (navigate) navigate(-1);
  } else {
    if (showAlert) showNotification(result);
  }

  if (typeof setLoading === "function") setLoading(false);
  return result;
};

export const updateApi = async ({
  url,
  payload,
  setLoading,
  additionalFunctions = [],
  navigate,
  successMsg,
  showAlert = true,
  context = "Update Item",
}) => {
  if (typeof setLoading === "function") setLoading(true);

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    !(payload instanceof FormData) &&
    !(payload instanceof Blob) &&
    !(payload instanceof File)
  ) {
    let keyToConvert = null;
    if ("file" in payload && isFileData(payload.file)) {
      keyToConvert = "file";
    } else if ("image" in payload && isFileData(payload.image)) {
      keyToConvert = "image";
    }

    if (keyToConvert) {
      const { [keyToConvert]: fileData, ...rest } = payload;
      payload = createFormData(keyToConvert, fileData, rest);
    }
  }

  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const result = await handleApiRequest(
    () => api.put(url, payload, config),
    context,
  );

  if (result.success) {
    if (showAlert) {
      showNotification({
        message: successMsg || result.message || SUCCESS_MESSAGE,
      });
    }
    additionalFunctions.forEach((func) => typeof func === "function" && func());
    queryClient.invalidateQueries();
    if (navigate) navigate(-1);
  } else {
    if (showAlert) showNotification(result);
  }

  if (typeof setLoading === "function") setLoading(false);
  return result;
};

export const removeApi = async ({
  url,
  successMsg,
  additionalFunctions = [],
  setLoading,
  showToast = true,
  context = "Delete Item",
}) => {
  if (typeof setLoading === "function") setLoading(true);

  const result = await handleApiRequest(() => api.delete(url), context);

  if (result.success) {
    if (showToast) {
      showNotification({
        message: successMsg || result.message || REMOVE_MESSAGE,
      });
    }
    additionalFunctions.forEach((func) => typeof func === "function" && func());
    queryClient.invalidateQueries();
  } else {
    if (showToast) showNotification(result);
  }

  if (typeof setLoading === "function") setLoading(false);
  return result;
};

export const deleteApi = async ({
  url,
  additionalFunctions = [],
  setLoading,
  navigate,
  context = "Delete Item",
}) => {
  const result = await removeApi({
    url,
    additionalFunctions,
    setLoading,
    showToast: true,
    context,
  });
  if (result.success && navigate) navigate(-1);
  return result;
};

export const removeApiForPdf = async ({
  url,
  setLoading,
  additionalFunctions = [],
  showToast = true,
  payload,
  context = "Remove PDF",
}) => {
  if (typeof setLoading === "function") setLoading(true);

  if (
    payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    !(payload instanceof FormData) &&
    !(payload instanceof Blob) &&
    !(payload instanceof File)
  ) {
    let keyToConvert = null;
    if ("file" in payload && isFileData(payload.file)) {
      keyToConvert = "file";
    } else if ("image" in payload && isFileData(payload.image)) {
      keyToConvert = "image";
    }

    if (keyToConvert) {
      const { [keyToConvert]: fileData, ...rest } = payload;
      payload = createFormData(keyToConvert, fileData, rest);
    }
  }

  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const result = await handleApiRequest(
    () => api.post(url, payload, config),
    context,
  );

  if (result.success) {
    if (showToast) showNotification({ message: REMOVE_MESSAGE });
    additionalFunctions.forEach((func) => typeof func === "function" && func());
  } else if (showToast) {
    showNotification(result);
  }

  if (typeof setLoading === "function") setLoading(false);
  return result;
};

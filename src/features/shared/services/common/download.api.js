/** @format */

import api from "../baseApi";
import { handleApiRequest } from "../core/errorHandler";
import { showNotification, logger } from "@/utils";

/**
 * Download a file blob from the API by endpoint path.
 */
export const downloadBlobByUrl = async (endpoint) => {
  if (!endpoint) return { success: false, message: "Invalid URL" };

  if (endpoint.startsWith("blob:")) {
    try {
      const link = document.createElement("a");
      link.href = endpoint;
      link.target = "_blank";
      // We don't force a download attribute so it can open in a new tab like a view,
      // but if the browser forces download, that's fine too.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    } catch (error) {
      logger.error("Failed to open local blob document", error, { endpoint });
      return { success: false, message: "Failed to open document" };
    }
  }

  const fileVersionName = endpoint.split("/");

  const result = await handleApiRequest(
    () => api.get(endpoint, { responseType: "blob" }),
    "Download Document",
  );

  if (!result.success) {
    showNotification({
      message: result.message || "Document Not Found!!",
      type: "danger",
    });
    logger.error("Failed to download document", null, { endpoint });
    return result;
  }

  try {
    const fileURL = window.URL.createObjectURL(new Blob([result.data]));
    const link = document.createElement("a");
    link.href = fileURL;
    if (fileVersionName) {
      link.setAttribute(
        "download",
        fileVersionName[fileVersionName.length - 1],
      );
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(fileURL);
  } catch (error) {
    showNotification({
      message: error.message || "Document Not Found!!",
      type: "danger",
    });
    logger.error("Failed to download document", error, { endpoint });
  }

  return result;
};

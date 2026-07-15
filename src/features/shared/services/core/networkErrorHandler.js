import { getGlobalOfflineStatus } from "@/utils/networkStatus";
import { ERROR_MESSAGE } from "../../constants";
import { logger } from "@/utils";
export const ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  AUTH_ERROR: "AUTH_ERROR",
  OFFLINE_ERROR: "OFFLINE_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

/**
 * Normalizes all Axios/Fetch errors into a consistent structure.
 * @param {Error} error - The caught error object.
 * @param {string} context - A description of the operation (for logging context).
 * @returns {Object} Standardized error response object.
 */
export const normalizeNetworkError = (error, context = "API Request") => {
  // Prevent double normalization
  if (error && error.originalError) {
    return error;
  }
  let status = error?.response?.status || 0;
  let type = ERROR_TYPES.UNKNOWN_ERROR;
  let isOffline = error?.isOffline || getGlobalOfflineStatus() || false;
  let isTimeout =
    error?.code === "ECONNABORTED" ||
    error?.message?.includes("timeout") ||
    false;
  let message = ERROR_MESSAGE;

  // 1. Detect offline state
  if (isOffline || error?.code === "ERR_OFFLINE") {
    isOffline = true;
    type = ERROR_TYPES.OFFLINE_ERROR;
    message = "You are offline. Please check your internet connection.";
  }
  // 2. Detect timeout errors
  else if (isTimeout || status === 408) {
    isTimeout = true;
    type = ERROR_TYPES.TIMEOUT_ERROR;
    message = "Request timed out. Please try again.";
  }
  // 3. Detect other connection errors (no response, and not offline/timeout)
  else if (!error.response && error.request) {
    type = ERROR_TYPES.NETWORK_ERROR;
    message = "Unable to connect. Check your internet connection.";
  }
  // 4. Map specific HTTP status codes
  else if (error.response) {
    const serverMessage =
      error.response?.data?.message || error.response?.data?.error;
    switch (status) {
      case 400:
        type = ERROR_TYPES.VALIDATION_ERROR;
        message = serverMessage || "Invalid request. Please check your data.";
        break;
      case 401:
        type = ERROR_TYPES.AUTH_ERROR;
        message = serverMessage || "Session expired. Please log in again.";
        break;
      case 403:
        type = ERROR_TYPES.AUTH_ERROR;
        message =
          serverMessage || "You do not have permission to perform this action.";
        break;
      case 404:
        type = ERROR_TYPES.UNKNOWN_ERROR;
        message = serverMessage || "Resource not found.";
        break;
      case 422:
        type = ERROR_TYPES.VALIDATION_ERROR;
        message =
          serverMessage || "Validation failed. Please correct the errors.";
        break;
      case 429:
        type = ERROR_TYPES.NETWORK_ERROR;
        message = serverMessage || "Too many requests. Please slow down.";
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        type = ERROR_TYPES.SERVER_ERROR;
        message =
          serverMessage ||
          "Something went wrong on the server. Please try again later.";
        break;
      default:
        type = ERROR_TYPES.UNKNOWN_ERROR;
        message = serverMessage || "Unexpected error occurred.";
        break;
    }
  } else if (error.__CANCEL__) {
    message = "Request was cancelled.";
  }
  const normalized = {
    success: false,
    status,
    type,
    message,
    isOffline,
    isTimeout,
    data: error?.response?.data || null,
    // Keep data for backward compatibility
    originalError: error,
  };

  // Structured logging of detailed errors only in development
  logger.error(message, error, {
    context,
    status,
    type,
    isOffline,
    isTimeout,
  });
  return normalized;
};

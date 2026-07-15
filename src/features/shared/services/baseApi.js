/** @format */

import axios from "axios";
import { LOGOUT } from "@/store/authSlice";
import { normalizeApiError } from "./core/errorHandler";
import { getGlobalOfflineStatus } from "@/utils/networkStatus";
import { queryClient } from "@/lib/queryClient";
import { API_TIMEOUT_MS } from "../constants";
import ENV from "../config/env";

// ─── Environment URLs ────────────────────────────────────────────────
const BASE_URL = ENV.BASE_URL;

// ─── Store reference (injected at app startup via injectStore) ──────
let _store = null;

/**
 * Call this once from your app entry point (e.g. index.js or App.js)
 * to give the interceptors access to Redux dispatch.
 */
export const injectStore = (store) => {
  _store = store;
};

// ─── Common Request Interceptor Logic ───────────────────────────────
const commonRequestInterceptor = (config) => {
  // Enforce offline short-circuiting
  if (getGlobalOfflineStatus()) {
    const offlineError = new Error(
      "You are offline. Please check your internet connection.",
    );
    offlineError.isOffline = true;
    offlineError.code = "ERR_OFFLINE";
    return Promise.reject(offlineError);
  }

  // Attach timezone header
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (config.headers && config.headers.set) {
      config.headers.set("timezone", timezone);
    } else {
      config.headers["timezone"] = timezone;
    }
  } catch (error) {
    // Silent safety fallback - do not crash request
  }

  // Attach Organization header
  try {
    let orgId = null;
    if (_store) {
      orgId = _store.getState()?.organization?.currentOrgId;
    }
    // Org id lives in Redux (hydrated from refresh profile or org switch).
    if (orgId) {
      if (config.headers && config.headers.set) {
        config.headers.set("Organization", orgId);
      } else {
        config.headers["Organization"] = orgId;
      }
    }
  } catch (error) {
    // Silent safety fallback - do not crash request
  }

  return config;
};

// ─── Common Response Error Interceptor Logic ────────────────────────
const commonResponseErrorInterceptor = (error) => {
  const status = error?.response?.status;
  const url = error?.config?.url || "";

  // Handle 401 Unauthorized — force logout
  if (status === 401) {
    // Check if the user is already on the login page or making an auth request
    const isLoginPage =
      window.location.pathname === "/" || window.location.pathname === "/login";
    const isAuthRequest =
      url.includes("login") ||
      url.includes("verify") ||
      url.includes("challenge");

    if (
      error.response?.data?.message !==
        "You are not allowed to perform updated on this document" &&
      !isLoginPage &&
      !isAuthRequest
    ) {
      if (_store) {
        _store.dispatch(LOGOUT());
      }
      // Use window.location.replace to prevent back-button loops
      window.location.replace("/");
    }
    return Promise.reject(normalizeApiError(error, "Unauthorized"));
  }

  // Normalize all other errors
  return Promise.reject(normalizeApiError(error));
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(commonRequestInterceptor, (error) =>
  Promise.reject(error),
);
api.interceptors.response.use((response) => {
  const method = response.config?.method?.toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const url = response.config?.url || "";
    const isAuthRequest =
      url.includes("login") ||
      url.includes("verify") ||
      url.includes("challenge");

    if (!isAuthRequest) {
      queryClient.invalidateQueries();
    }
  }
  return response;
}, commonResponseErrorInterceptor);

export { BASE_URL };
export default api;

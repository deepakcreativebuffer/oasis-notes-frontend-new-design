/** @format */

import { logger } from "@/utils";

/** Keys written by older app versions — removed on startup / logout. */
const LEGACY_AUTH_LOCAL_STORAGE_KEYS = [
  "user",
  "userType",
  "user-timestamp",
  "orgId",
  "token",
];

/** Remove deprecated localStorage auth keys from older builds. */
export function clearLegacyAuthStorage() {
  for (const key of LEGACY_AUTH_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

/** Clears legacy auth keys and tab-scoped session prefs (no localStorage.clear). */
export function clearClientPersistence() {
  clearLegacyAuthStorage();
  try {
    sessionStorage.removeItem("medId");
  } catch (error) {
    logger.warn("Failed to clear sessionStorage for medId", error);
  }
}

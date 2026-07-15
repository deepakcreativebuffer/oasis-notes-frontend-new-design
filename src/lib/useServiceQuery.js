/** @format */

import { useQuery } from "@tanstack/react-query";

/**
 * Generic hook factory that wraps any existing service function
 * (getApi/getData based) into a TanStack Query hook.
 *
 * The service functions return { success, data, message, status }.
 * This hook extracts `data` on success and throws on failure so
 * TanStack Query's error handling kicks in.
 *
 * @param {Array} queryKey - TanStack query key from queryKeys.js
 * @param {Function} serviceFn - Async function calling an existing service
 *   e.g. () => patientService.getById(id)
 * @param {object} options - TanStack useQuery options (enabled, staleTime, etc.)
 *
 * @example
 * const { data, isLoading, error } = useServiceQuery(
 *   queryKeys.patient.detail(patientId),
 *   () => patientService.getById(patientId),
 *   { enabled: Boolean(patientId) }
 * );
 */
export function useServiceQuery(queryKey, serviceFn, options = {}) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Call the existing service (which uses getApi/handleApiRequest)
      const result = await serviceFn();

      // Service layer returns { success: true, data: ... } or { success: false, message: ... }
      if (result?.success === false) {
        const error = new Error(result.message || "Request failed");
        error.status = result.status;
        error.serviceResult = result;
        throw error;
      }

      // Return the data payload for TanStack Query to cache
      // Services return { success, data, message } — we want the data
      return result?.data ?? result;
    },
    ...options,
  });
}

/**
 * Variant with built-in select transform.
 * Useful when you need to extract nested data (e.g. result.data.docs).
 */
export function useServiceQueryWithSelect(
  queryKey,
  serviceFn,
  selectFn,
  options = {},
) {
  return useServiceQuery(queryKey, serviceFn, {
    select: selectFn,
    ...options,
  });
}

/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showNotification } from "@/utils";

/**
 * Generic mutation hook factory for create/update/delete operations.
 *
 * Wraps existing service functions (createApi, updateApi, removeApi based)
 * and adds TanStack Query cache invalidation + notification handling.
 *
 * @param {Function} mutationFn - Async function calling an existing service
 *   e.g. (payload) => vitalsService.create(payload, { isAdmin })
 * @param {object} options
 * @param {Array|Array[]} options.invalidateKeys - Query keys to invalidate on success
 * @param {string} options.successMsg - Toast message on success
 * @param {Function} options.navigate - Call navigate(-1) on success
 * @param {Function} options.onSuccess - Additional callback after success
 * @param {Function} options.onError - Additional callback after error
 * @param {object} options.queryOptions - Extra useMutation options
 *
 * @example
 * const createVital = useServiceMutation(
 *   (payload) => vitalsService.create(payload, { isAdmin }),
 *   {
 *     invalidateKeys: [queryKeys.vitals.byPatient(patientId)],
 *     successMsg: "Vital created!",
 *     navigate,
 *   }
 * );
 *
 * // In submit handler:
 * createVital.mutate(formPayload);
 */
export function useServiceMutation(mutationFn, options = {}) {
  const queryClient = useQueryClient();
  const {
    invalidateKeys = [],
    successMsg,
    navigate,
    onSuccess,
    onError,
    ...queryOptions
  } = options;

  return useMutation({
    mutationFn: async (variables) => {
      const result = await mutationFn(variables);

      // Service layer returns { success: true/false, data, message }
      if (result?.success === false) {
        const error = new Error(result.message || "Request failed");
        error.status = result.status;
        error.serviceResult = result;
        throw error;
      }

      return result;
    },

    onSuccess: (result, variables, context) => {
      // Show success notification
      if (successMsg) {
        showNotification({
          message: successMsg,
          type: "success",
        });
      } else if (result?.message && result.message !== "Success") {
        showNotification({
          message: result.message,
          type: "success",
        });
      }

      // Invalidate related queries so lists/details refetch
      const keys = Array.isArray(invalidateKeys[0])
        ? invalidateKeys
        : invalidateKeys.length > 0
          ? [invalidateKeys]
          : [];

      keys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Navigate back if configured
      if (navigate) {
        navigate(-1);
      }

      // Custom callback
      if (onSuccess) {
        onSuccess(result, variables, context);
      }
    },

    onError: (error, variables, context) => {
      // Show error notification
      showNotification({
        message: error.message || "An error occurred",
        type: "danger",
      });

      if (onError) {
        onError(error, variables, context);
      }
    },

    ...queryOptions,
  });
}

/**
 * Mutation hook for delete operations with confirmation-style UX.
 * Same as useServiceMutation but with sensible delete defaults.
 */
export function useServiceDeleteMutation(deleteFn, options = {}) {
  return useServiceMutation(deleteFn, {
    successMsg: options.successMsg || "Deleted successfully!",
    ...options,
  });
}

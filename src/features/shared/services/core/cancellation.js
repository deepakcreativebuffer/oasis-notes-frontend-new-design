/** @format */

/**
 * Creates an AbortController for request cancellation.
 * Pass `signal` to service/UI options to cancel in-flight requests.
 */
export const createRequestController = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: (reason) => controller.abort(reason),
    isAborted: () => controller.signal.aborted,
  };
};

export const isAbortError = (error) =>
  error?.name === "AbortError" ||
  error?.name === "CanceledError" ||
  error?.code === "ERR_CANCELED";

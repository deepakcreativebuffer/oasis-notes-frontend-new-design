/** @format */

/** UI-layer callbacks and options passed from components to services. */
export const UI_OPTION_KEYS = new Set([
  "setLoading",
  "setResponse",
  "setErrorMessage",
  "navigate",
  "additionalFunctions",
  "successMsg",
  "showAlert",
  "showToast",
  "context",
  "signal",
]);

/**
 * Separates business params from UI callbacks in a single options object.
 */
export const pickUiOptions = (options = {}) => {
  const params = {};
  const ui = {};

  Object.entries(options).forEach(([key, value]) => {
    if (UI_OPTION_KEYS.has(key)) {
      ui[key] = value;
    } else {
      params[key] = value;
    }
  });

  return { params, ui };
};

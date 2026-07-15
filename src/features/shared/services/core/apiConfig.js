/** @format */

/**
 * API version prefix support.
 * Set REACT_APP_API_VERSION in env to enable (e.g. "v2").
 */
const API_VERSION = import.meta.env.REACT_APP_API_VERSION || "";

export const getApiVersionPrefix = () => (API_VERSION ? `${API_VERSION}/` : "");

/**
 * Applies version prefix to an endpoint path when versioning is enabled.
 */
export const versionedPath = (path) => `${getApiVersionPrefix()}${path}`;

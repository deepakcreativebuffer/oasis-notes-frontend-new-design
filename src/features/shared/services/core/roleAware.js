/** @format */

import { createApi, updateApi, postApi } from "../common/common.api";
import { pickUiOptions } from "./uiOptions";

/**
 * Resolves admin vs employee endpoint for role-based forms.
 */
export const resolveRoleEndpoint = (
  isAdmin,
  adminEndpoint,
  employeeEndpoint,
) => (isAdmin ? adminEndpoint : employeeEndpoint);

export const createForRole = (
  isAdmin,
  adminEndpoint,
  employeeEndpoint,
  payload,
  options = {},
) => {
  const { ui } = pickUiOptions(options);
  const url = resolveRoleEndpoint(isAdmin, adminEndpoint, employeeEndpoint);
  return createApi({ url, payload, ...ui });
};

export const updateForRole = (
  isAdmin,
  adminEndpoint,
  employeeEndpoint,
  payload,
  options = {},
) => {
  const { ui } = pickUiOptions(options);
  const url = resolveRoleEndpoint(isAdmin, adminEndpoint, employeeEndpoint);
  return updateApi({ url, payload, ...ui });
};

export const postForRole = (
  isAdmin,
  adminEndpoint,
  employeeEndpoint,
  payload,
  options = {},
) => {
  const { ui } = pickUiOptions(options);
  const url = resolveRoleEndpoint(isAdmin, adminEndpoint, employeeEndpoint);
  return postApi(ui.setLoading, url, payload, ui.navigate);
};

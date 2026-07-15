/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { authService } from "../services/auth";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAuthList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.auth.list(filters),
    () => (authService.list ? authService.list(filters) : Promise.resolve([])),
    options,
  );
}

export function useAuthDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.auth.detail(id),
    () =>
      authService.getById ? authService.getById(id) : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAuth(options = {}) {
  return useServiceMutation(
    (payload) =>
      authService.create
        ? authService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.auth.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAuth(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      authService.update
        ? authService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.auth.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { authSessionService } from "../services/auth/session.service";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAuthSessionList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.authSession.list(filters),
    () =>
      authSessionService.list
        ? authSessionService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useAuthSessionDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.authSession.detail(id),
    () =>
      authSessionService.getById
        ? authSessionService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAuthSession(options = {}) {
  return useServiceMutation(
    (payload) =>
      authSessionService.create
        ? authSessionService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.authSession.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAuthSession(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      authSessionService.update
        ? authSessionService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.authSession.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

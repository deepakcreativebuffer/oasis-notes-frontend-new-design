/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { adminNotesLibraryService } from "@/features/admin/services/admin/notesLibrary.service";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAdminNotesLibraryList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.adminNotesLibrary.list(filters),
    () =>
      adminNotesLibraryService.list
        ? adminNotesLibraryService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useAdminNotesLibraryDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.adminNotesLibrary.detail(id),
    () =>
      adminNotesLibraryService.getById
        ? adminNotesLibraryService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateAdminNotesLibrary(options = {}) {
  return useServiceMutation(
    (payload) =>
      adminNotesLibraryService.create
        ? adminNotesLibraryService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminNotesLibrary.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateAdminNotesLibrary(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      adminNotesLibraryService.update
        ? adminNotesLibraryService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.adminNotesLibrary.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { uploadService } from "../services/upload";

// ─── Queries ──────────────────────────────────────────────────────────

export function useUploadList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.upload.list(filters),
    () =>
      uploadService.list ? uploadService.list(filters) : Promise.resolve([]),
    options,
  );
}

export function useUploadDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.upload.detail(id),
    () =>
      uploadService.getById ? uploadService.getById(id) : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateUpload(options = {}) {
  return useServiceMutation(
    (payload) =>
      uploadService.create
        ? uploadService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.upload.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateUpload(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      uploadService.update
        ? uploadService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.upload.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

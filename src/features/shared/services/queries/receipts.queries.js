/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { receiptsService } from "../services/receipts";

// ─── Queries ──────────────────────────────────────────────────────────

export function useReceiptsList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.receipts.list(filters),
    () =>
      receiptsService.list
        ? receiptsService.list(filters)
        : Promise.resolve([]),
    options,
  );
}

export function useReceiptsDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.receipts.detail(id),
    () =>
      receiptsService.getById
        ? receiptsService.getById(id)
        : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateReceipts(options = {}) {
  return useServiceMutation(
    (payload) =>
      receiptsService.create
        ? receiptsService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.receipts.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateReceipts(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      receiptsService.update
        ? receiptsService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.receipts.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

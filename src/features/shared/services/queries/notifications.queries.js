/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import {
  getNotifications,
  markNotificationRead,
} from "../common/notifications";

export function useNotifications(page = 1, options = {}) {
  return useServiceQuery(
    queryKeys.notifications.list(page),
    () => getNotifications(page),
    {
      // Optional polling: refetchInterval: 30000
      ...options,
    },
  );
}

export function useMarkNotificationRead(options = {}) {
  return useServiceMutation((id) => markNotificationRead(id), {
    invalidateKeys: [queryKeys.notifications.list(1)],
    ...options,
  });
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { chatService } from "../services/chat";

export function useChatGroups(options = {}) {
  return useServiceQuery(
    queryKeys.chat.groups(),
    () => chatService.listGroups(),
    options,
  );
}

export function useChatUsers(limit, options = {}) {
  return useServiceQuery(
    queryKeys.chat.users(limit),
    () => chatService.getUsersForChat(limit),
    options,
  );
}

export function useAddChatMessage(id, chatType, options = {}) {
  return useServiceMutation(
    (payload) => chatService.addMessage(id, chatType, payload),
    {
      // Depending on your WebSocket implementation, you might not need to invalidate here
      // if the WebSocket message handler invalidates or updates the cache locally.
      invalidateKeys: [queryKeys.chat.groups()],
      ...options,
    },
  );
}

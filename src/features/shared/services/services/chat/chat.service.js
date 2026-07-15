/** @format */

import { ADMIN_APIS, COMMON_APIS } from "../../Apis";
import { getApi, updateApi, createApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";

export const chatService = {
  listGroups: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.CHAT_LIST_GROUPS(),
      context: "Chat: List Groups",
      ...ui,
    });
  },

  fetchUsers: (url, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({ url, context: "Chat: Fetch Users", ...ui });
  },

  getUsersForChat: (limit, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETUSERFORCHAT(limit),
      context: "Chat: Users For Chat",
      ...ui,
    });
  },

  getEmployeesForGroup: (limit, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETUSERFORCHAT_1(limit),
      context: "Chat: Employees For Group",
      ...ui,
    });
  },

  getPatientsForGroup: (patientLimit, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETUSERFORCHAT_2(patientLimit),
      context: "Chat: Patients For Group",
      ...ui,
    });
  },

  getGuardiansForGroup: (guardianLimit, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GETUSERFORCHAT_3(guardianLimit),
      context: "Chat: Guardians For Group",
      ...ui,
    });
  },

  updateGroup: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: COMMON_APIS.CHAT_UPDATE_GROUP(id),
      payload,
      context: "Chat: Update Group",
      ...ui,
    });
  },

  createGroup: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: COMMON_APIS.CHAT_ADD_GROUP(),
      payload,
      context: "Chat: Create Group",
      ...ui,
    });
  },

  addConversation: (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: COMMON_APIS.CHAT_ADD_CONVERSATION(id),
      payload,
      context: "Chat: Add Conversation",
      ...ui,
    });
  },

  addMessage: (id, chatType, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    const type = chatType === "Group" ? "GROUP" : "CONVERSATION";
    return createApi({
      url: COMMON_APIS.CHAT_ADD_MESSAGE(id, type),
      payload,
      context: "Chat: Add Message",
      ...ui,
    });
  },
};

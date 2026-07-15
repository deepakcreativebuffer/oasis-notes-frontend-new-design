import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setChatID, setDocumentID } from "@/store/chatSlice";
import { defaultUserImg } from "@/assets/index";
import { fetchPaitentName } from "@/utils/utils";
import "./Chat.css";
import Button from "react-bootstrap/Button";
import { MdOutlineGroupAdd, MdDeleteOutline } from "react-icons/md";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";

const ChatMenu = React.memo(
  ({
    profilePic,
    userId,
    chatUsers,
    groupLists,
    collections,
    handleClickChangeType,
    handleCreateChat,
    userType,
    userProfileType,
    handleDelete,
    chatId,
  }) => {
    const dispatch = useDispatch();
    const [chatType, setChatType] = useState("Employee");

    useEffect(() => {
      if (userProfileType === "Patient") {
        handleClickChangeType("Patient");
        setChatType("Patient");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (userType) {
        handleClickChangeType(userType);
        setChatType(userType);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType]);

    const documentIdSetter = useCallback(
      (id, chatId) => {
        dispatch(setChatID(chatId));
        dispatch(setDocumentID(id));
      },
      [dispatch],
    );

    const documentIdGroupSetter = useCallback(
      (id) => {
        dispatch(setChatID(id));
        dispatch(setDocumentID(id));
      },
      [dispatch],
    );

    const sortedChatUsers = useMemo(() => {
      return chatUsers
        ? [...chatUsers].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          )
        : [];
    }, [chatUsers]);

    const sortedGroupLists = useMemo(() => {
      return groupLists
        ? [...groupLists].sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
          )
        : [];
    }, [groupLists]);

    return (
      <div className="sidemenu-list">
        <div className="active-chat-person">
          <div className="active-chat-avatar">
            {profilePic ? (
              <img
                src={getObjectUrlFromDownloadUrl(profilePic)}
                alt=""
                className="avatar-img"
              />
            ) : (
              <img src={defaultUserImg} alt="" className="avatar-img" />
            )}
          </div>
          <Button className="add-chat-group" onClick={handleCreateChat}>
            <MdOutlineGroupAdd />
          </Button>
        </div>
        <div className="chat-group">
          {userProfileType === "Employee" && (
            <>
              <div
                className={
                  chatType === "Group"
                    ? "chat-group-badge active"
                    : "chat-group-badge"
                }
                onClick={() => {
                  handleClickChangeType("Group");
                  setChatType("Group");
                  documentIdSetter("");
                }}
              >
                <span className="chat-badge-text">Group</span>
                {chatType === "Group" && sortedGroupLists?.length > 0 && (
                  <span className="chat-count">{sortedGroupLists?.length}</span>
                )}
              </div>
              <div
                className={
                  chatType === "Employee"
                    ? "chat-group-badge active"
                    : "chat-group-badge"
                }
                onClick={() => {
                  handleClickChangeType("Employee");
                  setChatType("Employee");
                  documentIdSetter("");
                }}
              >
                <span className="chat-badge-text">Employee</span>
                {chatType === "Employee" && sortedChatUsers?.length > 0 && (
                  <span className="chat-count">{sortedChatUsers?.length}</span>
                )}
              </div>
              <div
                className={
                  chatType === "Patient"
                    ? "chat-group-badge active"
                    : "chat-group-badge"
                }
                onClick={() => {
                  handleClickChangeType("Patient");
                  setChatType("Patient");
                  documentIdSetter("");
                }}
              >
                <span className="chat-badge-text">Resident</span>
                {chatType === "Patient" && sortedChatUsers?.length > 0 && (
                  <span className="chat-count">{sortedChatUsers?.length}</span>
                )}
              </div>
            </>
          )}

          {(userProfileType === "Patient" ||
            userProfileType === "Guardian") && (
            <>
              <div
                className={
                  chatType === "Employee"
                    ? "chat-group-badge active"
                    : "chat-group-badge"
                }
                onClick={() => {
                  handleClickChangeType("Employee");
                  setChatType("Employee");
                  documentIdSetter("");
                }}
              >
                <span className="chat-badge-text">Employee</span>
                {chatType === "Employee" && (
                  <span className="chat-count">{sortedChatUsers?.length}</span>
                )}
              </div>
            </>
          )}
        </div>
        {sortedChatUsers?.length > 0 &&
        (chatType === "Patient" || chatType === "Employee") ? (
          <nav className="menu-list">
            {sortedChatUsers?.map((nav, index) => (
              <div
                key={`chats${nav._id}${index}`}
                className={`chat-group-list ${
                  nav._id === chatId ? "active" : ""
                } cursor-pointer`}
                onClick={() =>
                  documentIdSetter(
                    nav?.memberTwo?._id !== userId
                      ? nav?.memberTwo?._id
                      : nav?.memberOne?._id,
                    nav._id,
                  )
                }
              >
                <div className="chatperson">
                  <div className="avatar-icon">
                    {chatType === "Group" ? (
                      <img
                        src={getObjectUrlFromDownloadUrl(nav?.data?.image)}
                        alt=""
                        className="original-img"
                      />
                    ) : nav ? (
                      <img
                        src={
                          nav?.memberTwo?._id !== userId
                            ? getObjectUrlFromDownloadUrl(
                                nav?.memberTwo?.profilePic,
                              )
                            : getObjectUrlFromDownloadUrl(
                                nav?.memberOne?.profilePic,
                              )
                        }
                        alt=""
                        className="original-img"
                      />
                    ) : (
                      <img
                        src={defaultUserImg}
                        alt=""
                        className="original-img"
                      />
                    )}
                  </div>
                  <div className="avatar-info">
                    <div className="avatarname">
                      <span className="sendername">
                        {chatType === "Group"
                          ? `${nav?.data?.title}`
                          : nav?.memberTwo?._id !== userId
                            ? fetchPaitentName(nav?.memberTwo)
                            : fetchPaitentName(nav?.memberOne)}{" "}
                        {nav?.unreadMessagesCount > 0 && (
                          <span className="unread-msg">
                            {nav?.unreadMessagesCount}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="chat-messagesline-delete">
                    <MdDeleteOutline
                      onClick={() => handleDelete(nav._id, "chat")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </nav>
        ) : (
          (chatType === "Patient" || chatType === "Employee") && (
            <div className="sidebar empty">
              <p className="absolute-p mx-2 my-2">No Chat Found</p>
            </div>
          )
        )}
        {sortedGroupLists?.length > 0 && chatType === "Group" ? (
          <nav className="menu-list">
            {sortedGroupLists?.map((nav, index) => (
              <div
                key={`chats${nav.id}${index}`}
                className={`chat-group-list ${
                  nav._id === chatId ? "active" : ""
                } cursor-pointer`}
                onClick={() => documentIdGroupSetter(nav?._id)}
              >
                <div className="chatperson">
                  <div className="avatar-icon">
                    {nav?.logo ? (
                      <img
                        src={getObjectUrlFromDownloadUrl(nav?.logo)}
                        alt=""
                        className="original-img"
                      />
                    ) : (
                      <img
                        src={defaultUserImg}
                        alt=""
                        className="original-img"
                      />
                    )}
                  </div>
                  <div className="avatar-info">
                    <div className="avatarname">
                      <span className="sendername">
                        {nav?.name}
                        {nav?.unreadMessagesCount > 0 && (
                          <span className="unread-msg">
                            {nav?.unreadMessagesCount}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  {nav?.createdBy?._id === userId && (
                    <div className="chat-messagesline-delete">
                      <MdDeleteOutline
                        onClick={() => handleDelete(nav?._id, "group")}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>
        ) : (
          chatType === "Group" && (
            <div className="sidebar empty">
              <p className="absolute-p mx-2 my-2">No Chat Found</p>
            </div>
          )
        )}
      </div>
    );
  },
);

export default ChatMenu;

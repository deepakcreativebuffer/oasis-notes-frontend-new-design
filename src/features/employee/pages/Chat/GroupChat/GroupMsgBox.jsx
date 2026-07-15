/* eslint-disable eqeqeq */
/** @format */

import { useEffect, useRef, useState } from "react";
import { fetchPaitentName, formatDateToMMDDYYYY } from "@/utils/utils";
import { sendSvg as sendsvg } from "@/assets";
import { defaultUserImg } from "@/assets/index";
import { GroupInfo } from "@/features/shared/ui/Canvas/Canvases";
import {
  chatService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import { getSocket } from "@/socket";
import { useDispatch } from "react-redux";
import { updateUnreadMessageCount } from "@/store/authSlice";
import { COMMON_APIS } from "@/features/shared/services";
import { logger } from "@/utils";
const socket = getSocket();
const GroupMsgBox = ({
  document,
  messages,
  setNewMessage,
  newMessage,
  handleOnSubmit,
  senderId,
  chatType,
  chatListHandler,
}) => {
  const dispatch = useDispatch();
  const [groupChatData, setGroupChatData] = useState([]);
  const [displayMessages, setDisplayMessages] = useState([]);
  const chatsContainerRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Scroll when messages are updated

  const getChat = async (id) => {
    if (id) {
      try {
        await chatService.fetchUsers(COMMON_APIS.CHAT_GET_CHAT(id), {
          setResponse: setGroupChatData,
        });
        const event = {
          id,
          userId: senderId,
        };
        socket.emit("open-group", JSON.stringify(event));
      } catch (error) {
        logger.error("Error creating chat:", error);
      }
      chatListHandler();
    }
  };
  useEffect(() => {
    if (document?._id) {
      getChat(document?._id);
      dispatch(
        updateUnreadMessageCount({
          count: document.unreadMessagesCount,
          read: true,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?._id]);

  // Update display messages when historical data arrives
  useEffect(() => {
    if (groupChatData?.data?.data?.messages) {
      setDisplayMessages(groupChatData.data.data.messages);
    }
  }, [groupChatData]);

  // Merge live socket messages
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const activeUserMessages = messages.filter((message) => {
      return message.GroupId == document?._id;
    });

    if (activeUserMessages.length > 0) {
      setDisplayMessages((prev) => {
        // Prevent duplicates
        const newMessages = activeUserMessages.filter(
          (liveMsg) =>
            !prev.some((existingMsg) => existingMsg._id === liveMsg._id),
        );
        return [...prev, ...newMessages];
      });
    }
  }, [messages, document?._id]);
  // Auto-scroll effect
  useEffect(() => {
    setTimeout(() => {
      if (chatsContainerRef.current) {
        chatsContainerRef.current.scrollTop =
          chatsContainerRef.current.scrollHeight;
      }
    }, 0);
  }, [displayMessages]);
  return (
    <>
      <GroupInfo
        show={open}
        handleClose={() => setOpen(false)}
        document={document}
        chatListHandler={chatListHandler}
        isExistGroup={true}
      />
      {document ? (
        <div className="chat-box group-chat-box">
          <div
            className="chat-header cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {document?.logo ? (
              <img
                src={getObjectUrlFromDownloadUrl(document?.logo)}
                alt=""
                className="original-img"
              />
            ) : (
              <img src={defaultUserImg} alt="" className="original-img" />
            )}

            <div className="desc">
              <span className="title">{document?.name}</span>
              <span className="w-full overflow-hidden">
                {document.createdBy?._id !== senderId && (
                  <span className="members-list">
                    {fetchPaitentName(document.createdBy)}
                    {document?.members?.length && " ,"}
                  </span>
                )}
                {document?.members
                  ?.filter((el) => el?._id !== senderId)
                  ?.slice(0, 8)
                  ?.map((i, index, arr) => {
                    return (
                      <span className="members-list" key={`member${index}`}>
                        {" "}
                        {i && fetchPaitentName(i)}
                        {index != arr.length - 1 && " ,"}
                      </span>
                    );
                  })}
                {document.members?.length > 8 && "..."}
              </span>
            </div>
          </div>
          <div className="chat-texts">
            <div className="chats-messages" ref={chatsContainerRef}>
              {displayMessages?.length > 0 &&
                displayMessages?.map((i, index) => (
                  <div
                    key={index}
                    className={
                      i?.sentBy?._id === senderId
                        ? "message-right message-in"
                        : "message-left message-in"
                    }
                  >
                    <div className="main-div">
                      {i?.sentBy?.profilePic ? (
                        <img
                          src={getObjectUrlFromDownloadUrl(
                            i?.sentBy?.profilePic,
                          )}
                          alt=""
                          className="profile_pic"
                        />
                      ) : (
                        <img
                          className="img"
                          alt="default user"
                          src={defaultUserImg}
                        />
                      )}
                      <div
                        className={
                          i?.sentBy?._id !== senderId
                            ? "left-group"
                            : "right-group"
                        }
                        key={`document${index}`}
                      >
                        <div className="original-text">
                          <p className="text-group-message text-[#1c5877]">
                            {" "}
                            {fetchPaitentName(i?.sentBy)}{" "}
                          </p>
                          <p className="text-base text-gray-800"> {i.text} </p>
                          {i.createdAt && (
                            <span className="date-group-msg">
                              {`${formatDateToMMDDYYYY(i.createdAt)}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <form
              onSubmit={(e) => {
                handleOnSubmit(e, chatType, document?._id);
              }}
            >
              <input
                type="text"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />

              <button type="submit">
                {" "}
                <img src={sendsvg} alt="" />{" "}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="content empty">
          <p className="absolute-p">Please select a chat to view messages</p>
        </div>
      )}
    </>
  );
};
export default GroupMsgBox;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { sendSvg as sendsvg } from "@/assets";
import { defaultUserImg } from "@/assets/index";
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
const fetchName = (i) => {
  if (i?.firstName || i?.lastName) {
    return `${i?.firstName} ${i?.lastName}`;
  } else {
    return i?.fullName;
  }
};
const MessageBox = React.memo(
  ({
    document,
    messages,
    setNewMessage,
    newMessage,
    handleOnSubmit,
    senderId,
    chatType,
    activeId,
    chatListHandler,
  }) => {
    const dispatch = useDispatch();
    const [chatUserData, setChatUserData] = useState([]);
    const chatsContainerRef = useRef(null);

    // Auto-scroll effect
    useEffect(() => {
      setTimeout(() => {
        if (chatsContainerRef.current) {
          chatsContainerRef.current.scrollTop =
            chatsContainerRef.current.scrollHeight;
        }
      }, 0);
    }, [chatUserData?.data?.data?.messages]);
    const getChat = useCallback(
      async (id) => {
        if (id) {
          try {
            await chatService.fetchUsers(COMMON_APIS.CHAT_GET_CHAT_1(id), {
              setResponse: setChatUserData,
            });
            const event = {
              id,
              userId: senderId,
            };
            socket.emit("open-chat", JSON.stringify(event));
          } catch (error) {
            logger.error("Error creating chat:", error);
          }
          chatListHandler();
        }
      },
      [senderId, chatListHandler],
    );
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

    // Merge chat history with socket messages
    useEffect(() => {
      if (!messages || messages.length === 0) return;
      const activeUserMessages = messages.filter(
        (message) => message.ConversationId === document?._id,
      );
      setChatUserData((prevState) => ({
        ...prevState,
        data: {
          ...prevState?.data,
          data: {
            ...prevState?.data?.data,
            messages: [
              ...(prevState?.data?.data?.messages || []),
              ...activeUserMessages,
            ],
          },
        },
      }));
    }, [messages, document?._id]); // Depend on document._id to update when it changes

    return document && document ? (
      <div className="chat-box">
        <div className="chat-header">
          <span>
            <img
              src={
                document?.memberOne?._id !== senderId
                  ? getObjectUrlFromDownloadUrl(document?.memberOne?.profilePic)
                  : getObjectUrlFromDownloadUrl(document?.memberTwo?.profilePic)
                    ? getObjectUrlFromDownloadUrl(
                        document?.memberTwo?.profilePic,
                      )
                    : defaultUserImg
              }
              alt=""
              className="original-img"
            />
            {document?.memberOne?._id !== senderId
              ? fetchName(document?.memberOne)
              : fetchName(document?.memberTwo)}{" "}
          </span>
        </div>
        <div className="chat-texts">
          <div className="chats-messages" ref={chatsContainerRef}>
            {chatUserData?.data?.data?.messages?.length > 0 &&
              chatUserData?.data?.data?.messages?.map((i, index) => (
                <div
                  key={index}
                  className={
                    i?.sentBy?._id === senderId
                      ? "message-right message-in"
                      : "message-left message-in"
                  }
                >
                  <div
                    className={i?.sentBy?._id === senderId ? "left" : "right"}
                    key={`document${index}`}
                  >
                    <div className="original-text">
                      <p className="text"> {i.text} </p>
                      {i.createdAt && (
                        <span className="date">
                          {`${formatDateToMMDDYYYY(i.createdAt)}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            {messages.map((msg, index) => (
              <div
                key={`socket-${index}`}
                className={`message ${msg.senderId === senderId ? "sent" : "received"}`}
              >
                <p>{msg.message}</p>
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
              <img src={sendsvg} alt="" />
            </button>
          </form>
        </div>
      </div>
    ) : (
      <div className="content empty">
        <p className="absolute-p">Please select a chat to view messages</p>
      </div>
    );
  },
);
export default MessageBox;

/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { getSocket } from "@/socket";
import { useDispatch, useSelector } from "react-redux";
import { userProfile, isAuthenticated } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import MessageBox from "./MessageBox";
import ChatMenu from "./ChatMenu";
import {
  fetchDocumentId,
  selectChatMenu,
  setChatMenuData,
  updateUnreadMessages,
  fetchChatId,
  setGroupChatMenuData,
  updateGroupUnreadMessages,
  selectGroupChatMenu,
} from "@/store/chatSlice";
import CreateChat from "./CreateChat";
import GroupMsgBox from "./GroupChat/GroupMsgBox";
import { Card, Container } from "react-bootstrap";
import HOC from "@/features/shared/layout/Outer/HOC";
import { chatService, removeApi } from "@/features/shared/services";
import DeleteConfirmationModal from "./DeleteConfirmationModel";
import { ROLES, ROUTES } from "@/features/shared/constants";
const socket = getSocket();
const Chat = () => {
  const documentId = useSelector(fetchDocumentId);
  const chats = useSelector(selectChatMenu);
  const groupChats = useSelector(selectGroupChatMenu);
  const chatId = useSelector(fetchChatId);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});
  const ProfileDetails = useSelector(userProfile);
  const isLoggedIn = useSelector(isAuthenticated);
  const navigate = useNavigate();
  const [chatType, setChatType] = useState("");
  const [userType, setUserType] = useState("Employee");
  const [isChat, setIsChat] = useState(false);
  const [collections, setCollections] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchingDocument, setMatchingDocument] = useState(null);
  const [matchingGroupDocument, setMatchingGroupDocument] = useState(null);
  const [listGroups, setlistGroups] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteChatId, setDeleteChatId] = useState("");
  const [deleteType, setDeleteType] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const currentUserId = ProfileDetails?._id;
    if (!currentUserId) return;

    socket.on("new-direct-message", (data) => {
      setMessages([data?.message]);
      dispatch(
        updateUnreadMessages({
          conversationId: data.conversationId,
          sentBy: data.message.sentBy._id,
          updatedAt: data?.message?.updatedAt,
          currentUserId,
        }),
      );
    });
    socket.on("new-group-message", (data) => {
      setGroupMessages([{ ...data?.message, GroupId: data?.GroupId }]);
      dispatch(
        updateGroupUnreadMessages({
          groupId: data.GroupId,
          sentBy: data.message.sentBy._id,
          updatedAt: data?.message?.updatedAt,
          currentUserId,
        }),
      );
    });

    return () => {
      socket.off("new-direct-message");
      socket.off("new-group-message");
    };
  }, [dispatch, ProfileDetails?._id]);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.HOME);
    } else if (ProfileDetails) {
      setUser({
        userId: ProfileDetails._id,
        userType: ProfileDetails.userType,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, ProfileDetails]);
  function handleClickChangeType(name) {
    setChatType(name);
  }
  const fetchChatListHandler = async () => {
    if (chatType !== "Group" && chatType) {
      const url =
        ProfileDetails?.userType === ROLES.PATIENT ||
        ProfileDetails?.userType === ROLES.GUARDIAN
          ? `chat/list-conversations`
          : `chat/list-conversations?type=${chatType}`;
      const { data } =
        (await chatService.fetchUsers(url, {
          setResponse: (response) => {
            setChatUsers(response);
            dispatch(setChatMenuData(response.data));
          },
          setLoading,
        })) || {};
      (data || []).forEach((element) => {
        const event = {
          type: "CONVERSATION",
          id: element._id,
        };
        socket.emit("join-room", JSON.stringify(event));
      });
    } else {
      const { data } =
        (await chatService.listGroups({
          setResponse: (response) => {
            setlistGroups(response);
            dispatch(setGroupChatMenuData(response.data?.data));
          },
          setLoading,
        })) || {};
      (data?.data || []).forEach((element) => {
        const event = {
          type: "GROUP",
          id: element._id,
        };
        socket.emit("join-room", JSON.stringify(event));
      });
    }
  };
  useEffect(() => {
    fetchChatListHandler();
    socket.emit("change-chat-type", ProfileDetails._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatType]);
  const handleCreateChat = () => {
    setIsChat(!isChat);
  };
  useEffect(() => {
    if (documentId && chatUsers?.data) {
      const foundDocument = chatUsers.data.find(
        (doc) =>
          doc.memberOne._id === documentId || doc.memberTwo._id === documentId,
      );
      setMatchingDocument(foundDocument || null);
    } else {
      setMatchingDocument(null);
    }
  }, [documentId, chatUsers?.data]);
  useEffect(() => {
    if (documentId && listGroups?.data?.data) {
      const foundDocument = listGroups.data.data.find(
        (doc) => doc?._id === documentId,
      );
      setMatchingGroupDocument(foundDocument || null);
    } else {
      setMatchingGroupDocument(null);
    }
  }, [documentId, listGroups?.data?.data]);
  const updateChat = async (e, chatType, id) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const messageText = newMessage;
    setNewMessage("");
    try {
      const response = await chatService.addMessage(
        id,
        chatType,
        {
          text: messageText,
        },
        {
          setLoading,
          showAlert: false,
        },
      );
      // Optimistically add the sent message to the UI immediately
      const savedMessage = response?.data?.data || response?.data;
      if (savedMessage && savedMessage._id) {
        const optimisticMessage = {
          ...savedMessage,
          sentBy: {
            _id: ProfileDetails?._id,
            firstName: ProfileDetails?.firstName,
            lastName: ProfileDetails?.lastName,
            profilePic: ProfileDetails?.profilePic,
          },
        };
        if (chatType === "Group") {
          setGroupMessages([{ ...optimisticMessage, GroupId: id }]);
        } else {
          setMessages([optimisticMessage]);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const confirmDeleteChat = () => {
    if (deleteChatId) {
      removeApi({
        url:
          chatType === "Group"
            ? `chat/delete-group/${deleteChatId}`
            : `chat/delete-conversation/${deleteChatId}`,
        additionalFunctions: [fetchChatListHandler],
        showToast: false,
      });
    }
    setShowDeleteModal(false);
    setDeleteChatId(null);
  };
  const handleDelete = (id, type) => {
    setDeleteType(type);
    setDeleteChatId(id);
    setShowDeleteModal(true);
  };
  return (
    <>
      <DeleteConfirmationModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={confirmDeleteChat}
        type={deleteType}
      />
      {ProfileDetails.adminId?.permissionChat === true ? (
        <>
          <CreateChat
            show={isChat}
            handleClose={() => setIsChat(false)}
            setUserType={setUserType}
            userType={userType}
            chatType={chatType}
            chatListHandler={fetchChatListHandler}
          />
          {user && (
            <>
              <div className="chat">
                <div className="chat-sidebar">
                  <ChatMenu
                    profilePic={ProfileDetails?.profilePic}
                    userId={ProfileDetails?._id}
                    chatUsers={chats}
                    groupLists={groupChats}
                    collections={collections}
                    handleClickChangeType={(e) => handleClickChangeType(e)}
                    handleCreateChat={handleCreateChat}
                    userType={userType}
                    userProfileType={ProfileDetails?.userType}
                    handleDelete={handleDelete}
                    chatId={chatId}
                  />
                </div>
                {chatUsers?.data || matchingGroupDocument ? (
                  documentId ? (
                    <div className="content">
                      {chatType !== "Group" ? (
                        <MessageBox
                          document={matchingDocument}
                          messages={messages}
                          setNewMessage={setNewMessage}
                          handleOnSubmit={updateChat}
                          newMessage={newMessage}
                          senderId={ProfileDetails?._id}
                          chatType={chatType}
                          activeId={documentId}
                          chatListHandler={fetchChatListHandler}
                        />
                      ) : (
                        <GroupMsgBox
                          document={matchingGroupDocument}
                          messages={groupMessages}
                          setNewMessage={setNewMessage}
                          handleOnSubmit={updateChat}
                          newMessage={newMessage}
                          senderId={ProfileDetails?._id}
                          chatType={chatType}
                          chatListHandler={fetchChatListHandler}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="content empty">
                      <p className="absolute-p">
                        Please select a chat to view messages
                      </p>
                    </div>
                  )
                ) : (
                  <div className="empty-message-box">
                    Please Add a chat to view messages
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <Container fluid>
          <Card body>You have not permission of chat</Card>
        </Container>
      )}
    </>
  );
};
export default HOC({
  Wcomponenet: Chat,
});

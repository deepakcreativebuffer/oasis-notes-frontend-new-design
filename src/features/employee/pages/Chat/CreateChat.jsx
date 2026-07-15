/* eslint-disable no-unused-vars */
/** @format */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  chatService,
  getObjectUrlFromDownloadUrl,
} from "@/features/shared/services";
import { Modal } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { CreateGroup } from "@/features/shared/ui/Canvas/Canvases";
import { fetchPaitentName } from "@/utils/utils";
import { defaultUserImg } from "@/assets";
import "./Chat.css";
import { getSocket } from "@/socket";
import { ROLES } from "@/features/shared/constants";
import { logger } from "@/utils";
const socket = getSocket();
const CreateChat = ({
  handleClose,
  show,
  setUserType,
  chatType,
  chatListHandler,
}) => {
  const [allEmployees, setAllEmployees] = useState({});
  const [allPatients, setAllPatients] = useState({});
  const [limit, setLimit] = useState(25);
  const [patientLimit, setPatientLimit] = useState(25);
  const [patientLoading, setPatientLoading] = useState(false);
  const [allGuardians, setAllGuardians] = useState({});
  const [guardianLoading, setGuardianLoading] = useState(false);
  const [guardianLimit, setGuardianLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const ProfileDetails = useSelector(userProfile);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (show) {
      chatService.getEmployeesForGroup(limit, {
        setResponse: setAllEmployees,
        setLoading,
      });
      chatService.getPatientsForGroup(patientLimit, {
        setResponse: setAllPatients,
        setLoading: setPatientLoading,
      });
      chatService.getGuardiansForGroup(guardianLimit, {
        setResponse: setAllGuardians,
        setLoading: setGuardianLoading,
      });
    }
  }, [limit, patientLimit, guardianLimit, show]);
  const hasMore =
    allEmployees?.data?.totalDocs > allEmployees?.data?.docs?.length;
  const hasMorePatient =
    allPatients?.data?.totalDocs > allPatients?.data?.docs?.length;
  const hasMoreGuardian =
    allGuardians?.data?.totalDocs > allGuardians?.data?.docs?.length;
  const loadMore = useCallback(() => {
    if (limit < allEmployees?.data?.totalDocs) {
      setLimit((prev) => prev + 25);
    }
  }, [limit, allEmployees?.data?.totalDocs]);
  const loadMorePatient = useCallback(() => {
    if (patientLimit < allPatients?.data?.totalDocs) {
      setPatientLimit((prev) => prev + 25);
    }
  }, [patientLimit, allPatients?.data?.totalDocs]);
  const loadMoreGuardian = useCallback(() => {
    if (guardianLimit < allGuardians?.data?.totalDocs) {
      setPatientLimit((prev) => prev + 25);
    }
  }, [guardianLimit, allGuardians?.data?.totalDocs]);
  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: loading,
  });
  const [patientRef] = useInfiniteScroll({
    loading: patientLoading,
    hasNextPage: hasMorePatient,
    onLoadMore: loadMorePatient,
    disabled: patientLoading,
  });
  const [guardianRef] = useInfiniteScroll({
    loading: guardianLoading,
    hasNextPage: hasMoreGuardian,
    onLoadMore: loadMoreGuardian,
    disabled: guardianLoading,
  });
  const handleCreateConversation = useCallback(
    async (id) => {
      try {
        const res = await chatService.addConversation(
          id,
          {},
          {
            setLoading,
            showAlert: false,
            navigate: navigate(
              ProfileDetails?.userType === ROLES.GUARDIAN ||
                ProfileDetails?.userType === ROLES.PATIENT
                ? "/chatPatient"
                : "/chat",
            ),
          },
        );
        handleClose();
        chatListHandler();
        if (res?.data) {
          const emitData = {
            type: "CONVERSATION",
            id: res?.data?.conversation?._id,
          };
          socket.emit("join-room", JSON.stringify(emitData));
        }
      } catch (error) {
        logger.error("Error creating chat:", error);
      }
      handleClose();
      chatListHandler();
    },
    [ProfileDetails?.userType, handleClose, chatListHandler, navigate],
  );
  const openGroup = useCallback(() => {
    handleClose();
    setOpen(true);
    setUserType("Group");
  }, [handleClose, setUserType]);
  const filterdEmployees = useMemo(
    () =>
      allEmployees?.data?.docs?.filter((i) => i._id !== ProfileDetails?._id),
    [allEmployees?.data?.docs, ProfileDetails?._id],
  );
  const filterdPatients = useMemo(
    () => allPatients?.data?.docs?.filter((i) => i._id !== ProfileDetails?._id),
    [allPatients?.data?.docs, ProfileDetails?._id],
  );
  const filterdGuardian = useMemo(
    () =>
      allGuardians?.data?.docs?.filter((i) => i._id !== ProfileDetails?._id),
    [allGuardians?.data?.docs, ProfileDetails?._id],
  );
  return (
    <>
      <CreateGroup
        show={open}
        handleClose={() => setOpen(false)}
        chatListHandler={chatListHandler}
      />
      <Modal show={show} onHide={handleClose} placement="end">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Create New Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chatType === "Group" && (
            <div className="employee-btn-joiner">
              <button
                type="button"
                className="employee_create_btn"
                onClick={openGroup}
              >
                Create New Group
              </button>
            </div>
          )}

          {chatType === "Employee" && filterdEmployees?.length > 0 && (
            <>
              <h5 className="fw-bold">
                Employees ({filterdEmployees?.length})
              </h5>
              <div className="create-new-chat-room">
                {filterdEmployees?.map((i, index) => (
                  <div
                    className="select-employee"
                    key={`user${index}`}
                    onClick={() => handleCreateConversation(i?._id)}
                  >
                    <div className="group-chat-info">
                      <img
                        src={
                          i.profilePic
                            ? getObjectUrlFromDownloadUrl(i.profilePic)
                            : defaultUserImg
                        }
                        className="original-img"
                        alt=""
                      />
                      <div className="content">
                        <p className="heading text-start">
                          {fetchPaitentName(i)}
                        </p>
                        <p className="faded">{i.mobileNumber}</p>
                        <p className="faded">{i.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && <ClipLoader />}
                <div ref={sentryRef}></div>
              </div>
            </>
          )}

          {chatType === "Patient" && filterdPatients?.length > 0 && (
            <>
              <h5 className="fw-bold">Residents ({filterdPatients?.length})</h5>
              <div className="create-new-chat-room">
                {filterdPatients?.map((i, index) => (
                  <div
                    className="select-employee"
                    key={`patient${index}`}
                    onClick={() => handleCreateConversation(i?._id)}
                  >
                    <div className="group-chat-info">
                      <img
                        src={
                          i.profilePic
                            ? getObjectUrlFromDownloadUrl(i.profilePic)
                            : defaultUserImg
                        }
                        className="original-img"
                        alt=""
                      />
                      <div className="content">
                        <p className="heading text-start">
                          {fetchPaitentName(i)}
                        </p>
                        <p className="faded">{i.mobileNumber}</p>
                        <p className="faded">{i.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {patientLoading && <ClipLoader />}
                <div ref={patientRef}></div>
              </div>
            </>
          )}

          {chatType === "Guardian" && filterdGuardian?.length > 0 && (
            <>
              <h5 className="fw-bold">Guardian ({filterdGuardian?.length})</h5>
              <div className="create-new-chat-room">
                {filterdGuardian?.map((i, index) => (
                  <div
                    className="select-employee"
                    key={`guardian${index}`}
                    onClick={() => handleCreateConversation(i?._id)}
                  >
                    <div className="group-chat-info">
                      <img
                        src={
                          i.profilePic
                            ? getObjectUrlFromDownloadUrl(i.profilePic)
                            : defaultUserImg
                        }
                        className="original-img"
                        alt=""
                      />
                      <div className="content">
                        <p className="heading text-start">
                          {fetchPaitentName(i)}
                        </p>
                        <p className="faded">{i.mobileNumber}</p>
                        <p className="faded">{i.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {guardianLoading && <ClipLoader />}
                <div ref={guardianRef}></div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
export default CreateChat;

/** @format */
import React, { useCallback, useMemo } from "react";
import { OverlayTrigger, Tooltip, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NoFound from "./Loader/NoFound";
import { userProfile } from "@/store/authSlice";
import { useSelector } from "react-redux";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCopy, FaEdit, FaEye } from "react-icons/fa";
import Loader from "./Loader/Loader";
import { FaFileSignature } from "react-icons/fa";

import { ROLES, ACCOUNT_TYPES } from "../constants";

export const InDraft = React.memo(({ link }) => {
  const renderTooltip = useCallback(
    (props) => (
      <Tooltip id="button-tooltip" {...props}>
        In Draft
      </Tooltip>
    ),
    [],
  );
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <Link to={link}>
        <div className="in-draft-icon cursor-pointer">
          <i className="fa-regular fa-file"></i>
        </div>
      </Link>
    </OverlayTrigger>
  );
});

export const DropList = React.memo(
  ({
    showDownload,
    download,
    showView = true,
    showEdit,
    showDelete,
    viewLink,
    deleteLink,
    editLink,
    behavioralHealthProfessionalData,
    behavioralHealthProfessional,
    canEdit,
    canDelete,
    showClone,
    cloneFile,
    isTrackingEdit = false,
    isOnlyAdmin = true,
    isSignAvailable = true,
    signatureButton = false,
  }) => {
    const ProfileDetails = useSelector(userProfile);

    const index = useMemo(() => {
      return behavioralHealthProfessional?.indexOf(ProfileDetails?._id) ?? -1;
    }, [behavioralHealthProfessional, ProfileDetails?._id]);

    const { showEditBtn, showDeleteBtn } = useMemo(() => {
      let editBtn = false;
      let deleteBtn = false;

      if (index !== -1) {
        editBtn =
          ProfileDetails?.userType === ROLES.ADMIN ||
          (showEdit === true &&
            behavioralHealthProfessionalData?.[index]?.signature === "") ||
          (showEdit === true &&
            ProfileDetails?.accountType === ACCOUNT_TYPES.ADMINISTRATOR) ||
          (ProfileDetails?.accountType === ACCOUNT_TYPES.REGULAR &&
            ProfileDetails?.userType === ROLES.EMPLOYEE &&
            ProfileDetails.permissionEditDocuments === true);
      }
      deleteBtn =
        ProfileDetails.userType === ROLES.ADMIN ||
        ProfileDetails?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
        (ProfileDetails?.accountType === ACCOUNT_TYPES.REGULAR &&
          ProfileDetails?.userType === ROLES.EMPLOYEE &&
          canDelete);
      if (canEdit) {
        editBtn = true;
      }

      if (ProfileDetails?.userType === ROLES.ADMIN) editBtn = true;

      return { showEditBtn: editBtn, showDeleteBtn: deleteBtn };
    }, [
      index,
      ProfileDetails,
      showEdit,
      behavioralHealthProfessionalData,
      canEdit,
      canDelete,
    ]);

    return (
      <div className="icon-joiner">
        {showView && (
          <Link className="view-btn" to={viewLink}>
            <FaEye />
          </Link>
        )}
        {showDownload && (
          <Link className="view-btn" to={download}>
            <i className="fa-solid fa-download"></i>
          </Link>
        )}
        {showEditBtn && !isTrackingEdit && isSignAvailable && (
          <Link className="edit-btn" to={editLink}>
            {ProfileDetails?.userType === ROLES.GUARDIAN ||
            ProfileDetails?.userType === ROLES.PATIENT ||
            signatureButton ? (
              <FaFileSignature />
            ) : (
              <FaEdit />
            )}
          </Link>
        )}
        {showDeleteBtn && isOnlyAdmin && (
          <Link className="del-btn">
            <RiDeleteBin5Fill onClick={deleteLink} />
          </Link>
        )}
        {showClone && (
          <Link className="edit-btn">
            <FaCopy onClick={cloneFile} />
          </Link>
        )}
      </div>
    );
  },
);

export const TableLayout = React.memo(({ thead, tbody, loading }) => {
  return loading ? (
    <Loader />
  ) : tbody?.length > 0 ? (
    <Table responsive bordered className="table-cell-ellipsis">
      <thead>
        <tr>
          {thead?.map((i, index) => (
            <th key={`thead${index}`}> {i} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tbody?.map((rowData, rowIndex) => (
          <tr key={`row${rowIndex}`}>
            {rowData?.map((cellData, cellIndex) => (
              <td
                key={`cell${cellIndex}`}
                className={`${emptyChecker(cellData) ? "text-center" : ""}`}
              >
                {emptyChecker(cellData) ? <DashComponent /> : cellData}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <NoFound />
  );
});

export const DashComponent = React.memo(() => {
  return <span>&mdash;</span>;
});

export const emptyChecker = (value) => {
  return value === null || value === undefined || value === "";
};

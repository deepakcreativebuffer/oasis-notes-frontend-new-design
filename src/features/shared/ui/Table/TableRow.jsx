import React from "react";
import { Link } from "react-router-dom";
import {
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import { getObjectUrlFromDownloadUrl } from "../../services";
import { InDraft } from "../HelpingComponents";
import { FaFileSignature } from "react-icons/fa";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import SingleDownload from "../Mod/SingleDownload";
import { ROLES } from "../../constants";
import { useModal } from "../../contexts/ModalContext";

const TableRow = React.memo(
  ({
    title,
    downloadKeyName,
    date,
    signature,
    viewIcon = true,
    link,
    editIcon,
    editLink,
    downloadIcon = false,
    downloadLink,
    deleteIcon,
    dLink,
    addtional,
    payloadValue,
    saveAsDraft,
    utc = false,
    documentId,
    panel = "Employee",
    isDownloading,
    currentDownloadId,
    setDownloadingId,
    printViaViewLink,
  }) => {
    const ProfileDetails = useSelector(userProfile);
    const { openDeleteModal } = useModal();

    const handleDeleteClick = React.useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        openDeleteModal({
          url: dLink,
          payloadValue,
          onSuccess: addtional,
        });
      },
      [openDeleteModal, dLink, payloadValue, addtional],
    );

    return (
      <tr>
        <td className="text-start">
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="pe-none no-underline text-black"
          >
            {title}
          </a>
        </td>
        <td className="text-start">
          {date &&
            (utc
              ? formatDateToMMDDYYYY(date)
              : formatDateWithoutUTCHandleToMMDDYYYY(date))}
        </td>
        <td className="text-start"> {signature} </td>
        <td>
          {saveAsDraft ? (
            <InDraft link={editLink} />
          ) : (
            <div className="icon-joiner">
              {viewIcon && (
                <Link
                  className="view-btn"
                  to={link}
                  aria-label={`View details of ${title}`}
                >
                  <i className="fa-solid fa-eye" />
                </Link>
              )}
              {downloadIcon && printViaViewLink ? (
                <a
                  className="view-btn"
                  href={printViaViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open print preview in a new tab"
                  aria-label={`Download or print ${title}`}
                >
                  <i className="fa-solid fa-download" />
                </a>
              ) : downloadIcon && downloadKeyName ? (
                <SingleDownload
                  documents={downloadKeyName}
                  documentId={documentId}
                  panel={panel}
                  isDownloading={isDownloading}
                  currentDownloadId={currentDownloadId}
                  setDownloadingId={setDownloadingId}
                  rowId={documentId}
                />
              ) : (
                <a
                  className="view-btn"
                  href={getObjectUrlFromDownloadUrl(downloadLink)}
                  download
                  aria-label={`Download ${title}`}
                  onClick={(e) => {
                    if (getObjectUrlFromDownloadUrl(downloadLink) === "#") {
                      e.preventDefault();
                    }
                  }}
                >
                  <i className="fa-solid fa-download" />
                </a>
              )}
              {editIcon && (
                <Link
                  className="edit-btn"
                  to={editLink}
                  aria-label={`Edit ${title}`}
                >
                  {ProfileDetails?.userType === ROLES.GUARDIAN ||
                  ProfileDetails?.userType === ROLES.PATIENT ? (
                    <FaFileSignature />
                  ) : (
                    <i className="fa-solid fa-edit" />
                  )}
                </Link>
              )}
              {deleteIcon && (
                <button
                  type="button"
                  className="del-btn"
                  onClick={handleDeleteClick}
                  aria-label={`Delete ${title}`}
                >
                  <i className="fa-solid fa-trash-can" />
                </button>
              )}
            </div>
          )}
        </td>
      </tr>
    );
  },
);

export default TableRow;

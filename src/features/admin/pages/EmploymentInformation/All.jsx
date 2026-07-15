/* eslint-disable no-unused-vars */
/** @format */

import React, { useEffect, useMemo, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import {
  employmentService,
  getObjectUrlFromDownloadUrl,
  removeApi,
  removeApiForPdf,
} from "@/features/shared/services";
import {
  formatDateToMMDDYYYY,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import "@/index.css";
import { FaFileSignature } from "react-icons/fa";
import { FilterByDate } from "@/utils/FilterByDate";
import { SearchAndSelect } from "@/utils/SearchAndSelect";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import PDFModal from "@/features/shared/ui/Mod/PdfProcessModal";
import SingleDownload from "@/features/shared/ui/Mod/SingleDownload";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import {
  DEFAULT_PAGE_SIZE,
  ROLES,
  ACCOUNT_TYPES,
} from "@/features/shared/constants";
import { logger } from "@/utils";
const options = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "findForms2023",
    label: "Forms 2023",
  },
  {
    value: "findAppendix",
    label: "TB Risk Assessment",
  },
  {
    value: "findApsConsent",
    label: "APS Consent",
  },
  {
    value: "findFw4",
    label: "Fw4",
  },
  {
    value: "findFw9",
    label: "Fw9",
  },
  {
    value: "findI9",
    label: "I-9",
  },
  {
    value: "findJobDescription",
    label: "Job Description",
  },
  {
    value: "findLrc1031A",
    label: "LRC 1031A",
  },
  {
    value: "findMileageLog",
    label: "Mileage Log",
  },
  {
    value: "findOfferLetter",
    label: "Offer Letter",
  },
  {
    value: "findPersonalInformation",
    label: "Personal Information",
  },
  {
    value: "findReferenceCheck",
    label: "Reference Check",
  },
  {
    value: "findEmployeePerformanceReview",
    label: "Employee Performance",
  },
  {
    value: "findOnSiteFacility",
    label: "On Site and Facility Orientation Verification",
  },
  {
    value: "findSkillTraining",
    label: "Skills and Knowledge Training",
  },
  {
    value: "findInfectionControlTraining",
    label: "Infection Control",
  },
  {
    value: "findAdministrationMedication",
    label: "Assistance with Self-Administration of Medication",
  },
  {
    value: "findTubercluosisTraining",
    label: "Tuberculosis Training",
  },
  {
    value: "findTimeOffRequest",
    label: "Time Off Request",
  },
  {
    value: "findFallPrevention",
    label: "Fall Prevention and Recovery Training",
  },
  {
    value: "findEmployeeTracking",
    label: "Employee Tracking",
  },
  {
    value: "employeeApplicaton",
    label: "Employee Application",
  },
  {
    value: "findTermination",
    label: "Employee Termination",
  },
];
const pdfEmployee = [
  {
    value: "appendix",
    label: "TB Risk Assessment",
    match: "findAppendix",
  },
  {
    value: "aps-consent",
    label: "APS Consent",
    match: "findApsConsent",
  },
  {
    value: "onsite-training",
    label: "On Site and Facility Orientation Verification",
    match: "findOnSiteFacility",
  },
  {
    value: "skill-training",
    label: "Skills and Knowledge Training",
    match: "findSkillTraining",
  },
  {
    value: "infection-control",
    label: "Infection Control",
    match: "findInfectionControlTraining",
  },
  {
    value: "assistance-medication",
    label: "Assistance with Self-Administration of Medication",
    match: "findAdministrationMedication",
  },
  {
    value: "fall-prevention",
    label: "Fall Prevention and Recovery Training",
    match: "findFallPrevention",
  },
  {
    value: "tuberculosis-training",
    label: "Tubercluosis Training",
    match: "findTubercluosisTraining",
  },
  {
    value: "personal-information",
    label: "Personal Information",
    match: "findPersonalInformation",
  },
  {
    value: "offer-letter",
    label: "Offer Letter",
    match: "findOfferLetter",
  },
  {
    value: "job-description",
    label: "Job Description",
    match: "findJobDescription",
  },
  {
    value: "employee-termination",
    label: "Employee Termination",
    match: "findTermination",
  },
  {
    value: "timeoff-request",
    label: "Time Off Request",
    match: "findTimeOffRequest",
  },
  {
    value: "reference-check",
    label: "Reference Check",
    match: "findReferenceCheck",
  },
  {
    value: "performance-review",
    label: "Employee Performance",
    match: "findEmployeePerformanceReview",
  },
  {
    value: "employee-application",
    label: "Employee Appllication",
    match: "employeeApplicaton",
  },
  {
    value: "mileage-log",
    label: "Mileage Log",
    match: "findMileageLog",
  },
];
const downloadFile = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const fileBlobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileBlobUrl;
    link.setAttribute("download", fileUrl);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    logger.error("Error downloading file:", error);
  }
};
const All = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState({
    filterStartDate: "",
    filterEndDate: "",
  });
  const { employeeId } = useParams();
  const profileUser = useSelector(userProfile);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("All");
  const [documents, setDocuments] = useState([]);
  const currentUserId = useSelector(userProfile)._id;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [downloading, setDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [payload, setPayload] = useState(null);
  let selectedFormType;
  const {
    findForms2023,
    findAppendix,
    findApsConsent,
    findFw4,
    findFw9,
    findMileageLog,
    findI9,
    findJobDescription,
    findLrc1031A,
    findOfferLetter,
    findPersonalInformation,
    findReferenceCheck,
    findTermination,
    findEmployeePerformanceReview,
    findOnSiteFacility,
    findSkillTraining,
    findInfectionControlTraining,
    findAdministrationMedication,
    findTubercluosisTraining,
    findTimeOffRequest,
    findEmployeeTracking,
    findFallPrevention,
    employeeApplicaton,
  } = data?.data || {};
  useEffect(() => {
    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchDocument = () => {
    employmentService.getAllEmployeeInfoAllForms({
      employeeId,
      setResponse: setData,
      setLoading,
    });
  };
  useEffect(() => {
    let docs = [];
    docs.push(
      ...(findTermination?.map((item) => ({
        key: `findTermination#${item?._id}`,
        name: "Employee Termination",
        keyName: "findTermination",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/viewEmployeeTermination/${item?.employeeId}`,
        editLink: `/updateEmployeeTermination/${item?.employeeId}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `admin/termination/${item?.employeeId}`,
        signatureButton:
          item?.employeeSignature?.length === 0 ||
          item?.employeeSignature === null
            ? true
            : false,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "employee-termination",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findMileageLog?.map((item) => ({
        key: `findMileageLog#${item._id}`,
        name: "Mileage Log",
        keyName: "findMileageLog",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("ml")),
        viewLink: `/view-milega-log/${item._id}`,
        editLink: `/update-milega-log/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("ml")),
        deleteLink: `employee/deleteMileageLog/${item._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "mileage-log",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findAdministrationMedication?.map((item) => ({
        key: `findAdministrationMedication#${item._id}`,
        name: "Assistance with Self-Administration of Medication",
        keyName: "findAdministrationMedication",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("asam")),
        viewLink: `/view-assistance-med/${item._id}`,
        editLink: `/edit-assistance-med/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("asam")),
        deleteLink: `employee/deleteAssistanceWithSelfAdministration/${item._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "assistance-medication",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findReferenceCheck?.map((item) => ({
        key: `findReferenceCheck#${item._id}`,
        name: "Reference Check",
        keyName: "findReferenceCheck",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/view-refrence-check/${item._id}`,
        editLink: `/edit-refrence-check/${item._id}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `employee/deleteReferenceCheck/${item._id}`,
        signatureButton:
          item?.employeeSignature?.length === 0 ||
          item?.employeeSignature === null
            ? true
            : false,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "reference-check",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findEmployeePerformanceReview?.map((item) => ({
        key: `findEmployeePerformanceReview#${item._id}`,
        name: "Employee Performance",
        keyName: "findEmployeePerformanceReview",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/employee-performance`,
        editLink: `/updated-employee-performance/${item._id}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `admin/deleteEmployeePerformanceReview/${item._id}`,
        signatureButton:
          item?.employeeSignature?.length === 0 ||
          item?.employeeSignature === null
            ? true
            : false,
        saveAsDraft: item?.employeeSaveAsDraft,
        documentId: item?._id,
        downloadKeyName: "performance-review",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findAppendix?.map((item) => ({
        key: `findAppendix#${item._id}`,
        name: "TB Risk Assessment",
        keyName: "findAppendix",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("app")),
        viewLink: `/view-appendix/${item?._id}`,
        editLink: `/sign-appendix/${item?._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("app")),
        deleteLink: `admin/deleteAppendix/${item?._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "appendix",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findFallPrevention?.map((item) => ({
        key: `findFallPrevention#${item._id}`,
        name: "Fall Prevention and Recovery Training",
        keyName: "findFallPrevention",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("fprt")),
        viewLink: `/fall-prevention/${item._id}`,
        editLink: `/edit-fall-prevention/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("fprt")),
        deleteLink: `employee/deleteFallPreventionAndFallRecoveryTraining/${item._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "fall-prevention",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findInfectionControlTraining?.map((item) => ({
        key: `findInfectionControlTraining#${item._id}`,
        name: "Infection Control",
        keyName: "findInfectionControlTraining",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("ic")),
        viewLink: `/infection-control/${item._id}`,
        editLink: `/edit-infection-control/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("ic")),
        deleteLink: `admin/deleteInfectionControlTraining/${item._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "infection-control",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findTubercluosisTraining?.map((item) => ({
        key: `findTubercluosisTraining#${item._id}`,
        name: "Tubercluosis Training",
        keyName: "findTubercluosisTraining",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("tc")),
        viewLink: `/tubercluosis/${item._id}`,
        editLink: `/edit-tubercluosis/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("tc")),
        deleteLink: `employee/deleteTuberculosisTraining/${item._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "tuberculosis-training",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findPersonalInformation?.map((item) => ({
        key: `findPersonalInformation#${item._id}`,
        name: "Personal Information",
        keyName: "findPersonalInformation",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("PI")),
        viewLink: `/view-employee-information/${item.employeeId}`,
        // editLink: `/sign-personal/${item.employeeId}`,
        editLink: `/personal-information`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("PI")),
        deleteLink:
          profileUser?.userType === ROLES.ADMIN
            ? `employee/deleteTuberculosisTraining/${item._id}`
            : `employee/deletePersonalInformation`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "personal-information",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findOnSiteFacility?.map((item) => ({
        key: `findOnSiteFacility#${item._id}`,
        name: "On Site and Facility Orientation Verification",
        keyName: "findOnSiteFacility",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/view-site/${item._id}`,
        editLink: `/edit-on-site/${item._id}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `employee/deleteOnSiteFacility/${item._id}`,
        saveAsDraft: item?.employeeSaveAsDraft,
        signatureButton: !!item?.signers?.filter?.(
          (signer) =>
            signer.signerId === currentUserId && !signer?.signature?.length,
        )?.length,
        documentId: item?._id,
        downloadKeyName: "onsite-training",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findSkillTraining?.map((item) => ({
        key: `findSkillTraining#${item._id}`,
        name: "Skills and Knowledge Training",
        keyName: "findSkillTraining",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/view-site-training/${item._id}`,
        editLink: `/edit-skill-training/${item._id}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `employee/deleteSkillAndKnowledge/${item._id}`,
        saveAsDraft: item?.employeeSaveAsDraft,
        signatureButton: !!item?.signers?.filter?.(
          (signer) =>
            signer.signerId === currentUserId && !signer?.signature?.length,
        )?.length,
        documentId: item?._id,
        downloadKeyName: "skill-training",
        download: true,
      })) || []),
    );
    docs.push(
      ...(employeeApplicaton?.map((item) => ({
        key: `employeeApplicaton#${item._id}`,
        name: "Employee Application",
        keyName: "employeeApplicaton",
        date: formatDateToMMDDYYYY(item?.today),
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("binf")),
        viewLink: `/view-employement-application`,
        editLink: `/basic-information?edit=true`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("binf")),
        deleteLink: `employee/delete-employee-application`,
        saveAsDraft: item?.employeeSaveAsDraft,
        documentId: item?._id,
        downloadKeyName: "employee-application",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findTimeOffRequest?.map((item) => ({
        key: `findTimeOffRequest#${item._id}`,
        name: "Time Off Request",
        keyName: "findTimeOffRequest",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("tr")),
        viewLink: `/view-time-of-request/${item._id}`,
        editLink: `/edit-time-off-request/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("st")),
        deleteLink: `employee/deleteTimeOffRequest/${item._id}`,
        saveAsDraft: item?.signatureSaveAsDraft,
        documentId: item?._id,
        downloadKeyName: "timeoff-request",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findApsConsent?.map((item) => ({
        key: `findApsConsent#${item._id}`,
        name: "APS Consent",
        keyName: "findApsConsent",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          !!item?.signers?.filter?.(
            (signer) =>
              signer.signerId === currentUserId && !signer?.signature?.length,
          )?.length ||
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("aps")),
        viewLink: `/view-aps/${item._id}`,
        editLink: `/edit-aps/${item._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("aps")),
        deleteLink: `employee/deleteApsConsent/${item._id}`,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "aps-consent",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findJobDescription?.map((item) => ({
        key: `findJobDescription#${item._id}`,
        name: "Job Description",
        keyName: "findJobDescription",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/job-description/${item?.employeeId}`,
        editLink: `/sign-job-description/${item._id}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `admin/deleteJobDescription/${item._id}`,
        signatureButton:
          item?.employeeSignature?.length === 0 ||
          item?.employeeSignature === null
            ? true
            : false,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "job-description",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findOfferLetter?.map((item) => ({
        key: `findOfferLetter#${item._id}`,
        name: "Offer Letter",
        keyName: "findOfferLetter",
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit: false,
        viewLink: `/offer-letter-form/${item?.employeeId}`,
        editLink: `/sign-offer-letter-form/${item._id}`,
        delete: profileUser?.userType === ROLES.ADMIN,
        deleteLink: `admin/deleteOfferLetter/${item._id}`,
        signatureButton:
          item?.employeeSignature?.length === 0 ||
          item?.employeeSignature === null
            ? true
            : false,
        saveAsDraft: item?.saveAsDraft,
        documentId: item?._id,
        downloadKeyName: "offer-letter",
        download: true,
      })) || []),
    );
    docs.push(
      ...(findEmployeeTracking?.map((item) => ({
        key: `findEmployeeTracking#${item._id}`,
        keyName: "findEmployeeTracking",
        name: item?.type,
        date: item?.createdAt,
        createdAt: item?.createdAt,
        canEdit:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("st")),
        editLink: `/upload-employee-tracking/${item?._id}`,
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser?.userType === ROLES.EMPLOYEE &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("st")),
        deleteLink: `employee/delete-employee-tracking/${item._id}`,
        download: getObjectUrlFromDownloadUrl(item?.document),
        saveAsDraft: item?.employeeSaveAsDraft,
      })) || []),
    );
    docs.push(
      ...(findForms2023?.map((item) => ({
        key: `findForms2023#${item._id}`,
        name: "Forms 2023",
        keyName: "findForms2023",
        date: item?.updatedAt,
        createdAt: item?.createdAt,
        canEdit:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("f23")),
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("f23")),
        deleteLink: `employee/deleteForms2023ById/${item?._id}`,
        editLink: `/forms-2023/${item?._id}`,
        download: getObjectUrlFromDownloadUrl(item.document),
        saveAsDraft: item?.saveAsDraft,
      })) || []),
    );
    docs.push(
      ...(findLrc1031A?.map((item) => ({
        key: `findLrc1031A#${item._id}`,
        name: "LRC-1031A",
        keyName: "findLrc1031A",
        date: item?.updatedAt,
        createdAt: item?.createdAt,
        canEdit:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("lrc1031a")),
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            profileUser.userPermissions?.delete
              ?.split(":")
              .includes("lrc1031a")),
        deleteLink: `employee/deleteFW9ById/${item?._id}`,
        editLink: `/lrc-1031a/${item?._id}`,
        download: getObjectUrlFromDownloadUrl(item.document),
        saveAsDraft: item?.saveAsDraft,
      })) || []),
    );
    docs.push(
      ...(findFw4?.map((item) => ({
        key: `findFw4#${item._id}`,
        name: "Fw4",
        keyName: "findFw4",
        date: item.updatedAt,
        createdAt: item.createdAt,
        canEdit:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("fw4")),
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("fw4")),
        deleteLink: `employee/deleteFW4ById/${item?._id}`,
        editLink: `/fw4/${item?._id}`,
        download: getObjectUrlFromDownloadUrl(item.document),
        saveAsDraft: item?.saveAsDraft,
      })) || []),
    );
    docs.push(
      ...(findFw9?.map((item) => ({
        key: `findFw9#${item._id}`,
        name: "Fw9",
        keyName: "findFw9",
        date: item?.updatedAt,
        createdAt: item?.createdAt,
        canEdit:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("fw9")),
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("fw9")),
        deleteLink: `employee/deleteFW9ById/${item?._id}`,
        editLink: `/fw9/${item?._id}`,
        download: getObjectUrlFromDownloadUrl(item.document),
        saveAsDraft: item?.saveAsDraft,
      })) || []),
    );
    docs.push(
      ...(findI9?.map((item) => ({
        key: `findI9#${item._id}`,
        name: "I-9",
        keyName: "findI9",
        date: item?.updatedAt,
        createdAt: item?.createdAt,
        canEdit:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.edit === "string"
              ? profileUser.userPermissions.edit.split(":")
              : []
            ).includes("i9")),
        delete:
          profileUser?.userType === ROLES.ADMIN ||
          profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
          (profileUser?.userType === ROLES.EMPLOYEE &&
            profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
            (typeof profileUser.userPermissions?.delete === "string"
              ? profileUser.userPermissions.delete.split(":")
              : []
            ).includes("i9")),
        deleteLink: `employee/deleteI9ById/${item?._id}`,
        editLink: `/i-9/${item?._id}`,
        download: getObjectUrlFromDownloadUrl(item?.document),
        saveAsDraft: item?.saveAsDraft,
      })) || []),
    );
    setDocuments(docs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, currentUserId, filterDate]);
  const deleteHandler = async (deleteUrl, payloadValue) => {
    setShowDeleteModal(true);
    setDeleteUrl(deleteUrl);
    setPayload(payloadValue);

    // const additionalFunctions = [fetchDocument];

    // if (payloadValue) {
    //   removeApiForPdf({
    //     url: deleteUrl,
    //     successMsg: "Removed",
    //     payload: { type: payloadValue },
    //     additionalFunctions,
    //   });
    // } else {
    //   removeApi({
    //     url: deleteUrl,
    //     successMsg: "Removed",
    //     additionalFunctions,
    //   });
    // }
  };
  const filteredData = useMemo(() => {
    if (!documents || documents.length === 0) return [];
    let docs = [...documents].sort((a, b) => {
      const dateA = new Date(a?.createdAt);
      const dateB = new Date(b?.createdAt);
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
    });
    if (search !== "All") {
      docs = docs.filter((doc) =>
        doc.keyName?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    docs = docs.filter((doc) => {
      const createdAt = new Date(doc?.createdAt);
      const startDate = filterDate.filterStartDate
        ? new Date(filterDate.filterStartDate)
        : null;
      const endDate = filterDate.filterEndDate
        ? new Date(filterDate.filterEndDate)
        : null;
      if (startDate && endDate) {
        return createdAt >= startDate && createdAt <= endDate;
      }
      return true;
    });
    return docs;
  }, [documents, search, filterDate]);
  const totalPages = Math.ceil(filteredData.length / limit);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);
  useEffect(() => {
    setPage(1);
  }, [search, filterDate, limit]);
  selectedFormType = pdfEmployee.filter((doc) => doc.match === search);
  const downloadAllHandler = async () => {
    setDownloading(true);
    return;
  };
  return (
    <>
      <NavWrapper title={"All Employee Forms"} isArrow={true} />
      <DeleteDocModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        fetchHandler={fetchDocument}
        deleteUrl={deleteUrl}
      ></DeleteDocModal>
      <Container className="full-width-container">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-sm-flex gap-2 justify-content-end mb-2">
              <FilterByDate
                setFromStartDate={(value) =>
                  setFilterDate((pre) => ({
                    ...pre,
                    filterStartDate: value,
                  }))
                }
                setFromEndDate={(value) =>
                  setFilterDate((pre) => ({
                    ...pre,
                    filterEndDate: value,
                  }))
                }
                fromStartDate={filterDate.filterStartDate}
                fromEndDate={filterDate.filterEndDate}
                onHide={() => setFilterOpen(false)}
              />
              <Button
                className={`theme-button self-end p-1 max-md:!mt-3`}
                onClick={() => downloadAllHandler()}
              >
                <>
                  <i className="fa-solid fa-cloud-arrow-down"></i>
                  <span className="inline-block ml-1">Download Pdf</span>
                </>
              </Button>
              <SearchAndSelect
                text="Search Documents"
                options={options}
                selectedValue={search}
                setSelectedValue={setSearch}
              />
            </div>
            <Table responsive bordered>
              <thead>
                <tr>
                  <th>Document </th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData?.map((i, index) => (
                    <tr key={`#${index}-${i.key}`}>
                      <td> {i.name} </td>
                      <td>
                        {i?.date &&
                          formatDateWithoutUTCHandleToMMDDYYYY(i?.date)}
                      </td>
                      <td>
                        {i?.saveAsDraft ? (
                          <Link to={i.editLink}>
                            <div className="in-draft-icon cursor-pointer">
                              <i className="fa-regular fa-file"></i>
                            </div>
                          </Link>
                        ) : (
                          <div className="icon-joiner">
                            {i?.viewLink && (
                              <Link className="view-btn" to={i.viewLink}>
                                <i className="fa-solid fa-eye" />
                              </Link>
                            )}

                            {i?.download && i?.downloadKeyName ? (
                              <SingleDownload
                                documents={i?.downloadKeyName}
                                documentId={i?.documentId}
                                isEmployeeSelfForm={true}
                                selfEmployeId={profileUser?._id}
                                panel="Employee"
                                isDownloading={downloadingId !== null}
                                currentDownloadId={downloadingId}
                                setDownloadingId={setDownloadingId}
                                rowId={i?.documentId}
                              />
                            ) : (
                              <Link className="view-btn" to={i.download}>
                                <i className="fa-solid fa-download"></i>
                              </Link>
                            )}
                            {i.canEdit && (
                              <Link className="edit-btn" to={i.editLink}>
                                <i className="fa-solid fa-edit" />
                              </Link>
                            )}
                            {i.signatureButton ? (
                              <Link className="edit-btn" to={i.editLink}>
                                <FaFileSignature />
                              </Link>
                            ) : (
                              ""
                            )}

                            {i.delete && (
                              <Link className="del-btn">
                                <i
                                  className="fa-solid fa-trash-can"
                                  onClick={() =>
                                    deleteHandler(
                                      i.deleteLink,
                                      i.payloadValue ? i.payloadValue : false,
                                    )
                                  }
                                ></i>
                              </Link>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="text-center" colSpan={3}>
                      {" "}
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}
        {filteredData.length > 0 && (
          <PaginationsPage
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
          />
        )}
        {downloading && (
          <PDFModal
            open={downloading}
            handleClose={() => setDownloading(false)}
            documents={pdfEmployee || []}
            panel="Employee"
            isEmployeeSelfForm={true}
            selfEmployeId={currentUserId}
          />
        )}
      </Container>
    </>
  );
};
export default HOC({
  Wcomponenet: All,
});

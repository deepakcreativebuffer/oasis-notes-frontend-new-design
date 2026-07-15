/* eslint-disable no-unused-vars */
/** @format */
import React, { useEffect, useMemo, useState } from "react";
import { Container, Table, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { adminPortalService, patientService } from "@/features/shared/services";
import TableRow from "@/features/shared/ui/Table/TableRow";
import {
  fetchPaitentName,
  formatDateToMMDDYYYY,
  getEmployeeListSignature,
} from "@/utils/utils";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import Loader from "@/features/shared/ui/Loader/Loader";
import { FilterByDate } from "@/utils/FilterByDate";
import { SearchAndSelect } from "@/utils/SearchAndSelect";
import { usePrint } from "@shared/hooks";
import PaginationsPage from "@/features/shared/ui/Pagination/PaginationsPage";
import PDFModal from "@/features/shared/ui/Mod/PdfProcessModal";
import DeleteDocModal from "@/features/shared/ui/DeleteDocModal/DeleteDocModal";
import { DEFAULT_PAGE_SIZE } from "@/features/shared/constants";
import { downloadReport } from "@/utils";
const EmployeeData = () => {
  const [filterDate, setFilterDate] = useState({
    filterStartDate: "",
    filterEndDate: "",
  });
  const pdfEmployee = [
    {
      value: "appendix",
      label: "TB Risk Assessment",
      match: "tbRiskAssessment",
    },
    {
      value: "aps-consent",
      label: "APS Consent",
      match: "apsConsentByEmployeeId",
    },
    {
      value: "onsite-training",
      label: "On Site and Facility Orientation Verification",
      match: "OnSiteFacility",
    },
    {
      value: "skill-training",
      label: "Skills and Knowledge Training",
      match: "skillTraining",
    },
    {
      value: "infection-control",
      label: "Infection Control",
      match: "infectionControlTraining",
    },
    {
      value: "assistance-medication",
      label: "Assistance with Self-Administration of Medication",
      match: "assistanceWithSelfAdministration",
    },
    {
      value: "fall-prevention",
      label: "Fall Prevention and Recovery Training",
      match: "fallPreventionAndFallRecoveryTrainingByEmployeeId",
    },
    {
      value: "tuberculosis-training",
      label: "Tubercluosis Training",
      match: "TubercluosisTraining",
    },
    {
      value: "personal-information",
      label: "Personal Information",
      match: "personalInformation",
    },
    {
      value: "offer-letter",
      label: "Offer Letter",
      match: "offerLetter",
    },
    {
      value: "job-description",
      label: "Job Description",
      match: "jobDescription",
    },
    {
      value: "employee-termination",
      label: "Employee Termination",
      match: "employeeTermination",
    },
    {
      value: "timeoff-request",
      label: "Time Off Request",
      match: "TimeOffRequest",
    },
    {
      value: "reference-check",
      label: "Reference Check",
      match: "referenceCheck",
    },
    {
      value: "performance-review",
      label: "Employee Performance",
      match: "employeeReview",
    },
    {
      value: "employee-application",
      label: "Employee Appllication",
      match: "employeeApplication",
    },
    {
      value: "mileage-log",
      label: "Mileage Log",
      match: "MileageLog",
    },
  ];
  const [filterOpen, setFilterOpen] = useState(false);
  const [type, setType] = useState("Info");
  const { id } = useParams();
  const [info, setInfo] = useState({});
  const [documents, setDocuments] = useState({});
  const [documentTypes, setDocumentTypes] = useState("all");
  const [loading, setLoading] = useState(false);
  const [finalDatas, setFinalDatas] = useState({});
  const componentRef = React.useRef();
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [downloading, setDownloading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [payload, setPayload] = useState(null);
  const [additionalFunctions, setAdditionalFunctions] = useState(null);
  let selectedFormType;
  const documentTypesObject = {
    all: {
      label: "All Employee Forms",
      value: "all",
    },
    findTermination: {
      label: "Employee Termination",
      value: "employeeTermination",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: `employeeSignature`,
      signatureDate: "dateSigned",
      viewLink: `/dashboard/viewEmployeeTermination/`,
      editLink: `/dashboard/updateEmployeeTermination/`,
      noEdit: false,
      viewIcon: true,
      byId: false,
      showDelete: true,
      deleteLink: "admin/termination/",
      utc: false,
      signatureFromSigners: true,
      signatureRandomFromSigners: false,
    },
    findEmployeeTracking: {
      label: "Employee Tracking",
      value: "employeeTracking",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      download: "download",
      signature: "employeeSignature",
      viewLink: `/dashboard/employee-tracking/`,
      noEdit: false,
      editLink: `/upload-employee-tracking/`,
      viewIcon: false,
      byId: true,
      showDelete: true,
      deleteLink: "admin/delete-employee-tracking/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findPersonalInformation: {
      label: "Personal Information",
      value: "personalInformation",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "savedSigned",
      signatureDate: "signatureDate",
      signatureTime: "signatureTime",
      viewIcon: true,
      viewLink: `/dashboard/view-employee-information/`,
      editLink: `/dashboard/personal-information/`,
      byId: false,
      showDelete: true,
      deleteLink: "admin/deletePersonalInformation/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findOfferLetter: {
      label: "Offer Letter",
      value: "offerLetter",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeSignDate",
      signatureTime: "signatureTime",
      viewIcon: true,
      viewLink: `/dashboard/sign-offer-letter-form/`,
      editLink: `/offer-letter/`,
      noEdit: false,
      byId: false,
      showDelete: true,
      deleteLink: "admin/deleteOfferLetter/",
      utc: false,
      signatureFromSigners: true,
      signatureRandomFromSigners: false,
    },
    findAppendix: {
      label: "TB Risk Assessment",
      value: "tbRiskAssessment",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminSignatureDate",
      signature: "employeeSignature",
      signatureDate: "employeeSignatureDate",
      signatureTime: "employeeSignatureTime",
      viewIcon: true,
      viewLink: `/dashboard/view-appendix/`,
      editLink: `/dashboard/edit-appendix/`,
      byId: true,
      showDelete: true,
      deleteLink: "admin/deleteAppendix/",
      utc: false,
      signatureRandomFromSigners: true,
    },
    findForms2023: {
      label: "Forms 2023",
      value: "forms2023",
      date: "updatedAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "signature",
      viewIcon: false,
      download: true,
      viewLink: `/dashboard/forms-2023/`,
      editLink: `/dashboard/forms-2023/`,
      byId: true,
      noEdit: false,
      deleteById: true,
      showDelete: true,
      deleteLink: "employee/deleteForms2023ById/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findLrc1031A: {
      label: "LRC 1031A",
      value: "lrc1031A",
      date: "updatedAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "certificationSignature",
      viewIcon: false,
      download: true,
      noEdit: false,
      viewLink: `/dashboard/lrc-1031a/`,
      editLink: `/dashboard/lrc-1031a/`,
      byId: true,
      deleteById: true,
      showDelete: true,
      deleteLink: "employee/deleteLrc1031AById/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findJobDescription: {
      label: "Job Description",
      value: "jobDescription",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      viewIcon: true,
      viewLink: `/dashboard/job-description/`,
      editLink: `/dashboard/sign-job-description/`,
      noEdit: false,
      byId: true,
      showDelete: true,
      deleteLink: "admin/deleteJobDescription/",
      signature: "employeeSignature",
      signatureDate: "employeeSignDate",
      signatureFromSigners: true,
      utc: false,
      signatureRandomFromSigners: false,
    },
    findFw4: {
      label: "Fw4",
      value: "fw4",
      date: "updatedAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "step5EmployeeSignature",
      viewIcon: false,
      download: true,
      noEdit: false,
      viewLink: `/dashboard/fw4/`,
      editLink: `/dashboard/fw4/`,
      byId: true,
      showDelete: true,
      deleteById: true,
      deleteLink: "employee/deleteFW4ById/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findApsConsent: {
      label: "Aps Consent",
      value: "apsConsentByEmployeeId",
      date: "updatedAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeDate",
      signatureTime: "employeeTime",
      viewIcon: true,
      viewLink: `/dashboard/view-aps/`,
      editLink: `/dashboard/edit-aps/`,
      byId: true,
      showDelete: true,
      deleteLink: "employee/deleteApsConsent/",
      utc: false,
      signatureRandomFromSigners: true,
    },
    findFw9: {
      label: "Fw9",
      value: "fw9",
      date: "updatedAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "signature",
      viewIcon: false,
      download: true,
      noEdit: false,
      viewLink: `/dashboard/fw9/`,
      editLink: `/dashboard/fw9/`,
      byId: true,
      deleteById: true,
      showDelete: true,
      deleteLink: "employee/deleteFW9ById/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findI9: {
      label: "I-9",
      value: "i9",
      date: "updatedAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "signature",
      viewIcon: false,
      download: true,
      noEdit: false,
      viewLink: `/dashboard/i-9/`,
      editLink: `/dashboard/i-9/`,
      byId: true,
      deleteById: true,
      showDelete: true,
      deleteLink: "employee/deleteI9ById/",
      utc: false,
      signatureRandomFromSigners: false,
    },
    findOnSiteFacility: {
      label: "On Site and Facility Orientation Verification",
      value: "OnSiteFacility",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeDate",
      signatureTime: "employeeTime",
      viewIcon: true,
      viewLink: `/dashboard/view-site/`,
      editLink: `/dashboard/edit-site/`,
      byId: true,
      showDelete: true,
      deleteLink: "employee/deleteOnSiteFacility/",
      signatureFromSigners: true,
      utc: false,
      signatureRandomFromSigners: true,
    },
    findInfectionControlTraining: {
      label: "Infection Control",
      value: "infectionControlTraining",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeSignatureDate",
      signatureTime: "employeeSignatureTime",
      viewIcon: true,
      viewLink: `/dashboard/infection-control/`,
      editLink: `/dashboard/edit-infection-control/`,
      byId: true,
      showDelete: true,
      deleteLink: "admin/deleteInfectionControlTraining/",
      utc: false,
      signatureRandomFromSigners: true,
    },
    findAdministrationMedication: {
      label: "Assistance with Self-Administration of Medication",
      value: "assistanceWithSelfAdministration",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeSignatureDate",
      signatureTime: "employeeSignatureTime",
      viewIcon: true,
      viewLink: `/dashboard/view-assistance-med/`,
      editLink: `/dashboard/edit-assistance-med/`,
      byId: true,
      showDelete: true,
      deleteLink: "employee/deleteAssistanceWithSelfAdministration/",
      utc: false,
      signatureRandomFromSigners: true,
    },
    findFallPrevention: {
      label: "Fall Prevention and Recovery Training",
      value: "fallPreventionAndFallRecoveryTrainingByEmployeeId",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeSignatureDate",
      signatureTime: "employeeSignatureTime",
      viewIcon: true,
      viewLink: `/dashboard/fall-prevention/`,
      editLink: `/dashboard/edit-fall-prevention/`,
      byId: true,
      showDelete: true,
      deleteLink: "admin/deleteFallPreventionAndFallRecoveryTraining/",
      utc: false,
      signatureRandomFromSigners: true,
    },
    findTimeOffRequest: {
      label: "Time Off Request",
      value: "TimeOffRequest",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "signature",
      signatureDate: "signatureDate",
      signatureTime: "signatureTime",
      viewIcon: true,
      viewLink: `/dashboard/view-time-of-request/`,
      editLink: `/dashboard/edit-time-off-request/`,
      byId: true,
      showDelete: true,
      deleteLink: "employee/deleteTimeOffRequest/",
      utc: false,
      signatureRandomFromSigners: true,
    },
    findEmployeePerformanceReview: {
      label: "Employee Performance",
      value: "employeeReview",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeSignDate",
      signatureTime: "administratorTime",
      viewIcon: true,
      viewLink: `/dashboard/employee-performance/`,
      editLink: `/dashboard/update-employee-performance/`,
      byId: true,
      noEdit: false,
      showDelete: true,
      deleteLink: "admin/deleteEmployeePerformanceReview/",
      utc: false,
      signatureFromSigners: true,
      signatureRandomFromSigners: false,
    },
    findSkillTraining: {
      label: "Skills and Knowledge Training",
      value: "skillTraining",
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeDate",
      signatureTime: "employeeTime",
      viewIcon: true,
      viewLink: `/dashboard/view-site-training/`,
      editLink: `/dashboard/edit-skill-training/`,
      byId: true,
      showDelete: true,
      deleteLink: "employee/deleteSkillAndKnowledge/",
      signatureFromSigners: true,
      utc: false,
      signatureRandomFromSigners: true,
    },
    findReferenceCheck: {
      label: "Reference Check",
      value: "referenceCheck",
      viewLink: `/dashboard/view-refrence-check/`,
      viewIcon: true,
      editLink: `/dashboard/edit-refrence-check/`,
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "savedSigned",
      signatureDate: "signDate",
      signatureTime: "signTime",
      byId: true,
      showDelete: true,
      deleteLink: `employee/deleteReferenceCheck/`,
      utc: false,
      signatureFromSigners: true,
      signatureRandomFromSigners: false,
    },
    employeeApplicaton: {
      label: "Employee Application",
      value: "employeeApplication",
      viewLink: `/view-employement-application/`,
      viewIcon: true,
      editLink: `/basic-information/`,
      date: "today",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "signature",
      signatureDate: "signdate",
      signatureTime: "signtime",
      byId: false,
      noEdit: false,
      showDelete: true,
      deleteLink: `admin/delete-employee-application/`,
      utc: false,
      signatureRandomFromSigners: false,
    },
    findMileageLog: {
      label: "Mileage Log",
      value: "MileageLog",
      viewIcon: true,
      viewLink: `/view-milega-log/`,
      editLink: `/update-milega-log/`,
      byId: true,
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "driverSignature",
      signatureDate: "signedDate",
      signatureTime: "signedTime",
      showDelete: true,
      deleteLink: "employee/deleteMileageLog/",
    },
    findTubercluosisTraining: {
      label: "Tubercluosis Training",
      value: "TubercluosisTraining",
      viewIcon: true,
      viewLink: `/tubercluosis/`,
      editLink: `/edit-tubercluosis/`,
      byId: true,
      date: "createdAt",
      adminSignature: "adminSignature",
      adminDateSigned: "adminDateSigned",
      signature: "employeeSignature",
      signatureDate: "employeeSignatureDate",
      signatureTime: "employeeSignatureTime",
      showDelete: true,
      deleteLink: "employee/deleteTuberculosisTraining/",
    },
  };
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(info?.data, profileInfo),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }    
    .card {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(type === "Info" && componentRef, handlePrint2);
  useEffect(() => {
    if (id) {
      patientService.getById(id, {
        setResponse: setInfo,
      });
    }
  }, [id]);
  const fetchDocument = () => {
    adminPortalService.getEmployeeAllForms(id, {
      setResponse: setDocuments,
      setLoading,
    });
  };
  const typeSelector = ({ type, func }) => {
    setType(type);
    if (func) {
      func();
    }
  };
  const showIfPresent = ({ label, value }) => {
    if (value) {
      return (
        <div className="view-details-grid my-1 my-md-2 p-3">
          <p className="view-label mb-1">{label} : </p>
          <h5 className="view-value mb-0">{value} </h5>
        </div>
      );
    }
  };
  let Document;
  useEffect(() => {
    if (documents?.data) {
      let { findEmployeeTracking, findReferenceCheck, ...filteredData } =
        documents?.data || {};
      const filterEmployeeTracking = findEmployeeTracking?.map((elm) => {
        return {
          createdAt: elm?.createdAt,
          document: elm?.document,
          dueDate: elm?.dueDate,
          date: elm?.createdAt,
          size: elm?.size,
          pdfName: elm?.type,
          updatedAt: elm?.updatedAt,
          userId: elm?.userId,
          _id: elm?._id,
        };
      });
      const refData = findReferenceCheck
        ?.map((ref) => {
          const dataItem = ref?.data?.[0] || {};
          return {
            ...ref,
            ...dataItem,
            data: undefined,
            _id: ref?._id,
          };
        })
        .map(({ data, ...rest }) => rest);
      const finalData = {
        ...filteredData,
        findReferenceCheck: refData,
        findEmployeeTracking: filterEmployeeTracking,
      };
      setFinalDatas(finalData);
    }
  }, [documents?.data]);
  const paginatedFinalDatas = useMemo(() => {
    if (!finalDatas) return {};
    const paginated = {};
    Object.entries(finalDatas).forEach(([key, data]) => {
      const filtered = [...data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter((form) => {
          const createdAt = new Date(
            form[documentTypesObject[key]?.date] || form?.date,
          );
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
      paginated[key] = filtered;
    });
    return paginated;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalDatas, filterDate]);
  selectedFormType = pdfEmployee.filter((doc) => doc.match === documentTypes);
  const currentDocuments = useMemo(() => {
    if (documentTypes === "all") {
      const allDocs = Object.entries(paginatedFinalDatas || {}).flatMap(
        ([key, data]) =>
          data.map((doc) => ({
            ...doc,
            _key: key,
          })),
      );
      const sorted = allDocs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return sorted;
    } else {
      const matchedEntry = Object.entries(documentTypesObject)?.find(
        ([key, data]) => data?.value === documentTypes,
      );
      const key = matchedEntry?.[0];
      const filtered = paginatedFinalDatas?.[key] || [];
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit).map((doc) => ({
        ...doc,
        _key: key,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedFinalDatas, documentTypes, page, limit]);
  const totalPages = Math.ceil(currentDocuments.length / limit);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return currentDocuments.slice(start, start + limit);
  }, [currentDocuments, page, limit]);
  useEffect(() => {
    setPage(1);
  }, [documentTypes, filterDate, limit]);
  const downloadAllHandler = async (data) => {
    setDownloading(true);
    return;
  };
  if (documentTypes === "all") {
    const Component = () => {
      return paginatedData?.map((form, i) => {
        const key = form._key;
        return (
          <TableRow
            title={`${form?.pdfName ? form?.pdfName : documentTypesObject[key]?.label}`}
            key={`${documentTypesObject[key]?.value}-${i}`}
            date={
              form[documentTypesObject[key]?.date]
                ? form[documentTypesObject[key]?.date]
                : form?.date
            }
            signature={getEmployeeListSignature(
              form,
              hoursFormat,
              documentTypesObject,
              key,
              "adminSignature",
              "adminDateSigned",
              "signature",
              "signatureDate",
            )}
            link={`${documentTypesObject[key]?.viewLink}${documentTypesObject[key]?.byId ? form?._id : id}`}
            viewIcon={documentTypesObject[key]?.viewIcon}
            editLink={`${documentTypesObject[key]?.editLink}${documentTypesObject[key]?.byId ? form?._id : id}`}
            editIcon={!documentTypesObject[key]?.noEdit && true}
            downloadLink={
              form[documentTypesObject[key]?.download] || form?.document
            }
            deleteIcon={
              `${documentTypesObject[key]?.showDelete}` === "true"
                ? true
                : false
            }
            dLink={`${documentTypesObject[key]?.deleteLink}${documentTypesObject[key]?.byId ? form?._id : documentTypesObject[key]?.deleteById ? form?._id : id}`}
            addtional={fetchDocument}
            payloadValue={form?.payloadValue ? form?.payloadValue : false}
            saveAsDraft={
              form?.saveAsDraft ||
              form?.savedAsDraft ||
              form?.employeeSaveAsDraft ||
              form?.administratorSaveAsDraft ||
              form?.trainerSaveAsDraft ||
              form?.verifiedBySignatureSaveAsDraft ||
              form?.signatureSaveAsDraft ||
              form?.employeeSignatureSaveAsDraft
            }
            utc={documentTypesObject[key]?.utc}
            downloadKeyName={
              pdfEmployee.filter(
                (doc) => doc.match === documentTypesObject[key]?.value,
              )[0]?.value
            }
            documentId={form?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
            panel="Admin"
            setShowDeleteModal={setShowDeleteModal}
            setDeleteUrl={setDeleteUrl}
            setPayload={setPayload}
            setAdditionalFunctions={setAdditionalFunctions}
          />
        );
      });
    };
    Document = <Component />;
  } else {
    const Component = () => {
      return paginatedData?.map((form, i) => {
        const key = form._key;
        return (
          <TableRow
            title={`${form?.pdfName ? form?.pdfName : documentTypesObject[key]?.label}`}
            key={`${documentTypesObject[key]?.value}-${i}`}
            date={
              form[documentTypesObject[key]?.date]
                ? form[documentTypesObject[key]?.date]
                : form?.date
            }
            signature={getEmployeeListSignature(
              form,
              hoursFormat,
              documentTypesObject,
              key,
              "adminSignature",
              "adminDateSigned",
              "signature",
              "signatureDate",
            )}
            viewIcon={documentTypesObject[key]?.viewIcon}
            link={`${documentTypesObject[key]?.viewLink}${documentTypesObject[key]?.byId ? form?._id : id}`}
            editLink={`${documentTypesObject[key]?.editLink}${documentTypesObject[key]?.byId ? form?._id : id}`}
            editIcon={!documentTypesObject[key]?.noEdit && true}
            downloadLink={
              form[documentTypesObject[key]?.download] || form?.document
            }
            deleteIcon={
              `${documentTypesObject[key]?.showDelete}` === "true"
                ? true
                : false
            }
            dLink={`${documentTypesObject[key]?.deleteLink}${documentTypesObject[key]?.byId ? form?._id : documentTypesObject[key]?.deleteById ? form?._id : id}`}
            addtional={fetchDocument}
            payloadValue={form?.payloadValue ? form?.payloadValue : false}
            saveAsDraft={
              form?.saveAsDraft ||
              form?.savedAsDraft ||
              form?.employeeSaveAsDraft ||
              form?.administratorSaveAsDraft ||
              form?.trainerSaveAsDraft ||
              form?.verifiedBySignatureSaveAsDraft ||
              form?.signatureSaveAsDraft ||
              form?.employeeSignatureSaveAsDraft
            }
            utc={documentTypesObject[key]?.utc}
            downloadKeyName={
              pdfEmployee.filter(
                (doc) => doc.match === documentTypesObject[key]?.value,
              )[0]?.value
            }
            documentId={form?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
            panel="Admin"
            setShowDeleteModal={setShowDeleteModal}
            setDeleteUrl={setDeleteUrl}
            setPayload={setPayload}
            setAdditionalFunctions={setAdditionalFunctions}
          />
        );
      });
    };
    Document = <Component />;
  }
  const tabs = [
    {
      title: "Info",
      type: "Info",
    },
    {
      title: "Documents",
      type: "Documents",
      func: fetchDocument,
    },
  ];
  return (
    <>
      <div className="search-page outline-none" ref={componentRef} tabIndex={0}>
        <Container>
          <div className="page-title-bar mb-3 hidePrint">
            <Row className="align-items-center">
              <Col xs={2} lg="3">
                <div className="d-flex align-items-center">
                  <img
                    onClick={() => navigate(-1)}
                    src="/back_button2.png"
                    alt=""
                    className="arrow cursor-pointer me-1 me-md-3"
                  />
                  <p className="m-0 fw-bold d-none d-md-inline-block">Back</p>
                </div>
              </Col>
              <Col xs={8} lg="6">
                <p className="heading mb-sm-0">
                  <span className="me-2">Employee : </span>{" "}
                  {fetchPaitentName(info?.data)}
                </p>
              </Col>
              <Col xs={2} lg="3"></Col>
            </Row>
          </div>
          <h1 className="pdfTitle hidden text-[26px] font-semibold">
            {type === "Info" && "Employee Information"}
          </h1>
          <div className="tabs-list hidePrint">
            <ul className="justify-around">
              {tabs?.map((i, index) => (
                <li
                  key={`tab${index}`}
                  onClick={() =>
                    typeSelector({
                      type: i.type,
                      func: i.func,
                    })
                  }
                >
                  {i.title}
                </li>
              ))}
            </ul>
          </div>
          {type === "Info" && (
            <div className="view-details mb-2">
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <Form.Label className="fw-bold hidePrint">
                    Employee Information :{" "}
                  </Form.Label>
                </Col>
              </Row>
              <Row>
                <Col
                  xs={12}
                  sm={12}
                  lg={4}
                  className="resident-name-info hidden"
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1"> Employee Name : </p>
                    <h5 className="view-value mb-0">
                      {" "}
                      {fetchPaitentName(info?.data)}{" "}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  {showIfPresent({
                    label: "Legal Name",
                    value: fetchPaitentName(info?.data),
                  })}
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  {showIfPresent({
                    label: "Email",
                    value: info?.data?.email,
                  })}
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  {showIfPresent({
                    label: "Company Name",
                    value: info?.data?.companyName,
                  })}
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  {showIfPresent({
                    label: "Mobile Phone",
                    value: info?.data?.mobileNumber,
                  })}
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  {showIfPresent({
                    label: "Date of Birth",
                    value:
                      info?.data?.dateOfBirth &&
                      formatDateToMMDDYYYY(info?.data?.dateOfBirth),
                  })}
                </Col>
                <Col xs={12} sm={12} lg={4}>
                  {showIfPresent({
                    label: "Address",
                    value: info?.data?.address,
                  })}
                </Col>
              </Row>
            </div>
          )}

          {type === "Documents" &&
            (loading ? (
              <Loader />
            ) : (
              <div className="print">
                <div className="mb-2 d-sm-flex gap-2 justify-content-end">
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
                  <SearchAndSelect
                    text="Search Documents"
                    options={Object.values(documentTypesObject)}
                    selectedValue={documentTypes}
                    setSelectedValue={setDocumentTypes}
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
                </div>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th className="text-start">Document</th>
                      <th className="text-start">Date</th>
                      <th className="text-start">Signature</th>
                      <th className="text-start">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{Document}</tbody>
                </Table>
                {currentDocuments.length > 0 && (
                  <PaginationsPage
                    page={page}
                    setPage={setPage}
                    totalPages={totalPages}
                    limit={limit}
                    setLimit={setLimit}
                  />
                )}
              </div>
            ))}

          {!loading && type === "Info" && (
            <button
              className="print_btn hidePrint mt-3 mt-md-5"
              type="button"
              onClick={print}
            >
              PRINT REPORT
            </button>
          )}
        </Container>
        {downloading && (
          <PDFModal
            open={downloading}
            handleClose={() => setDownloading(false)}
            // documents={selectedFormType?.length>0 ? selectedFormType :pdfEmployee || []}
            documents={pdfEmployee || []}
            panel="Admin"
          />
        )}
        <DeleteDocModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          fetchHandler={additionalFunctions}
          deleteUrl={deleteUrl}
          payloadValue={payload}
        ></DeleteDocModal>
      </div>
    </>
  );
};
export default HOC({
  Wcomponenet: EmployeeData,
});

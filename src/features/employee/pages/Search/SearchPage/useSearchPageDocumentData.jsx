/** @format */
import { useMemo } from "react";
import TableRow from "@/features/shared/ui/Table/TableRow";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import {
  getFormattedDateTime,
  getSignature,
  isSignaturePresentOnAllPages,
  isSignerPresentOnAllPages,
} from "@/utils/utils";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants";
import {
  getDocumentEditLink,
  getDocumentViewLink,
} from "@/features/shared/permissions/panelBoundaries";
import {
  PDF_DOC,
  PDF_MED,
  PDF_INTAKE,
  getPrintViaViewLink,
  displayDocType,
} from "./searchPageConstants";

export const useSearchPageDocumentData = ({
  documents,
  medication,
  intake,
  documentsFilterStartDate,
  documentsFilterEndDate,
  documentTypes,
  medicationFilterStartDate,
  medicationFilterEndDate,
  searchMedication,
  intakeFilterStartDate,
  intakeFilterEndDate,
  searchIntake,
  page,
  limit,
  profileUser,
  currentUserId,
  hoursFormat,
  downloadingId,
  setDownloadingId,
  fetchDocument,
  fetchIntake,
}) => {
  let totalDocumentPages;
  let totalMedPages;
  let totalIntakesPages;
  let selectedFormType;

  const {
    ADLTrackingForm,
    authorizationForReleaseOfInformation,
    contactNote,
    dischargeSummary,
    financialTransactionsRecord,
    progressNote,
    staffingNote,
    incidentReports,
    therapyLogs,
    userDocuments,
    appointmentTrackingDocs,
    appendix,
    dischargePlanning,
    recertificationOfNeed,
    asamAssessment,
    bhpProgress,
  } = documents?.data || {};
  const allDocuments = useMemo(
    () => [
      ...(ADLTrackingForm || []).map((doc) => ({
        ...doc,
        downloadKey: "adl-tracking-form",
        docType: "Activities of daily living tracking form",
        viewLink: "/view-dtf",
        editLink: "/update-dtf",
        deleteLink: "employee/deleteADLTrackingForm",
        permissionkey: "dtf",
        employeeSignature: doc.savedSigned,
        employeeDateSigned: doc.dateSigned,
      })),
      ...(authorizationForReleaseOfInformation || []).map((doc) => ({
        ...doc,
        downloadKey: "authorization-for-release-of-information",
        docType: "Authorization for release of information",
        usedInResident: true,
        residentViewLink: "/view-authorization-resident",
        residentEditLink: "/edit-authorization-resident",
        viewLink: "/view-authorization",
        editLink: "/update-authorization",
        deleteLink: "employee/deleteAuthorizationForReleaseOfInformation",
        permissionkey: "ari",
        employeeSignature: doc.signature,
        employeeDateSigned: doc.dateSigned,
      })),
      ...(contactNote || []).map((doc) => ({
        ...doc,
        downloadKey: "contact-note",
        docType: "Contact Note",
        viewLink: "/view-contact-note",
        editLink: "/update-contact-note",
        deleteLink: "employee/deleteContactNote",
        permissionkey: "cn",
        employeeSignature: doc.savedSigned,
        employeeDateSigned: doc.savedDate,
      })),
      ...(dischargeSummary || []).map((doc) => ({
        ...doc,
        downloadKey: "discharge-summary",
        docType: "Discharge Summary",
        usedInResident: true,
        residentViewLink: "/view-discharge-summary-resident",
        residentEditLink: "/edit-discharge-summary-resident",
        viewLink: "/view-discharge",
        editLink: "/update-discharge",
        deleteLink: "employee/deleteDischargeSummary",
        permissionkey: "discharge",
        employeeSignature: doc.bhpSignature,
        employeeDateSigned: doc.bhpSignatureDate,
      })),
      ...(dischargePlanning || []).map((doc) => ({
        ...doc,
        downloadKey: "discharge-planning",
        docType: "Discharge Planning",
        usedInResident: true,
        residentViewLink: "/view-discharge-planning-resident",
        residentEditLink: "/update-discharge-planning-resident",
        viewLink: "/view-discharge-planning",
        editLink: "/update-discharge-planning",
        deleteLink: "discharge-planning",
        permissionkey: "dp",
        employeeSignature: doc.bhpSignature,
        employeeDateSigned: doc.bhpSignatureDateTime,
      })),
      ...(recertificationOfNeed || []).map((doc) => ({
        ...doc,
        downloadKey: "recertification-of-need",
        docType: "Re-Certification of Need (RON)",
        usedInResident: true,
        residentViewLink: "/view-recertification-of-need-resident",
        residentEditLink: "/update-recertification-of-need-resident",
        viewLink: "/view-recertification-of-need",
        editLink: "/update-recertification-of-need",
        deleteLink: "recertification-of-need",
        permissionkey: "ron",
        employeeSignature: doc.bhpSignature,
        employeeDateSigned: doc.bhpSignatureDateTime,
      })),
      ...(asamAssessment || []).map((doc) => ({
        ...doc,
        downloadKey: "asam-assessment",
        docType: "ASAM Criteria Checklist for Assessment",
        usedInResident: true,
        residentViewLink: "/view-asam-assessment-resident",
        residentEditLink: "/update-asam-assessment-resident",
        viewLink: "/view-asam-assessment",
        editLink: "/update-asam-assessment",
        deleteLink: "asam-assessment",
        permissionkey: "asamc",
        employeeSignature: doc.bhpSignature,
        employeeDateSigned: doc.bhpSignatureDateTime,
      })),
      ...(bhpProgress || []).map((doc) => ({
        ...doc,
        downloadKey: "bhp-progress",
        docType: "BHP Progress Notes",
        usedInResident: true,
        residentViewLink: "/view-bhp-progress-resident",
        residentEditLink: "/update-bhp-progress-resident",
        viewLink: "/view-bhp-progress",
        editLink: "/update-bhp-progress",
        deleteLink: "bhp-progress",
        permissionkey: "bhpn",
        employeeSignature: doc.bhpSignature,
        employeeDateSigned: doc.bhpSignatureDateTime,
      })),
      ...(financialTransactionsRecord || []).map((doc) => ({
        ...doc,
        downloadKey: "financial-transection-record",
        docType: "Financial transactions record",
        viewLink: "/view-record",
        editLink: "/edit-record",
        deleteLink: "employee/deleteFinancialTransactionsRecord",
        permissionkey: "ft",
        employeeSignature:
          doc.transactions[doc?.transactions?.length - 1]?.staffSignature,
        employeeDateSigned:
          doc?.transactions[doc?.transactions?.length - 1]?.StaffSignDate,
      })),
      ...(progressNote || []).map((doc) => ({
        ...doc,
        downloadKey: "progress-note",
        docType: "Shift Progress Note",
        viewLink: "/view-progress-note",
        editLink: "/progree-note",
        deleteLink: "employee/deleteProgressNote",
        permissionkey: "pn",
        employeeSignature: doc.bhtSignature,
        employeeDateSigned: doc.dateSigned,
      })),
      ...(staffingNote || []).map((doc) => ({
        ...doc,
        downloadKey: "staffing-note",
        docType: "Staffing note",
        usedInResident: true,
        residentViewLink: "/view-staff-note-resident",
        residentEditLink: "/edit-staff-note-resident",
        viewLink: "/view-staff-note",
        editLink: "/update-staff-note",
        deleteLink: "employee/deleteStaffingNote",
        permissionkey: "sn",
        employeeSignature: doc.staffSignature,
        employeeDateSigned: doc.signedDate,
      })),
      ...(incidentReports || []).map((doc) => ({
        ...doc,
        downloadKey: "incident-report",
        docType: "Incident report",
        viewLink: "/view-incident-report",
        editLink: "/update-incident",
        deleteLink: "employee/deleteIncidentReport",
        permissionkey: "inr",
        employeeSignature: doc.savedSignedPartA,
        employeeDateSigned: doc.signedDatePartA,
      })),
      ...(therapyLogs || []).map((doc) => ({
        ...doc,
        downloadKey: "therapy-session",
        docType: "Therapy Progress Notes",
        viewLink: "/view-therapy-log",
        editLink: "/update-therapy-log",
        deleteLink: "employee/deleteTherapySession",
        permissionkey: "tn",
        employeeSignature: doc.behavioralTechnicianSignature,
        employeeDateSigned: doc.behavioralTechnicianDateSigned,
      })),
      ...(userDocuments || []).map((doc) => ({
        ...doc,
        docType: "document",
        isDocRow: true,
      })),
      ...(appointmentTrackingDocs || []).map((doc) => ({
        ...doc,
        docType: "appointmentTrackingDocs",
        viewLink: "/view-tracking-log",
        editLink: "/update-tracking-log",
        deleteLink: "Patient/AppointmentTrackingLog",
        permissionkey: "va",
      })),
      ...(appendix || []).map((doc) => ({
        ...doc,
        downloadKey: "appendix",
        docType: "TB Risk Assessment",
        usedInResident: true,
        residentViewLink: "/view-appendix-resident",
        residentEditLink: "/sign-appendix-resident",
        viewLink: "/view-appendix",
        editLink: "/sign-appendix",
        deleteLink: "admin/deleteAppendix",
        permissionkey: "app",
        adminSignature: doc.adminSignature,
        adminDateSigned: doc.adminSignatureDate,
        employeeSignature: doc.employeeSignature,
        employeeDateSigned: doc.employeeSignatureDate,
      })),
    ],
    [
      ADLTrackingForm,
      authorizationForReleaseOfInformation,
      contactNote,
      dischargeSummary,
      dischargePlanning,
      recertificationOfNeed,
      asamAssessment,
      bhpProgress,
      financialTransactionsRecord,
      progressNote,
      staffingNote,
      incidentReports,
      therapyLogs,
      userDocuments,
      appointmentTrackingDocs,
      appendix,
    ],
  );
  const filteredDocuments = useMemo(
    () =>
      allDocuments.filter((doc) => {
        const createdAt = new Date(doc?.createdAt);
        const startDate = documentsFilterStartDate
          ? new Date(documentsFilterStartDate)
          : null;
        const endDate = documentsFilterEndDate
          ? new Date(documentsFilterEndDate)
          : null;
        const matchesDate =
          (!startDate || createdAt >= startDate) &&
          (!endDate || createdAt <= endDate);
        const matchesSearch =
          documentTypes === "All" ||
          !documentTypes ||
          doc.docType.trim().toLowerCase() ===
            documentTypes.trim().toLowerCase();
        return matchesDate && matchesSearch;
      }),
    [
      allDocuments,
      documentsFilterStartDate,
      documentsFilterEndDate,
      documentTypes,
    ],
  );

  // Set side-effect variable
  selectedFormType = useMemo(
    () => PDF_DOC.filter((doc) => doc.label === documentTypes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentTypes, PDF_DOC],
  );
  const sortedDocuments = useMemo(
    () =>
      [...filteredDocuments].sort((a, b) => {
        const bTime = new Date(b?.createdAt).getTime();
        const aTime = new Date(a?.createdAt).getTime();
        return bTime - aTime;
      }),
    [filteredDocuments],
  );
  totalDocumentPages = Math.ceil(sortedDocuments.length / limit);
  const paginatedDocs = useMemo(
    () => sortedDocuments.slice((page - 1) * limit, page * limit),
    [sortedDocuments, page, limit],
  );
  const renderRows = useMemo(
    () =>
      paginatedDocs.map((doc, index) => {
        return doc.isDocRow ? (
          <TableRow
            title={doc?.type ? `${doc.type} (Document)` : "Document"}
            date={doc?.createdAt}
            key={`Document${index}`}
            signature={"-"}
            link={getObjectUrlFromDownloadUrl(doc?.document)}
            editIcon={false}
            viewIcon={false}
            deleteIcon={
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                (typeof profileUser.userPermissions?.view === "string"
                  ? profileUser.userPermissions.view.split(":")
                  : []
                ).includes("df"))
            }
            downloadIcon={true}
            downloadLink={doc?.document}
            dLink={`delete-user-document/${doc?._id}`}
            addtional={fetchDocument}
            utc={false}
          />
        ) : (
          <TableRow
            key={`${doc.docType}-${doc._id}`}
            title={`${displayDocType(doc.docType)}`}
            downloadKeyName={doc?.downloadKey}
            date={doc?.createdAt}
            signature={getSignature(
              doc,
              hoursFormat,
              "adminSignature",
              "adminDateSigned",
              "employeeSignature",
              "employeeDateSigned",
            )}
            link={getDocumentViewLink(doc, profileUser?.userType, doc._id)}
            editLink={getDocumentEditLink(doc, profileUser?.userType, doc?._id)}
            editIcon={
              doc?.signers?.some(
                (signer) =>
                  signer.signerId === currentUserId &&
                  !signer?.signature?.length,
              ) ||
              !!doc?.signers?.filter?.(
                (signer) =>
                  profileUser?.patientsAssigned?.includes(signer.signerId) &&
                  !signer?.signature?.length,
              )?.length ||
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                profileUser.userPermissions?.edit
                  ?.split(":")
                  .includes(doc.permissionkey))
            }
            deleteIcon={
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                profileUser.userPermissions?.delete
                  ?.split(":")
                  .includes(doc.permissionkey))
            }
            dLink={`${doc.deleteLink}/${doc._id}`}
            addtional={fetchDocument}
            saveAsDraft={doc?.saveAsDraft}
            utc={false}
            documentId={doc?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
            printViaViewLink={getPrintViaViewLink(doc)}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      paginatedDocs,
      profileUser,
      currentUserId,
      downloadingId,
      hoursFormat,
      fetchDocument,
      getPrintViaViewLink,
      getSignature,
    ],
  );
  const {
    PrnMedicationLog,
    informedConsentForMedication,
    mars,
    medicationOpioidCount,
    medicationReconciliation,
    mentalStatusReport,
    refusalMedicalTreatment,
  } = medication?.data || {};
  const allMedcialDocuments = useMemo(
    () => [
      ...(PrnMedicationLog || []).map((doc) => ({
        ...doc,
        downloadKey: "prn-medication-log",
        docType: "PrnMedicationLog",
        title: `PRN ${doc.medicationAndStrength}`,
        usedInResident: true,
        residentViewLink: "/view-prn-log-resident",
        residentEditLink: "/edit-prn-log-resident",
        viewLink: "/view-prn",
        editLink: "/update-prn",
        deleteLink: "employee/deletePrnMedicationLog",
        permissionkey: "prn",
        employeeSignature:
          doc.tableData?.[doc?.tableData?.length - 1]?.staffNameAndSignature,
        employeeDateSigned:
          doc.tableData?.[doc?.tableData?.length - 1]?.signatureDate,
      })),
      ...(informedConsentForMedication || []).map((doc) => ({
        ...doc,
        downloadKey: "informed-consent-for-medication",
        docType: "informedConsentForMedication",
        title: "Informed Consent For Medications",
        usedInResident: true,
        residentViewLink: "/view-informed-consent-resident",
        residentEditLink: "/edit-informed-consent-resident",
        viewLink: "/view-inform",
        editLink: "/update-informed",
        deleteLink: "employee/deleteInformedConsentForMedication",
        permissionkey: "icm",
        employeeSignature:
          doc.tableDate?.[doc?.tableDate?.length - 1]?.signature,
        employeeDateSigned:
          doc.tableDate?.[doc?.tableDate?.length - 1]?.staffSignedDate,
      })),
      ...(mars || []).map((doc) => ({
        ...doc,
        downloadKey: "mars",
        docType: "mars",
        title: "Mars",
        isMars: true,
      })),
      ...(medicationOpioidCount || []).map((doc) => ({
        ...doc,
        downloadKey: "medication-opioid-count",
        docType: "medicationOpioidCount",
        title: "Medication Count",
        viewLink: "/view-count",
        editLink: "/update-count",
        deleteLink: "employee/deleteMedicationOpioidCount",
        permissionkey: "mc",
        employeeSignature:
          doc.data?.[doc?.data?.length - 1]?.relievingStaffSignature,
        employeeDateSigned:
          doc.data?.[doc?.data?.length - 1]?.relievingStaffSignatureDate,
      })),
      ...(medicationReconciliation || []).map((doc) => ({
        ...doc,
        downloadKey: "medication-reconciliation",
        docType: "medicationReconciliation",
        title: "Medication Reconciliation",
        viewLink: "/view-reconciliation",
        editLink: "/update-reconciliation",
        deleteLink: "employee/deleteMedicationReconciliation",
        permissionkey: "mr",
        employeeSignature:
          doc?.medications?.[doc.medications.length - 1]?.providerSignature,
        employeeDateSigned:
          doc?.medications?.[doc.medications.length - 1]?.providerSignatureDate,
      })),
      ...(mentalStatusReport || []).map((doc) => ({
        ...doc,
        downloadKey: "mental-status-report",
        docType: "mentalStatusReport",
        title: "Mental Status",
        viewLink: "/view-mental-status",
        editLink: "/update-mental-status",
        deleteLink: "Patient/MentalStatusReport",
        permissionkey: "ms",
        employeeSignature: doc.driverSignature,
        employeeDateSigned: doc.signedDate,
      })),
      ...(refusalMedicalTreatment || []).map((doc) => ({
        ...doc,
        downloadKey: "refusal-medical-treatment",
        docType: "refusalMedicalTreatment",
        title: "Refusal Medical Treatment",
        usedInResident: true,
        residentViewLink: "/view-refusal-resident",
        residentEditLink: "/edit-refusal-resident",
        viewLink: "/view-refusal",
        editLink: "/update-refusal",
        deleteLink: "Patient/RefusalMedicalTreatment",
        permissionkey: "rmt",
        employeeSignature: doc.staffSignature,
        employeeDateSigned: doc.staffDate,
      })),
    ],
    [
      PrnMedicationLog,
      informedConsentForMedication,
      mars,
      medicationOpioidCount,
      medicationReconciliation,
      mentalStatusReport,
      refusalMedicalTreatment,
    ],
  );
  const filteredMedDocuments = useMemo(
    () =>
      allMedcialDocuments.filter((doc) => {
        const createdAt = new Date(doc?.createdAt);
        const startDate = medicationFilterStartDate
          ? new Date(medicationFilterStartDate)
          : null;
        const endDate = medicationFilterEndDate
          ? new Date(medicationFilterEndDate)
          : null;
        const matchesDate =
          (!startDate || createdAt >= startDate) &&
          (!endDate || createdAt <= endDate);
        const matchesSearch =
          searchMedication === "All" ||
          !searchMedication ||
          doc.docType.toLowerCase() === searchMedication.toLowerCase();
        return matchesDate && matchesSearch;
      }),
    [
      allMedcialDocuments,
      medicationFilterStartDate,
      medicationFilterEndDate,
      searchMedication,
    ],
  );

  // Side-effect variable for med form type
  selectedFormType = useMemo(
    () => PDF_MED.filter((doc) => doc.match === searchMedication),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchMedication, PDF_MED],
  );
  const sortedMedDocuments = useMemo(
    () =>
      [...filteredMedDocuments].sort((a, b) => {
        const bTime = new Date(b?.createdAt).getTime();
        const aTime = new Date(a?.createdAt).getTime();
        return bTime - aTime;
      }),
    [filteredMedDocuments],
  );
  totalMedPages = Math.ceil(sortedMedDocuments.length / limit);
  const paginatedMedDocs = useMemo(
    () => sortedMedDocuments.slice((page - 1) * limit, page * limit),
    [sortedMedDocuments, page, limit],
  );
  const renderMedRows = useMemo(
    () =>
      paginatedMedDocs.map((doc, index) => {
        return doc.isMars ? (
          <TableRow
            title={"Medication Administration Record"}
            downloadKeyName={doc?.downloadKey}
            date={doc?.updatedAt}
            key={`mars${index}`}
            signature={
              doc.staffDetails?.[doc?.staffDetails?.length - 1]?.name ?? "-"
            }
            link={`/mars/${doc.patientId}`}
            editIcon={false}
            saveAsDraft={doc?.saveAsDraft}
            utc={false}
            documentId={doc?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
            printViaViewLink={getPrintViaViewLink(doc)}
          />
        ) : (
          <TableRow
            key={`${doc.docType}-${doc._id}`}
            title={`${doc.title}`}
            downloadKeyName={doc?.downloadKey}
            date={doc?.createdAt}
            signature={getSignature(
              doc,
              hoursFormat,
              "adminSignature",
              "adminDateSigned",
              "employeeSignature",
              "employeeDateSigned",
            )}
            link={getDocumentViewLink(doc, profileUser?.userType, doc._id)}
            editLink={getDocumentEditLink(doc, profileUser?.userType, doc?._id)}
            editIcon={
              doc?.signers?.some(
                (signer) =>
                  signer.signerId === currentUserId &&
                  !signer?.signature?.length,
              ) ||
              !!doc?.signers?.filter?.(
                (signer) =>
                  profileUser?.patientsAssigned?.includes(signer.signerId) &&
                  !signer?.signature?.length,
              )?.length ||
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                profileUser.userPermissions?.edit
                  ?.split(":")
                  .includes(doc.permissionkey))
            }
            deleteIcon={
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                profileUser.userPermissions?.delete
                  ?.split(":")
                  .includes(doc.permissionkey))
            }
            dLink={`${doc.deleteLink}/${doc._id}`}
            addtional={fetchDocument}
            saveAsDraft={
              doc?.saveAsDraft ||
              doc?.residentGuardianSignatureSaveAsDraft ||
              doc?.providerSignatureSaveAsDraft
            }
            utc={false}
            documentId={doc?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      paginatedMedDocs,
      profileUser,
      currentUserId,
      downloadingId,
      hoursFormat,
      fetchDocument,
      getPrintViaViewLink,
      getSignature,
    ],
  );
  const {
    faceSheet,
    initialAssessment,
    nursingAssessment,
    residentIntake,
    treatmentPlan,
    residentSafetyPlan,
  } = intake?.data || {};
  const allIntakeDocuments = useMemo(
    () => [
      ...(faceSheet || []).map((doc) => ({
        ...doc,
        downloadKey: "face-sheet",
        docType: "faceSheet",
        title: "FaceSheet",
        usedInResident: true,
        residentViewLink: "/view-facesheet-resident",
        residentEditLink: "/edit-facesheet-resident",
        viewLink: "/view-face-sheet",
        editLink: "/edit-face-sheet",
        deleteLink: "delete-face-sheet",
        permissionkey: "fs",
        employeeSignature: doc.bhpSignature,
        employeeDateSigned: doc.bhpDate,
      })),
      ...(initialAssessment || []).map((doc) => ({
        ...doc,
        downloadKey: "initial-assessment",
        docType: "initialAssessment",
        title: "Initial Assessment",
        usedInResident: true,
        residentViewLink: "/view-initial-assessment-resident",
        residentEditLink: "/edit-initial-Assessment-resident",
        viewLink: "/view-initial-assessment",
        editLink: "/edit-initial-assessment",
        deleteLink: "delete-initial-assessment",
        permissionkey: "iass",
        employeeSignature: doc.bhpInformation.bhpSignature,
        employeeDateSigned: doc.bhpInformation.bhpDate,
      })),
      ...(nursingAssessment || []).map((doc) => ({
        ...doc,
        downloadKey: "nursing-assessment",
        docType: "nursingAssessment",
        title: "Nursing Assessment",
        residentViewLink: "/view-nursing-assessment-resident",
        residentEditLink: "/edit-nursing-assessment-resident",
        viewLink: "/view-nursing-assessment",
        editLink: "/edit-nursing-assessment",
        deleteLink: "delete-nursing-assessment",
        permissionkey: "nass",
        employeeSignature: doc.rnSignature,
        employeeDateSigned: doc.rnDate,
      })),
      ...(residentIntake || []).map((doc) => ({
        ...doc,
        downloadKey: "resident-intake",
        docType: "residentIntake",
        title: "Resident Intake",
        residentViewLink: "/view-resident-intake-resident",
        residentEditLink: "/edit-residentintakes-resident",
        viewLink: "/view-resident-intake",
        editLink: "/edit-resident-intake",
        deleteLink: "delete-resident-intake",
        permissionkey: "ri",
      })),
      ...(treatmentPlan || []).map((doc) => ({
        ...doc,
        downloadKey: "treatment-plan",
        docType: "treatmentPlan",
        title: "Behavioral Health Treatment Plan",
        usedInResident: true,
        residentViewLink: "/view-treatment-plan-resident",
        residentEditLink: "/edit-treatmentplan-resident",
        viewLink: "/view-treatment-plan",
        editLink: "/edit-treatment-plan",
        deleteLink: "delete-treatment-plan",
        permissionkey: "tp",
        employeeSignature: doc.signaturesBhp.signature,
        employeeDateSigned: doc.signaturesBhp.date,
      })),
      ...(residentSafetyPlan || []).map((doc) => ({
        ...doc,
        downloadKey: "safety-plan",
        docType: "residentSafetyPlan",
        title: "Safety Plan",
        residentViewLink: "/view-safety-plan-resident",
        residentEditLink: "/edit-safetyplan-resident",
        viewLink: "/view-safety-plan",
        editLink: "/edit-safety-plan",
        deleteLink: "delete-resident-safety-plan",
        permissionkey: "sp",
        employeeSignature: doc.signature,
        employeeDateSigned: doc.signatureDate,
      })),
    ],
    [
      faceSheet,
      initialAssessment,
      nursingAssessment,
      residentIntake,
      treatmentPlan,
      residentSafetyPlan,
    ],
  );
  const filteredIntakeDocuments = useMemo(
    () =>
      allIntakeDocuments.filter((doc) => {
        const createdAt = new Date(doc?.createdAt);
        const startDate = intakeFilterStartDate
          ? new Date(intakeFilterStartDate)
          : null;
        const endDate = intakeFilterEndDate
          ? new Date(intakeFilterEndDate)
          : null;
        const matchesDate =
          (!startDate || createdAt >= startDate) &&
          (!endDate || createdAt <= endDate);
        const matchesSearch =
          searchIntake === "All" ||
          (!searchIntake && searchIntake !== 0) ||
          doc.docType?.toLowerCase() === searchIntake.toLowerCase();
        return matchesDate && matchesSearch;
      }),
    [
      allIntakeDocuments,
      intakeFilterStartDate,
      intakeFilterEndDate,
      searchIntake,
    ],
  );

  // Side-effect variable for intake form type
  selectedFormType = useMemo(
    () => PDF_INTAKE.filter((doc) => doc.match === searchIntake),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchIntake, PDF_INTAKE],
  );
  const sortedIntakeDocuments = useMemo(
    () =>
      [...filteredIntakeDocuments].sort((a, b) => {
        const bTime = new Date(b?.createdAt).getTime();
        const aTime = new Date(a?.createdAt).getTime();
        return bTime - aTime;
      }),
    [filteredIntakeDocuments],
  );
  totalIntakesPages = Math.ceil(sortedIntakeDocuments.length / limit);
  const paginatedIntakeDocs = useMemo(
    () => sortedIntakeDocuments.slice((page - 1) * limit, page * limit),
    [sortedIntakeDocuments, page, limit],
  );
  const renderIntakeRows = useMemo(
    () =>
      paginatedIntakeDocs.map((doc, index) => {
        return doc.title === "Resident Intake" ? (
          <TableRow
            title={doc.title}
            downloadKeyName={doc?.downloadKey}
            date={doc.createdAt}
            key={`${doc.title}-${index}`}
            signature={(() => {
              const allSignture = doc?.signatures?.[0];
              if (allSignture?.sign?.length > 0) {
                const getsign = allSignture?.sign
                  ?.slice()
                  ?.sort(
                    (a, b) => new Date(a.dateSigned) - new Date(b.dateSigned),
                  )?.[0];
                return `${getsign?.signature} ${getFormattedDateTime(getsign?.dateSigned, hoursFormat)}`;
              }
            })()}
            link={getDocumentViewLink(doc, profileUser?.userType, doc._id)}
            editLink={getDocumentEditLink(doc, profileUser?.userType, doc?._id)}
            editIcon={
              (!isSignaturePresentOnAllPages(
                doc?.signatures,
                profileUser?.patientsAssigned,
              ) &&
                !isSignerPresentOnAllPages(
                  doc?.signatures,
                  profileUser?._id,
                )) ||
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                (typeof profileUser.userPermissions?.edit === "string"
                  ? profileUser.userPermissions.edit.split(":")
                  : []
                ).includes("ri"))
            }
            deleteIcon={
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                (typeof profileUser.userPermissions?.delete === "string"
                  ? profileUser.userPermissions.delete.split(":")
                  : []
                ).includes("ri"))
            }
            dLink={`${doc.deleteLink}/${doc._id}`}
            addtional={fetchIntake}
            saveAsDraft={doc.saveAsDraft}
            utc={false}
            documentId={doc?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
            printViaViewLink={getPrintViaViewLink(doc)}
          />
        ) : (
          <TableRow
            title={doc.title}
            downloadKeyName={doc?.downloadKey}
            date={doc.createdAt}
            key={`${doc.title}-${index}`}
            signature={getSignature(
              doc,
              hoursFormat,
              "adminSignature",
              "adminSignatureDate",
              "employeeSignature",
              "employeeDateSigned",
            )}
            link={getDocumentViewLink(doc, profileUser?.userType, doc._id)}
            editLink={getDocumentEditLink(doc, profileUser?.userType, doc?._id)}
            editIcon={
              doc?.signers?.filter?.(
                (signer) =>
                  signer.signerId === currentUserId &&
                  !signer?.signature?.length,
              )?.length ||
              !!doc?.signers?.filter?.(
                (signer) =>
                  profileUser?.patientsAssigned?.includes(signer.signerId) &&
                  !signer?.signature?.length,
              )?.length ||
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                (typeof profileUser.userPermissions?.edit === "string"
                  ? profileUser.userPermissions.edit.split(":")
                  : []
                ).includes("tp"))
            }
            deleteIcon={
              profileUser?.userType === ROLES.ADMIN ||
              profileUser?.accountType === ACCOUNT_TYPES.ADMINISTRATOR ||
              (profileUser?.accountType === ACCOUNT_TYPES.REGULAR &&
                profileUser?.userType === ROLES.EMPLOYEE &&
                (typeof profileUser.userPermissions?.delete === "string"
                  ? profileUser.userPermissions.delete.split(":")
                  : []
                ).includes("tp"))
            }
            dLink={`${doc.deleteLink}/${doc._id}`}
            addtional={fetchIntake}
            saveAsDraft={doc.saveAsDraft}
            utc={false}
            documentId={doc?._id}
            downloadIcon={true}
            isDownloading={downloadingId !== null}
            currentDownloadId={downloadingId}
            setDownloadingId={setDownloadingId}
            printViaViewLink={getPrintViaViewLink(doc)}
          />
        );
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      paginatedIntakeDocs,
      profileUser,
      currentUserId,
      downloadingId,
      hoursFormat,
      fetchIntake,
      getPrintViaViewLink,
      getSignature,
    ],
  );

  return {
    renderRows,
    renderMedRows,
    renderIntakeRows,
    totalDocumentPages,
    totalMedPages,
    totalIntakesPages,
    selectedFormType,
  };
};

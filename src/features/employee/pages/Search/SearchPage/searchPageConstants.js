/** @format */
export const PDF_DOC = [
  {
    value: "adl-tracking-form",
    label: "Activities of daily living tracking form",
  },
  {
    value: "authorization-for-release-of-information",
    label: "Authorization for release of information",
  },
  {
    value: "contact-note",
    label: "Contact Note",
  },
  {
    value: "discharge-summary",
    label: "Discharge Summary",
  },
  {
    value: "financial-transection-record",
    label: "Financial transactions record",
  },
  {
    value: "progress-note",
    label: "Shift Progress Note",
  },
  // value kept as legacy "staffing-note" key; UI label renamed to "ART Meeting".
  {
    value: "staffing-note",
    label: "ART Meeting",
  },
  {
    value: "discharge-planning",
    label: "Discharge Planning",
  },
  {
    value: "asam-assessment",
    label: "ASAM Criteria Checklist for Assessment",
  },
  {
    value: "bhp-progress",
    label: "BHP Progress",
  },
  {
    value: "incident-report",
    label: "Incident report",
  },
  {
    value: "therapy-session",
    label: "Therapy Progress Notes",
  },
  {
    value: "appendix",
    label: "TB Risk Assessment",
  },
  {
    value: "recertification-of-need",
    label: "Re-Certification of Need (RON)",
  },
];

// Display-only translation for docType strings shown in document rows.
// docType values themselves are kept unchanged so filters, the autoprint
// whitelist, the deleteLink/viewLink mappings, and any backend matching
// continue to work against the legacy "Staffing note" key. Only the
// rendered text is swapped to "ART Meeting".
const DOCTYPE_DISPLAY_OVERRIDES = {
  "Staffing note": "ART Meeting",
};
export const displayDocType = (docType) =>
  DOCTYPE_DISPLAY_OVERRIDES[docType] || docType;

// Forms whose download button opens the View page + auto-prints (so that
// inline pen signatures render correctly). Resident Intake is included:
// its View page now renders ALL 10 pages with page-break-after on print,
// triggered by ?autoPrint=1.
// const VIEW_AUTOPRINT_DOCTYPES = new Set([
//   "Staffing note",
//   "Discharge Summary",
//   "initialAssessment",
//   "treatmentPlan",
//   "residentIntake",
// ]);
const VIEW_AUTOPRINT_DOCTYPES = new Set([]);
export const getPrintViaViewLink = (doc) => {
  if (!doc?.viewLink || !doc?._id) return null;
  if (VIEW_AUTOPRINT_DOCTYPES.has(doc.docType)) {
    return `${doc.viewLink}/${doc._id}?autoPrint=1`;
  }
  return null;
};
export const PDF_MED = [
  {
    value: "prn-medication-log",
    label: "PRN",
    match: "PrnMedicationLog",
  },
  {
    value: "informed-consent-for-medication",
    label: "Informed Consent For Medicatios",
    match: "informedConsentForMedication",
  },
  {
    value: "medication-opioid-count",
    label: "Medication Count",
    match: "medicationOpioidCount",
  },
  {
    value: "medication-reconciliation",
    label: "Medication Reconciliation",
    match: "medicationReconciliation",
  },
  {
    value: "mars",
    label: "Medication Administration Record",
    match: "mars",
  },
  {
    value: "mental-status-report",
    label: "Mental Status",
    match: "mentalStatusReport",
  },
  {
    value: "refusal-medical-treatment",
    label: "Refusal Medical Treatment",
    match: "refusalMedicalTreatment",
  },
];
export const PDF_INTAKE = [
  {
    value: "face-sheet",
    label: "Face Sheet",
    match: "faceSheet",
  },
  {
    value: "initial-assessment",
    label: "Initial Assessment",
    match: "initialAssessment",
  },
  {
    value: "nursing-assessment",
    label: "Nursing Assessment",
    match: "nursingAssessment",
  },
  {
    value: "resident-intake",
    label: "Resident Intake",
    match: "residentIntake",
  },
  {
    value: "treatment-plan",
    label: "Behavioral Health Treatment Plan",
    match: "treatmentPlan",
  },
  {
    value: "safety-plan",
    label: "Safety Plan",
    match: "residentSafetyPlan",
  },
];
export const MEDICATION_OPTION = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "PrnMedicationLog",
    label: "PRN",
  },
  {
    value: "informedConsentForMedication",
    label: "Informed Consent For Medications",
  },
  {
    value: "mars",
    label: "Medication Administration Record",
  },
  {
    value: "medicationOpioidCount",
    label: "Medication Count",
  },
  {
    value: "medicationReconciliation",
    label: "Medication Reconciliation",
  },
  {
    value: "mentalStatusReport",
    label: "Mental Status",
  },
  {
    value: "refusalMedicalTreatment",
    label: "Refusal Medical Treatment",
  },
];
export const INTAKE_OPTION = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "faceSheet",
    label: "Face Sheet",
  },
  {
    value: "initialAssessment",
    label: "Initial Assessment",
  },
  {
    value: "nursingAssessment",
    label: "Nursing Assessment",
  },
  {
    value: "residentIntake",
    label: "Resident Intake",
  },
  {
    value: "treatmentPlan",
    label: "Behavioral Health Treatment Plan",
  },
  {
    value: "residentSafetyPlan",
    label: "Safety Plan",
  },
];

export const ALL_DOCUMENT_OPTIONS = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Activities of daily living tracking form",
    label: "Activities Of Daily Living Tracking Form",
  },
  {
    value: "Authorization for release of information",
    label: "Authorization For Release Of Information",
  },
  {
    value: "Contact Note",
    label: "Contact Note",
  },
  {
    value: "Discharge Summary",
    label: "Discharge Summary",
  },
  {
    value: "Financial transactions record",
    label: "Financial Transactions Record",
  },
  {
    value: "Shift Progress Note",
    label: "Shift Progress Note",
  },
  {
    value: "Staffing note",
    label: "ART Meeting",
  },
  {
    value: "Discharge Planning",
    label: "Discharge Planning",
  },
  {
    value: "ASAM Criteria Checklist for Assessment",
    label: "ASAM Criteria Checklist for Assessment",
  },
  {
    value: "BHP Progress Notes",
    label: "BHP Progress Notes",
  },
  {
    value: "Incident report",
    label: "Incident Report",
  },
  {
    value: "Therapy Progress Notes",
    label: "Therapy Progress Notes",
  },
  {
    value: "TB Risk Assessment",
    label: "TB Risk Assessment",
  },
  {
    value: "Re-Certification of Need (RON)",
    label: "Re-Certification of Need (RON)",
  },
  {
    value: "document",
    label: "Uploaded Document",
  },
];

export const GUARDIAN_DOCUMENT_OPTIONS = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Discharge Summary",
    label: "Discharge Summary",
  },
  {
    value: "Staffing note",
    label: "ART Meeting",
  },
  {
    value: "Authorization for release of information",
    label: "Authorization For Release Of Information",
  },
  {
    value: "TB Risk Assessment",
    label: "TB Risk Assessment",
  },
  {
    value: "Discharge Planning",
    label: "Discharge Planning",
  },
  {
    value: "ASAM Criteria Checklist for Assessment",
    label: "ASAM Criteria Checklist for Assessment",
  },
  {
    value: "BHP Progress Notes",
    label: "BHP Progress Notes",
  },
  {
    value: "Re-Certification of Need (RON)",
    label: "Re-Certification of Need (RON)",
  },
  {
    value: "document",
    label: "Uploaded Document",
  },
];

export const TYPE_MAP = {
  Documents: PDF_DOC,
  Medications: PDF_MED,
  Intake: PDF_INTAKE,
};

export const getDocumentOptionsForUser = (userType, ROLES) =>
  userType === ROLES.GUARDIAN
    ? GUARDIAN_DOCUMENT_OPTIONS
    : ALL_DOCUMENT_OPTIONS;

export const SEARCH_PRINT_PAGE_STYLE = `
      @page{
        size: landscape !important;
        margin: 12mm 9mm!important;
      }
      th {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;

export const INITIAL_FILTER_STATE = {
  searchMedication: "All",
  searchIntake: "All",
  dateFilter: "",
  medicationFilterStartDate: "",
  medicationFilterEndDate: "",
  vitalsFilterStartDate: "",
  vitalsFilterEndDate: "",
  documentsFilterStartDate: "",
  documentsFilterEndDate: "",
  intakeFilterStartDate: "",
  intakeFilterEndDate: "",
  scheduleFilterDate: {
    pastStartDate: "",
    pastEndDate: "",
    upcomingStartDate: "",
    upcomingEndDate: "",
  },
};

export const INITIAL_PAGINATION_STATE = {
  vitalLimit: 10,
  vitalPage: 1,
  scheduleLimit: 10,
  schedulePage: 1,
  limit: null,
  page: 1,
};

export const createFieldUpdater = (setter) => (field, value) =>
  setter((prev) => ({ ...prev, [field]: value }));

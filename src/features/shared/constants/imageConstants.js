/** @format */

import {
  InitialImg,
  NurseImg,
  FaceSheetImg,
  MedImg,
  SafetyPlanImg,
  ResidentIntakeImg,
  dischargeImg,
  VectorImg,
  NotesImg,
  MedicationImg,
  TrainingImg,
  ProgressNoteImg,
  DischargeImg,
  ActivityOfDailyLivigImg,
  financialRecordImg,
  stuffingNoteImg,
  authReleaseInfoImg,
  incidentReportImg,
  contactNoteImg,
  informedConsentForm,
  marsImg,
  medicationRecon,
  medicationCount,
  MEDICATIONLOG,
  A2023FormImg,
  AppendixImg,
  apsconsentImg,
  empInfoImg,
  fw4Img,
  fw9Img,
  i9Img,
  jobDescription,
  jobOfferImg,
  lrc1031a,
  referenceCheckImg,
} from "@/assets/index";

export const EmploymentCards = [
  {
    src: empInfoImg,
    link: "/employee-information",
    title: "Personal Information",
    adminLink: "/employee-information",
    permissionKey: "PI",
  },
  {
    src: jobOfferImg,
    link: "/offer-letter-form",
    title: "Offer Letter",
    adminLink: "/dashboard/offer-letter",
    permissionKey: "offl",
  },
  {
    src: AppendixImg,
    link: "/appendix-list",
    title: "TB Risk Assessment",
    adminLink: "/dashboard/all-appendix",
    permissionKey: "app",
  },
  {
    src: A2023FormImg,
    link: "/all-forms-2023",
    title: "Forms 2023",
    adminLink: "/dashboard/all-forms-2023",
    permissionKey: "f23",
  },
  {
    src: lrc1031a,
    link: "/all-lrc-1031a",
    title: "LRC-1031A",
    adminLink: "/dashboard/all-lrc-1031a",
    permissionKey: "lrc1031a",
  },
  {
    src: jobDescription,
    link: "/job-description",
    title: "Job Description",
    adminLink: "/dashboard/job-description",
    permissionKey: "jd",
  },
  {
    src: fw4Img,
    link: "/all-fw4",
    title: "Fw4",
    adminLink: "/dashboard/all-fw4",
    permissionKey: "fw4",
  },
  {
    src: apsconsentImg,
    link: "/all-aps",
    title: "APS Consent",
    adminLink: "/all-aps",
    permissionKey: "aps",
  },
  {
    src: fw9Img,
    link: "/all-fw9",
    title: "Fw9",
    adminLink: "/dashboard/all-fw9",
    permissionKey: "fw9",
  },
  {
    src: i9Img,
    link: "/all-i9",
    title: "I-9",
    adminLink: "/dashboard/all-i9",
    permissionKey: "i9",
  },
  {
    src: referenceCheckImg,
    link: "/viewEmployeeTermination",
    title: "Employee Termination",
    adminLink: "/dashboard/EmployeeTerminationlist",
    permissionKey: "et",
  },

  {
    src: ProgressNoteImg,
    title: "Time Of Request",
    adminLink: "/get-time-of-request",
    permissionKey: "pto",
  },
  {
    src: DischargeImg,
    title: "Refrence Check",
    adminLink: "/dashboard/reference-check",
    permissionKey: "rfc",
  },
  {
    src: ActivityOfDailyLivigImg,
    title: "Employee Performance",
    adminLink: "/dashboard/employee-performance",
    permissionKey: "aep",
  },
];

export const patient_chart = [
  {
    src: ProgressNoteImg,
    link: "/employee/patient-chart/progress",
    title: "Shift Progress Note",
    permissionKey: "pn",
  },
  {
    src: DischargeImg,
    link: "/discharge-summary",
    title: "Discharge Summary",
    permissionKey: "discharge",
  },
  {
    src: ActivityOfDailyLivigImg,
    link: "/DTF",
    title: "Activities Of Daily Living Tracking Form",
    permissionKey: "dtf",
  },
  {
    src: financialRecordImg,
    link: "/financial-record",
    title: "Financial Transaction Record",
    permissionKey: "ft",
  },
  {
    src: stuffingNoteImg,
    link: "/staff-note",
    // UI label: "ART Meeting" (formerly "Staffing Note"). Code path,
    // route, permission key, and image asset name remain unchanged.
    title: "ART Meeting",
    permissionKey: "sn",
  },
  {
    src: authReleaseInfoImg,
    link: "/authorization",
    title: "Authorization For Release of information",
    permissionKey: "ari",
  },
  {
    src: incidentReportImg,
    link: "/incident-report",
    title: "Incident Report Form",
    permissionKey: "inr",
  },
  {
    src: contactNoteImg,
    link: "/contact-note",
    title: "Contact Note",
    permissionKey: "cn",
  },
  {
    src: ActivityOfDailyLivigImg,
    link: "/bhp-progress",
    title: "BHP Progress Note",
    permissionKey: "bhpn",
  },
  {
    src: incidentReportImg,
    link: "/asam-assessment",
    title: "ASAM Criteria Checklist for Assessment",
    permissionKey: "asamc",
  },
  {
    src: authReleaseInfoImg,
    link: "/discharge-planning",
    title: "Discharge Planning",
    permissionKey: "dp",
  },
  {
    src: authReleaseInfoImg,
    link: "/recertification-of-need",
    title: "Re-Certification of Need (RON)",
    permissionKey: "ron",
  },
];

export const NotesOptions = [
  {
    src: "/Dashboard2/GroupNotes/Group 17546.png",
    link: "/therapy-notes",
  },
  {
    src: "/Dashboard2/GroupNotes/Group 17686.png",
    link: "/manual-theraphy",
  },
];

export const TrainingConstant = [
  {
    src: financialRecordImg,
    link: "/on-site",
    title: "On Site And Facility Orientation Verification",
    permissionKey: "onsfov",
  },
  {
    src: ActivityOfDailyLivigImg,
    link: "/skills-knowledge-training",
    title: "Skill And Knowledge Training",
    permissionKey: "st",
  },
];

export const SecondItem = [
  {
    link: "/get-infection-control",
    img: VectorImg,
    title: "Infection Control",
    permissionKey: "ic",
  },
  {
    link: "/get-administration-medication",
    img: dischargeImg,
    title: "Assistance With Self-Administration Of Medication",
    permissionKey: "asam",
  },
  {
    link: "/get-fall-prevention",
    img: NotesImg,
    title: "Fall Prevention And Recovery Training",
    permissionKey: "fprt",
  },
  {
    link: "/tubercluosis",
    img: MedicationImg,
    title: "Tubercluosis Training",
    permissionKey: "tc",
  },
];

export const IntakeArr = [
  {
    img: InitialImg,
    title: "Initial Assessment",
    link: "/initial-assessment-list",
    permissionKey: "iass",
  },
  {
    img: NurseImg,
    title: "Nursing  Assessment",
    link: "/nursing-assessment-list",
    permissionKey: "nass",
  },
  {
    img: MedImg,
    title: "Behavioral Health Treatment Plan",
    link: "/treatment-plan-list",
    permissionKey: "tp",
  },
  {
    img: FaceSheetImg,
    title: "Face Sheet",
    link: "/faceSheet-list",
    permissionKey: "fs",
  },
  {
    img: SafetyPlanImg,
    title: "Safety Plan",
    link: "/safety-plan-list",
    permissionKey: "sp",
  },
  {
    img: ResidentIntakeImg,
    title: "Resident Intakes",
    link: "/resident-intake-list",
    permissionKey: "ri",
  },
];

export const IntakeArrAdmin = [
  {
    link: "/mental-status",
    img: VectorImg,
    title: "Mental Status",
  },
  {
    link: "/refusal",
    img: dischargeImg,
    title: "Refusal Of Medical Treatment Form",
  },
  {
    link: "/tracking-log",
    img: NotesImg,
    title: "Appointment Tracking Log",
  },
  {
    img: NotesImg,
    title: "Therapy Progress Notes",
    link: "/therapy-log",
  },
  {
    img: authReleaseInfoImg,
    link: "/list-clinical-oversight",
    title: "Clinical Oversight",
  },
  {
    img: "/Dashboard2/GroupNotes/Group 17546.png",
    title: "Mileage Log",
    link: "/milega-log",
  },
  {
    img: TrainingImg,
    title: "Resident Vitals",
    link: "/vitals",
  },
  {
    img: contactNoteImg,
    title: "Resident Tracking",
    link: "/patient-tracking",
  },
  {
    img: MedicationImg,
    link: "/employee-medication",
    title: "Resident Medication",
  },
  {
    img: marsImg,
    link: "/mars",
    title: "Medication Administration Record",
  },
  {
    img: medicationRecon,
    link: "/reconciliation",
    title: "Medication Reconciliation",
  },
  {
    img: medicationCount,
    link: "/employee/medications/medication-count",
    title: "Medication Count",
  },
  {
    img: informedConsentForm,
    link: "/employee/medications/informed-consent",
    title: "Informed Consent For Medications",
  },
  {
    img: MEDICATIONLOG,
    link: "/employee/medications/prn-form",
    title: "PRN",
  },
];

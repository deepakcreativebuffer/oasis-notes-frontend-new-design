/** @format */

import { TbChartDotsFilled } from "react-icons/tb";

// Admin Main Sidebar MdIocns
import {
  MdOutlineHome,
  MdOutlineGroup,
  MdOutlineTrackChanges,
  MdHistory,
  MdEditCalendar,
  MdOutlineCalendarMonth,
  MdOutlineDescription,
  MdOutlineNoteAlt,
  MdInsertChartOutlined,
  MdModelTraining,
  MdOutlineMedicalServices,
  MdOutlineBusinessCenter,
  MdOutlineInsights,
  MdFormatListBulleted,
  MdMedication,
  MdOutlineBadge,
  MdDownloading,
  MdOutlineEditRoad,
  MdAccessTime,
  MdOutlineAvTimer,
  MdPlaylistAddCheck,
  MdBarChart,
  MdChecklistRtl,
  MdOutlineVerticalSplit,
  MdEdit,
  MdEditNote,
} from "react-icons/md";

export const incidentOptions = [
  {
    label: "Altercation/Verbal",
    value: "Altercation/Verbal",
  },
  {
    label: "Altercation/Physical",
    value: "Altercation/Physical",
  },
  {
    label: "Violent Threat/Self",
    value: "Violent Threat/Self",
  },
  {
    label: "Violent Threat/Others",
    value: "Violent Threat/Others",
  },
  {
    label: "Violent Action/Self",
    value: "Violent Action/Self",
  },
  {
    label: "Violent Action/Others",
    value: "Violent Action/Others",
  },
  {
    label: "Trespassing",
    value: "Trespassing",
  },
  {
    label: "Cut/Abrasion",
    value: "Cut/Abrasion",
  },
  {
    label: "Property Loss",
    value: "Property Loss",
  },
  {
    label: "Property Damage",
    value: "Property Damage",
  },
  {
    label: "Vehicular Accident",
    value: "Vehicular Accident",
  },
  {
    label: "Medical Problem/911",
    value: "Medical Problem/911",
  },
  {
    label: "Employee Injury",
    value: "Employee Injury",
  },
  {
    label: "Client/Consumer Injury",
    value: "Client/Consumer Injury",
  },
  {
    label: "Procedural Break",
    value: "Procedural Break",
  },
  {
    label: "Pharmacy Error",
    value: "Pharmacy Error",
  },
  {
    label: "Weapon",
    value: "Weapon",
  },
  {
    label: "Contraband",
    value: "Contraband",
  },
  {
    label: "Alcohol/Drug Use",
    value: "Alcohol/Drug Use",
  },
  {
    label: "Equipment/Utility Failure",
    value: "Equipment/Utility Failure",
  },
  {
    label: "Bio-hazardous Material",
    value: "Bio-hazardous Material",
  },
  {
    label: "AMA",
    value: "AMA",
  },
  {
    label: "Slip/Fall",
    value: "Slip/Fall",
  },
  {
    label: "Rule Violation",
    value: "Rule Violation",
  },
  {
    label: "Seizure",
    value: "Seizure",
  },
  {
    label: "Medication Errors",
    value: "Medication Errors",
  },
  {
    label: "AWOL",
    value: "AWOL",
  },
  {
    label: "Psychiatric Emergency",
    value: "Psychiatric Emergency",
  },
  {
    label: "Abuse/Neglect",
    value: "Abuse/Neglect",
  },
];

export const levelSeverityOptions = [
  {
    label: "Critical/Immediate Attention Required",
    value: "Critical/Immediate Attention Required",
  },
  {
    label: "Serious/Attention Required",
    value: "Serious/Attention Required",
  },
  {
    label: "No medical Attention Required",
    value: "No medical Attention Required",
  },
];

export const MainSidebar = [
  {
    icon: MdOutlineHome,
    link: "/Home",
    name: "Home",
  },
  {
    icon: MdInsertChartOutlined,
    link: "/employee/patient-chart",
    name: "Resident Chart",
  },
  {
    icon: MdOutlineBadge,
    link: "/employment",
    name: "Employment Information",
  },
  {
    icon: MdChecklistRtl,
    link: "/patient-list",
    name: "Resident List",
  },
];
export const AdminSidebar = [
  {
    icon: MdOutlineHome,
    link: "/dashboard/homepage",
    name: "Home",
  },
  {
    icon: MdOutlineGroup,
    link: "/dashboard/contacts",
    name: "Users",
  },
  {
    icon: MdOutlineTrackChanges,
    link: "/dashboard/tracking",
    name: "Tracking",
  },
  {
    icon: MdHistory,
    link: "/dashboard/logs",
    name: "Logs",
  },
  {
    icon: MdOutlineVerticalSplit,
    link: "/dashboard/activity-log",
    name: "Activity Logs",
  },
  {
    icon: MdEditCalendar,
    link: "/dashboard/staff-schedule",
    name: "Staff Schedule",
  },
  {
    icon: MdEditNote,
    link: "/dashboard/measurable-goal",
    name: "Mesurable Goal",
  },
  {
    icon: MdEdit,
    link: "/dashboard/objective",
    name: "Objective",
  },
  {
    icon: MdOutlineEditRoad,
    link: "/dashboard/interventions",
    name: "Interventions",
  },
  {
    icon: MdOutlineCalendarMonth,
    link: "/dashboard/activity-schedule",
    name: "Activity Schedule",
  },

  {
    icon: MdOutlineNoteAlt,
    link: "/special-notes",
    name: "Special Note",
  },
  {
    icon: MdOutlineGroup,
    link: "/employment-admin",
    name: "Employee",
  },
  {
    icon: MdInsertChartOutlined,
    link: "/employee/patient-chart",
    name: "Resident",
  },
];

export const ResidentSidebar = [
  {
    icon: MdOutlineHome,
    link: "/patient_panel",
    name: "Home",
  },
  {
    icon: MdAccessTime,
    link: "/intake",
    name: "Intake",
  },
  {
    icon: TbChartDotsFilled,
    link: "/progress-chart-resident",
    name: "Progress Chart",
  },
];
export const GuardianSidebar = [
  {
    icon: MdOutlineHome,
    link: "/patient_panel",
    name: "Home",
  },
  {
    icon: MdChecklistRtl,
    link: "/assign-resident-list",
    name: "Resident List",
  },
];

export const Innernav = [
  {
    icon: MdOutlineHome,
    link: "/Home",
    name: "Home",
    permissionKey: "hm",
  },
  {
    icon: MdBarChart,
    link: "/therapy-log",
    name: "Therapy Progress Notes",
    permissionKey: "tn",
  },
  {
    icon: MdPlaylistAddCheck,
    link: "/milega-log",
    name: "Mileage Log",
    permissionKey: "ml",
  },
  {
    icon: MdInsertChartOutlined,
    link: "/employee/patient-chart",
    name: "Resident Chart",
    permissionKey: "rc",
  },
  {
    icon: MdOutlineMedicalServices,
    link: "/vitals",
    name: "Resident Vitals",
    permissionKey: "rv",
  },
  {
    icon: MdOutlineTrackChanges,
    link: "/patient-tracking",
    name: "Resident Tracking",
    permissionKey: "rt",
  },
  {
    icon: MdOutlineDescription,
    link: "/reassessment-list",
    name: "Re-Assessment",
    permissionKey: "reass",
  },
  {
    icon: MdMedication,
    link: "/medications",
    name: "Medications",
    permissionKey: ["em", "mc", "prn", "mr", "mars", "icm"],
  },
];

export const ShiftOptions = [
  {
    label: "7am-3pm",
    value: "7am-3pm",
  },
  {
    label: "3pm-11pm",
    value: "3pm-11pm",
  },
  {
    label: "11pm-7am",
    value: "11pm-7am",
  },
  {
    label: "8am-4pm",
    value: "8am-4pm",
  },
  {
    label: "4pm-12am",
    value: "4pm-12am",
  },
  {
    label: "12am-8am",
    value: "12am-8am",
  },
  {
    label: "7am-7pm",
    value: "7am-7pm",
  },
  {
    label: "7pm-7am",
    value: "7pm-7am",
  },
  {
    label: "8am-8pm",
    value: "8am-8pm",
  },
  {
    label: "8pm-8am",
    value: "8pm-8am",
  },
];

export const authorizeOptions = [
  {
    label: "Mental Health",
    value: "Mental Health",
  },
  {
    label: "Substance abuse",
    value: "Substance abuse",
  },
  {
    label: "Medical information",
    value: "Medical information",
  },
  {
    label: "Pharmacy",
    value: "Pharmacy",
  },
  {
    label: "Current medication",
    value: "Current medication",
  },
  {
    label: "Psychotherapy notes",
    value: "Psychotherapy notes",
  },
  {
    label: "Progress notes",
    value: "Progress notes",
  },
  {
    label: "Immunization records",
    value: "Immunization records",
  },
];

export const shiftOptions = [
  {
    value: "07:00 Am",
    label: "07:00 Am",
  },
  {
    value: "02:00 Pm",
    label: "02:00 Pm",
  },
  {
    value: "08:00 Pm",
    label: "08:00 Pm",
  },
];

export const shiftBeginingOption = [
  {
    label: "7am",
    value: "7am",
  },
  {
    label: "8am",
    value: "8am",
  },
  {
    label: "9am",
    value: "9am",
  },
  {
    label: "10am",
    value: "10am",
  },
  {
    label: "11am",
    value: "11am",
  },
  {
    label: "12pm",
    value: "12pm",
  },
  {
    label: "1pm",
    value: "1pm",
  },
  {
    label: "2pm",
    value: "2pm",
  },
  {
    label: "3pm",
    value: "3pm",
  },
  {
    label: "4pm",
    value: "4pm",
  },
  {
    label: "5pm",
    value: "5pm",
  },
  {
    label: "6pm",
    value: "6pm",
  },
  {
    label: "7pm",
    value: "7pm",
  },
];

export const mentalStatusObj = {
  behaviourAppointmentOptions: [
    "Anxiety",
    "Depression",
    "Crying",
    "Racing thoughts",
    "Other",
  ],
  apperanceOptions: ["Well groomed", "Casually groomed", "Tattered", "Other"],
  OrientationOptions: [
    "Oriented x 3 (to time, place, situation)",
    "Partly oriented",
    "Other",
  ],
  affectOptions: [
    "Normal in range",
    "appropriate to the situation",
    "congruent with mood",
    "Blunted or restricted (little expressed emotion)",
    "flat (no expressed emotion)",
    "labile or very variable",
    "Other",
  ],
  speechOptions: [
    "Fluent. Normal rate",
    "Normal volume",
    "Halting speech",
    "Selective mute",
    "word-finding difficulties",
    "Other",
  ],
  thoughtOptions: [
    "Normal thought content",
    "Fixed ideas",
    "delusions",
    "hallucinations (auditory and/or visual, etc.)",
    "Other",
  ],
  orientationOptions: [
    "Alert",
    "Hypervigilant",
    "Drowsy",
    "lethargic",
    "stuporous",
    "asleep",
    "comatose",
    "confused",
    "fluctuating",
    "Other",
  ],
  memoryOptions: [
    "intact for recent memory",
    "Intact for remote memory",
    "Limited or deficient for recent and/or remote memory",
    "Other",
  ],
  reliabilityOptions: [
    "Good judgement",
    "Fair judgement",
    "Poor judgement",
    "Other",
  ],
  moodOptions: [
    "Normal or euthymic",
    "Sad or dysphoric",
    "hopeless",
    "variable mood",
    "irritable",
    "worried or anxious",
    "expansive or elevated mood",
    "Other",
  ],
};

export const FilesNames = [
  "Shift Progress Note",
  "Discharge",
  "Activities of Daily Living Tracking Form",
  "Financial Transactions Record",
  "ART Meeting",
  "Authorization for Release of Information",
  "Incident Report",
  "Contact Note",
  "Mars",
  "Medication Reconciliation",
  "Medication Count",
  "Informed Consent for Medications",
  "PRN Medication Log",
  "Mental Status",
  "Refusal of Medical Treatment Form",
  "Appointment Tracking Log",
];

export const employeeSidebarNav = [
  {
    icon: MdOutlineHome,
    link: "/Home",
    name: "Home",
    permissionKey: "hm",
  },
  {
    icon: MdOutlineBusinessCenter,
    link: "/basic-information",
    name: "Employment Application ",
    permissionKey: "binf",
  },
  {
    icon: MdOutlineBadge,
    link: "/employment",
    name: "Employment Information",
    permissionKey: "empi",
  },

  {
    icon: MdOutlineDescription,
    link: "/employee/training",
    name: "Training",
    permissionKey: "trai",
  },
  {
    icon: MdAccessTime,
    link: "/get-time-of-request",
    name: "Time Off Request",
    permissionKey: "tr",
  },
  {
    icon: MdOutlineAvTimer,
    link: "/scheduleGroup",
    name: "Time Sheet/Staff Schedule",
    permissionKey: "timesheet",
  },
  {
    icon: MdOutlineInsights,
    link: "/employee-performance",
    name: "Employee Performance",
    permissionKey: "perf",
  },
  {
    icon: MdHistory,
    link: "/employee-tracking",
    name: "Employee Tracking/ Upload",
    permissionKey: "etracking",
  },
];
export const residentSidebarNav = [
  {
    icon: MdOutlineHome,
    link: "/dashboard/homepage",
    name: "Home",
    permissionKey: "hm",
  },
  {
    icon: MdOutlineTrackChanges,
    link: "/dashboard/patient-tracking",
    name: "Resident Tracking",
    permissionKey: "binf",
  },
  {
    icon: MdOutlineDescription,
    link: "/reassessment-list",
    name: "Re-Assessment",
    permissionKey: "reass",
  },
  {
    icon: MdInsertChartOutlined,
    link: "/employee/patient-chart",
    name: "Resident",
    permissionKey: "res",
  },

  {
    icon: MdChecklistRtl,
    link: "/patient-list",
    name: "All Residents",
    permissionKey: "trai",
  },
];

export const adminEmployeeSidebarNav = [
  {
    icon: MdOutlineHome,
    link: "/dashboard/homepage",
    name: "Home",
  },

  {
    icon: MdOutlineNoteAlt,
    link: "/employment",
    name: "Employment Information ",
  },

  {
    icon: MdModelTraining,
    link: "/employee/training",
    name: "Training",
  },

  {
    icon: MdOutlineAvTimer,
    link: "/time-sheet",
    name: "Time Sheet",
  },

  {
    icon: MdOutlineTrackChanges,
    link: "/employee-tracking",
    name: "Employee Tracking/ Upload",
  },
  {
    icon: MdFormatListBulleted,
    link: "/employee-list",
    name: "Employee List",
  },
];

export const mobileSidebarOptions = [
  {
    icon: MdOutlineHome,
    link: "/Home",
    name: "Home",
  },
  {
    icon: MdOutlineInsights,
    link: "/employee/patient-chart",
    name: "Patient chart",
  },
  {
    icon: MdOutlineBadge,
    link: "/employment",
    name: "Employment Information",
  },
  {
    icon: MdFormatListBulleted,
    link: "/patient-list",
    name: "Patient List",
  },
  {
    icon: MdOutlineNoteAlt,
    link: "/group-notes",
    name: "Group Notes",
  },

  {
    icon: MdMedication,
    link: "/vitals",
    name: "Patient Vitals",
  },
  {
    icon: MdOutlineTrackChanges,
    link: "/patient-tracking",
    name: "Resident Tracking",
  },
  {
    icon: MdMedication,
    link: "/medications",
    name: "Medications",
  },
  {
    icon: MdOutlineBusinessCenter,
    link: "/basic-information",
    name: "Employment Application ",
  },
  {
    icon: MdOutlineBadge,
    link: "/employment",
    name: "Employment Information ",
  },
  {
    icon: MdModelTraining,
    link: "/employee/training",
    name: "Training",
  },
  {
    icon: MdHistory,
    link: "/get-time-of-request",
    name: "Time Off Request",
  },
  {
    icon: MdOutlineCalendarMonth,
    link: "/scheduleGroup",
    name: "Time Sheet/Staff Schedule",
  },
  {
    icon: MdDownloading,
    link: "/employee-performance",
    name: "Employee Performance",
  },
  {
    icon: MdOutlineTrackChanges,
    link: "/employee-tracking",
    name: "Employee Tracking/ Upload",
  },
];

export const randomColor = [
  {
    bg: "#7469B6",
    color: "#fff",
  },
  {
    bg: "#AD88C6",
    color: "#fff",
  },
  {
    bg: "#68D2E8",
    color: "#fff",
  },
  {
    bg: "#640D6B",
    color: "#fff",
  },
  {
    bg: "#0A6847",
    color: "#fff",
  },
  {
    bg: "#32012F",
    color: "#fff",
  },
  {
    bg: "#00215E",
    color: "#fff",
  },
  {
    bg: "#153448",
    color: "#fff",
  },
  {
    bg: "#3C5B6F",
    color: "#fff",
  },
  {
    bg: "#4793AF",
    color: "#fff",
  },
  {
    bg: "#1679AB",
    color: "#fff",
  },
  {
    bg: "#C0D6E8",
    color: "#000",
  },
  {
    bg: "#49243E",
    color: "#fff",
  },
  {
    bg: "#453F78",
    color: "#fff",
  },
  {
    bg: "#496989",
    color: "#fff",
  },
];

export const weekDays = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "7" },
];

export const FIXED_SERVICES = [
  "24-Hour Behavioral Health Supervision",
  "Medication Services",
  "Counseling",
  "Meal Preparation",
  "Transportation",
  "Housekeeping",
  "Laundry",
  "Nursing Assessment",
  "Life Skills",
  "Care Coordination of Behavioral and Physical Health needs",
  "Personal Care Services",
];

export const specialNotesListNames = {
  firstAidChecklist: "First Aid Checklist",
  fireEquipementMonitoring: "Fire Equipment Monitoring",
  evacuationAndFireDrill: "Evacuation Drill Report",
  disasterDrill: "Disaster Drill",
  WeeklyVehicleInspectionChecklist: "Weekly Vehicle Inspection",
  MonthlyVehicleInspection: "Monthly Vehicle Inspection",
  vanEmergencyInformationForm: "Van Emergency Information",
  qualityManagement: "Quality Management Data Reports",
  infectiousData: "Infectous Data",
  disasterPlanReview: "Disaster Plan Review",
  RefregiratorTemparatureMonitoring: "Refrigerator Temperature Monitoring",
  "Water Temperature Log": "Water Temperature Log",
};

export const residentRoutePrefixes = [
  "/employee/patient-chart",
  "/dashboard/patient-tracking",
  "/dashboard/patient-vitals",
  "/assign-resident-list",
  "/patient-list",
  "/progree-note",
  "/create-discharge-summary",
  "/discharge-summary",
  "/update-discharge",
  "/view-discharge",
  "/bhp-progress",
  "/create-bhp-progress",
  "/update-bhp-progress",
  "/view-bhp-progress",
  "/asam-assessment",
  "/create-asam-assessment",
  "/update-asam-assessment",
  "/view-asam-assessment",
  "/discharge-planning",
  "/create-discharge-planning",
  "/update-discharge-planning",
  "/view-discharge-planning",
  "/recertification-of-need",
  "/create-recertification-of-need",
  "/update-recertification-of-need",
  "/view-recertification-of-need",
  "/reassessment-list",
  "/create-reassessment",
  "/update-reassessment",
  "/view-reassessment",
  "/DTF",
  "/create-dtf",
  "/update-dtf",
  "/view-dtf",
  "/financial-record",
  "/create-record",
  "/edit-record",
  "/view-record",
  "/staff-note",
  "/create-staff-note",
  "/update-staff-note",
  "/view-staff-note",
  "/incident-report",
  "/update-incident",
  "/create-incident-report",
  "/view-incident-report",
  "/contact-note",
  "/create-contact-note",
  "/update-contact-note",
  "/view-contact-note",
  "/authorization",
  "/create-authorization",
  "/update-authorization",
  "/view-authorization",
  "/mental-status",
  "/refusal",
  "/tracking-log",
  "/initial-assessment",
  "/nursing-assessment",
  "/treatment-plan",
  "/faceSheet",
  "/safety-plan",
  "/resident-intake",
  "/therapy-log",
  "/list-clinical-oversight",
  "/milega-log",
  "/vitals",
  "/employee-medication",
  "/mars",
  "/reconciliation",
  "/employee/medications",
];

export const isResidentRoute = (pathname) => {
  if (!pathname) return false;
  if (/^\/search-list\/[a-z0-9]+$/i.test(pathname)) return true;
  return residentRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
};

export const PRESENTING_PROBLEMS_OPTIONS = [
  { label: "Depression", value: "Depression" },
  { label: "Mood Changes", value: "Mood Changes" },
  {
    label: "Trouble Falling / staying Asleep",
    value: "Trouble Falling / staying Asleep",
  },
  { label: "Mood Swings", value: "Mood Swings" },
  { label: "Social Withdrawals", value: "Social Withdrawals" },
  { label: "Changes in Eating habits", value: "Changes in Eating habits" },
  { label: "Anxiety", value: "Anxiety" },
  { label: "Hallucinations", value: "Hallucinations" },
  { label: "Agitation", value: "Agitation" },
  { label: "Anger Outbursts", value: "Anger Outbursts" },
  { label: "Delusions", value: "Delusions" },
  { label: "Impulsivity", value: "Impulsivity" },
  { label: "Hyperactivity", value: "Hyperactivity" },
  {
    label: "Verbal / Physical aggression",
    value: "Verbal / Physical aggression",
  },
  { label: "ADHD", value: "ADHD" },
  {
    label: "Inability to maintain safety",
    value: "Inability to maintain safety",
  },
  { label: "Autism Spectrum Disorder", value: "Autism Spectrum Disorder" },
  { label: "Bipolar Disorder", value: "Bipolar Disorder" },
  {
    label: "Inability to maintain self care",
    value: "Inability to maintain self care",
  },
  {
    label: "Inability to self administer medication",
    value: "Inability to self administer medication",
  },
  { label: "Conduct Disorder", value: "Conduct Disorder" },
  {
    label: "Inappropriate Sexual Behavior",
    value: "Inappropriate Sexual Behavior",
  },
  { label: "Schizophrenia Disorder", value: "Schizophrenia Disorder" },
  { label: "Major Depressive Disorder", value: "Major Depressive Disorder" },
  { label: "Obsessive Disorder", value: "Obsessive Disorder" },
  { label: "Psychosis", value: "Psychosis" },
  { label: "Irritability", value: "Irritability" },
  { label: "Feelings of anger", value: "Feelings of anger" },
  { label: "Negative thoughts", value: "Negative thoughts" },
  { label: "Confused thinking", value: "Confused thinking" },
  { label: "Loss of interest", value: "Loss of interest" },
  { label: "Fatigue or low energy", value: "Fatigue or low energy" },
  { label: "Difficulty concentrating", value: "Difficulty concentrating" },
  { label: "Substance use", value: "Substance use" },
  { label: "Stress", value: "Stress" },
  { label: "Trouble coping", value: "Trouble coping" },
  { label: "Feelings of fear", value: "Feelings of fear" },
  { label: "Grief/Loss", value: "Grief/Loss" },
  { label: "Eating Disorder", value: "Eating Disorder" },
  { label: "Danger to self", value: "Danger to self" },
  { label: "Danger to others", value: "Danger to others" },
  { label: "Lack of self care", value: "Lack of self care" },
  { label: "Abused", value: "Abused" },
  { label: "Assaulted", value: "Assaulted" },
];

export const DISCHARGE_PLANNING_OPTIONS = [
  "Follow-up Medical appointments upon discharge",
  "Submit application for higher or lower level of care",
  "Continue with case manager for additional support and resources",
  "Continue counseling services after discharge",
  "Follow up with parole/probation officers to ensure compliance",
  "Resident will follow up with Psychiatric provider 7 days after discharge",
  "Resident to follow up with other specialist as scheduled or sooner if necessary",
  "Resident to follow up with Primary Care Provider 7 days after discharge",
  "Case manager will coordinate with the client to ensure access to ongoing outpatient therapy, substance use counseling, and mental health services after discharge (post-discharge)",
  "Resident to continue (weekly, monthly) counseling to support ongoing mental and physical health",
  "If court involvement applies, coordinate with parole/probation officers to ensure compliance",
  "Participation in life skills development (financial literacy, job readiness, conflict resolution)",
  "Encouragement to rebuild family relationships and expand pro-social support systems",
  "Reconnect with culturally grounded identity and long-term wellness goals",
  "Connection with a tribal behavioral health representative or community elder for spiritual guidance",
  "Participation in culturally relevant practices such as talking circles, smudging, or traditional ceremonies when available",
  "Provide all providers contact information for care coordination",
  "Other",
];

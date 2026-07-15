/** @format */

/**
 * Centralized query key factory for TanStack Query.
 *
 * Convention: [domain, scope, ...params]
 *
 * Role isolation is handled by the Organization header in baseApi.js
 * interceptors, so keys don't need role prefixes — the backend returns
 * role-scoped data.
 */
const buildKey = (...parts) => parts.filter((p) => p !== undefined);

export const queryKeys = {
  // ─── Patient ────────────────────────────────────────────────────────
  patient: {
    all: () => buildKey("patient"),
    list: (filters) => buildKey("patient", "list", filters),
    detail: (id) => buildKey("patient", "detail", id),
    tracking: (id) => buildKey("patient", "tracking", id),
    search: (filters) => buildKey("patient", "search", filters),
    assignedResidents: (filters) =>
      buildKey("patient", "assignedResidents", filters),
  },

  // ─── Vitals ─────────────────────────────────────────────────────────
  vitals: {
    all: () => buildKey("vitals"),
    byPatient: (patientId, filters) =>
      buildKey("vitals", "byPatient", patientId, filters),
    detail: (id) => buildKey("vitals", "detail", id),
    byPatientId: (patientId) => buildKey("vitals", "byPatientId", patientId),
    listPatients: () => buildKey("vitals", "patients"),
  },

  // ─── Medication ─────────────────────────────────────────────────────
  medication: {
    all: () => buildKey("medication"),
    list: (type, filters) => buildKey("medication", type, "list", filters),
    opioid: {
      list: (filters) => buildKey("medication", "opioid", "list", filters),
      detail: (id) => buildKey("medication", "opioid", "detail", id),
    },
    informedConsent: {
      list: (filters) =>
        buildKey("medication", "informedConsent", "list", filters),
      detail: (id) => buildKey("medication", "informedConsent", "detail", id),
    },
    reconciliation: {
      list: (filters) =>
        buildKey("medication", "reconciliation", "list", filters),
      detail: (id) => buildKey("medication", "reconciliation", "detail", id),
    },
    mentalStatus: {
      list: (filters) =>
        buildKey("medication", "mentalStatus", "list", filters),
      detail: (id) => buildKey("medication", "mentalStatus", "detail", id),
      byPatient: (pid) =>
        buildKey("medication", "mentalStatus", "byPatient", pid),
    },
    prnLog: {
      list: (filters) => buildKey("medication", "prnLog", "list", filters),
      detail: (id) => buildKey("medication", "prnLog", "detail", id),
    },
    trackingLog: {
      list: (filters) => buildKey("medication", "trackingLog", "list", filters),
      detail: (id) => buildKey("medication", "trackingLog", "detail", id),
    },
    refusal: {
      list: (filters) => buildKey("medication", "refusal", "list", filters),
      detail: (id) => buildKey("medication", "refusal", "detail", id),
      byPatient: (pid) => buildKey("medication", "refusal", "byPatient", pid),
    },
    employee: {
      list: (filters) => buildKey("medication", "employee", "list", filters),
    },
    mars: {
      byPatient: (patientId) =>
        buildKey("medication", "mars", "byPatient", patientId),
      patientMars: () => buildKey("medication", "mars", "patient"),
      activeEmployees: () => buildKey("medication", "mars", "employees"),
    },
  },

  // ─── Intake ─────────────────────────────────────────────────────────
  intake: {
    all: () => buildKey("intake"),
    detail: (id) => buildKey("intake", "detail", id),
    list: (type, filters) => buildKey("intake", type, "list", filters),
  },

  // ─── Patient Chart ──────────────────────────────────────────────────
  patientChart: {
    all: () => buildKey("patientChart"),
    detail: (type, id) => buildKey("patientChart", type, "detail", id),
    list: (type, filters) => {
      if (filters !== undefined) {
        return ["patientChart", type, "list", filters];
      }
      return ["patientChart", type, "list"];
    },
  },

  // ─── Chat ───────────────────────────────────────────────────────────
  chat: {
    groups: () => buildKey("chat", "groups"),
    users: (limit) => buildKey("chat", "users", limit),
    employees: (limit) => buildKey("chat", "employees", limit),
    patients: (limit) => buildKey("chat", "patients", limit),
  },

  // ─── Notifications ─────────────────────────────────────────────────
  notifications: {
    list: (page) => buildKey("notifications", "list", page),
  },

  // ─── Dashboard ──────────────────────────────────────────────────────
  dashboard: {
    all: () => buildKey("dashboard"),
    list: (filters) => buildKey("dashboard", "list", filters),
    activityLog: (filters) => buildKey("dashboard", "activityLog", filters),
    notes: (filters) => buildKey("dashboard", "notes", filters),
    staffSchedule: (filters) => buildKey("dashboard", "staffSchedule", filters),
    activitySchedule: (filters) =>
      buildKey("dashboard", "activitySchedule", filters),
  },

  // ─── Profile ────────────────────────────────────────────────────────
  profile: {
    current: () => buildKey("profile", "current"),
  },

  // ─── Search ─────────────────────────────────────────────────────────
  search: {
    all: () => buildKey("search"),
    list: (filters) => buildKey("search", "list", filters),
    detail: (id) => buildKey("search", "detail", id),
    patient: (id) => buildKey("search", "patient", id),
    documents: (id, filters) => buildKey("search", "documents", id, filters),
    vitals: (id, filters) => buildKey("search", "vitals", id, filters),
    medications: (id, filters) =>
      buildKey("search", "medications", id, filters),
    intake: (id, filters) => buildKey("search", "intake", id, filters),
    appointments: (id, filters) =>
      buildKey("search", "appointments", id, filters),
  },

  // ─── Training ───────────────────────────────────────────────────────
  training: {
    all: () => buildKey("training"),
    list: (filters) => buildKey("training", "list", filters),
    detail: (id) => buildKey("training", "detail", id),
  },

  // ─── Employment ─────────────────────────────────────────────────────
  employment: {
    all: () => buildKey("employment"),
    detail: (id) => buildKey("employment", "detail", id),
  },

  // ─── Therapy Notes ──────────────────────────────────────────────────
  therapyNotes: {
    all: () => buildKey("therapyNotes"),
    list: (typeOrFilters, filters) => {
      if (filters !== undefined) {
        return ["therapyNotes", typeOrFilters, "list", filters];
      }
      if (typeof typeOrFilters === "string") {
        return ["therapyNotes", typeOrFilters, "list"];
      }
      return ["therapyNotes", "list", typeOrFilters];
    },
    detail: (id) => buildKey("therapyNotes", "detail", id),
  },

  // ─── Special Notes ──────────────────────────────────────────────────
  specialNotes: {
    all: () => buildKey("specialNotes"),
    list: (filters) => buildKey("specialNotes", "list", filters),
  },

  // ─── Facility ───────────────────────────────────────────────────────
  facility: {
    all: () => buildKey("facility"),
    list: () => buildKey("facility", "list"),
  },

  // ─── Other Services ─────────────────────────────────────────────────
  treatmentPlan: {
    all: () => buildKey("treatmentPlan"),
    detail: (id) => buildKey("treatmentPlan", id),
    list: (filters) => buildKey("treatmentPlan", "list", filters),
  },
  assistance: {
    all: () => buildKey("assistance"),
    detail: (id) => buildKey("assistance", id),
    list: (filters) => buildKey("assistance", "list", filters),
  },
  timeOff: {
    all: () => buildKey("timeOff"),
    detail: (id) => buildKey("timeOff", id),
    list: (filters) => buildKey("timeOff", "list", filters),
  },
  employeeTracking: {
    all: () => buildKey("employeeTracking"),
    detail: (id) => buildKey("employeeTracking", id),
    list: (filters) => buildKey("employeeTracking", "list", filters),
  },
  adminDashboard: {
    all: () => buildKey("adminDashboard"),
    list: (filters) => buildKey("adminDashboard", "list", filters),
  },
  timesheet: {
    all: () => buildKey("timesheet"),
    detail: (id) => buildKey("timesheet", id),
    list: (filters) => buildKey("timesheet", "list", filters),
  },
  receipts: {
    all: () => buildKey("receipts"),
    detail: (id) => buildKey("receipts", id),
    list: (filters) => buildKey("receipts", "list", filters),
  },
  employee: {
    all: () => buildKey("employee"),
    detail: (id) => buildKey("employee", id),
    list: (filters) => buildKey("employee", "list", filters),
  },
  auth: { all: () => buildKey("auth"), detail: (id) => buildKey("auth", id) },
  clinicalOversight: {
    all: () => buildKey("clinicalOversight"),
    detail: (id) => buildKey("clinicalOversight", id),
    list: (filters) => buildKey("clinicalOversight", "list", filters),
  },
  adminPortal: {
    all: () => buildKey("adminPortal"),
    detail: (id) => buildKey("adminPortal", id),
    list: (filters) => buildKey("adminPortal", "list", filters),
  },
  adminScheduling: {
    all: () => buildKey("adminScheduling"),
    list: (filters) => buildKey("adminScheduling", "list", filters),
  },
  adminAdmitLogs: {
    all: () => buildKey("adminAdmitLogs"),
    list: (filters) => buildKey("adminAdmitLogs", "list", filters),
  },
  adminTracking: {
    all: () => buildKey("adminTracking"),
    list: (filters) => buildKey("adminTracking", "list", filters),
  },
  adminNotesLibrary: {
    all: () => buildKey("adminNotesLibrary"),
    list: (filters) => buildKey("adminNotesLibrary", "list", filters),
  },
  adminData: {
    all: () => buildKey("adminData"),
    list: (filters) => buildKey("adminData", "list", filters),
  },
  resident: {
    all: () => buildKey("resident"),
    detail: (id) => buildKey("resident", id),
    list: (filters) => buildKey("resident", "list", filters),
  },
  employeeShifts: {
    all: () => buildKey("employeeShifts"),
    list: (filters) => buildKey("employeeShifts", "list", filters),
  },

  // ─── Employment Information ─────────────────────────────────────────
  personalInfo: {
    all: () => buildKey("personalInfo"),
    list: (filters) => buildKey("personalInfo", "list", filters),
  },
  offerLetter: {
    all: () => buildKey("offerLetter"),
    list: (filters) => buildKey("offerLetter", "list", filters),
  },
  appendix: {
    all: () => buildKey("appendix"),
    list: (filters) => buildKey("appendix", "list", filters),
  },
  forms2023: {
    all: () => buildKey("forms2023"),
    list: (filters) => buildKey("forms2023", "list", filters),
  },
  lrc1031: {
    all: () => buildKey("lrc1031"),
    list: (filters) => buildKey("lrc1031", "list", filters),
  },
  jobDescription: {
    all: () => buildKey("jobDescription"),
    list: (filters) => buildKey("jobDescription", "list", filters),
  },
  fw4: {
    all: () => buildKey("fw4"),
    list: (filters) => buildKey("fw4", "list", filters),
  },
  fw9: {
    all: () => buildKey("fw9"),
    list: (filters) => buildKey("fw9", "list", filters),
  },
  i9: {
    all: () => buildKey("i9"),
    list: (filters) => buildKey("i9", "list", filters),
  },
  aps: {
    all: () => buildKey("aps"),
    list: (filters) => buildKey("aps", "list", filters),
  },
  terminations: {
    all: () => buildKey("terminations"),
    list: (filters) => buildKey("terminations", "list", filters),
  },
  referenceCheck: {
    all: () => buildKey("referenceCheck"),
    list: (filters) => buildKey("referenceCheck", "list", filters),
  },
  employeePerformance: {
    all: () => buildKey("employeePerformance"),
    list: (filters) => buildKey("employeePerformance", "list", filters),
  },
  onSite: {
    all: () => buildKey("onSite"),
    list: (filters) => buildKey("onSite", "list", filters),
  },
  skills: {
    all: () => buildKey("skills"),
    list: (filters) => buildKey("skills", "list", filters),
  },
  infectionControl: {
    all: () => buildKey("infectionControl"),
    list: (filters) => buildKey("infectionControl", "list", filters),
  },
  assistanceMed: {
    all: () => buildKey("assistanceMed"),
    list: (filters) => buildKey("assistanceMed", "list", filters),
  },
  fallPrevention: {
    all: () => buildKey("fallPrevention"),
    list: (filters) => buildKey("fallPrevention", "list", filters),
  },
  tuberculosis: {
    all: () => buildKey("tuberculosis"),
    list: (filters) => buildKey("tuberculosis", "list", filters),
  },

  authSession: { all: () => buildKey("authSession") },
  upload: { all: () => buildKey("upload") },
};

/** @format */

export const COMMON_APIS = {
  SHIFT_ADD: () => `Shift/add`,
  LIST_FACILITY: "list-facility",
  CHANGE_PASSWORD: "change-password",
  GET_USERS: (val0) => `users?${val0}`,
  GET_EMPLOYEE_PERFORMANCE_REVIEW: (page, limit, debouncedQuery) =>
    `employee-performance-review?page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_TREATMENT_MEASUREABLE: (page, limit, debouncedQuery) =>
    `treatment-measureable?type=INTERVENTIONS&page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_TREATMENT_MEASUREABLE_1: (id) => `treatment-measureable/${id}`,
  GET_TREATMENT_MEASUREABLE_CLONE: (id) => `treatment-measureable/clone/${id}`,
  GET_TREATMENT_MEASUREABLE_2: "treatment-measureable",
  GET_JOB_DESCRIPTION: (page, limit, debouncedQuery) =>
    `job-description?page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_TREATMENT_MEASUREABLE_3: (page, limit, debouncedQuery) =>
    `treatment-measureable?type=MEASURABLES&page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_TREATMENT_MEASUREABLE_4: (page, limit, debouncedQuery) =>
    `treatment-measureable?type=OBJECTIVES&page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_OFFER_LETTER: (page, limit, debouncedQuery) =>
    `offer-letter?page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_REFERENCE_CHECK: (page, limit, debouncedQuery) =>
    `reference-check?page=${page}&limit=${limit}&search=${debouncedQuery}`,
  NEWS_ADDNEWS: () => `News/addNews`,
  NEWS_UPDATENEWS: (val0) => `News/updateNews/${val0}`,
  NEWS_GETNEWS: () => `News/getNews`,
  SUPERADMIN_GETADMIN: () => `superAdmin/getAdmin`,
  GET_NOTIFICATION: (_id) => `notification/${_id}`,
  CHAT_ADD_GROUP: () => `chat/add-group`,
  GET_CHAT_REMOVE_MEMBER: (groupId, id) =>
    `chat/remove-member/${groupId}/${id}`,
  CHAT_UPDATE_GROUP: (id) => `chat/update-group/${id}`,
  GET_BASE_API: (deleteUrl) => `${deleteUrl}`,
  GET_LOGOUT: "logout",
  GET_BASE_API_1: (url, id, _id) => `${url}/${id}/${_id}`,
  GET_ASSISTANCE_WITH_SELF_ADMINISTRATION: (page, limit) =>
    `assistance-with-self-administration?page=${page}&limit=${limit}`,
  GET_ASSISTANCE_WITH_SELF_ADMINISTRATION_1: (val0) =>
    `assistance-with-self-administration/${val0}`,
  GET_ASSISTANCE_WITH_SELF_ADMINISTRATION_2: (val0, page, limit) =>
    `assistance-with-self-administration/${val0}?page=${page}&limit=${limit}`,
  CHAT_LIST_GROUPS: () => `chat/list-groups`,
  CHAT_ADD_CONVERSATION: (id) => `chat/add-conversation/${id}`,
  CHAT_ADD_MESSAGE: (id, type) => `chat/add-message/${id}/?type=${type}`,
  CHAT_GET_CHAT: (id) => `chat/get-chat/${id}?type=GROUP`,
  CHAT_GET_CHAT_1: (id) => `chat/get-chat/${id}?type=CONVERSATION`,
  GET_FORMS_2023: (page, limit) => `forms-2023?page=${page}&limit=${limit}`,
  GET_APS_CONSENT: (page, limit) => `aps-consent?page=${page}&limit=${limit}`,
  GET_FW4: (page, limit) => `FW4?page=${page}&limit=${limit}`,
  GET_FW9: (page, limit) => `fw9?page=${page}&limit=${limit}`,
  GET_I9: (page, limit) => `i9?page=${page}&limit=${limit}`,
  GET_LRC1031A: (page, limit) => `LRC1031A?page=${page}&limit=${limit}`,
  GET_PERSONAL_INFORMATION: (page, limit) =>
    `personal-information?page=${page}&limit=${limit}`,
  GET_APPENDIX: (page, limit) => `appendix?page=${page}&limit=${limit}`,
  GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING: (val0) =>
    `fall-prevention-and-fall-recovery-training/${val0}`,
  GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING_1: (val0, page, limit) =>
    `fall-prevention-and-fall-recovery-training/${val0}?page=${page}&limit=${limit}`,
  GET_FALL_PREVENTION_AND_FALL_RECOVERY_TRAINING_2: (page, limit) =>
    `fall-prevention-and-fall-recovery-training?page=${page}&limit=${limit}`,
  GET_INFECTION_CONTROL_TRAINING: (val0) =>
    `infection-control-training/${val0}`,
  GET_INFECTION_CONTROL_TRAINING_1: (val0, page, limit) =>
    `infection-control-training/${val0}?page=${page}&limit=${limit}`,
  GET_INFECTION_CONTROL_TRAINING_2: (page, limit) =>
    `infection-control-training?page=${page}&limit=${limit}`,
  GET_FACE_SHEET: (page, limit) => `face-sheet?page=${page}&limit=${limit}`,
  DELETE_FACE_SHEET: (id) => `delete-face-sheet/${id}`,
  GET_INITIAL_ASSESSMENTS: (page, limit) =>
    `initial-assessments?page=${page}&limit=${limit}`,
  DELETE_INITIAL_ASSESSMENT: (id) => `delete-initial-assessment/${id}`,
  GET_NURSING_ASSESSMENTS: (page, limit) =>
    `nursing-assessments?page=${page}&limit=${limit}`,
  DELETE_NURSING_ASSESSMENT: (id) => `delete-nursing-assessment/${id}`,
  GET_PATIENT_INTAKE: (id) => `patient-intake/${id}`,
  GET_RESIDENT_INTAKE: (page, limit) =>
    `resident-intake?page=${page}&limit=${limit}`,
  DELETE_RESIDENT_INTAKE: (id) => `delete-resident-intake/${id}`,
  GET_RESIDENT_SAFETY_PLAN: (page, limit) =>
    `resident-safety-plan?page=${page}&limit=${limit}`,
  DELETE_RESIDENT_SAFETY_PLAN: (id) => `delete-resident-safety-plan/${id}`,
  GET_TREATMENT_MEASUREABLE_5: () => `treatment-measureable?view=LIST`,
  GET_TREATMENT_PLAN: (page, limit) =>
    `treatment-plan?page=${page}&limit=${limit}`,
  DELETE_TREATMENT_PLAN: (id) => `delete-treatment-plan/${id}`,
  GET_MEDICATION_OPIOID_COUNT: (page, limit) =>
    `medication-opioid-count?page=${page}&limit=${limit}`,
  GET_MEDICATION_OPIOID_COUNT_1: (id, page, limit) =>
    `medication-opioid-count/${id}?page=${page}&limit=${limit}`,
  GET_INFORMED_CONSENT_FOR_MEDICATION: (page, limit) =>
    `informed-consent-for-medication?page=${page}&limit=${limit}`,
  GET_INFORMED_CONSENT_FOR_MEDICATION_1: (id, page, limit) =>
    `informed-consent-for-medication/${id}?page=${page}&limit=${limit}`,
  GET_INFORMED_CONSENT_FOR_MEDICATION_2: (id) =>
    `informed-consent-for-medication/${id}`,
  GET_PRN_MEDICATION_LOG: (page, limit) =>
    `prn-medication-log?page=${page}&limit=${limit}`,
  GET_PRM_MEDICATION_LOG: (MedId, _id) => `prm-medication-log/${MedId}/${_id}`,
  GET_PRN_MEDICATION_LOG_1: (id, page, limit) =>
    `prn-medication-log/${id}?page=${page}&limit=${limit}`,
  GET_PRN_MEDICATION_LOG_2: (id) => `prn-medication-log/${id}`,
  GET_MENTAL_STATUS_REPORT: (page, limit) =>
    `mental-status-report?page=${page}&limit=${limit}`,
  GET_MEDICATION_RECONCILIATION: (page, limit) =>
    `medication-reconciliation?page=${page}&limit=${limit}`,
  GET_MEDICATION_RECONCILIATION_1: (id, page, limit) =>
    `medication-reconciliation/${id}?page=${page}&limit=${limit}`,
  GET_MEDICATION_RECONCILIATION_2: (id) => `medication-reconciliation/${id}`,
  GET_REFUSAL_MEDICAL_TREATMENT: (page, limit) =>
    `refusal-medical-treatment?page=${page}&limit=${limit}`,
  GET_APPOINTMENT_TRACKING_LOG: (page, limit) =>
    `appointment-tracking-log?page=${page}&limit=${limit}`,
  GET_APPOINTMENT_DETAILS: (id) => `get-appointment-details/${id}`,
  UPDATE_APPOINTMENT: (id) => `update-appointment/${id}`,
  GET_ADL_TRACKING: (page, limit) => `adl-tracking?page=${page}&limit=${limit}`,
  GET_ASAM_ASSESSMENT: (page, limit) =>
    `asam-assessment?page=${page}&limit=${limit}`,
  GET_ASAM_ASSESSMENT_1: (id) => `asam-assessment/${id}`,
  GET_ASAM_ASSESSMENT_PATIENTID: (patientId) =>
    `asam-assessment/patientId/${patientId}`,
  GET_AUTHORIZATION_FOR_RELEASE_OF_INFORMATION: (page, limit) =>
    `authorization-for-release-of-information?page=${page}&limit=${limit}`,
  GET_BHP_PROGRESS: (page, limit) => `bhp-progress?page=${page}&limit=${limit}`,
  GET_BHP_PROGRESS_1: (id) => `bhp-progress/${id}`,
  GET_BHP_PROGRESS_PATIENTID: (patientId) =>
    `bhp-progress/patientId/${patientId}`,
  GET_CONTACT_NOTE: (page, limit) => `contact-note?page=${page}&limit=${limit}`,
  GET_DISCHARGE_SUMMARY: (page, limit) =>
    `discharge-summary?page=${page}&limit=${limit}`,
  GET_DISCHARGE_PLANNING_PATIENTID: (patientId) =>
    `discharge-planning/patientId/${patientId}`,
  GET_DISCHARGE_PLANNING: (page, limit) =>
    `discharge-planning?page=${page}&limit=${limit}`,
  GET_DISCHARGE_PLANNING_1: (id) => `discharge-planning/${id}`,
  GET_FINANCIAL_TRANSACTIONS_RECORD: (id) =>
    `financial-transactions-record/${id}`,
  GET_FINANCIAL_TRANSACTIONS_RECORD_1: (id, page, limit) =>
    `financial-transactions-record/${id}?page=${page}&limit=${limit}`,
  GET_FINANCIAL_TRANSACTIONS_RECORD_2: (page, limit) =>
    `financial-transactions-record?page=${page}&limit=${limit}`,
  GET_PROGRESS_NOTE: (page, limit) =>
    `progress-note?page=${page}&limit=${limit}`,
  GET_RECERTIFICATION_OF_NEED_PATIENTID: (patientId) =>
    `recertification-of-need/patientId/${patientId}`,
  GET_RECERTIFICATION_OF_NEED: (page, limit) =>
    `recertification-of-need?page=${page}&limit=${limit}`,
  GET_RECERTIFICATION_OF_NEED_1: (docId) => `recertification-of-need/${docId}`,
  GET_STAFFING_NOTE: (page, limit) =>
    `staffing-note?page=${page}&limit=${limit}`,
  GET_ASSIGNED_RESIDENTS: (val0) => `get-assigned-residents?${val0}`,
  GET_STRIPE_SUBSCRIPTION_CHANGE_STATUS_REQUEST: () =>
    `stripe/subscription/change-status-request`,
  GET_STRIPE_SUBSCRIPTION_CONFIRM_STATUS: () =>
    `stripe/subscription/confirm-status`,
  PRICING_GETPRICING: () => `Pricing/getPricing`,
  GET_STRIPE_SUBSCRIPTION_CHANGE_PLAN_REQUEST: (selectedPlan) =>
    `stripe/subscription/change-plan-request?tier=${selectedPlan}`,
  GET_STRIPE_SUBSCRIPTION_CONFIRM_PLAN: () =>
    `stripe/subscription/confirm-plan`,
  GET_STRIPE_INVOICE: () => `stripe/invoice`,
  GET_STRIPE_PAYMENT_METHOD: () => `stripe/payment-method`,
  GETDOCUMENTOFPATIENT: (id) => `getDocumentOfPatient/${id}`,
  GETMEDICATIONOFPATIENT: (id) => `getMedicationOfPatient/${id}`,
  GETINTAKEOFPATIENT: (id) => `getIntakeOfPatient/${id}`,
  GET_APPOINTMENTS: (id, scheduleLimit, schedulePage) =>
    `appointments/${id}?limit=${scheduleLimit}&page=${schedulePage}`,
  GET_BASE_API_2: (val0, val1 = "") => `${val0}/${val1}`,
  GET_NOTES: (page, limit, debouncedQuery) =>
    `notes?page=${page}&limit=${limit}&search=${debouncedQuery}`,
  GET_TEMPERATURE_LOG: () => `temperature-log`,
  GET_TEMPERATURE_LOG_1: (val0) => `temperature-log/${val0}`,
  GET_THERAPY_SESSION: (page, limit) =>
    `therapy-session?page=${page}&limit=${limit}`,
  GET_TIME_OFF_REQUEST: (page, limit) =>
    `time-off-request?page=${page}&limit=${limit}`,
  SHIFT_GETALL: (val0) => `Shift/getAll/${val0}`,
  STAFFSCHEDULE_GETSTAFFSCHEDULEBYEMPLOYEEID: (
    employeeId,
    year,
    month,
    facilityId,
  ) =>
    `StaffSchedule/getStaffScheduleByEmployeeId?employeeId=${employeeId}&year=${year}&month=${month}&facility_id=${facilityId}`,
  GET_VITAL_BY_ID: (id) => `vitals/${id}`,
  GET_ONSITE_FACILITY: (val0) => `onsite-facility/${val0}`,
  GET_ONSITE_FACILITY_1: (val0, page, limit) =>
    `onsite-facility/${val0}?page=${page}&limit=${limit}`,
  GET_ONSITE_FACILITY_2: (page, limit) =>
    `onsite-facility?page=${page}&limit=${limit}`,
  GET_SKILL_AND_KNOWLEDGE: (page, limit) =>
    `skill-and-knowledge?page=${page}&limit=${limit}`,
  GET_TUBERCULOSIS_TRAINING: (val0) => `tuberculosis-training/${val0}`,
  GET_TUBERCULOSIS_TRAINING_1: (val0, page, limit) =>
    `tuberculosis-training/${val0}?page=${page}&limit=${limit}`,
  GET_TUBERCULOSIS_TRAINING_2: (page, limit) =>
    `tuberculosis-training?page=${page}&limit=${limit}`,
  GET_USER_DOCUMENTS: "user-documents",

  // Merged from old Apis.js
  TEMPERATURE_LOG: "temperature-log",
  GET_REFRESH_TOKEN: "refresh-token",
  /** POST body: { organizationId } — replace path when backend confirms URL */
  SET_ACTIVE_ORG: "setActiveOrg",
  START_PDF_JOB: "start-pdf-job",
  SHIFT_DELETE: (id) => `Shift/delete/${id}`,
  DELETE_USER_DOCUMENT: (id) => `delete-user-document/${id}`,
};

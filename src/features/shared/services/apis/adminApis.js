/** @format */

export const ADMIN_APIS = {
  ADMIN_ADDSTAFFSCHEDULEADMINISTRATOR: () =>
    `admin/addStaffScheduleAdministrator`,
  ADMIN_EDIT_SHIFT: (val0) => `admin/edit-shift/${val0}`,
  ADMIN_GETPROFILE: () => `Admin/getProfile`,
  ADMIN_UPDATEPROFILE: () => `admin/updateProfile`,
  ADMIN_UPDATE_PATIENT_VITALS: (id) => `admin/updatePatientVitals/${id}`,
  ADMIN_EDIT_CLINICAL_OVERSIGHT: (id) => `admin/editClinicalOversight/${id}`,
  ADMIN_UPDATE_FW4: (id) => `admin/fw4/${id}`,
  ADMIN_UPDATE_FW9: (id) => `admin/fw9/${id}`,
  ADMIN_UPDATE_I9: (id) => `admin/i9/${id}`,
  ADMIN_UPDATE_LRC1031: (id) => `admin/lrc1031A/${id}`,
  ADMIN_UPDATE_FORMS2023: (id) => `admin/forms2023/${id}`,
  ADMIN_UPDATE_REFILL_COUNT: (marsId) => `admin/update-refill-count/${marsId}`,
  ADMIN_ADD_CLINICAL_OVERSIGHT: "admin/addClinicalOversight",
  ADMIN_CREATE_PROGRESS_NOTE: "admin/createProgressNote",
  ADMIN_UPDATE_SHIFT: (employeeId) => `admin/update-shift/${employeeId}`,
  ADMIN_CREATE_FORMS2023: (employeeId) => `admin/createForms2023/${employeeId}`,
  ADMIN_ADD_FIRST_AID_CHECKLIST: "admin/addFirstAidChecklist",
  ADMIN_ADD_REFRIGERATOR_MONITORING:
    "admin/addRefregiratorTemparatureMonitoring",
  ADMIN_ADD_EVACUATION_AND_FIRE_DRILL: "admin/addEvacuationAndFireDrill",
  ADMIN_ADD_DISASTER_DRILL: "admin/addDisasterDrill",
  ADMIN_ADD_FIRE_EQUIPMENT_MONITORING: "admin/addFireEquipementMonitoring",
  ADMIN_ADD_VAN_EMERGENCY: "admin/addVanEmergencyInformationForm",
  ADMIN_ADD_INFECTIOUS_DATA: "admin/addInfectiousData",
  ADMIN_ADD_DISASTER_PLAN_REVIEW: "admin/addDisasterPlanReview",
  ADMIN_ADD_QUALITY_MANAGEMENT: "admin/addQualityManagement",
  ADMIN_ADD_MONTHLY_VEHICLE_INSPECTION: "admin/addMonthlyVehicleInspection",
  ADMIN_GETUSER: (val0) => `admin/getUser?permission=${val0}`,
  ADMIN_ADD_CREATE_PERMISSION: () => `admin/add-create-permission`,
  ADMIN_REMOVE_CREATE_PERMISSION: (val0) =>
    `admin/remove-create-permission/${val0}?permission=`,
  ADMIN_GETUSER_1: "admin/getUser?isActive=true",
  GET_ADMIN_ACTIVITY_LOGS_FORM_TYPE: "admin/activity-logs/form-type",
  GET_ADMIN_ACTIVITY_LOGS: (queryParams) =>
    `admin/activity-logs?${queryParams}`,
  ADMIN_GETALLEMPLOYEEINFOALLFORMS: (id) =>
    `admin/getAllEmployeeInfoAllForms/${id}`,
  ADMIN_VIEW_ALL_EMPLOYEE_FORMS: (employeId) =>
    `admin/view-all-employee-forms/${employeId}`,
  ADMIN_LISTEMPLOYEES: (limit, page, query) =>
    `admin/listEmployees?isActive=true&limit=${limit}&page=${page}&searchQuery=${query}`,
  ADMIN_DELETEEMPLOYEEPERFORMANCEREVIEW: (id) =>
    `admin/deleteEmployeePerformanceReview/${id}`,
  ADMIN_CREATEEMPLOYEEPERFORMANCEREVIEW: () =>
    `admin/createEmployeePerformanceReview`,
  GET_ADMIN_TERMINATION: (employeeId) => `admin/termination/${employeeId}`,
  ADMIN_LIST_TERMINATIONS: (page, limit) =>
    `admin/list-terminations?page=${page}&limit=${limit}`,
  ADMIN_DELETEJOBDESCRIPTION: (id) => `admin/deleteJobDescription/${id}`,
  ADMIN_DELETEADMITDETAILS: (id) => `admin/deleteAdmitDetails/${id}`,
  ADMIN_DELETEBHRFTHERAPYTOPIC: (id) => `admin/deleteBhrfTherapyTopic/${id}`,
  ADMIN_DELETEOFFERLETTER: (id) => `admin/deleteOfferLetter/${id}`,
  ADMIN_GETALLPATIENTTRACKING: (page, limit, debouncedQuery) =>
    `admin/getAllPatientTracking?page=${page}&limit=${limit}&searchQuery=${debouncedQuery}`,
  ADMIN_DELETEADMINTRACKING: (id) => `admin/deleteAdminTracking/${id}`,
  ADMIN_GETDASHBOARDINFO: () => `admin/getDashboardInfo`,
  ADMIN_GETUSERFORCHAT: (limit) =>
    `admin/getUserForChat?userType=Employee&limit=${limit}&type=Group`,
  ADMIN_LISTEMPLOYEES_1: (limit, search) =>
    `admin/listEmployees?limit=${limit}&searchQuery=${search}`,
  ADMIN_GETASSISTANCEWITHSELFADMINISTRATIONBYID: (val0) =>
    `admin/getAssistanceWithSelfAdministrationById/${val0}`,
  ADMIN_GETUSERFORCHAT_1: (limit) =>
    `admin/getUserForChat?userType=Employee&limit=${limit}`,
  ADMIN_GETUSERFORCHAT_2: (patientLimit) =>
    `admin/getUserForChat?userType=Patient&limit=${patientLimit}`,
  ADMIN_GETUSERFORCHAT_3: (guardianLimit) =>
    `admin/getUserForChat?userType=Guardian&limit=${guardianLimit}`,
  ADMIN_GETNOTESBYID: (id) => `admin/getNotesById/${id}`,
  ADMIN_ADD_EMPLOYEE_TRACKING: (employeeId) =>
    `admin/add-employee-tracking/${employeeId}`,
  ADMIN_DELETE_EMPLOYEE_TRACKING: (id) =>
    `admin/delete-employee-tracking/${id}`,
  GET_ADMIN_EMPLOYEE_SKILL_AND_QUALIFICATION: (employeId) =>
    `admin/employee-skill-and-qualification/${employeId}`,
  GET_ADMIN_EMPLOYEE_OTHER_INFO: (employeId) =>
    `admin/employee-other-info/${employeId}`,
  ADMIN_DELETEAPPENDIX: (id) => `admin/deleteAppendix/${id}`,
  ADMIN_GETFALLPREVENTIONANDFALLRECOVERYTRAININGBYID: (val0) =>
    `admin/getFallPreventionAndFallRecoveryTrainingById/${val0}`,
  ADMIN_DELETEINFECTIONCONTROLTRAINING: (id) =>
    `admin/deleteInfectionControlTraining/${id}`,
  ADMIN_GET_INFECTION_CONTROL_TRAINING_BY_ID: (id) =>
    `admin/getInfectionControlTrainingById/${id}`,
  GET_ADMIN_FORWARD_MEDICATION_EMPLOYEE: (marsId) =>
    `admin/forward-medication-employee/${marsId}`,
  ADMIN_GET_ALL_ADL_TRACKING_FORM: (patientId) =>
    `admin/get-all-adl-tracking-form?patientId=${patientId}`,
  ADMIN_GET_ALL_AUTHORIZATION_FOR_RELEASE_OF_INFORMATION: (patientId) =>
    `admin/get-all-authorization-for-release-of-information?patientId=${patientId}`,
  ADMIN_GET_ALL_CONTACT_NOTE: (patientId) =>
    `admin/get-all-contact-note?patientId=${patientId}`,
  ADMIN_GET_ALL_DISCHARGE_SUMMARY: (patientId) =>
    `admin/get-all-discharge-summary?patientId=${patientId}`,
  ADMIN_GET_ALL_INCIDENT_REPORT: (patientId) =>
    `admin/get-all-incident-report?patientId=${patientId}`,
  ADMIN_GET_ALL_STAFFING_NOTE: (patientId) =>
    `admin/get-all-staffing-note?patientId=${patientId}`,
  ADMIN_CREATE_CONTACT_NOTE: "admin/create-contact-note",
  ADMIN_CREATE_AUTHORIZATION_FOR_RELEASE_OF_INFORMATION:
    "admin/create-authorization-for-release-of-information",
  ADMIN_CREATE_ADL_TRACKING_FORM: "admin/create-adl-tracking-form",
  ADMIN_CREATE_STAFFING_NOTE: "admin/create-staffing-note",
  ADMIN_CREATE_INCIDENT_REPORT: "admin/create-incident-report",
  ADMIN_CREATE_FINANCIAL_TRANSECTION_RECORD:
    "admin/create-financial-transection-record",
  ADMIN_CREATE_DISCHARGE_SUMMARY: "admin/createDischargeSummary",
  ADMIN_GET_SUBSCRIPTION_DETAILS: () => `admin/get-subscription-details`,
  ADMIN_DELETE_FACILITY: (id) => `admin/delete-facility/${id}`,
  GET_ADMIN_MILEAGE_LOG: (page, limit) =>
    `admin/mileage-log?page=${page}&limit=${limit}`,
  ADMIN_GET_PATIENT_VITALS: (patientId, forFilter, date) =>
    `admin/get-patient-vitals/${patientId}?for=${forFilter}&date=${date}`,
  ADMIN_GET_PATIENT_VITALS_WEEK: (patientId) =>
    `admin/get-patient-vitals/${patientId}?for=week`,
  ADMIN_CREATE_PATIENT_VITALS: "admin/create-patient-vitals",
  ADMIN_GET_TIMESHEET: (employeeId, startDate, endDate, facilityId) =>
    `admin/getTimeSheet/${employeeId}?stateDate=${startDate}&endDate=${endDate}&facility_id=${facilityId}`,
  ADMIN_GET_TIMESHEET_VIEW: (employeeId, startDate, endDate) =>
    `admin/getTimeSheet/${employeeId}?stateDate=${startDate}&endDate=${endDate}`,
  ADMIN_GET_ALL_MILEAGE_LOG_PREFILL: "admin/get-all-mileage-log",
  ADMIN_CREATE_MILEAGE_LOG: "admin/create-mileage-log",
  ADMIN_CREATE_THERAPY_SESSION: "admin/create-therapy-session",
  ADMIN_LIST_EMPLOYEE_TRACKING: (page, limit) =>
    `admin/list-employee-tracking?page=${page}&limit=${limit}`,
  ADMIN_DELETE_PERSONAL_INFORMATION: (id) =>
    `admin/deletePersonalInformation/${id}`,
  ADMIN_GET_EMPLOYEE_ACTIVE: "admin/get-employee?isActive=true",
  ADMIN_ALL_NOTIFICATION: "admin/allNotification",
  ADMIN_GET_JOB_DESCRIPTION_BY_EMPLOYEE: (employeeId) =>
    `admin/getJobDescriptionById/${employeeId}`,
  ADMIN_GET_EMPLOYEE_TRACKING: (id) => `admin/employee-tracking/${id}`,
  ADMIN_GETTUBERCULOSISTRAININGBYID: (val0) =>
    `admin/getTuberculosisTrainingById/${val0}`,

  // Merged from old Apis.js
  COMPANY_LOGO: "admin/company-logo",
  GET_USER: "admin/getUser",
  DELETE_TRACKING: (id) => `admin/deleteAdminTracking/${id}`,
  GET_TRACKING: "admin/getAdminTracking",
  ADD_TRACKING: "admin/addAdminTracking",
  UPDATE_TRACKING: (id) => `admin/updateAdminTracking/${id}`,
  ADD_ADMIT_DETAILS: "admin/addAdmitDetails",
  UPDATE_ADMIT_DETAILS: (id) => `admin/updateAdmitDetails/${id}`,
  GET_ADMIT_DETAILS: "admin/getAdmitDetails",
  GET_ACTIVITY_SCHEDULE_ADMIN: "admin/getActivityScheduleForAdmin",
  ADD_ACTIVITY_SCHEDULE_ADMIN: "admin/addActivitySchedule",
  ADD_STAFF_SCHEDULE_ADMIN: "admin/addStaffScheduleAdministrator",
  ACTIVITY_SHIFT_GET_ALL: "ActivityScheduleShift/getAll",
  ACTIVITY_SHIFT_DELETE: (id) => `ActivityScheduleShift/delete/${id}`,
  ACTIVITY_SHIFT_ADD: "ActivityScheduleShift/add",
  STAFF_SCHEDULE_ADMIN_GET: "admin/getStaffScheduleAdministratorForAdmin",
  STAFF_SCHEDULE_GET: "StaffSchedule/getStaffScheduleForAdmins",
  STAFF_SCHEDULE_ADD: "StaffSchedule/add",
  STAFF_SCHEDULE_BY_EMPLOYEE: "StaffSchedule/getStaffScheduleByEmployeeId",
  GET_ALL_BHRF_TOPICS: "admin/getAllBhrfTherapyTopic",
  DELETE_BHRF_TOPIC: (id) => `admin/deleteBhrfTherapyTopic/${id}`,
  CLONE_BHRF_TOPIC: (id) => `admin/cloneBhrfTherapyTopic/${id}`,
  ADD_BHRF_THERAPY_SUPER: "superAdmin/addBhrfTherapy",
  ADD_BHRF_TOPIC: "admin/addBhrfTherapyTopic",
  EDIT_BHRF_TOPIC: (id) => `admin/editBhrfTherapyTopic/${id}`,
  GET_USER_BY_ID: (id) => `admin/getUserById/${id}`,
  UPDATE_USER_STATUS: (id) => `admin/update-user-status/${id}`,
  UPDATE_USER: (id) => `admin/updateUser/${id}`,
  CREATE_USER: "admin/createUser",
  ASSIGN_PATIENT_TO_GUARDIAN: (id) => `admin/assign-patient-to-guardian/${id}`,
  ASSIGN_EMPLOYEES_TO_PATIENT: (id) =>
    `admin/assign-employees-to-patient/${id}`,
  REMOVE_EMPLOYEE_FROM_PATIENT: (patientId, employeeId) =>
    `admin/remove-employees-from-patient/${patientId}/${employeeId}`,
  DELETE_MEDICATION_EMPLOYEE: (id) => `admin/deleteMedicationEmployee/${id}`,
  GET_ALL_MEDICATION_EMPLOYEE: "admin/getAllMedicationEmployee",
  ADD_MEDICATION_EMPLOYEE: "admin/addMedicationEmployee",
  GET_MEDICATION_EMPLOYEE_BY_ID: (id) =>
    `admin/getMedicationEmployeeById/${id}`,
  UPDATE_MEDICATION_EMPLOYEE: (id) => `admin/updateMedicationEmployee/${id}`,
  GET_ALL_JOB_DESCRIPTIONS: "superadmin/getAllJobDescription",
  ADD_JOB_DESCRIPTION: "admin/addJobDescription",
  GET_ADMIN_PROFILE: "Admin/getProfile",
  SEND_NOTIFICATION: "admin/sendNotification",
  GET_ALL_NOTIFICATIONS: "admin/allNotification",
  CREATE_REFERENCE_CHECK: "admin/createReferenceCheck",
  EDIT_REFERENCE_CHECK: (id) => `admin/editReferenceCheckById/${id}`,
  GET_ALL_TIME_OFF_REQUESTS_FOR_ADMIN: "admin/getAllTimeOffRequestForAdmin",
  DELETE_TIME_OFF_REQUEST: (id) => `employee/deleteTimeOffRequest/${id}`,
  UPDATE_TIME_OFF_REQUEST_STATUS: (id) =>
    `admin/updateTimeOffRequestStatus/${id}`,
  CREATE_EMPLOYEE_PERFORMANCE_REVIEW: "admin/createEmployeePerformanceReview",
  UPDATE_DUE_DATE_PATIENT_TRACKING: (id) =>
    `admin/updateDueDateInPatientTracking/${id}`,
  ADD_TASK: "admin/addTask",
  GET_TASK: "admin/getTask",
  DELETE_TASK: (id) => `admin/deleteTask/${id}`,
  MARK_AS_DONE_TASK: (id) => `admin/markAsDoneTask/${id}`,
  GET_SUPERADMIN_NOTIFICATION: "admin/get-superadmin-notification",
  GET_EMPLOYEE: "admin/get-employee",
  GET_OFFER_LETTER_BY_EMPLOYEE_ID: (id) =>
    `admin/getOfferLetterByEmployeeId/${id}`,
  ADD_OFFER_LETTER: "admin/addOfferLetter",
  SET_PAY_PERIOD: "admin/set-pay-period",
  SET_PASSWORD: "admin/set-password",
  GET_ADMIN_EMPLOYEE_APPLICATION: (employeId) =>
    `admin/employee-application/${employeId}`,
  GET_ADMIN_EMPLOYEE_EDUCATION: (employeId) =>
    `admin/employee-education/${employeId}`,
  GET_ADMIN_EMPLOYEE_HISTORY: (employeId) =>
    `admin/employee-history/${employeId}`,
  GET_ADMIN_MEDICATION_DISABLE_TIMESTATUS: (medicationId) =>
    `admin/medication/disable-timestatus/${medicationId}`,
  ADMIN_MEDICATION_DELETE_TIMESTATUS: (medicationId) =>
    `admin/medication/delete-timestatus/${medicationId}`,
  GET_ADMIN_MARS_MEDICATION: (medId) => `admin/mars-medication/${medId}`,
  ADMIN_MEDICATION_ADD_MARS_MEDICATION: (marsId) =>
    `admin/medication/add-mars-medication/${marsId}`,
  ADMIN_MEDICATION_ADD_TIMESTATUS: (_id) =>
    `admin/medication/add-timestatus/${_id}`,
  GET_ADMIN_RESIDENTS: "admin/residents",
  ADMIN_CREATE_FW4: (employeeId) => `admin/createFW4/${employeeId}`,
  ADMIN_CREATE_FW9: (employeeId) => `admin/createFw9/${employeeId}`,
  ADMIN_CREATE_I9: (employeeId) => `admin/createI9/${employeeId}`,
  ADMIN_CREATE_LRC1031: (employeeId) => `admin/createLrc1031A/${employeeId}`,
  ADMIN_CREATE_PERSONAL_INFO: (employeeId) =>
    `admin/createPersonalInformation/${employeeId}`,
  ADMIN_CREATE_INFORMED_CONSENT: "admin/createInformedConsentForMedication",
  ADMIN_CREATE_PRN_LOG: "admin/createPrnMedicationLog",
  ADMIN_CREATE_MEDICATION_RECONCILIATION:
    "admin/createMedicationReconciliation",
  ADMIN_CREATE_PATIENT_TRACKING: "admin/create-patient-tracking",
  ADMIN_ONSITE_FACILITY: (employeeId) => `admin/on-site-facility/${employeeId}`,
  ADMIN_SKILL_AND_KNOWLEDGE: (employeeId) =>
    `admin/skill-and-knowledge/${employeeId}`,
  ADMIN_ADD_FACILITY: "admin/add-facility",
  FORWARD_STAFF_SCHEDULE: "forward-staff-schedule",
  FORWARD_ACTIVITY_SCHEDULE: "forward-activity-schedule",
};

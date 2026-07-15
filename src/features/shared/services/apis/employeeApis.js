/** @format */

export const EMPLOYEE_APIS = {
  EMPLOYEE_GETPATIENTBYID: (id) => `employee/getPatientById/${id}`,
  EMPLOYEE_DELETEREFERENCECHECK: (id) => `employee/deleteReferenceCheck/${id}`,
  EMPLOYEE_GETEMPLOYEE: () => `employee/getEmployee`,
  EMPLOYEE_GETPATIENT: (query) =>
    `employee/getPatient?limit=100&page=1&searchQuery=${query}`,
  GET_EMPLOYEE_ALLNOTIFICATION: () => `employee/allNotification`,
  EMPLOYEE_CREATEUPLOADDOCUMENTFOREMPLOYEE: () =>
    `employee/createUploadDocumentForEmployee`,
  EMPLOYEE_DELETEASSISTANCEWITHSELFADMINISTRATION: (id) =>
    `employee/deleteAssistanceWithSelfAdministration/${id}`,
  EMPLOYEE_ADDASSISTANCEWITHSELFADMINISTRATION:
    "employee/addAssistanceWithSelfAdministration",
  EMPLOYEE_DELETENOTES: (id) => `employee/deleteNotes/${id}`,
  GET_EMPLOYEE_DASHBOARD: "employee/dashboard",
  EMPLOYEE_UPDATEEMPLOYEEPERFORMANCEREVIEW: (id) =>
    `employee/updateEmployeePerformanceReview/${id}`,
  EMPLOYEE_ADD_EMPLOYEE_TRACKING: "employee/add-employee-tracking",
  EMPLOYEE_CREATEEMPLOYEETRACKING: "employee/createEmployeeTracking",
  EMPLOYEE_DELETE_EMPLOYEE_TRACKING: (id) =>
    `employee/delete-employee-tracking/${id}`,
  EMPLOYEE_ADDEMPLOYEESKILLANDQUALIFICATION:
    "employee/addEmployeeSkillAndQualification",
  EMPLOYEE_ADDEMPLOYEEOTHERINFO: () => `employee/addEmployeeOtherInfo`,
  EMPLOYEE_DELETEFORMS2023BYID: (id) => `employee/deleteForms2023ById/${id}`,
  EMPLOYEE_CREATE_APPENDIX_TB_SCREENING_ASSESSMENT:
    "employee/create-appendix-tb-screening-assessment",
  EMPLOYEE_GETAPPENDIXTBSCREENINGASSESSMENT:
    "employee/getAppendixTBScreeningAssessment",
  EMPLOYEE_GETEMPLOYEE_1: () => `employee/getEmployee?limit=100`,
  EMPLOYEE_GETAPPENDIXTBSCREENINGASSESSMENTBYID: (id) =>
    `employee/getAppendixTBScreeningAssessmentByID/${id}`,
  EMPLOYEE_EDIT_APPENDIX_TB_SCREENING_ASSESSMENT: (id) =>
    `employee/edit-appendix-tb-screening-assessment/${id}`,
  EMPLOYEE_DELETEAPSCONSENT: (id) => `employee/deleteApsConsent/${id}`,
  EMPLOYEE_CREATEAPSCONSENT: "employee/createApsConsent",
  EMPLOYEE_EDITAPSCONSENTBYID: (val0) => `employee/editApsConsentById/${val0}`,
  EMPLOYEE_DELETEFW4BYID: (id) => `employee/deleteFW4ById/${id}`,
  EMPLOYEE_DELETEFW9BYID: (id) => `employee/deleteFW9ById/${id}`,
  EMPLOYEE_DELETEI9BYID: (id) => `employee/deleteI9ById/${id}`,
  EMPLOYEE_DELETELRC1031ABYID: (id) => `employee/deleteLrc1031AById/${id}`,
  GET_EMPLOYEE_SIGNPERSONALINFO: (id) => `employee/signPersonalInfo/${id}`,
  EMPLOYEE_GETREFERENCECHECKBYID: (id) =>
    `employee/getReferenceCheckById/${id}`,
  GET_EMPLOYEE_SIGNREFERENCECHECKBYID: (id) =>
    `employee/signReferenceCheckById/${id}`,
  EMPLOYEE_ADDFALLPREVENTIONANDFALLRECOVERYTRAINING:
    "employee/addFallPreventionAndFallRecoveryTraining",
  EMPLOYEE_DELETEFALLPREVENTIONANDFALLRECOVERYTRAINING: (id) =>
    `employee/deleteFallPreventionAndFallRecoveryTraining/${id}`,
  EMPLOYEE_ADDINFECTIONCONTROLTRAINING: "employee/addInfectionControlTraining",
  EMPLOYEE_GETFACESHEETBYID: (id) => `employee/getFaceSheetById/${id}`,
  EMPLOYEE_CREATE_FACE_SHEET: (patientId) =>
    `employee/create-face-sheet/${patientId}`,
  EMPLOYEE_EDIT_FACE_SHEET: (id) => `employee/edit-face-sheet/${id}`,
  EMPLOYEE_GETINITIALASSESSMENTBYID: (id) =>
    `employee/getInitialAssessmentById/${id}`,
  EMPLOYEE_GETPROFILE: () => `employee/getProfile`,
  GET_USER: "employee/getUser",
  EMPLOYEE_CREATE_INITAL_ASSESSMENT: (patient_Id) =>
    `employee/create-inital-assessment/${patient_Id}`,
  EMPLOYEE_EDIT_INITAL_ASSESSMENT: (id) =>
    `employee/edit-inital-assessment/${id}`,
  EMPLOYEE_GETNURSINGASSESSMENTBYID: (id) =>
    `employee/getNursingAssessmentById/${id}`,
  EMPLOYEE_CREATE_NURSING_ASSESSMENT: (patientId) =>
    `employee/create-nursing-assessment/${patientId}`,
  EMPLOYEE_EDIT_NURSING_ASSESSMENT: (id) =>
    `employee/edit-nursing-assessment/${id}`,
  EMPLOYEE_CREATE_RESIDENT_INTAKE: (patientId) =>
    `employee/create-resident-intake/${patientId}`,
  EMPLOYEE_EDIT_RESIDENT_INTAKE: (id) => `employee/edit-resident-intake/${id}`,
  EMPLOYEE_GETRESIDENTSAFETYPLANBYID: (id) =>
    `employee/getResidentSafetyPlanById/${id}`,
  EMPLOYEE_CREATE_SAFETY_PLAN: (patientId) =>
    `employee/create-safety-plan/${patientId}`,
  EMPLOYEE_EDIT_SAFETY_PLAN: (id) => `employee/edit-safety-plan/${id}`,
  EMPLOYEE_GETTREATMENTPLANBYID: (id) => `employee/getTreatmentPlanById/${id}`,
  EMPLOYEE_CREATE_TREATMENT_PLAN: (patientId) =>
    `employee/create-treatment-plan/${patientId}`,
  EMPLOYEE_EDIT_TREATMENT_PLAN: (id) => `employee/edit-treatment-plan/${id}`,
  EMPLOYEE_DELETEMEDICATIONOPIOIDCOUNT: (id) =>
    `employee/deleteMedicationOpioidCount/${id}`,
  EMPLOYEE_EDITMEDICATIONOPIOIDCOUNTBYID: (id) =>
    `employee/editMedicationOpioidCountById/${id}`,
  EMPLOYEE_DELETEINFORMEDCONSENTFORMEDICATION: (id) =>
    `employee/deleteInformedConsentForMedication/${id}`,
  EMPLOYEE_GETEMPLOYEE_2: () => `employee/getEmployee?isActive=true`,
  GET_EMPLOYEE_MARS: (patientId) => `employee/Mars/${patientId}`,
  EMPLOYEE_DELETEMEDICATIONEMPLOYEE: (id) =>
    `employee/deleteMedicationEmployee/${id}`,
  EMPLOYEE_DELETEPRNMEDICATIONLOG: (id) =>
    `employee/deletePrnMedicationLog/${id}`,
  EMPLOYEE_DELETEMEDICATIONRECONCILIATION: (id) =>
    `employee/deleteMedicationReconciliation/${id}`,
  EMPLOYEE_DELETEADLTRACKINGFORM: (id) =>
    `employee/deleteADLTrackingForm/${id}`,
  EMPLOYEE_EDITADLTRACKINGFORMBYID: (id) =>
    `employee/editADLTrackingFormById/${id}`,
  EMPLOYEE_DELETEAUTHORIZATIONFORRELEASEOFINFORMATION: (id) =>
    `employee/deleteAuthorizationForReleaseOfInformation/${id}`,
  EMPLOYEE_EDITAUTHORIZATIONFORRELEASEOFINFORMATIONBYID: (val0) =>
    `employee/editAuthorizationForReleaseOfInformationById/${val0}`,
  EMPLOYEE_DELETECONTACTNOTE: (id) => `employee/deleteContactNote/${id}`,
  EMPLOYEE_EDITCONTACTNOTEBYID: (id) => `employee/editContactNoteById/${id}`,
  EMPLOYEE_DELETEDISCHARGESUMMARY: (id) =>
    `employee/deleteDischargeSummary/${id}`,
  EMPLOYEE_EDITDISCHARGESUMMARYBYID: (val0) =>
    `employee/editDischargeSummaryById/${val0}`,
  EMPLOYEE_DELETEFINANCIALTRANSACTIONSRECORD: (id) =>
    `employee/deleteFinancialTransactionsRecord/${id}`,
  EMPLOYEE_GETFINANCIALTRANSACTIONSRECORDBYID: (id) =>
    `employee/getFinancialTransactionsRecordById/${id}`,
  EMPLOYEE_DELETEINCIDENTREPORT: (id) => `employee/deleteIncidentReport/${id}`,
  EMPLOYEE_GETINCIDENTREPORTBYID: (id) =>
    `employee/getIncidentReportById/${id}`,
  EMPLOYEE_EDIT_INCIDENT_REPORT: (id) => `employee/edit-incident-report/${id}`,
  EMPLOYEE_GETPROGRESSNOTEBYID: (id) => `employee/getProgressNoteById/${id}`,
  EMPLOYEE_EDITPROGRESSNOTEBYID: (id) => `employee/editProgressNoteById/${id}`,
  EMPLOYEE_DELETEPROGRESSNOTE: (id) => `employee/deleteProgressNote/${id}`,
  EMPLOYEE_DELETESTAFFINGNOTE: (id) => `employee/deleteStaffingNote/${id}`,
  EMPLOYEE_EDITSTAFFINGNOTEBYID: (val0) =>
    `employee/editStaffingNoteById/${val0}`,
  EMPLOYEE_GETALLRECEIPT: (val0) => `employee/getAllReceipt?${val0}`,
  EMPLOYEE_GETPATIENTVITALSBYPATIENTID: (id, vitalLimit, vitalPage) =>
    `employee/getPatientVitalsByPatientId/${id}?limit=${vitalLimit}&page=${vitalPage}`,
  EMPLOYEE_DELETEPATIENTVITALS: (id) => `employee/deletePatientVitals/${id}`,
  EMPLOYEE_EDITFIRSTAIDCHECKLIST: (val0) =>
    `employee/editFirstAidChecklist/${val0}`,
  EMPLOYEE_UPDATEREFREGIRATORTEMPARATUREMONITORING: (val0) =>
    `employee/updateRefregiratorTemparatureMonitoring/${val0}`,
  EMPLOYEE_EDITEVACUATIONANDFIREDRILL: (val0) =>
    `employee/editEvacuationAndFireDrill/${val0}`,
  EMPLOYEE_EDITDISASTERDRILL: (val0) => `employee/editDisasterDrill/${val0}`,
  EMPLOYEE_EDITFIREEQUIPEMENTMONITORING: (val0) =>
    `employee/editFireEquipementMonitoring/${val0}`,
  EMPLOYEE_EDITWEEKLYVEHICLEINSPECTIONCHECKLIST: (val0) =>
    `employee/editWeeklyVehicleInspectionChecklist/${val0}`,
  EMPLOYEE_ADDWEEKLYVEHICLEINSPECTIONCHECKLIST: () =>
    `employee/addWeeklyVehicleInspectionChecklist`,
  EMPLOYEE_EDITVANEMERGENCYINFORMATIONFORM: (val0) =>
    `employee/editVanEmergencyInformationForm/${val0}`,
  EMPLOYEE_EDITINFECTIOUSDATA: (val0) => `employee/editInfectiousData/${val0}`,
  EMPLOYEE_EDITDISASTERPLANREVIEW: (val0) =>
    `employee/editDisasterPlanReview/${val0}`,
  EMPLOYEE_EDITQUALITYMANAGEMENT: (val0) =>
    `employee/editQualityManagement/${val0}`,
  EMPLOYEE_EDITMONTHLYVEHICLEINSPECTION: (val0) =>
    `employee/editMonthlyVehicleInspection/${val0}`,
  EMPLOYEE_GETALLMILEAGELOG: "employee/getAllMileageLog",
  EMPLOYEE_GETMILEAGELOGBYID: (id) => `employee/getMileageLogById/${id}`,
  EMPLOYEE_CREATEMILEAGELOG: "employee/createMileageLog",
  EMPLOYEE_DELETEMILEAGELOG: (id) => `employee/deleteMileageLog/${id}`,
  EMPLOYEE_UPDATEMILEAGELOG: (id) => `employee/updateMileageLog/${id}`,
  EMPLOYEE_GETTHERAPYSESSIONBYID: (id) =>
    `employee/getTherapySessionById/${id}`,
  EMPLOYEE_CREATETHERAPYSESSION: "employee/createTherapySession",
  EMPLOYEE_UPDATETHERAPYSESSION: (id) => `employee/updateTherapySession/${id}`,
  EMPLOYEE_GETALLBHRFTHERAPYTOPIC: "employee/getAllBhrfTherapyTopic",
  EMPLOYEE_DELETETHERAPYSESSION: (id) => `employee/deleteTherapySession/${id}`,
  EMPLOYEE_LIST_EMPLOYEE_TRACKING: (page, limit) =>
    `employee/list-employee-tracking?page=${page}&limit=${limit}`,
  EMPLOYEE_DELETEPERSONALINFORMATION: "employee/deletePersonalInformation",
  EMPLOYEE_GETTIMEOFFREQUESTBYID: (val0) =>
    `employee/getTimeOffRequestById/${val0}`,
  EMPLOYEE_EDITTIMEOFFREQUESTBYIDS: (val0) =>
    `employee/editTimeOffRequestByIds/${val0}`,
  EMPLOYEE_DELETETIMEOFFREQUEST: (id) => `employee/deleteTimeOffRequest/${id}`,
  EMPLOYEE_CREATETIMESHEET: "employee/createTimeSheet",
  EMPLOYEE_GETTIMESHEETEMPLOYEES: () => `employee/getTimeSheetEmployees`,
  EMPLOYEE_GETEMPLOYEESTIMESHEET: "employee/getEmployeesTimeSheet",
  EMPLOYEE_UPDATESHIFT: "employee/updateshift",
  GET_EMPLOYEE_SIGNEMPLOYEESTIMESHEET: (val0) =>
    `employee/signEmployeesTimesheet/${val0}`,
  EMPLOYEE_DELETEONSITEFACILITY: (id) => `employee/deleteOnSiteFacility/${id}`,
  EMPLOYEE_UPDATESKILLANDKNOWLEDGE: (val0) =>
    `employee/updateSkillAndKnowledge/${val0}`,
  EMPLOYEE_DELETESKILLANDKNOWLEDGE: (id) =>
    `employee/deleteSkillAndKnowledge/${id}`,
  EMPLOYEE_ADDTUBERCULOSISTRAINING: "employee/addTuberculosisTraining",
  EMPLOYEE_DELETETUBERCULOSISTRAINING: (id) =>
    `employee/deleteTuberculosisTraining/${id}`,
  EMPLOYEE_GETPATIENTVITALSBYPATIENTID_1: (id) =>
    `employee/getPatientVitalsByPatientId/${id}`,
  EMPLOYEE_GETPATIENTVITALS_FILTERED: (patientId, forFilter, date) =>
    `employee/getPatientVitalsByPatientId/${patientId}?for=${forFilter}&date=${date}`,
  EMPLOYEE_GETPATIENTVITALS_WEEK: (patientId) =>
    `employee/getPatientVitalsByPatientId/${patientId}?for=week`,
  EMPLOYEE_CREATE_PATIENT_VITALS: "employee/createPatientVitals",
  EMPLOYEE_UPDATE_PATIENT_VITALS: (id) => `employee/updatePatientVitals/${id}`,
  EMPLOYEE_EDIT_CLINICAL_OVERSIGHT: (id) =>
    `employee/editClinicalOversight/${id}`,
  EMPLOYEE_UPDATE_FW4: (id) => `employee/fw4/${id}`,
  EMPLOYEE_UPDATE_FW9: (id) => `employee/fw9/${id}`,
  EMPLOYEE_UPDATE_I9: (id) => `employee/i9/${id}`,
  EMPLOYEE_UPDATE_LRC1031: (id) => `employee/lrc1031A/${id}`,
  EMPLOYEE_UPDATE_FORMS2023: (id) => `employee/forms2023/${id}`,
  EMPLOYEE_UPDATE_MARS: (marsId) => `employee/Mars/${marsId}`,
  EMPLOYEE_ADD_CLINICAL_OVERSIGHT: "employee/addClinicalOversight",
  EMPLOYEE_CREATE_PROGRESS_NOTE: "employee/createProgressNote",
  EMPLOYEE_CREATE_FORMS2023: "employee/createForms2023",
  EMPLOYEE_ADD_FIRST_AID_CHECKLIST: "employee/addFirstAidChecklist",
  EMPLOYEE_ADD_REFRIGERATOR_MONITORING:
    "employee/addRefregiratorTemparatureMonitoring",
  EMPLOYEE_ADD_EVACUATION_AND_FIRE_DRILL: "employee/addEvacuationAndFireDrill",
  EMPLOYEE_ADD_DISASTER_DRILL: "employee/addDisasterDrill",
  EMPLOYEE_ADD_FIRE_EQUIPMENT_MONITORING:
    "employee/addFireEquipementMonitoring",
  EMPLOYEE_ADD_VAN_EMERGENCY: "employee/addVanEmergencyInformationForm",
  EMPLOYEE_ADD_INFECTIOUS_DATA: "employee/addInfectiousData",
  EMPLOYEE_ADD_DISASTER_PLAN_REVIEW: "employee/addDisasterPlanReview",
  EMPLOYEE_ADD_QUALITY_MANAGEMENT: "employee/addQualityManagement",
  EMPLOYEE_ADD_MONTHLY_VEHICLE_INSPECTION:
    "employee/addMonthlyVehicleInspection",
  EMPLOYEE_GET_TIMESHEET: (startDate, endDate, facilityId) =>
    `employee/getTimeSheet?stateDate=${startDate}&endDate=${endDate}&facility_id=${facilityId}`,
  EMPLOYEE_GET_TIMESHEET_BY_EMPLOYEE: (
    employeeId,
    startDate,
    endDate,
    facilityId,
  ) =>
    `employee/getTimeSheet/${employeeId}?stateDate=${startDate}&endDate=${endDate}&facility_id=${facilityId}`,
  EMPLOYEE_GET_TIMESHEET_BY_SIGNER: (signerId) =>
    `employee/getTimeSheetByStaffScheduleSigner/${signerId}`,
  EMPLOYEE_GETPATIENT_1: () => `employee/getPatient`,
  EMPLOYEE_GET_ACTIVE_EMPLOYEES: "employee/getEmployee?isActive=true",
  EMPLOYEE_GET_OFFER_LETTER_BY_EMPLOYEE: (id) =>
    `employee/getOfferLetterByEmployeeId/${id}`,
  EMPLOYEE_GET_JOB_DESCRIPTION: (id) => `employee/getJobDescription/${id}`,
  EMPLOYEE_GET_MY_JOB_DESCRIPTION: "employee/getMyJobDescription",
  EMPLOYEE_VIEW_SKILL_AND_QUALIFICATION:
    "employee/viewEmployeeSkillAndQualification",
  EMPLOYEE_VIEW_SKILL_AND_QUALIFICATION_BY_EMPLOYEE: (employeId) =>
    `employee/viewEmployeeSkillAndQualificationByEmployeeId/${employeId}`,
  EMPLOYEE_VIEW_OTHER_INFO: "employee/viewEmployeeOtherInfo",
  EMPLOYEE_VIEW_OTHER_INFO_BY_EMPLOYEE: (employeId) =>
    `employee/viewEmployeeOtherInfoByEmployeeId/${employeId}`,
  EMPLOYEE_GET_ALL_EMPLOYEE_INFO_ALL_FORMS:
    "employee/getAllEmployeeInfoAllForms",
  EMPLOYEE_ALL_APPLICATION_FORMS: "employee/all-employee-application-forms",
  EMPLOYEE_GET_OFFER_LETTER_BY_ID: (id) => `employee/getOfferLetterById/${id}`,
  EMPLOYEE_GET_TRACKING_BY_EMPLOYEE: (employeeId) =>
    `employee/EmployeeTracking/${employeeId}`,
  EMPLOYEE_GET_MY_TRACKING: (employeeId) =>
    `employee/EmployeeTracking/${employeeId}`,
  EMPLOYEE_GET_EMPLOYEE_TRACKING: (id) => `employee/employee-tracking/${id}`,

  // Merged from old Apis.js
  UPDATE_PROFILE: "employee/updateProfile",
  UPDATE_IMAGE: (id) => `employee/updateImage/${id}`,
  CREATE_UPLOAD_DOCUMENT: (patientId) =>
    `employee/createUploadDocumentOnebyoneByPatientId/${patientId}`,
  DASHBOARD: "employee/dashboard",
  DASHBOARD_STATS: "employee/dashboard/stats",
  GET_PATIENT_LIST: "employee/getPatientList",
  GET_NOTIFICATIONS: "employee/getNotifications",
  MARK_NOTIFICATION_READ: (id) => `employee/markNotificationRead/${id}`,
  GET_ACTIVITY_SCHEDULE: "employee/getActivitySchedule",
  SHIFT_DELETE: (id) => `Shift/delete/${id}`,
  SHIFT_ADD: "Shift/add",
  SHIFT_GET_ALL: (facilityId) =>
    facilityId ? `Shift/getAll/${facilityId}` : `Shift/getAll`,
  EMPLOYEE_GETMARSBYMONTH: (patientId) =>
    `employee/getMarsByMonth/${patientId}`,
  EMPLOYEE_ADDEMPLOYEEAPPLICATION: "employee/addEmployeeApplication",
  EMPLOYEE_ADDEMPLOYEEEDUCATION: "employee/addEmployeeEducation",
  EMPLOYEE_ADDEMPLOYEEHISTORY: "employee/addEmployeeHistory",
  EMPLOYEE_GETMEDICATIONEMPLOYEEBYID: (noteId) =>
    `employee/getMedicationEmployeeById/${noteId}`,
  EMPLOYEE_UPDATEMEDICATIONEMPLOYEE: (val0) =>
    `employee/updateMedicationEmployee/${val0}`,
  EMPLOYEE_UPDATESTATUSININSTRUCTIONINMEDICATIONEMPLOYEE: (noteId, mainId) =>
    `employee/updateStatusInInstructionInMedicationEmployee/${noteId}/${mainId}`,
  EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE:
    "employee/getActivityScheduleForEmployee",
  EMPLOYEE_ADDACTIVITYSCHEDULE: "employee/addActivitySchedule",
  EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE_1: (
    formattedMonth,
    year,
    selectedFacility,
  ) =>
    `employee/getActivityScheduleForEmployee?month=${formattedMonth}&year=${year}&facility_id=${selectedFacility}`,
  GET_EMPLOYEE_NOTES: "employee/notes",
  EMPLOYEE_CREATEUPLOADDOCUMENTONEBYONE: () =>
    `employee/createUploadDocumentOnebyone`,
  EMPLOYEE_CREATE_FW4: "employee/createFW4",
  EMPLOYEE_CREATE_FW9: "employee/createFw9",
  EMPLOYEE_CREATE_I9: "employee/createI9",
  EMPLOYEE_CREATE_LRC1031: "employee/createLrc1031A",
  EMPLOYEE_CREATE_PERSONAL_INFO: "employee/createPersonalInformation",
  EMPLOYEE_SIGN_OFFER_LETTER: (id) => `employee/signOfferLetterById/${id}`,
  EMPLOYEE_UPDATE_JOB_DESCRIPTION: "employee/updateJobDescription",
  EMPLOYEE_CREATE_REFERENCE_CHECK: "employee/createReferenceCheck",
  EMPLOYEE_CREATE_INFORMED_CONSENT:
    "employee/createInformedConsentForMedication",
  EMPLOYEE_CREATE_PRN_LOG: "employee/createPrnMedicationLog",
  EMPLOYEE_CREATE_MEDICATION_RECONCILIATION:
    "employee/createMedicationReconciliation",
  EMPLOYEE_CREATE_OPIOID_COUNT: "employee/createMedicationOpioidCount",
  EMPLOYEE_CREATE_APPOINTMENT: "employee/createAppointment",
  EMPLOYEE_CREATE_PATIENT_TRACKING: "employee/createPatientTracking",
  EMPLOYEE_CREATE_TIMEOFF_REQUEST: "employee/createTimeOffRequest",
  EMPLOYEE_UPDATE_ACTIVE_ORGANIZATION: "employee/updateActiveOrganization",
};

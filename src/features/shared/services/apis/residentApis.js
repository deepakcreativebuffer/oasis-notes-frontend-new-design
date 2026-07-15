/** @format */

export const RESIDENT_APIS = {
  PATIENT_GETFACESHEET: (patientId) => `patient/getFaceSheet/${patientId}`,
  GET_PATIENT_INITIALASSESSMENT: (patient_Id) =>
    `Patient/InitialAssessment/${patient_Id}`,
  PATIENT_GETNURSINGASSESSMENT: (patientId) =>
    `patient/getNursingAssessment/${patientId}`,
  PATIENT_GETEMPLOYEE: "Patient/getEmployee",
  GET_PATIENT_RESIDENTINTAKE: (patientId) =>
    `Patient/ResidentIntake/${patientId}`,
  PATIENT_GETRESIDENTSAFETYPLAN: (patientId) =>
    `patient/getResidentSafetyPlan/${patientId}`,
  PATIENT_GETTREATMENTPLAN: (patientId) =>
    `Patient/getTreatmentPlan/${patientId}`,
  PATIENT_GET_MARS: () => `patient/get-mars`,
  PATIENT_CREATEMENTALSTATUSREPORT: "Patient/createMentalStatusReport",
  PATIENT_GETMENTALSTATUSREPORT: (patientId) =>
    `Patient/getMentalStatusReport?patientId=${patientId}`,
  GET_PATIENT_MENTALSTATUSREPORT: (id) => `Patient/MentalStatusReport/${id}`,
  PATIENT_CREATEREFUSALMEDICALTREATMENT:
    "Patient/createRefusalMedicalTreatment",
  PATIENT_GETREFUSALMEDICALTREATMENT: (patientId) =>
    `Patient/getRefusalMedicalTreatment?patientId=${patientId}`,
  GET_PATIENT_REFUSALMEDICALTREATMENT: (id) =>
    `Patient/RefusalMedicalTreatment/${id}`,
  PATIENT_DELETEAPPOINTMENT: (id) => `Patient/deleteAppointment/${id}`,
  PATIENT_GETPROFILE: () => `Patient/getProfile`,
  PATIENT_GETALLPATIENTMEDICATION: () => `Patient/getAllPatientMedication`,
  PATIENT_CREATEAPPOINTMENT: () => `Patient/createAppointment`,
  PATIENT_GETALLUPCOMINGAPPOINTMENTS: (val0) =>
    `Patient/getAllUpcomingAppointments?date=${val0}`,
  PATIENT_GETALLPASTAPPOINTMENTS: (val0) =>
    `Patient/getAllPastAppointments?date=${val0}`,
  PATIENT_GETALLTODAYAPPOINTMENTS: (formattedDate) =>
    `Patient/getAllTodayAppointments?date=${formattedDate}`,
  GET_PATIENT_CANCELAPPOINTMENT: (id) => `Patient/cancelAppointment/${id}`,
  PATIENT_GETPATIENTDETAILS: (id) => `Patient/getPatientDetails/${id}`,
};

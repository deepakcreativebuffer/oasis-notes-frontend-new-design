/** @format */

// ─── Query Key Factory ────────────────────────────────────────────────
export { queryKeys } from "@/lib/queryKeys";

// ─── Generic Hook Factories ───────────────────────────────────────────
export {
  useServiceQuery,
  useServiceQueryWithSelect,
} from "@/lib/useServiceQuery";
export {
  useServiceMutation,
  useServiceDeleteMutation,
} from "@/lib/useServiceMutation";

// ─── Domain Hooks: Patient ────────────────────────────────────────────
export {
  usePatientDetail,
  useAssignedResidents,
  usePatientTracking,
  usePatientSearch,
  useCreateAppointment,
} from "./patient.queries";

// ─── Domain Hooks: Vitals ─────────────────────────────────────────────
export {
  useVitalsPatients,
  useVitalsByPatient,
  useVitalDetail,
  useVitalsByPatientId,
  useCreateVital,
  useUpdateVital,
} from "./vitals.queries";

// ─── Domain Hooks: Medication ─────────────────────────────────────────
export {
  useOpioidCounts,
  useOpioidCountDetail,
  useCreateOpioidCount,
  useDeleteOpioidCount,
  useMarsByPatient,
  useMarsActiveEmployees,
  useUpdateMarsStatus,
  useInformedConsentList,
  useCreateInformedConsent,
  useMedicationEmployeeList,
  useMentalStatusList,
  useRefusalList,
  useTrackingLogList,
  useReconciliationList,
  usePrnLogList,
} from "./medication.queries";

// ─── Other Domain Hooks ───────────────────────────────────────────────
export * from "./intake.queries";
export * from "./patientChart.queries";
export * from "./dashboard.queries";
export * from "./training.queries";
export * from "./profile.queries";
export * from "./specialNotes.queries";
export * from "./chat.queries";
export * from "./notifications.queries";
export * from "./employment.queries";
export * from "./therapyNotes.queries";
export * from "./facility.queries";
export * from "./adminData.queries";
export * from "./employee.queries";
export * from "./resident.queries";

// ─── Generated Services ───────────────────────────────────────────────
export * from "./treatmentPlan.queries";
export * from "./assistance.queries";
export * from "./timeOff.queries";
export * from "./employeeTracking.queries";
export * from "./adminDashboard.queries";
export * from "./timesheet.queries";
export * from "./receipts.queries";
export {
  useSearchList,
  useSearchDetail,
  useCreateSearch,
  useUpdateSearch,
  useSearchPatient,
  useSearchDocuments,
  useSearchVitals,
  useSearchMedications,
  useSearchIntake,
  useSearchAppointments,
} from "./search.queries";
export * from "./auth.queries";
export * from "./clinicalOversight.queries";
export * from "./adminPortal.queries";
export * from "./adminScheduling.queries";
export * from "./adminAdmitLogs.queries";
export * from "./adminTracking.queries";
export * from "./adminNotesLibrary.queries";
export * from "./employeeShifts.queries";
export * from "./authSession.queries";
export * from "./upload.queries";

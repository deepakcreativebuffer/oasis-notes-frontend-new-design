/** @format */

export * from "@/features/admin/services/admin";
export * from "@/features/resident/services/resident";
export * from "./medication";
export * from "./training";
export * from "./intake";
export * from "./patient";
export * from "./patientChart";
export * from "./assistance";
export * from "./timeOff";
export * from "./therapyNotes";
export * from "./dashboard";
export * from "./facility";
export * from "./employment";
export * from "./employeeTracking";
export * from "@/features/admin/services/adminDashboard";
export * from "./vitals";
export * from "./timesheet";
export * from "./specialNotes";
export * from "./receipts";
export * from "./profile";
export * from "./search";
export * from "@/features/employee/services/employee";
export * from "./chat";
export * from "./auth";
export * from "./clinicalOversight";
export * from "@/features/admin/services/adminPortal";
export * from "./upload";

export { medicationService } from "./medication";
export { trainingService } from "./training";
export { treatmentPlanService, intakeService } from "./intake";
export { patientService } from "./patient";
export { patientChartService } from "./patientChart";
export { assistanceService } from "./assistance";
export { timeOffService } from "./timeOff";
export { therapyNotesService } from "./therapyNotes";
export { dashboardService } from "./dashboard";
export { facilityService } from "./facility";
export { employmentService } from "./employment";
export { employeeTrackingService } from "./employeeTracking";
export { adminDashboardService } from "@/features/admin/services/adminDashboard";
export { vitalsService } from "./vitals";
export { timesheetService } from "./timesheet";
export { specialNotesService } from "./specialNotes";
export { receiptsService } from "./receipts";
export { profileService } from "./profile";
export { searchService } from "./search";
export { employeeService } from "@/features/employee/services/employee";
export { chatService } from "./chat";
export { authService } from "./auth";
export { clinicalOversightService } from "./clinicalOversight";
export { adminPortalService } from "@/features/admin/services/adminPortal";
export { adminSchedulingService } from "@/features/admin/services/admin/scheduling.service";
export { adminAdmitLogsService } from "@/features/admin/services/admin/admitLogs.service";
export { adminTrackingService } from "@/features/admin/services/admin/tracking.service";
export { adminNotesLibraryService } from "@/features/admin/services/admin/notesLibrary.service";
export { adminDataService } from "@/features/admin/services/admin/adminData.service";
export { residentService } from "@/features/resident/services/resident";
export { employeeShiftsService } from "@/features/employee/services/employee/shifts.service";
export { authSessionService } from "./auth/session.service";
export { uploadService } from "./upload";

export {
  getNotifications,
  markNotificationRead,
} from "../common/notifications";

export { getActivitySchedule } from "@/features/employee/services/employee/shifts.service";

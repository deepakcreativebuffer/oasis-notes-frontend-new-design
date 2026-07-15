import { lazyWithRetry } from "../lazyWithRetry";
import { ResidentAssessmentRoute } from "@/features/shared/features/intake/AssessmentFormRoutes";

const InitialAssessmentList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/InitialAssessment/InitialAssessmentList"),
);

const FaceSheetList = lazyWithRetry(
  () => import("@/features/resident/pages/Intake/FaceSheet/FaceSheetList"),
);

const NursingAssessmentList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/NursingAssessment/NursingAssessmentList"),
);

const ResidentIntakeList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/ResidentIntake/ResidentIntakeList"),
);

const TreatmentPlanList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/TreatmentPlan/TreatmentPlanList"),
);

const SafetyPlanList = lazyWithRetry(
  () => import("@/features/resident/pages/Intake/SafetyPlan/SafetyPlanList"),
);

const ViewFaceSheet = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewFaceSheetPage"),
);

const IntakeResident = lazyWithRetry(
  () => import("@/features/resident/components/Intake/Intake"),
);

const InitialAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Intake/InitialAssessment/InitialAssessment"),
);

const ViewInitialAssessment = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewInitialAssessment"),
);

const SafetyPlanResident = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Intake/SafetyPlan/SafetyPlanResidentPage"),
);

const ViewSafetyPlan = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewSafetyPlan"),
);

const NursingAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Intake/NursingAssessment/NursingAssessment"),
);

const ViewNursingAssessment = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewNursingAssessment"),
);

const ResidentIntakes = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Intake/ResidentIntake/ResidentIntakes"),
);

const ViewResidentIntakes = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewResidentIntakes"),
);

const TreatmentplanUpdate = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Intake/TreatmentPlan/TreatmentPlanUpdate"),
);

const ViewTreatmentPlan = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewTreatmentPlan"),
);

const FaceSheetResident = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Intake/FaceSheet/FaceSheetResidentPage"),
);

const ViewAsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/ViewAsamAssessment"),
);

const UpdateAsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/UpdateAsamAssessment"),
);

const AsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/AsamAssessment"),
);

export const IntakeRoutes = [
  { path: "/intake", element: <IntakeResident /> },
  { path: "/initial-assessment", element: <InitialAssessment /> },
  {
    path: "/edit-initial-Assessment-resident/:id",
    element: (
      <ResidentAssessmentRoute>
        <InitialAssessment />
      </ResidentAssessmentRoute>
    ),
  },
  {
    path: "/initial-Assessment-resident-list",
    element: <InitialAssessmentList />,
  },
  {
    path: "/view-initial-assessment-resident/:id",
    element: (
      <ResidentAssessmentRoute>
        <ViewInitialAssessment />
      </ResidentAssessmentRoute>
    ),
  },
  { path: "/create-face-sheet", element: <FaceSheetResident /> },
  { path: "/edit-facesheet-resident/:id", element: <FaceSheetResident /> },
  { path: "/faceSheet-resident-list", element: <FaceSheetList /> },
  { path: "/view-facesheet-resident/:id", element: <ViewFaceSheet /> },
  { path: "/safety-plan", element: <SafetyPlanResident /> },
  { path: "/edit-safetyplan-resident/:id", element: <SafetyPlanResident /> },
  { path: "/safety-plan-resident-list", element: <SafetyPlanList /> },
  { path: "/view-safety-plan-resident/:id", element: <ViewSafetyPlan /> },
  { path: "/nursing-assessment", element: <NursingAssessment /> },
  {
    path: "/edit-nursing-assessment-resident/:id",
    element: <NursingAssessment />,
  },
  {
    path: "/nursing-assessment-resident-list",
    element: <NursingAssessmentList />,
  },
  {
    path: "/view-nursing-assessment-resident/:id",
    element: <ViewNursingAssessment />,
  },
  { path: "/treatment-plan", element: <TreatmentplanUpdate /> },
  {
    path: "/edit-treatmentplan-resident/:id",
    element: <TreatmentplanUpdate />,
  },
  { path: "/treatment-plan-resident-list", element: <TreatmentPlanList /> },
  { path: "/view-treatment-plan-resident/:id", element: <ViewTreatmentPlan /> },
  { path: "/resident-intake", element: <ResidentIntakes /> },
  { path: "/edit-residentintakes-resident/:id", element: <ResidentIntakes /> },
  { path: "/resident-intake-resident-list", element: <ResidentIntakeList /> },
  {
    path: "/view-resident-intake-resident/:id",
    element: <ViewResidentIntakes />,
  },
  { path: "/asam-assessment-resident-list", element: <AsamAssessment /> },
  {
    path: "/update-asam-assessment-resident/:id",
    element: <UpdateAsamAssessment />,
  },
  {
    path: "/view-asam-assessment-resident/:id",
    element: <ViewAsamAssessment />,
  },
];

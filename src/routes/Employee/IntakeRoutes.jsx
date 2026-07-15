import { lazyWithRetry } from "../lazyWithRetry";
import { EmployeeAssessmentRoute } from "@/features/shared/features/intake/AssessmentFormRoutes";

const InitialAssessmentList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/InitialAssessment/InitialAssessmentList"),
);
const FaceSheet = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/FaceSheet/FaceSheetEmployeePage"),
);
const FaceSheetList = lazyWithRetry(
  () => import("@/features/resident/pages/Intake/FaceSheet/FaceSheetList"),
);
const NursingAssessment = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/NursingAssessment/NursingAssessment"),
);
const NursingAssessmentList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/NursingAssessment/NursingAssessmentList"),
);
const ResidentIntake = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/ResidentIntake/ResidentIntake"),
);
const ResidentIntakeList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/ResidentIntake/ResidentIntakeList"),
);
const TreatmentPlan = lazyWithRetry(
  () => import("@/features/employee/pages/Intake/TreatmentPlan/TreatmentPlan"),
);
const TreatmentPlanList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/TreatmentPlan/TreatmentPlanList"),
);
const SafetyPlan = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/SafetyPlan/SafetyPlanEmployeePage"),
);
const SafetyPlanList = lazyWithRetry(
  () => import("@/features/resident/pages/Intake/SafetyPlan/SafetyPlanList"),
);
const Intake = lazyWithRetry(
  () => import("@/features/resident/pages/Intake/Intake"),
);
const InitialAssessment = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Intake/InitialAssessment/InitialAssessment"),
);
const ViewFaceSheet = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewFaceSheetPage"),
);
const ViewInitialAssessment = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewInitialAssessment"),
);
const ViewSafetyPlan = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewSafetyPlan"),
);
const ViewNursingAssessment = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewNursingAssessment"),
);
const ViewResidentIntakes = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewResidentIntakes"),
);
const ViewTreatmentPlan = lazyWithRetry(
  () => import("@/features/shared/features/intake/views/ViewTreatmentPlan"),
);

export const IntakeRoutes = [
  { path: "/edit-face-sheet/:id", element: <FaceSheet /> },
  { path: "/create-face-sheet", element: <FaceSheet /> },
  { path: "/faceSheet-list", element: <FaceSheetList /> },
  { path: "/view-face-sheet/:id", element: <ViewFaceSheet /> },
  { path: "/view-nursing-assessment/:id", element: <ViewNursingAssessment /> },
  { path: "/nursing-assessment", element: <NursingAssessment /> },
  { path: "/nursing-assessment-list", element: <NursingAssessmentList /> },
  { path: "/edit-nursing-assessment/:id", element: <NursingAssessment /> },
  { path: "/view-resident-intake/:id", element: <ViewResidentIntakes /> },
  { path: "/resident-intake", element: <ResidentIntake /> },
  { path: "/resident-intake-list", element: <ResidentIntakeList /> },
  { path: "/edit-resident-intake/:id", element: <ResidentIntake /> },
  { path: "/view-treatment-plan/:id", element: <ViewTreatmentPlan /> },
  { path: "/treatment-plan", element: <TreatmentPlan /> },
  { path: "/treatment-plan-list", element: <TreatmentPlanList /> },
  { path: "/edit-treatment-plan/:id", element: <TreatmentPlan /> },
  { path: "/view-safety-plan/:id", element: <ViewSafetyPlan /> },
  { path: "/safety-plan", element: <SafetyPlan /> },
  { path: "/safety-plan-list", element: <SafetyPlanList /> },
  { path: "/edit-safety-plan/:id", element: <SafetyPlan /> },
  { path: "/intake/:id", element: <Intake /> },
  {
    path: "/view-initial-assessment/:id",
    element: (
      <EmployeeAssessmentRoute>
        <ViewInitialAssessment />
      </EmployeeAssessmentRoute>
    ),
  },
  { path: "/initial-assessment-list", element: <InitialAssessmentList /> },
  {
    path: "/initial-assessment",
    element: (
      <EmployeeAssessmentRoute>
        <InitialAssessment />
      </EmployeeAssessmentRoute>
    ),
  },
  {
    path: "/initial-assessment/:id",
    element: (
      <EmployeeAssessmentRoute>
        <InitialAssessment />
      </EmployeeAssessmentRoute>
    ),
  },
  {
    path: "/edit-initial-assessment/:id",
    element: (
      <EmployeeAssessmentRoute>
        <InitialAssessment />
      </EmployeeAssessmentRoute>
    ),
  },
];

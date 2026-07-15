import { lazyWithRetry } from "../lazyWithRetry";

const CreateRefusal = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Refusal/CreateRefusal"),
);
const Medications = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Medications"),
);
const MedicationCountList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/Count/MedicationCountList"),
);
const InformedConsentList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/InformedConsentList"),
);
const PRNformList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MedicationLog/PRNformList"),
);
const ReconciliationForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/Reconciliation/ReconciliationForm"),
);
const MedicationCountForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/Count/MedicationCountForm"),
);
const InformedConsentForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/InformedConsentForm"),
);
const PrnLogForm = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/MedicationLog/PrnLogForm"),
);
const ViewCount = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Count/ViewCount"),
);
const Mars = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Mars/Mars"),
);
const ReconciliationList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/Reconciliation/ReconciliationList"),
);
const ViewRecociliation = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/Reconciliation/ViewRecociliation"),
);
const ViewPrn = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/MedicationLog/ViewPrn"),
);
const CreateMentalStatus = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MentalStatus/CreateMentalStatus"),
);
const MentalStatus = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MentalStatus/MentalStatus"),
);
const UpdateMentalStatus = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MentalStatus/UpdateMentalStatus"),
);
const ViewMentalStatus = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MentalStatus/ViewMentalStatus"),
);
const Refusal = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Refusal/Refusal"),
);
const UpdateRefusal = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Refusal/UpdateRefusal"),
);
const ViewRefusal = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Refusal/ViewRefusal"),
);
const CreateTrackingLog = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/TrackingLog/CreateTrackingLog"),
);
const TrackingLog = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/TrackingLog/TrackingLog"),
);
const UpdateTracking = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/TrackingLog/UpdateTracking"),
);
const ViewTackingLog = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/TrackingLog/ViewTackingLog"),
);
const CreateAssistanceMed = lazyWithRetry(
  () => import("@/features/admin/pages/AssistanceMed/CreateAssistanceMed"),
);
const AssistanceMed = lazyWithRetry(
  () => import("@/features/admin/pages/AssistanceMed/AssistanceMed"),
);
const ViewAssistanceMed = lazyWithRetry(
  () => import("@/features/admin/pages/AssistanceMed/ViewAssistanceMed"),
);
const EditAssistanceMed = lazyWithRetry(
  () => import("@/features/admin/pages/AssistanceMed/EditAssistanceMed"),
);
const EmployeeMedication = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MedicationEmployee/EmployeeMedication"),
);

export const MedicationRoutes = [
  { path: "/create-refusal", element: <CreateRefusal /> },
  { path: "/update-count/:id", element: <MedicationCountForm /> },
  { path: "/view-count/:id", element: <ViewCount /> },
  { path: "/medications", element: <Medications /> },
  { path: "/mars", element: <Mars /> },
  { path: "/mars/:id", element: <Mars /> },
  { path: "/reconciliation", element: <ReconciliationList /> },
  { path: "/create-reconciliation", element: <ReconciliationForm /> },
  { path: "/update-reconciliation/:id", element: <ReconciliationForm /> },
  { path: "/view-reconciliation/:id", element: <ViewRecociliation /> },
  {
    path: "/employee/medications/medication-count",
    element: <MedicationCountList />,
  },
  { path: "/create-medication-count", element: <MedicationCountForm /> },
  {
    path: "/employee/medications/informed-consent",
    element: <InformedConsentList />,
  },
  { path: "/create-informed-consent", element: <InformedConsentForm /> },
  { path: "/employee/medications/prn-form", element: <PRNformList /> },
  { path: "/create-prn-log", element: <PrnLogForm /> },
  { path: "/view-prn/:id", element: <ViewPrn /> },
  { path: "/update-prn/:id", element: <PrnLogForm /> },
  { path: "/create-mental-status", element: <CreateMentalStatus /> },
  { path: "/mental-status", element: <MentalStatus /> },
  { path: "/update-mental-status/:id", element: <UpdateMentalStatus /> },
  { path: "/view-mental-status/:id", element: <ViewMentalStatus /> },
  { path: "/create-refusal", element: <CreateRefusal /> },
  { path: "/refusal", element: <Refusal /> },
  { path: "/update-refusal/:id", element: <UpdateRefusal /> },
  { path: "/view-refusal/:id", element: <ViewRefusal /> },
  { path: "/create-tracking-log", element: <CreateTrackingLog /> },
  { path: "/tracking-log", element: <TrackingLog /> },
  { path: "/update-tracking-log/:id", element: <UpdateTracking /> },
  { path: "/view-tracking-log/:id", element: <ViewTackingLog /> },
  {
    path: "/create-administration-medication",
    element: <CreateAssistanceMed />,
  },
  { path: "/get-administration-medication", element: <AssistanceMed /> },
  { path: "/view-assistance-med/:id", element: <ViewAssistanceMed /> },
  { path: "/edit-assistance-med/:id", element: <EditAssistanceMed /> },
  { path: "/employee-medication", element: <EmployeeMedication /> },
];

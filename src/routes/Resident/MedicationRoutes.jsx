import { lazyWithRetry } from "../lazyWithRetry";

const InformedConsentList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/InformedConsentList"),
);

const PRNformList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/MedicationLog/PRNformList"),
);

const PrnLogForm = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/MedicationLog/PrnLogForm"),
);

const InformedConsentForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/InformedConsentForm"),
);

const ViewInform = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/ViewInform"),
);

const Mars = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/Mars/Mars"),
);

const ViewPrn = lazyWithRetry(
  () => import("@/features/resident/pages/Medication/MedicationLog/ViewPrn"),
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

export const MedicationRoutes = [
  { path: "/mars-resident", element: <Mars /> },
  { path: "/informed-consent-resident-list", element: <InformedConsentList /> },
  {
    path: "/edit-informed-consent-resident/:id",
    element: <InformedConsentForm />,
  },
  { path: "/view-informed-consent-resident/:id", element: <ViewInform /> },
  { path: "/prn-log-resident-list", element: <PRNformList /> },
  { path: "/edit-prn-log-resident/:id", element: <PrnLogForm /> },
  { path: "/view-prn-log-resident/:id", element: <ViewPrn /> },
  { path: "/refusal-resident-list", element: <Refusal /> },
  { path: "/edit-refusal-resident/:id", element: <UpdateRefusal /> },
  { path: "/view-refusal-resident/:id", element: <ViewRefusal /> },
];

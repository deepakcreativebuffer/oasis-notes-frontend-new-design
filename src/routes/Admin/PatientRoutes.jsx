import { lazyWithRetry } from "../lazyWithRetry";

const PatinentTracking = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/PatinentTracking"),
);

const MesaurableGoal = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/MesaurableGoal"),
);

const Interventions = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Interventions"),
);

const Objective = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Objective"),
);

export const PatientRoutes = [
  { path: "/dashboard/objective", element: <Objective /> },
  { path: "/dashboard/measurable-goal", element: <MesaurableGoal /> },
  { path: "/dashboard/interventions", element: <Interventions /> },
  { path: "/dashboard/patient-tracking", element: <PatinentTracking /> },
];

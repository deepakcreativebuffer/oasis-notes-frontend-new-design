import { lazyWithRetry } from "../lazyWithRetry";

const Discharge = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/Discharge/Discharge"),
);

const UpdateDischarge = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Discharge/UpdateDischarge"),
);

const ViewDischarge = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Discharge/ViewDischarge"),
);

const StaffNotes = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/StaffNote/StaffNotes"),
);

const UpdateStaffNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/StaffNote/UpdateStaffNote"),
);

const ViewStaffNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/StaffNote/ViewStaffNote"),
);

const Authorization = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Authorization/Authorization"),
);

const UpdateAuthorization = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Authorization/UpdateAuthorization"),
);

const ViewAuthorization = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Authorization/ViewAuthorization"),
);

const ViewDischargePlannning = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/DischargePlannning/ViewDischargePlannning"),
);

const UpdateDischargePlannning = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/DischargePlannning/UpdateDischargePlannning"),
);

const DischargePlannning = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/DischargePlannning/DischargePlannning"),
);

const ProgressChartResident = lazyWithRetry(
  () =>
    import("@/features/resident/components/ProgressChart/ProgressChartResident"),
);

const BHPProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/BHPProgress"),
);

const UpdateBhpProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/UpdateBhpProgress"),
);

const ViewBhpProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/ViewBhpProgress"),
);

const ViewRecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/ViewRecertificationOfNeed"),
);

const UpdateRecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/UpdateRecertificationOfNeed"),
);

const RecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/RecertificationOfNeed"),
);

export const ChartRoutes = [
  { path: "/progress-chart-resident", element: <ProgressChartResident /> },
  { path: "/discharge-summary-resident-list", element: <Discharge /> },
  {
    path: "/edit-discharge-summary-resident/:id",
    element: <UpdateDischarge />,
  },
  { path: "/view-discharge-summary-resident/:id", element: <ViewDischarge /> },
  { path: "/bhp-progress-resident-list", element: <BHPProgress /> },
  { path: "/update-bhp-progress-resident/:id", element: <UpdateBhpProgress /> },
  { path: "/view-bhp-progress-resident/:id", element: <ViewBhpProgress /> },
  {
    path: "/discharge-planning-resident-list",
    element: <DischargePlannning />,
  },
  {
    path: "/update-discharge-planning-resident/:id",
    element: <UpdateDischargePlannning />,
  },
  {
    path: "/view-discharge-planning-resident/:id",
    element: <ViewDischargePlannning />,
  },
  {
    path: "/recertification-of-need-resident-list",
    element: <RecertificationOfNeed />,
  },
  {
    path: "/update-recertification-of-need-resident/:id",
    element: <UpdateRecertificationOfNeed />,
  },
  {
    path: "/view-recertification-of-need-resident/:id",
    element: <ViewRecertificationOfNeed />,
  },
  { path: "/staff-note-resident-list", element: <StaffNotes /> },
  { path: "/edit-staff-note-resident/:id", element: <UpdateStaffNote /> },
  { path: "/view-staff-note-resident/:id", element: <ViewStaffNote /> },
  { path: "/authorization-resident-list", element: <Authorization /> },
  {
    path: "/edit-authorization-resident/:id",
    element: <UpdateAuthorization />,
  },
  { path: "/view-authorization-resident/:id", element: <ViewAuthorization /> },
];

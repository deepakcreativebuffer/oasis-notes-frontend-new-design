import { lazyWithRetry } from "../lazyWithRetry";

const Contacts = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Contacts"),
);

const ActivityLog = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/ActivityLog"),
);

const Logs = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Logs"),
);

const Tracking = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Tracking"),
);

const CalenderSchedule = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Calendar"),
);

const ActivityScheduleAdmin = lazyWithRetry(
  () => import("@/features/admin/pages/Scheduling/ActivityScheduleAdminPage"),
);

const Notifications = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Notifications"),
);

const HomePage1 = lazyWithRetry(
  () => import("@/features/admin/pages/HomePage1"),
);

const StaffSchedule2 = lazyWithRetry(
  () => import("@/features/admin/pages/Scheduling/StaffScheduleAdminPage"),
);

const EducationalBackground = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/EducationalBackground"),
);

const EmploymentHistory = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/EmploymentHistory"),
);

const Acknowledgement = lazyWithRetry(
  () => import("@/features/admin/pages/Employment Application/Acknowledgement"),
);

const EditRefrenceCheck = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/ReferenceCheck/EditRefrenceCheck"),
);

export const CoreRoutes = [
  { path: "/dashboard/contacts", element: <Contacts /> },
  { path: "/dashboard/tracking", element: <Tracking /> },
  { path: "/dashboard/logs", element: <Logs /> },
  { path: "/dashboard/activity-log", element: <ActivityLog /> },
  { path: "/dashboard/staff-schedule", element: <StaffSchedule2 /> },
  { path: "/dashboard/activity-schedule", element: <ActivityScheduleAdmin /> },
  { path: "/dashboard/notifications", element: <Notifications /> },
  { path: "/dashboard/calender-schedule", element: <CalenderSchedule /> },
  { path: "/dashboard/homepage", element: <HomePage1 /> },
  {
    path: "/dashboard/edit-refrence-check/:id",
    element: <EditRefrenceCheck />,
  },
  {
    path: "/educational-background/:employeId",
    element: <EducationalBackground />,
  },
  { path: "/employement-history/:employeId", element: <EmploymentHistory /> },
  { path: "/acknowledgement/:employeId", element: <Acknowledgement /> },
];

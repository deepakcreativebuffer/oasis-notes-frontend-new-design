import { lazyWithRetry } from "../lazyWithRetry";

const PatientList = lazyWithRetry(
  () => import("@/features/resident/pages/Patients/PatientListWrapper"),
);

const BookAppointment = lazyWithRetry(
  () => import("@/features/shared/features/appointments/BookAppointmentPage"),
);

const CreateTrackingLog = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/TrackingLog/CreateTrackingLog"),
);

const Appointments = lazyWithRetry(
  () => import("@/features/resident/components/Appointments/Appointments"),
);

const AppointmentScheduling = lazyWithRetry(
  () =>
    import("@/features/resident/components/Appointment Scheduling/AppointmentScheduling"),
);

const BookAppointmentResident = lazyWithRetry(() =>
  import("@/features/shared/features/appointments/BookAppointmentPage").then(
    (m) => ({ default: m.BookAppointmentResidentPage }),
  ),
);

const ManageAppointments = lazyWithRetry(
  () => import("@/features/resident/components/Forms/ManageAppointments"),
);

const CancelAppointment = lazyWithRetry(
  () => import("@/features/resident/components/Forms/CancelAppointment"),
);

const AppointmentHistory = lazyWithRetry(
  () => import("@/features/resident/components/Forms/AppointmentHistory"),
);

export const AppointmentRoutes = [
  { path: "/patient_panel", element: <Appointments /> },
  { path: "/appointment_scheduling", element: <AppointmentScheduling /> },
  { path: "/booknewappointment", element: <BookAppointmentResident /> },
  { path: "/appointmenthistory", element: <AppointmentHistory /> },
  { path: "/manageappointment", element: <ManageAppointments /> },
  { path: "/cancel_appointment", element: <CancelAppointment /> },
  { path: "/bookappointment-resident", element: <CreateTrackingLog /> },
  { path: "/assign-resident-list", element: <PatientList /> },
  { path: "/bookNewAppointment/:id", element: <BookAppointment /> },
];

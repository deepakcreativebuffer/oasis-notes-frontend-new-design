import { lazyWithRetry } from "../lazyWithRetry";

const PatientChart = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/PatientMenu/PatientChartWrapper"),
);
const Discharge = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/Discharge/Discharge"),
);
const ProgressNoteForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Progress/ProgressNoteForm"),
);
const UpdateIncidentReport = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Clinical/UpdateIncidentReportEmployeePage"),
);
const UpdateDischarge = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Discharge/UpdateDischarge"),
);
const ProgressNoteList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Progress/ProgressNoteList"),
);
const CreateDischarge = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Discharge/CreateDischarge"),
);
const ViewDischarge = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Discharge/ViewDischarge"),
);
const DTF = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/Activities/DTF"),
);
const CreateDTF = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/Activities/CreateDTF"),
);
const UpdateDTF = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/Activities/UpdateDTF"),
);
const ViewDTF = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/Activities/ViewDTF"),
);
const FinancialRecord = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/FinancialRecord/FinancialRecord"),
);
const CreateRecord = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/FinancialRecord/CreateRecord"),
);
const EditFinancialRecord = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/FinancialRecord/EditFinancialRecord"),
);
const ViewFinancialRecord = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/FinancialRecord/ViewFinancialRecord"),
);
const StaffNotes = lazyWithRetry(
  () => import("@/features/resident/pages/PatientChart/StaffNote/StaffNotes"),
);
const CreateStaffNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/StaffNote/CreateStaffNote"),
);
const UpdateStaffNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/StaffNote/UpdateStaffNote"),
);
const ViewStaffNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/StaffNote/ViewStaffNote"),
);
const IncidentReport = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/IncidentReport/IncidentReport"),
);
const CreateIncident = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/IncidentReport/CreateIncident"),
);
const ContactNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/ContactNote/ContactNote"),
);
const CreateContactNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/ContactNote/CreateContactNote"),
);
const UpdateContactNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/ContactNote/UpdateContactNote"),
);
const ViewContactNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/ContactNote/ViewContactNote"),
);
const ViewIncidentReport = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/IncidentReport/ViewIncidentReport"),
);
const Authorization = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Authorization/Authorization"),
);
const CreateAuthorization = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Authorization/CreateAuthorization"),
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
const CreateDischargePlannning = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/DischargePlannning/CreateDischargePlannning"),
);
const BHPProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/BHPProgress"),
);
const CreateBhpProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/CreateBhpProgress"),
);
const UpdateBhpProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/UpdateBhpProgress"),
);
const ViewBhpProgress = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/BhpProgress/ViewBhpProgress"),
);
const ViewAsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/ViewAsamAssessment"),
);
const UpdateAsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/UpdateAsamAssessment"),
);
const CreateAsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/CreateAsamAssessment"),
);
const AsamAssessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/AsamAssessment/AsamAssessment"),
);
const ViewRecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/ViewRecertificationOfNeed"),
);
const UpdateRecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/UpdateRecertificationOfNeed"),
);
const CreateRecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/CreateRecertificationOfNeed"),
);
const RecertificationOfNeed = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/RecertificationOfNeed/RecertificationOfNeed"),
);

export const ChartRoutes = [
  { path: "/progree-note/:id", element: <ProgressNoteForm /> },
  { path: "/employee/patient-chart/progress", element: <ProgressNoteList /> },
  { path: "/employee/patient-chart", element: <PatientChart /> },
  { path: "/create-discharge-summary", element: <CreateDischarge /> },
  { path: "/discharge-summary", element: <Discharge /> },
  { path: "/update-discharge/:id", element: <UpdateDischarge /> },
  { path: "/view-discharge/:id", element: <ViewDischarge /> },
  { path: "/bhp-progress", element: <BHPProgress /> },
  { path: "/create-bhp-progress", element: <CreateBhpProgress /> },
  { path: "/update-bhp-progress/:id", element: <UpdateBhpProgress /> },
  { path: "/view-bhp-progress/:id", element: <ViewBhpProgress /> },
  { path: "/asam-assessment", element: <AsamAssessment /> },
  { path: "/create-asam-assessment", element: <CreateAsamAssessment /> },
  { path: "/update-asam-assessment/:id", element: <UpdateAsamAssessment /> },
  { path: "/view-asam-assessment/:id", element: <ViewAsamAssessment /> },
  { path: "/discharge-planning", element: <DischargePlannning /> },
  { path: "/create-discharge-planning", element: <CreateDischargePlannning /> },
  {
    path: "/update-discharge-planning/:id",
    element: <UpdateDischargePlannning />,
  },
  { path: "/view-discharge-planning/:id", element: <ViewDischargePlannning /> },
  {
    path: "/recertification-of-need",
    element: <RecertificationOfNeed />,
  },
  {
    path: "/create-recertification-of-need",
    element: <CreateRecertificationOfNeed />,
  },
  {
    path: "/update-recertification-of-need/:id",
    element: <UpdateRecertificationOfNeed />,
  },
  {
    path: "/view-recertification-of-need/:id",
    element: <ViewRecertificationOfNeed />,
  },
  { path: "/DTF", element: <DTF /> },
  { path: "/create-dtf", element: <CreateDTF /> },
  { path: "/update-dtf/:id", element: <UpdateDTF /> },
  { path: "/view-dtf/:id", element: <ViewDTF /> },
  { path: "/financial-record", element: <FinancialRecord /> },
  { path: "/create-record", element: <CreateRecord /> },
  { path: "/edit-record/:id", element: <EditFinancialRecord /> },
  { path: "/view-record/:id", element: <ViewFinancialRecord /> },
  { path: "/staff-note", element: <StaffNotes /> },
  { path: "/create-staff-note", element: <CreateStaffNote /> },
  { path: "/update-staff-note/:id", element: <UpdateStaffNote /> },
  { path: "/view-staff-note/:id", element: <ViewStaffNote /> },
  { path: "/incident-report", element: <IncidentReport /> },
  { path: "/update-incident/:id", element: <UpdateIncidentReport /> },
  { path: "/create-incident-report", element: <CreateIncident /> },
  { path: "/view-incident-report/:id", element: <ViewIncidentReport /> },
  { path: "/contact-note", element: <ContactNote /> },
  { path: "/create-contact-note", element: <CreateContactNote /> },
  { path: "/update-contact-note/:id", element: <UpdateContactNote /> },
  { path: "/view-contact-note/:id", element: <ViewContactNote /> },
  { path: "/authorization", element: <Authorization /> },
  { path: "/create-authorization", element: <CreateAuthorization /> },
  { path: "/update-authorization/:id", element: <UpdateAuthorization /> },
  { path: "/view-authorization/:id", element: <ViewAuthorization /> },
];

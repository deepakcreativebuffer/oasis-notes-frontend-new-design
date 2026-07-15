import { lazyWithRetry } from "../lazyWithRetry";

const ViewEmployeeTermination = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/ViewEmployeeTermination"),
);
const UpdateEmployeeTermination = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/UpdateEmployeeTermination"),
);
const MultiEmployeeTrackingList = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Employee Tracking/MultiEmployeeTrackingList"),
);
const CreateMultiEmployeeTracking = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Employee Tracking/CreateMultiEmployeeTracking"),
);
const AllI9 = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/I-9/AllI9"),
);
const ViewEmploymentApplicationForm = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/ViewEmploymentApplicationForm"),
);
const GroupNotes = lazyWithRetry(
  () => import("@/features/admin/pages/Group Notes/GroupNotes"),
);
const Traning = lazyWithRetry(
  () => import("@/features/admin/pages/Training/Traning"),
);
const OnSiteList = lazyWithRetry(
  () => import("@/features/admin/pages/Training/OnSite/OnSiteList"),
);
const SkillsList = lazyWithRetry(
  () => import("@/features/admin/pages/Training/SkillTraining/SkillsList"),
);
const TimeOfRequest = lazyWithRetry(
  () => import("@/features/employee/pages/Time Off Request/TimeOfRequest"),
);
const PatientTracking = lazyWithRetry(
  () => import("@/features/resident/pages/Patient Tacking/PatientTracking"),
);
const EmployeePerformance = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Employment/EmployeePerformanceEmployeePage"),
);
const TimeSheet = lazyWithRetry(
  () => import("@/features/employee/pages/Time Sheet/TimeSheet"),
);
const TimeSheetView = lazyWithRetry(
  () => import("@/features/employee/pages/Time Sheet/TimeSheetView"),
);
const PatientList = lazyWithRetry(
  () => import("@/features/resident/pages/Patients/PatientListWrapper"),
);
const VitalsForm = lazyWithRetry(
  () => import("@/features/shared/features/clinical/vitals/VitalsFormPage"),
);
const InformedConsentForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/InformedConsentForm"),
);
const ViewInform = lazyWithRetry(
  () =>
    import("@/features/resident/pages/Medication/InformedConsent/ViewInform"),
);
const ProgressNoteForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Progress/ProgressNoteForm"),
);
const PersonalInfo = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/PersonalInfo"),
);
const ViewInfo = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/ViewInfo"),
);
const Dashboard = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/Dashboard"),
);
const EmployeeUserList = lazyWithRetry(
  () => import("@/features/admin/pages/EmployeeUserList/EmployeeUserList"),
);
const SearchPageWrapper = lazyWithRetry(
  () => import("@/features/employee/pages/Search/SearchPageWrapper"),
);
const EmploymentHistory = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/EmploymentHistory"),
);
const VitalsList = lazyWithRetry(
  () => import("@/features/employee/pages/Clinical/VitalsListPage"),
);
const OnSiteForm = lazyWithRetry(
  () => import("@/features/admin/pages/Training/OnSite/OnSiteForm"),
);
const BookAppointment = lazyWithRetry(
  () => import("@/features/shared/features/appointments/BookAppointmentPage"),
);
const ViewSite = lazyWithRetry(
  () => import("@/features/admin/pages/Training/OnSite/ViewSite"),
);
const SkillTrainingForm = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Training/SkillTraining/SkillTrainingForm"),
);
const ViewSkills = lazyWithRetry(
  () => import("@/features/admin/pages/Training/SkillTraining/ViewSkills"),
);
const GetTimeOfRequest = lazyWithRetry(
  () => import("@/features/employee/pages/Time Off Request/GetTimeOfRequest"),
);
const ViewTimeOfRequest = lazyWithRetry(
  () => import("@/features/employee/pages/Time Off Request/ViewTimeOfRequest"),
);
const Schedule = lazyWithRetry(
  () => import("@/features/employee/pages/Time Sheet/Schedule"),
);
const CreateTherapyNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/TherapyNotes/Therapy/CreateTherapyNote"),
);
const MilegaLog = lazyWithRetry(
  () => import("@/features/resident/pages/TherapyNotes/MilegaLog/MilegaLog"),
);
const CreateMilegaLog = lazyWithRetry(
  () =>
    import("@/features/resident/pages/TherapyNotes/MilegaLog/CreateMilegaLog"),
);
const UpdateMilegaLog = lazyWithRetry(
  () =>
    import("@/features/resident/pages/TherapyNotes/MilegaLog/UpdateMilegaLog"),
);
const ViewMilega = lazyWithRetry(
  () => import("@/features/resident/pages/TherapyNotes/MilegaLog/ViewMilega"),
);
const ScheduleGroup = lazyWithRetry(
  () => import("@/features/employee/pages/Time Sheet/ScheduleGroup"),
);
const ViewProgreeNote = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Progress/ViewProgreeNote"),
);
const All = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/All"),
);
const Chat = lazyWithRetry(() => import("@/features/employee/pages/Chat/Chat"));
const EditTimeOfRequest = lazyWithRetry(
  () => import("@/features/employee/pages/Time Off Request/EditTimeOfRequest"),
);
const InfectionControl = lazyWithRetry(
  () => import("@/features/admin/pages/InfectionControl/InfectionControl"),
);
const GetInfectionControl = lazyWithRetry(
  () => import("@/features/admin/pages/InfectionControl/GetInfectionControl"),
);
const ViewInfectionControl = lazyWithRetry(
  () => import("@/features/admin/pages/InfectionControl/ViewInfectionControl"),
);
const EditInfectionControl = lazyWithRetry(
  () => import("@/features/admin/pages/InfectionControl/EditInfectionControl"),
);
const CreateFallPrevention = lazyWithRetry(
  () => import("@/features/admin/pages/FallPrevention/CreateFallPrevention"),
);
const FallPrevention = lazyWithRetry(
  () => import("@/features/admin/pages/FallPrevention/FallPrevention"),
);
const ViewFallPrevention = lazyWithRetry(
  () => import("@/features/admin/pages/FallPrevention/ViewFallPrevention"),
);
const EditFallPrevention = lazyWithRetry(
  () => import("@/features/admin/pages/FallPrevention/EditFallPrevention"),
);
const CreateTubercluosis = lazyWithRetry(
  () => import("@/features/admin/pages/Tuberculosis/CreateTubercluosis"),
);
const Tubercluosis = lazyWithRetry(
  () => import("@/features/admin/pages/Tuberculosis/Tubercluosis"),
);
const ViewTubercluosis = lazyWithRetry(
  () => import("@/features/admin/pages/Tuberculosis/ViewTubercluosis"),
);
const EditTubercluosis = lazyWithRetry(
  () => import("@/features/admin/pages/Tuberculosis/EditTubercluosis"),
);
const ActivitySchedule = lazyWithRetry(
  () => import("@/features/employee/pages/Scheduling/ActivityScheduleRouter"),
);
const ViewTherapy = lazyWithRetry(
  () => import("@/features/resident/pages/TherapyNotes/Therapy/ViewTherapy"),
);
const TherapyLog = lazyWithRetry(
  () => import("@/features/resident/pages/TherapyNotes/Therapy/TherapyLog"),
);
const UpdateTherapyLog = lazyWithRetry(
  () =>
    import("@/features/resident/pages/TherapyNotes/Therapy/UpdateTherapyLog"),
);
const EmployeePerformanceById = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Employment/EmployeePerformanceByIdPage"),
);
const EmployeeTimeSheet = lazyWithRetry(
  () => import("@/features/employee/pages/Time Sheet/TimeSheetList"),
);
const ClinicalOversight = lazyWithRetry(
  () => import("@/features/admin/pages/ClinicalOversight/ClinicalOversight"),
);
const Receipts = lazyWithRetry(
  () => import("@/features/admin/pages/Receipts/Receipts"),
);
const SpecialNote = lazyWithRetry(
  () => import("@/features/admin/pages/SpecialNotes/SpecialNotes"),
);
const BaseClinicalOversight = lazyWithRetry(
  () =>
    import("@/features/admin/pages/ClinicalOversight/BaseClinicalOversight"),
);
const ViewClinicalOversight = lazyWithRetry(
  () =>
    import("@/features/admin/pages/ClinicalOversight/ViewClinicalOversight"),
);
const ReassessmentList = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Reassessment/ReassessmentList"),
);
const ReassessmentForm = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Reassessment/ReassessmentForm"),
);
const ViewReassessment = lazyWithRetry(
  () =>
    import("@/features/resident/pages/PatientChart/Reassessment/ViewReassessment"),
);

export const GeneralRoutes = [
  { path: "/home", element: <Dashboard /> },
  { path: "/assign-users-list", element: <EmployeeUserList /> },
  { path: "/view-inform/:id", element: <ViewInform /> },
  { path: "/view-progress-note/:id", element: <ViewProgreeNote /> },
  { path: "/create-progress-note", element: <ProgressNoteForm /> },
  { path: "/employee-information", element: <PersonalInfo /> },
  { path: "/view-employee-information", element: <ViewInfo /> },
  { path: "/view-employee-information/:id", element: <ViewInfo /> },
  { path: "/search-list/:id", element: <SearchPageWrapper /> },
  { path: "/employement-history", element: <EmploymentHistory /> },
  {
    path: "/view-employement-application",
    element: <ViewEmploymentApplicationForm />,
  },
  { path: "/group-notes", element: <GroupNotes /> },
  { path: "/employee/training", element: <Traning /> },
  { path: "/vitals", element: <VitalsList /> },
  { path: "/create-vital", element: <VitalsForm /> },
  { path: "/edit-vital/:id", element: <VitalsForm /> },
  { path: "/patient-tracking", element: <PatientTracking /> },
  { path: "/on-site", element: <OnSiteList /> },
  { path: "/edit-on-site/:id", element: <OnSiteForm /> },
  { path: "/view-site/:id", element: <ViewSite /> },
  { path: "/patient-list", element: <PatientList /> },
  { path: "/book-appointment/:id", element: <BookAppointment /> },
  { path: "/skills-knowledge-training", element: <SkillsList /> },
  { path: "/edit-skill-training/:id", element: <SkillTrainingForm /> },
  { path: "/view-site-training/:id", element: <ViewSkills /> },
  { path: "/create-time-of-request", element: <TimeOfRequest /> },
  { path: "/get-time-of-request", element: <GetTimeOfRequest /> },
  { path: "/view-time-of-request/:id", element: <ViewTimeOfRequest /> },
  { path: "/edit-time-off-request/:id", element: <EditTimeOfRequest /> },
  { path: "/schedule", element: <Schedule /> },
  { path: "/time-sheet", element: <TimeSheet /> },
  { path: "/time-sheet/:id", element: <TimeSheetView /> },
  { path: "/timesheet-list", element: <EmployeeTimeSheet /> },
  { path: "/employee-performance", element: <EmployeePerformance /> },
  { path: "/employee-performance/:id", element: <EmployeePerformance /> },
  {
    path: "/updated-employee-performance/:id",
    element: <EmployeePerformanceById />,
  },
  { path: "/therapy-log", element: <TherapyLog /> },
  { path: "/update-therapy-log/:id", element: <UpdateTherapyLog /> },
  { path: "/view-therapy-log/:id", element: <ViewTherapy /> },
  { path: "/create-therapy-note", element: <CreateTherapyNote /> },
  { path: "/milega-log", element: <MilegaLog /> },
  { path: "/create-milega-log", element: <CreateMilegaLog /> },
  { path: "/update-milega-log/:id", element: <UpdateMilegaLog /> },
  { path: "/view-milega-log/:id", element: <ViewMilega /> },
  { path: "/update-informed/:id", element: <InformedConsentForm /> },
  { path: "/scheduleGroup", element: <ScheduleGroup /> },
  { path: "/all-forms", element: <All /> },
  { path: "/chat", element: <Chat /> },
  { path: "/create-infection-control", element: <InfectionControl /> },
  { path: "/get-infection-control", element: <GetInfectionControl /> },
  { path: "/infection-control/:id", element: <ViewInfectionControl /> },
  { path: "/edit-infection-control/:id", element: <EditInfectionControl /> },
  { path: "/create-fall-prevention", element: <CreateFallPrevention /> },
  { path: "/get-fall-prevention", element: <FallPrevention /> },
  { path: "/fall-prevention/:id", element: <ViewFallPrevention /> },
  { path: "/edit-fall-prevention/:id", element: <EditFallPrevention /> },
  { path: "/create-tubercluosis", element: <CreateTubercluosis /> },
  { path: "/tubercluosis", element: <Tubercluosis /> },
  { path: "/tubercluosis/:id", element: <ViewTubercluosis /> },
  { path: "/edit-tubercluosis/:id", element: <EditTubercluosis /> },
  { path: "/activity-schedule", element: <ActivitySchedule /> },
  { path: "/clinical-oversight", element: <ClinicalOversight /> },
  { path: "/clinical-oversight/:id", element: <ClinicalOversight /> },
  { path: "/receipts", element: <Receipts /> },
  { path: "/special-notes", element: <SpecialNote /> },
  { path: "/list-clinical-oversight", element: <BaseClinicalOversight /> },
  { path: "/view-clinical-oversight/:id", element: <ViewClinicalOversight /> },
  {
    path: "/updateEmployeeTermination/:id",
    element: <UpdateEmployeeTermination />,
  },
  {
    path: "/viewEmployeeTermination/:id",
    element: <ViewEmployeeTermination />,
  },
  { path: "/viewEmployeeTermination", element: <ViewEmployeeTermination /> },
  {
    path: "/multiEmployeeTrackingList",
    element: <MultiEmployeeTrackingList />,
  },
  {
    path: "/upload-employee-tracking",
    element: <CreateMultiEmployeeTracking />,
  },
  {
    path: "/upload-employee-tracking/:id",
    element: <CreateMultiEmployeeTracking />,
  },
  { path: "/employee-tracking", element: <MultiEmployeeTrackingList /> },
  { path: "/all-i9", element: <AllI9 /> },
  { path: "/employee-edit-vital/:id", element: <VitalsForm /> },
  { path: "/reassessment-list", element: <ReassessmentList /> },
  { path: "/create-reassessment", element: <ReassessmentForm /> },
  { path: "/update-reassessment/:id", element: <ReassessmentForm /> },
  { path: "/view-reassessment/:id", element: <ViewReassessment /> },
];

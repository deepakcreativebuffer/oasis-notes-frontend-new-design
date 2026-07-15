import { lazyWithRetry } from "../lazyWithRetry";

const EmployeeTerminationlist = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/EmployeeTerminationlist"),
);

const ViewEmployeeTermination = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/ViewEmployeeTermination"),
);

const UpdateEmployeeTermination = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/UpdateEmployeeTermination"),
);

const EmployeeTermination = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/EmployeeTermination"),
);

const ReferenceCheckAdmin = lazyWithRetry(
  () => import("@/features/admin/pages/Employment/ReferenceCheckAdminPage"),
);

const JobDescriptionAdmin = lazyWithRetry(
  () => import("@/features/admin/pages/Employment/JobDescriptionAdminPage"),
);

const OfferLater = lazyWithRetry(
  () => import("@/features/admin/pages/Employment/OfferLetterAdminListPage"),
);

const PatientVitals = lazyWithRetry(
  () => import("@/features/admin/pages/Clinical/PatientVitalsAdminPage"),
);

const EmployeeList = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/EmployeeList"),
);

const EmployeeData = lazyWithRetry(
  () => import("@/features/admin/pages/Dashboard/EmployeeData"),
);

const OfferletterAdmin = lazyWithRetry(
  () => import("@/features/admin/pages/Employment/OfferLetterAdminFormPage"),
);

const ViewEmploymentApplicationForm = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/ViewEmploymentApplicationForm"),
);

const JobDescription = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/JobDescription/JobDescription"),
);

const OnSiteList = lazyWithRetry(
  () => import("@/features/admin/pages/Training/OnSite/OnSiteList"),
);

const EmployeeTracking = lazyWithRetry(
  () => import("@/features/employee/pages/Employee Tracking/EmployeeTracking"),
);

const TimeSheetView = lazyWithRetry(
  () => import("@/features/employee/pages/Time Sheet/TimeSheetView"),
);

const VitalsForm = lazyWithRetry(
  () => import("@/features/shared/features/clinical/vitals/VitalsFormPage"),
);

const Employment = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/EmplymentMenu/Employment"),
);

const OnSiteForm = lazyWithRetry(
  () => import("@/features/admin/pages/Training/OnSite/OnSiteForm"),
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

const ViewTimeOfRequest = lazyWithRetry(
  () => import("@/features/employee/pages/Time Off Request/ViewTimeOfRequest"),
);

const ViewRefrenceCheck = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/ReferenceCheck/ViewRefrenceCheck"),
);

const EditTimeOfRequest = lazyWithRetry(
  () => import("@/features/employee/pages/Time Off Request/EditTimeOfRequest"),
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

const ViewAssistanceMed = lazyWithRetry(
  () => import("@/features/admin/pages/AssistanceMed/ViewAssistanceMed"),
);

const EditAssistanceMed = lazyWithRetry(
  () => import("@/features/admin/pages/AssistanceMed/EditAssistanceMed"),
);

const ViewFallPrevention = lazyWithRetry(
  () => import("@/features/admin/pages/FallPrevention/ViewFallPrevention"),
);

const EditFallPrevention = lazyWithRetry(
  () => import("@/features/admin/pages/FallPrevention/EditFallPrevention"),
);

const ViewTubercluosis = lazyWithRetry(
  () => import("@/features/admin/pages/Tuberculosis/ViewTubercluosis"),
);

const EditTubercluosis = lazyWithRetry(
  () => import("@/features/admin/pages/Tuberculosis/EditTubercluosis"),
);

const SignPersonal = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/SignPersonal"),
);

const SignJobDescription = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/JobDescription/SignJobDescription"),
);

export const EmployeeManagementRoutes = [
  { path: "/dashboard/job-description", element: <JobDescriptionAdmin /> },
  { path: "/dashboard/offer-letter", element: <OfferLater /> },
  { path: "/dashboard/patient-vitals", element: <PatientVitals /> },
  { path: "/dashboard/reference-check", element: <ReferenceCheckAdmin /> },
  { path: "/employment-admin", element: <Employment /> },
  { path: "/employee-list", element: <EmployeeList /> },
  { path: "/dashboard/employee-data/:id", element: <EmployeeData /> },
  {
    path: "/dashboard/employee-tracking/:employeeId",
    element: <EmployeeTracking />,
  },
  { path: "/dashboard/sign-personal/:employeeId", element: <SignPersonal /> },
  {
    path: "/dashboard/sign-job-description/:employeeId",
    element: <SignJobDescription />,
  },
  { path: "/dashboard/on-site/:employeeId", element: <OnSiteList /> },
  {
    path: "/dashboard/get-infection-control/:employeeId",
    element: <GetInfectionControl />,
  },
  {
    path: "/dashboard/job-description/:employeeId",
    element: <JobDescription />,
  },
  { path: "/dashboard/view-site/:employeeId", element: <ViewSite /> },
  { path: "/dashboard/edit-site/:employeeId", element: <OnSiteForm /> },
  {
    path: "/dashboard/infection-control/:employeeId",
    element: <ViewInfectionControl />,
  },
  {
    path: "/dashboard/edit-infection-control/:employeeId",
    element: <EditInfectionControl />,
  },
  {
    path: "/dashboard/view-assistance-med/:employeeId",
    element: <ViewAssistanceMed />,
  },
  {
    path: "/dashboard/edit-assistance-med/:employeeId",
    element: <EditAssistanceMed />,
  },
  {
    path: "/dashboard/fall-prevention/:employeeId",
    element: <ViewFallPrevention />,
  },
  {
    path: "/dashboard/edit-fall-prevention/:employeeId",
    element: <EditFallPrevention />,
  },
  {
    path: "/dashboard/tubercluosis/:employeeId",
    element: <ViewTubercluosis />,
  },
  {
    path: "/dashboard/edit-tubercluosis/:employeeId",
    element: <EditTubercluosis />,
  },
  { path: "/dashboard/time-sheet/:employeeId", element: <TimeSheetView /> },
  {
    path: "/dashboard/view-time-of-request/:employeeId",
    element: <ViewTimeOfRequest />,
  },
  {
    path: "/dashboard/edit-time-off-request/:employeeId",
    element: <EditTimeOfRequest />,
  },
  {
    path: "/dashboard/view-refrence-check/:employeeId",
    element: <ViewRefrenceCheck />,
  },
  {
    path: "/dashboard/view-site-training/:employeeId",
    element: <ViewSkills />,
  },
  {
    path: "/dashboard/edit-skill-training/:employeeId",
    element: <SkillTrainingForm />,
  },
  { path: "/offer-letter/:employeId", element: <OfferletterAdmin /> },
  { path: "/dashboard/employeeTermination", element: <EmployeeTermination /> },
  {
    path: "/dashboard/updateEmployeeTermination/:id",
    element: <UpdateEmployeeTermination />,
  },
  {
    path: "/dashboard/viewEmployeeTermination/:id",
    element: <ViewEmployeeTermination />,
  },
  {
    path: "/dashboard/EmployeeTerminationlist",
    element: <EmployeeTerminationlist />,
  },
  { path: "/edit-vital/:id", element: <VitalsForm /> },
  {
    path: "/view-employement-application/:employeId",
    element: <ViewEmploymentApplicationForm />,
  },
];

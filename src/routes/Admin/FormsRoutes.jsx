import { lazyWithRetry } from "../lazyWithRetry";

const EmployeePerformanceEditAdmin = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment/EmployeePerformanceEditAdminPage"),
);

const EmployeePerformanceAdmin = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment/EmployeePerformanceAdminPage"),
);

const AllI9 = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/I-9/AllI9"),
);

const AllFW9 = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/FW9/AllFW9"),
);

const AllFW4 = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/FW-4/AllFW4"),
);

const AllLRC = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/LRC-1031/AllLRC"),
);

const All2023 = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/2023Forms/All2023"),
);

const AllAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/AlllAppendix"),
);

const Personal = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/Personal"),
);

const OfferLetter = lazyWithRetry(
  () => import("@/features/employee/pages/Employment/OfferLetterEmployeePage"),
);

const Forms2023 = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/2023Forms/2023Forms"),
);

const LRC1031 = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/LRC-1031/LRC-1031"),
);

const FW4Form = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/FW-4/FW-4"),
);

const I9Form = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/I-9/I9Form"),
);

const FW9 = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/FW9/FW9"),
);

const EmployeePerformance = lazyWithRetry(
  () =>
    import("@/features/employee/pages/Employment/EmployeePerformanceEmployeePage"),
);

const PersonalInfo = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/PersonalInfo"),
);

const ViewInfo = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/ViewInfo"),
);

const EditAPS = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/APS/EditAPS"),
);

const BasicInformation = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/BasicInformation"),
);

const OtherInformation = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/OtherInformation"),
);

const ViewAps = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/APS/ViewAps"),
);

const TBRiskAssessmentWrapper = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/TBRiskAssessmentWrapper"),
);

const All = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/All"),
);

const SignAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/SignAppendix"),
);

const ViewAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/ViewAppendix"),
);

export const FormsRoutes = [
  {
    path: "/dashboard/employee-performance",
    element: <EmployeePerformanceAdmin />,
  },
  {
    path: "/dashboard/personal-information/:employeeId",
    element: <Personal />,
  },
  { path: "/dashboard/sign-offer-letter-form/:id", element: <OfferLetter /> },
  {
    path: "/dashboard/employee-information/:employeeId",
    element: <PersonalInfo />,
  },
  {
    path: "/dashboard/view-employee-information/:employeeId",
    element: <ViewInfo />,
  },
  {
    path: "/dashboard/view-appendix/:id",
    element: <TBRiskAssessmentWrapper component={ViewAppendix} />,
  },
  {
    path: "/dashboard/edit-appendix/:id",
    element: <TBRiskAssessmentWrapper component={SignAppendix} />,
  },
  { path: "/dashboard/all-forms-2023", element: <All2023 /> },
  { path: "/dashboard/all-lrc-1031a/", element: <AllLRC /> },
  { path: "/dashboard/all-fw4", element: <AllFW4 /> },
  { path: "/dashboard/edit-aps/:employeeId", element: <EditAPS /> },
  { path: "/dashboard/all-fw9", element: <AllFW9 /> },
  { path: "/dashboard/all-i9", element: <AllI9 /> },
  { path: "/dashboard/view-aps/:employeeId", element: <ViewAps /> },
  { path: "/dashboard/all-forms/:employeeId", element: <All /> },
  {
    path: "/dashboard/employee-performance/:id",
    element: <EmployeePerformance />,
  },
  {
    path: "/dashboard/update-employee-performance/:id",
    element: <EmployeePerformanceEditAdmin />,
  },
  {
    path: "/dashboard/all-appendix",
    element: <TBRiskAssessmentWrapper component={AllAppendix} />,
  },
  { path: "/basic-information/:employeId", element: <BasicInformation /> },
  { path: "/other-information/:employeId", element: <OtherInformation /> },
  { path: "/dashboard/forms-2023/:id", element: <Forms2023 /> },
  { path: "/dashboard/lrc-1031a/:id", element: <LRC1031 /> },
  { path: "/dashboard/fw4/:id", element: <FW4Form /> },
  { path: "/dashboard/i-9/:id", element: <I9Form /> },
  { path: "/dashboard/fw9/:id", element: <FW9 /> },
];

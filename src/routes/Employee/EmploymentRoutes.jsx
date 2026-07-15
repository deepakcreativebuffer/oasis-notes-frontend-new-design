import { lazyWithRetry } from "../lazyWithRetry";

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
const SignOfferLetter = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/OfferLetter/SignOfferLetter"),
);
const SignReferenceCheck = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/ReferenceCheck/EditRefrenceCheck"),
);
const Appendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/Appendix"),
);
const Forms2023 = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/2023Forms/2023Forms"),
);
const LRC1031 = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/LRC-1031/LRC-1031"),
);
const APS = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/APS/APS"),
);
const JobDescription = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/JobDescription/JobDescription"),
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
const Employment = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/EmplymentMenu/Employment"),
);
const AllAps = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/APS/AllAps"),
);
const EditAPS = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/APS/EditAPS"),
);
const BasicInformation = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/BasicInformation"),
);
const EducationalBackground = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/EducationalBackground"),
);
const OtherInformation = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Employment Application/OtherInformation"),
);
const Acknowledgement = lazyWithRetry(
  () => import("@/features/admin/pages/Employment Application/Acknowledgement"),
);
const ViewAps = lazyWithRetry(
  () => import("@/features/admin/pages/EmploymentInformation/APS/ViewAps"),
);
const TBRiskAssessmentWrapper = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/TBRiskAssessmentWrapper"),
);
const ViewRefrenceCheck = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/ReferenceCheck/ViewRefrenceCheck"),
);
const SignAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/SignAppendix"),
);
const ViewAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/ViewAppendix"),
);
const SignPersonal = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Peronal_Information/SignPersonal"),
);
const SignJobDescription = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/JobDescription/SignJobDescription"),
);

export const EmploymentRoutes = [
  { path: "/employment", element: <Employment /> },
  { path: "/offer-letter-form/:id", element: <OfferLetter /> },
  { path: "/offer-letter-form", element: <OfferLetter /> },
  { path: "/sign-offer-letter-form/:id", element: <SignOfferLetter /> },
  { path: "/appendix", element: <Appendix /> },
  {
    path: "/appendix-list",
    element: <TBRiskAssessmentWrapper component={AllAppendix} />,
  },
  {
    path: "/sign-appendix/:id",
    element: <TBRiskAssessmentWrapper component={SignAppendix} />,
  },
  {
    path: "/view-appendix/:id",
    element: <TBRiskAssessmentWrapper component={ViewAppendix} />,
  },
  { path: "/forms-2023", element: <Forms2023 /> },
  { path: "/forms-2023", element: <Forms2023 /> },
  { path: "/lrc-1031a", element: <LRC1031 /> },
  { path: "/aps-consent-form", element: <APS /> },
  { path: "/job-description", element: <JobDescription /> },
  { path: "/job-description/:id", element: <JobDescription /> },
  { path: "/sign-job-description/:id", element: <SignJobDescription /> },
  { path: "/fw4", element: <FW4Form /> },
  { path: "/i-9", element: <I9Form /> },
  { path: "/fw9", element: <FW9 /> },
  { path: "/personal-information", element: <Personal /> },
  { path: "/create-personal-information", element: <Personal /> },
  { path: "/sign-personal/:id", element: <SignPersonal /> },
  { path: "/all-aps", element: <AllAps /> },
  { path: "/edit-aps/:id", element: <EditAPS /> },
  { path: "/view-aps/:id", element: <ViewAps /> },
  { path: "/basic-information", element: <BasicInformation /> },
  { path: "/educational-background", element: <EducationalBackground /> },
  { path: "/other-information", element: <OtherInformation /> },
  { path: "/acknowledgement", element: <Acknowledgement /> },
  { path: "/view-refrence-check/:id", element: <ViewRefrenceCheck /> },
  { path: "/edit-refrence-check/:id", element: <SignReferenceCheck /> },
  { path: "/all-fw4", element: <AllFW4 /> },
  { path: "/all-forms-2023", element: <All2023 /> },
  { path: "/all-lrc-1031a/", element: <AllLRC /> },
  { path: "/all-fw9", element: <AllFW9 /> },
  { path: "/forms-2023/:id", element: <Forms2023 /> },
  { path: "/lrc-1031a/:id", element: <LRC1031 /> },
  { path: "/fw4/:id", element: <FW4Form /> },
  { path: "/i-9/:id", element: <I9Form /> },
  { path: "/fw9/:id", element: <FW9 /> },
];

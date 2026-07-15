import { lazyWithRetry } from "../lazyWithRetry";

const AllAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/AlllAppendix"),
);

const TBRiskAssessmentWrapper = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/TBRiskAssessmentWrapper"),
);

const Chat = lazyWithRetry(() => import("@/features/employee/pages/Chat/Chat"));

const SignAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/SignAppendix"),
);

const ViewAppendix = lazyWithRetry(
  () =>
    import("@/features/admin/pages/EmploymentInformation/Appendix/ViewAppendix"),
);

const FileUpload = lazyWithRetry(
  () => import("@/features/resident/components/Appointments/FileUpload"),
);

export const GeneralRoutes = [
  { path: "/patient_Upload_script", element: <FileUpload /> },
  { path: "/chatPatient", element: <Chat /> },
  {
    path: "/appendix-resident-list",
    element: <TBRiskAssessmentWrapper component={AllAppendix} />,
  },
  {
    path: "/sign-appendix-resident/:id",
    element: <TBRiskAssessmentWrapper component={SignAppendix} />,
  },
  {
    path: "/view-appendix-resident/:id",
    element: <TBRiskAssessmentWrapper component={ViewAppendix} />,
  },
];

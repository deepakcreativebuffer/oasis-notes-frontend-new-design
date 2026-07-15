import { lazyWithRetry } from "../lazyWithRetry";

const OnSiteForm = lazyWithRetry(
  () => import("@/features/admin/pages/Training/OnSite/OnSiteForm"),
);

const SkillTrainingForm = lazyWithRetry(
  () =>
    import("@/features/admin/pages/Training/SkillTraining/SkillTrainingForm"),
);

export const TrainingRoutes = [
  { path: "/create-on-site-facility", element: <OnSiteForm /> },
  { path: "/create-skill-training", element: <SkillTrainingForm /> },
];

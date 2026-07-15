/** @format */

import HOC from "@/features/shared/layout/Inner/HOC";
import { useInitialAssessmentForm } from "./hooks/useInitialAssessmentForm";
import InitialAssessmentPage from "./InitialAssessmentPage";

const InitialAssessment = () => {
  const form = useInitialAssessmentForm();
  return <InitialAssessmentPage form={form} />;
};

export default HOC({
  Wcomponenet: InitialAssessment,
});

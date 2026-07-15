// ResidentForm.js
/** @format */

import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useResidentInitialAssessmentForm } from "./hooks/useResidentInitialAssessmentForm";
import InitialAssessmentPage from "./InitialAssessmentPage";

const InitialAssessment = () => {
  const form = useResidentInitialAssessmentForm();
  return <InitialAssessmentPage form={form} />;
};

export default HOC({
  Wcomponenet: InitialAssessment,
});

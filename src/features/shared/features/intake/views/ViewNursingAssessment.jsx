/** @format */
import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import "@/assets/styles/Print.css";

import { useViewNursingAssessmentLogic } from "./ViewNursingAssessment/useViewNursingAssessmentLogic";
import ViewNursingAssessmentContent from "./ViewNursingAssessment/ViewNursingAssessmentContent";

const ViewNursingAssessment = () => {
  const ctx = useViewNursingAssessmentLogic();
  return <ViewNursingAssessmentContent {...ctx} />;
};

export default HOC({
  Wcomponenet: ViewNursingAssessment,
});

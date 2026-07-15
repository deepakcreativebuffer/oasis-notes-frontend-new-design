/** @format */
import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import "@/assets/styles/Print.css";

import { useNursingAssessmentLogic } from "./NursingAssessment/useNursingAssessmentLogic";
import NursingAssessmentContent from "./NursingAssessment/NursingAssessmentContent";

const NursingAssessment = () => {
  const ctx = useNursingAssessmentLogic();
  return <NursingAssessmentContent {...ctx} />;
};

export default HOC({
  Wcomponenet: NursingAssessment,
});

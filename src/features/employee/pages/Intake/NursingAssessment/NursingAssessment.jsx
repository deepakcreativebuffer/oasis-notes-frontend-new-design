/** @format */
import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import "@/features/resident/pages/Intake/FaceSheet/Facesheet.css";
import "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css";
import "@/features/shared/features/intake/initialAssessment/InitialAssessment.css";

import { useNursingAssessmentFormLogic } from "./form/useNursingAssessmentFormLogic";
import NursingAssessmentFormContent from "./form/NursingAssessmentFormContent";

const NursingAssessment = () => {
  const ctx = useNursingAssessmentFormLogic();
  return <NursingAssessmentFormContent {...ctx} />;
};

export default HOC({
  Wcomponenet: NursingAssessment,
});

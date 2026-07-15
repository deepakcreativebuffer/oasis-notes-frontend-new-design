/** @format */
import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import "@/features/resident/pages/Intake/FaceSheet/Facesheet.css";
import "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css";
import "@/features/shared/features/intake/initialAssessment/InitialAssessment.css";
import { useResidentIntakeLogic } from "./form/useResidentIntakeLogic";
import ResidentIntakeContent from "./form/ResidentIntakeContent";
import { ResidentIntakeFormProvider } from "./context/ResidentIntakeFormContext";

const ResidentIntake = () => {
  const ctx = useResidentIntakeLogic();
  return (
    <ResidentIntakeFormProvider value={ctx}>
      <ResidentIntakeContent />
    </ResidentIntakeFormProvider>
  );
};

export default HOC({
  Wcomponenet: ResidentIntake,
});

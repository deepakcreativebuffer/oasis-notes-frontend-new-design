/** @format */

import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useTreatmentPlanUpdateForm } from "./hooks/useTreatmentPlanUpdateForm";
import TreatmentPlanUpdatePage from "./TreatmentPlanUpdatePage";

const Treatmentplan_update = () => {
  const form = useTreatmentPlanUpdateForm();
  return <TreatmentPlanUpdatePage form={form} />;
};

export default HOC({
  Wcomponenet: Treatmentplan_update,
});

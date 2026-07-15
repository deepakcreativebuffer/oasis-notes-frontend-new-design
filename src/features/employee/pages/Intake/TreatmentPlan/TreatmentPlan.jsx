/** @format */

import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useTreatmentPlanForm } from "./hooks/useTreatmentPlanForm";
import TreatmentPlanPage from "./TreatmentPlanPage";

const TreatmentPlan = () => {
  const form = useTreatmentPlanForm();
  return <TreatmentPlanPage form={form} />;
};

export default HOC({
  Wcomponenet: TreatmentPlan,
});

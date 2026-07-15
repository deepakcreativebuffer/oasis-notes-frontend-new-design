/** @format */

import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useViewTreatmentPlanForm } from "./hooks/useViewTreatmentPlanForm";
import ViewTreatmentPlanPage from "./ViewTreatmentPlanPage";

const ViewTreatmentPlan = () => {
  const form = useViewTreatmentPlanForm();
  return <ViewTreatmentPlanPage form={form} />;
};

export default HOC({
  Wcomponenet: ViewTreatmentPlan,
});

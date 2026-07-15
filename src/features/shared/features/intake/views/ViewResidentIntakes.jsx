/** @format */
import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import "@/features/resident/components/Forms/ResidentIntake.css";
import "@/assets/styles/Print.css";
import { useViewResidentIntakesLogic } from "./ViewResidentIntakes/useViewResidentIntakesLogic";
import ViewResidentIntakesContent from "./ViewResidentIntakes/ViewResidentIntakesContent";

const ViewResidentIntakes = () => {
  const ctx = useViewResidentIntakesLogic();
  return <ViewResidentIntakesContent {...ctx} />;
};

export default HOC({
  Wcomponenet: ViewResidentIntakes,
});

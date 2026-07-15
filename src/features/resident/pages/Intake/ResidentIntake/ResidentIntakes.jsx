/** @format */
import React from "react";
import HOC from "@/features/shared/layout/Inner/HOC";
import "../../../components/Forms/ResidentIntake.css";
import { useResidentIntakesLogic } from "./ResidentIntakes/useResidentIntakesLogic";
import ResidentIntakesContent from "./ResidentIntakes/ResidentIntakesContent";

const ResidentIntakes = () => {
  const ctx = useResidentIntakesLogic();
  return <ResidentIntakesContent {...ctx} />;
};

export default HOC({
  Wcomponenet: ResidentIntakes,
});

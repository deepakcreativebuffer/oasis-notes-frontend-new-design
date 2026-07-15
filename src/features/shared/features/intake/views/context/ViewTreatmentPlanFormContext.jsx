/** @format */

import { createContext, useContext } from "react";

const ViewTreatmentPlanFormContext = createContext(null);

export function ViewTreatmentPlanFormProvider({ value, children }) {
  return (
    <ViewTreatmentPlanFormContext.Provider value={value}>
      {children}
    </ViewTreatmentPlanFormContext.Provider>
  );
}

export function useViewTreatmentPlanFormContext() {
  const ctx = useContext(ViewTreatmentPlanFormContext);
  if (!ctx) {
    throw new Error(
      "useViewTreatmentPlanFormContext must be used within ViewTreatmentPlanFormProvider",
    );
  }
  return ctx;
}

/** @format */

import { createContext, useContext } from "react";

const TreatmentPlanFormContext = createContext(null);

export function TreatmentPlanFormProvider({ value, children }) {
  return (
    <TreatmentPlanFormContext.Provider value={value}>
      {children}
    </TreatmentPlanFormContext.Provider>
  );
}

export function useTreatmentPlanFormContext() {
  const ctx = useContext(TreatmentPlanFormContext);
  if (!ctx) {
    throw new Error(
      "useTreatmentPlanFormContext must be used within TreatmentPlanFormProvider",
    );
  }
  return ctx;
}

/** @format */

import { createContext, useContext } from "react";

const TreatmentPlanUpdateFormContext = createContext(null);

export function TreatmentPlanUpdateFormProvider({ value, children }) {
  return (
    <TreatmentPlanUpdateFormContext.Provider value={value}>
      {children}
    </TreatmentPlanUpdateFormContext.Provider>
  );
}

export function useTreatmentPlanUpdateFormContext() {
  const ctx = useContext(TreatmentPlanUpdateFormContext);
  if (!ctx) {
    throw new Error(
      "useTreatmentPlanUpdateFormContext must be used within TreatmentPlanUpdateFormProvider",
    );
  }
  return ctx;
}

/** @format */

import { createContext, useContext } from "react";

const ResidentInitialAssessmentFormContext = createContext(null);

export function ResidentInitialAssessmentFormProvider({ value, children }) {
  return (
    <ResidentInitialAssessmentFormContext.Provider value={value}>
      {children}
    </ResidentInitialAssessmentFormContext.Provider>
  );
}

export function useResidentInitialAssessmentFormContext() {
  const ctx = useContext(ResidentInitialAssessmentFormContext);
  if (!ctx) {
    throw new Error(
      "useResidentInitialAssessmentFormContext must be used within ResidentInitialAssessmentFormProvider",
    );
  }
  return ctx;
}

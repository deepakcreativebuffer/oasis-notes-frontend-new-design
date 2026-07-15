/** @format */

import { createContext, useContext } from "react";

const InitialAssessmentFormContext = createContext(null);

export function InitialAssessmentFormProvider({ value, children }) {
  return (
    <InitialAssessmentFormContext.Provider value={value}>
      {children}
    </InitialAssessmentFormContext.Provider>
  );
}

export function useInitialAssessmentFormContext() {
  const ctx = useContext(InitialAssessmentFormContext);
  if (!ctx) {
    throw new Error(
      "useInitialAssessmentFormContext must be used within InitialAssessmentFormProvider",
    );
  }
  return ctx;
}

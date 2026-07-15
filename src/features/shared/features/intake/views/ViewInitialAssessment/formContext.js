/** @format */

import { createContext, useContext } from "react";

export const ViewInitialAssessmentFormContext = createContext(null);

export function useViewInitialAssessmentForm() {
  const ctx = useContext(ViewInitialAssessmentFormContext);
  if (!ctx) {
    throw new Error(
      "useViewInitialAssessmentForm must be used within Provider",
    );
  }
  return ctx;
}

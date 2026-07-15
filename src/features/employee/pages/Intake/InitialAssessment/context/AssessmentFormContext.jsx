/** @format */

import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { resolveAssessmentContext } from "../utils/helpers";

const AssessmentFormContext = createContext(null);

export function AssessmentFormProvider({ children, portal: portalOverride }) {
  const { pathname } = useLocation();
  const routeContext = useMemo(
    () => resolveAssessmentContext(pathname),
    [pathname],
  );

  const value = useMemo(
    () => ({
      ...routeContext,
      portal: portalOverride ?? routeContext.portal,
    }),
    [portalOverride, routeContext],
  );

  return (
    <AssessmentFormContext.Provider value={value}>
      {children}
    </AssessmentFormContext.Provider>
  );
}

export function useAssessmentFormContext() {
  const context = useContext(AssessmentFormContext);
  if (!context) {
    throw new Error(
      "useAssessmentFormContext must be used within AssessmentFormProvider",
    );
  }
  return context;
}

/** Safe hook when provider is optional (legacy pages during migration). */
export function useAssessmentFormContextOptional() {
  return useContext(AssessmentFormContext);
}

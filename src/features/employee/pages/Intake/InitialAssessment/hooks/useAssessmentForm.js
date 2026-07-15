/** @format */

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { resolveAssessmentContext } from "../utils/helpers";

/**
 * Resolves route-derived mode/portal for mode-based rendering.
 * Form state remains in InitialAssessment.js during incremental refactor.
 */
export function useAssessmentForm() {
  const { pathname } = useLocation();

  const context = useMemo(() => resolveAssessmentContext(pathname), [pathname]);

  return context;
}

/** @format */

import { describe, it, expect } from "vitest";

// This is a barrel module: its only job is to re-export the Initial Assessment
// hooks under stable names. The contract under test is the export surface —
// every named hook must resolve to a callable function so consumers importing
// from "../hooks" never get an undefined symbol. We import the namespace and
// assert shape rather than invoking the hooks (they require redux/router/
// react-query context and IO mocks to run).
import * as hooks from "./index";

const EXPECTED_HOOKS = [
  "useAssessmentForm",
  "useAssessmentApi",
  "usePrintAssessment",
  "useSignatureManagement",
  "useSignersList",
  "useResidentStrengths",
  "useIndependentLivingSkills",
  "useActiveWithdrawalSymptoms",
  "useMentalStatusExam",
  "useRiskFactors",
  "useProtectiveFactors",
];

describe("InitialAssessment hooks barrel (index.js)", () => {
  it("re-exports every expected hook as a function", () => {
    for (const name of EXPECTED_HOOKS) {
      // WHY: a barrel typo (wrong path/missing file) surfaces here as a
      // missing or non-function export rather than crashing a consumer later.
      expect(hooks[name], `${name} should be exported`).toBeTypeOf("function");
    }
  });

  it("exposes exactly the expected named exports and nothing extra", () => {
    // WHY: pin the public API so an accidental export (e.g. an internal
    // helper) or a dropped hook is caught by the test, not by consumers.
    const exportedNames = Object.keys(hooks).sort();
    expect(exportedNames).toEqual([...EXPECTED_HOOKS].sort());
  });

  it("does not export a default symbol (named-only barrel)", () => {
    // WHY: consumers use named imports; a stray default would be dead surface.
    expect(hooks.default).toBeUndefined();
  });
});

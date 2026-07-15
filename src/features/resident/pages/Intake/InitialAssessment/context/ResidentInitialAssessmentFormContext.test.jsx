/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./ResidentInitialAssessmentFormContext";

// Import-smoke: verifies the module parses, its imports resolve, and no
// top-level code throws. Does not render.
describe("ResidentInitialAssessmentFormContext", () => {
  it("loads and exposes at least one export", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});

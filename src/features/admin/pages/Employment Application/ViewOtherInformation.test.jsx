/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./ViewOtherInformation";

// Import-smoke: verifies the module parses, its imports resolve, and no
// top-level code throws. Does not render.
describe("ViewOtherInformation", () => {
  it("loads with a renderable default export", () => {
    expect(mod.default).toBeDefined();
    expect(["function", "object"]).toContain(typeof mod.default);
  });
});

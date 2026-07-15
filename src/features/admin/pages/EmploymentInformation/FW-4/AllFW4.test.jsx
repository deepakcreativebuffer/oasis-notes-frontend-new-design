/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./AllFW4";

// Import-smoke: verifies the module parses, its imports resolve, and no
// top-level code throws. Does not render.
describe("AllFW4", () => {
  it("loads with a renderable default export", () => {
    expect(mod.default).toBeDefined();
    expect(["function", "object"]).toContain(typeof mod.default);
  });
});

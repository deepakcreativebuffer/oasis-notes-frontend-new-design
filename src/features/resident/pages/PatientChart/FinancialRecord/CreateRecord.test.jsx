/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./CreateRecord";

// Import-smoke: verifies the module parses, its imports resolve, and no
// top-level code throws. Does not render.
describe("CreateRecord", () => {
  it("loads with a renderable default export", () => {
    expect(mod.default).toBeDefined();
    expect(["function", "object"]).toContain(typeof mod.default);
  });
});

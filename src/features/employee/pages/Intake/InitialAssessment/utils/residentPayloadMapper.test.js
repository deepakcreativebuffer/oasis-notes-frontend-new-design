/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./residentPayloadMapper";

describe("residentPayloadMapper", () => {
  it("loads and exposes at least one export", () => {
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
  it("has no undefined named exports", () => {
    Object.entries(mod).forEach(([k, v]) => expect(v, k).toBeDefined());
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./login.api";

describe("login.api", () => {
  it("exports at least one callable", () => {
    const fns = Object.values(mod).filter((v) => typeof v === "function");
    expect(fns.length).toBeGreaterThan(0);
  });

  it("has no undefined named exports", () => {
    Object.entries(mod).forEach(([k, v]) => expect(v, k).toBeDefined());
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import * as mod from "./specialNotes.queries";

describe("specialNotes.queries", () => {
  it("exports React Query hooks as functions", () => {
    const fns = Object.values(mod).filter((v) => typeof v === "function");
    expect(fns.length).toBeGreaterThan(0);
  });

  it("has no undefined named exports", () => {
    Object.entries(mod).forEach(([k, v]) => expect(v, k).toBeDefined());
  });
});

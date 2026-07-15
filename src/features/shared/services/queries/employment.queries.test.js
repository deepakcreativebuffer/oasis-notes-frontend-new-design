/** @format */

import { describe, it, expect, vi } from "vitest";

import * as mod from "./employment.queries";

// Stub the factory-built service deps so importing the hooks doesn't enter the
// services module cycle (service -> resourceService -> common.api -> @/utils ->
// barrel). Hook bodies aren't executed here, so empty stubs suffice.
vi.mock("../services/employment", () => ({ employmentService: {} }));
vi.mock("@/features/admin/services/adminDashboard", () => ({
  adminDashboardService: {},
}));

describe("employment.queries", () => {
  it("exports React Query hooks as functions", () => {
    const fns = Object.values(mod).filter((v) => typeof v === "function");
    expect(fns.length).toBeGreaterThan(0);
  });

  it("has no undefined named exports", () => {
    Object.entries(mod).forEach(([k, v]) => expect(v, k).toBeDefined());
  });
});

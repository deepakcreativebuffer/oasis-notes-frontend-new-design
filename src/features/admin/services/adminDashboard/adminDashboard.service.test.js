/** @format */

import { describe, it, expect } from "vitest";
import { adminDashboardService } from "./adminDashboard.service";

describe("adminDashboardService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminDashboardService).toBeTypeOf("object");
    expect(adminDashboardService).not.toBeNull();
    const values = Object.values(adminDashboardService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

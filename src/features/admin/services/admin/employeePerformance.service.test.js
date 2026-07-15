/** @format */

import { describe, it, expect } from "vitest";
import { adminEmployeePerformanceService } from "./employeePerformance.service";

describe("adminEmployeePerformanceService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminEmployeePerformanceService).toBeTypeOf("object");
    expect(adminEmployeePerformanceService).not.toBeNull();
    const values = Object.values(adminEmployeePerformanceService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

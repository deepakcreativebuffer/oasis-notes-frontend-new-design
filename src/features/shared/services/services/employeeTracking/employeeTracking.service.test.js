/** @format */

import { describe, it, expect } from "vitest";
import { employeeTrackingService } from "./employeeTracking.service";

describe("employeeTrackingService", () => {
  it("exposes its operations as functions", () => {
    expect(employeeTrackingService).toBeTypeOf("object");
    expect(Object.keys(employeeTrackingService).length).toBeGreaterThan(0);
    Object.values(employeeTrackingService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

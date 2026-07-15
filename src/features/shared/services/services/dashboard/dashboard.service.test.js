/** @format */

import { describe, it, expect } from "vitest";
import { dashboardService } from "./dashboard.service";

describe("dashboardService", () => {
  it("exposes its operations as functions", () => {
    expect(dashboardService).toBeTypeOf("object");
    expect(Object.keys(dashboardService).length).toBeGreaterThan(0);
    Object.values(dashboardService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

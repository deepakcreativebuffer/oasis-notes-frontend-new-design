/** @format */

import { describe, it, expect } from "vitest";
import { facilityService } from "./facility.service";

describe("facilityService", () => {
  it("exposes its operations as functions", () => {
    expect(facilityService).toBeTypeOf("object");
    expect(Object.keys(facilityService).length).toBeGreaterThan(0);
    Object.values(facilityService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

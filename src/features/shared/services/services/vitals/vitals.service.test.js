/** @format */

import { describe, it, expect } from "vitest";
import { vitalsService } from "./vitals.service";

describe("vitalsService", () => {
  it("exposes its operations as functions", () => {
    expect(vitalsService).toBeTypeOf("object");
    expect(Object.keys(vitalsService).length).toBeGreaterThan(0);
    Object.values(vitalsService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

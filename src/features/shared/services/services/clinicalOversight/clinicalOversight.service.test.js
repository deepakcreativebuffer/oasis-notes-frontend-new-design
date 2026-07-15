/** @format */

import { describe, it, expect } from "vitest";
import { clinicalOversightService } from "./clinicalOversight.service";

describe("clinicalOversightService", () => {
  it("exposes its operations as functions", () => {
    expect(clinicalOversightService).toBeTypeOf("object");
    expect(Object.keys(clinicalOversightService).length).toBeGreaterThan(0);
    Object.values(clinicalOversightService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import { patientService } from "./patient.service";

describe("patientService", () => {
  it("exposes its operations as functions", () => {
    expect(patientService).toBeTypeOf("object");
    expect(Object.keys(patientService).length).toBeGreaterThan(0);
    Object.values(patientService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

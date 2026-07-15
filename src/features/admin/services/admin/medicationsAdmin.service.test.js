/** @format */

import { describe, it, expect } from "vitest";
import { adminMedicationsService } from "./medicationsAdmin.service";

describe("adminMedicationsService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminMedicationsService).toBeTypeOf("object");
    expect(adminMedicationsService).not.toBeNull();
    const values = Object.values(adminMedicationsService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

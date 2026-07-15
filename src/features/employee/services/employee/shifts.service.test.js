/** @format */

import { describe, it, expect } from "vitest";
import { employeeShiftsService } from "./shifts.service";

describe("employeeShiftsService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(employeeShiftsService).toBeTypeOf("object");
    expect(employeeShiftsService).not.toBeNull();
    const values = Object.values(employeeShiftsService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

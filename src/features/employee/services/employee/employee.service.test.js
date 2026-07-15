/** @format */

import { describe, it, expect } from "vitest";
import { employeeService } from "./employee.service";

describe("employeeService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(employeeService).toBeTypeOf("object");
    expect(employeeService).not.toBeNull();
    const values = Object.values(employeeService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

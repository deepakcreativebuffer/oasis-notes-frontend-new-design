/** @format */

import { describe, it, expect } from "vitest";
import { EMPLOYEE_APIS } from "./employeeApis";

describe("EMPLOYEE_APIS", () => {
  it("exposes a non-empty endpoint map", () => {
    expect(EMPLOYEE_APIS).toBeTypeOf("object");
    expect(Object.keys(EMPLOYEE_APIS).length).toBeGreaterThan(0);
  });

  it("has string or function values for every endpoint", () => {
    Object.values(EMPLOYEE_APIS).forEach((v) =>
      expect(["string", "function"]).toContain(typeof v),
    );
  });
});

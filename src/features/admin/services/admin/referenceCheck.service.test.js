/** @format */

import { describe, it, expect } from "vitest";
import { adminReferenceCheckService } from "./referenceCheck.service";

describe("adminReferenceCheckService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminReferenceCheckService).toBeTypeOf("object");
    expect(adminReferenceCheckService).not.toBeNull();
    const values = Object.values(adminReferenceCheckService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

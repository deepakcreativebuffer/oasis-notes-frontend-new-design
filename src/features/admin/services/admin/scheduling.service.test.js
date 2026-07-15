/** @format */

import { describe, it, expect } from "vitest";
import { adminSchedulingService } from "./scheduling.service";

describe("adminSchedulingService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminSchedulingService).toBeTypeOf("object");
    expect(adminSchedulingService).not.toBeNull();
    const values = Object.values(adminSchedulingService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

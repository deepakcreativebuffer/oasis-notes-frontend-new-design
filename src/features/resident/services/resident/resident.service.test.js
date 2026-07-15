/** @format */

import { describe, it, expect } from "vitest";
import { residentService } from "./resident.service";

describe("residentService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(residentService).toBeTypeOf("object");
    expect(residentService).not.toBeNull();
    const values = Object.values(residentService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

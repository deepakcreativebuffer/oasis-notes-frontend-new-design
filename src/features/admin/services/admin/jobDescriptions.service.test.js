/** @format */

import { describe, it, expect } from "vitest";
import { adminJobDescriptionsService } from "./jobDescriptions.service";

describe("adminJobDescriptionsService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminJobDescriptionsService).toBeTypeOf("object");
    expect(adminJobDescriptionsService).not.toBeNull();
    const values = Object.values(adminJobDescriptionsService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import { adminTrackingService } from "./tracking.service";

describe("adminTrackingService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminTrackingService).toBeTypeOf("object");
    expect(adminTrackingService).not.toBeNull();
    const values = Object.values(adminTrackingService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

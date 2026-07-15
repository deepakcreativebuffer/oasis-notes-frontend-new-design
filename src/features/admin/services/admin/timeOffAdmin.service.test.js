/** @format */

import { describe, it, expect } from "vitest";
import { adminTimeOffService } from "./timeOffAdmin.service";

describe("adminTimeOffService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminTimeOffService).toBeTypeOf("object");
    expect(adminTimeOffService).not.toBeNull();
    const values = Object.values(adminTimeOffService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

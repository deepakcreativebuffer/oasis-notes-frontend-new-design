/** @format */

import { describe, it, expect } from "vitest";
import { adminDataService } from "./adminData.service";

describe("adminDataService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminDataService).toBeTypeOf("object");
    expect(adminDataService).not.toBeNull();
    const values = Object.values(adminDataService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

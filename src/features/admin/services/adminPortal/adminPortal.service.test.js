/** @format */

import { describe, it, expect } from "vitest";
import { adminPortalService } from "./adminPortal.service";

describe("adminPortalService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminPortalService).toBeTypeOf("object");
    expect(adminPortalService).not.toBeNull();
    const values = Object.values(adminPortalService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

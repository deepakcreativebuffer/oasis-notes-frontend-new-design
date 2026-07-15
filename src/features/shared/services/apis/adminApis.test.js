/** @format */

import { describe, it, expect } from "vitest";
import { ADMIN_APIS } from "./adminApis";

describe("ADMIN_APIS", () => {
  it("exposes a non-empty endpoint map", () => {
    expect(ADMIN_APIS).toBeTypeOf("object");
    expect(Object.keys(ADMIN_APIS).length).toBeGreaterThan(0);
  });

  it("has string or function values for every endpoint", () => {
    Object.values(ADMIN_APIS).forEach((v) =>
      expect(["string", "function"]).toContain(typeof v),
    );
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import { authService } from "./auth.service";

describe("authService", () => {
  it("exposes its operations as functions", () => {
    expect(authService).toBeTypeOf("object");
    expect(Object.keys(authService).length).toBeGreaterThan(0);
    Object.values(authService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

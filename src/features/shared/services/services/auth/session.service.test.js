/** @format */

import { describe, it, expect } from "vitest";
import { authSessionService } from "./session.service";

describe("authSessionService", () => {
  it("exposes its operations as functions", () => {
    expect(authSessionService).toBeTypeOf("object");
    expect(Object.keys(authSessionService).length).toBeGreaterThan(0);
    Object.values(authSessionService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import { profileService } from "./profile.service";

describe("profileService", () => {
  it("exposes its operations as functions", () => {
    expect(profileService).toBeTypeOf("object");
    expect(Object.keys(profileService).length).toBeGreaterThan(0);
    Object.values(profileService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

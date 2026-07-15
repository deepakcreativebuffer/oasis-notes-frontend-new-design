/** @format */

import { describe, it, expect } from "vitest";
import { AUTH_APIS } from "./authApis";

describe("AUTH_APIS", () => {
  it("exposes a non-empty map of string endpoints", () => {
    expect(AUTH_APIS).toBeTypeOf("object");
    const values = Object.values(AUTH_APIS);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(typeof v).toBe("string"));
  });

  it("includes the OTP challenge endpoints", () => {
    expect(AUTH_APIS.OTP_CHALLENGE).toBeTruthy();
    expect(AUTH_APIS.OTP_VERIFY_CHALLENGE).toBeTruthy();
  });
});

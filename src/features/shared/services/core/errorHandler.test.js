/** @format */

import { describe, it, expect } from "vitest";
import {
  getUserFriendlyMessage,
  normalizeApiError,
  extractApiPayload,
  handleApiRequest,
} from "./errorHandler";

describe("extractApiPayload", () => {
  it("returns the body directly when it is an array or primitive", () => {
    expect(extractApiPayload({ data: [1, 2] })).toEqual([1, 2]);
    expect(extractApiPayload({ data: "raw" })).toBe("raw");
  });

  it("unwraps a nested data envelope", () => {
    expect(extractApiPayload({ data: { data: { id: 1 } } })).toEqual({ id: 1 });
  });

  it("returns null for a null body", () => {
    expect(extractApiPayload({ data: null })).toBeNull();
  });
});

describe("handleApiRequest", () => {
  it("wraps a successful call in a success envelope", async () => {
    const out = await handleApiRequest(async () => ({
      status: 200,
      data: { data: { ok: true }, message: "Done" },
    }));
    expect(out).toMatchObject({ success: true, status: 200, message: "Done" });
    expect(out.data).toEqual({ ok: true });
  });

  it("normalizes a thrown error to a failure envelope", async () => {
    const out = await handleApiRequest(async () => {
      throw { response: { status: 401 } };
    });
    expect(out.success).toBe(false);
    expect(out.status).toBe(401);
  });
});

describe("getUserFriendlyMessage / normalizeApiError", () => {
  it("returns a readable message string", () => {
    expect(typeof getUserFriendlyMessage({ response: { status: 500 } })).toBe(
      "string",
    );
  });

  it("normalizeApiError yields a failure envelope", () => {
    expect(normalizeApiError({ response: { status: 404 } })).toMatchObject({
      success: false,
      status: 404,
    });
  });
});

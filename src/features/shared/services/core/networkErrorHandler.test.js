/** @format */

import { describe, it, expect } from "vitest";
import { normalizeNetworkError, ERROR_TYPES } from "./networkErrorHandler";

describe("normalizeNetworkError", () => {
  it("maps a 401 to an auth error", () => {
    const out = normalizeNetworkError({ response: { status: 401 } });
    expect(out).toMatchObject({ success: false, type: ERROR_TYPES.AUTH_ERROR });
    expect(out.message).toMatch(/log in again/i);
  });

  it("maps 5xx to a server error", () => {
    const out = normalizeNetworkError({ response: { status: 503 } });
    expect(out.type).toBe(ERROR_TYPES.SERVER_ERROR);
  });

  it("flags timeouts from ECONNABORTED", () => {
    const out = normalizeNetworkError({ code: "ECONNABORTED" });
    expect(out.type).toBe(ERROR_TYPES.TIMEOUT_ERROR);
    expect(out.isTimeout).toBe(true);
  });

  it("flags an explicitly offline error", () => {
    const out = normalizeNetworkError({ isOffline: true });
    expect(out.type).toBe(ERROR_TYPES.OFFLINE_ERROR);
    expect(out.isOffline).toBe(true);
  });

  it("treats no-response-with-request as a network error", () => {
    const out = normalizeNetworkError({ request: {} });
    expect(out.type).toBe(ERROR_TYPES.NETWORK_ERROR);
  });

  it("prefers the server-provided message on 400", () => {
    const out = normalizeNetworkError({
      response: { status: 400, data: { message: "Bad field" } },
    });
    expect(out.type).toBe(ERROR_TYPES.VALIDATION_ERROR);
    expect(out.message).toBe("Bad field");
  });
});

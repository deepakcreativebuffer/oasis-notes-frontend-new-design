/** @format */

import { describe, it, expect, vi } from "vitest";
import logger from "./logger";

// In the test env MODE !== "development", so the console sinks stay quiet.
// These are smoke/contract checks: the API exists and never throws.
describe("logger", () => {
  it("exposes the standard log levels", () => {
    for (const level of ["info", "warn", "error", "debug"]) {
      expect(logger[level]).toBeTypeOf("function");
    }
  });

  it("does not throw for any level", () => {
    expect(() => logger.info("i")).not.toThrow();
    expect(() => logger.warn("w")).not.toThrow();
    expect(() => logger.debug("d")).not.toThrow();
    expect(() =>
      logger.error("e", new Error("boom"), { endpoint: "/x" }),
    ).not.toThrow();
  });

  it("stays silent outside development mode", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("should not print", new Error("x"));
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

/** @format */

import { describe, it, expect } from "vitest";
// Imported via the public barrel to match the app's module init order.
import { api, injectStore } from "@/features/shared/services";

describe("baseApi", () => {
  it("exports a configured axios-like instance", () => {
    expect(api).toBeDefined();
    expect(api.get).toBeTypeOf("function");
    expect(api.post).toBeTypeOf("function");
    expect(api.interceptors).toBeDefined();
  });

  it("exposes injectStore for wiring redux into interceptors", () => {
    expect(injectStore).toBeTypeOf("function");
    expect(() => injectStore({ dispatch: () => {} })).not.toThrow();
  });
});

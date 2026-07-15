/** @format */

import { describe, it, expect, vi } from "vitest";

import * as commonApi from "./common.api";

// baseApi is the shared axios instance — stub it so importing the module never
// wires up a real HTTP client.
vi.mock("../baseApi", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("common.api exports", () => {
  it("exposes the generic request helpers as functions", () => {
    for (const name of [
      "getApi",
      "postApi",
      "createApi",
      "updateApi",
      "removeApi",
      "deleteApi",
      "removeApiForPdf",
    ]) {
      expect(commonApi[name], name).toBeTypeOf("function");
    }
  });
});

/** @format */

import { describe, it, expect, vi } from "vitest";

import * as downloadApi from "./download.api";

vi.mock("../baseApi", () => ({ default: { get: vi.fn() } }));

describe("download.api exports", () => {
  it("exposes downloadBlobByUrl as a function", () => {
    expect(downloadApi.downloadBlobByUrl).toBeTypeOf("function");
  });
});

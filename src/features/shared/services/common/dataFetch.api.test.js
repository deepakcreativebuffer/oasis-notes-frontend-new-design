/** @format */

import { describe, it, expect, vi } from "vitest";

import * as dataFetch from "./dataFetch.api";

vi.mock("../baseApi", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("dataFetch.api exports", () => {
  it("exposes its fetch helpers as functions", () => {
    expect(dataFetch.getData).toBeTypeOf("function");
    expect(dataFetch.getMarsDataByMonthAndYear).toBeTypeOf("function");
  });
});

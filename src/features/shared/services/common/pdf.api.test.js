/** @format */

import { describe, it, expect, vi } from "vitest";

import * as pdfApi from "./pdf.api";

vi.mock("../baseApi", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("pdf.api exports", () => {
  it("exposes startPdfJob as a function", () => {
    expect(pdfApi.startPdfJob).toBeTypeOf("function");
  });
});

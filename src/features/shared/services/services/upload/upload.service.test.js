/** @format */

import { describe, it, expect } from "vitest";
import { uploadService } from "./upload.service";

describe("uploadService", () => {
  it("exposes its operations as functions", () => {
    expect(uploadService).toBeTypeOf("object");
    expect(Object.keys(uploadService).length).toBeGreaterThan(0);
    Object.values(uploadService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

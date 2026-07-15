/** @format */

import { describe, it, expect } from "vitest";
import { receiptsService } from "./receipts.service";

describe("receiptsService", () => {
  it("exposes its operations as functions", () => {
    expect(receiptsService).toBeTypeOf("object");
    expect(Object.keys(receiptsService).length).toBeGreaterThan(0);
    Object.values(receiptsService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

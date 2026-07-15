/** @format */

import { describe, it, expect } from "vitest";
import { searchService } from "./search.service";

describe("searchService", () => {
  it("exposes its operations as functions", () => {
    expect(searchService).toBeTypeOf("object");
    expect(Object.keys(searchService).length).toBeGreaterThan(0);
    Object.values(searchService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

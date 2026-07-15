/** @format */

import { describe, it, expect } from "vitest";
import { specialNotesService } from "./specialNotes.service";

describe("specialNotesService", () => {
  it("exposes its operations as functions", () => {
    expect(specialNotesService).toBeTypeOf("object");
    expect(Object.keys(specialNotesService).length).toBeGreaterThan(0);
    Object.values(specialNotesService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

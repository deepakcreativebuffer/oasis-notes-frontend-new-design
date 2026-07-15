/** @format */

import { describe, it, expect } from "vitest";
import { adminNotesLibraryService } from "./notesLibrary.service";

describe("adminNotesLibraryService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminNotesLibraryService).toBeTypeOf("object");
    expect(adminNotesLibraryService).not.toBeNull();
    const values = Object.values(adminNotesLibraryService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

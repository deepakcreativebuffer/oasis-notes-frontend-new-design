/** @format */

import { describe, it, expect } from "vitest";
import { validateFile, ALLOWED_TYPES } from "./uploadValidation";

const makeFile = (type, sizeBytes = 1) =>
  new File(["x".repeat(sizeBytes)], "doc", { type });

describe("validateFile", () => {
  it("should reject when no file is provided", () => {
    expect(validateFile(null)).toEqual({
      isValid: false,
      message: "No file selected.",
    });
  });

  it("should reject a disallowed file type", () => {
    const result = validateFile(makeFile("application/x-msdownload"), {
      allowedTypes: ["image/png"],
    });
    // WHY: uploads into a patient chart must be limited to expected document
    // types; an executable masquerading as an attachment is rejected.
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/invalid file type/i);
  });

  it("should reject a file over the size limit", () => {
    const result = validateFile(makeFile("image/png", 10), {
      maxSizeMB: 0,
      allowedTypes: ["image/png"],
    });
    expect(result.isValid).toBe(false);
    expect(result.message).toMatch(/file size should be less than/i);
  });

  it("should accept a valid file within type and size limits", () => {
    const result = validateFile(makeFile("image/png", 5), {
      maxSizeMB: 2,
      allowedTypes: ["image/png"],
    });
    expect(result).toEqual({ isValid: true, message: "File is valid." });
  });

  it("should expose standardized allowed-type constants", () => {
    expect(ALLOWED_TYPES.IMAGES).toContain("image/png");
    expect(ALLOWED_TYPES.DOCUMENTS).toContain("application/pdf");
  });
});

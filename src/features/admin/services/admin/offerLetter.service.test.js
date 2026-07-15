/** @format */

import { describe, it, expect } from "vitest";
import { adminOfferLetterService } from "./offerLetter.service";

describe("adminOfferLetterService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminOfferLetterService).toBeTypeOf("object");
    expect(adminOfferLetterService).not.toBeNull();
    const values = Object.values(adminOfferLetterService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

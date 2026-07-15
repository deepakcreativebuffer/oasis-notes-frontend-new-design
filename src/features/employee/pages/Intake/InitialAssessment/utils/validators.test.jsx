/** @format */

import { describe, it, expect } from "vitest";
import {
  isWitnessIncomplete,
  allPenSignaturesHaveNames,
  hasAnyTypedSignature,
} from "./validators";

// Pure signature-validation helpers — exercise each branch with empty/edge inputs.
describe("validators", () => {
  describe("isWitnessIncomplete", () => {
    it("returns false when signatures is null/undefined", () => {
      // WHY: optional chaining must guard a missing object
      expect(isWitnessIncomplete(undefined)).toBe(false);
      expect(isWitnessIncomplete(null)).toBe(false);
      expect(isWitnessIncomplete({})).toBe(false);
    });

    it("returns true when a witness image exists but the name is missing", () => {
      expect(
        isWitnessIncomplete({
          witness: { rawSignatureImage: "data:image/png;base64,AAA" },
        }),
      ).toBe(true);
    });

    it("returns true when name is only whitespace", () => {
      expect(
        isWitnessIncomplete({
          witness: { name: "   ", rawSignatureImage: "img" },
        }),
      ).toBe(true);
    });

    it("returns true for the 'undefined undefined' sentinel name", () => {
      // WHY: a name built from two undefined parts is treated as absent
      expect(
        isWitnessIncomplete({
          witness: { name: "undefined undefined", rawSignatureImage: "img" },
        }),
      ).toBe(true);
    });

    it("returns false when both image and a valid name are present", () => {
      expect(
        isWitnessIncomplete({
          witness: { name: "Test Patient", rawSignatureImage: "img" },
        }),
      ).toBe(false);
    });

    it("returns false when there is a name but no signature image", () => {
      // WHY: incompleteness only matters once an image was drawn
      expect(
        isWitnessIncomplete({
          witness: { name: "Test Patient" },
        }),
      ).toBe(false);
    });

    it("returns false when neither name nor image is present", () => {
      expect(isWitnessIncomplete({ witness: {} })).toBe(false);
    });
  });

  describe("allPenSignaturesHaveNames", () => {
    it("returns true for null/undefined/empty input", () => {
      expect(allPenSignaturesHaveNames(undefined)).toBe(true);
      expect(allPenSignaturesHaveNames(null)).toBe(true);
      expect(allPenSignaturesHaveNames({})).toBe(true);
    });

    it("returns true when entries without images skip the name requirement", () => {
      // WHY: only pen (raw image) signatures must carry a name
      expect(
        allPenSignaturesHaveNames({
          a: { name: "Test Patient" },
          b: {},
        }),
      ).toBe(true);
    });

    it("returns true when every pen signature has a non-empty name", () => {
      expect(
        allPenSignaturesHaveNames({
          a: { rawSignatureImage: "img", name: "Test Patient" },
          b: { rawSignatureImage: "img2", name: "emp-test-001" },
        }),
      ).toBe(true);
    });

    it("returns false when a pen signature is missing its name", () => {
      expect(
        allPenSignaturesHaveNames({
          a: { rawSignatureImage: "img", name: "Test Patient" },
          b: { rawSignatureImage: "img2" },
        }),
      ).toBe(false);
    });

    it("returns false when a pen signature name is only whitespace", () => {
      expect(
        allPenSignaturesHaveNames({
          a: { rawSignatureImage: "img", name: "   " },
        }),
      ).toBe(false);
    });

    it("ignores null/undefined entries gracefully", () => {
      expect(
        allPenSignaturesHaveNames({
          a: null,
          b: undefined,
        }),
      ).toBe(true);
    });
  });

  describe("hasAnyTypedSignature", () => {
    it("returns false when nothing is provided", () => {
      expect(
        hasAnyTypedSignature({
          bhpSignature: "",
          adminSignature: "",
          signatures: {},
        }),
      ).toBe(false);
    });

    it("returns false when signatures is omitted entirely", () => {
      expect(hasAnyTypedSignature({})).toBe(false);
    });

    it("returns true when a bhpSignature is present", () => {
      expect(hasAnyTypedSignature({ bhpSignature: "Test Patient" })).toBe(true);
    });

    it("returns true when an adminSignature is present", () => {
      expect(hasAnyTypedSignature({ adminSignature: "emp-test-001" })).toBe(
        true,
      );
    });

    it("returns true when any signature carries a raw pen image", () => {
      // WHY: a drawn signature counts even without typed bhp/admin values
      expect(
        hasAnyTypedSignature({
          signatures: { patient: { rawSignatureImage: "img" } },
        }),
      ).toBe(true);
    });

    it("returns false when pen signatures lack images", () => {
      expect(
        hasAnyTypedSignature({
          signatures: { patient: { name: "Test Patient" } },
        }),
      ).toBe(false);
    });
  });
});

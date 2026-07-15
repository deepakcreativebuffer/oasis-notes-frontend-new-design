/** @format */

import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import AssessmentSignatureSection from "./SignatureSection";

// WHY: SignatureSection is a temporarily-disabled stub (Phase 2 placeholder)
// that intentionally renders null. These tests pin that contract so the empty
// render is a deliberate, documented state rather than an accidental regression.
describe("AssessmentSignatureSection", () => {
  it("should export a component (function)", () => {
    expect(typeof AssessmentSignatureSection).toBe("function");
  });

  it("should render nothing (disabled Phase 2 stub)", () => {
    const { container } = renderWithProviders(<AssessmentSignatureSection />);

    // WHY: the stub returns null, so the wrapped render produces no DOM of its own.
    expect(container).toBeEmptyDOMElement();
  });

  it("should mount without throwing when given props", () => {
    // WHY: a placeholder must tolerate any props its eventual call sites pass.
    expect(() =>
      renderWithProviders(
        <AssessmentSignatureSection
          residentId="res-test-001"
          employeeId="emp-test-001"
        />,
      ),
    ).not.toThrow();
  });
});

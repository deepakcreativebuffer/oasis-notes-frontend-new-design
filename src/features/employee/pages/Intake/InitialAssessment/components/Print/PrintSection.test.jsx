/** @format */

import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/test-utils";
import PrintSection from "./PrintSection";

// PrintSection is a temporarily-disabled stub (Phase 2 placeholder) that
// renders null. These tests pin that contract so a future re-enable is a
// deliberate change picked up by the suite rather than a silent regression.
describe("PrintSection", () => {
  it("exports a component function", () => {
    // WHY: a default-exported React component is the public contract callers
    // depend on; assert shape before asserting render behaviour.
    expect(PrintSection).toBeTypeOf("function");
  });

  it("renders nothing while disabled", () => {
    const { container } = renderWithProviders(<PrintSection />);

    // WHY: the stub returns null, so it must contribute no DOM. An empty
    // container confirms the placeholder is truly inert.
    expect(container).toBeEmptyDOMElement();
  });

  it("mounts without throwing", () => {
    // WHY: even a null-rendering placeholder must mount cleanly under the app
    // providers so it can be wired into the print flow later without crashing.
    expect(() => renderWithProviders(<PrintSection />)).not.toThrow();
  });
});

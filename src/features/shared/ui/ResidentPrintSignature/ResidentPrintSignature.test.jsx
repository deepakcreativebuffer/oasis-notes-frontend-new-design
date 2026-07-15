/** @format */

import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import ResidentPrintSignature from "./ResidentPrintSignature";

describe("ResidentPrintSignature", () => {
  it("should render nothing (temporarily disabled per client request)", () => {
    // WHY: the standalone resident/representative signature print row is hidden
    // for BHP/BHT/Admin; this pins it to null so a future change is deliberate.
    const { container } = render(<ResidentPrintSignature />);
    expect(container).toBeEmptyDOMElement();
  });
});

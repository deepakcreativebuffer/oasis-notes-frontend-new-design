/** @format */

import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import QuickLinkLoader from "./QuickLinkLoader";

describe("QuickLinkLoader", () => {
  it("should render the spinner container", () => {
    const { container } = render(<QuickLinkLoader />);
    expect(container.querySelector(".quickLinkLoader")).not.toBeNull();
  });
});

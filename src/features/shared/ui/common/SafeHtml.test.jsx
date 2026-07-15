/** @format */

import { describe, it, expect } from "vitest";
import { render } from "@/test-utils";
import SafeHtml from "./SafeHtml";

// Uses the real sanitizeHtml (DOMPurify) so these tests prove actual XSS
// protection, not a mocked stand-in.
describe("SafeHtml", () => {
  it("should render allowed formatting markup", () => {
    const { container } = render(
      <SafeHtml html="<strong>Bold note</strong>" />,
    );
    expect(container.querySelector("strong")).not.toBeNull();
    expect(container.textContent).toContain("Bold note");
  });

  it("should strip <script> tags from untrusted HTML", () => {
    const { container } = render(
      <SafeHtml html={"<p>Clinical note</p><script>alert(1)</script>"} />,
    );
    // WHY: clinical notes can contain pasted/rich HTML; an embedded script
    // would be a stored-XSS vector against staff viewing the chart.
    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toContain("alert(1)");
    expect(container.textContent).toContain("Clinical note");
  });

  it("should strip inline event-handler attributes", () => {
    const { container } = render(
      <SafeHtml html={'<img src="x" onerror="alert(1)" />'} />,
    );
    expect(container.innerHTML).not.toContain("onerror");
  });

  it("should render into a custom element via the `as` prop", () => {
    const { container } = render(<SafeHtml as="span" html="<em>inline</em>" />);
    expect(container.querySelector("span")).not.toBeNull();
    expect(container.querySelector("span em")).not.toBeNull();
  });

  it("should forward className and extra props to the wrapper element", () => {
    const { container } = render(
      <SafeHtml html="<i>x</i>" className="note-body" id="note-1" />,
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("note-body");
    expect(wrapper).toHaveAttribute("id", "note-1");
  });

  it("should render an empty wrapper when no html is provided", () => {
    const { container } = render(<SafeHtml />);
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent).toBe("");
  });
});

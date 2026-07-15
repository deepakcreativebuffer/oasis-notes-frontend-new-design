/** @format */

import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "./sanitizeHtml";

describe("sanitizeHtml", () => {
  it("returns an empty string for non-string / nullish input", () => {
    expect(sanitizeHtml(null)).toBe("");
    expect(sanitizeHtml(undefined)).toBe("");
    expect(sanitizeHtml(42)).toBe("");
  });

  it("keeps safe markup intact", () => {
    expect(sanitizeHtml("<p>hello <b>world</b></p>")).toBe(
      "<p>hello <b>world</b></p>",
    );
  });

  it("strips script tags to prevent XSS", () => {
    const out = sanitizeHtml("<div>ok</div><script>alert(1)</script>");
    expect(out).toContain("ok");
    expect(out).not.toContain("<script>");
  });
});

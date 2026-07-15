/** @format */

import { describe, it, expect, vi } from "vitest";

import { getObjectUrlFromDownloadUrl } from "./media.api";

// Mock the two deps directly so importing this tiny helper doesn't pull the
// whole @/utils barrel (which transitively loads the axios baseApi stack).
vi.mock("../../config/env", () => ({
  default: { CLOUDFRONT_URL: "https://cdn.test/" },
}));
vi.mock("@/utils", () => ({ logger: { error: vi.fn() } }));

describe("getObjectUrlFromDownloadUrl", () => {
  it("returns null for empty input", () => {
    expect(getObjectUrlFromDownloadUrl("")).toBeNull();
    expect(getObjectUrlFromDownloadUrl(null)).toBeNull();
  });

  it("prefixes the CloudFront base URL onto the path", () => {
    expect(getObjectUrlFromDownloadUrl("docs/a.png")).toBe(
      "https://cdn.test/docs/a.png",
    );
  });
});

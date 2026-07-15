/** @format */

import { describe, it, expect, vi, afterEach } from "vitest";
import {
  createFormData,
  getFilePreview,
  revokeFilePreview,
} from "./uploadHelpers";

const file = (name) => new File(["x"], name, { type: "image/png" });

describe("uploadHelpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createFormData", () => {
    it("should append a single file under the given key", () => {
      const f = file("scan.png");
      const fd = createFormData("image", f);
      expect(fd.get("image")).toBe(f);
    });

    it("should append multiple files under the same key", () => {
      const fd = createFormData("docs", [file("a.png"), file("b.png")]);
      expect(fd.getAll("docs")).toHaveLength(2);
    });

    it("should append additional data but skip null/undefined fields", () => {
      const fd = createFormData("image", file("a.png"), {
        patientId: "res-test-001",
        note: null,
        extra: undefined,
      });
      expect(fd.get("patientId")).toBe("res-test-001");
      expect(fd.has("note")).toBe(false);
      expect(fd.has("extra")).toBe(false);
    });
  });

  describe("getFilePreview", () => {
    it("should create an object URL for a file", () => {
      vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:preview");
      expect(getFilePreview(file("a.png"))).toBe("blob:preview");
    });

    it("should return an empty string for no file", () => {
      expect(getFilePreview(null)).toBe("");
    });
  });

  describe("revokeFilePreview", () => {
    it("should revoke only blob: URLs", () => {
      const spy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      revokeFilePreview("blob:abc");
      expect(spy).toHaveBeenCalledWith("blob:abc");
    });

    it("should ignore non-blob URLs and empty values", () => {
      const spy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      revokeFilePreview("https://example.com/x.png");
      revokeFilePreview("");
      // WHY: only object URLs we created should be revoked; revoking a remote
      // src would be a no-op/error and is never intended.
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

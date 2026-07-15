/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useFileUpload } from "./useFileUpload";
import { validateFile } from "@/utils/upload/uploadValidation";
import {
  getFilePreview,
  revokeFilePreview,
} from "@/utils/upload/uploadHelpers";
import { showNotification } from "@/utils";

// Mock the upload utilities so the hook is tested in isolation — no real
// File validation, no real object-URL allocation. Factories are hoisted.
vi.mock("@/utils/upload/uploadValidation", () => ({
  validateFile: vi.fn(),
}));
vi.mock("@/utils/upload/uploadHelpers", () => ({
  getFilePreview: vi.fn(() => "blob:preview-url"),
  revokeFilePreview: vi.fn(),
}));
vi.mock("@/utils", () => ({
  showNotification: vi.fn(),
}));

// Test fixtures — fake documents only, never real PHI files.
const imageFile = new File(["x"], "scan.png", { type: "image/png" });
const pdfFile = new File(["x"], "intake.pdf", { type: "application/pdf" });

const VALID = { isValid: true, message: "File is valid." };
const INVALID_TYPE = {
  isValid: false,
  message: "Invalid file type. Allowed: image/jpeg, image/png, application/pdf",
};

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default every file to valid; error-path tests override per-case.
    vi.mocked(validateFile).mockReturnValue(VALID);
  });

  describe("initial state", () => {
    it("should expose empty state and handler functions before any file is selected", () => {
      const { result } = renderHook(() => useFileUpload());

      expect(result.current.file).toBeNull();
      expect(result.current.preview).toBe("");
      expect(result.current.error).toBeNull();
      expect(result.current.isDragging).toBe(false);
      expect(typeof result.current.handleFileChange).toBe("function");
      expect(typeof result.current.onSelectFile).toBe("function");
      expect(typeof result.current.onDrop).toBe("function");
    });
  });

  describe("handleFileChange — happy path", () => {
    it("should accept a valid image, store the file, and generate a preview", () => {
      const { result } = renderHook(() => useFileUpload());

      let returned;
      act(() => {
        returned = result.current.handleFileChange(imageFile);
      });

      // WHY: an accepted image document gets a thumbnail so staff can confirm
      // they uploaded the right scan before submitting.
      expect(returned).toBe(true);
      expect(result.current.file).toBe(imageFile);
      expect(getFilePreview).toHaveBeenCalledWith(imageFile);
      expect(result.current.preview).toBe("blob:preview-url");
      expect(result.current.error).toBeNull();
    });

    it("should accept a valid non-image (PDF) without producing an image preview", () => {
      const { result } = renderHook(() => useFileUpload());

      let returned;
      act(() => {
        returned = result.current.handleFileChange(pdfFile);
      });

      expect(returned).toBe(true);
      expect(result.current.file).toBe(pdfFile);
      // WHY: PDFs/docs have no inline thumbnail; preview stays empty so the UI
      // shows a generic file chip instead of a broken image.
      expect(getFilePreview).not.toHaveBeenCalled();
      expect(result.current.preview).toBe("");
    });

    it("should pass the configured maxSizeMB and allowedTypes through to validateFile", () => {
      const { result } = renderHook(() =>
        useFileUpload({ maxSizeMB: 5, allowedTypes: ["application/pdf"] }),
      );

      act(() => {
        result.current.handleFileChange(pdfFile);
      });

      expect(validateFile).toHaveBeenCalledWith(pdfFile, {
        maxSizeMB: 5,
        allowedTypes: ["application/pdf"],
      });
    });
  });

  describe("handleFileChange — validation error path", () => {
    it("should reject an invalid file, surface the error, notify the user, and store nothing", () => {
      vi.mocked(validateFile).mockReturnValue(INVALID_TYPE);
      const { result } = renderHook(() => useFileUpload());

      let returned;
      act(() => {
        returned = result.current.handleFileChange(imageFile);
      });

      expect(returned).toBe(false);
      expect(result.current.error).toBe(INVALID_TYPE.message);
      // WHY: rejecting an oversized/wrong-type upload must give the user a
      // visible reason — a silently dropped clinical document is a safety risk.
      expect(showNotification).toHaveBeenCalledWith({
        message: INVALID_TYPE.message,
        type: "danger",
      });
      expect(result.current.file).toBeNull();
      expect(result.current.preview).toBe("");
    });

    it("should clear a previously accepted file when a later invalid file is chosen", () => {
      const { result } = renderHook(() => useFileUpload());

      act(() => {
        result.current.handleFileChange(imageFile);
      });
      expect(result.current.file).toBe(imageFile);

      vi.mocked(validateFile).mockReturnValue(INVALID_TYPE);
      act(() => {
        result.current.handleFileChange(imageFile);
      });

      expect(result.current.file).toBeNull();
      expect(result.current.error).toBe(INVALID_TYPE.message);
    });
  });

  describe("onSelectFile (input change)", () => {
    it("should read the first selected file from the input event and process it", () => {
      const { result } = renderHook(() => useFileUpload());

      act(() => {
        result.current.onSelectFile({ target: { files: [imageFile] } });
      });

      expect(validateFile).toHaveBeenCalledWith(imageFile, expect.any(Object));
      expect(result.current.file).toBe(imageFile);
    });
  });

  describe("drag and drop", () => {
    it("should set isDragging true and prevent default on drag over", () => {
      const { result } = renderHook(() => useFileUpload());
      const preventDefault = vi.fn();

      act(() => {
        result.current.onDragOver({ preventDefault });
      });

      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(result.current.isDragging).toBe(true);
    });

    it("should set isDragging false on drag leave", () => {
      const { result } = renderHook(() => useFileUpload());

      act(() => {
        result.current.onDragOver({ preventDefault: vi.fn() });
      });
      act(() => {
        result.current.onDragLeave();
      });

      expect(result.current.isDragging).toBe(false);
    });

    it("should accept a dropped file, clear the dragging state, and prevent default", () => {
      const { result } = renderHook(() => useFileUpload());
      const preventDefault = vi.fn();

      act(() => {
        result.current.onDrop({
          preventDefault,
          dataTransfer: { files: [imageFile] },
        });
      });

      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(result.current.isDragging).toBe(false);
      expect(result.current.file).toBe(imageFile);
    });
  });

  describe("clearFile", () => {
    it("should reset file, preview, and error back to their empty defaults", () => {
      const { result } = renderHook(() => useFileUpload());

      act(() => {
        result.current.handleFileChange(imageFile);
      });
      expect(result.current.file).toBe(imageFile);

      act(() => {
        result.current.clearFile();
      });

      expect(result.current.file).toBeNull();
      expect(result.current.preview).toBe("");
      expect(result.current.error).toBeNull();
    });
  });

  describe("preview cleanup on unmount (edge cases)", () => {
    it("should revoke the object URL on unmount when autoClear is enabled", () => {
      const { result, unmount } = renderHook(() => useFileUpload());

      act(() => {
        result.current.handleFileChange(imageFile);
      });
      expect(result.current.preview).toBe("blob:preview-url");

      unmount();

      // WHY: object URLs hold the file (potential PHI) in memory; revoking on
      // unmount prevents a leak when the upload widget closes.
      expect(revokeFilePreview).toHaveBeenCalledWith("blob:preview-url");
    });

    it("should NOT revoke the preview on unmount when autoClear is disabled", () => {
      const { result, unmount } = renderHook(() =>
        useFileUpload({ autoClear: false }),
      );

      act(() => {
        result.current.handleFileChange(imageFile);
      });

      unmount();

      expect(revokeFilePreview).not.toHaveBeenCalled();
    });

    it("should do nothing when handleFileChange is called with no file", () => {
      const { result } = renderHook(() => useFileUpload());

      let returned;
      act(() => {
        returned = result.current.handleFileChange(undefined);
      });

      // Early return guards against an empty/cancelled file dialog selection.
      expect(returned).toBeUndefined();
      expect(validateFile).not.toHaveBeenCalled();
      expect(result.current.file).toBeNull();
    });
  });
});

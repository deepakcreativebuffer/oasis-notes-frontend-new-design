/** @format */

import { vi, describe, it, expect, beforeEach } from "vitest";
import * as mod from "./upload.api";
import { uploadService } from "./upload.service";
import { UPLOAD_TIMEOUT_MS } from "@/features/shared/constants";
import api from "../../baseApi";
import { handleApiRequest } from "../../core/errorHandler";

vi.mock("../../baseApi", () => ({
  default: {
    post: vi.fn(() => Promise.resolve({ success: true, data: "post_result" })),
  },
}));

vi.mock("../../core/errorHandler", () => ({
  handleApiRequest: vi.fn((fn) => fn()),
}));

vi.mock("../../Apis", () => ({
  EMPLOYEE_APIS: {
    CREATE_UPLOAD_DOCUMENT: (id) =>
      `employee/createUploadDocumentOnebyoneByPatientId/${id}`,
  },
}));

vi.mock("@/utils", () => ({
  showNotification: vi.fn(),
  logger: {
    error: vi.fn(),
  },
}));

vi.mock("./upload.service", () => ({
  uploadService: {
    uploadMultiple: vi.fn(() =>
      Promise.resolve({ success: true, data: "multiple_result" }),
    ),
    uploadSingle: vi.fn(() =>
      Promise.resolve({ success: true, data: "single_result" }),
    ),
  },
}));

describe("upload.api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(handleApiRequest).mockImplementation(async (fn) => {
      try {
        const res = await fn();
        return { success: true, data: res };
      } catch (err) {
        return { success: false, error: err };
      }
    });
  });

  it("exports at least one callable", () => {
    const fns = Object.values(mod).filter((v) => typeof v === "function");
    expect(fns.length).toBeGreaterThan(0);
  });

  it("has no undefined named exports", () => {
    Object.entries(mod).forEach(([k, v]) => expect(v, k).toBeDefined());
  });

  describe("uploadDocument", () => {
    it("should POST directly using api.post if payload is FormData", async () => {
      const formData = new FormData();
      const patientId = "patient-123";

      await mod.uploadDocument({
        payload: formData,
        patitentId: patientId,
      });

      expect(api.post).toHaveBeenCalledWith(
        `employee/createUploadDocumentOnebyoneByPatientId/${patientId}`,
        formData,
        {
          timeout: UPLOAD_TIMEOUT_MS,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      expect(uploadService.uploadMultiple).not.toHaveBeenCalled();
    });

    it("should destructure payload if it is a plain object containing a 'file' property", async () => {
      const file = new File(["dummy"], "test.pdf", { type: "application/pdf" });
      const payload = {
        file,
        type: "Shift Progress Note",
        otherField: "val",
      };
      const patientId = "patient-123";

      await mod.uploadDocument({
        payload,
        patitentId: patientId,
      });

      expect(uploadService.uploadMultiple).toHaveBeenCalledWith(
        `employee/createUploadDocumentOnebyoneByPatientId/${patientId}`,
        "file",
        file,
        {
          type: "Shift Progress Note",
          otherField: "val",
        },
      );
      expect(api.post).not.toHaveBeenCalled();
    });

    it("should pass the payload directly to uploadMultiple if it does not contain 'file'", async () => {
      const payload = ["file1", "file2"];
      const patientId = "patient-123";

      await mod.uploadDocument({
        payload,
        patitentId: patientId,
      });

      expect(uploadService.uploadMultiple).toHaveBeenCalledWith(
        `employee/createUploadDocumentOnebyoneByPatientId/${patientId}`,
        "file",
        payload,
      );
      expect(api.post).not.toHaveBeenCalled();
    });
  });
});

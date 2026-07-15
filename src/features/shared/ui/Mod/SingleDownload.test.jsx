/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils";

import SingleDownload from "./SingleDownload";
import { startPdfJob } from "../../services";
import { showNotification } from "@/utils";

const socket = {
  id: "socket-1",
  once: vi.fn(),
  emit: vi.fn(),
  off: vi.fn(),
};
vi.mock("@/socket", () => ({ getSocket: () => socket }));
vi.mock("../../services", () => ({ startPdfJob: vi.fn() }));
vi.mock("@/utils", () => ({
  showNotification: vi.fn(),
  PDF_PROCESSING_ERROR_MESSAGE: "PDF failed",
}));

const baseProps = (overrides = {}) => ({
  documents: "MAR",
  documentId: "doc-1",
  panel: "Resident",
  rowId: "row-1",
  isDownloading: false,
  currentDownloadId: null,
  setDownloadingId: vi.fn(),
  ...overrides,
});

const clickIcon = async (container) => {
  const user = userEvent.setup();
  await user.click(container.querySelector("i"));
};

describe("SingleDownload", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should start a pdf job with the document type and mark the row downloading", async () => {
    startPdfJob.mockResolvedValue({ success: true });
    const props = baseProps();
    const { container } = renderWithProviders(<SingleDownload {...props} />);

    await clickIcon(container);

    expect(props.setDownloadingId).toHaveBeenCalledWith("row-1");
    expect(startPdfJob).toHaveBeenCalledWith(
      expect.objectContaining({ type: "MAR", documentId: "doc-1" }),
    );
  });

  it("should not start a new job while one is already downloading", async () => {
    const props = baseProps({
      isDownloading: true,
      currentDownloadId: "row-1",
    });
    const { container } = renderWithProviders(<SingleDownload {...props} />);

    await clickIcon(container);

    // WHY: concurrent PDF jobs would race the socket; the active download blocks
    // re-triggering.
    expect(startPdfJob).not.toHaveBeenCalled();
  });

  it("should surface an error and reset state when the job fails to start", async () => {
    startPdfJob.mockResolvedValue({ success: false, message: "boom" });
    const props = baseProps();
    const { container } = renderWithProviders(<SingleDownload {...props} />);

    await clickIcon(container);

    expect(showNotification).toHaveBeenCalledWith({
      message: "boom",
      type: "danger",
    });
    expect(props.setDownloadingId).toHaveBeenLastCalledWith(null);
  });
});

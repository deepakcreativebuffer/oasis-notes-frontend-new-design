/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import UnifiedFileUpload from "./UnifiedFileUpload";
import { useFileUpload } from "@shared/hooks";

// The component delegates all selection/validation/preview logic to the
// useFileUpload hook (which itself reaches into URL.createObjectURL and the
// upload utils). We mock the hook so each render branch of the presentational
// component can be driven deterministically without real File IO.
const hookState = {
  file: null,
  preview: "",
  error: null,
  isDragging: false,
  onSelectFile: vi.fn(),
  onDragOver: vi.fn(),
  onDragLeave: vi.fn(),
  onDrop: vi.fn(),
};

vi.mock("@shared/hooks", () => ({
  useFileUpload: vi.fn(() => hookState),
}));

function resetHookState(overrides = {}) {
  Object.assign(hookState, {
    file: null,
    preview: "",
    error: null,
    isDragging: false,
    onSelectFile: vi.fn(),
    onDragOver: vi.fn(),
    onDragLeave: vi.fn(),
    onDrop: vi.fn(),
    ...overrides,
  });
}

describe("UnifiedFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHookState();
  });

  it("should render the default label and a file input", () => {
    render(<UnifiedFileUpload />);

    // WHY: clinicians need a clearly labelled file picker to attach scans
    // (e.g. ID, insurance card) to a patient record.
    expect(screen.getByText("Choose File")).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", ".jpg,.png,.pdf");
  });

  it("should render a custom label and required asterisk when required", () => {
    render(<UnifiedFileUpload label="Upload ID" required />);

    // WHY: required uploads (e.g. mandatory consent docs) must be visually
    // flagged so staff cannot skip them.
    expect(screen.getByText(/Upload ID/)).toBeInTheDocument();
    expect(screen.getByText(/\*/)).toBeInTheDocument();
  });

  it("should forward maxSizeMB and allowedTypes into the upload hook", () => {
    const allowedTypes = ["image/png"];
    render(<UnifiedFileUpload maxSizeMB={5} allowedTypes={allowedTypes} />);

    // WHY: size/type limits are policy-driven (PHI document constraints) and
    // must reach the validation hook unchanged.
    expect(useFileUpload).toHaveBeenCalledWith({
      maxSizeMB: 5,
      allowedTypes,
    });
  });

  it("should call the hook's onSelectFile when a file is chosen", () => {
    const onSelect = vi.fn();
    resetHookState({ onSelectFile: onSelect });
    render(<UnifiedFileUpload />);

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [] } });

    // WHY: selecting a file must hand off to the hook that validates type/size
    // before the document is accepted.
    expect(onSelect).toHaveBeenCalled();
  });

  it("should notify the parent of the selected file via onFileSelect", () => {
    const onFileSelect = vi.fn();
    const fakeFile = { name: "scan.png", type: "image/png", size: 10 };
    resetHookState({ file: fakeFile });
    render(<UnifiedFileUpload onFileSelect={onFileSelect} />);

    // WHY: the parent form needs the validated file to submit it alongside the
    // patient record.
    expect(onFileSelect).toHaveBeenCalledWith(fakeFile);
  });

  it("should show the validation error message when the hook reports one", () => {
    resetHookState({ error: "Invalid file type. Allowed: image/png" });
    render(<UnifiedFileUpload />);

    // WHY: rejecting an unsupported upload must tell the user why so they can
    // attach a compliant document.
    expect(
      screen.getByText("Invalid file type. Allowed: image/png"),
    ).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]');
    expect(input).toHaveClass("is-invalid");
  });

  it("should render an image preview when a preview url is present", () => {
    resetHookState({ preview: "blob:preview-123" });
    render(<UnifiedFileUpload />);

    // WHY: showing a thumbnail lets staff confirm the right scan was attached
    // before saving to the chart.
    const img = screen.getByAltText("Upload Preview");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "blob:preview-123");
  });

  it("should not render a preview when showPreview is false", () => {
    resetHookState({ preview: "blob:preview-123" });
    render(<UnifiedFileUpload showPreview={false} />);

    // WHY: some upload contexts (e.g. PDFs) intentionally suppress the image
    // preview.
    expect(screen.queryByAltText("Upload Preview")).not.toBeInTheDocument();
  });

  it("should disable the input while uploading", () => {
    render(<UnifiedFileUpload uploading />);

    // WHY: blocking re-selection mid-upload prevents corrupting an in-flight
    // document transfer.
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeDisabled();
  });

  it("should render an upload progress bar when uploading with progress", () => {
    render(<UnifiedFileUpload uploading progress={42} />);

    // WHY: large scans need visible progress so staff don't navigate away and
    // abort the transfer.
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should not render a progress bar when progress is zero", () => {
    render(<UnifiedFileUpload uploading progress={0} />);

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("should wire drag-and-drop handlers from the hook", () => {
    const onDragOver = vi.fn();
    const onDrop = vi.fn();
    resetHookState({ onDragOver, onDrop });
    const { container } = render(<UnifiedFileUpload />);

    const dropZone = container.querySelector(".unified-upload-container");
    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone);

    // WHY: drag-and-drop is a primary way staff attach scanned documents, so
    // both handlers must be bound to the drop zone.
    expect(onDragOver).toHaveBeenCalled();
    expect(onDrop).toHaveBeenCalled();
  });

  it("should apply the dragging class while a file is being dragged over", () => {
    resetHookState({ isDragging: true });
    const { container } = render(<UnifiedFileUpload />);

    // WHY: the highlighted drop zone gives visual feedback that a dragged file
    // will be accepted on release.
    expect(container.querySelector(".unified-upload-container")).toHaveClass(
      "dragging",
    );
  });
});

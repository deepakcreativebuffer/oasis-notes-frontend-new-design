/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import TextEditor from "./TextEditor";

// react-quill is a heavy rich-text editor that needs real DOM ranges/selection
// jsdom lacks; stub it with a controlled <textarea> that forwards value/onChange
// and exposes getEditor().format via ref so the defaultBullet branch can run.
const formatSpy = vi.fn();
vi.mock("react-quill", () => ({
  default: React.forwardRef(
    ({ value, onChange, readOnly, style, theme }, ref) => {
      React.useImperativeHandle(ref, () => ({
        getEditor: () => ({ format: formatSpy }),
      }));
      // handleRef in the component is a callback ref; useImperativeHandle only
      // populates when react attaches the ref node, which it does here.
      return (
        <textarea
          aria-label="text editor"
          data-theme={theme}
          data-style={style ? JSON.stringify(style) : ""}
          value={value ?? ""}
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    },
  ),
}));

describe("TextEditor", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the editor with the provided value", () => {
    render(<TextEditor value="Test note body" setValue={vi.fn()} />);
    // WHY: clinicians' existing chart text must be shown for review/editing.
    expect(screen.getByLabelText("text editor")).toHaveValue("Test note body");
  });

  it("should call setValue when the user edits the note text", () => {
    const setValue = vi.fn();
    render(<TextEditor value="" setValue={setValue} />);

    fireEvent.change(screen.getByLabelText("text editor"), {
      target: { value: "MRN-TEST-001 update" },
    });
    // WHY: edits to a clinical note must propagate so the parent can persist them.
    expect(setValue).toHaveBeenCalledWith("MRN-TEST-001 update");
  });

  it("should mark the editor read-only when read is true", () => {
    render(<TextEditor value="Locked note" setValue={vi.fn()} read />);
    // WHY: signed/finalized chart entries are view-only and must not be edited.
    expect(screen.getByLabelText("text editor")).toHaveAttribute("readonly");
  });

  it("should be editable when read is not set", () => {
    render(<TextEditor value="Draft" setValue={vi.fn()} />);
    expect(screen.getByLabelText("text editor")).not.toHaveAttribute(
      "readonly",
    );
  });

  it("should apply width and height style only when both are provided", () => {
    render(
      <TextEditor value="" setValue={vi.fn()} width="300px" height="120px" />,
    );
    const style = screen
      .getByLabelText("text editor")
      .getAttribute("data-style");
    // WHY: layout-constrained chart panels pass explicit dimensions to the editor.
    expect(JSON.parse(style)).toEqual({ width: "300px", height: "120px" });
  });

  it("should not apply inline style when only one dimension is provided", () => {
    render(<TextEditor value="" setValue={vi.fn()} width="300px" />);
    // WHY: partial sizing is ignored so the editor falls back to its default size.
    expect(
      screen.getByLabelText("text editor").getAttribute("data-style"),
    ).toBe("");
  });

  it("should default the editor to bullet-list formatting when defaultBullet is true", () => {
    render(<TextEditor value="" setValue={vi.fn()} defaultBullet />);
    // WHY: certain note templates (e.g. care-plan items) start as a bullet list.
    expect(formatSpy).toHaveBeenCalledWith("list", "bullet");
  });

  it("should not force bullet formatting when defaultBullet is false", () => {
    render(<TextEditor value="" setValue={vi.fn()} />);
    expect(formatSpy).not.toHaveBeenCalled();
  });
});

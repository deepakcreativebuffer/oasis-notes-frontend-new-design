/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@/test-utils";

import MultiSelectWithEditor from "./MultiSelectEditor";

// Stub CustomMultiSelectInput (which pulls in react-select/creatable) with a
// light control that exposes its onChange so we can drive selection updates and
// assert the print-span / editor sync logic of the parent.
vi.mock("../selectors/CustomMultiSelectInput", () => ({
  default: ({ value, onChange, options }) => (
    <div>
      <button
        type="button"
        aria-label="add-migraine"
        onClick={() =>
          onChange([
            ...(Array.isArray(value) ? value : []),
            { label: "Migraine", value: "Migraine" },
          ])
        }
      >
        add
      </button>
      <button
        type="button"
        aria-label="clear-select"
        onClick={() => onChange([])}
      >
        clear
      </button>
      <span data-testid="option-count">{options?.length ?? 0}</span>
    </div>
  ),
}));

// Stub TextEditor (react-quill) with a textarea so we can read/write editorValue
// without the real Quill/canvas machinery.
vi.mock("../TextEditor/TextEditor", () => ({
  default: ({ value, setValue }) => (
    <textarea
      aria-label="editor"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  ),
}));

// Controlled harness mirroring how a parent form wires the two-way bindings.
function Harness({ initialSelect = [], initialEditor = "", options = [] }) {
  const [multiSelectValue, setMultiSelectValue] = useState(initialSelect);
  const [editorValue, setEditorValue] = useState(initialEditor);
  return (
    <>
      <MultiSelectWithEditor
        multiSelectValue={multiSelectValue}
        setMultiSelectValue={setMultiSelectValue}
        options={options}
        editorValue={editorValue}
        setEditorValue={setEditorValue}
      />
      <output data-testid="editor-state">{editorValue}</output>
      <output data-testid="select-count">{multiSelectValue.length}</output>
    </>
  );
}

describe("MultiSelectWithEditor", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the select control and the text editor", () => {
    render(<Harness options={[{ label: "Migraine", value: "Migraine" }]} />);

    // WHY: the component is the building block that pairs a diagnosis/problem
    // picker with a free-text editor; both must mount for clinicians to use it.
    expect(screen.getByLabelText("editor")).toBeInTheDocument();
    expect(screen.getByLabelText("add-migraine")).toBeInTheDocument();
    expect(screen.getByTestId("option-count")).toHaveTextContent("1");
  });

  it("should render an empty print span when no values are selected", () => {
    const { container } = render(<Harness />);

    // WHY: the print-only span mirrors selected labels for the printed chart;
    // with nothing selected it must stay empty rather than show stale text.
    const printSpan = container.querySelector(".show-print-inline");
    expect(printSpan).toBeInTheDocument();
    expect(printSpan).toHaveTextContent("");
  });

  it("should sync a newly selected label into the editor as a multi-sourced bullet", async () => {
    render(<Harness />);

    fireEvent.click(screen.getByLabelText("add-migraine"));

    // WHY: picking a problem from the select must append it to the note body as
    // a tagged <li data-source="multi"> so the editor and picker stay in sync.
    await waitFor(() =>
      expect(screen.getByTestId("editor-state")).toHaveTextContent("Migraine"),
    );
    expect(screen.getByTestId("editor-state").textContent).toContain(
      '<li data-source="multi">Migraine</li>',
    );
  });

  it("should show the selected label in the print-only span", async () => {
    const { container } = render(<Harness />);

    fireEvent.click(screen.getByLabelText("add-migraine"));

    // WHY: the printed chart relies on the inline span to render selected
    // problem labels joined by commas.
    await waitFor(() =>
      expect(container.querySelector(".show-print-inline")).toHaveTextContent(
        "Migraine",
      ),
    );
  });

  it("should remove a selected value when its bullet is deleted from the editor", async () => {
    render(
      <Harness
        initialSelect={[{ label: "Migraine", value: "Migraine" }]}
        initialEditor={'<ul><li data-source="multi">Migraine</li></ul>'}
      />,
    );

    expect(screen.getByTestId("select-count")).toHaveTextContent("1");

    // Editing the note to drop the Migraine bullet should de-select it.
    fireEvent.change(screen.getByLabelText("editor"), {
      target: { value: "<ul></ul>" },
    });

    // WHY: deleting a problem line from the note body must also remove it from
    // the structured selection so the picker never disagrees with the chart.
    await waitFor(() =>
      expect(screen.getByTestId("select-count")).toHaveTextContent("0"),
    );
  });

  it("should preserve a custom (non-multi) bullet already present in the editor", async () => {
    render(<Harness initialEditor={"<ul><li>Custom note line</li></ul>"} />);

    fireEvent.click(screen.getByLabelText("add-migraine"));

    // WHY: clinician-authored free-text lines must survive when a new picked
    // label is merged into the same <ul> block.
    await waitFor(() =>
      expect(screen.getByTestId("editor-state").textContent).toContain(
        '<li data-source="multi">Migraine</li>',
      ),
    );
    expect(screen.getByTestId("editor-state").textContent).toContain(
      "<li>Custom note line</li>",
    );
  });
});

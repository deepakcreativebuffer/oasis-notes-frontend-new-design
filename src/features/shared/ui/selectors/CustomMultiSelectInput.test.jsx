/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import CustomMultiSelectInput from "./CustomMultiSelectInput";

// Stub CreatableSelect with a plain input so we can drive onInputChange +
// onKeyDown directly and assert the wrapper's create-on-Enter logic.
vi.mock("react-select/creatable", () => ({
  default: ({ onInputChange, onKeyDown, value, isDisabled }) => (
    <input
      aria-label="creatable"
      disabled={isDisabled}
      data-count={Array.isArray(value) ? value.length : 0}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  ),
}));

describe("CustomMultiSelectInput", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should create a new option and append it to value on Enter", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelectInput value={[]} onChange={onChange} options={[]} />,
    );

    const input = screen.getByLabelText("creatable");
    fireEvent.change(input, { target: { value: "Migraine" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // WHY: clinicians type free-text tags (e.g. diagnoses) that must become
    // selectable options on Enter without a predefined list.
    expect(onChange).toHaveBeenCalledWith([
      { label: "Migraine", value: "Migraine" },
    ]);
  });

  it("should append to an existing value array", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelectInput
        value={[{ label: "Existing", value: "Existing" }]}
        onChange={onChange}
        options={[]}
      />,
    );

    const input = screen.getByLabelText("creatable");
    fireEvent.change(input, { target: { value: "New" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith([
      { label: "Existing", value: "Existing" },
      { label: "New", value: "New" },
    ]);
  });

  it("should not create an option when the input is empty", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelectInput value={[]} onChange={onChange} options={[]} />,
    );

    fireEvent.keyDown(screen.getByLabelText("creatable"), { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should forward the disabled state", () => {
    render(
      <CustomMultiSelectInput
        value={[]}
        onChange={vi.fn()}
        options={[]}
        isDisabled
      />,
    );
    expect(screen.getByLabelText("creatable")).toBeDisabled();
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SelectSinglePrint from "./SelectSinglePrint";

// WHY: SelectSinglePrint renders the shared Search wrapper, which renders
// react-select. We stub react-select to a light input we can drive and assert
// the props the component forwards (options, value, onChange, onKeyDown).
vi.mock("react-select", () => ({
  default: ({
    value,
    options,
    onChange,
    onKeyDown,
    placeholder,
    classNamePrefix,
    isCreatable,
  }) => (
    <div data-testid="rs-mock" data-prefix={classNamePrefix}>
      <span data-testid="rs-placeholder">{placeholder}</span>
      <span data-testid="rs-value">{value?.label ?? ""}</span>
      <span data-testid="rs-creatable">{String(!!isCreatable)}</span>
      <span data-testid="rs-option-count">{options?.length ?? 0}</span>
      {options?.map((o) => (
        <span key={o.value} data-testid="rs-option">
          {o.label}
        </span>
      ))}
      <button type="button" onClick={() => onChange?.(options?.[1])}>
        pick first real option
      </button>
      <input aria-label="rs-keydown" onKeyDown={(e) => onKeyDown?.(e)} />
    </div>
  ),
}));

const OPTIONS = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
];

describe("SelectSinglePrint", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the print-only label span reflecting the selected value", () => {
    renderWithProviders(
      <SelectSinglePrint
        value={{ label: "Beta", value: "beta" }}
        onChange={vi.fn()}
        options={OPTIONS}
      />,
    );
    // WHY: a hidden print-only span exposes the chosen label for the print view.
    const printSpan = document.querySelector(".show-print-inline");
    expect(printSpan).toBeInTheDocument();
    expect(printSpan).toHaveTextContent("Beta");
  });

  it("prepends a blank 'Select' option to the provided options", () => {
    renderWithProviders(
      <SelectSinglePrint value={null} onChange={vi.fn()} options={OPTIONS} />,
    );
    // WHY: component injects { label: 'Select', value: '' } ahead of options.
    expect(screen.getByTestId("rs-option-count")).toHaveTextContent("3");
    const optionLabels = screen
      .getAllByTestId("rs-option")
      .map((n) => n.textContent);
    expect(optionLabels).toEqual(["Select", "Alpha", "Beta"]);
  });

  it("does not crash and still renders the Select option when options is missing", () => {
    renderWithProviders(<SelectSinglePrint value={null} onChange={vi.fn()} />);
    // WHY: options defaults to []; only the injected Select option remains.
    expect(screen.getByTestId("rs-option-count")).toHaveTextContent("1");
    expect(screen.getByTestId("rs-option")).toHaveTextContent("Select");
  });

  it("forwards the selected option to onChange", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SelectSinglePrint value={null} onChange={onChange} options={OPTIONS} />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /pick first real option/i }),
    );
    // WHY: options[1] is the first real option (index 0 is the injected Select).
    expect(onChange).toHaveBeenCalledWith({ label: "Alpha", value: "alpha" });
  });

  it("uses onChange as the keydown handler when onKeyDown is not provided", () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SelectSinglePrint value={null} onChange={onChange} options={OPTIONS} />,
    );
    fireEvent.keyDown(screen.getByLabelText("rs-keydown"), { key: "Enter" });
    // WHY: source falls back to onKeyDown || onChange.
    expect(onChange).toHaveBeenCalled();
  });

  it("prefers an explicit onKeyDown handler over onChange", () => {
    const onChange = vi.fn();
    const onKeyDown = vi.fn();
    renderWithProviders(
      <SelectSinglePrint
        value={null}
        onChange={onChange}
        onKeyDown={onKeyDown}
        options={OPTIONS}
      />,
    );
    fireEvent.keyDown(screen.getByLabelText("rs-keydown"), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("forwards isCreatable, placeholder and classNamePrefix to the select", () => {
    renderWithProviders(
      <SelectSinglePrint
        value={null}
        onChange={vi.fn()}
        options={OPTIONS}
        isCreatable
      />,
    );
    expect(screen.getByTestId("rs-creatable")).toHaveTextContent("true");
    expect(screen.getByTestId("rs-placeholder")).toHaveTextContent("Select...");
    expect(screen.getByTestId("rs-mock")).toHaveAttribute(
      "data-prefix",
      "ia-select-single",
    );
  });
});

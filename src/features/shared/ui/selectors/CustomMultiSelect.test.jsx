/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import CustomMultiSelect from "./CustomMultiSelect";
import { showNotification } from "@/utils";

// Mock the notification util so the max-selection guard can be asserted
// without rendering the real toast system. Path must match the component
// import ("@/utils").
vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

const OPTIONS = [
  { label: "Allergy", value: "allergy" },
  { label: "Asthma", value: "asthma" },
  { label: "Diabetes", value: "diabetes" },
];

describe("CustomMultiSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the placeholder when selected is null", () => {
    // The default param only fills `undefined`; an explicit null falls through
    // the `selected && selected.map()` guard to the "Select items..." fallback.
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={null}
        onChange={vi.fn()}
      />,
    );
    // WHY: an empty conditions/tags picker must prompt the clinician to add items.
    expect(screen.getByText("Select items...")).toBeInTheDocument();
    // Closed dropdown => option list not in the DOM yet.
    expect(screen.queryByText("Allergy")).not.toBeInTheDocument();
  });

  it("should render the labels of the currently selected options", () => {
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={[OPTIONS[0], OPTIONS[2]]}
        onChange={vi.fn()}
      />,
    );
    // WHY: the summary box surfaces which conditions are already on the chart.
    expect(screen.getByText("Allergy")).toBeInTheDocument();
    expect(screen.getByText("Diabetes")).toBeInTheDocument();
    expect(screen.queryByText("Select items...")).not.toBeInTheDocument();
  });

  it("should open the dropdown and list every option when the arrow is clicked", () => {
    render(
      <CustomMultiSelect options={OPTIONS} selected={[]} onChange={vi.fn()} />,
    );
    fireEvent.click(screen.getByText("▼"));

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    OPTIONS.forEach((o) =>
      expect(screen.getByText(o.label)).toBeInTheDocument(),
    );
  });

  it("should add an option to the selection when an unselected item is clicked", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect options={OPTIONS} selected={[]} onChange={onChange} />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Asthma"));

    // WHY: clicking an option toggles it on, appending it to the selection.
    expect(onChange).toHaveBeenCalledWith([OPTIONS[1]]);
  });

  it("should remove an option from the selection when an already-selected item is clicked", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={[OPTIONS[1]]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("▼"));
    // Asthma label appears in both the summary and the dropdown row; click the
    // checkbox row in the dropdown.
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1].parentElement);

    // WHY: clicking a checked condition de-selects it (toggle off).
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("should filter the option list by the search term", () => {
    render(
      <CustomMultiSelect options={OPTIONS} selected={[]} onChange={vi.fn()} />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "dia" },
    });

    // WHY: search narrows long clinical code lists to a manageable subset.
    expect(screen.getByText("Diabetes")).toBeInTheDocument();
    expect(screen.queryByText("Allergy")).not.toBeInTheDocument();
  });

  it("should show 'No results found' when the search matches nothing", () => {
    render(
      <CustomMultiSelect options={OPTIONS} selected={[]} onChange={vi.fn()} />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "zzz" },
    });

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("should select every option via Select All when no max is set", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect options={OPTIONS} selected={[]} onChange={onChange} />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Select All"));

    // WHY: bulk-select speeds entry when all listed options apply.
    expect(onChange).toHaveBeenCalledWith(OPTIONS);
  });

  it("should clear the selection via Deselect All when everything is selected", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={OPTIONS}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Deselect All"));

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("should hide the Select All control when a max is provided", () => {
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={[]}
        onChange={vi.fn()}
        max={2}
      />,
    );
    fireEvent.click(screen.getByText("▼"));

    // WHY: bulk-select would let the user exceed the cap, so it is suppressed.
    expect(screen.queryByText("Select All")).not.toBeInTheDocument();
  });

  it("should block selecting beyond max and notify the user", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={[OPTIONS[0], OPTIONS[1]]}
        onChange={onChange}
        max={2}
      />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.click(screen.getByText("Diabetes"));

    // WHY: capped pickers must reject extra selections and warn, never silently add.
    expect(onChange).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      message: "You can only select up to 2 options.",
      type: "info",
    });
  });

  it("should add a custom free-text option on Enter when allowCustomOptions is set", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={[]}
        onChange={onChange}
        allowCustomOptions
      />,
    );
    fireEvent.click(screen.getByText("▼"));
    const input = screen.getByPlaceholderText("Type to add...");
    fireEvent.change(input, { target: { value: "Custom Dx" } });
    fireEvent.keyDown(input, { key: "Enter" });

    // WHY: free-text mode lets clinicians capture diagnoses absent from the list.
    expect(onChange).toHaveBeenCalledWith([
      { label: "Custom Dx", value: "Custom Dx" },
    ]);
  });

  it("should not add a custom option on Enter when the input is empty", () => {
    const onChange = vi.fn();
    render(
      <CustomMultiSelect
        options={OPTIONS}
        selected={[]}
        onChange={onChange}
        allowCustomOptions
      />,
    );
    fireEvent.click(screen.getByText("▼"));
    fireEvent.keyDown(screen.getByPlaceholderText("Type to add..."), {
      key: "Enter",
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});

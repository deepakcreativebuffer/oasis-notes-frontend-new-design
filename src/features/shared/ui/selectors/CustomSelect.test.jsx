/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import userEvent from "@testing-library/user-event";

import CustomSelect from "./CustomSelect";

describe("CustomSelect", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the search input with the provided placeholder", () => {
    render(
      <CustomSelect
        options={["Test Patient"]}
        placeholder="Search residents"
      />,
    );
    // WHY: clinicians rely on the placeholder to know they can type-to-search.
    expect(screen.getByPlaceholderText("Search residents")).toBeInTheDocument();
  });

  it("should not show the options list until the input is clicked", () => {
    render(<CustomSelect options={["Test Patient"]} />);
    // WHY: the dropdown stays closed on initial render to avoid covering the form.
    expect(screen.queryByText("Test Patient")).not.toBeInTheDocument();
  });

  it("should open the options list when the input is clicked", () => {
    render(<CustomSelect options={["Test Patient", "MRN-TEST-001"]} />);
    fireEvent.click(screen.getByPlaceholderText("Type to search or select"));
    // WHY: opening on click lets the user browse all residents without typing.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("MRN-TEST-001")).toBeInTheDocument();
  });

  it("should normalize string options into selectable labels", () => {
    render(<CustomSelect options={["Test Patient"]} />);
    fireEvent.click(screen.getByPlaceholderText("Type to search or select"));
    // WHY: employee/resident lists may arrive as plain strings, not {label,value}.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should render {label, value} options using the label", () => {
    render(
      <CustomSelect
        options={[{ label: "Test Patient", value: "res-test-001" }]}
      />,
    );
    fireEvent.click(screen.getByPlaceholderText("Type to search or select"));
    // WHY: object options must display the human label, not the internal id.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should call onChange with the option value when an option is clicked", () => {
    const onChange = vi.fn();
    render(
      <CustomSelect
        options={[{ label: "Test Patient", value: "res-test-001" }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByPlaceholderText("Type to search or select"));
    fireEvent.click(screen.getByText("Test Patient"));
    // WHY: selecting a resident must hand the stable id (value) back to the form.
    expect(onChange).toHaveBeenCalledWith("res-test-001");
  });

  it("should display the selected label and close the list after selection", () => {
    render(
      <CustomSelect
        options={[{ label: "Test Patient", value: "res-test-001" }]}
      />,
    );
    const input = screen.getByPlaceholderText("Type to search or select");
    fireEvent.click(input);
    fireEvent.click(screen.getByText("Test Patient"));
    // WHY: after picking, the input shows the chosen name and the dropdown closes.
    expect(input).toHaveValue("Test Patient");
    expect(screen.queryByText("MRN-TEST-001")).not.toBeInTheDocument();
  });

  it("should call onChange with the raw typed text on input change", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<CustomSelect options={["Test Patient"]} onChange={onChange} />);
    const input = screen.getByPlaceholderText("Type to search or select");
    await user.type(input, "Te");
    // WHY: free-typed text is forwarded so callers can perform server-side search.
    expect(onChange).toHaveBeenLastCalledWith("Te");
  });

  it("should filter options by typed text when filterOnType is enabled", () => {
    render(
      <CustomSelect options={["Test Patient", "MRN-TEST-001"]} filterOnType />,
    );
    const input = screen.getByPlaceholderText("Type to search or select");
    fireEvent.change(input, { target: { value: "patient" } });
    // WHY: type-ahead filtering narrows long resident lists in appointment flows.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.queryByText("MRN-TEST-001")).not.toBeInTheDocument();
  });

  it("should show 'No options found' when filtering yields no matches", () => {
    render(<CustomSelect options={["Test Patient"]} filterOnType />);
    const input = screen.getByPlaceholderText("Type to search or select");
    fireEvent.change(input, { target: { value: "zzz" } });
    // WHY: an explicit empty state prevents confusion when no resident matches.
    expect(screen.getByText("No options found")).toBeInTheDocument();
  });

  it("should pre-fill the input from a string value via the display fallback", () => {
    render(<CustomSelect options={["Test Patient"]} value="Test Patient" />);
    // WHY: editing an existing record must show the previously saved selection.
    expect(screen.getByPlaceholderText("Type to search or select")).toHaveValue(
      "Test Patient",
    );
  });

  it("should pre-fill the input from an object value's label", () => {
    render(
      <CustomSelect
        options={[{ label: "Test Patient", value: "res-test-001" }]}
        value={{ label: "Test Patient", value: "res-test-001" }}
      />,
    );
    // WHY: object-shaped saved values still render the readable label.
    expect(screen.getByPlaceholderText("Type to search or select")).toHaveValue(
      "Test Patient",
    );
  });

  it("should mark the input required when required is true", () => {
    render(<CustomSelect options={["Test Patient"]} required />);
    // WHY: required selectors block submission of incomplete clinical forms.
    expect(
      screen.getByPlaceholderText("Type to search or select"),
    ).toBeRequired();
  });

  it("should render with an empty options list without crashing", () => {
    render(<CustomSelect options={[]} />);
    const input = screen.getByPlaceholderText("Type to search or select");
    fireEvent.click(input);
    // WHY: an empty data source must degrade gracefully to the empty state.
    expect(screen.getByText("No options found")).toBeInTheDocument();
  });
});

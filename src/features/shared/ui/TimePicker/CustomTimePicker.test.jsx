/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@/test-utils";
import CustomTimePicker from "./CustomTimePicker";

// CustomTimePicker is a pure presentational dropdown with no service/IO imports,
// so plain render (no providers) is sufficient.

describe("CustomTimePicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a read-only input with the default placeholder when no value", () => {
    render(<CustomTimePicker onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText("Select time");
    // WHY: clinicians pick a time from the dropdown; the field itself must stay
    // read-only so a charted time can't be free-typed into an invalid string.
    expect(input).toHaveAttribute("readonly");
    expect(input).toHaveValue("");
  });

  it("should render the custom placeholder text when provided", () => {
    render(
      <CustomTimePicker onChange={vi.fn()} placeHolderText="Pick admin time" />,
    );
    expect(screen.getByPlaceholderText("Pick admin time")).toBeInTheDocument();
  });

  it("should render a disabled input when disabled", () => {
    render(<CustomTimePicker onChange={vi.fn()} disabled />);
    expect(screen.getByPlaceholderText("Select time")).toBeDisabled();
  });

  it("should display the formatted value when a date is provided", () => {
    // 09:05 -> formatted via locale; assert the input is non-empty and contains the time.
    const value = new Date(2026, 5, 10, 9, 5);
    render(<CustomTimePicker onChange={vi.fn()} value={value} />);
    const input = screen.getByPlaceholderText("Select time");
    // WHY: the charted time must be reflected back to the clinician exactly.
    expect(input.value).toMatch(/09[:.]05/);
  });

  it("should not show the dropdown columns until the field is clicked", () => {
    render(<CustomTimePicker onChange={vi.fn()} />);
    expect(screen.queryByText("Hours")).not.toBeInTheDocument();
    expect(screen.queryByText("Minutes")).not.toBeInTheDocument();
  });

  it("should open the dropdown with Hours, Minutes and AM/PM columns in 12-hour mode", async () => {
    const user = userEvent.setup();
    render(<CustomTimePicker onChange={vi.fn()} />);

    await user.click(screen.getByPlaceholderText("Select time"));

    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("Minutes")).toBeInTheDocument();
    // WHY: 12-hour mode (the default) requires an AM/PM selector to disambiguate
    // morning vs evening medication-administration times.
    expect(screen.getByText("AM/PM")).toBeInTheDocument();
  });

  it("should hide the AM/PM column in 24-hour mode", async () => {
    const user = userEvent.setup();
    render(<CustomTimePicker onChange={vi.fn()} use24Hours />);

    await user.click(screen.getByPlaceholderText("Select time"));

    expect(screen.getByText("Hours")).toBeInTheDocument();
    // WHY: 24-hour (military) charting has no AM/PM ambiguity, so that column
    // must not appear.
    expect(screen.queryByText("AM/PM")).not.toBeInTheDocument();
  });

  it("should call onChange with a Date when onChange accepts a single arg and an hour is picked", async () => {
    const user = userEvent.setup();
    // single-arg signature => component passes a Date object.
    const onChange = vi.fn((date) => date);
    render(<CustomTimePicker onChange={onChange} use24Hours />);

    await user.click(screen.getByPlaceholderText("Select time"));
    // Pick hour "08" from the Hours column (first column; "08" also exists in Minutes).
    await user.click(screen.getAllByText("08")[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const arg = onChange.mock.calls[0][0];
    // WHY: a Date payload lets the parent persist the exact charted instant.
    expect(arg).toBeInstanceOf(Date);
    expect(arg.getHours()).toBe(8);
  });

  it("should call onChange with (null, timeString) when onChange has a two-arg signature", async () => {
    const user = userEvent.setup();
    // two-arg signature => component passes (null, formattedString).
    const onChange = vi.fn((a, b) => [a, b]);
    render(<CustomTimePicker onChange={onChange} use24Hours />);

    await user.click(screen.getByPlaceholderText("Select time"));
    await user.click(screen.getAllByText("08")[0]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const [first, second] = onChange.mock.calls[0];
    // WHY: form-driven callers expect the (event, value) shape, so the date slot
    // is null and the value is the human-readable time string.
    expect(first).toBeNull();
    expect(typeof second).toBe("string");
    expect(second).toMatch(/08[:.]00/);
  });

  it("should adjust the hour to PM (24h) when PM is selected in 12-hour mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn((date) => date);
    render(<CustomTimePicker onChange={onChange} />);

    await user.click(screen.getByPlaceholderText("Select time"));
    // default selectedHour starts at 0; choose hour 3 (Hours column) then PM.
    await user.click(screen.getAllByText("03")[0]);
    onChange.mockClear();
    await user.click(screen.getByText("PM"));

    const arg = onChange.mock.calls[0][0];
    // WHY: 3 PM must serialize to 15:00 so downstream 24h storage is correct.
    expect(arg.getHours()).toBe(15);
  });

  it("should show a clear button when a value is set and clear it via onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const value = new Date(2026, 5, 10, 9, 5);
    render(<CustomTimePicker onChange={onChange} value={value} />);

    // The clear button is the ✕ button rendered only when a value is present.
    const clearBtn = screen.getByRole("button");
    await user.click(clearBtn);

    // WHY: clearing a charted time must notify the parent (empty string) so the
    // field can be unset.
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("should not render a clear button when disabled even with a value", () => {
    const value = new Date(2026, 5, 10, 9, 5);
    render(<CustomTimePicker onChange={vi.fn()} value={value} disabled />);
    // WHY: a locked/disabled time field must not expose a clear control.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should close the dropdown when clicking outside the picker", async () => {
    const user = userEvent.setup();
    render(<CustomTimePicker onChange={vi.fn()} />);

    await user.click(screen.getByPlaceholderText("Select time"));
    expect(screen.getByText("Hours")).toBeInTheDocument();

    // mousedown outside triggers the document handler that closes the dropdown.
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("Hours")).not.toBeInTheDocument();
  });
});

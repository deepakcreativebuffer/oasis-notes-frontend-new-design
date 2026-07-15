/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { AutoSize } from "./AutoSize";

// jsdom has no canvas 2d context; AutoSize measures text width via canvas, so
// stub getContext with a deterministic measureText. Set per-test because the
// suite config restores mocks before each test.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    font: "",
    measureText: (t) => ({ width: t.length * 8 }),
  });
});

describe("AutoSize", () => {
  it("should render an input with the given value and placeholder", () => {
    render(
      <AutoSize value="Test" setValue={vi.fn()} placeholder="Enter name" />,
    );
    const input = screen.getByPlaceholderText("Enter name");
    expect(input).toHaveValue("Test");
  });

  it("should call setValue as the user types", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(<AutoSize value="" setValue={setValue} placeholder="field" />);

    await user.type(screen.getByPlaceholderText("field"), "A");
    expect(setValue).toHaveBeenCalledWith("A");
  });

  it("should render a disabled input when disabled", () => {
    render(
      <AutoSize value="" setValue={vi.fn()} placeholder="field" disabled />,
    );
    expect(screen.getByPlaceholderText("field")).toBeDisabled();
  });

  it("should coerce a null value to an empty string", () => {
    render(<AutoSize value={null} setValue={vi.fn()} placeholder="field" />);
    expect(screen.getByPlaceholderText("field")).toHaveValue("");
  });
});

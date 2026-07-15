/** @format */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import SelectTrueFalse from "./SelectTrueFalse";

describe("SelectTrueFalse", () => {
  describe("rendering", () => {
    it("should render a Yes/No select with both options", () => {
      render(<SelectTrueFalse value={true} onChange={() => {}} />);

      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
      // WHY: this control toggles a true/false assessment answer; both
      // choices must always be present for staff to record either response.
      expect(screen.getByRole("option", { name: "Yes" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "No" })).toBeInTheDocument();
    });

    it("should reflect a truthy value as the selected 'Yes' option", () => {
      render(<SelectTrueFalse value={true} onChange={() => {}} />);

      // React coerces the boolean value to the matching option value="true".
      expect(screen.getByRole("combobox")).toHaveValue("true");
    });

    it("should reflect a falsy value as the selected 'No' option", () => {
      render(<SelectTrueFalse value={false} onChange={() => {}} />);

      expect(screen.getByRole("combobox")).toHaveValue("false");
    });
  });

  describe("print mirror span", () => {
    it("should show 'Yes' in the print-only text when value is true", () => {
      render(<SelectTrueFalse value={true} onChange={() => {}} />);

      // WHY: printed assessments hide the <select> and show this span instead,
      // so the printed answer must mirror the on-screen selection.
      const printSpan = screen.getByText("Yes", { selector: "span" });
      expect(printSpan).toHaveClass("show-print-inline");
    });

    it("should show 'No' in the print-only text when value is false", () => {
      render(<SelectTrueFalse value={false} onChange={() => {}} />);

      const printSpan = screen.getByText("No", { selector: "span" });
      expect(printSpan).toHaveClass("show-print-inline");
    });
  });

  describe("interaction", () => {
    it("should invoke onChange when the selection changes", () => {
      const onChange = vi.fn();
      render(<SelectTrueFalse value={true} onChange={onChange} />);

      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "false" },
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});

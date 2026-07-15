/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import {
  DateInput,
  SelectMultiPrint,
  TextAreaPrint,
  renderComment,
} from "./TreatmentPlanPrintFields";

// WHY: CustomMultiSelectInput wraps react-select/creatable (heavy, portal-based).
// Stub it to a light view that surfaces the props SelectMultiPrint forwards.
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <div data-testid="multi-select">
      <span data-testid="multi-select-value">
        {(Array.isArray(value) ? value : value ? [value] : [])
          .map((v) => v?.label)
          .join(",")}
      </span>
      <button
        type="button"
        data-testid="multi-select-add"
        onClick={() =>
          onChange([
            ...(Array.isArray(value) ? value : []),
            { label: "Added", value: "Added" },
          ])
        }
      >
        add
      </button>
      <span data-testid="multi-select-options">{(options || []).length}</span>
    </div>
  ),
}));

// WHY: react-quill is a heavy editor; stub to a plain marker that surfaces value.
vi.mock("react-quill", () => ({
  __esModule: true,
  default: ({ value, readOnly }) => (
    <div data-testid="react-quill" data-readonly={String(readOnly)}>
      {value}
    </div>
  ),
}));

describe("TreatmentPlanPrintFields", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DateInput", () => {
    it("renders a print-inline value plus a date input with the given id", () => {
      render(<DateInput value="2026-06-10" id="dob" onChange={() => {}} />);
      const dateInput = document.querySelector('input[type="date"]');
      expect(dateInput).toBeTruthy();
      expect(dateInput.id).toBe("dob");
      // WHY: the hidden print-inline mirror also carries the value.
      expect(document.querySelector("input.show-print-inline")).toBeTruthy();
      const values = Array.from(document.querySelectorAll("input")).map(
        (el) => el.value,
      );
      expect(values).toContain("2026-06-10");
    });

    it("fires onChange when the date input changes", () => {
      const onChange = vi.fn();
      render(<DateInput value="" id="dob" onChange={onChange} />);
      fireEvent.change(document.querySelector('input[type="date"]'), {
        target: { value: "2026-06-11" },
      });
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("SelectMultiPrint", () => {
    it("renders the joined labels for an array value in the print span", () => {
      render(
        <SelectMultiPrint
          value={[
            { label: "Anxiety", value: "anxiety" },
            { label: "Depression", value: "depression" },
          ]}
          options={[]}
          onChange={() => {}}
        />,
      );
      // WHY: array values are joined with ", " for the print-inline view.
      expect(document.querySelector("span.show-print-inline").textContent).toBe(
        "Anxiety, Depression",
      );
    });

    it("renders a single object value's label in the print span", () => {
      render(
        <SelectMultiPrint
          value={{ label: "Anxiety", value: "anxiety" }}
          options={[]}
          onChange={() => {}}
        />,
      );
      expect(document.querySelector("span.show-print-inline").textContent).toBe(
        "Anxiety",
      );
    });

    it("forwards options to the underlying multi-select and routes onChange", () => {
      const onChange = vi.fn();
      render(
        <SelectMultiPrint
          value={[]}
          options={[{ label: "A", value: "a" }]}
          onChange={onChange}
        />,
      );
      expect(screen.getByTestId("multi-select-options").textContent).toBe("1");
      fireEvent.click(screen.getByTestId("multi-select-add"));
      expect(onChange).toHaveBeenCalledWith([
        { label: "Added", value: "Added" },
      ]);
    });
  });

  describe("TextAreaPrint", () => {
    it("renders the value in the print span and the textarea", () => {
      render(
        <TextAreaPrint
          value="patient notes"
          rows={3}
          placeholder="Notes"
          onChange={() => {}}
        />,
      );
      expect(document.querySelector("span.show-print-inline").textContent).toBe(
        "patient notes",
      );
      const ta = screen.getByRole("textbox");
      expect(ta.value).toBe("patient notes");
      expect(ta.placeholder).toBe("Notes");
    });

    it("fires onChange and onKeyDown handlers", () => {
      const onChange = vi.fn();
      const onKeyDown = vi.fn();
      render(
        <TextAreaPrint value="" onChange={onChange} onKeyDown={onKeyDown} />,
      );
      const ta = screen.getByRole("textbox");
      fireEvent.change(ta, { target: { value: "x" } });
      fireEvent.keyDown(ta, { key: "Enter" });
      expect(onChange).toHaveBeenCalled();
      expect(onKeyDown).toHaveBeenCalled();
    });

    it("appends the w-100 class to the provided className", () => {
      render(<TextAreaPrint value="" className="foo " onChange={() => {}} />);
      // WHY: source concatenates className + "w-100".
      expect(screen.getByRole("textbox").className).toBe("foo w-100");
    });
  });

  describe("renderComment", () => {
    it("returns a dash placeholder for empty/falsy values", () => {
      render(<>{renderComment("")}</>);
      expect(screen.getByText("-")).toBeInTheDocument();
    });

    it("renders plain text in a span when no HTML is present", () => {
      render(<>{renderComment("just text")}</>);
      expect(screen.getByText("just text").tagName).toBe("SPAN");
      expect(screen.queryByTestId("react-quill")).toBeNull();
    });

    it("renders a read-only ReactQuill when the value contains HTML", () => {
      render(<>{renderComment("<p>rich text</p>")}</>);
      const quill = screen.getByTestId("react-quill");
      expect(quill).toBeInTheDocument();
      expect(quill.getAttribute("data-readonly")).toBe("true");
      expect(quill.textContent).toBe("<p>rich text</p>");
    });
  });
});

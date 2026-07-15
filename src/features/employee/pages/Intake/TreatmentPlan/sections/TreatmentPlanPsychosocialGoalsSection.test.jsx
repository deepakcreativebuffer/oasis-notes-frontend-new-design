/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanPsychosocialGoalsSection from "./TreatmentPlanPsychosocialGoalsSection";

// WHY: the section pulls every field + setter off useTreatmentPlanFormContext().
// We hoist a mutable form object so each test can seed values/spies and the
// mock factory can reference it without TDZ errors.
const h = vi.hoisted(() => ({ form: {} }));

vi.mock("../context/TreatmentPlanFormContext", () => ({
  __esModule: true,
  useTreatmentPlanFormContext: () => h.form,
}));

// WHY: TextEditor wraps react-quill (heavy/contenteditable). Stub to a textarea
// surfacing its value + setValue so we can assert wiring.
vi.mock("@/features/shared/ui/TextEditor/TextEditor", () => ({
  __esModule: true,
  default: ({ value, setValue }) => (
    <textarea
      data-testid="text-editor"
      value={value || ""}
      onChange={(e) => setValue && setValue(e.target.value)}
    />
  ),
}));

// WHY: MultiSelectWithEditor wraps react-select + a quill editor. Stub to a
// light control exposing its current value and option count.
vi.mock("@/features/shared/ui/MultiSelectWithEditor/MultiSelectEditor", () => ({
  __esModule: true,
  default: ({ multiSelectValue, setMultiSelectValue, options }) => (
    <div data-testid="multi-select-editor">
      <span data-testid="mse-value">
        {(multiSelectValue || []).map((v) => v?.label).join(",")}
      </span>
      <span data-testid="mse-options">{(options || []).length}</span>
      <button
        type="button"
        data-testid="mse-add"
        onClick={() =>
          setMultiSelectValue &&
          setMultiSelectValue([{ label: "Added", value: "Added" }])
        }
      >
        add
      </button>
    </div>
  ),
}));

// WHY: react-datepicker is portal/heavy; stub to a plain input.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="date-picker"
      placeholder={placeholderText}
      onChange={(e) => onChange && onChange(new Date(e.target.value))}
    />
  ),
}));

// Build a complete form context: controlled string fields, null measure-met
// flags, empty option arrays, and vi.fn() spies for every setter the section
// invokes. A Proxy returns a fresh no-op spy for any setter we did not
// explicitly seed so the component never calls undefined.
function makeForm(overrides = {}) {
  const base = {
    desiredMeasure: "",
    handleRatingChange: vi.fn(),
  };
  // Per-section measure-met flags default to null (neither Yes nor No).
  for (let i = 1; i <= 8; i++) {
    base[`isMeasureMet${i}`] = null;
    base[`admissionMeasure${i}`] = "";
    base[`currentMeasure${i}`] = "";
    base[`admissionMeasure${i}Error`] = "";
    base[`currentMeasure${i}Error`] = "";
    base[`estimatedDateOfCompletion${i}`] = "";
    base[`comments${i}`] = "";
  }
  const merged = { ...base, ...overrides };
  return new Proxy(merged, {
    get(target, prop) {
      if (prop in target) return target[prop];
      // Auto-provide a no-op spy for any setter / handler not explicitly seeded.
      if (
        typeof prop === "string" &&
        (prop.startsWith("set") || prop.startsWith("handle"))
      ) {
        const fn = vi.fn();
        target[prop] = fn;
        return fn;
      }
      // Unknown value field -> undefined (component tolerates it).
      return undefined;
    },
    has: () => true,
  });
}

describe("TreatmentPlanPsychosocialGoalsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.form = makeForm();
  });

  it("renders the top-level goals heading and desired-measure label", () => {
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    expect(
      screen.getByText(/Goals for Changes in the Resident/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Desired measure")).toBeInTheDocument();
  });

  it("renders a card for each of the eight measurable treatment goals", () => {
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    // Each goal section carries the "Measurables Treatment Goals" header.
    expect(screen.getAllByText("Measurables Treatment Goals")).toHaveLength(8);
    // Distinct goal titles render.
    expect(screen.getByText("Maintain sobriety")).toBeInTheDocument();
    expect(screen.getByText("Independent Living Skills")).toBeInTheDocument();
    expect(screen.getByText("Employment")).toBeInTheDocument();
    expect(screen.getByText("ADLS")).toBeInTheDocument();
    expect(screen.getByText("Safety")).toBeInTheDocument();
    expect(screen.getByText("Medication")).toBeInTheDocument();
    expect(screen.getByText("Managing Mental Health")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("renders three MultiSelectWithEditor controls per card (goal/objectives/interventions)", () => {
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    // 8 cards x 3 multi-selects each = 24.
    expect(screen.getAllByTestId("multi-select-editor")).toHaveLength(24);
  });

  it("renders a progress TextEditor and a date picker per card", () => {
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    expect(screen.getAllByTestId("text-editor")).toHaveLength(8);
    expect(screen.getAllByTestId("date-picker")).toHaveLength(8);
    // Each card shows the progress label.
    expect(screen.getAllByText("Progress towards goals")).toHaveLength(8);
  });

  it("renders Yes/No measure-met checkboxes for every card", () => {
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    // 8 cards x 2 checkboxes = 16.
    expect(screen.getAllByRole("checkbox")).toHaveLength(16);
    expect(screen.getAllByText("Measure Met")).toHaveLength(8);
  });

  it("reflects the desiredMeasure value from context", () => {
    h.form = makeForm({ desiredMeasure: "9/10" });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    expect(screen.getByDisplayValue("9/10")).toBeInTheDocument();
  });

  it("checks the Yes box when a section's measure-met flag is true", () => {
    h.form = makeForm({ isMeasureMet1: true });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    const checkboxes = screen.getAllByRole("checkbox");
    // First card: index 0 = Yes, index 1 = No.
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("invokes the section's measure-met setter when a checkbox is toggled", () => {
    const setIsMeasureMet1 = vi.fn();
    h.form = makeForm({ setIsMeasureMet1 });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(setIsMeasureMet1).toHaveBeenCalled();
  });

  it("routes admission-measure typing through handleRatingChange", () => {
    const handleRatingChange = vi.fn();
    h.form = makeForm({ handleRatingChange });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    const admissionInputs = screen.getAllByPlaceholderText(
      "Enter Rating like: (1/10)",
    );
    fireEvent.change(admissionInputs[0], { target: { value: "5/10" } });
    expect(handleRatingChange).toHaveBeenCalled();
  });

  it("updates progress notes through the TextEditor setComment setter", () => {
    const setComment1 = vi.fn();
    h.form = makeForm({ setComment1 });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    fireEvent.change(screen.getAllByTestId("text-editor")[0], {
      target: { value: "improving" },
    });
    expect(setComment1).toHaveBeenCalledWith("improving");
  });

  it("passes selected multi-select values from context to the control", () => {
    h.form = makeForm({
      option1: [{ label: "Sober 30 days", value: "Sober 30 days" }],
    });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    expect(
      screen.getAllByTestId("mse-value").map((e) => e.textContent),
    ).toContain("Sober 30 days");
  });

  it("forwards multi-select changes to the matching setter", () => {
    const setOption1 = vi.fn();
    h.form = makeForm({ setOption1 });
    renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />);
    fireEvent.click(screen.getAllByTestId("mse-add")[0]);
    expect(setOption1).toHaveBeenCalledWith([
      { label: "Added", value: "Added" },
    ]);
  });

  it("renders without crashing when option/value fields are missing from context", () => {
    // Proxy yields undefined for unseeded value fields; component must tolerate it.
    expect(() =>
      renderWithProviders(<TreatmentPlanPsychosocialGoalsSection />),
    ).not.toThrow();
  });
});

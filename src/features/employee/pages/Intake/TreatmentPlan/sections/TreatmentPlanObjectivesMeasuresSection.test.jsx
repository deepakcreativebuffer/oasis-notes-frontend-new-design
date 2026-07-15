/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanObjectivesMeasuresSection from "./TreatmentPlanObjectivesMeasuresSection";

// WHY: the component reads ALL state/handlers from this form context. Mock it so
// we can drive both branches (with rows / empty) and assert handler wiring.
const ctx = vi.hoisted(() => ({ current: {} }));
vi.mock("../context/TreatmentPlanFormContext", () => ({
  __esModule: true,
  useTreatmentPlanFormContext: () => ctx.current,
}));

// WHY: TextEditor wraps react-quill (heavy, no jsdom support). Stub to a textarea
// that surfaces value + routes onChange through setValue so we can assert it.
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

// WHY: MultiSelectWithEditor wraps react-select; not exercised by the active
// (non-commented) render path but imported, so stub it light.
vi.mock("@/features/shared/ui/MultiSelectWithEditor/MultiSelectEditor", () => ({
  __esModule: true,
  default: () => <div data-testid="multi-select-editor" />,
}));

// WHY: react-datepicker is heavy/portal-based. Stub to a date input that calls
// onChange so the Target Date column renders and is interactive.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="date-picker"
      placeholder={placeholderText}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),
}));

// Build a single goal row matching the shape the component reads.
const makeRow = (overrides = {}) => ({
  goalTitle: "Maintain sobriety",
  otherType: "<p>other</p>",
  objectiveEdiorValue: "<p>obj</p>",
  intervention: "<p>iv</p>",
  admissionMeasure: "<p>5</p>",
  admissionMeasureError: "",
  currentMeasure: "<p>3</p>",
  currentMeasureError: "",
  estimatedDateOfCompletion: "2026-01-01",
  comments: "<p>progress</p>",
  isMeasureMet: null,
  ...overrides,
});

const makeContext = (overrides = {}) => ({
  otherArray: [makeRow()],
  handleDelete: vi.fn(),
  handleChange: vi.fn(),
  handleRatingChange: vi.fn(),
  handleAddButtonClick: vi.fn(),
  residentParticipation: "",
  setResidentParticipation: vi.fn(),
  residentParticipationOtherText: "",
  setResidentParticipationOtherText: vi.fn(),
  residentAttitute: "",
  setResidentAttitute: vi.fn(),
  residentAttituteOtherText: "",
  setResidentAttituteOtherText: vi.fn(),
  residentProgress: "",
  setResidentProgress: vi.fn(),
  residentProgressOtherText: "",
  setResidentProgressOtherText: vi.fn(),
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  ctx.current = makeContext();
});

describe("TreatmentPlanObjectivesMeasuresSection", () => {
  it("renders a goal card with all section labels for each row", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);

    expect(screen.getByText("Goal Title")).toBeInTheDocument();
    expect(screen.getByText("Objectives")).toBeInTheDocument();
    expect(screen.getByText("Interventions")).toBeInTheDocument();
    expect(screen.getByText("Admission Measure")).toBeInTheDocument();
    expect(screen.getByText("Current Measure")).toBeInTheDocument();
    expect(screen.getByText("Target Date of Completion")).toBeInTheDocument();
    expect(screen.getByText("Progress towards goals")).toBeInTheDocument();
    expect(screen.getByText("Measure Met")).toBeInTheDocument();
  });

  it("renders the goal title from row data", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    // WHY: goalTitle ?? "Other" — populated value should appear in the input.
    expect(screen.getByDisplayValue("Maintain sobriety")).toBeInTheDocument();
  });

  it("falls back to 'Other' when goalTitle is missing", () => {
    ctx.current = makeContext({
      otherArray: [makeRow({ goalTitle: undefined })],
    });
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    expect(screen.getByDisplayValue("Other")).toBeInTheDocument();
  });

  it("renders all three resident summary panels regardless of rows", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    expect(
      screen.getByText(/Resident overall participation in treatment/),
    ).toBeInTheDocument();
    expect(screen.getByText("Resident Attitude")).toBeInTheDocument();
    expect(screen.getByText("Resident progress")).toBeInTheDocument();
  });

  it("renders without crashing and shows summary panels when otherArray is empty", () => {
    ctx.current = makeContext({ otherArray: [] });
    expect(() =>
      renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />),
    ).not.toThrow();
    // No goal card labels.
    expect(screen.queryByText("Goal Title")).toBeNull();
    // Summary panels still present.
    expect(screen.getByText("Resident Attitude")).toBeInTheDocument();
  });

  it("renders without crashing when otherArray is undefined", () => {
    ctx.current = makeContext({ otherArray: undefined });
    expect(() =>
      renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />),
    ).not.toThrow();
    expect(screen.getByText("Resident progress")).toBeInTheDocument();
  });

  it("renders one goal card per row in otherArray", () => {
    ctx.current = makeContext({
      otherArray: [makeRow(), makeRow({ goalTitle: "Independent Living" })],
    });
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    expect(screen.getAllByText("Goal Title")).toHaveLength(2);
  });

  it("calls handleDelete with the row index when the delete icon is clicked", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    const del = document.querySelector(".del-btn");
    expect(del).toBeTruthy();
    fireEvent.click(del.firstChild);
    expect(ctx.current.handleDelete).toHaveBeenCalledWith(0);
  });

  it("calls handleChange when editing the goal title", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    const input = screen.getByDisplayValue("Maintain sobriety");
    fireEvent.change(input, { target: { value: "New goal" } });
    expect(ctx.current.handleChange).toHaveBeenCalledWith(
      0,
      "goalTitle",
      "New goal",
    );
  });

  it("routes TextEditor changes through handleChange", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    // WHY: multiple TextEditors render; the first is the 'Other' editor.
    const editors = screen.getAllByTestId("text-editor");
    fireEvent.change(editors[0], { target: { value: "changed" } });
    expect(ctx.current.handleChange).toHaveBeenCalledWith(
      0,
      "otherType",
      "changed",
    );
  });

  it("invokes handleRatingChange when the admission measure changes", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    // extractParagraphText('<p>5</p>') => '5'
    const measure = screen.getByDisplayValue("5");
    fireEvent.change(measure, { target: { value: "9" } });
    expect(ctx.current.handleRatingChange).toHaveBeenCalled();
  });

  it("shows admission measure validation error when present", () => {
    ctx.current = makeContext({
      otherArray: [makeRow({ admissionMeasureError: "Must be 1-10" })],
    });
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    expect(screen.getByText("Must be 1-10")).toBeInTheDocument();
  });

  it("checks the Yes box when isMeasureMet is true and calls handleChange on toggle", () => {
    ctx.current = makeContext({
      otherArray: [makeRow({ isMeasureMet: true })],
    });
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    // WHY: bootstrap Form.Check labels aren't htmlFor-associated; locate the
    // Yes/No checkbox inputs by their sibling label text within the card.
    const yesLabel = screen.getByText("Yes");
    const noLabel = screen.getByText("No");
    const yes = yesLabel.closest("div").querySelector('input[type="checkbox"]');
    const no = noLabel.closest("div").querySelector('input[type="checkbox"]');
    expect(yes).toBeChecked();
    expect(no).not.toBeChecked();
    fireEvent.click(no);
    expect(ctx.current.handleChange).toHaveBeenCalledWith(
      0,
      "isMeasureMet",
      false,
    );
  });

  it("calls handleAddButtonClick when ADD is clicked", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    fireEvent.click(screen.getByRole("button", { name: "ADD" }));
    expect(ctx.current.handleAddButtonClick).toHaveBeenCalled();
  });

  it("calls handleChange when a target date is selected", () => {
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    fireEvent.change(screen.getByTestId("date-picker"), {
      target: { value: "2026-02-02" },
    });
    expect(ctx.current.handleChange).toHaveBeenCalledWith(
      0,
      "estimatedDateOfCompletion",
      "2026-02-02",
    );
  });

  it("reflects selected resident participation checkbox", () => {
    ctx.current = makeContext({ residentParticipation: "100%" });
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    // WHY: Form.Check uses id, not htmlFor; resolve the input via id.
    const box = document.getElementById("100%");
    expect(box).toBeChecked();
  });

  it("shows the Other free-text input when participation includes Other", () => {
    ctx.current = makeContext({
      residentParticipation: "Other",
      residentParticipationOtherText: "custom note",
    });
    renderWithProviders(<TreatmentPlanObjectivesMeasuresSection />);
    expect(screen.getByDisplayValue("custom note")).toBeInTheDocument();
  });
});

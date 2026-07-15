/** @format */

import React from "react";
import { render, screen } from "@/test-utils";
import ViewTreatmentPlanPsychosocialGoalsPart2 from "./ViewTreatmentPlanPsychosocialGoalsPart2";

// The context hook is the sole data source for this read-only view. We mock it
// so each test can drive the rendered output via a controlled "form" object.
const mockUseCtx = vi.fn();
vi.mock("../../context/ViewTreatmentPlanFormContext", () => ({
  useViewTreatmentPlanFormContext: () => mockUseCtx(),
}));

// react-quill needs a real DOM/editor; stub it to a plain element that exposes
// its `value` so we can assert the rich-text content the view passes through.
vi.mock("react-quill", () => ({
  default: ({ value }) => <div data-testid="quill">{value}</div>,
}));

// Minimal "no data" context: every field empty so checkAnyValue gates hide
// the cards. Tests override only what they need.
function emptyCtx(overrides = {}) {
  return {
    otherArray: [],
    residentParticipation: "undefined",
    residentAttitute: "undefined",
    residentProgress: "undefined",
    setIsMeasureMet6: vi.fn(),
    setIsMeasureMet7: vi.fn(),
    setIsMeasureMet8: vi.fn(),
    setResidentParticipation: vi.fn(),
    setResidentAttitute: vi.fn(),
    setResidentProgress: vi.fn(),
    ...overrides,
  };
}

describe("ViewTreatmentPlanPsychosocialGoalsPart2", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render nothing crash-worthy and omit goal cards when all fields are empty", () => {
    mockUseCtx.mockReturnValue(emptyCtx());
    const { container } = render(<ViewTreatmentPlanPsychosocialGoalsPart2 />);
    // WHY: with no answers, checkAnyValue gates each treatment-goal card off, so
    // none of the goal labels should appear for an empty plan.
    expect(
      screen.queryByText(/Medication Education :/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Managing Mental Health :/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Legal :/)).not.toBeInTheDocument();
    // Still mounts without throwing.
    expect(container).toBeInTheDocument();
  });

  it("should render the Medication Education goal card when those answers are present", () => {
    mockUseCtx.mockReturnValue(
      emptyCtx({
        medicationEditorValue: "<p>Med teaching</p>",
        admissionMeasure6: "<p>Admit 6</p>",
        currentMeasure6: "<p>Current 6</p>",
        estimatedDateOfCompletion6: "2026-06-10",
        isMeasureMet6: true,
      }),
    );
    render(<ViewTreatmentPlanPsychosocialGoalsPart2 />);
    // WHY: the Medication Education card is shown only when any of its goal
    // fields hold data, and the admission/current measures are surfaced as text.
    expect(screen.getByText(/Medication Education :/)).toBeInTheDocument();
    expect(screen.getByText(/Admit 6/)).toBeInTheDocument();
    expect(screen.getByText(/Current 6/)).toBeInTheDocument();
    // WHY: target date is formatted MM/DD/YYYY for clinician readability.
    expect(screen.getByText(/06\/10\/2026/)).toBeInTheDocument();
  });

  it("should reflect the Measure Met checkbox state from context", () => {
    mockUseCtx.mockReturnValue(
      emptyCtx({
        medicationEditorValue: "<p>Med teaching</p>",
        isMeasureMet6: true,
      }),
    );
    render(<ViewTreatmentPlanPsychosocialGoalsPart2 />);
    // WHY: isMeasureMet6 === true means the "Yes" box is checked. (The Yes/No
    // checkboxes share a duplicate id in source, so query by accessible name.)
    expect(screen.getByLabelText("Yes")).toBeChecked();
  });

  it("should render the Managing Mental Health and Legal goal cards", () => {
    mockUseCtx.mockReturnValue(
      emptyCtx({
        mentalHealthEditorValue: "<p>MH goal</p>",
        legalEditorValue: "<p>Legal goal</p>",
      }),
    );
    render(<ViewTreatmentPlanPsychosocialGoalsPart2 />);
    expect(screen.getByText(/Managing Mental Health :/)).toBeInTheDocument();
    expect(screen.getByText(/Legal :/)).toBeInTheDocument();
  });

  it("should render dynamic Other goal cards from otherArray", () => {
    mockUseCtx.mockReturnValue(
      emptyCtx({
        otherArray: [
          {
            goalTitle: "Spiritual",
            otherType: "<p>Faith goal</p>",
            admissionMeasure: "<p>OA admit</p>",
            isMeasureMetOther: true,
          },
        ],
      }),
    );
    render(<ViewTreatmentPlanPsychosocialGoalsPart2 />);
    // WHY: a custom goal uses its goalTitle as the label and shows Measure Met "Yes".
    expect(screen.getByText(/Spiritual :/)).toBeInTheDocument();
    expect(screen.getByText(/OA admit/)).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("should render resident participation/attitude/progress selections", () => {
    mockUseCtx.mockReturnValue(
      emptyCtx({
        residentParticipation: ["100%"],
        residentAttitute: ["Attentive"],
        residentProgress: ["Good Progress"],
      }),
    );
    render(<ViewTreatmentPlanPsychosocialGoalsPart2 />);
    expect(
      screen.getByText(/Resident overall participation in treatment :/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Resident Attitude :/)).toBeInTheDocument();
    expect(screen.getByText(/Resident progress :/)).toBeInTheDocument();
    // WHY: the selected participation value drives the checked checkbox.
    expect(screen.getByLabelText("100%")).toBeChecked();
    expect(screen.getByLabelText("Attentive")).toBeChecked();
    expect(screen.getByLabelText("Good Progress")).toBeChecked();
  });
});

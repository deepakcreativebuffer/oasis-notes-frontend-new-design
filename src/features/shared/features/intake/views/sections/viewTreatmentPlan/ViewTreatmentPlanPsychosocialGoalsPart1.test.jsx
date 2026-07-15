/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import ViewTreatmentPlanPsychosocialGoalsPart1 from "./ViewTreatmentPlanPsychosocialGoalsPart1";
import { ViewTreatmentPlanFormProvider } from "../../context/ViewTreatmentPlanFormContext";

// ReactQuill is a heavy editor under no test here; stub it to a div that
// renders its read-only `value` so we can assert the displayed goal text.
vi.mock("react-quill", () => ({
  default: ({ value, readOnly }) => (
    <div data-testid="quill" data-readonly={String(readOnly)}>
      {value}
    </div>
  ),
}));

// Minimal context value: the component only reads fields off the context object,
// so an empty object means "all goals empty" and checkAnyValue() hides every card.
function renderWithContext(value = {}) {
  return render(
    <ViewTreatmentPlanFormProvider value={value}>
      <ViewTreatmentPlanPsychosocialGoalsPart1 />
    </ViewTreatmentPlanFormProvider>,
  );
}

describe("ViewTreatmentPlanPsychosocialGoalsPart1", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the section headings even when no goal data is present", () => {
    renderWithContext({});

    // WHY: the static labels always render; only the per-goal Cards are gated.
    expect(
      screen.getByText(
        /Goals for Changes in the Resident psychosocial Interaction or Behaviour/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Measurables Treatment Goals")).toBeInTheDocument();
  });

  it("should not render any goal Card or quill editors when all fields are empty", () => {
    renderWithContext({});

    // WHY: checkAnyValue() returns false for every goal block, so no read-only
    // editors (ReactQuill) are mounted for an empty treatment plan.
    expect(screen.queryAllByTestId("quill")).toHaveLength(0);
    expect(screen.queryByText("Maintain sobriety :")).not.toBeInTheDocument();
  });

  it("should show the desired measure only when provided", () => {
    const { rerender } = renderWithContext({});
    expect(screen.queryByText("Desired measure :")).not.toBeInTheDocument();

    rerender(
      <ViewTreatmentPlanFormProvider value={{ desiredMeasure: "80%" }}>
        <ViewTreatmentPlanPsychosocialGoalsPart1 />
      </ViewTreatmentPlanFormProvider>,
    );
    expect(screen.getByText("Desired measure :")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("should render the sobriety goal Card with its editor value when data exists", () => {
    renderWithContext({
      sobrietyEditorValue: "Maintain sobriety goal text",
      comments1: "Progress note",
    });

    // WHY: any non-empty field in the first goal block reveals the sobriety Card.
    expect(screen.getByText("Maintain sobriety :")).toBeInTheDocument();
    expect(screen.getByText("Maintain sobriety goal text")).toBeInTheDocument();
    expect(screen.getByText("Progress note")).toBeInTheDocument();
  });

  it("should format the target date of completion as MM/DD/YYYY", () => {
    renderWithContext({
      sobrietyEditorValue: "goal",
      estimatedDateOfCompletion1: "2026-06-10",
    });

    // WHY: clinicians read target dates in MM/DD/YYYY; the view formats raw ISO.
    expect(
      screen.getByText(/Target Date of Completion :\s*06\/10\/2026/),
    ).toBeInTheDocument();
  });

  it("should extract paragraph text from HTML admission/current measures", () => {
    renderWithContext({
      sobrietyEditorValue: "goal",
      admissionMeasure1: "<p>Admission 5</p>",
      currentMeasure1: "<p>Current 8</p>",
    });

    // WHY: measures are stored as quill HTML; the view strips the <p> wrapper.
    expect(
      screen.getByText(/Admission Measure :\s*Admission 5/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Current Measure :\s*Current 8/),
    ).toBeInTheDocument();
  });

  it("should reflect the Measure Met selection from context state", () => {
    renderWithContext({
      sobrietyEditorValue: "goal",
      isMeasureMet1: true,
      setIsMeasureMet1: vi.fn(),
    });

    // WHY: "Measure Met = Yes" drives outcome tracking; the Yes checkbox must
    // mirror the stored boolean for the first goal. (Yes/No share an id in the
    // source markup, so we index by render order via role.)
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked(); // Yes
    expect(checkboxes[1]).not.toBeChecked(); // No
  });

  it("should call the matching setter when a Measure Met checkbox is toggled", () => {
    const setIsMeasureMet1 = vi.fn();
    renderWithContext({
      sobrietyEditorValue: "goal",
      isMeasureMet1: null,
      setIsMeasureMet1,
    });

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(setIsMeasureMet1).toHaveBeenCalledTimes(1);
  });

  it("should render multiple goal Cards independently based on each block's data", () => {
    renderWithContext({
      sobrietyEditorValue: "Sobriety text",
      employmentEditorValue: "Employment text",
    });

    // WHY: goal blocks are independent; only blocks with data should appear,
    // so the unrelated Independent Living Skills block stays hidden.
    expect(screen.getByText("Maintain sobriety :")).toBeInTheDocument();
    expect(screen.getByText("Employment :")).toBeInTheDocument();
    expect(
      screen.queryByText("Independent Living Skills :"),
    ).not.toBeInTheDocument();
  });
});

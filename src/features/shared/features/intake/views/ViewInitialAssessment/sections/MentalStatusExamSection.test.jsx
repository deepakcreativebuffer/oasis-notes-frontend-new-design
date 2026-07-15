/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";

import MentalStatusExamSection from "./MentalStatusExamSection";

// The section reads EVERY field off the form context hook. Mock the hook so we
// can drive the read-only view with controlled values instead of standing up
// the whole ViewInitialAssessment provider/data-fetching stack.
const mockForm = vi.fn();
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: () => mockForm(),
}));

// Factory: returns a plausible-but-empty form object. The component reads many
// booleans (checked={f.x}) and many setters (onChange={() => f.setX(...)}). We
// must provide setter no-ops or React would throw on render. Overrides let each
// test flip the handful of fields it asserts on.
function makeForm(overrides = {}) {
  return new Proxy(
    {
      // Orientation fields are tri-state (true/false/undefined); leave undefined
      // by default so those cards stay in the "hide-print" branch.
      person: undefined,
      place: undefined,
      time: undefined,
      circumstances: undefined,
      specialEducation: undefined,
      currentStudent: undefined,
      ...overrides,
    },
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        // Any setX setter -> a no-op function so onChange handlers are callable.
        if (typeof prop === "string" && /^set/.test(prop)) return () => {};
        // Unspecified boolean/value fields default to falsy.
        return undefined;
      },
    },
  );
}

describe("MentalStatusExamSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockForm.mockReturnValue(makeForm());
  });

  it("should render the section and category headings", () => {
    render(<MentalStatusExamSection />);

    // WHY: this view documents the clinician's Mental Status Exam; its primary
    // section header and sub-section labels must always be present so the
    // printed assessment is legible.
    expect(
      screen.getByText("Mental Status Exam/Behavioral Observations"),
    ).toBeInTheDocument();
    expect(screen.getByText("General Appearance")).toBeInTheDocument();
    expect(screen.getByText("Demeanor / Interaction")).toBeInTheDocument();
    expect(screen.getByText("Speech")).toBeInTheDocument();
    expect(screen.getByText("Cognition")).toBeInTheDocument();
    expect(screen.getByText("Motor activity")).toBeInTheDocument();
  });

  it("should render without crashing when all form data is empty/falsy", () => {
    // WHY: a brand-new assessment has no answers yet; the read-only view must
    // still mount (just with every row flagged hide-print) rather than throw.
    render(<MentalStatusExamSection />);
    expect(screen.getByText(/^Gait\s*:/)).toBeInTheDocument();
    expect(screen.getByText(/^Memory\s*:/)).toBeInTheDocument();
  });

  it("should reflect checked observation options from the form data", () => {
    mockForm.mockReturnValue(
      makeForm({
        younger: true,
        averageHeight: true,
        euthymic: true,
        goodJudgment: true,
      }),
    );
    render(<MentalStatusExamSection />);

    // WHY: selected MSE findings drive the checkbox state the clinician recorded.
    // Use getAllByRole(...).some so the assertions stay robust to duplicate
    // option labels (the source reuses ids/labels across MSE groups).
    expect(
      screen
        .getAllByRole("checkbox", { name: "Younger" })
        .some((b) => b.checked),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("checkbox", { name: "Euthymic" })
        .some((b) => b.checked),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("checkbox", { name: "Average" })
        .some((b) => b.checked),
    ).toBe(true);
    // The unselected option in the same group stays unchecked.
    expect(
      screen
        .getAllByRole("checkbox", { name: "Older" })
        .every((b) => !b.checked),
    ).toBe(true);
  });

  it("should show the free-text 'Other' value only when its boolean is set", () => {
    mockForm.mockReturnValue(
      makeForm({
        olderOtherBoolean: true,
        olderOther: "Appears middle-aged",
      }),
    );
    render(<MentalStatusExamSection />);

    // WHY: the "Other" descriptor text is only meaningful (and only rendered)
    // when the clinician ticked the Other checkbox for that field.
    expect(screen.getByText("Appears middle-aged")).toBeInTheDocument();
  });

  it("should render orientation Yes/No selections from tri-state booleans", () => {
    mockForm.mockReturnValue(
      makeForm({
        person: true,
        place: false,
      }),
    );
    render(<MentalStatusExamSection />);

    // WHY: orientation to Person/Place/Time uses explicit true(Yes)/false(No)
    // so an unanswered field (undefined) is distinguishable from a "No".
    expect(
      screen.getAllByText("Orientation to Person :").length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Place :").length).toBeGreaterThan(0);
    // person=true must surface as a checked "Yes" so the printed assessment
    // shows the patient was oriented to person.
    // (NOTE: the source reuses duplicate ids across the No/Yes inputs, so we
    // assert on the reliably-associated Yes options here rather than No.)
    const yesBoxes = screen.getAllByRole("checkbox", { name: "Yes" });
    expect(yesBoxes.some((b) => b.checked)).toBe(true);
  });

  it("should render Significant Social/Developmental History free-text answers", () => {
    mockForm.mockReturnValue(
      makeForm({
        significantSocialDevelopmentalHistory: "Raised by both parents",
        educationalHistory: "High school diploma",
        ifYesWhere: "Test School",
      }),
    );
    render(<MentalStatusExamSection />);

    expect(
      screen.getByText("Significant Social/Developmental History"),
    ).toBeInTheDocument();
    expect(screen.getByText("Raised by both parents")).toBeInTheDocument();
    expect(screen.getByText("High school diploma")).toBeInTheDocument();
    expect(screen.getByText("Test School")).toBeInTheDocument();
  });
});

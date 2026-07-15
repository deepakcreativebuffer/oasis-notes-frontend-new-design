/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SafetyRiskAssessmentIntroSection from "./SafetyRiskAssessmentIntroSection";

// WHY: the section reads the InitialAssessment form context for many controlled
// values + setters. Mock the consumer hook to return a Proxy that yields a
// no-op fn for any "setX"/"handleX" key, while letting tests inject controlled
// field values per render via the shared `ctxState` object.
const { ctxState, mockUseCtx } = vi.hoisted(() => {
  const ctxState = { current: {} };
  const mockUseCtx = vi.fn(
    () =>
      new Proxy(ctxState.current, {
        get: (target, prop) => {
          if (prop in target) return target[prop];
          if (typeof prop === "string" && /^(set|handle)/.test(prop)) {
            return () => {};
          }
          return undefined;
        },
        has: () => true,
      }),
  );
  return { ctxState, mockUseCtx };
});

vi.mock("../context/InitialAssessmentFormContext", () => ({
  __esModule: true,
  useInitialAssessmentFormContext: mockUseCtx,
}));

// Helper: seed context field values, returning spies so callbacks are asserted.
const seedContext = (overrides = {}) => {
  const spies = {
    setCurrentThoughtsOfHarmingSelf: vi.fn(),
    setCurrentThoughtsOfHarmingOthers: vi.fn(),
    handleMultiSuicidalIdeation: vi.fn(),
    setSuicidalIdeationUrgency: vi.fn(),
    setSuicidalIdeationSeverity: vi.fn(),
  };
  ctxState.current = {
    currentThoughtsOfHarmingSelf: null,
    currentThoughtsOfHarmingOthers: null,
    suicidalIdeation: [],
    suicidalIdeationUrgency: null,
    suicidalIdeationSeverity: null,
    ...spies,
    ...overrides,
  };
  return spies;
};

describe("SafetyRiskAssessmentIntroSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    seedContext();
  });

  it("should render the section heading and all question labels", () => {
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    expect(screen.getByText("Safety and Risk Assessment")).toBeInTheDocument();
    expect(
      screen.getByText(/thinking about harming yourself/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/harming others or have/i)).toBeInTheDocument();
    expect(screen.getByText("Ideation")).toBeInTheDocument();
    expect(screen.getByText("Severity")).toBeInTheDocument();
    expect(screen.getByText("Increasing in:")).toBeInTheDocument();
  });

  it("should render all checkbox controls", () => {
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);
    // 2 + 2 + 4 + 2 + 2 = 12 checkboxes across the five cards.
    expect(screen.getAllByRole("checkbox")).toHaveLength(12);
  });

  it("should call setCurrentThoughtsOfHarmingSelf(true) when its Yes is toggled", () => {
    const spies = seedContext();
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    // First checkbox = harming-self "Yes".
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(spies.setCurrentThoughtsOfHarmingSelf).toHaveBeenCalledWith(true);
  });

  it("should call setCurrentThoughtsOfHarmingSelf(false) when its No is toggled", () => {
    const spies = seedContext();
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(spies.setCurrentThoughtsOfHarmingSelf).toHaveBeenCalledWith(false);
  });

  it("should reflect currentThoughtsOfHarmingSelf=true as a checked Yes box", () => {
    seedContext({ currentThoughtsOfHarmingSelf: true });
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    const boxes = screen.getAllByRole("checkbox");
    // box[0] = harming-self Yes, box[1] = harming-self No.
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
  });

  it("should route ideation toggles through handleMultiSuicidalIdeation", () => {
    const spies = seedContext();
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    // The "Fleeting" checkbox toggles the multi-value ideation handler.
    fireEvent.click(screen.getByLabelText("Fleeting"));
    expect(spies.handleMultiSuicidalIdeation).toHaveBeenCalledWith("Fleeting");
  });

  it("should reflect selected ideation values as checked", () => {
    seedContext({ suicidalIdeation: ["Periodic", "Constant"] });
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    expect(screen.getByLabelText("Periodic")).toBeChecked();
    expect(screen.getByLabelText("Constant")).toBeChecked();
    expect(screen.getByLabelText("Fleeting")).not.toBeChecked();
  });

  it("should call setSuicidalIdeationUrgency(true) when the Urgency Yes is toggled", () => {
    const spies = seedContext();
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    // Urgency Yes/No are the 9th/10th checkboxes (after self+others+ideation).
    fireEvent.click(screen.getAllByRole("checkbox")[8]);
    expect(spies.setSuicidalIdeationUrgency).toHaveBeenCalledWith(true);
  });

  it("should call setSuicidalIdeationSeverity(false) when the Severity No is toggled", () => {
    const spies = seedContext();
    renderWithProviders(<SafetyRiskAssessmentIntroSection />);

    // Last checkbox = severity "NO".
    const boxes = screen.getAllByRole("checkbox");
    fireEvent.click(boxes[boxes.length - 1]);
    expect(spies.setSuicidalIdeationSeverity).toHaveBeenCalledWith(false);
  });

  it("should render without crashing when context fields are undefined", () => {
    // WHY: suicidalIdeation uses optional chaining; missing values must not throw.
    ctxState.current = {};
    expect(() =>
      renderWithProviders(<SafetyRiskAssessmentIntroSection />),
    ).not.toThrow();
    expect(screen.getByText("Safety and Risk Assessment")).toBeInTheDocument();
  });
});

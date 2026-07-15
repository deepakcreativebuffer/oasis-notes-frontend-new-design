/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ActiveWithdrawalSymptomsSection from "./ActiveWithdrawalSymptomsSection";

// ─── Mocks ──────────────────────────────────────────────────────────
// This section is a pure presentation component driven entirely by the
// InitialAssessment form context. Mock the context hook so we can feed it a
// controlled state object and capture setter calls. The state object proxies
// any unset `setX` key to a vi.fn() so render never crashes on missing setters,
// while explicitly-defined state values control checked/visibility branches.
const mocks = vi.hoisted(() => {
  const setters = {};
  const makeFormState = (overrides = {}) =>
    new Proxy(
      { ...overrides },
      {
        get(target, prop) {
          if (prop in target) return target[prop];
          // Setters: return (and cache) a spy so assertions can read calls.
          if (typeof prop === "string" && prop.startsWith("set")) {
            if (!setters[prop]) setters[prop] = vi.fn();
            return setters[prop];
          }
          // Any other read (boolean state) defaults to undefined/falsey.
          return undefined;
        },
        has() {
          return true;
        },
      },
    );
  return { setters, makeFormState, ctx: vi.fn() };
});

vi.mock("../context/InitialAssessmentFormContext", () => ({
  useInitialAssessmentFormContext: () => mocks.ctx(),
}));

describe("ActiveWithdrawalSymptomsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset cached setter spies between tests.
    for (const k of Object.keys(mocks.setters)) delete mocks.setters[k];
    mocks.ctx.mockReturnValue(mocks.makeFormState());
  });

  it("renders both symptom group headings and all checkboxes", () => {
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);

    // WHY: the two Card sections are the structural anchors of this section.
    expect(screen.getByText("Active Withdrawal Symptoms")).toBeInTheDocument();
    expect(screen.getByText("Other Withdraw Symptoms")).toBeInTheDocument();

    // 10 checkboxes in the first group + 9 in the second = 19 total.
    expect(screen.getAllByRole("checkbox")).toHaveLength(19);
  });

  it("renders representative symptom labels from both groups", () => {
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);

    expect(
      screen.getByLabelText("None reported or observed"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Vomiting")).toBeInTheDocument();
    expect(screen.getByLabelText("Sweats")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Loss of muscle coordination"),
    ).toBeInTheDocument();
  });

  it("reflects checked state from the form context", () => {
    mocks.ctx.mockReturnValue(
      mocks.makeFormState({ Vomiting: true, Anxiety: false }),
    );
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);

    // WHY: checked prop must mirror the context boolean, not local state.
    expect(screen.getByLabelText("Vomiting")).toBeChecked();
    expect(screen.getByLabelText("Anxiety")).not.toBeChecked();
  });

  it("toggles a checkbox by inverting the current context value", () => {
    mocks.ctx.mockReturnValue(mocks.makeFormState({ Vomiting: false }));
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);

    fireEvent.click(screen.getByLabelText("Vomiting"));
    // WHY: onChange calls setVomiting(!Vomiting); current value is false -> true.
    expect(mocks.setters.setVomiting).toHaveBeenCalledWith(true);
  });

  it("toggles a second-group checkbox via its setter", () => {
    mocks.ctx.mockReturnValue(mocks.makeFormState({ Sweats: true }));
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);

    fireEvent.click(screen.getByLabelText("Sweats"));
    // WHY: current true -> setter receives the inverted value false.
    expect(mocks.setters.setSweats).toHaveBeenCalledWith(false);
  });

  it("hides the visual-disturbances 'Other' text field until its boolean is set", () => {
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);
    // WHY: BorderlessInput renders an input only when the Other boolean is true.
    // Default state has no extra text inputs (only checkboxes present).
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("shows the 'Other' free-text input when the Other boolean is true", () => {
    mocks.ctx.mockReturnValue(
      mocks.makeFormState({
        VisualDisturbancesOtherBoolean: true,
        VisualDisturbancesOtherType: "Hallucinations",
      }),
    );
    renderWithProviders(<ActiveWithdrawalSymptomsSection />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Hallucinations");

    // Typing forwards to the dedicated setter via BorderlessInput.setState.
    fireEvent.change(input, { target: { value: "Updated" } });
    expect(mocks.setters.setVisualDisturbancesOtherType).toHaveBeenCalledWith(
      "Updated",
    );
  });

  it("renders without crashing when the context returns an empty object", () => {
    // WHY: missing/empty data must not throw — Proxy supplies no-op setters.
    mocks.ctx.mockReturnValue(mocks.makeFormState({}));
    expect(() =>
      renderWithProviders(<ActiveWithdrawalSymptomsSection />),
    ).not.toThrow();
  });
});

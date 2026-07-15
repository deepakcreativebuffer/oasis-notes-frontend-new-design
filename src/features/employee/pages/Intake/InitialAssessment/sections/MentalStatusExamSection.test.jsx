/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import MentalStatusExamSection from "./MentalStatusExamSection";

// WHY: MentalStatusExamSection reads dozens of boolean flags + setters off the
// IA form context. Mock the context hook to a Proxy that returns the values we
// stash in `ctxValues` and a tracked setter fn for any `setX`/`handleX` key, so
// the section renders deterministically and we can assert wiring without the
// real form hook.
const ctx = vi.hoisted(() => {
  const ctxValues = {};
  const setterCalls = {};
  const handler = {
    get: (_t, prop) => {
      if (typeof prop !== "string") return undefined;
      if (prop in ctxValues) return ctxValues[prop];
      if (/^(set|seten|handle)/i.test(prop) || /^set/.test(prop)) {
        if (!setterCalls[prop]) setterCalls[prop] = vi.fn();
        return setterCalls[prop];
      }
      // Unknown field => falsy default so conditional inputs stay hidden.
      return undefined;
    },
  };
  return { ctxValues, setterCalls, proxy: new Proxy({}, handler) };
});

vi.mock("../context/InitialAssessmentFormContext", () => ({
  __esModule: true,
  useInitialAssessmentFormContext: () => ctx.proxy,
  InitialAssessmentFormProvider: ({ children }) => children,
}));

const resetCtx = () => {
  for (const k of Object.keys(ctx.ctxValues)) delete ctx.ctxValues[k];
  for (const k of Object.keys(ctx.setterCalls)) delete ctx.setterCalls[k];
};

describe("MentalStatusExamSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetCtx();
  });

  it("renders the section headings and all category labels", () => {
    renderWithProviders(<MentalStatusExamSection />);

    // WHY: clinicians must see every MSE category to document the exam.
    expect(
      screen.getByText("Mental Status Exam/Behavioral Observations"),
    ).toBeInTheDocument();
    [
      "General Appearance",
      "Apparent age",
      "Height",
      "Weight",
      "Attire",
      "Grooming",
      "Mood",
      "Affect",
      "Eye Contact",
      "Cooperation",
      "Articulation",
      "Tone",
      "Rate",
      "Quantity",
      "Response latency",
      "Thought content",
      "Delusions",
      "Hallucinations",
      "Gait",
      "Posture",
      "Psychomotor Activity",
      "Mannerisms",
      "Orientation to Person",
      "Judgment",
      "Insight",
      "Memory",
    ].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders many checkbox options for the exam categories", () => {
    renderWithProviders(<MentalStatusExamSection />);
    // Sanity: this is a large checkbox-heavy form.
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(50);
  });

  it("reflects a true context flag as a checked box (Younger)", () => {
    ctx.ctxValues.younger = true;
    renderWithProviders(<MentalStatusExamSection />);

    // "Younger" is the first option under Apparent age.
    const younger = screen.getByLabelText("Younger");
    expect(younger).toBeChecked();
  });

  it("toggles a flag setter when its checkbox is clicked (Older)", () => {
    renderWithProviders(<MentalStatusExamSection />);

    fireEvent.click(screen.getByLabelText("Older"));
    // onChange calls f.setOlder(!f.older) -> with older undefined, !undefined = true.
    expect(ctx.setterCalls.setOlder).toHaveBeenCalledWith(true);
  });

  it("shows the 'Apparent age' free-text input only when olderOtherBoolean is true", () => {
    const { rerender } = renderWithProviders(<MentalStatusExamSection />);
    // Hidden by default.
    let borderless = document.querySelectorAll(".borderless_input");
    const baseCount = borderless.length;

    resetCtx();
    ctx.ctxValues.olderOtherBoolean = true;
    ctx.ctxValues.olderOther = "looks 40";
    rerender(<MentalStatusExamSection />);

    // WHY: the conditional BorderlessInput renders only when the Other flag is on.
    const inputs = Array.from(document.querySelectorAll(".borderless_input"));
    expect(inputs.length).toBeGreaterThan(baseCount);
    expect(inputs.some((el) => el.value === "looks 40")).toBe(true);
  });

  it("routes orientation Person Yes/No to setPerson(true/false)", () => {
    renderWithProviders(<MentalStatusExamSection />);

    // The Orientation cards each expose a Yes/No pair; multiple labels share
    // text so target by id-derived checkboxes.
    const yes = document.getElementById("person");
    const no = document.getElementById("personno");
    fireEvent.click(yes);
    expect(ctx.setterCalls.setPerson).toHaveBeenCalledWith(true);
    fireEvent.click(no);
    expect(ctx.setterCalls.setPerson).toHaveBeenCalledWith(false);
  });

  it("reflects person === true as checked Yes and unchecked No", () => {
    ctx.ctxValues.person = true;
    renderWithProviders(<MentalStatusExamSection />);
    expect(document.getElementById("person")).toBeChecked();
    expect(document.getElementById("personno")).not.toBeChecked();
  });

  it("renders Judgment/Insight/Memory Good/Fair/Poor options", () => {
    renderWithProviders(<MentalStatusExamSection />);
    // These three categories each have Good/Fair/Poor — labels repeat.
    expect(screen.getAllByLabelText("Good").length).toBe(3);
    expect(screen.getAllByLabelText("Fair").length).toBe(3);
    expect(screen.getAllByLabelText("Poor").length).toBeGreaterThanOrEqual(3);
  });

  it("does not crash when the context provides no values (all undefined)", () => {
    // resetCtx already cleared everything; ensure a clean mount path.
    expect(() =>
      renderWithProviders(<MentalStatusExamSection />),
    ).not.toThrow();
    expect(screen.getByText("Demeanor / Interaction")).toBeInTheDocument();
  });
});

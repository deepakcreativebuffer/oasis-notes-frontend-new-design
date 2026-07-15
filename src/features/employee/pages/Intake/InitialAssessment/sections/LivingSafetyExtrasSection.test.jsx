/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import LivingSafetyExtrasSection from "./LivingSafetyExtrasSection";

// ─── Mocks ──────────────────────────────────────────────────────────
// The section reads everything off the InitialAssessment form context.
// We mock the context hook to return a controlled object so we can drive
// the component and assert on its setters without mounting the real form.
const mocks = vi.hoisted(() => ({
  ctx: { current: null },
}));

vi.mock("../context/InitialAssessmentFormContext", () => ({
  useInitialAssessmentFormContext: () => mocks.ctx.current,
}));

// CustomMultiSelectInput wraps react-select/creatable — stub it to a light
// input that surfaces the props we care about (value labels + onChange).
vi.mock("@/features/shared/ui/selectors/CustomMultiSelectInput", () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <div data-testid="multiselect">
      <span data-testid="ms-value">
        {(value || []).map((v) => v?.label).join(",")}
      </span>
      <button
        type="button"
        data-testid="ms-add"
        onClick={() =>
          onChange([...(value || []), { label: "Walker", value: "walker" }])
        }
      >
        add
      </button>
      <span data-testid="ms-options">{(options || []).length}</span>
    </div>
  ),
}));

// Build a controlled context. Any setX accessor not explicitly provided
// resolves to a fresh spy via a Proxy so render never crashes on a missing
// setter. We expose `spies` so individual setters can be asserted.
function makeContext(overrides = {}) {
  const base = {
    fallRisk: null,
    fallRiskExplanation: "",
    triggers: "",
    hobbiesLeisureActivities: "",
    selectedValueMedical: [],
    selectedValueSpecialPrecautions: [],
    diagnosisSelect: {
      selectedValueMedicalHandler: vi.fn(),
      selectedValueMedicalOption: [],
      handleKeySelectedValueMedical: vi.fn(),
      selectedValueSpecialPrecautionsHandler: vi.fn(),
      selectedValueSpecialPrecautionsOption: [],
      handleKeySelectedValueSpecialPrecautions: vi.fn(),
    },
    ...overrides,
  };
  return new Proxy(base, {
    get(target, prop) {
      if (prop in target) return target[prop];
      // Auto-provide no-op spies for any unspecified setter.
      if (typeof prop === "string" && prop.startsWith("set")) {
        target[prop] = vi.fn();
        return target[prop];
      }
      return undefined;
    },
    has: () => true,
  });
}

describe("LivingSafetyExtrasSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.ctx.current = makeContext();
  });

  it("renders the section labels", () => {
    renderWithProviders(<LivingSafetyExtrasSection />);
    expect(screen.getByText("Fall risk")).toBeInTheDocument();
    expect(screen.getByText("Triggers")).toBeInTheDocument();
    expect(screen.getByText("Hobbies/Leisure Activities")).toBeInTheDocument();
    expect(screen.getByText("Medical Equipment")).toBeInTheDocument();
    expect(screen.getByText("Special Precautions")).toBeInTheDocument();
  });

  it("reflects fallRisk=true by checking the Yes box and unchecking No", () => {
    mocks.ctx.current = makeContext({ fallRisk: true });
    renderWithProviders(<LivingSafetyExtrasSection />);
    // WHY: checkbox checked state is driven purely by the context value.
    expect(screen.getByLabelText("Yes")).toBeChecked();
    expect(screen.getByLabelText("No")).not.toBeChecked();
  });

  it("calls setFallRisk(true) when Yes is toggled", () => {
    const ctx = makeContext();
    mocks.ctx.current = ctx;
    renderWithProviders(<LivingSafetyExtrasSection />);
    fireEvent.click(screen.getByLabelText("Yes"));
    expect(ctx.setFallRisk).toHaveBeenCalledWith(true);
  });

  it("calls setFallRisk(false) when No is toggled", () => {
    const ctx = makeContext();
    mocks.ctx.current = ctx;
    renderWithProviders(<LivingSafetyExtrasSection />);
    fireEvent.click(screen.getByLabelText("No"));
    expect(ctx.setFallRisk).toHaveBeenCalledWith(false);
  });

  it("updates fall risk explanation text via setFallRiskExplanation", () => {
    const ctx = makeContext({
      fallRisk: true,
      fallRiskExplanation: "slippery",
    });
    mocks.ctx.current = ctx;
    renderWithProviders(<LivingSafetyExtrasSection />);
    const input = screen.getByDisplayValue("slippery");
    fireEvent.change(input, { target: { value: "icy" } });
    expect(ctx.setFallRiskExplanation).toHaveBeenCalledWith("icy");
  });

  it("updates triggers text via setTriggers", () => {
    const ctx = makeContext({ triggers: "loud noise" });
    mocks.ctx.current = ctx;
    renderWithProviders(<LivingSafetyExtrasSection />);
    const input = screen.getByDisplayValue("loud noise");
    fireEvent.change(input, { target: { value: "crowds" } });
    expect(ctx.setTriggers).toHaveBeenCalledWith("crowds");
  });

  it("updates hobbies via setHobbiesLeisureActivities", () => {
    const ctx = makeContext({ hobbiesLeisureActivities: "reading" });
    mocks.ctx.current = ctx;
    renderWithProviders(<LivingSafetyExtrasSection />);
    const input = screen.getByDisplayValue("reading");
    fireEvent.change(input, { target: { value: "painting" } });
    expect(ctx.setHobbiesLeisureActivities).toHaveBeenCalledWith("painting");
  });

  it("renders medical equipment multiselect values and forwards onChange", () => {
    const handler = vi.fn();
    const ctx = makeContext({
      selectedValueMedical: [{ label: "Cane", value: "cane" }],
      diagnosisSelect: {
        selectedValueMedicalHandler: handler,
        selectedValueMedicalOption: [{ label: "Cane", value: "cane" }],
        handleKeySelectedValueMedical: vi.fn(),
        selectedValueSpecialPrecautionsHandler: vi.fn(),
        selectedValueSpecialPrecautionsOption: [],
        handleKeySelectedValueSpecialPrecautions: vi.fn(),
      },
    });
    mocks.ctx.current = ctx;
    renderWithProviders(<LivingSafetyExtrasSection />);
    // WHY: there are two multiselects; the first is Medical Equipment.
    const adders = screen.getAllByTestId("ms-add");
    fireEvent.click(adders[0]);
    expect(handler).toHaveBeenCalled();
  });

  it("renders both multiselects (medical + special precautions)", () => {
    renderWithProviders(<LivingSafetyExtrasSection />);
    expect(screen.getAllByTestId("multiselect")).toHaveLength(2);
  });

  it("renders print-only joined labels for selected medical values", () => {
    mocks.ctx.current = makeContext({
      selectedValueMedical: [
        { label: "Cane", value: "cane" },
        { label: "Wheelchair", value: "wc" },
      ],
    });
    renderWithProviders(<LivingSafetyExtrasSection />);
    // WHY: the hidden print span joins the selected labels with ", ".
    expect(screen.getByText("Cane, Wheelchair")).toBeInTheDocument();
  });

  it("mounts without crashing when optional fields are empty/missing", () => {
    mocks.ctx.current = makeContext({
      selectedValueMedical: undefined,
      selectedValueSpecialPrecautions: undefined,
    });
    expect(() =>
      renderWithProviders(<LivingSafetyExtrasSection />),
    ).not.toThrow();
  });
});

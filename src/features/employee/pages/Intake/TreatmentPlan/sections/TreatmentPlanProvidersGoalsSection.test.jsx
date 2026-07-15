/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanProvidersGoalsSection from "./TreatmentPlanProvidersGoalsSection";

// WHY: the section reads its entire state/handler bag from this context hook.
// We hoist a mutable holder so each test can seed the values it asserts and
// inspect the setter spies the component calls.
const ctx = vi.hoisted(() => ({ value: {} }));

vi.mock("../context/TreatmentPlanFormContext", () => ({
  __esModule: true,
  useTreatmentPlanFormContext: () => ctx.value,
}));

// WHY: SelectMultiPrint wraps a portal-based creatable multiselect (heavy).
// Stub to a light surface exposing the value + an add affordance we assert on.
vi.mock("../components/TreatmentPlanPrintFields", () => ({
  __esModule: true,
  SelectMultiPrint: ({ value, onChange, options }) => (
    <div data-testid="select-multi">
      <span data-testid="select-multi-value">
        {(value || []).map((v) => v?.label).join(",")}
      </span>
      <span data-testid="select-multi-options">{(options || []).length}</span>
      <button
        type="button"
        data-testid="select-multi-add"
        onClick={() =>
          onChange([...(value || []), { label: "New", value: "New" }])
        }
      >
        add
      </button>
    </div>
  ),
}));

// WHY: BorderlessInput is a small Makers util; stub to a plain input so we can
// assert the conditional "Other" field renders and routes changes.
vi.mock("@/utils/Makers", () => ({
  __esModule: true,
  BorderlessInput: ({ value, setState, placeholder }) => (
    <input
      data-testid="barriers-other-input"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => setState(e.target.value)}
    />
  ),
}));

const makeCtx = (overrides = {}) => ({
  residentGoal: "",
  setResidentGoal: vi.fn(),
  allergies: "",
  setAllergies: vi.fn(),
  Triggers: "",
  setTriggers: vi.fn(),
  strengthsOption: [],
  strengths: [],
  strengthsHandler: vi.fn(),
  handleKeyStrengths: vi.fn(),
  Barriers: [],
  handleCheckboxChangeBarrier: vi.fn(),
  barriersBoolean: false,
  barriersOther: "",
  setBarriersOther: vi.fn(),
  barriersText: "",
  setBarriersText: vi.fn(),
  ...overrides,
});

describe("TreatmentPlanProvidersGoalsSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ctx.value = makeCtx();
  });

  it("renders the section labels and text fields without crashing on empty data", () => {
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    expect(screen.getByText("Resident Goals")).toBeInTheDocument();
    expect(screen.getByText("Allergies")).toBeInTheDocument();
    expect(screen.getByText("Strengths")).toBeInTheDocument();
    // Three "Enter text." text inputs (goals/allergies/triggers).
    expect(
      screen.getAllByPlaceholderText("Enter text").length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("reflects controlled field values from context", () => {
    ctx.value = makeCtx({
      residentGoal: "Stay sober",
      allergies: "Penicillin",
      Triggers: "Stress",
    });
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    expect(screen.getByDisplayValue("Stay sober")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Penicillin")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Stress")).toBeInTheDocument();
  });

  it("routes resident goal edits through setResidentGoal", () => {
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    // First "Enter text." input is the Resident Goals field.
    const goalInput = screen.getAllByPlaceholderText("Enter text.")[0];
    fireEvent.change(goalInput, { target: { value: "G" } });
    expect(ctx.value.setResidentGoal).toHaveBeenCalledWith("G");
  });

  it("renders the strengths multiselect with its options", () => {
    ctx.value = makeCtx({
      strengthsOption: [{ label: "Resilient", value: "Resilient" }],
      strengths: [{ label: "Honest", value: "Honest" }],
    });
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    expect(screen.getByTestId("select-multi-options").textContent).toBe("1");
    expect(screen.getByTestId("select-multi-value").textContent).toContain(
      "Honest",
    );
  });

  it("routes strengths multiselect changes through strengthsHandler", () => {
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    fireEvent.click(screen.getByTestId("select-multi-add"));
    expect(ctx.value.strengthsHandler).toHaveBeenCalledWith([
      { label: "New", value: "New" },
    ]);
  });

  it("renders all barrier checkboxes and reflects checked state from context", () => {
    ctx.value = makeCtx({ Barriers: ["cognitive", "financial"] });
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    const cognitive = document.getElementById("cognitive");
    const financial = document.getElementById("financial");
    const racial = document.getElementById("racial");
    expect(cognitive).toBeChecked();
    expect(financial).toBeChecked();
    expect(racial).not.toBeChecked();
  });

  it("toggles a barrier via handleCheckboxChangeBarrier with its key", () => {
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    fireEvent.click(document.getElementById("cognitive"));
    expect(ctx.value.handleCheckboxChangeBarrier).toHaveBeenCalledWith(
      "cognitive",
    );
  });

  it("hides the Other free-text input when barriersBoolean is false", () => {
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);
    expect(screen.queryByTestId("barriers-other-input")).toBeNull();
  });

  it("shows and routes the Other free-text input when barriersBoolean is true", () => {
    ctx.value = makeCtx({ barriersBoolean: true, barriersOther: "extra" });
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    const input = screen.getByTestId("barriers-other-input");
    expect(input).toHaveValue("extra");
    fireEvent.change(input, { target: { value: "new" } });
    expect(ctx.value.setBarriersOther).toHaveBeenCalledWith("new");
  });

  it("routes comment textarea edits through setBarriersText", () => {
    ctx.value = makeCtx({ barriersText: "note" });
    renderWithProviders(<TreatmentPlanProvidersGoalsSection />);

    const textarea = screen.getByDisplayValue("note");
    fireEvent.change(textarea, { target: { value: "note2" } });
    expect(ctx.value.setBarriersText).toHaveBeenCalledWith("note2");
  });

  it("does not crash when Barriers is undefined (optional chaining)", () => {
    ctx.value = makeCtx({ Barriers: undefined });
    expect(() =>
      renderWithProviders(<TreatmentPlanProvidersGoalsSection />),
    ).not.toThrow();
  });
});

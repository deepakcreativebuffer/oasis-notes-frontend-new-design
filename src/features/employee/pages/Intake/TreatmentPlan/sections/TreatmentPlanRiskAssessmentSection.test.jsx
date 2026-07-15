/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanRiskAssessmentSection from "./TreatmentPlanRiskAssessmentSection";
import { TreatmentPlanFormProvider } from "../context/TreatmentPlanFormContext";

// Build a form-context value with empty selections + handler spies. The real
// component only reads field arrays/booleans and calls handleCheckboxChange*.
const makeContext = (overrides = {}) => ({
  behavioralSymptoms: [],
  physicalSymptoms: [],
  consnotiveSymptoms: [],
  psychosocialSymptoms: [],
  behavioralSymptomsBoolean: false,
  physicalSymptomsBoolean: false,
  consnotiveSymptomsBoolean: false,
  psychosocialSymptomsBoolean: false,
  behavioralSymptomsOther: "",
  physicalSymptomsOther: "",
  consnotiveSymptomsOther: "",
  psychosocialSymptomssOther: "",
  handleCheckboxChangeBehavioral: vi.fn(),
  handleCheckboxChangePhysical: vi.fn(),
  handleCheckboxChangeCognitive: vi.fn(),
  handleCheckboxChangePsychosocial: vi.fn(),
  setBehavioralSymptomsOther: vi.fn(),
  setPhysicalSymptomsOther: vi.fn(),
  setConsnotiveSymptomsOther: vi.fn(),
  setPsychosocialSymptomsOther: vi.fn(),
  ...overrides,
});

const renderSection = (ctxOverrides = {}) =>
  renderWithProviders(
    <TreatmentPlanFormProvider value={makeContext(ctxOverrides)}>
      <TreatmentPlanRiskAssessmentSection />
    </TreatmentPlanFormProvider>,
  );

describe("TreatmentPlanRiskAssessmentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all four symptom-category headings", () => {
    renderSection();
    // WHY: each symptom group must render so clinicians can record risk signs.
    expect(screen.getByText("Behavioral Symptoms")).toBeInTheDocument();
    expect(screen.getByText("Physical Symptoms")).toBeInTheDocument();
    expect(screen.getByText("Cognitive Symptoms")).toBeInTheDocument();
    expect(screen.getByText(/Psychosocial Symptoms/)).toBeInTheDocument();
  });

  it("renders the section title and representative checkbox options", () => {
    renderSection();
    expect(
      screen.getByText(
        /Risk Assessment \/ Warning Signs & Symptoms of Suicidal Ideations/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Self-injuring")).toBeInTheDocument();
    expect(screen.getByLabelText("Insomnia")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Lacking the ability to concentrate"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Feeling of helplessness"),
    ).toBeInTheDocument();
  });

  it("reflects checked behavioral symptoms from context", () => {
    renderSection({ behavioralSymptoms: ["selfInjuring"] });
    expect(screen.getByLabelText("Self-injuring")).toBeChecked();
    expect(screen.getByLabelText("Social isolation")).not.toBeChecked();
  });

  it("invokes the behavioral handler with the option key on toggle", () => {
    const ctx = makeContext();
    renderWithProviders(
      <TreatmentPlanFormProvider value={ctx}>
        <TreatmentPlanRiskAssessmentSection />
      </TreatmentPlanFormProvider>,
    );
    fireEvent.click(screen.getByLabelText("Self-injuring"));
    expect(ctx.handleCheckboxChangeBehavioral).toHaveBeenCalledWith(
      "selfInjuring",
    );
  });

  it("invokes the physical handler with the option key on toggle", () => {
    const ctx = makeContext();
    renderWithProviders(
      <TreatmentPlanFormProvider value={ctx}>
        <TreatmentPlanRiskAssessmentSection />
      </TreatmentPlanFormProvider>,
    );
    fireEvent.click(screen.getByLabelText("Hypersomnia"));
    expect(ctx.handleCheckboxChangePhysical).toHaveBeenCalledWith(
      "hypersomnia",
    );
  });

  it("invokes the cognitive handler with the option key on toggle", () => {
    const ctx = makeContext();
    renderWithProviders(
      <TreatmentPlanFormProvider value={ctx}>
        <TreatmentPlanRiskAssessmentSection />
      </TreatmentPlanFormProvider>,
    );
    fireEvent.click(screen.getByLabelText("Memory impairment, ruminating"));
    expect(ctx.handleCheckboxChangeCognitive).toHaveBeenCalledWith(
      "memoryImpairment",
    );
  });

  it("invokes the psychosocial handler with the option key on toggle", () => {
    const ctx = makeContext();
    renderWithProviders(
      <TreatmentPlanFormProvider value={ctx}>
        <TreatmentPlanRiskAssessmentSection />
      </TreatmentPlanFormProvider>,
    );
    fireEvent.click(screen.getByLabelText("Anxiety"));
    expect(ctx.handleCheckboxChangePsychosocial).toHaveBeenCalledWith(
      "anxiety",
    );
  });

  it("shows the behavioral 'Other' free-text input only when its boolean flag is set", () => {
    const { rerender } = renderSection();
    // No borderless input rendered by default.
    expect(document.querySelector(".borderless_input")).toBeNull();

    rerender(
      <TreatmentPlanFormProvider
        value={makeContext({
          behavioralSymptomsBoolean: true,
          behavioralSymptomsOther: "extra note",
        })}
      >
        <TreatmentPlanRiskAssessmentSection />
      </TreatmentPlanFormProvider>,
    );
    const input = document.querySelector(".borderless_input");
    expect(input).toBeTruthy();
    expect(input).toHaveValue("extra note");
  });

  it("routes the 'Other' free-text edits through the setter", () => {
    const ctx = makeContext({ behavioralSymptomsBoolean: true });
    renderWithProviders(
      <TreatmentPlanFormProvider value={ctx}>
        <TreatmentPlanRiskAssessmentSection />
      </TreatmentPlanFormProvider>,
    );
    const input = document.querySelector(".borderless_input");
    fireEvent.change(input, { target: { value: "new" } });
    expect(ctx.setBehavioralSymptomsOther).toHaveBeenCalledWith("new");
  });

  it("renders resiliently when symptom arrays are missing (undefined)", () => {
    // WHY: optional chaining guards .includes; absent arrays must not throw.
    expect(() =>
      renderSection({
        behavioralSymptoms: undefined,
        physicalSymptoms: undefined,
        consnotiveSymptoms: undefined,
        psychosocialSymptoms: undefined,
      }),
    ).not.toThrow();
    expect(screen.getByText("Behavioral Symptoms")).toBeInTheDocument();
  });
});

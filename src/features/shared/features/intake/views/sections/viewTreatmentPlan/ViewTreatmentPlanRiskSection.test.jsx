/** @format */

import React from "react";
import { render, screen } from "@/test-utils";
import ViewTreatmentPlanRiskSection from "./ViewTreatmentPlanRiskSection";

// Mock the form context hook so we can drive the read-only view section with
// controlled return values instead of wiring a full provider tree.
const mockUseContext = vi.fn();
vi.mock("../../context/ViewTreatmentPlanFormContext", () => ({
  useViewTreatmentPlanFormContext: () => mockUseContext(),
}));

// Minimal default context value matching the shape the component reads. All
// symptom arrays default to empty so the gated sub-sections stay hidden unless
// a test opts in.
function makeContext(overrides = {}) {
  return {
    behavioralSymptoms: [],
    behavioralSymptomsOther: "",
    behavioralSymptomsBoolean: false,
    physicalSymptoms: [],
    physicalSymptomsOther: "",
    physicalSymptomsBoolean: false,
    consnotiveSymptoms: [],
    consnotiveSymptomsOther: "",
    consnotiveSymptomsBoolean: false,
    psychosocialSymptoms: [],
    psychosocialSymptomssOther: "",
    psychosocialSymptomsBoolean: false,
    interventionsImplemented: [],
    interventionsImplementedOther: "",
    handleCheckboxChangeBehavioral: vi.fn(),
    handleCheckboxChangePhysical: vi.fn(),
    handleCheckboxChangeCognitive: vi.fn(),
    handleCheckboxChangePsychosocial: vi.fn(),
    ...overrides,
  };
}

describe("ViewTreatmentPlanRiskSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the risk assessment heading even when no symptoms are recorded", () => {
    // WHY: the heading is always present (only visually hidden via class) so the
    // empty-data path must not crash and should still mount the section label.
    mockUseContext.mockReturnValue(makeContext());
    render(<ViewTreatmentPlanRiskSection />);
    expect(
      screen.getByText(
        "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
      ),
    ).toBeInTheDocument();
  });

  it("should not render any symptom sub-sections when all symptom arrays are empty", () => {
    // WHY: each symptom block is gated behind its array length / Other text, so an
    // intake with no documented symptoms must omit the detailed grids.
    mockUseContext.mockReturnValue(makeContext());
    render(<ViewTreatmentPlanRiskSection />);
    expect(screen.queryByText("Behavioral Symptoms :")).not.toBeInTheDocument();
    expect(screen.queryByText("Physical Symptoms :")).not.toBeInTheDocument();
    expect(screen.queryByText("Cognitive Symptoms :")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Psychosocial Symptoms :"),
    ).not.toBeInTheDocument();
  });

  it("should render the behavioral block with the documented symptom checked", () => {
    mockUseContext.mockReturnValue(
      makeContext({ behavioralSymptoms: ["socialIsolation"] }),
    );
    render(<ViewTreatmentPlanRiskSection />);
    expect(screen.getByText("Behavioral Symptoms :")).toBeInTheDocument();
    // WHY: a documented warning sign must render as checked so the reviewer sees
    // exactly which behavioral risk symptoms were recorded.
    expect(
      screen.getByRole("checkbox", { name: "Social isolation" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Self-injuring" }),
    ).not.toBeChecked();
  });

  it("should render the behavioral 'Other' free text only when its flag is set", () => {
    mockUseContext.mockReturnValue(
      makeContext({
        behavioralSymptoms: ["Other"],
        behavioralSymptomsBoolean: true,
        behavioralSymptomsOther: "Test Patient withdrawn from peers",
      }),
    );
    render(<ViewTreatmentPlanRiskSection />);
    // WHY: when "Other" is selected the clinician's free-text detail must surface.
    expect(
      screen.getByText("Test Patient withdrawn from peers"),
    ).toBeInTheDocument();
  });

  it("should render the physical symptoms block when physical data is present", () => {
    mockUseContext.mockReturnValue(
      makeContext({ physicalSymptoms: ["insomnia", "panicAttacks"] }),
    );
    render(<ViewTreatmentPlanRiskSection />);
    expect(screen.getByText("Physical Symptoms :")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Insomnia" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Panic attacks" }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Hypersomnia" }),
    ).not.toBeChecked();
  });

  it("should render the cognitive symptoms block from Other text alone", () => {
    // WHY: the gate is an OR of array length OR Other text, so an Other note with
    // no checkbox selections still surfaces the cognitive block.
    mockUseContext.mockReturnValue(
      makeContext({
        consnotiveSymptomsBoolean: true,
        consnotiveSymptomsOther: "Test Patient ruminates at night",
      }),
    );
    render(<ViewTreatmentPlanRiskSection />);
    expect(screen.getByText("Cognitive Symptoms :")).toBeInTheDocument();
    expect(
      screen.getByText("Test Patient ruminates at night"),
    ).toBeInTheDocument();
  });

  it("should render the psychosocial symptoms block with the documented symptom checked", () => {
    mockUseContext.mockReturnValue(
      makeContext({ psychosocialSymptoms: ["depression", "anxiety"] }),
    );
    render(<ViewTreatmentPlanRiskSection />);
    expect(screen.getByText("Psychosocial Symptoms :")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Depression" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Anxiety" })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Mood Swings" }),
    ).not.toBeChecked();
  });

  it("should render all four symptom blocks together when every category has data", () => {
    // WHY: a fully documented risk assessment must display every symptom category
    // simultaneously in the printed plan.
    mockUseContext.mockReturnValue(
      makeContext({
        behavioralSymptoms: ["aboutdeath"],
        physicalSymptoms: ["insomnia"],
        consnotiveSymptoms: ["concentration"],
        psychosocialSymptoms: ["irritability"],
      }),
    );
    render(<ViewTreatmentPlanRiskSection />);
    expect(screen.getByText("Behavioral Symptoms :")).toBeInTheDocument();
    expect(screen.getByText("Physical Symptoms :")).toBeInTheDocument();
    expect(screen.getByText("Cognitive Symptoms :")).toBeInTheDocument();
    expect(screen.getByText("Psychosocial Symptoms :")).toBeInTheDocument();
  });
});

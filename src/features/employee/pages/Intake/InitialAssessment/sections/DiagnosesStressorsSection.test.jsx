/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import DiagnosesStressorsSection from "./DiagnosesStressorsSection";

// ─── Mocks ──────────────────────────────────────────────────────────
// The section reads ALL of its state/handlers from the IA form context.
// Mock the context hook to return a controlled object. Concrete values
// (arrays, strings) are seeded explicitly; every `setX`/`handleX`/`removeX`
// accessor falls through to a no-op spy via a Proxy so render never crashes
// on an undefined setter and we can assert wiring on a few key handlers.
const mocks = vi.hoisted(() => ({
  setRiskLevel: vi.fn(),
  handlePsychiatricDiagnoses: vi.fn(),
  handleMedicalDiagnoses: vi.fn(),
  removePsychiatricDiagnosesArray: vi.fn(),
  removeMedicalDiagnosesArray: vi.fn(),
  treatmentRecommendationsHandler: vi.fn(),
  setOtherBoolean: vi.fn(),
  ctx: { current: null },
}));

vi.mock("../context/InitialAssessmentFormContext", () => ({
  useInitialAssessmentFormContext: () => mocks.ctx.current,
}));

// BorderlessInput is a small Makers helper; stub to a plain input we can
// detect when the "Other" stressor branch is open.
vi.mock("@/utils/Makers", () => ({
  BorderlessInput: ({ value, placeholder }) => (
    <input
      data-testid="borderless-input"
      value={value || ""}
      placeholder={placeholder}
      readOnly
    />
  ),
}));

// ─── Controlled form-context factory ────────────────────────────────
// Concrete fields the component dereferences directly (arrays + a few
// strings that are `.split(...)`-ed must be strings, not undefined).
const makeFormContext = (overrides = {}) => {
  const base = {
    riskLevel: "",
    psychiatricDiagnosesArray: [],
    medicalDiagnosesArray: [],
    treatmentRecommendations: [],
    // string fields that are split()/used directly:
    otherdescription: "",
    OtherdescriptionMedicalDiagnoses: "",
    psychiatricPrimaryDescription: "",
    canDelete: false,
    otherBoolean: false,
    otherSignificantRecentLosses: false,
    residentName: "Test Patient",
    getApiData: { data: { residentName: "Test Patient" } },
    // named handler spies we assert on:
    setRiskLevel: mocks.setRiskLevel,
    handlePsychiatricDiagnoses: mocks.handlePsychiatricDiagnoses,
    handleMedicalDiagnoses: mocks.handleMedicalDiagnoses,
    removePsychiatricDiagnosesArray: mocks.removePsychiatricDiagnosesArray,
    removeMedicalDiagnosesArray: mocks.removeMedicalDiagnosesArray,
    treatmentRecommendationsHandler: mocks.treatmentRecommendationsHandler,
    setOtherBoolean: mocks.setOtherBoolean,
    ...overrides,
  };
  // Proxy: any unseeded `setX`/`handleX`/`removeX` accessor returns a no-op so
  // the component can wire onChange handlers without throwing; unseeded plain
  // string/value fields read back as "" (NOT a function — several are
  // `.split("\n")`-ed unconditionally and a function would be truthy + crash).
  return new Proxy(base, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop !== "string") return undefined;
      if (/^(set|handle|remove)/.test(prop)) return () => {};
      return "";
    },
    has: () => true,
  });
};

const renderSection = (overrides) => {
  mocks.ctx.current = makeFormContext(overrides);
  return renderWithProviders(<DiagnosesStressorsSection />);
};

describe("DiagnosesStressorsSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders the core diagnoses/stressors structure", () => {
    renderSection();
    // WHY: smoke-confirm the major section labels render from the controlled
    // context without crashing on any undefined setter/value.
    expect(screen.getByText("Diagnoses")).toBeInTheDocument();
    // WHY: "Medical Diagnoses" appears as both a label and a table header.
    expect(screen.getAllByText("Medical Diagnoses").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Psychosocial or Environmental Stressors"),
    ).toBeInTheDocument();
    expect(screen.getByText("Treatment Recommendations")).toBeInTheDocument();
    // both diagnoses tables expose an "Add" button
    expect(screen.getAllByRole("button", { name: "Add" }).length).toBe(2);
  });

  it("renders without crashing when all array/value fields are empty", () => {
    // WHY: empty-state guard — arrays empty, strings blank, canDelete false.
    expect(() => renderSection()).not.toThrow();
    // WHY: both diagnosis tables emit a "Primary*" row.
    expect(screen.getAllByText("Primary*").length).toBe(2);
  });

  it("reflects the selected risk level checkbox and fires setRiskLevel", async () => {
    const user = userEvent.setup();
    renderSection({ riskLevel: "High Risk" });

    const highRisk = screen.getByLabelText("High Risk");
    // WHY: the controlled risk level drives the checked checkbox.
    expect(highRisk).toBeChecked();
    expect(screen.getByLabelText("No Risk")).not.toBeChecked();

    await user.click(screen.getByLabelText("Low Risk"));
    expect(mocks.setRiskLevel).toHaveBeenCalledWith("Low Risk");
  });

  it("renders psychiatric and medical diagnosis array rows", () => {
    renderSection({
      psychiatricDiagnosesArray: [
        { name: "PsychDx", icdCode: "F99", description: "psych desc" },
      ],
      medicalDiagnosesArray: [
        { name: "MedDx", icdCode: "M99", description: "med desc" },
      ],
    });
    // WHY: appended diagnosis rows render their name/code/description cells.
    expect(screen.getByText("PsychDx")).toBeInTheDocument();
    expect(screen.getByText("F99")).toBeInTheDocument();
    expect(screen.getByText("MedDx")).toBeInTheDocument();
    expect(screen.getByText("med desc")).toBeInTheDocument();
  });

  it("shows delete icons and removes a row when canDelete is true", () => {
    const { container } = renderSection({
      canDelete: true,
      psychiatricDiagnosesArray: [
        { name: "PsychDx", icdCode: "F99", description: "d" },
      ],
      medicalDiagnosesArray: [
        { name: "MedDx", icdCode: "M99", description: "d" },
      ],
    });
    const delButtons = container.querySelectorAll(".del-btn");
    // WHY: one delete control per appended row (psych + medical).
    expect(delButtons.length).toBe(2);

    // onClick lives on the SVG icon itself, so click that node directly.
    const psychIcon = delButtons[0].querySelector("svg");
    fireEvent.click(psychIcon);
    expect(mocks.removePsychiatricDiagnosesArray).toHaveBeenCalledWith(0);
  });

  it("hides delete controls when canDelete is false", () => {
    const { container } = renderSection({
      canDelete: false,
      psychiatricDiagnosesArray: [
        { name: "PsychDx", icdCode: "F99", description: "d" },
      ],
    });
    // WHY: users without delete permission must not see remove affordances.
    expect(container.querySelectorAll(".del-btn").length).toBe(0);
  });

  it("fires the Add handlers for each diagnosis table", async () => {
    const user = userEvent.setup();
    renderSection();
    const addButtons = screen.getAllByRole("button", { name: "Add" });
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);
    // WHY: each table's Add commits a staged row via its own handler.
    expect(mocks.handlePsychiatricDiagnoses).toHaveBeenCalledTimes(1);
    expect(mocks.handleMedicalDiagnoses).toHaveBeenCalledTimes(1);
  });

  it("renders the Other-stressor free-text input only when otherBoolean is set", () => {
    const { rerender } = renderSection({ otherBoolean: false });
    expect(screen.queryByTestId("borderless-input")).toBeNull();

    // re-render with the branch enabled
    mocks.ctx.current = makeFormContext({
      otherBoolean: true,
      otherStressors: "needs help",
    });
    rerender(<DiagnosesStressorsSection />);
    // WHY: the specify input appears only after "Other" stressor is checked.
    expect(screen.getByTestId("borderless-input")).toBeInTheDocument();
  });

  it("reflects checked treatment recommendations and toggles via handler", async () => {
    const user = userEvent.setup();
    renderSection({ treatmentRecommendations: ["BHRF", "IOP"] });
    // WHY: recommendations stored as a string array drive the checked state.
    expect(screen.getByLabelText("BHRF")).toBeChecked();
    expect(screen.getByLabelText("IOP")).toBeChecked();
    expect(screen.getByLabelText("PHP")).not.toBeChecked();

    await user.click(screen.getByLabelText("PHP"));
    expect(mocks.treatmentRecommendationsHandler).toHaveBeenCalledWith("PHP");
  });

  it("embeds the resident name in the agreement checkboxes", () => {
    renderSection({ residentName: "Test Patient" });
    // WHY: the consent statements stamp the resident's name inline.
    expect(screen.getByText(/am in agreement with the/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Test Patient/).length).toBeGreaterThan(0);
  });
});

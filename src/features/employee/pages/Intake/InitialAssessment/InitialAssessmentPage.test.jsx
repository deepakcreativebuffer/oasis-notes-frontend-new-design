/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import InitialAssessmentPage from "./InitialAssessmentPage";

// ─── Mocks ──────────────────────────────────────────────────────────
// This page is a thin composition shell: it wires a controlled form object
// into context and lays out ~20 heavy assessment sections. We mock every
// child section + the signature/print/upper-bar widgets to light stubs so we
// can assert the page mounts, wires context, and renders the form scaffold
// without dragging in real selects, canvases, or print/clone work.
const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  handleSubmit: vi.fn((e) => e?.preventDefault?.()),
}));

// AddSignature (signature modal entry point) — stub so jsdom never touches a
// real signature canvas. Expose `show` so we can assert the page passed it.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) => (
    <div data-testid="add-signature" data-show={String(!!show)} />
  ),
}));

vi.mock("@/features/shared/features/intake/FormsUpperbar", () => ({
  __esModule: true,
  default: () => <div data-testid="form-upper" />,
}));

vi.mock("./components/common/NotificationCard", () => ({
  __esModule: true,
  default: ({ residentName }) => (
    <div data-testid="notification-card">{residentName}</div>
  ),
}));

// Props builders are pure mappers; neutralize them so spreads in the render
// path can't throw on the controlled form shape.
vi.mock("./components/PatientInformation/patientInformationProps", () => ({
  buildPatientInformationProps: () => ({}),
}));
vi.mock("./components/MedicalHistory/medicalConditionsProps", () => ({
  buildMedicalConditionsProps: () => ({}),
}));
vi.mock("./components/MedicalHistory/familyMentalHealthProps", () => ({
  buildFamilyMentalHealthProps: () => ({}),
}));
vi.mock("./components/MedicalHistory/substanceAbuseProps", () => ({
  buildSubstanceAbuseProps: () => ({}),
}));
vi.mock("./components/IndependentLiving/independentLivingSkillsProps", () => ({
  buildIndependentLivingSkillsProps: () => ({}),
}));

// Section components → testid-only stubs. Factories are inlined (no shared
// helper) because vi.mock is hoisted above any local declarations.
vi.mock("./components/PatientInformation/PatientInformationSection", () => ({
  __esModule: true,
  default: () => <div data-testid="patient-information-section" />,
}));
vi.mock("./components/MedicalHistory/MedicalConditionsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="medical-conditions-section" />,
}));
vi.mock("./components/MedicalHistory/FamilyMentalHealthSection", () => ({
  __esModule: true,
  default: () => <div data-testid="family-mental-health-section" />,
}));
vi.mock("./components/MedicalHistory/SubstanceAbuseSection", () => ({
  __esModule: true,
  default: () => <div data-testid="substance-abuse-section" />,
}));
vi.mock(
  "./components/IndependentLiving/IndependentLivingSkillsSection",
  () => ({
    __esModule: true,
    default: () => <div data-testid="independent-living-section" />,
  }),
);
vi.mock("./components/RiskAssessment/RiskFactorsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="risk-factors-section" />,
}));
vi.mock("./components/RiskAssessment/ProtectiveFactorsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="protective-factors-section" />,
}));
vi.mock("./sections/ActiveWithdrawalSymptomsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="active-withdrawal-section" />,
}));
vi.mock("./sections/MentalStatusExamSection", () => ({
  __esModule: true,
  default: () => <div data-testid="mental-status-exam-section" />,
}));
vi.mock("./sections/SocialDevelopmentEmploymentSection", () => ({
  __esModule: true,
  default: () => <div data-testid="social-development-section" />,
}));
vi.mock("./sections/LivingSafetyExtrasSection", () => ({
  __esModule: true,
  default: () => <div data-testid="living-safety-extras-section" />,
}));
vi.mock("./sections/SafetyRiskAssessmentIntroSection", () => ({
  __esModule: true,
  default: () => <div data-testid="safety-risk-intro-section" />,
}));
vi.mock("./sections/DiagnosesStressorsSection", () => ({
  __esModule: true,
  default: () => <div data-testid="diagnoses-stressors-section" />,
}));
vi.mock("./sections/SignaturesSubmitSection", () => ({
  __esModule: true,
  default: () => <div data-testid="signatures-submit-section" />,
}));

// ─── Controlled form (context value) ────────────────────────────────
// The view destructures hundreds of fields off the form context. Most are
// only forwarded to the (now stubbed) sections, so a Proxy that returns a
// harmless callable for any unknown key keeps render crash-free, while a few
// explicit fields drive the branches the page itself renders.
const makeForm = (overrides = {}) => {
  const explicit = {
    navigate: mocks.navigate,
    handleSubmit: mocks.handleSubmit,
    componentRef: React.createRef(),
    typedGuardDialog: null,
    signInModel7: false,
    residentName: "Test Patient",
    companyName: "Test Company",
    assessmentType: "Initial",
    getApiData: { data: {} },
    profileInfo: { _id: "emp-test-001", userType: "Employee" },
    url: "/initial-assessment",
    saveAsDrafIsNotEditable: false,
    saveAsDrafIsNotEditableWithoutSigner: false,
    isNotEditableWithSigner: false,
    ...overrides,
  };
  // Proxy fallback: unknown reads return a no-op callable (works for setX,
  // handlers, and is safely spreadable since functions expose no own props).
  return new Proxy(explicit, {
    get(target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop === "symbol") return undefined;
      return () => {};
    },
    has: () => true,
  });
};

describe("InitialAssessmentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom has no 2d canvas context; stub it in case any path touches one.
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  it("mounts with the form provider and renders the page title", () => {
    renderWithProviders(<InitialAssessmentPage form={makeForm()} />);

    // WHY: the heading confirms the provider resolved and the view rendered
    // (the view throws if used outside InitialAssessmentFormProvider).
    expect(
      screen.getByText("Initial Assessment", { selector: ".heading" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
  });

  it("renders the assessment scaffold sections", () => {
    renderWithProviders(<InitialAssessmentPage form={makeForm()} />);

    // WHY: spot-check that the major sections compose into the form so a
    // future import/wiring regression surfaces here.
    expect(
      screen.getByTestId("patient-information-section"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mental-status-exam-section"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("risk-factors-section")).toBeInTheDocument();
    expect(
      screen.getByTestId("protective-factors-section"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("signatures-submit-section")).toBeInTheDocument();
  });

  it("forwards resident/company context to the notification card", () => {
    renderWithProviders(<InitialAssessmentPage form={makeForm()} />);

    // WHY: NotificationCard is fed straight from context — confirms the page
    // threads the resident identity through rather than dropping it.
    expect(screen.getByTestId("notification-card")).toHaveTextContent(
      "Test Patient",
    );
  });

  it("invokes the form's handleSubmit when the form is submitted", () => {
    const { container } = renderWithProviders(
      <InitialAssessmentPage form={makeForm()} />,
    );

    const form = container.querySelector("form");
    fireEvent.submit(form);

    // WHY: submission must be delegated to the form hook, not handled inline.
    expect(mocks.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("navigates back when the back arrow is clicked", () => {
    const { container } = renderWithProviders(
      <InitialAssessmentPage form={makeForm()} />,
    );

    // WHY: the back arrow has alt="" (presentation role), so query by its src.
    fireEvent.click(container.querySelector('img[src="/back_button2.png"]'));

    // WHY: the back affordance routes to the previous page (history.back).
    expect(mocks.navigate).toHaveBeenCalledWith(-1);
  });

  it("applies the read-only (pe-none) class when the draft is locked", () => {
    const { container } = renderWithProviders(
      <InitialAssessmentPage
        form={makeForm({ isNotEditableWithSigner: true })}
      />,
    );

    // WHY: once signed/locked the form must be non-interactive (pe-none) to
    // prevent edits to a finalized clinical record.
    expect(container.querySelector(".initial-assessment.pe-none")).toBeTruthy();
  });

  it("passes signInModel7 through to the signature modal's show prop", () => {
    renderWithProviders(
      <InitialAssessmentPage form={makeForm({ signInModel7: true })} />,
    );

    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "true",
    );
  });
});

/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanPage from "./TreatmentPlanPage";

// ─── Mocks ──────────────────────────────────────────────────────────
// AddSignature comes from the @/utils/utils barrel (many exports, pulls in
// date-fns + redux selectors). Stub the whole module via a Proxy so any other
// re-exported symbol stays harmless, while AddSignature surfaces just the
// show/setValue/setDate/setTime props the page wires up.
const utilsMocks = vi.hoisted(() => ({
  addSignatureProps: { calls: [] },
}));

vi.mock("@/utils/utils", () => {
  const AddSignature = (props) => {
    utilsMocks.addSignatureProps.calls.push(props);
    return (
      <div data-testid="add-signature" data-show={String(!!props.show)}>
        <button
          type="button"
          data-testid="sig-set-value"
          onClick={() => props.setValue("Dr. Test")}
        >
          set-value
        </button>
        <button
          type="button"
          data-testid="sig-set-date"
          onClick={() => props.setDate("2026-06-10")}
        >
          set-date
        </button>
        <button
          type="button"
          data-testid="sig-set-time"
          onClick={() => props.setTime("10:00 AM")}
        >
          set-time
        </button>
      </div>
    );
  };
  return { __esModule: true, AddSignature };
});

// The eight section components each consume useTreatmentPlanFormContext and
// pull in react-select/datepicker/etc. They are not under test here — stub
// each to a labelled marker so the page composition is observable.
vi.mock("./sections/TreatmentPlanPatientSection", () => ({
  __esModule: true,
  default: () => <div data-testid="section-patient">patient</div>,
}));
vi.mock("./sections/TreatmentPlanProvidersGoalsSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="section-providers-goals">providers-goals</div>
  ),
}));
vi.mock("./sections/TreatmentPlanRiskAssessmentSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="section-risk-assessment">risk-assessment</div>
  ),
}));
vi.mock("./sections/TreatmentPlanCounselingSection", () => ({
  __esModule: true,
  default: () => <div data-testid="section-counseling">counseling</div>,
}));
vi.mock("./sections/TreatmentPlanPsychosocialGoalsSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="section-psychosocial-goals">psychosocial-goals</div>
  ),
}));
vi.mock("./sections/TreatmentPlanObjectivesMeasuresSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="section-objectives-measures">objectives-measures</div>
  ),
}));
vi.mock("./sections/TreatmentPlanMedicationsSupportSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="section-medications-support">medications-support</div>
  ),
}));
vi.mock("./sections/TreatmentPlanSignaturesSubmitSection", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="section-signatures-submit">signatures-submit</div>
  ),
}));

// ─── Form-prop factory ──────────────────────────────────────────────
// The page reads everything off the `form` prop. A Proxy yields ()=>{} for any
// unconfigured setX/handleX/editX key and undefined for unknown values, so the
// component never crashes; we override the keys we assert on.
const makeForm = (overrides = {}) => {
  const target = {
    typedGuardDialog: <div data-testid="guard-dialog">guard</div>,
    signatureModel3: false,
    getApiData: { data: {} },
    profileInfo: { _id: "emp-test-001", userType: "Employee" },
    url: "/treatment-plan",
    componentRef: { current: null },
    initialUpdate: "",
    saveAsDrafIsNotEditable: false,
    saveAsDrafIsNotEditableWithoutSigner: false,
    isNotEditableWithSigner: false,
    navigate: vi.fn(),
    setInitialUpdate: vi.fn(),
    handlePost: vi.fn((e) => e?.preventDefault?.()),
    setsignatureBhp: vi.fn(),
    setDateBhp: vi.fn(),
    setTimeBhp: vi.fn(),
    editSignHandler: vi.fn(),
    editDateHandler: vi.fn(),
    editTimeHandler: vi.fn(),
    ...overrides,
  };
  return new Proxy(target, {
    get: (t, p) => {
      if (p in t) return t[p];
      if (typeof p === "string" && /^(set|handle|edit)/.test(p)) {
        return () => undefined;
      }
      return undefined;
    },
    has: () => true,
  });
};

describe("TreatmentPlanPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    utilsMocks.addSignatureProps.calls = [];
  });

  it("mounts and renders the page title and all eight sections", () => {
    renderWithProviders(<TreatmentPlanPage form={makeForm()} />);

    // WHY: the visible heading plus the hidden pdf title both carry the phrase,
    // so assert at least one renders rather than a unique match.
    expect(
      screen.getAllByText(/Behavioral Health Treatment Plan/).length,
    ).toBeGreaterThan(0);
    // WHY: the page composes all eight treatment-plan sections in order.
    [
      "patient",
      "providers-goals",
      "risk-assessment",
      "counseling",
      "psychosocial-goals",
      "objectives-measures",
      "medications-support",
      "signatures-submit",
    ].forEach((name) =>
      expect(screen.getByTestId(`section-${name}`)).toBeInTheDocument(),
    );
  });

  it("renders the typed-guard dialog from the form prop", () => {
    renderWithProviders(<TreatmentPlanPage form={makeForm()} />);
    expect(screen.getByTestId("guard-dialog")).toBeInTheDocument();
  });

  it("reflects the Initial/Update mode in the hidden pdf title", () => {
    renderWithProviders(
      <TreatmentPlanPage form={makeForm({ initialUpdate: "Initial" })} />,
    );
    // WHY: print title prefixes the document type for the exported PDF.
    expect(
      screen.getByText("Initial Behavioral Health Treatment Plan"),
    ).toBeInTheDocument();
  });

  it("navigates back when the back arrow is clicked", () => {
    const navigate = vi.fn();
    renderWithProviders(<TreatmentPlanPage form={makeForm({ navigate })} />);

    fireEvent.click(screen.getByAltText(""));
    // WHY: back arrow returns to the previous route via navigate(-1).
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("checks Initial and Update boxes per the current mode and toggles them", () => {
    const setInitialUpdate = vi.fn();
    renderWithProviders(
      <TreatmentPlanPage
        form={makeForm({ initialUpdate: "Initial", setInitialUpdate })}
      />,
    );

    // Labels aren't associated via htmlFor, so target the checkboxes by role.
    // Render order: [0] Initial, [1] Update.
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    fireEvent.click(checkboxes[1]);
    // WHY: clicking Update switches the document mode.
    expect(setInitialUpdate).toHaveBeenCalledWith("Update");
  });

  it("submits the form through handlePost", () => {
    const handlePost = vi.fn((e) => e?.preventDefault?.());
    const { container } = renderWithProviders(
      <TreatmentPlanPage form={makeForm({ handlePost })} />,
    );

    const formEl = container.querySelector("form");
    fireEvent.submit(formEl);
    expect(handlePost).toHaveBeenCalledTimes(1);
  });

  it("passes the signature modal visibility down to AddSignature", () => {
    renderWithProviders(
      <TreatmentPlanPage form={makeForm({ signatureModel3: true })} />,
    );
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "true",
    );
  });

  it("routes signature edits to BHP setters when the employee owns the document", () => {
    const setsignatureBhp = vi.fn();
    const setDateBhp = vi.fn();
    const editSignHandler = vi.fn();
    // employeeId on the record matches the signed-in employee -> BHP path.
    renderWithProviders(
      <TreatmentPlanPage
        form={makeForm({
          getApiData: { data: { employeeId: "emp-test-001" } },
          profileInfo: { _id: "emp-test-001", userType: "Employee" },
          setsignatureBhp,
          setDateBhp,
          editSignHandler,
        })}
      />,
    );

    fireEvent.click(screen.getByTestId("sig-set-value"));
    fireEvent.click(screen.getByTestId("sig-set-date"));
    // WHY: owner edits their own BHP signature, not the editSign* fallback.
    expect(setsignatureBhp).toHaveBeenCalledWith("Dr. Test");
    expect(setDateBhp).toHaveBeenCalledWith("2026-06-10");
    expect(editSignHandler).not.toHaveBeenCalled();
  });

  it("routes signature edits to the edit handlers when a different signer is involved", () => {
    const setsignatureBhp = vi.fn();
    const editSignHandler = vi.fn();
    const editTimeHandler = vi.fn();
    // record has a different employeeId -> the non-owner editSign* path.
    renderWithProviders(
      <TreatmentPlanPage
        form={makeForm({
          getApiData: { data: { employeeId: "other-emp" } },
          profileInfo: { _id: "emp-test-001", userType: "Employee" },
          setsignatureBhp,
          editSignHandler,
          editTimeHandler,
        })}
      />,
    );

    fireEvent.click(screen.getByTestId("sig-set-value"));
    fireEvent.click(screen.getByTestId("sig-set-time"));
    // WHY: non-owner falls through to edit handlers, leaving BHP setters untouched.
    expect(editSignHandler).toHaveBeenCalledWith("Dr. Test");
    expect(editTimeHandler).toHaveBeenCalledWith("10:00 AM");
    expect(setsignatureBhp).not.toHaveBeenCalled();
  });
});

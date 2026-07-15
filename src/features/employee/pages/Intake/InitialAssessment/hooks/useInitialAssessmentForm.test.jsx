/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { setupStore } from "@/test-utils";

import { useInitialAssessmentForm } from "./useInitialAssessmentForm";

// ─── Mocks ──────────────────────────────────────────────────────────
// Hoisted service spies so we can assert no real HTTP fires and so the
// gated effects (create/update/getInitialAssessment/getProfile) are inert.
const mocks = vi.hoisted(() => ({
  getInitialAssessment: vi.fn(),
  getProfile: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/features/shared/services/index", () => ({
  intakeService: {
    getInitialAssessment: mocks.getInitialAssessment,
    initialAssessment: {
      create: mocks.create,
      update: mocks.update,
    },
  },
  employeeService: {
    getProfile: mocks.getProfile,
  },
}));

// Print uses react-to-print under the hood — stub the wrapper hook so the
// real form hook never reaches the print library (no DOM/clone work in jsdom).
vi.mock("./usePrintAssessment", () => ({
  usePrintAssessment: () => ({
    handlePrint: vi.fn(),
    handlePrintClick: vi.fn(),
  }),
}));

vi.mock("react-to-print", () => ({ useReactToPrint: () => vi.fn() }));

// payloadMapper is exercised on submit; stub it so handleSubmit is
// deterministic and we can assert it forwards a payload to the service.
vi.mock("../utils/payloadMapper", () => ({
  buildAssessmentPayload: (args) => ({ __payload: true, raw: args }),
}));

// ─── Wrapper ────────────────────────────────────────────────────────
const EMPLOYEE_PROFILE = {
  _id: "emp-test-001",
  firstName: "Test",
  lastName: "Employee",
  userType: "Employee",
  accountType: "regular",
  hoursFormat: "12",
  companyName: "Test Company",
  userPermissions: { edit: "iass", delete: "iass" },
  patientsAssigned: [],
};

const makeWrapper = (
  profile = EMPLOYEE_PROFILE,
  { route = "/initial-assessment" } = {},
) => {
  const store = setupStore({
    auth: {
      isAuthenticated: true,
      userProfile: profile,
      unreadMessages: 0,
      unreadNotifications: 0,
    },
  });
  return ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </Provider>
  );
};

const renderForm = (opts) =>
  renderHook(() => useInitialAssessmentForm(), {
    wrapper: makeWrapper(opts?.profile, opts),
  });

describe("useInitialAssessmentForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("mounts and exposes the assessment form API surface", () => {
    const { result } = renderForm();
    // WHY: this hook is the single source of truth for the entire IA form —
    // smoke-confirm core handlers/state are wired before deeper assertions.
    expect(typeof result.current.handleSubmit).toBe("function");
    expect(typeof result.current.handleCheckboxAdmisionStatus).toBe("function");
    expect(Array.isArray(result.current.admissionStatus)).toBe(true);
    expect(result.current.profileInfo._id).toBe("emp-test-001");
  });

  it("derives hoursFormat from the user profile (12h vs 24h)", () => {
    const { result } = renderForm();
    // WHY: clinicians sign with a timestamp; 12h profile -> h:mm A token.
    expect(result.current.hoursFormat).toBe("h:mm A");

    const { result: r24 } = renderForm({
      profile: { ...EMPLOYEE_PROFILE, hoursFormat: "24" },
    });
    expect(r24.current.hoursFormat).toBe("HH:mm");
  });

  it("seeds the user display name from the fetched employee profile", async () => {
    // The id-gated effect calls employeeService.getProfile with a setResponse
    // callback; simulate it resolving with the employee record.
    mocks.getProfile.mockImplementation(({ setResponse }) =>
      setResponse({
        data: { _id: "emp-test-001", firstName: "Test", lastName: "Employee" },
      }),
    );
    const { result } = renderForm({ route: "/initial-assessment/iass-test-1" });

    // WHY: the form stamps "First Last" onto staff/preparer signature lines.
    await waitFor(() => expect(result.current.user).toBe("Test Employee"));
    expect(result.current.patientId).toBe("emp-test-001");
    expect(mocks.getProfile).toHaveBeenCalledTimes(1);
  });

  it("toggles admission status checkboxes additively and removably", () => {
    const { result } = renderForm();
    act(() => result.current.handleCheckboxAdmisionStatus("BHRF"));
    expect(result.current.admissionStatus).toContain("BHRF");

    act(() => result.current.handleCheckboxAdmisionStatus("Crisis"));
    expect(result.current.admissionStatus).toEqual(["BHRF", "Crisis"]);

    // WHY: re-clicking an already-selected status must unselect it (checkbox semantics).
    act(() => result.current.handleCheckboxAdmisionStatus("BHRF"));
    expect(result.current.admissionStatus).toEqual(["Crisis"]);
  });

  it("toggles bhrfCriteria and treatmentRecommendations like multi-selects", () => {
    const { result } = renderForm();
    act(() => result.current.bhrfCriteriaHandler("criteria-a"));
    expect(result.current.bhrfCriteria).toEqual(["criteria-a"]);
    act(() => result.current.bhrfCriteriaHandler("criteria-a"));
    expect(result.current.bhrfCriteria).toEqual([]);

    act(() => result.current.treatmentRecommendationsHandler("rec-1"));
    expect(result.current.treatmentRecommendations).toEqual(["rec-1"]);
    act(() => result.current.treatmentRecommendationsHandler("rec-1"));
    expect(result.current.treatmentRecommendations).toEqual([]);
  });

  it("accumulates behavioral interventions and clears the draft inputs", () => {
    const { result } = renderForm();
    act(() => {
      result.current.setNeed("Test need");
      result.current.setIntervention("Test intervention");
    });
    act(() => result.current.behavioralInterventionaArrayHandle());

    expect(result.current.behavioralInterventionsArray).toEqual([
      { need: "Test need", intervention: "Test intervention" },
    ]);
    // WHY: draft fields reset after commit so the next row starts empty.
    expect(result.current.need).toBe("");
    expect(result.current.intervention).toBe("");
  });

  it("appends and removes mental-health treatment-history rows", () => {
    const { result } = renderForm();
    act(() => {
      result.current.setMentalHealthTreatmentHistoryDiagnosisReason([
        { label: "Anxiety", value: "Anxiety" },
      ]);
      result.current.setMentalHealthTreatmentHistoryDates("2020");
      result.current.setMentalHealthTreatmentHistoryWhere("Clinic");
      result.current.setMentalHealthTreatmentHistoryTypeOfService([
        { label: "Outpatient", value: "Outpatient" },
      ]);
    });
    act(() => result.current.handleTypeOfService());

    expect(result.current.typeOfServiceArray).toHaveLength(1);
    expect(result.current.typeOfServiceArray[0].where).toBe("Clinic");
    // WHY: committing a row clears the staging inputs for the next entry.
    expect(result.current.mentalHealthTreatmentHistoryWhere).toBe("");

    act(() => result.current.handleRemoveItem(0));
    expect(result.current.typeOfServiceArray).toHaveLength(0);
  });

  it("adds and removes 'other' psychiatric diagnosis rows", () => {
    const { result } = renderForm();
    act(() => {
      result.current.setOtherPsychiatricOption("Other Dx");
      result.current.setOtherIcdCode("F99");
    });
    act(() => result.current.handlePsychiatricDiagnoses());

    expect(result.current.psychiatricDiagnosesArray).toEqual([
      { name: "Other Dx", icdCode: "F99", description: "" },
    ]);
    // WHY: staging inputs reset after the slot is appended.
    expect(result.current.otherPsychiatricOption).toBe("");

    act(() => result.current.removePsychiatricDiagnosesArray(0));
    expect(result.current.psychiatricDiagnosesArray).toEqual([]);
  });

  it("toggles multi-select suicidal ideation string", () => {
    const { result } = renderForm();
    act(() => result.current.handleMultiSuicidalIdeation("Passive"));
    expect(result.current.suicidalIdeation).toContain("Passive");
    // WHY: selecting the same option again strips it back out of the string.
    act(() => result.current.handleMultiSuicidalIdeation("Passive"));
    expect(result.current.suicidalIdeation || "").not.toContain("Passive");
  });

  it("submits the create payload to intakeService on the create route", () => {
    const { result } = renderForm({ route: "/initial-assessment" });
    act(() => result.current.setPatient_Id("res-test-001"));

    const preventDefault = vi.fn();
    act(() => result.current.handleSubmit({ preventDefault }));

    expect(preventDefault).toHaveBeenCalled();
    // WHY: /initial-assessment is the CREATE path — must call create, not update.
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.update).not.toHaveBeenCalled();
    const arg = mocks.create.mock.calls[0][0];
    expect(arg.patientId).toBe("res-test-001");
    expect(arg.payload.__payload).toBe(true);
  });

  it("computes canDelete from the employee's iass delete permission", () => {
    const { result } = renderForm();
    // WHY: only staff with the 'iass' delete grant may remove an assessment.
    expect(result.current.canDelete).toBe(true);

    const { result: noPerm } = renderForm({
      profile: {
        ...EMPLOYEE_PROFILE,
        userPermissions: { edit: "iass", delete: "" },
      },
    });
    expect(noPerm.current.canDelete).toBe(false);
  });

  it("clears all typed signature fields via clearAllTyped", () => {
    const { result } = renderForm();
    act(() => {
      result.current.setBhpSignature("Dr. Test");
      result.current.setAdminSignature("Admin Test");
    });
    expect(result.current.hasTypedInForm).toBe(true);

    act(() => result.current.clearAllTyped());
    // WHY: clearing typed signatures must wipe both BHP and admin entries
    // so a partially-signed document cannot be submitted as complete.
    expect(result.current.bhpSignature).toBe("");
    expect(result.current.adminSignature).toBe("");
    expect(result.current.hasTypedInForm).toBe(false);
  });
});

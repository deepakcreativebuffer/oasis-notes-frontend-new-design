/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { setupStore } from "@/test-utils";

import { useNursingAssessmentFormLogic } from "./useNursingAssessmentFormLogic";

// ── Hoisted mock fns referenced by vi.mock factories ───────────────────
const mocks = vi.hoisted(() => ({
  getNursingAssessment: vi.fn(),
  getResidentEmployees: vi.fn(),
  nursingAssessmentCreate: vi.fn(),
  nursingAssessmentUpdate: vi.fn(),
  patientGetById: vi.fn(),
  navigate: vi.fn(),
}));

// Services — never hit real HTTP.
vi.mock("@/features/shared/services/index", () => ({
  intakeService: {
    getNursingAssessment: mocks.getNursingAssessment,
    getResidentEmployees: mocks.getResidentEmployees,
    nursingAssessment: {
      create: mocks.nursingAssessmentCreate,
      update: mocks.nursingAssessmentUpdate,
    },
  },
  patientService: {
    getById: mocks.patientGetById,
  },
}));

// Assets barrel — many image exports consumed across constants. Return a Proxy
// as the module namespace so ANY named import resolves to a stub string.
vi.mock(
  "@/assets/index",
  () =>
    new Proxy(
      { __esModule: true },
      { get: (t, p) => (p in t ? t[p] : "img-stub"), has: () => true },
    ),
);

// Utils consumed at mount / on handlers.
vi.mock("@/utils/utils", () => ({
  AddSignature: vi.fn(),
  formatDateToMMDDYYYY: vi.fn(() => "06/10/2026"),
  signatureFormat: vi.fn(),
}));
vi.mock("@/utils/Makers", () => ({ CheckBoxMaker: vi.fn() }));
vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "doc-title"),
}));
vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: vi.fn(() => vi.fn()),
}));
vi.mock("@/utils/index", () => ({ downloadReport: vi.fn() }));

// react-router-dom: keep real hooks but stub navigate.
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mocks.navigate };
});

const ADMIN_PROFILE = {
  _id: "emp-test-001",
  userType: "Admin",
  fullName: "Test Admin",
  hoursFormat: "12",
  accountType: "regular",
  patientsAssigned: [],
};

const EMPLOYEE_PROFILE = {
  _id: "emp-test-001",
  userType: "Employee",
  fullName: "Test Employee",
  hoursFormat: "24",
  accountType: "regular",
  userPermissions: { edit: "nass" },
  patientsAssigned: [],
};

const makeWrapper = (userProfile = ADMIN_PROFILE, route = "/edit/abc") =>
  function Wrapper({ children }) {
    const store = setupStore({
      auth: {
        isAuthenticated: true,
        userProfile,
        unreadMessages: 0,
        unreadNotifications: 0,
      },
    });
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  };

const renderLogic = (profile, route) =>
  renderHook(() => useNursingAssessmentFormLogic(), {
    wrapper: makeWrapper(profile, route),
  });

describe("useNursingAssessmentFormLogic", () => {
  beforeEach(() => vi.clearAllMocks());

  it("initialises with empty collections and exposes the expected api surface", () => {
    const { result } = renderLogic();
    // WHY: array-valued symptom buckets must start empty so the form renders no
    // pre-checked boxes for a fresh nursing assessment.
    expect(result.current.codeStatus).toEqual([]);
    expect(result.current.careProvidedPhysicalServices).toEqual([]);
    expect(result.current.signers).toEqual([]);
    expect(result.current.tbScreeningResults).toEqual([]);
    expect(typeof result.current.handlePost).toBe("function");
    expect(typeof result.current.editSignHandler).toBe("function");
    expect(result.current.todayDate).toBe("06/10/2026");
  });

  it("derives hoursFormat from the signed-in profile", () => {
    const { result: admin } = renderLogic(ADMIN_PROFILE);
    // WHY: 12-hour clinicians get the AM/PM token.
    expect(admin.current.hoursFormat).toBe("h:mm A");

    const { result: emp } = renderLogic(EMPLOYEE_PROFILE);
    // WHY: a profile flagged "24" must use 24h formatting for charting times.
    expect(emp.current.hoursFormat).toBe("HH:mm");
  });

  it("fetches resident employees on mount", () => {
    renderLogic();
    expect(mocks.getResidentEmployees).toHaveBeenCalledTimes(1);
    expect(mocks.getResidentEmployees).toHaveBeenCalledWith(
      expect.objectContaining({ setResponse: expect.any(Function) }),
    );
  });

  it("fetches the assessment by patientId on the create route once patientId is set", async () => {
    const { result } = renderLogic(ADMIN_PROFILE, "/nursing-assessment");
    act(() => result.current.setPatientId("res-test-001"));
    // WHY: on the new-assessment route the hook pulls any existing draft for
    // the selected resident so it can prefill instead of duplicating.
    await waitFor(() =>
      expect(mocks.getNursingAssessment).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: "res-test-001",
          setResponse: expect.any(Function),
        }),
      ),
    );
  });

  it("toggles code status entries on and off", () => {
    const { result } = renderLogic();
    act(() => result.current.handleCodeStatusChange("DNR"));
    expect(result.current.codeStatus).toContain("DNR");
    act(() => result.current.handleCodeStatusChange("DNR"));
    // WHY: re-selecting the same status must remove it (checkbox toggle).
    expect(result.current.codeStatus).not.toContain("DNR");
  });

  it("toggles care-provided physical services", () => {
    const { result } = renderLogic();
    act(() => result.current.careProvidedPhysicalServicesHandler("Bathing"));
    expect(result.current.careProvidedPhysicalServices).toEqual(["Bathing"]);
    act(() => result.current.careProvidedPhysicalServicesHandler("Bathing"));
    expect(result.current.careProvidedPhysicalServices).toEqual([]);
  });

  it("toggles a review-of-systems symptom bucket", () => {
    const { result } = renderLogic();
    act(() => result.current.handlereviewOfSystemsConstitutional("Fatigue"));
    expect(result.current.reviewOfSystemsConstitutional).toEqual(["Fatigue"]);
    act(() => result.current.handlereviewOfSystemsConstitutional("Fatigue"));
    expect(result.current.reviewOfSystemsConstitutional).toEqual([]);
  });

  it("toggles multi TB screening results", () => {
    const { result } = renderLogic();
    act(() => result.current.handleMultiTbScreeningResults("Negative"));
    expect(result.current.tbScreeningResults).toEqual(["Negative"]);
    act(() => result.current.handleMultiTbScreeningResults("Negative"));
    expect(result.current.tbScreeningResults).toEqual([]);
  });

  it("appends and removes nutrition diet selections by substring", () => {
    const { result } = renderLogic();
    // WHY: nutritionDiet starts at "As tolerated"; selecting "Pureed" appends it.
    act(() => result.current.handleMultiNutritionDiet("Pureed"));
    expect(result.current.nutritionDiet).toContain("Pureed");
    act(() => result.current.handleMultiNutritionDiet("Pureed"));
    expect(result.current.nutritionDiet).not.toContain("Pureed");
  });

  it("lets an Admin sign by setting the admin signature directly", () => {
    const { result } = renderLogic(ADMIN_PROFILE);
    act(() => result.current.editSignHandler("data:admin-sig"));
    // WHY: admins are not in the signers array; their mark lands on adminSignature.
    expect(result.current.adminSignature).toBe("data:admin-sig");
  });

  it("adds an employee signer entry when the user is not yet a signer", () => {
    const { result } = renderLogic(EMPLOYEE_PROFILE);
    act(() => result.current.editSignHandler("data:emp-sig"));
    // WHY: a regular employee signing for the first time gets appended to signers.
    expect(result.current.signers).toEqual([
      expect.objectContaining({
        signerId: "emp-test-001",
        signature: "data:emp-sig",
      }),
    ]);
  });

  it("records the admin signature date and time via the edit handlers", () => {
    const { result } = renderLogic(ADMIN_PROFILE);
    act(() => result.current.editDateHandler("06/10/2026"));
    act(() => result.current.editTimeHandler("10:00 AM"));
    expect(result.current.adminSignatureDate).toBe("06/10/2026");
    expect(result.current.adminSignatureTime).toBe("10:00 AM");
  });

  it("builds the create payload on submit for the /nursing-assessment route", () => {
    const { result } = renderLogic(ADMIN_PROFILE, "/nursing-assessment");
    const preventDefault = vi.fn();
    act(() => result.current.handlePost({ preventDefault }));
    expect(preventDefault).toHaveBeenCalled();
    // WHY: the create-new path posts to nursingAssessment.create, not update.
    expect(mocks.nursingAssessmentCreate).toHaveBeenCalledTimes(1);
    expect(mocks.nursingAssessmentUpdate).not.toHaveBeenCalled();
  });

  it("calls update on submit when editing an existing assessment", () => {
    const { result } = renderLogic(ADMIN_PROFILE, "/edit/nass-test-001");
    act(() => result.current.handlePost({ preventDefault: vi.fn() }));
    // WHY: the edit route (non /nursing-assessment) goes through the update API.
    expect(mocks.nursingAssessmentUpdate).toHaveBeenCalledTimes(1);
    expect(mocks.nursingAssessmentCreate).not.toHaveBeenCalled();
  });

  it("hydrates form fields from an injected getApiData response", async () => {
    const { result } = renderLogic(ADMIN_PROFILE, "/edit/nass-test-001");
    act(() =>
      result.current.setGetApiData({
        data: {
          patientId: "res-test-001",
          todayDate: "01/01/2026",
          codeStatus: ["Full Code"],
          tbScreeningResults: "Negative,Positive",
          careProvided: ["Feeding"],
          allergies: "None",
          behavioralSymptoms: ["Anxious"],
        },
      }),
    );
    // WHY: loading a saved assessment must repopulate the checkbox buckets.
    await waitFor(() =>
      expect(result.current.codeStatus).toEqual(["Full Code"]),
    );
    expect(result.current.tbScreeningResults).toEqual(["Negative", "Positive"]);
    expect(result.current.careProvidedPhysicalServices).toEqual(["Feeding"]);
    expect(result.current.allergies).toBe("None");
    expect(result.current.patientId).toBe("res-test-001");
  });
});

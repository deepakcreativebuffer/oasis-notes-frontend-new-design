/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { setupStore } from "@/test-utils";

import { useTreatmentPlanForm } from "./useTreatmentPlanForm";

// ---- IO / heavy module mocks (hoisted above imports) ----
const mocks = vi.hoisted(() => ({
  deletePermission: vi.fn(() => false),
  updateSignature: vi.fn(),
  loadSignaturesFromApi: vi.fn(),
  guardTyped: vi.fn((fn) => fn && fn()),
}));

// Services must never hit the network.
vi.mock("@/features/shared/services/index", () => ({
  patientService: { getById: vi.fn() },
  treatmentPlanService: {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
    getPatientTreatmentPlan: vi.fn(),
    getMeasureables: vi.fn(),
  },
}));

// react-to-print wrapper -> return a no-op print handler.
vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));

// downloadReport lives in @/utils/index — stub it (the hook also imports the
// real selector from @/store/authSlice separately, so don't touch that here).
vi.mock("@/utils/index", () => ({ downloadReport: vi.fn() }));

// Keep the real utils for formatDateToMMDDYYYY / stripHtmlList, but make
// deletePermission controllable so canDelete can be asserted.
vi.mock("@/utils/utils", async () => {
  const actual = await vi.importActual("@/utils/utils");
  return { ...actual, deletePermission: mocks.deletePermission };
});

// Custom signature hooks do heavy work / draw to canvas — stub them.
vi.mock("@/features/shared/ui/SignaturePadModal/useSignatures", () => ({
  default: () => ({
    signatures: {},
    updateSignature: mocks.updateSignature,
    loadFromApi: mocks.loadSignaturesFromApi,
  }),
}));
vi.mock("@/features/shared/ui/SignaturePadModal/useTypedGuard", () => ({
  default: () => ({ guardTyped: mocks.guardTyped, dialog: null }),
}));

const ADMIN_PROFILE = {
  _id: "emp-test-001",
  userType: "Admin",
  hoursFormat: "24",
};

function makeWrapper(profile = ADMIN_PROFILE, route = "/treatment-plan") {
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
}

function renderForm(profile, route) {
  return renderHook(() => useTreatmentPlanForm(), {
    wrapper: makeWrapper(profile, route),
  });
}

describe("useTreatmentPlanForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deletePermission.mockReturnValue(false);
  });

  it("mounts and exposes the form API with sane initial state", () => {
    const { result } = renderForm();
    // WHY: the intake Treatment Plan screen is driven entirely by this hook —
    // it must initialise without touching the network.
    expect(typeof result.current.handlePost).toBe("function");
    expect(result.current.otherArray).toEqual([]);
    expect(result.current.services.length).toBeGreaterThan(0);
    expect(result.current.dynamicServices).toEqual([]);
    expect(result.current.signatures).toEqual({});
  });

  it("derives hoursFormat from the signed-in profile", () => {
    // WHY: a 24-hour facility profile must render times in 24h, not AM/PM.
    const { result } = renderForm({ ...ADMIN_PROFILE, hoursFormat: "24" });
    expect(result.current.hoursFormat).toBe("HH:mm");

    const { result: r12 } = renderForm({
      ...ADMIN_PROFILE,
      hoursFormat: "12",
    });
    expect(r12.current.hoursFormat).toBe("h:mm A");
  });

  it("appends and removes 'Other' goal cards via otherArray helpers", () => {
    const { result } = renderForm();

    act(() => result.current.handleAddButtonClick());
    expect(result.current.otherArray).toHaveLength(1);
    // WHY: each added card is an editable 'Other' goal row defaulting to blank.
    expect(result.current.otherArray[0].goalTitle).toBe("Other");
    expect(result.current.otherArray[0].isMeasureMet).toBeNull();

    act(() => result.current.handleChange(0, "comments", "note-1"));
    expect(result.current.otherArray[0].comments).toBe("note-1");

    // null/undefined values coerce to "" for non-isMeasureMet keys.
    act(() => result.current.handleChange(0, "comments", undefined));
    expect(result.current.otherArray[0].comments).toBe("");

    act(() => result.current.handleDelete(0));
    expect(result.current.otherArray).toHaveLength(0);
  });

  it("adds and removes dynamic services", () => {
    const { result } = renderForm();
    const fixedCount = result.current.services.length;

    act(() => result.current.addNewService());
    expect(result.current.dynamicServices).toHaveLength(1);
    expect(result.current.dynamicServices[0].serviceProvided).toBe("");

    act(() => result.current.removeDynamicService(0));
    expect(result.current.dynamicServices).toHaveLength(0);

    // WHY: dynamic-service edits must never mutate the fixed service rows.
    expect(result.current.services.length).toBe(fixedCount);
  });

  it("updates a fixed service field immutably", () => {
    const { result } = renderForm();

    act(() =>
      result.current.updateFixedService(0, "additionalNotes", "Test note"),
    );
    expect(result.current.services[0].additionalNotes).toBe("Test note");
  });

  it("validates measure ratings via checkFormat", () => {
    const { result } = renderForm();
    const { checkFormat } = result.current;

    expect(checkFormat("")).toEqual({ isValid: true, error: "" });
    expect(checkFormat("1/10")).toEqual({ isValid: true, error: "" });
    // WHY: a rating like 8/3 is impossible (rating > total) and must be flagged.
    expect(checkFormat("8/3").isValid).toBe(false);
    expect(checkFormat("1/0").error).toBe("Total cannot be 0");
    expect(checkFormat("abc").isValid).toBe(false);
  });

  it("handleRatingChange sets the value and an error message for bad input", () => {
    const { result } = renderForm();
    const setValue = vi.fn();
    const setError = vi.fn();

    act(() =>
      result.current.handleRatingChange(
        { target: { value: "1/10" } },
        setValue,
        setError,
      ),
    );
    expect(setValue).toHaveBeenCalledWith("1/10");
    expect(setError).toHaveBeenCalledWith("");

    act(() =>
      result.current.handleRatingChange(
        { target: { value: "9/2" } },
        setValue,
        setError,
      ),
    );
    // WHY: invalid rating surfaces an inline error so it can't be submitted.
    expect(setError).toHaveBeenLastCalledWith(
      "Rating cannot be greater than total",
    );
  });

  it("exposes canDelete from the delete-permission policy", () => {
    mocks.deletePermission.mockReturnValue(true);
    const { result } = renderForm();
    // WHY: delete affordances on a saved Treatment Plan are permission-gated.
    expect(result.current.canDelete).toBe(true);
    expect(mocks.deletePermission).toHaveBeenCalledWith(
      expect.objectContaining({ userType: "Admin" }),
      "tp",
    );
  });

  it("computes witness-completeness flags from signature state", () => {
    const { result } = renderForm();
    // WHY: with no signatures captured, the coupled witness pair is neither
    // present nor incomplete — submit must not be blocked on it.
    expect(result.current.witnessSigPresent).toBe(false);
    expect(result.current.witnessNamePresent).toBe(false);
    expect(result.current.witnessIncomplete).toBe(false);
    expect(result.current.hasAnyPenSig).toBe(false);
    expect(result.current.allPenSigsHaveNames).toBe(true);
  });

  it("clearAllTyped wipes typed signature fields", () => {
    const { result } = renderForm();

    act(() => result.current.setsignatureBhp("Dr. Test"));
    expect(result.current.signatureBhp).toBe("Dr. Test");

    act(() => result.current.clearAllTyped());
    expect(result.current.signatureBhp).toBe("");
    expect(result.current.adminSignature).toBe("");
  });
});

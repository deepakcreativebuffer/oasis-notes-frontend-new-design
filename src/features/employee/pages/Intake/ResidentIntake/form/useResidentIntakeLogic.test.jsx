/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { setupStore } from "@/test-utils";

import { useResidentIntakeLogic } from "./useResidentIntakeLogic";

// ── Mock the IO/heavy modules the hook imports ──────────────────────────────
// WHY: the intake service performs real HTTP; we drive the hook through it.
const mocks = vi.hoisted(() => ({
  getResidentIntake: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}));

vi.mock("@/features/shared/services/index", () => ({
  intakeService: {
    getResidentIntake: mocks.getResidentIntake,
    residentIntake: { create: mocks.create, update: mocks.update },
  },
}));

// WHY: utils.jsx pulls the heavy services barrel; stub only what the hook uses.
vi.mock("@/utils/utils", () => ({
  AddSignatureForTable: vi.fn(),
  deletePermission: vi.fn(() => true),
  fetchPaitentName: vi.fn(),
  formatDateToMMDDYYYY: vi.fn((d) => d),
  // Default: no signer present on all pages (drives isDisabled = true).
  isSignerPresentOnAllPages: vi.fn(() => false),
  signatureFormat: vi.fn(),
}));

vi.mock("@/utils/index", () => ({
  logger: { warn: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

// WHY: print hook uses react-to-print; return controllable refs/handlers.
vi.mock(
  "@/features/resident/pages/Intake/ResidentIntake/ResidentIntakes/useResidentIntakesPrint",
  () => ({
    useResidentIntakesPrint: vi.fn(() => ({ handlePrint1: vi.fn() })),
  }),
);

const AUTH_EMPLOYEE = {
  isAuthenticated: true,
  userProfile: {
    _id: "emp-test-001",
    userType: "Employee",
    accountType: "regular",
    companyName: "Test Company",
    hoursFormat: "12",
    userPermissions: { edit: "ri:other", delete: "ri" },
  },
  unreadMessages: 0,
  unreadNotifications: 0,
};

const makeWrapper = (
  auth = AUTH_EMPLOYEE,
  route = "/resident-intake/res-test-001",
) => {
  const store = setupStore({ auth });
  return ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/resident-intake" element={children} />
          <Route path="/resident-intake/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

const renderLogic = (auth, route) =>
  renderHook(() => useResidentIntakeLogic(), {
    wrapper: makeWrapper(auth, route),
  });

describe("useResidentIntakeLogic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deletePermission?.mockReturnValue?.(true);
  });

  it("should expose the form data scaffold and 11 signature pages on mount", () => {
    const { result } = renderLogic();
    // WHY: the intake form spans 11 paginated sections; each must start empty.
    expect(result.current.signatures).toHaveLength(11);
    expect(result.current.page).toBe(1);
    expect(result.current.patientId).toBe("");
    expect(typeof result.current.submitHandler).toBe("function");
  });

  it("should derive hoursFormat from the user profile (12h -> h:mm A)", () => {
    const { result } = renderLogic();
    expect(result.current.hoursFormat).toBe("h:mm A");
  });

  it("should use 24h format when the profile requests it", () => {
    const auth = {
      ...AUTH_EMPLOYEE,
      userProfile: { ...AUTH_EMPLOYEE.userProfile, hoursFormat: "24" },
    };
    const { result } = renderLogic(auth);
    expect(result.current.hoursFormat).toBe("HH:mm");
  });

  it("should advance and rewind the wizard page within bounds", () => {
    const { result } = renderLogic();
    act(() => result.current.handleNextPage());
    expect(result.current.page).toBe(2);
    act(() => result.current.handlePrevPage());
    expect(result.current.page).toBe(1);
    // WHY: page 1 is the floor — prev must not underflow below 1.
    act(() => result.current.handlePrevPage());
    expect(result.current.page).toBe(1);
  });

  it("should fetch the intake by id when an :id route param is present", async () => {
    renderLogic(AUTH_EMPLOYEE, "/resident-intake/res-test-001");
    // WHY: viewing an existing intake triggers a load keyed by record id.
    await waitFor(() =>
      expect(mocks.getResidentIntake).toHaveBeenCalledWith(
        expect.objectContaining({ id: "res-test-001" }),
      ),
    );
  });

  it("should append and delete internal disclosure rows", () => {
    const { result } = renderLogic();
    act(() => result.current.formSetters.setInternalName("Test Patient"));
    act(() => result.current.formSetters.setInternalRelationship("Guardian"));
    act(() => result.current.formSetters.setInternalContect("555-0100"));
    act(() => result.current.handleinternalData());
    expect(result.current.internalDisclosureList).toHaveLength(1);
    expect(result.current.internalDisclosureList[0]).toMatchObject({
      personName: "Test Patient",
      relationship: "Guardian",
      contactNumber: "555-0100",
    });
    act(() => result.current.handleDeleteArrayInternalDisclosure(0));
    expect(result.current.internalDisclosureList).toHaveLength(0);
  });

  it("should not add an internal disclosure row when all fields are empty", () => {
    const { result } = renderLogic();
    act(() => result.current.handleinternalData());
    expect(result.current.internalDisclosureList).toHaveLength(0);
  });

  it("should record the current employee's signature on a given page", () => {
    const { result } = renderLogic();
    act(() => result.current.editSignHandler("typed-sig", 1));
    const page1 = result.current.signatures.find((p) => p.page === 1);
    // WHY: the signing employee's id must be stamped onto the page entry.
    expect(page1.sign[0]).toMatchObject({
      signerId: "emp-test-001",
      signature: "typed-sig",
    });
  });

  it("should fan a single signature out to every page via editSignHandlerAllPages", () => {
    const { result } = renderLogic();
    act(() => result.current.editSignHandlerAllPages("all-sig"));
    // WHY: the page-11 SAVE button must stamp the signer on all 11 pages so the
    // isSignerPresentOnAllPages submit gate passes.
    const everyPageSigned = result.current.signatures.every((p) =>
      p.sign.some(
        (s) => s.signerId === "emp-test-001" && s.signature === "all-sig",
      ),
    );
    expect(everyPageSigned).toBe(true);
  });

  it("should keep the submit disabled until a signer is present on all pages", () => {
    const { result } = renderLogic();
    // WHY: default mock has no per-page signer and no pen signature → blocked.
    expect(result.current.isDisabled).toBe(true);
  });

  it("should toggle a signature modal via its setter", () => {
    const { result } = renderLogic();
    act(() => result.current.setSigInModel1(true));
    expect(result.current.signatureModals.signInModel1).toBe(true);
    act(() => result.current.setSigInModel1((prev) => !prev));
    expect(result.current.signatureModals.signInModel1).toBe(false);
  });

  it("should add a custom orientation option on Enter key", () => {
    const { result } = renderLogic();
    act(() =>
      result.current.handleKeyDownORIENTATIONDropDown({
        key: "Enter",
        target: { value: "Custom orientation item" },
      }),
    );
    expect(
      result.current.ORIENTATIONDropDown.some(
        (o) => o.value === "Custom orientation item",
      ),
    ).toBe(true);
  });

  it("should create the intake on submit from the /resident-intake route", () => {
    const { result } = renderLogic(AUTH_EMPLOYEE, "/resident-intake");
    const preventDefault = vi.fn();
    act(() => result.current.submitHandler({ preventDefault }));
    expect(preventDefault).toHaveBeenCalled();
    // WHY: the bare create route persists a new intake via the create endpoint.
    expect(mocks.create).toHaveBeenCalledTimes(1);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("should update the intake on submit from an :id route", () => {
    const { result } = renderLogic(
      AUTH_EMPLOYEE,
      "/resident-intake/res-test-001",
    );
    act(() => result.current.submitHandler({ preventDefault: vi.fn() }));
    // WHY: editing an existing record routes to update(id, ...).
    expect(mocks.update).toHaveBeenCalledTimes(1);
    expect(mocks.update.mock.calls[0][0]).toBe("res-test-001");
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("should mark restricted employees as not editable once data loads", async () => {
    const auth = {
      ...AUTH_EMPLOYEE,
      userProfile: {
        ...AUTH_EMPLOYEE.userProfile,
        accountType: "restricted",
        userPermissions: { edit: "", delete: "" },
      },
    };
    const { result } = renderLogic(auth, "/resident-intake/res-test-001");
    act(() =>
      result.current.formSetters.setGetApiData({
        data: { patientId: { _id: "res-test-001" } },
      }),
    );
    await waitFor(() =>
      expect(result.current.isNotEditableWithSigner).toBe(true),
    );
  });
});

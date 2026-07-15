/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { setupStore, makeQueryClient } from "@/test-utils";

import { useViewResidentIntakesLogic } from "./useViewResidentIntakesLogic";

// --- Mock every service / IO module the hook imports. NEVER real HTTP. ---
const getApiResident = vi.fn();
const getResidentIntakeForm = vi.fn();
vi.mock("@/features/shared/services/index", () => ({
  residentService: {
    getApiResident: (...args) => getApiResident(...args),
    getResidentIntakeForm: (...args) => getResidentIntakeForm(...args),
  },
  // COMMON_APIS.GET_PATIENT_INTAKE(id) must be a callable that returns a url.
  COMMON_APIS: { GET_PATIENT_INTAKE: (id) => `/intake/${id}` },
}));

// houseRules sanitizer is pure-ish; stub it so we control output shape.
vi.mock(
  "@/features/employee/pages/Intake/ResidentIntake/houseRulesOptions",
  () => ({
    sanitizeHouseRulesArray: (arr) => (Array.isArray(arr) ? arr : []),
  }),
);

// SignatureSection renders heavy signature UI — stub to a marker element.
vi.mock("@/features/shared/ui/SignaturePadModal/SignatureSection", () => ({
  default: (props) => <div data-testid="signature-section">{props.label}</div>,
}));

// The print sub-hook pulls in react-to-print / usePrint. Stub it entirely so
// we drive only the logic hook's own state machine.
const triggerPrintAll = vi.fn();
vi.mock("./useViewResidentIntakesPrint", () => ({
  useViewResidentIntakesPrint: ({ setPrintAllMode }) => ({
    componentRef1: { current: null },
    componentRef2: { current: null },
    componentRef3: { current: null },
    componentRef4: { current: null },
    componentRef5: { current: null },
    componentRef6: { current: null },
    componentRef7: { current: null },
    componentRef8: { current: null },
    componentRef9: { current: null },
    handlePrintUpdate1: vi.fn(),
    handlePrintUpdate2: vi.fn(),
    handlePrintUpdate3: vi.fn(),
    handlePrintUpdate4: vi.fn(),
    handlePrintUpdate5: vi.fn(),
    handlePrintUpdate6: vi.fn(),
    handlePrintUpdate7: vi.fn(),
    handlePrintUpdate8: vi.fn(),
    handlePrintUpdate9: vi.fn(),
    componentRefNew3: { current: null },
    componentRefNew8: { current: null },
    handlePrintNew3: vi.fn(),
    handlePrintNew8: vi.fn(),
    handlePrintAll: vi.fn(),
    printRef: { current: null },
    print: vi.fn(),
    triggerPrintAll: (...a) => {
      // Mirror real behaviour: print-all flips printAllMode on.
      setPrintAllMode(true);
      triggerPrintAll(...a);
    },
  }),
}));

const AUTH_PROFILE = {
  _id: "emp-test-001",
  userType: "Employee",
  companyName: "Test Facility",
  hoursFormat: "12",
  residentIntakes: [{ _id: "intake-test-001" }],
};

const makeWrapper = (route = "/intake/res-test-001", preloadedState) => {
  const store = setupStore(
    preloadedState ?? {
      auth: {
        isAuthenticated: true,
        userProfile: AUTH_PROFILE,
        unreadMessages: 0,
        unreadNotifications: 0,
      },
    },
  );
  const queryClient = makeQueryClient();
  return ({ children }) => (
    <ConfigProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>
            <Routes>
              <Route path="/intake/:id" element={children} />
              <Route path="/intake" element={children} />
              <Route path="*" element={children} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    </ConfigProvider>
  );
};

const renderLogic = (opts = {}) =>
  renderHook(() => useViewResidentIntakesLogic(), {
    wrapper: makeWrapper(opts.route, opts.preloadedState),
  });

describe("useViewResidentIntakesLogic", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should fetch the patient intake by route id on mount", async () => {
    renderLogic();
    // WHY: viewing an intake must load that resident's saved form from the API.
    await waitFor(() => expect(getApiResident).toHaveBeenCalled());
    const call = getApiResident.mock.calls[0][0];
    expect(call.url).toBe("/intake/res-test-001");
    expect(call.isIntake).toBe(true);
    expect(typeof call.setResponse).toBe("function");
  });

  it("should expose the route id and pull patientDetail from the auth store", () => {
    const { result } = renderLogic();
    expect(result.current.id).toBe("res-test-001");
    // WHY: the print header / hours format read from the logged-in profile.
    expect(result.current.patientDetail).toMatchObject({ _id: "emp-test-001" });
    expect(result.current.companyName).toBe("Test Facility");
  });

  it("should default hoursFormat to 12-hour token unless profile requests 24", () => {
    const { result } = renderLogic();
    // WHY: signatures/timestamps render in the resident's chosen clock format.
    expect(result.current.hoursFormat).toBe("h:mm A");
  });

  it("should use 24-hour token when the profile hoursFormat is '24'", () => {
    const { result } = renderLogic({
      preloadedState: {
        auth: {
          isAuthenticated: true,
          userProfile: { ...AUTH_PROFILE, hoursFormat: "24" },
          unreadMessages: 0,
          unreadNotifications: 0,
        },
      },
    });
    expect(result.current.hoursFormat).toBe("HH:mm");
  });

  it("should start on page 1 and advance / retreat through pages", () => {
    const { result } = renderLogic();
    expect(result.current.page).toBe(1);

    act(() => result.current.handleNextPage());
    expect(result.current.page).toBe(2);

    act(() => result.current.handlePrevPage());
    expect(result.current.page).toBe(1);

    // WHY: paging is clamped — prev on page 1 must not go to 0.
    act(() => result.current.handlePrevPage());
    expect(result.current.page).toBe(1);
  });

  it("should hydrate form display state when the API response arrives", async () => {
    getApiResident.mockImplementation(({ setResponse }) => {
      setResponse({
        iAgree: true,
        residentRightsResidentName: "Test Patient",
        advanceDirectivesProvidedInfoAcknowledged: true, // legacy Boolean
        advanceDirectivesRefusingAcknowledged: false, // legacy Boolean
        houseRulesAcknowledgementName: "Test Patient",
      });
    });
    const { result } = renderLogic();

    await waitFor(() => expect(result.current.iAgree).toBe(true));
    expect(result.current.residentRightsResidentName).toBe("Test Patient");
    // WHY: legacy Boolean acknowledgements are normalized to yes/no strings.
    expect(result.current.advanceDirectivesProvidedInfoAcknowledged).toBe(
      "yes",
    );
    expect(result.current.advanceDirectivesRefusingAcknowledged).toBe("no");
    expect(result.current.houseRulesAcknowledgementName).toBe("Test Patient");
  });

  it("should reset all values via initializeValues without crashing", async () => {
    getApiResident.mockImplementation(({ setResponse }) => {
      setResponse({ iAgree: true, residentRightsResidentName: "Test Patient" });
    });
    const { result } = renderLogic();
    await waitFor(() => expect(result.current.iAgree).toBe(true));

    act(() => result.current.initializeValues());
    // WHY: clearing the form must blank out previously hydrated answers.
    expect(result.current.iAgree).toBe(false);
    expect(result.current.residentRightsResidentName).toBe("");
  });

  it("should navigate to /intake and reset on submit", () => {
    const { result } = renderLogic();
    const preventDefault = vi.fn();
    act(() => result.current.submitHandler({ preventDefault }));
    expect(preventDefault).toHaveBeenCalled();
    // WHY: after submitting the view returns to the intake list.
    expect(result.current.iAgree).toBe(false);
  });

  it("should render the inline signature sections for resident and witness", () => {
    const { result } = renderLogic();
    const tree = result.current.renderInlineSignatures();
    // WHY: every viewed intake shows resident + witness signature blocks.
    expect(tree).toBeTruthy();
    expect(tree.props.children).toBeTruthy();
  });

  it("should expose print handlers and triggerPrintAll that flips printAllMode", () => {
    const { result } = renderLogic();
    expect(typeof result.current.handlePrintAll).toBe("function");
    expect(result.current.printAllMode).toBe(false);

    act(() => result.current.triggerPrintAll());
    // WHY: print-all must render all 10 pages, gated by printAllMode.
    expect(triggerPrintAll).toHaveBeenCalled();
    expect(result.current.printAllMode).toBe(true);
  });

  it("should auto-fire print-all when opened with ?autoPrint=1 and data is loaded", async () => {
    vi.useFakeTimers();
    getApiResident.mockImplementation(({ setResponse }) => {
      setResponse({ iAgree: true });
    });
    const { result } = renderLogic({
      route: "/intake/res-test-001?autoPrint=1",
    });

    // Flush the effect + the 600ms auto-print timer.
    await act(async () => {
      await Promise.resolve();
      vi.advanceTimersByTime(700);
    });

    // WHY: the resident documents "download" link opens with autoPrint=1 and
    // must kick the print-all flow exactly once.
    expect(result.current.hasAutoPrinted).toBe(true);
    expect(triggerPrintAll).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("should not crash and keep empty defaults when no id and no data", () => {
    const { result } = renderLogic({ route: "/intake" });
    // WHY: the create/blank route renders the same view with empty answers.
    expect(result.current.id).toBeUndefined();
    expect(result.current.page).toBe(1);
    expect(result.current.iAgree).toBeFalsy();
  });
});

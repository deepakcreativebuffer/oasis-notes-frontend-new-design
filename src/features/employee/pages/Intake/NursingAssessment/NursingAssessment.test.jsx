/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";
import { LayoutProvider } from "@/features/shared/contexts/LayoutContext";

// CSS side-effect imports in the source are no-ops under vitest, but the HOC
// pulls in Sidebar/Navbar only on the no-parent-layout branch — which we avoid
// by rendering under <LayoutProvider/> (hasParentLayout === true).

import NursingAssessment from "./NursingAssessment";

// ─── Mocks ──────────────────────────────────────────────────────────
// NursingAssessment.jsx is a thin wrapper: it calls the form-logic hook and
// spreads the returned context onto the form-content view, all inside the
// shared layout HOC. We mock both ./form modules so:
//   * the heavy real form hook never fires any intakeService/patientService IO
//   * the giant multi-part bootstrap form tree never has to render in jsdom.
// This lets us assert the wiring (hook -> content props) on the real HOC.
const mocks = vi.hoisted(() => ({
  // Sentinel ctx the wrapper must forward verbatim to the content component.
  ctx: {
    id: "nass-test-001",
    url: "/nursing-assessment",
    handlePost: () => {},
    profileInfo: { _id: "emp-test-001", userType: "Employee" },
  },
  useNursingAssessmentFormLogic: vi.fn(),
}));

vi.mock("./form/useNursingAssessmentFormLogic", () => ({
  useNursingAssessmentFormLogic: mocks.useNursingAssessmentFormLogic,
}));

// Light stub of the form content view: records the props it received so the
// test can assert the hook's ctx was spread onto it 1:1.
const receivedProps = { current: null };
vi.mock("./form/NursingAssessmentFormContent", () => ({
  __esModule: true,
  default: (props) => {
    receivedProps.current = props;
    return (
      <div data-testid="nursing-form-content">
        <span data-testid="ctx-url">{props.url}</span>
        <span data-testid="ctx-id">{props.id}</span>
      </div>
    );
  },
}));

const EMPLOYEE_AUTH = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

const renderPage = () =>
  renderWithProviders(
    <LayoutProvider>
      <NursingAssessment />
    </LayoutProvider>,
    { preloadedState: EMPLOYEE_AUTH, route: "/nursing-assessment" },
  );

describe("NursingAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    receivedProps.current = null;
    mocks.useNursingAssessmentFormLogic.mockReturnValue(mocks.ctx);
  });

  it("mounts and renders the nursing-assessment form content", () => {
    renderPage();
    // WHY: confirms the default-exported HOC resolves the inner component and
    // renders the form-content view rather than crashing on mount.
    expect(screen.getByTestId("nursing-form-content")).toBeInTheDocument();
  });

  it("calls the form-logic hook exactly once to source its context", () => {
    renderPage();
    // WHY: the page must derive all of its state from the single form-logic
    // hook; multiple calls would mean duplicated effects/IO.
    expect(mocks.useNursingAssessmentFormLogic).toHaveBeenCalledTimes(1);
  });

  it("spreads the hook's context object onto the form-content component", () => {
    renderPage();
    // WHY: NursingAssessment is pure wiring — {...ctx} must reach the view so
    // every field/handler the form needs is present.
    expect(receivedProps.current).toMatchObject(mocks.ctx);
    expect(screen.getByTestId("ctx-url").textContent).toBe(
      "/nursing-assessment",
    );
    expect(screen.getByTestId("ctx-id").textContent).toBe("nass-test-001");
    expect(typeof receivedProps.current.handlePost).toBe("function");
  });

  it("forwards an updated context shape when the hook returns different values", () => {
    // Simulate the edit route where the hook yields an id-bound context.
    mocks.useNursingAssessmentFormLogic.mockReturnValue({
      ...mocks.ctx,
      url: "/nursing-assessment/nass-test-001",
      id: "nass-edit-002",
    });
    renderPage();

    // WHY: the wrapper holds no state of its own; whatever the hook returns is
    // exactly what the content view must receive.
    expect(screen.getByTestId("ctx-url").textContent).toBe(
      "/nursing-assessment/nass-test-001",
    );
    expect(screen.getByTestId("ctx-id").textContent).toBe("nass-edit-002");
  });

  it("renders the content directly (no sidebar/navbar) when a parent layout is present", () => {
    renderPage();
    // WHY: under LayoutProvider the HOC takes the hasParentLayout branch and
    // returns the inner component only — no duplicate shell chrome.
    expect(document.querySelector(".asidebar")).toBeNull();
    expect(document.querySelector(".wrapper-content")).toBeNull();
  });
});

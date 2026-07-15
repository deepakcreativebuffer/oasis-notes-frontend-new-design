/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import TreatmentPlan from "./TreatmentPlan";
import TreatmentPlanPage from "./TreatmentPlanPage";

// ─── Mocks ──────────────────────────────────────────────────────────
// TreatmentPlan.jsx is a thin wrapper: it calls useTreatmentPlanForm(), passes
// the returned form object to <TreatmentPlanPage form={...} />, and exports the
// result through the layout HOC. We isolate that wiring by mocking the form
// hook, the heavy page tree, and the HOC so no real form logic / DOM-heavy
// section components / sidebar+navbar shell ever mount.
const mocks = vi.hoisted(() => ({
  // A representative form object the hook would normally produce.
  formApi: { __form: true, initialUpdate: "Initial", handlePost: () => {} },
  useTreatmentPlanForm: vi.fn(),
  TreatmentPlanPage: vi.fn(({ form }) => (
    <div data-testid="treatment-plan-page">
      page:{form && form.__form ? "got-form" : "no-form"}
    </div>
  )),
}));

// HOC normally wraps content in a sidebar/navbar shell. Stub it to render the
// inner component directly so we test the wrapper's own behavior, not layout.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// The hook is the form's source of truth — stub it; we only assert it is
// invoked and its return value is forwarded to the page.
vi.mock("./hooks/useTreatmentPlanForm", () => ({
  useTreatmentPlanForm: mocks.useTreatmentPlanForm,
}));

// The page renders 8 PHI-heavy section components + signature modal. Stub it to
// surface the received `form` prop so we can assert the prop hand-off.
vi.mock("./TreatmentPlanPage", () => ({
  __esModule: true,
  default: mocks.TreatmentPlanPage,
}));

const EMPLOYEE_STATE = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("TreatmentPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useTreatmentPlanForm.mockReturnValue(mocks.formApi);
  });

  it("mounts and renders the treatment plan page", () => {
    renderWithProviders(<TreatmentPlan />, {
      preloadedState: EMPLOYEE_STATE,
      route: "/treatment-plan",
    });
    // WHY: smoke-confirm the wrapper renders its page child without crashing.
    expect(screen.getByTestId("treatment-plan-page")).toBeInTheDocument();
  });

  it("calls the treatment plan form hook to drive the page", () => {
    renderWithProviders(<TreatmentPlan />, {
      preloadedState: EMPLOYEE_STATE,
      route: "/treatment-plan",
    });
    // WHY: the hook is the single source of truth; it must be invoked on render.
    expect(mocks.useTreatmentPlanForm).toHaveBeenCalledTimes(1);
  });

  it("forwards the hook's form object into TreatmentPlanPage as the `form` prop", () => {
    renderWithProviders(<TreatmentPlan />, {
      preloadedState: EMPLOYEE_STATE,
      route: "/treatment-plan",
    });
    // WHY: the wrapper's only job is plumbing the form API into the page.
    expect(screen.getByTestId("treatment-plan-page")).toHaveTextContent(
      "got-form",
    );
    expect(TreatmentPlanPage).toHaveBeenCalledTimes(1);
    expect(TreatmentPlanPage.mock.calls[0][0].form).toBe(mocks.formApi);
  });

  it("re-renders without crashing when the hook returns an empty form object", () => {
    mocks.useTreatmentPlanForm.mockReturnValue({});
    renderWithProviders(<TreatmentPlan />, {
      preloadedState: EMPLOYEE_STATE,
      route: "/treatment-plan",
    });
    // WHY: a not-yet-populated form (empty object) must not break the wrapper.
    expect(screen.getByTestId("treatment-plan-page")).toHaveTextContent(
      "no-form",
    );
  });
});

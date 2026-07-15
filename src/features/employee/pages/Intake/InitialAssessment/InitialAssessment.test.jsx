/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import InitialAssessment from "./InitialAssessment";

// ─── Mocks ──────────────────────────────────────────────────────────
// The default export is `HOC({ Wcomponenet: InitialAssessment })`. HOC wraps
// its inner component in the sidebar/navbar shell (Sidebar, Navbar, redux,
// router, LayoutContext). We stub HOC to a pass-through so this test exercises
// the InitialAssessment wrapper's own wiring — hook -> form prop -> page —
// rather than the unrelated layout chrome.
const mocks = vi.hoisted(() => ({
  // HOC runs at module-import time, before any beforeEach — store its config on
  // a plain object that clearAllMocks never touches.
  hocConfig: { value: null },
  useInitialAssessmentForm: vi.fn(),
}));

vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  // WHY: capture the config passed to HOC so we can assert the wrapper is
  // registered, and render its Wcomponenet directly (no layout shell).
  default: (config) => {
    mocks.hocConfig.value = config;
    return function HocStub() {
      const Inner = config.Wcomponenet;
      return <Inner />;
    };
  },
}));

vi.mock("./hooks/useInitialAssessmentForm", () => ({
  useInitialAssessmentForm: mocks.useInitialAssessmentForm,
}));

// Light stub for the heavy page: echoes the `form` prop it receives so we can
// prove InitialAssessment forwards the hook's return value as `form`.
vi.mock("./InitialAssessmentPage", () => ({
  default: ({ form }) => (
    <div data-testid="ia-page" data-marker={form ? form.marker : "none"} />
  ),
}));

describe("InitialAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useInitialAssessmentForm.mockReturnValue({ marker: "form-api" });
  });

  it("registers the inner component with the layout HOC", () => {
    // WHY: the page must be wrapped by HOC so staff get the sidebar/navbar
    // shell — a regression here would render the form with no navigation.
    // HOC is invoked at import time, so the config is captured before render.
    expect(mocks.hocConfig.value).not.toBeNull();
    expect(typeof mocks.hocConfig.value.Wcomponenet).toBe("function");
  });

  it("calls useInitialAssessmentForm and forwards its result as the page's form prop", () => {
    renderWithProviders(<InitialAssessment />);

    // WHY: InitialAssessment's sole job is to hydrate the form hook and pass it
    // down — confirm the hook ran and its return value reached the page.
    expect(mocks.useInitialAssessmentForm).toHaveBeenCalledTimes(1);
    const page = screen.getByTestId("ia-page");
    expect(page).toBeInTheDocument();
    expect(page).toHaveAttribute("data-marker", "form-api");
  });

  it("renders the page even when the form hook returns an empty object", () => {
    // Defensive: the hook may not have hydrated data yet on first paint.
    mocks.useInitialAssessmentForm.mockReturnValue({});
    renderWithProviders(<InitialAssessment />);

    expect(screen.getByTestId("ia-page")).toBeInTheDocument();
  });
});

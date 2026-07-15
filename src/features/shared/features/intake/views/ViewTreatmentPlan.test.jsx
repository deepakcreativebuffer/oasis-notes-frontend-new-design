/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import ViewTreatmentPlan from "./ViewTreatmentPlan";

// The HOC wraps the view in the persistent Sidebar/Navbar shell which pulls in
// a large dependency tree (routing constants, layout context, images). For a
// unit test of the view itself we replace it with a pass-through that simply
// renders the wrapped component, so we exercise the real ViewTreatmentPlan ->
// hook -> page wiring without the shell.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  // HOC is a higher-order component: it is invoked at module load with the
  // wrapped component and must return a *component* (not an element), matching
  // the real signature `export default HOC({ Wcomponenet })`.
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// The form hook does data-fetching (react-query / residentService) and owns a
// huge amount of EHR state. We mock it so the test can drive the view with a
// controlled return value and assert it is forwarded to the page.
const mockUseViewTreatmentPlanForm = vi.fn();
vi.mock("./hooks/useViewTreatmentPlanForm", () => ({
  useViewTreatmentPlanForm: () => mockUseViewTreatmentPlanForm(),
}));

// The page is a large read-only composition of ~9 section components. We stub
// it to a light probe that proves (a) the view rendered the page and (b) the
// form object produced by the hook was handed down as the `form` prop.
vi.mock("./ViewTreatmentPlanPage", () => ({
  __esModule: true,
  default: ({ form }) => (
    <div data-testid="treatment-plan-page">
      <span data-testid="initial-update">{form?.initialUpdate ?? ""}</span>
    </div>
  ),
}));

const makeForm = (overrides = {}) => ({
  initialUpdate: "Initial",
  navigate: vi.fn(),
  handlePost: vi.fn(),
  printRef: { current: null },
  componentRef: { current: null },
  draftModel: false,
  setDraftModel: vi.fn(),
  setInitialUpdate: vi.fn(),
  ...overrides,
});

describe("ViewTreatmentPlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseViewTreatmentPlanForm.mockReturnValue(makeForm());
  });

  it("should render the treatment plan page", () => {
    renderWithProviders(<ViewTreatmentPlan />);

    // WHY: the behavioral-health treatment plan view must mount its page body;
    // a blank render would hide a clinical document from staff.
    expect(screen.getByTestId("treatment-plan-page")).toBeInTheDocument();
  });

  it("should drive the view from the form hook return value", () => {
    mockUseViewTreatmentPlanForm.mockReturnValue(
      makeForm({ initialUpdate: "Update" }),
    );

    renderWithProviders(<ViewTreatmentPlan />);

    // WHY: the view's only job is to call useViewTreatmentPlanForm and forward
    // its result as the `form` prop — verifying the wiring guards against the
    // page silently losing the loaded plan data.
    expect(mockUseViewTreatmentPlanForm).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("initial-update")).toHaveTextContent("Update");
  });

  it("should render without crashing when the form has no loaded data", () => {
    // Mirrors first paint before the async fetch resolves: the hook returns an
    // essentially empty form object.
    mockUseViewTreatmentPlanForm.mockReturnValue({});

    renderWithProviders(<ViewTreatmentPlan />);

    // WHY: the plan often renders before its data arrives; it must not throw on
    // a missing/empty form and should still show the page scaffold.
    expect(screen.getByTestId("treatment-plan-page")).toBeInTheDocument();
    expect(screen.getByTestId("initial-update")).toHaveTextContent("");
  });
});

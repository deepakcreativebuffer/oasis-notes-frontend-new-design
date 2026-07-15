/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import ViewNursingAssessment from "./ViewNursingAssessment";

// ViewNursingAssessment is a thin wrapper: it calls the heavy logic hook
// (which fetches the nursing-assessment record + employees) and spreads the
// resulting context into the presentational Content component. We mock both
// the data-fetching hook and the heavy Content tree so the test asserts the
// WIRING (hook -> Content props) without real HTTP/sockets.

// HOC normally renders the persistent Sidebar/Navbar shell. Stub it to render
// the wrapped component directly so we test the view, not the chrome.
// Real HOC is a factory: HOC(config) -> Component. Mirror that so the default
// export of the source module stays a component, but skip the chrome.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function HOCStub() {
      return <Wcomponenet />;
    },
}));

// Print stylesheet import has no behaviour to assert.
vi.mock("@/assets/styles/Print.css", () => ({}));

const mockLogic = vi.fn();
vi.mock("./ViewNursingAssessment/useViewNursingAssessmentLogic", () => ({
  useViewNursingAssessmentLogic: () => mockLogic(),
}));

// Light stub for the Content tree: echoes a couple of props so we can prove
// the logic context flowed through, without pulling in the full form markup.
vi.mock("./ViewNursingAssessment/ViewNursingAssessmentContent", () => ({
  default: (props) => (
    <div data-testid="nursing-content">
      <span data-testid="resident-name">{props.residentName}</span>
      <span data-testid="draft-flag">
        {props.draftModel ? "draft-open" : "draft-closed"}
      </span>
    </div>
  ),
}));

const baseCtx = (overrides = {}) => ({
  residentName: "Test Patient",
  draftModel: false,
  printRef: { current: null },
  componentRef: { current: null },
  showSignatureResident: false,
  setSignerSignature: vi.fn(),
  setSignerDate: vi.fn(),
  setSignerTime: vi.fn(),
  setDraftModel: vi.fn(),
  ...overrides,
});

describe("ViewNursingAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogic.mockReturnValue(baseCtx());
  });

  it("should render the nursing assessment content from the logic hook", () => {
    renderWithProviders(<ViewNursingAssessment />);

    // WHY: the view must mount its assessment content so clinicians can read
    // the filed record.
    expect(screen.getByTestId("nursing-content")).toBeInTheDocument();
  });

  it("should pass the resident name from the logic context into the content", () => {
    renderWithProviders(<ViewNursingAssessment />);

    // WHY: the patient identity must propagate to the rendered assessment so
    // the document is attributed to the correct resident.
    expect(screen.getByTestId("resident-name")).toHaveTextContent(
      "Test Patient",
    );
  });

  it("should forward the draftModel flag into the content", () => {
    mockLogic.mockReturnValue(baseCtx({ draftModel: true }));
    renderWithProviders(<ViewNursingAssessment />);

    // WHY: the unsaved-draft modal state is owned by the logic hook; the view
    // must hand it down so the draft prompt can surface.
    expect(screen.getByTestId("draft-flag")).toHaveTextContent("draft-open");
  });

  it("should render without crashing when the logic hook returns empty data", () => {
    // Partially-hydrated / pre-fetch state: no record loaded yet.
    mockLogic.mockReturnValue(baseCtx({ residentName: "" }));
    renderWithProviders(<ViewNursingAssessment />);

    expect(screen.getByTestId("nursing-content")).toBeInTheDocument();
    expect(screen.getByTestId("resident-name")).toHaveTextContent("");
  });
});

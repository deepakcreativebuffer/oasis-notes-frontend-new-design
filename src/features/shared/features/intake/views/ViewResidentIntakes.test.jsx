/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import ViewResidentIntakes from "./ViewResidentIntakes";

// ViewResidentIntakes is a thin composition: it calls a data-fetching logic
// hook and spreads the result into a heavy presentational content tree, then
// wraps the whole thing in the app HOC shell (Sidebar + Navbar). To test the
// composition in isolation we mock:
//  - HOC: render the inner page directly, skipping Sidebar/Navbar/data IO.
//  - the logic hook: drive the component via controlled return values instead
//    of real residentService HTTP / print refs.
//  - the content tree: a light stub that surfaces the props we assert on.

const logicReturn = vi.fn();
vi.mock(
  "@/features/shared/features/intake/views/ViewResidentIntakes/useViewResidentIntakesLogic",
  () => ({
    useViewResidentIntakesLogic: () => logicReturn(),
  }),
);

// HOC normally renders the persistent app shell (Sidebar/Navbar) which performs
// its own redux reads. Stub it to simply render the wrapped component so this
// test stays focused on the intake view wiring.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  // HOC is a factory: HOC({ Wcomponenet }) returns a component. Return a
  // component that just renders the wrapped page (no Sidebar/Navbar shell).
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// Light stub for the presentational content. It renders the page title (driven
// by `page`) and exposes the draft-modal toggle + submit wiring so we can assert
// ViewResidentIntakes forwards the logic-hook context unchanged.
vi.mock(
  "@/features/shared/features/intake/views/ViewResidentIntakes/ViewResidentIntakesContent",
  () => ({
    default: (props) => (
      <div data-testid="intake-content">
        <span data-testid="page-value">{String(props.page)}</span>
        {props.draftModel ? <div role="dialog">Draft Modal Open</div> : null}
        <button type="button" onClick={() => props.setDraftModel(true)}>
          open draft
        </button>
        <button type="button" onClick={props.submitHandler}>
          submit
        </button>
      </div>
    ),
  }),
);

// CSS side-effect imports in the source must not break the module graph.
vi.mock("@/features/resident/components/Forms/ResidentIntake.css", () => ({}));
vi.mock("@/assets/styles/Print.css", () => ({}));

const makeCtx = (overrides = {}) => ({
  draftModel: false,
  setDraftModel: vi.fn(),
  Cpage: { page: 1 },
  setPage: vi.fn(),
  page: 1,
  componentRef9: { current: null },
  printRef: { current: null },
  submitHandler: vi.fn((e) => e?.preventDefault?.()),
  ...overrides,
});

describe("ViewResidentIntakes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    logicReturn.mockReturnValue(makeCtx());
  });

  it("should render the intake content driven by the logic hook", () => {
    renderWithProviders(<ViewResidentIntakes />);

    // WHY: the view is only useful if it mounts the resident-intake content
    // tree; a blank render would mean staff cannot see the intake forms.
    expect(screen.getByTestId("intake-content")).toBeInTheDocument();
  });

  it("should forward the current page from the logic hook to the content", () => {
    logicReturn.mockReturnValue(makeCtx({ page: 5 }));
    renderWithProviders(<ViewResidentIntakes />);

    // WHY: the multi-page intake packet shows one consent form per page; the
    // active page must come straight from the logic hook so navigation works.
    expect(screen.getByTestId("page-value")).toHaveTextContent("5");
  });

  it("should not render the draft modal when draftModel is false", () => {
    renderWithProviders(<ViewResidentIntakes />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render the draft modal when draftModel is true", () => {
    logicReturn.mockReturnValue(makeCtx({ draftModel: true }));
    renderWithProviders(<ViewResidentIntakes />);

    // WHY: the draft modal lets staff resume an in-progress intake; it must
    // appear when the logic hook flags an open draft.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should mount without crashing when the logic hook returns empty context", () => {
    // Simulates the pre-fetch state where the hook has not yet populated data.
    logicReturn.mockReturnValue(makeCtx({ page: undefined, Cpage: {} }));
    renderWithProviders(<ViewResidentIntakes />);

    // WHY: the page renders before the resident-intake API resolves, so it must
    // tolerate missing/empty data instead of white-screening on the patient.
    expect(screen.getByTestId("intake-content")).toBeInTheDocument();
  });
});

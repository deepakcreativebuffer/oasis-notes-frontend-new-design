/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import { useResidentIntakeFormContext } from "./context/ResidentIntakeFormContext";
import ResidentIntake from "./ResidentIntake";

// ─── Mocks ──────────────────────────────────────────────────────────
// ResidentIntake.jsx is a thin composition wrapper:
//   default export = HOC({ Wcomponenet: ResidentIntake })
//   ResidentIntake = <FormProvider value={useResidentIntakeLogic()}><Content/></FormProvider>
// We mock the heavy logic hook + the HOC shell, but keep the REAL form
// context so the provider→consumer wiring is genuinely exercised.

const mocks = vi.hoisted(() => ({
  logicCtx: {
    __tag: "resident-intake-ctx",
    page: 7,
    id: "intake-test-001",
  },
  useResidentIntakeLogic: vi.fn(),
}));

// CSS side-effect imports — stub so jsdom never tries to parse them.
vi.mock("@/features/resident/pages/Intake/FaceSheet/Facesheet.css", () => ({}));
vi.mock(
  "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css",
  () => ({}),
);
vi.mock(
  "@/features/shared/features/intake/initialAssessment/InitialAssessment.css",
  () => ({}),
);

// HOC wraps the page in the app shell (Sidebar/Navbar/Redux selectors).
// Replace it with a light passthrough that just renders the wrapped
// component so we test ResidentIntake itself, not the chrome.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function HocStub() {
      return (
        <div data-testid="hoc-shell">
          <Wcomponenet />
        </div>
      );
    },
}));

// The logic hook builds the entire intake form state via real services +
// useParams/useSelector. Stub it to a deterministic context object.
vi.mock("./form/useResidentIntakeLogic", () => ({
  useResidentIntakeLogic: mocks.useResidentIntakeLogic,
}));

// Content normally renders the whole multi-page form. Replace it with a
// consumer of the REAL context (not mocked) so we can assert the provider
// forwarded exactly the hook's return value. The mock's render body runs
// after module imports resolve, so referencing the imported hook is safe.
vi.mock("./form/ResidentIntakeContent", () => ({
  default: () => {
    const ctx = useResidentIntakeFormContext();
    return (
      <div data-testid="content">
        <span data-testid="ctx-tag">{ctx.__tag}</span>
        <span data-testid="ctx-page">{String(ctx.page)}</span>
        <span data-testid="ctx-id">{ctx.id}</span>
      </div>
    );
  },
}));

describe("ResidentIntake (composition wrapper)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useResidentIntakeLogic.mockReturnValue(mocks.logicCtx);
  });

  it("mounts through the HOC shell and renders the intake content", () => {
    renderWithProviders(<ResidentIntake />);
    // WHY: confirms the default export (HOC-wrapped) mounts and composes
    // the provider + content without crashing.
    expect(screen.getByTestId("hoc-shell")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("calls useResidentIntakeLogic to build the form context", () => {
    renderWithProviders(<ResidentIntake />);
    expect(mocks.useResidentIntakeLogic).toHaveBeenCalledTimes(1);
  });

  it("forwards the logic hook's return value as the provider value", () => {
    renderWithProviders(<ResidentIntake />);
    // WHY: ResidentIntakeContent must receive the exact ctx object from the
    // logic hook through ResidentIntakeFormProvider — this verifies that wiring
    // via the REAL context consumer.
    expect(screen.getByTestId("ctx-tag")).toHaveTextContent(
      "resident-intake-ctx",
    );
    expect(screen.getByTestId("ctx-page")).toHaveTextContent("7");
    expect(screen.getByTestId("ctx-id")).toHaveTextContent("intake-test-001");
  });

  it("re-renders content from a different logic context (no stale value)", () => {
    mocks.useResidentIntakeLogic.mockReturnValue({
      __tag: "resident-intake-ctx",
      page: 1,
      id: "intake-test-002",
    });
    renderWithProviders(<ResidentIntake />);
    expect(screen.getByTestId("ctx-page")).toHaveTextContent("1");
    expect(screen.getByTestId("ctx-id")).toHaveTextContent("intake-test-002");
  });
});

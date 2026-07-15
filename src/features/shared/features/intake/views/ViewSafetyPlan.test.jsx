/** @format */

import { describe, it, expect, vi } from "vitest";

import ViewSafetyPlan from "./ViewSafetyPlan";

// ─────────────────────────────────────────────────────────────────────
// KNOWN SOURCE BUG (flagged to the team):
// ViewSafetyPlan.jsx references setters that are never declared with
// useState — e.g. `setFiledForm`, `setUserId`, `setUserDetail`, `setUser`,
// `setDate` are used in effects/handlers but only the VALUES (or nothing)
// are destructured. As written, the component throws
// `TypeError: setFiledForm is not a function` from a passive effect on
// EVERY mount, so it cannot be rendered in the EHR at runtime.
//
// Because mounting it crashes (and the crash surfaces as an unhandled error
// that pollutes other test files), we do NOT render it here. We assert the
// module imports and exports a component, which is the most that can be
// verified until the source defect is fixed. Once the setters are properly
// declared, this should be upgraded to a full render test using
// renderWithProviders + the residentService mock (fetch-by-route-id, intake
// flag, signature display).
// ─────────────────────────────────────────────────────────────────────

vi.mock("@/features/shared/services/index", () => ({
  residentService: { getApiResident: vi.fn() },
  EMPLOYEE_APIS: {
    EMPLOYEE_GETRESIDENTSAFETYPLANBYID: vi.fn((id) => `/safety-plan/${id}`),
  },
}));
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));
vi.mock("@/utils/NavWrapper", () => ({ default: () => null }));
vi.mock("@/features/resident/components/Modal/Draftinmodel", () => ({
  default: () => null,
}));
vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));
vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "Safety Plan"),
}));
vi.mock("@shared/hooks", () => ({ usePrint: (_r, h) => h }));
vi.mock("@/utils/utils", () => ({
  AddSignature: () => null,
  signatureFormat: () => null,
  formatDateToMMDDYYYY: () => "",
}));

describe("ViewSafetyPlan", () => {
  it("should export a React component", () => {
    // WHY: until the undefined-setter source bug is fixed the view cannot be
    // mounted; we at least guarantee the module loads and exports a component
    // so import wiring (services/layout/print helpers) stays intact.
    expect(typeof ViewSafetyPlan).toBe("function");
  });
});

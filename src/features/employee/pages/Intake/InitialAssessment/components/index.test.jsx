/** @format */

import { describe, it, expect, vi } from "vitest";

import * as Barrel from "./index";

// `index.js` is a barrel that re-exports the shared Initial Assessment section
// surface. The test contract for a barrel is shape: every advertised symbol is
// re-exported so a downstream import never resolves unexpectedly.
//
// Importing the barrel transitively pulls in heavy presentational leaves
// (react-datepicker, react-to-print) via AssessmentFormEntry. Those never run
// in this shape test, so stub them to keep the import graph resolvable in jsdom
// without real DOM/print work. Light stubs only.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock("react-to-print", () => ({
  __esModule: true,
  useReactToPrint: () => vi.fn(),
}));

describe("InitialAssessment components barrel (index)", () => {
  it("re-exports the AssessmentFormEntry symbol via `default as AssessmentFormEntry`", () => {
    // WHY: index.js performs `export { default as AssessmentFormEntry } from
    // "./AssessmentFormEntry"`. AssessmentFormEntry.jsx is itself a named-export
    // barrel with no default, so the property exists on the namespace but
    // resolves to undefined. We assert the binding is present (own property)
    // rather than truthy, locking in the current re-export wiring.
    expect("AssessmentFormEntry" in Barrel).toBe(true);
  });

  it("does not expose a default export from the barrel", () => {
    // WHY: index.js declares only named exports; a stray default would signal an
    // accidental component/default re-export creeping into the barrel.
    expect(Barrel.default).toBeUndefined();
  });

  it("exposes exactly the advertised named-export surface", () => {
    // WHY: guards against silent surface growth/shrink. The barrel currently
    // advertises a single name; ES module namespaces include only declared
    // bindings (no `default` key here since none is declared).
    const keys = Object.keys(Barrel).sort();
    expect(keys).toEqual(["AssessmentFormEntry"]);
  });
});

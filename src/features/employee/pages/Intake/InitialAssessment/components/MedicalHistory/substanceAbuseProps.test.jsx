/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";

import { buildSubstanceAbuseProps } from "./substanceAbuseProps";
import { SUBSTANCE_ABUSE_SECTION_PROP_KEYS } from "./SubstanceAbuseSection";

// SubstanceAbuseSection is a heavy react-bootstrap section component. We only
// need its exported SUBSTANCE_ABUSE_SECTION_PROP_KEYS contract, so mock it with
// a small, deterministic key set to exercise buildSubstanceAbuseProps' merge
// precedence without pulling in the real component tree.
vi.mock("./SubstanceAbuseSection", () => ({
  __esModule: true,
  default: () => null,
  SUBSTANCE_ABUSE_SECTION_PROP_KEYS: ["id", "canDelete", "handleTypeOfArray"],
}));

describe("buildSubstanceAbuseProps", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns an object containing exactly the section prop keys", () => {
    const result = buildSubstanceAbuseProps({});
    // WHY: the section is fed a fixed prop contract; the builder must emit a key
    // for every declared key so React doesn't see undefined-vs-missing churn.
    expect(Object.keys(result).sort()).toEqual(
      [...SUBSTANCE_ABUSE_SECTION_PROP_KEYS].sort(),
    );
  });

  it("merges scope.sectionProps with scope spread, allowing scope overrides", () => {
    const handler = vi.fn();
    const scope = {
      sectionProps: {
        id: "from-section-props",
        canDelete: false,
      },
      // These should win because they are spread last.
      id: "res-test-001",
      canDelete: true,
      handleTypeOfArray: handler,
    };
    const result = buildSubstanceAbuseProps(scope);
    // WHY: when an explicit sectionProps bag is supplied it is merged, but
    // the outermost scope value must win for collisions.
    expect(result.id).toBe("res-test-001");
    expect(result.canDelete).toBe(true);
    expect(result.handleTypeOfArray).toBe(handler);
  });

  it("falls back to merging selectHandlers, legacy, and scope when sectionProps is absent", () => {
    const scope = {
      selectHandlers: { handleTypeOfArray: "from-handlers" },
      legacy: { canDelete: "from-legacy" },
      id: "from-scope",
    };
    const result = buildSubstanceAbuseProps(scope);
    expect(result.handleTypeOfArray).toBe("from-handlers");
    expect(result.canDelete).toBe("from-legacy");
    expect(result.id).toBe("from-scope");
  });

  it("lets top-level scope fields override selectHandlers and legacy (spread order precedence)", () => {
    const scope = {
      selectHandlers: { id: "from-handlers" },
      legacy: { id: "from-legacy" },
      id: "from-scope",
    };
    const result = buildSubstanceAbuseProps(scope);
    // WHY: merge order is { ...selectHandlers, ...legacy, ...scope } so the
    // outermost scope value must win for collisions.
    expect(result.id).toBe("from-scope");
  });

  it("only picks declared keys and drops unrelated scope fields", () => {
    const scope = { id: "res-test-001", notAKey: "ignored", anotherExtra: 42 };
    const result = buildSubstanceAbuseProps(scope);
    expect(result).not.toHaveProperty("notAKey");
    expect(result).not.toHaveProperty("anotherExtra");
    expect(result.id).toBe("res-test-001");
  });

  it("sets missing keys to undefined while still emitting them", () => {
    const result = buildSubstanceAbuseProps({ id: "res-test-001" });
    // WHY: keys not provided still appear (with undefined) so the section's
    // destructuring stays consistent across renders.
    expect("canDelete" in result).toBe(true);
    expect(result.canDelete).toBeUndefined();
  });

  it("handles empty selectHandlers/legacy without throwing (nullish defaults)", () => {
    const scope = {
      sectionProps: undefined,
      selectHandlers: undefined,
      legacy: undefined,
    };
    expect(() => buildSubstanceAbuseProps(scope)).not.toThrow();
    const result = buildSubstanceAbuseProps(scope);
    expect(Object.keys(result).sort()).toEqual(
      [...SUBSTANCE_ABUSE_SECTION_PROP_KEYS].sort(),
    );
  });
});

/** @format */

import { renderHook } from "@testing-library/react";
import { useSubstanceAbuseSelectHandlers } from "./useSubstanceAbuseSelectHandlers";
import { SUBSTANCE_ABUSE_FIXED_ROWS } from "../config/substanceAbuseConfig";
import {
  getSubstanceSelectPropNames,
  SUBSTANCE_SELECT_FIELD_TYPES,
} from "../config/substanceAbuseSelectPropNames";
import {
  SUBSTANCE_FIELD_OPTIONS,
  SUBSTANCE_FREQUENCY_OPTIONS,
  SUBSTANCE_LAST_USE_OPTIONS,
  SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
} from "../config/substanceAbuseSelectOptions";

// WHY: this hook is a pure useMemo wiring layer over substance-abuse intake
// config — no IO, redux, router or react-query — so renderHook with no
// provider wrapper is sufficient. All collaborators are pure config/util
// modules and are deliberately NOT mocked so we verify the real wiring.

describe("useSubstanceAbuseSelectHandlers", () => {
  beforeEach(() => vi.clearAllMocks());

  // Build a legacy object exposing every setter the hook looks for.
  const buildFullLegacy = () => {
    const legacy = {
      setOtherLastUse: vi.fn(),
      setOtherFrequancy: vi.fn(),
      setOtherLengthOfSobirty: vi.fn(),
    };
    SUBSTANCE_ABUSE_FIXED_ROWS.forEach((config) => {
      for (const field of SUBSTANCE_SELECT_FIELD_TYPES) {
        const names = getSubstanceSelectPropNames(config.substanceKey, field);
        legacy[names.setter] = vi.fn();
      }
    });
    return legacy;
  };

  it("wires the three 'other' draft handlers when their setters are functions", () => {
    const legacy = {
      setOtherLastUse: vi.fn(),
      setOtherFrequancy: vi.fn(),
      setOtherLengthOfSobirty: vi.fn(),
    };
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );
    const h = result.current;

    // WHY: bindOther exposes the static option list plus key/change handlers
    // under the legacy-flat prop names the intake form consumes.
    expect(h.optionotherLastUse).toBe(SUBSTANCE_LAST_USE_OPTIONS);
    expect(h.optionotherFrequancy).toBe(SUBSTANCE_FREQUENCY_OPTIONS);
    expect(h.optionOtherlengthOfSobrifty).toBe(
      SUBSTANCE_LENGTH_OF_SOBRIETY_OPTIONS,
    );
    expect(typeof h.handleKeyotherLastUse).toBe("function");
    expect(typeof h.handleotherLastUse).toBe("function");
    expect(typeof h.handleKeyotherFrequancy).toBe("function");
    expect(typeof h.handleotherFrequancy).toBe("function");
    expect(typeof h.handleKeyOtherlengthOfSobrifty).toBe("function");
    expect(typeof h.handleOtherlengthOfSobrifty).toBe("function");
  });

  it("skips 'other' draft handlers whose setter is not a function", () => {
    const legacy = { setOtherLastUse: vi.fn() }; // others missing
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );
    const h = result.current;

    expect(h.handleotherLastUse).toBeDefined();
    // WHY: a missing setter must not produce dangling handlers that would call
    // an undefined setter at runtime.
    expect(h.optionotherFrequancy).toBeUndefined();
    expect(h.handleKeyotherFrequancy).toBeUndefined();
    expect(h.handleotherFrequancy).toBeUndefined();
    expect(h.optionOtherlengthOfSobrifty).toBeUndefined();
    expect(h.handleOtherlengthOfSobrifty).toBeUndefined();
  });

  it("'other' change handler forwards the selected option to its setter", () => {
    const legacy = { setOtherLastUse: vi.fn() };
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );

    const option = { value: "Yesterday", label: "Yesterday" };
    result.current.handleotherLastUse(option);

    expect(legacy.setOtherLastUse).toHaveBeenCalledWith(option);
  });

  it("'other' key handler creates a custom option on Enter for an unknown value", () => {
    const legacy = { setOtherFrequancy: vi.fn() };
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );

    const target = { value: "  Every full moon  " };
    result.current.handleKeyotherFrequancy({ key: "Enter", target });

    // WHY: creatable selects let intake staff type free-text not in the preset
    // list; the value is trimmed and the input is cleared.
    expect(legacy.setOtherFrequancy).toHaveBeenCalledWith({
      value: "Every full moon",
      label: "Every full moon",
    });
    expect(target.value).toBe("");
  });

  it("'other' key handler does NOT create a duplicate of an existing option", () => {
    const legacy = { setOtherFrequancy: vi.fn() };
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );

    const existing = SUBSTANCE_FREQUENCY_OPTIONS[0].value;
    result.current.handleKeyotherFrequancy({
      key: "Enter",
      target: { value: existing },
    });

    expect(legacy.setOtherFrequancy).not.toHaveBeenCalled();
  });

  it("'other' key handler ignores non-Enter keys", () => {
    const legacy = { setOtherLastUse: vi.fn() };
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );

    result.current.handleKeyotherLastUse({
      key: "a",
      target: { value: "Whatever" },
    });

    expect(legacy.setOtherLastUse).not.toHaveBeenCalled();
  });

  it("wires every fixed substance row x field-type when all setters exist", () => {
    const legacy = buildFullLegacy();
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );
    const h = result.current;

    SUBSTANCE_ABUSE_FIXED_ROWS.forEach((config) => {
      for (const field of SUBSTANCE_SELECT_FIELD_TYPES) {
        const names = getSubstanceSelectPropNames(config.substanceKey, field);
        // WHY: each row/field publishes its static option list plus the two
        // handlers under config-derived prop names; the option list must match
        // the field type (lastUse / frequency / lengthOfSobriety).
        expect(h[names.options]).toBe(SUBSTANCE_FIELD_OPTIONS[field]);
        expect(typeof h[names.handleKey]).toBe("function");
        expect(typeof h[names.handler]).toBe("function");
      }
    });
  });

  it("skips a fixed-row field whose setter is missing", () => {
    const legacy = buildFullLegacy();
    const names = getSubstanceSelectPropNames("Cocaine", "lastUse");
    delete legacy[names.setter];

    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );
    const h = result.current;

    expect(h[names.options]).toBeUndefined();
    expect(h[names.handleKey]).toBeUndefined();
    expect(h[names.handler]).toBeUndefined();
    // sibling field on the same substance is still wired
    const freq = getSubstanceSelectPropNames("Cocaine", "frequency");
    expect(typeof h[freq.handler]).toBe("function");
  });

  it("a fixed-row change handler forwards the option to the matching setter", () => {
    const legacy = buildFullLegacy();
    const names = getSubstanceSelectPropNames("Alcohol", "frequency");
    const { result } = renderHook(() =>
      useSubstanceAbuseSelectHandlers(legacy),
    );

    const option = { value: "Daily", label: "Daily" };
    result.current[names.handler](option);

    expect(legacy[names.setter]).toHaveBeenCalledWith(option);
  });

  it("returns a stable reference across re-renders with the same legacy object", () => {
    const legacy = buildFullLegacy();
    const { result, rerender } = renderHook(
      ({ l }) => useSubstanceAbuseSelectHandlers(l),
      { initialProps: { l: legacy } },
    );
    const first = result.current;
    rerender({ l: legacy });
    // WHY: useMemo([legacy]) — same input must yield the identical handlers map
    // so child selects don't see new prop identities each render.
    expect(result.current).toBe(first);
  });

  it("recomputes when a new legacy object is supplied", () => {
    const { result, rerender } = renderHook(
      ({ l }) => useSubstanceAbuseSelectHandlers(l),
      { initialProps: { l: buildFullLegacy() } },
    );
    const first = result.current;
    rerender({ l: buildFullLegacy() });
    expect(result.current).not.toBe(first);
  });
});

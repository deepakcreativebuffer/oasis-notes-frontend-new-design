/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

import {
  createInitialValuesFromRegistry,
  useLegacyObjectForm,
} from "./useLegacyObjectForm";

// Representative registry mirroring how an intake assessment form declares its
// fields: each field has a key, a legacy setter name, and a stringified default.
const REGISTRY = [
  { key: "allergies", setter: "setAllergies", defaultValue: '""' },
  { key: "isSmoker", setter: "setIsSmoker", defaultValue: "false" },
  { key: "consentGiven", setter: "setConsentGiven", defaultValue: "true" },
  { key: "guardian", setter: "setGuardian", defaultValue: "null" },
  { key: "notes", setter: "setNotes", defaultValue: "undefined" },
  { key: "weirdDefault", setter: "setWeirdDefault", defaultValue: "42" },
];

describe("createInitialValuesFromRegistry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("parses each stringified registry default into its typed initial value", () => {
    const initial = createInitialValuesFromRegistry(REGISTRY);

    // WHY: registry defaults are authored as strings in config; the form must
    // hydrate empty intake fields with real JS types, not the literal text.
    expect(initial).toEqual({
      allergies: "",
      isSmoker: false,
      consentGiven: true,
      guardian: null,
      notes: undefined,
      weirdDefault: false, // unrecognized token falls back to false
    });
  });

  it("falls back to false for any default token it does not recognize", () => {
    const initial = createInitialValuesFromRegistry([
      { key: "x", setter: "setX", defaultValue: "somethingElse" },
    ]);
    // WHY: unknown defaults must coerce to a safe falsy value so the field
    // never starts the assessment in an unexpected truthy state.
    expect(initial.x).toBe(false);
  });

  it("returns an empty object for an empty registry", () => {
    expect(createInitialValuesFromRegistry([])).toEqual({});
  });
});

describe("useLegacyObjectForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes values from the registry defaults", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    expect(result.current.values).toEqual({
      allergies: "",
      isSmoker: false,
      consentGiven: true,
      guardian: null,
      notes: undefined,
      weirdDefault: false,
    });
  });

  it("updates a single field via setField with a direct value", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    act(() => {
      result.current.setField("allergies", "Penicillin");
    });

    expect(result.current.values.allergies).toBe("Penicillin");
    // WHY: setField must not clobber sibling fields in the consolidated object.
    expect(result.current.values.isSmoker).toBe(false);
  });

  it("supports functional updates in setField", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    act(() => {
      result.current.setField("isSmoker", (prev) => !prev);
    });

    // WHY: legacy JSX sometimes passes an updater fn (toggle); it must receive
    // the previous value and apply it.
    expect(result.current.values.isSmoker).toBe(true);
  });

  it("exposes flat legacy getters reflecting current values", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    expect(result.current.legacy.allergies).toBe("");
    expect(result.current.legacy.consentGiven).toBe(true);
  });

  it("exposes legacy setters that update the underlying object and getter", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    act(() => {
      result.current.legacy.setAllergies("Latex");
    });

    // WHY: incremental migration relies on the legacy flat setter writing
    // through to the consolidated values object.
    expect(result.current.values.allergies).toBe("Latex");
    expect(result.current.legacy.setAllergies).toBeTypeOf("function");
    expect(result.current.legacy.allergies).toBe("Latex");
  });

  it("replaces values via setValues", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    act(() => {
      result.current.setValues({ allergies: "None", isSmoker: true });
    });

    expect(result.current.values).toEqual({
      allergies: "None",
      isSmoker: true,
    });
  });

  it("loadFromApi maps API data when a mapFromApi mapper is provided", () => {
    const mapFromApi = vi.fn((apiData) => ({
      allergies: apiData.allergyText,
      isSmoker: apiData.smoker,
    }));
    const { result } = renderHook(() =>
      useLegacyObjectForm(REGISTRY, { mapFromApi }),
    );

    act(() => {
      result.current.loadFromApi({ allergyText: "Shellfish", smoker: true });
    });

    expect(mapFromApi).toHaveBeenCalledWith({
      allergyText: "Shellfish",
      smoker: true,
    });
    // WHY: hydrating from a saved assessment must overwrite state with mapped
    // server values.
    expect(result.current.values).toEqual({
      allergies: "Shellfish",
      isSmoker: true,
    });
  });

  it("loadFromApi is a no-op when no mapper is configured", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));
    const before = result.current.values;

    act(() => {
      result.current.loadFromApi({ anything: 1 });
    });

    // WHY: without a mapper there is no safe way to map server data, so state
    // must remain untouched rather than corrupt the form.
    expect(result.current.values).toEqual(before);
  });

  it("toSubmitSnapshot returns a shallow copy of current values", () => {
    const { result } = renderHook(() => useLegacyObjectForm(REGISTRY));

    act(() => {
      result.current.setField("allergies", "Iodine");
    });

    const snapshot = result.current.toSubmitSnapshot();

    expect(snapshot).toEqual({
      allergies: "Iodine",
      isSmoker: false,
      consentGiven: true,
      guardian: null,
      notes: undefined,
      weirdDefault: false,
    });
    // WHY: the snapshot must be a distinct object so the submit payload cannot
    // be mutated by later edits to live form state.
    expect(snapshot).not.toBe(result.current.values);
  });
});

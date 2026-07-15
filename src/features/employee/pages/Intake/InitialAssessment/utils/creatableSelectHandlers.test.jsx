/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSingleSelectCreatableHandlers,
  createMultiSelectEnterHandler,
  createMultiSelectChangeHandler,
  createSingleMultiChangeHandler,
} from "./creatableSelectHandlers";

// Pure handler factories for creatable react-select fields. We exercise the
// Enter-to-create branches, the dedupe-against-static-options guard, and the
// passthrough change handlers with representative + edge inputs.

const staticOptions = [
  { value: "Alcohol", label: "Alcohol" },
  { value: "Opioids", label: "Opioids" },
];

// Minimal fake event mimicking a react-select keydown event whose target is
// the text input. handleKey clears event.target.value, so it must be writable.
const makeEvent = (key, value) => ({ key, target: { value } });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createSingleSelectCreatableHandlers", () => {
  it("returns handleKey, handler, and the original options", () => {
    const setValue = vi.fn();
    const api = createSingleSelectCreatableHandlers(staticOptions, setValue);

    expect(typeof api.handleKey).toBe("function");
    expect(typeof api.handler).toBe("function");
    expect(api.options).toBe(staticOptions); // same reference passed through
  });

  it("creates a new {value,label} option on Enter when input is novel", () => {
    const setValue = vi.fn();
    const { handleKey } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );
    const event = makeEvent("Enter", "Cannabis");

    handleKey(event);

    expect(setValue).toHaveBeenCalledWith({
      value: "Cannabis",
      label: "Cannabis",
    });
    expect(event.target.value).toBe(""); // input cleared after handling
  });

  it("trims whitespace from the typed value before creating", () => {
    const setValue = vi.fn();
    const { handleKey } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );

    handleKey(makeEvent("Enter", "  Nicotine  "));

    expect(setValue).toHaveBeenCalledWith({
      value: "Nicotine",
      label: "Nicotine",
    });
  });

  it("does NOT create a duplicate when input matches an existing option", () => {
    const setValue = vi.fn();
    const { handleKey } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );
    const event = makeEvent("Enter", "Alcohol");

    handleKey(event);

    // optionExists guard prevents setValue, but input is still cleared.
    expect(setValue).not.toHaveBeenCalled();
    expect(event.target.value).toBe("");
  });

  it("ignores non-Enter keys", () => {
    const setValue = vi.fn();
    const { handleKey } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );
    const event = makeEvent("a", "Cannabis");

    handleKey(event);

    expect(setValue).not.toHaveBeenCalled();
    expect(event.target.value).toBe("Cannabis"); // untouched
  });

  it("ignores Enter when the input is empty", () => {
    const setValue = vi.fn();
    const { handleKey } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );

    handleKey(makeEvent("Enter", ""));

    expect(setValue).not.toHaveBeenCalled();
  });

  it("handler forwards the chosen option straight to setValue", () => {
    const setValue = vi.fn();
    const { handler } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );
    const chosen = { value: "Opioids", label: "Opioids" };

    handler(chosen);

    expect(setValue).toHaveBeenCalledWith(chosen);
  });

  it("handler forwards null (cleared selection) without throwing", () => {
    const setValue = vi.fn();
    const { handler } = createSingleSelectCreatableHandlers(
      staticOptions,
      setValue,
    );

    handler(null);

    expect(setValue).toHaveBeenCalledWith(null);
  });
});

describe("createMultiSelectEnterHandler", () => {
  it("appends a new custom option to the existing value array on Enter", () => {
    const setValue = vi.fn();
    const value = [{ value: "Alcohol", label: "Alcohol" }];
    const handler = createMultiSelectEnterHandler(
      staticOptions,
      value,
      setValue,
    );
    const event = makeEvent("Enter", "Cannabis");

    handler(event);

    expect(setValue).toHaveBeenCalledWith([
      { value: "Alcohol", label: "Alcohol" },
      { value: "Cannabis", label: "Cannabis" },
    ]);
    expect(event.target.value).toBe("");
  });

  it("treats a non-array current value as an empty list", () => {
    const setValue = vi.fn();
    // value is undefined -> Array.isArray guard falls back to []
    const handler = createMultiSelectEnterHandler(
      staticOptions,
      undefined,
      setValue,
    );

    handler(makeEvent("Enter", "Cannabis"));

    expect(setValue).toHaveBeenCalledWith([
      { value: "Cannabis", label: "Cannabis" },
    ]);
  });

  it("trims the typed value before appending", () => {
    const setValue = vi.fn();
    const handler = createMultiSelectEnterHandler(staticOptions, [], setValue);

    handler(makeEvent("Enter", "  Nicotine  "));

    expect(setValue).toHaveBeenCalledWith([
      { value: "Nicotine", label: "Nicotine" },
    ]);
  });

  it("does not append when the value already exists as a static option", () => {
    const setValue = vi.fn();
    const handler = createMultiSelectEnterHandler(staticOptions, [], setValue);
    const event = makeEvent("Enter", "Opioids");

    handler(event);

    expect(setValue).not.toHaveBeenCalled();
    expect(event.target.value).toBe(""); // still cleared
  });

  it("ignores non-Enter keys and leaves input untouched", () => {
    const setValue = vi.fn();
    const handler = createMultiSelectEnterHandler(staticOptions, [], setValue);
    const event = makeEvent("Tab", "Cannabis");

    handler(event);

    expect(setValue).not.toHaveBeenCalled();
    expect(event.target.value).toBe("Cannabis");
  });

  it("ignores Enter with an empty input", () => {
    const setValue = vi.fn();
    const handler = createMultiSelectEnterHandler(staticOptions, [], setValue);

    handler(makeEvent("Enter", ""));

    expect(setValue).not.toHaveBeenCalled();
  });
});

describe("createMultiSelectChangeHandler", () => {
  it("forwards the selected options array to setValue", () => {
    const setValue = vi.fn();
    const handler = createMultiSelectChangeHandler(setValue);
    const selected = [
      { value: "Alcohol", label: "Alcohol" },
      { value: "Opioids", label: "Opioids" },
    ];

    handler(selected);

    expect(setValue).toHaveBeenCalledWith(selected);
  });

  it("forwards an empty array when all selections are cleared", () => {
    const setValue = vi.fn();
    const handler = createMultiSelectChangeHandler(setValue);

    handler([]);

    expect(setValue).toHaveBeenCalledWith([]);
  });
});

describe("createSingleMultiChangeHandler", () => {
  it("forwards the single selected option to setValue", () => {
    const setValue = vi.fn();
    const handler = createSingleMultiChangeHandler(setValue);
    const option = { value: "Detox", label: "Detox" };

    handler(option);

    expect(setValue).toHaveBeenCalledWith(option);
  });

  it("forwards null when the selection is cleared", () => {
    const setValue = vi.fn();
    const handler = createSingleMultiChangeHandler(setValue);

    handler(null);

    expect(setValue).toHaveBeenCalledWith(null);
  });
});

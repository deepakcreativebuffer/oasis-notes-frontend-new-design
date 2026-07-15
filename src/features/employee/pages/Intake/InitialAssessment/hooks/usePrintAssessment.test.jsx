/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { usePrintAssessment } from "./usePrintAssessment";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { PRINT_PAGE_STYLE } from "../utils/constants";

// WHY: the hook bridges to react-to-print via useReactToPrintWithContent; mock it
// so we never touch the real print pipeline and can capture the options object
// (content/documentTitle/pageStyle) the hook wires up.
const hoisted = vi.hoisted(() => ({
  triggerPrint: vi.fn(),
  capturedOptions: { value: null },
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: (options) => {
    hoisted.capturedOptions.value = options;
    return hoisted.triggerPrint;
  },
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => "PRINTABLE_CONTENT"),
  printDocumentTitleExceptFirstPage: vi.fn(() => "DOC_TITLE"),
}));

vi.mock("../utils/constants", () => ({
  PRINT_PAGE_STYLE: "@page { size: A4; }",
}));

const makeArgs = (overrides = {}) => {
  const node = document.createElement("div");
  node.textContent = "assessment body";
  return {
    componentRef: { current: node },
    patient: {
      _id: "res-test-001",
      firstName: "Test",
      lastName: "Patient",
      userType: "Patient",
    },
    profile: { _id: "emp-test-001", firstName: "Test", lastName: "Employee" },
    ...overrides,
  };
};

describe("usePrintAssessment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hoisted.capturedOptions.value = null;
  });

  it("returns handlePrint and handlePrintClick callables", () => {
    const { result } = renderHook(() => usePrintAssessment(makeArgs()));
    // WHY: both are the documented surface employee + resident screens call.
    expect(typeof result.current.handlePrint).toBe("function");
    expect(typeof result.current.handlePrintClick).toBe("function");
  });

  it("wires the page style and document title into the print options", () => {
    const args = makeArgs();
    renderHook(() => usePrintAssessment(args));

    const opts = hoisted.capturedOptions.value;
    expect(opts.pageStyle).toBe(PRINT_PAGE_STYLE);
    expect(opts.documentTitle).toBe("DOC_TITLE");
    // WHY: title generator is fed the patient for both args (header line shown
    // on every page except the first).
    expect(printDocumentTitleExceptFirstPage).toHaveBeenCalledWith(
      args.patient,
      args.patient,
    );
  });

  it("builds print content from a CLONE of the live node plus patient + profile", () => {
    const args = makeArgs();
    renderHook(() => usePrintAssessment(args));

    // WHY: content is lazily resolved by react-to-print; invoking it should clone
    // the current DOM (not mutate the on-screen node) and pass patient + profile.
    const produced = hoisted.capturedOptions.value.content();
    expect(produced).toBe("PRINTABLE_CONTENT");
    expect(printDocumentContent).toHaveBeenCalledTimes(1);

    const [clonedNode, patientArg, profileArg] =
      printDocumentContent.mock.calls[0];
    expect(clonedNode).not.toBe(args.componentRef.current); // a clone, not the original
    expect(clonedNode.textContent).toBe("assessment body");
    expect(patientArg).toBe(args.patient);
    expect(profileArg).toBe(args.profile);
  });

  it("handlePrint delegates to the underlying react-to-print trigger", () => {
    const { result } = renderHook(() => usePrintAssessment(makeArgs()));
    act(() => {
      result.current.handlePrint();
    });
    expect(hoisted.triggerPrint).toHaveBeenCalledTimes(1);
  });

  it("handlePrintClick prevents default then prints", () => {
    const { result } = renderHook(() => usePrintAssessment(makeArgs()));
    const preventDefault = vi.fn();
    act(() => {
      result.current.handlePrintClick({ preventDefault });
    });
    // WHY: the click handler is bound to an anchor/button; default nav/submit must
    // be suppressed before the print dialog opens.
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(hoisted.triggerPrint).toHaveBeenCalledTimes(1);
  });

  it("handlePrintClick tolerates being called without an event", () => {
    const { result } = renderHook(() => usePrintAssessment(makeArgs()));
    // WHY: optional-chaining on e guards programmatic invocations (no event arg).
    act(() => {
      result.current.handlePrintClick();
    });
    expect(hoisted.triggerPrint).toHaveBeenCalledTimes(1);
  });
});

/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useViewResidentIntakesPrint } from "./useViewResidentIntakesPrint";
import { useReactToPrintWithContent } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";

// ---------------------------------------------------------------------------
// Mock the print IO layer. The real hook wires react-to-print, DOM cloning and
// a Ctrl+P shortcut — none of which jsdom can drive. We replace each dependency
// with a light spy so we can assert orchestration without real printing.
// ---------------------------------------------------------------------------

// Each call to useReactToPrintWithContent (11 times in the hook) returns a
// fresh spy. We record them in order so tests can map a handler -> its print fn.
const printSpies = [];
vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: vi.fn((opts) => {
    const fn = vi.fn();
    fn._opts = opts; // keep options so we can exercise content()/onAfterPrint
    printSpies.push(fn);
    return fn;
  }),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "Resident Name: Test Patient"),
}));

// usePrint normally registers window keydown/afterprint listeners + intervals.
// Return the triggerPrintAll passthrough so the public `print` is callable.
vi.mock("@shared/hooks", () => ({
  usePrint: vi.fn((_ref, triggerPrintAll) => triggerPrintAll),
}));

const baseProps = () => ({
  getApiData: { data: { patientId: "res-test-001" } },
  patientDetail: { residentFullName: "Test Patient", userType: "Patient" },
  setPrintAllMode: vi.fn(),
});

const renderPrintHook = (props = baseProps()) =>
  renderHook(() => useViewResidentIntakesPrint(props));

describe("useViewResidentIntakesPrint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    printSpies.length = 0;
    vi.useFakeTimers();
  });

  it("should expose all 9 component refs plus the two extra section refs", () => {
    const { result } = renderPrintHook();
    // WHY: the View*Intakes form binds one ref per printable intake section;
    // a missing ref would break that section's print button entirely.
    [
      "componentRef1",
      "componentRef2",
      "componentRef3",
      "componentRef4",
      "componentRef5",
      "componentRef6",
      "componentRef7",
      "componentRef8",
      "componentRef9",
      "componentRefNew3",
      "componentRefNew8",
      "printRef",
    ].forEach((key) => {
      expect(result.current).toHaveProperty(key);
      expect(result.current[key]).toHaveProperty("current");
    });
  });

  it("should expose every per-section print handler as a function", () => {
    const { result } = renderPrintHook();
    [
      "handlePrintUpdate1",
      "handlePrintUpdate2",
      "handlePrintUpdate3",
      "handlePrintUpdate4",
      "handlePrintUpdate5",
      "handlePrintUpdate6",
      "handlePrintUpdate7",
      "handlePrintUpdate8",
      "handlePrintUpdate9",
      "handlePrintNew3",
      "handlePrintNew8",
      "handlePrintAll",
      "triggerPrintAll",
      "print",
    ].forEach((key) => {
      expect(typeof result.current[key]).toBe("function");
    });
  });

  it("should build one react-to-print handler per printable section (12 total)", () => {
    renderPrintHook();
    // WHY: 9 numbered sections + 2 "new" sections + the print-all handler = 12
    // useReactToPrintWithContent invocations; the count guards against an
    // accidentally dropped section losing its print wiring.
    expect(useReactToPrintWithContent).toHaveBeenCalledTimes(12);
    expect(printSpies).toHaveLength(12);
  });

  it("should fire the underlying print fn when a section handler runs", () => {
    const { result } = renderPrintHook();
    // componentRef1 must point at a real node so handlePrintUpdate1's DOM tweaks
    // don't throw; the section handlers read document.getElementsByClassName.
    result.current.componentRef1.current = document.createElement("div");

    act(() => {
      result.current.handlePrintUpdate1();
    });
    // WHY: handlePrintUpdate1 hides/show print-only chrome then calls the
    // section-1 print fn (the first spy created during render).
    expect(printSpies[0]).toHaveBeenCalledTimes(1);

    // Advance the restore timer; should not throw.
    act(() => {
      vi.runOnlyPendingTimers();
    });
  });

  it("should delegate handlePrintUpdate9 straight to its print fn", () => {
    const { result } = renderPrintHook();
    act(() => {
      result.current.handlePrintUpdate9();
    });
    // handlePrintUpdate9 is a thin passthrough to handlePrint9. In creation
    // order the section fns are: 1,2,New3,New8,3,4,5,6,7,8,9 -> handlePrint9 is
    // the 11th registration (index 10).
    expect(printSpies[10]).toHaveBeenCalledTimes(1);
  });

  it("should enable print-all mode then fire the combined print after a delay", () => {
    const props = baseProps();
    const { result } = renderPrintHook(props);

    act(() => {
      result.current.triggerPrintAll();
    });
    // WHY: print-all must first flip printAllMode ON so every conditional page
    // renders into the DOM before the single combined print fires.
    expect(props.setPrintAllMode).toHaveBeenCalledWith(true);

    // The combined print (the LAST spy, index 11) is deferred via setTimeout.
    expect(printSpies[11]).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(printSpies[11]).toHaveBeenCalledTimes(1);
  });

  it("should flip print-all mode back off after the combined print completes", () => {
    const props = baseProps();
    renderPrintHook(props);
    // The print-all handler is the last react-to-print registration; its
    // onAfterPrint resets printAllMode so the page collapses back to single view.
    const printAllOpts = printSpies[11]._opts;
    act(() => {
      printAllOpts.onAfterPrint();
    });
    expect(props.setPrintAllMode).toHaveBeenCalledWith(false);
  });

  it("should resolve print content + document title from getApiData.data.patientId", () => {
    const { result } = renderPrintHook();
    result.current.componentRef1.current = document.createElement("div");

    // Exercise section 1's content resolver (passed into react-to-print).
    act(() => {
      printSpies[0]._opts.content();
    });
    // WHY: the printed header/footer is keyed to the resident's patientId so the
    // correct logo + "Resident Name" title render on every page.
    expect(printDocumentContent).toHaveBeenCalledWith(
      expect.anything(),
      "res-test-001",
      expect.objectContaining({ residentFullName: "Test Patient" }),
    );
    expect(printDocumentTitleExceptFirstPage).toHaveBeenCalled();
  });

  it("should fall back to getApiData.patientId when data.patientId is absent", () => {
    const props = {
      ...baseProps(),
      getApiData: { patientId: "res-test-002" },
    };
    const { result } = renderPrintHook(props);
    result.current.componentRef2.current = document.createElement("div");

    act(() => {
      printSpies[1]._opts.content();
    });
    // WHY: some callers pass the flat shape (no nested .data); the resolver must
    // still locate the patientId so the print header isn't blank.
    expect(printDocumentContent).toHaveBeenCalledWith(
      expect.anything(),
      "res-test-002",
      expect.anything(),
    );
  });

  it("should render without crashing when print props are missing/empty", () => {
    // WHY: the View component mounts before its query resolves, so the hook must
    // tolerate undefined getApiData/patientDetail without throwing.
    const { result } = renderHook(() =>
      useViewResidentIntakesPrint({
        getApiData: undefined,
        patientDetail: undefined,
        setPrintAllMode: vi.fn(),
      }),
    );
    expect(typeof result.current.handlePrintUpdate1).toBe("function");
    result.current.componentRef1.current = document.createElement("div");
    act(() => {
      printSpies[0]._opts.content();
    });
    // patientId resolves to undefined but the call must still succeed.
    expect(printDocumentContent).toHaveBeenCalledWith(
      expect.anything(),
      undefined,
      undefined,
    );
  });
});

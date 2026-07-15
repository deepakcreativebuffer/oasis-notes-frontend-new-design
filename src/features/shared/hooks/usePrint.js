/** @format */

import { useEffect, useRef, useCallback } from "react";

/**
 * Shared print shortcut (Ctrl+P) + focus helper for print targets.
 * Used across Admin, Employee, Resident, and Guardian panels.
 */
export const usePrint = (printRef, handlePrint2) => {
  const intervalRef = useRef(null);

  const triggerPrint = useCallback(() => {
    if (handlePrint2) handlePrint2();

    if (intervalRef?.current) clearInterval(intervalRef?.current);

    intervalRef.current = setInterval(() => {
      if (printRef?.current) {
        printRef?.current?.focus();
      }
    }, 1000);
  }, [handlePrint2, printRef]);

  useEffect(() => {
    const handlePrintShortcut = (event) => {
      if (
        event.ctrlKey &&
        event.key === "p" &&
        handlePrint2 &&
        printRef &&
        printRef?.current
      ) {
        event.preventDefault();
        triggerPrint();
      }
    };

    const stopPrintProcess = () => {
      if (intervalRef?.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      restorePrintShortcut();
    };

    const restorePrintShortcut = () => {
      window.addEventListener("keydown", handlePrintShortcut, { once: true });
    };

    window.addEventListener("keydown", handlePrintShortcut);
    window.addEventListener("afterprint", stopPrintProcess);
    window.addEventListener("focus", stopPrintProcess);

    return () => {
      window.removeEventListener("keydown", handlePrintShortcut);
      window.removeEventListener("afterprint", stopPrintProcess);
      window.removeEventListener("focus", stopPrintProcess);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [triggerPrint, handlePrint2, printRef]);

  return triggerPrint;
};

export default usePrint;

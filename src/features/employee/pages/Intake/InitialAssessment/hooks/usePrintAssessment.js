/** @format */

import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { PRINT_PAGE_STYLE } from "../utils/constants";

/**
 * Shared print setup for Initial Assessment (employee + resident).
 */
export function usePrintAssessment({ componentRef, patient, profile }) {
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        patient,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(patient, patient),
    pageStyle: PRINT_PAGE_STYLE,
  });

  const handlePrintClick = (e) => {
    e?.preventDefault();
    handlePrint();
  };

  return { handlePrint, handlePrintClick };
}

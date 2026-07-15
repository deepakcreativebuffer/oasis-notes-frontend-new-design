import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";

/**
 * Bridges react-to-print v2 `content: () => element` usage to v3 `contentRef`.
 */
export function useReactToPrintWithContent({ content, ...printOptions }) {
  const domRef = useRef(null);
  const contentFnRef = useRef(content);
  contentFnRef.current = content;

  const print = useReactToPrint({
    ...printOptions,
    contentRef: domRef,
  });

  return useCallback(() => {
    const resolveContent = contentFnRef.current;
    if (typeof resolveContent !== "function") {
      return;
    }
    const printable = resolveContent();
    if (!printable) {
      return;
    }
    domRef.current = printable;
    print();
  }, [print]);
}

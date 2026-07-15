/** @format */

import { useCallback, useMemo, useState } from "react";
import {
  createDefaultDiagnosisSlots,
  diagnosisSlotsToLegacyFlat,
  loadDiagnosisSlotsFromApi,
} from "../utils/diagnosisState";

/**
 * Dynamic ICD/diagnosis slots (Primary, Secondary, Tertiary, Additional) + extra rows.
 */
export function useDiagnosisSlots(slotConfig, { extraArrayKey }) {
  const [fixedSlots, setFixedSlots] = useState(() =>
    createDefaultDiagnosisSlots(slotConfig),
  );
  const [extraRows, setExtraRows] = useState([]);

  const loadFromApi = useCallback(
    (apiArray) => {
      const { fixed, extras } = loadDiagnosisSlotsFromApi(slotConfig, apiArray);
      setFixedSlots(fixed);
      setExtraRows(extras);
    },
    [slotConfig],
  );

  const updateSlot = useCallback((index, field, value) => {
    setFixedSlots((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const removeExtraRow = useCallback((index) => {
    setExtraRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const legacy = useMemo(() => {
    const flat = diagnosisSlotsToLegacyFlat(slotConfig, fixedSlots);
    const bindings = { ...flat };

    slotConfig.forEach((slot, index) => {
      bindings[slot.setIcdCodeKey] = (value) =>
        updateSlot(
          index,
          "icdCode",
          typeof value === "function"
            ? value(fixedSlots[index]?.icdCode)
            : value,
        );
      bindings[slot.setDescriptionKey] = (value) =>
        updateSlot(
          index,
          "description",
          typeof value === "function"
            ? value(fixedSlots[index]?.description)
            : value,
        );
    });

    bindings[extraArrayKey] = extraRows;
    return bindings;
  }, [slotConfig, fixedSlots, extraRows, updateSlot, extraArrayKey]);

  const toSubmitSnapshot = useCallback(
    () => ({
      ...diagnosisSlotsToLegacyFlat(slotConfig, fixedSlots),
      [extraArrayKey]: extraRows,
    }),
    [slotConfig, fixedSlots, extraRows, extraArrayKey],
  );

  return {
    fixedSlots,
    extraRows,
    setExtraRows,
    legacy,
    loadFromApi,
    updateSlot,
    removeExtraRow,
    toSubmitSnapshot,
  };
}

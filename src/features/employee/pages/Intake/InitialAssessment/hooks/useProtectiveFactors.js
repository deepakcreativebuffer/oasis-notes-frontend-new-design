/** @format */

import { useCallback, useMemo, useState } from "react";
import { PROTECTIVE_FACTORS_FIXED_ROWS } from "../config/dynamicFormGroups";
import {
  buildYesNoRowsLegacyBindings,
  createDefaultYesNoRows,
  EMPTY_YES_NO_ROW_DRAFT,
  loadYesNoRowsFromApi,
  yesNoRowsToLegacyFlat,
} from "../utils/dynamicFormState";

export function useProtectiveFactors() {
  const [fixedRows, setFixedRows] = useState(() =>
    createDefaultYesNoRows(PROTECTIVE_FACTORS_FIXED_ROWS),
  );
  const [extraRows, setExtraRows] = useState([]);
  const [otherDraft, setOtherDraft] = useState(EMPTY_YES_NO_ROW_DRAFT);

  const loadFromApi = useCallback((apiArray) => {
    const { fixed, extras } = loadYesNoRowsFromApi(
      PROTECTIVE_FACTORS_FIXED_ROWS,
      6,
      apiArray,
    );
    setFixedRows(fixed);
    setExtraRows(extras);
  }, []);

  const updateFixedRow = useCallback((index, field, value) => {
    setFixedRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const updateOtherDraft = useCallback((field, value) => {
    setOtherDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  const appendOtherDraft = useCallback(() => {
    const { type, yesNo, comment } = otherDraft;
    if (type && (yesNo === true || yesNo === false || comment)) {
      setExtraRows((prev) => [...prev, { type, yesNo, comment }]);
      setOtherDraft(EMPTY_YES_NO_ROW_DRAFT);
    }
  }, [otherDraft]);

  const removeExtraRow = useCallback((index) => {
    setExtraRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toSubmitSnapshot = useCallback(
    () => ({
      ...yesNoRowsToLegacyFlat(PROTECTIVE_FACTORS_FIXED_ROWS, fixedRows),
      protectiveFactorsArray: extraRows,
    }),
    [fixedRows, extraRows],
  );

  const legacy = useMemo(
    () =>
      buildYesNoRowsLegacyBindings(
        PROTECTIVE_FACTORS_FIXED_ROWS,
        fixedRows,
        extraRows,
        updateFixedRow,
        "protectiveFactorsArray",
      ),
    [fixedRows, extraRows, updateFixedRow],
  );

  return {
    fixedRows,
    extraRows,
    otherDraft,
    legacy,
    loadFromApi,
    updateFixedRow,
    updateOtherDraft,
    appendOtherDraft,
    removeExtraRow,
    toSubmitSnapshot,
  };
}

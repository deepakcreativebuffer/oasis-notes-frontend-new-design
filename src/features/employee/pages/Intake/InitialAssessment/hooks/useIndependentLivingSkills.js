/** @format */

import { useCallback, useState } from "react";
import {
  buildIndependentLivingLegacyBindings,
  createDefaultIndependentLivingSkills,
  EMPTY_OTHER_LIVING_SKILL_DRAFT,
  independentLivingSkillsToLegacyFlat,
  loadIndependentLivingSkillsFromApi,
} from "../utils/dynamicFormState";

/**
 * Dynamic state for independentLivingSkills — mirrors backend array shape.
 * Bridges to legacy flat field names on submit for payloadMapper compatibility.
 */
export function useIndependentLivingSkills() {
  const [fixedRows, setFixedRows] = useState(
    createDefaultIndependentLivingSkills,
  );
  const [extraRows, setExtraRows] = useState([]);
  const [otherDraft, setOtherDraft] = useState(EMPTY_OTHER_LIVING_SKILL_DRAFT);
  const [showTakingMedications, setShowTakingMedications] = useState(true);

  const loadFromApi = useCallback((apiArray) => {
    const { fixed, extras } = loadIndependentLivingSkillsFromApi(apiArray);
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
    const { type, good, fair, otherCurrentNotSoGood, needAssist, comments } =
      otherDraft;
    if (
      type &&
      (good || fair || otherCurrentNotSoGood || needAssist || comments)
    ) {
      setExtraRows((prev) => [
        ...prev,
        {
          type,
          good,
          fair,
          otherCurrentNotSoGood,
          needAssist,
          comments,
        },
      ]);
      setOtherDraft(EMPTY_OTHER_LIVING_SKILL_DRAFT);
    }
  }, [otherDraft]);

  const removeExtraRow = useCallback((index) => {
    setExtraRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toSubmitSnapshot = useCallback(
    () => ({
      ...independentLivingSkillsToLegacyFlat(fixedRows),
      handleRiskFactorActivityArray: extraRows,
      Independent10: showTakingMedications,
    }),
    [fixedRows, extraRows, showTakingMedications],
  );

  const legacy = buildIndependentLivingLegacyBindings(
    fixedRows,
    extraRows,
    updateFixedRow,
  );

  return {
    fixedRows,
    extraRows,
    otherDraft,
    showTakingMedications,
    setShowTakingMedications,
    legacy,
    loadFromApi,
    updateFixedRow,
    updateOtherDraft,
    appendOtherDraft,
    removeExtraRow,
    toSubmitSnapshot,
  };
}

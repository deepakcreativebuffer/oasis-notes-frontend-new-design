/** @format */

import { useCallback, useMemo, useState } from "react";
import { MEDICAL_CONDITIONS_FIXED_ROWS } from "../config/medicalConditionsConfig";
import {
  createDefaultMedicalConditions,
  loadMedicalConditionsFromApi,
  medicalConditionsToLegacyFlat,
} from "../utils/medicalConditionsState";

export const EMPTY_OTHER_CONDITION_DRAFT = {
  condition: "",
  yes: undefined,
  comments: "",
};

export function useMedicalConditions() {
  const [fixedRows, setFixedRows] = useState(createDefaultMedicalConditions);
  const [extraRows, setExtraRows] = useState([]);
  const [otherDraft, setOtherDraft] = useState(EMPTY_OTHER_CONDITION_DRAFT);

  const updateFixedRow = useCallback((index, field, value) => {
    setFixedRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const loadFromApi = useCallback((apiArray) => {
    const { fixed, extras } = loadMedicalConditionsFromApi(apiArray);
    setFixedRows(fixed);
    setExtraRows(extras);
  }, []);

  const appendOtherDraft = useCallback(() => {
    const { condition, yes, comments } = otherDraft;
    if (condition && (yes === true || yes === false || comments)) {
      setExtraRows((prev) => [...prev, { condition, yes, comments }]);
      setOtherDraft(EMPTY_OTHER_CONDITION_DRAFT);
    }
  }, [otherDraft]);

  const removeExtraRow = useCallback((index) => {
    setExtraRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const legacy = useMemo(() => {
    const flat = medicalConditionsToLegacyFlat(fixedRows);
    const bindings = { ...flat };

    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((config, index) => {
      if (config.setters.yesNo) {
        bindings[config.setters.yesNo] = (value) =>
          updateFixedRow(
            index,
            "yes",
            typeof value === "function" ? value(fixedRows[index]?.yes) : value,
          );
      }
      if (config.fieldType === "multiselect" && config.setters.comments) {
        bindings[config.setters.comments] = (value) =>
          updateFixedRow(
            index,
            "comment",
            typeof value === "function"
              ? value(fixedRows[index]?.comment)
              : value,
          );
      } else if (config.setters.comment) {
        bindings[config.setters.comment] = (value) =>
          updateFixedRow(
            index,
            "comment",
            typeof value === "function"
              ? value(fixedRows[index]?.comment)
              : value,
          );
      }
    });

    bindings.otherConditionArray = extraRows;
    bindings.OtherConditionOther = otherDraft.condition;
    bindings.otherConditionYesNO = otherDraft.yes;
    bindings.otherConditionDiscription = otherDraft.comments;
    bindings.setOtherConditionOther = (value) =>
      setOtherDraft((prev) => ({
        ...prev,
        condition: typeof value === "function" ? value(prev.condition) : value,
      }));
    bindings.setOtherConditionYesNo = (value) =>
      setOtherDraft((prev) => ({
        ...prev,
        yes: typeof value === "function" ? value(prev.yes) : value,
      }));
    bindings.setOtherConditionDiscription = (value) =>
      setOtherDraft((prev) => ({
        ...prev,
        comments: typeof value === "function" ? value(prev.comments) : value,
      }));

    return bindings;
  }, [fixedRows, extraRows, otherDraft, updateFixedRow]);

  const toSubmitSnapshot = useCallback(
    () => ({
      ...medicalConditionsToLegacyFlat(fixedRows),
      otherConditionArray: extraRows,
    }),
    [fixedRows, extraRows],
  );

  return {
    fixedRows,
    extraRows,
    otherDraft,
    legacy,
    loadFromApi,
    updateFixedRow,
    appendOtherDraft,
    removeExtraRow,
    toSubmitSnapshot,
  };
}

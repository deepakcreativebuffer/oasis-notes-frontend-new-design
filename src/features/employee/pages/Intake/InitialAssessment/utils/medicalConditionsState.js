/** @format */

import { MEDICAL_CONDITIONS_FIXED_ROWS } from "../config/medicalConditionsConfig";
import { getApiArrayData } from "./helpers";

function createDefaultRow(config) {
  const row = { condition: config.condition, yes: undefined };
  if (config.fieldType === "multiselect") {
    row.comment = [];
  } else {
    row.comment = "";
  }
  return row;
}

export function createDefaultMedicalConditions() {
  return MEDICAL_CONDITIONS_FIXED_ROWS.map(createDefaultRow);
}

function mapApiCommentField(apiRow, isMultiselect) {
  if (isMultiselect) {
    const raw = apiRow?.comment ?? apiRow?.comments;
    return Array.isArray(raw)
      ? raw.map((item) => ({ label: item, value: item }))
      : [];
  }
  const rawText = apiRow?.comments ?? apiRow?.comment;
  return Array.isArray(rawText) ? rawText.join(", ") || "" : (rawText ?? "");
}

export function loadMedicalConditionsFromApi(apiArray) {
  const fixed = MEDICAL_CONDITIONS_FIXED_ROWS.map((config) => {
    // Match by condition name instead of index to handle added/removed rows gracefully
    const apiRow = apiArray?.find(
      (r) => r?.condition?.toLowerCase() === config.condition.toLowerCase(),
    );
    return {
      condition: config.condition,
      yes: apiRow?.yes,
      comment: mapApiCommentField(apiRow, config.fieldType === "multiselect"),
    };
  });

  // Extract remaining items as extras
  const fixedConditionNames = MEDICAL_CONDITIONS_FIXED_ROWS.map((c) =>
    c.condition.toLowerCase(),
  );
  const extras = (
    apiArray?.filter(
      (row) =>
        row?.condition &&
        !fixedConditionNames.includes(row.condition.toLowerCase()) &&
        row.condition.toLowerCase() !== "injury",
    ) || []
  ).map((row) => {
    const rawText = row?.comments ?? row?.comment;
    return {
      condition: row.condition,
      yes: row.yes,
      comments: Array.isArray(rawText)
        ? rawText.join(", ") || ""
        : (rawText ?? ""),
    };
  });

  return { fixed, extras };
}

/** Maps dynamic rows to legacy flat names for payloadMapper / section props. */
export function medicalConditionsToLegacyFlat(fixedRows) {
  const flat = {};
  MEDICAL_CONDITIONS_FIXED_ROWS.forEach((config, index) => {
    const row = fixedRows[index] || {};
    if (config.legacyKeys.yesNo) {
      flat[config.legacyKeys.yesNo] = row.yes;
    }
    if (config.fieldType === "multiselect" && config.legacyKeys.comments) {
      flat[config.legacyKeys.comments] = row.comment ?? [];
    } else if (config.legacyKeys.comment) {
      flat[config.legacyKeys.comment] = row.comment ?? "";
    }
  });
  return flat;
}

export function isMedicalConditionsTableHidden(fixedRows, otherConditionLabel) {
  const allEmpty = fixedRows.every((row) => row?.yes === undefined);
  return allEmpty && !otherConditionLabel;
}

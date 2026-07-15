/** @format */

import { INDEPENDENT_LIVING_SKILLS_FIXED_ROWS } from "../config/dynamicFormGroups";
import { getApiArrayData } from "./helpers";

export function createEmptyIndependentLivingRow(type) {
  return {
    type,
    good: false,
    fair: false,
    otherCurrentNotSoGood: false,
    needAssist: false,
    comments: "",
  };
}

export function createDefaultIndependentLivingSkills() {
  return INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map(({ type }) =>
    createEmptyIndependentLivingRow(type),
  );
}

export function mapApiRowToIndependentLivingRow(type, apiRow) {
  if (!apiRow) {
    return createEmptyIndependentLivingRow(type);
  }
  return {
    type,
    good: apiRow.good,
    fair: apiRow.fair,
    otherCurrentNotSoGood: apiRow.otherCurrentNotSoGood,
    needAssist: apiRow.needAssist,
    comments: apiRow.comments ?? "",
  };
}

export function loadIndependentLivingSkillsFromApi(apiArray) {
  const fixed = INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.map(({ type }, index) =>
    mapApiRowToIndependentLivingRow(type, apiArray?.[index]),
  );
  const extras = apiArray ? getApiArrayData(10, apiArray.length, apiArray) : [];
  return { fixed, extras };
}

/** Maps dynamic array state to legacy flat names expected by payloadMapper. */
export function independentLivingSkillsToLegacyFlat(fixedRows) {
  const flat = {};
  INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.forEach(({ legacyPrefix }, index) => {
    const row = fixedRows[index] || {};
    flat[`${legacyPrefix}Good`] = row.good;
    flat[`${legacyPrefix}Fair`] = row.fair;
    flat[`${legacyPrefix}NotSoGood`] = row.otherCurrentNotSoGood;
    flat[`${legacyPrefix}GoodNeedAssist`] = row.needAssist;
    flat[`${legacyPrefix}Comments`] = row.comments;
  });
  return flat;
}

function resolveUpdaterValue(value, current) {
  return typeof value === "function" ? value(current) : value;
}

/** Legacy flat values + setters for view forms and payloadMapper. */
export function buildIndependentLivingLegacyBindings(
  fixedRows,
  extraRows,
  updateFixedRow,
) {
  const bindings = {
    ...independentLivingSkillsToLegacyFlat(fixedRows),
    handleRiskFactorActivityArray: extraRows,
  };

  INDEPENDENT_LIVING_SKILLS_FIXED_ROWS.forEach(({ legacyPrefix }, index) => {
    bindings[`set${legacyPrefix}Good`] = (value) =>
      updateFixedRow(
        index,
        "good",
        resolveUpdaterValue(value, fixedRows[index]?.good),
      );
    bindings[`set${legacyPrefix}Fair`] = (value) =>
      updateFixedRow(
        index,
        "fair",
        resolveUpdaterValue(value, fixedRows[index]?.fair),
      );
    bindings[`set${legacyPrefix}NotSoGood`] = (value) =>
      updateFixedRow(
        index,
        "otherCurrentNotSoGood",
        resolveUpdaterValue(value, fixedRows[index]?.otherCurrentNotSoGood),
      );
    bindings[`set${legacyPrefix}GoodNeedAssist`] = (value) =>
      updateFixedRow(
        index,
        "needAssist",
        resolveUpdaterValue(value, fixedRows[index]?.needAssist),
      );
    bindings[`set${legacyPrefix}Comments`] = (value) =>
      updateFixedRow(
        index,
        "comments",
        resolveUpdaterValue(value, fixedRows[index]?.comments),
      );
  });

  return bindings;
}

export function isIndependentLivingRowEmptyForPrint(row) {
  return (
    row?.good === undefined &&
    row?.fair === undefined &&
    row?.otherCurrentNotSoGood === undefined
  );
}

/** Mirrors legacy print-hide logic for the independent living skills table. */
export function isIndependentLivingSectionHiddenForPrint(
  fixedRows,
  otherDraftType,
  showTakingMedications,
) {
  const rowsToCheck = showTakingMedications
    ? fixedRows.slice(0, 9)
    : fixedRows.slice(0, 9);
  const allCoreRowsEmpty = rowsToCheck.every(
    isIndependentLivingRowEmptyForPrint,
  );
  return allCoreRowsEmpty && !otherDraftType;
}

export const EMPTY_OTHER_LIVING_SKILL_DRAFT = {
  type: "",
  good: false,
  fair: false,
  otherCurrentNotSoGood: false,
  needAssist: false,
  comments: "",
};

export const EMPTY_YES_NO_ROW_DRAFT = {
  type: "",
  yesNo: undefined,
  comment: "",
};

function createDefaultYesNoRow(config) {
  const row = { type: config.type, yesNo: null };
  if (config.legacyKeys.comments) {
    row.comments = [];
  } else {
    row.comment = "";
  }
  return row;
}

export function createDefaultYesNoRows(fixedConfig) {
  return fixedConfig.map(createDefaultYesNoRow);
}

export function loadYesNoRowsFromApi(fixedConfig, fixedCount, apiArray) {
  const fixed = fixedConfig.map((config, index) => {
    const apiRow = apiArray?.[index];
    const row = { type: config.type, yesNo: apiRow?.yesNo ?? null };
    if (config.legacyKeys.comments) {
      row.comments =
        apiRow?.comments?.map((item) => ({ label: item, value: item })) ?? [];
    } else {
      row.comment = apiRow?.comment ?? "";
    }
    return row;
  });
  const extras = apiArray
    ? getApiArrayData(fixedCount, apiArray.length, apiArray)
    : [];
  return { fixed, extras };
}

export function yesNoRowsToLegacyFlat(fixedConfig, fixedRows) {
  const flat = {};
  fixedConfig.forEach((config, index) => {
    const row = fixedRows[index] || {};
    if (config.legacyKeys.yesNo) {
      flat[config.legacyKeys.yesNo] = row.yesNo;
    }
    if (config.legacyKeys.comment) {
      flat[config.legacyKeys.comment] = row.comment ?? "";
    }
    if (config.legacyKeys.comments) {
      flat[config.legacyKeys.comments] = row.comments ?? [];
    }
  });
  return flat;
}

/** Legacy flat values + setters for risk/protective factor view forms. */
export function buildYesNoRowsLegacyBindings(
  fixedConfig,
  fixedRows,
  extraRows,
  updateFixedRow,
  extraArrayKey,
) {
  const bindings = {
    ...yesNoRowsToLegacyFlat(fixedConfig, fixedRows),
    [extraArrayKey]: extraRows,
  };

  fixedConfig.forEach((config, index) => {
    if (config.setters?.yesNo) {
      bindings[config.setters.yesNo] = (value) =>
        updateFixedRow(
          index,
          "yesNo",
          resolveUpdaterValue(value, fixedRows[index]?.yesNo),
        );
    }
    if (config.setters?.comment) {
      bindings[config.setters.comment] = (value) =>
        updateFixedRow(
          index,
          "comment",
          resolveUpdaterValue(value, fixedRows[index]?.comment),
        );
    }
    if (config.setters?.comments) {
      bindings[config.setters.comments] = (value) =>
        updateFixedRow(
          index,
          "comments",
          resolveUpdaterValue(value, fixedRows[index]?.comments),
        );
    }
  });

  return bindings;
}

export function isYesNoRowHiddenForPrint(row) {
  return row?.yesNo === undefined;
}

export function isYesNoSectionHiddenForPrint(fixedRows, otherDraftYesNo) {
  return (
    fixedRows.every(isYesNoRowHiddenForPrint) && otherDraftYesNo === undefined
  );
}

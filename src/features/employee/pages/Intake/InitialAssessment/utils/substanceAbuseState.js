/** @format */

import { SUBSTANCE_ABUSE_FIXED_ROWS } from "../config/substanceAbuseConfig";
function toSelectOption(value) {
  if (!value) {
    return "";
  }
  if (typeof value === "object" && value?.value != null) {
    return value;
  }
  return { label: value, value };
}

function createEmptySubstanceRow(types) {
  return {
    types,
    ageOfFirstUse: "",
    lastUse: "",
    frequency: "",
    lengthOfSobriety: "",
  };
}

export function createDefaultSubstanceAbuseRows() {
  return SUBSTANCE_ABUSE_FIXED_ROWS.map(({ types }) =>
    createEmptySubstanceRow(types),
  );
}

export function mapApiRowToSubstanceRow(types, apiRow) {
  if (!apiRow) {
    return createEmptySubstanceRow(types);
  }
  return {
    types,
    ageOfFirstUse: apiRow.ageOfFirstUse ?? "",
    lastUse: toSelectOption(apiRow.lastUse),
    frequency: toSelectOption(apiRow.frequency),
    lengthOfSobriety: toSelectOption(apiRow.lengthOfSobriety),
  };
}

export function loadSubstanceAbuseFromApi(apiArray) {
  if (!Array.isArray(apiArray)) {
    return { fixed: createDefaultSubstanceAbuseRows(), extras: [] };
  }

  const consumed = new Array(apiArray.length).fill(false);
  const fixed = SUBSTANCE_ABUSE_FIXED_ROWS.map(({ types }, index) => {
    let matchIndex = apiArray.findIndex(
      (row, i) => !consumed[i] && row?.types === types,
    );
    if (matchIndex < 0 && index < apiArray.length && !consumed[index]) {
      matchIndex = index;
    }
    if (matchIndex >= 0) {
      consumed[matchIndex] = true;
      return mapApiRowToSubstanceRow(types, apiArray[matchIndex]);
    }
    return mapApiRowToSubstanceRow(types, undefined);
  });

  const extras = apiArray.filter((_, i) => !consumed[i]);
  return { fixed, extras };
}

/** Attaches legacy flat setter functions for each fixed substance row. */
export function attachSubstanceAbuseSetters(
  bindings,
  fixedRows,
  updateFixedRow,
) {
  SUBSTANCE_ABUSE_FIXED_ROWS.forEach((config, index) => {
    Object.entries(config.setters).forEach(([field, setterKey]) => {
      bindings[setterKey] = (value) =>
        updateFixedRow(
          index,
          field,
          typeof value === "function"
            ? value(fixedRows[index]?.[field])
            : value,
        );
    });
  });
  return bindings;
}

export function substanceAbuseToLegacyFlat(fixedRows) {
  const flat = {};
  SUBSTANCE_ABUSE_FIXED_ROWS.forEach((config, index) => {
    const row = fixedRows[index] || {};
    flat[config.legacyKeys.ageOfFirstUse] = row.ageOfFirstUse ?? "";
    flat[config.legacyKeys.lastUse] = row.lastUse ?? "";
    flat[config.legacyKeys.frequency] = row.frequency ?? "";
    flat[config.legacyKeys.lengthOfSobriety] = row.lengthOfSobriety ?? "";
  });
  return flat;
}

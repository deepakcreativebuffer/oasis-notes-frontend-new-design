/** @format */

export function createDefaultDiagnosisSlots(slotConfig) {
  return slotConfig.map(({ name }) => ({
    name,
    icdCode: "",
    description: "",
  }));
}

export function loadDiagnosisSlotsFromApi(slotConfig, apiArray) {
  const fixed = slotConfig.map((slot) => {
    const matched = apiArray?.find((item) => item?.name === slot.name) || {};
    return {
      name: slot.name,
      icdCode: matched.icdCode ?? "",
      description: matched.description ?? "",
    };
  });
  const extras = apiArray
    ? apiArray.filter(
        (item) => !slotConfig.some((slot) => slot.name === item?.name),
      )
    : [];
  return { fixed, extras };
}

export function diagnosisSlotsToLegacyFlat(slotConfig, fixedRows) {
  const flat = {};
  slotConfig.forEach((slot, index) => {
    const row = fixedRows[index] || {};
    flat[slot.icdCodeKey] = row.icdCode ?? "";
    flat[slot.descriptionKey] = row.description ?? "";
  });
  return flat;
}

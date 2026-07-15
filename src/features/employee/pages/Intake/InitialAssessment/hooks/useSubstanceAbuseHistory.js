/* eslint-disable no-unused-vars */
/** @format */

import { useCallback, useMemo, useState } from "react";
import { SUBSTANCE_ABUSE_FIXED_ROWS } from "../config/substanceAbuseConfig";
import {
  attachSubstanceAbuseSetters,
  createDefaultSubstanceAbuseRows,
  loadSubstanceAbuseFromApi,
  substanceAbuseToLegacyFlat,
} from "../utils/substanceAbuseState";
import { useSubstanceAbuseSelectHandlers } from "./useSubstanceAbuseSelectHandlers";

export const EMPTY_OTHER_SUBSTANCE_DRAFT = {
  types: "",
  ageOfFirstUse: "",
  lastUse: "",
  frequency: "",
  lengthOfSobriety: "",
};

export function useSubstanceAbuseHistory() {
  const [substanceAbuseHistory, setSubstanceAbuseHistory] = useState("");
  const [substanceAbuseDenies, setSubstanceAbuseDenies] = useState("");
  const [fixedRows, setFixedRows] = useState(createDefaultSubstanceAbuseRows);
  const [extraRows, setExtraRows] = useState([]);
  const [otherDraft, setOtherDraft] = useState(EMPTY_OTHER_SUBSTANCE_DRAFT);

  const updateFixedRow = useCallback((index, field, value) => {
    setFixedRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const loadFromApi = useCallback((detail) => {
    setSubstanceAbuseHistory(detail?.substanceAbuseHistory ?? "");
    setSubstanceAbuseDenies(detail?.substanceAbuseDenies ?? "");
    const { fixed, extras } = loadSubstanceAbuseFromApi(
      detail?.substanceAbuseHistoryData,
    );
    setFixedRows(fixed);
    setExtraRows(extras);
  }, []);

  const appendOtherDraft = useCallback(() => {
    const { types, ageOfFirstUse, lastUse, frequency, lengthOfSobriety } =
      otherDraft;
    if (types) {
      setExtraRows((prev) => [
        ...prev,
        {
          types,
          ageOfFirstUse,
          lastUse: lastUse?.value ?? lastUse,
          frequency: frequency?.value ?? frequency,
          lengthOfSobriety: lengthOfSobriety?.value ?? lengthOfSobriety,
        },
      ]);
      setOtherDraft(EMPTY_OTHER_SUBSTANCE_DRAFT);
    }
  }, [otherDraft]);

  const removeExtraRow = useCallback((index) => {
    setExtraRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const legacy = useMemo(() => {
    const flat = substanceAbuseToLegacyFlat(fixedRows);
    const bindings = {
      ...flat,
      substanceAbuseHistory,
      substanceAbuseDenies,
      setSubstanceAbuseHistory,
      setSubstanceAbuseDenies,
      typeArray: extraRows,
      otherTypeOther: otherDraft.types,
      otherAgeOfFirstUse: otherDraft.ageOfFirstUse,
      otherLastUse: otherDraft.lastUse,
      otherFrequancy: otherDraft.frequency,
      OtherlengthOfSobrifty: otherDraft.lengthOfSobriety,
      setOtherTypeOther: (value) =>
        setOtherDraft((prev) => ({
          ...prev,
          types: typeof value === "function" ? value(prev.types) : value,
        })),
      setOtherAgeOfFirstUse: (value) =>
        setOtherDraft((prev) => ({
          ...prev,
          ageOfFirstUse:
            typeof value === "function" ? value(prev.ageOfFirstUse) : value,
        })),
      setOtherLastUse: (value) =>
        setOtherDraft((prev) => ({
          ...prev,
          lastUse: typeof value === "function" ? value(prev.lastUse) : value,
        })),
      setOtherFrequancy: (value) =>
        setOtherDraft((prev) => ({
          ...prev,
          frequency:
            typeof value === "function" ? value(prev.frequency) : value,
        })),
      setOtherLengthOfSobirty: (value) =>
        setOtherDraft((prev) => ({
          ...prev,
          lengthOfSobriety:
            typeof value === "function" ? value(prev.lengthOfSobriety) : value,
        })),
    };

    attachSubstanceAbuseSetters(bindings, fixedRows, updateFixedRow);

    return bindings;
  }, [
    fixedRows,
    extraRows,
    otherDraft,
    substanceAbuseHistory,
    substanceAbuseDenies,
    updateFixedRow,
  ]);

  const toSubmitSnapshot = useCallback(
    () => ({
      ...substanceAbuseToLegacyFlat(fixedRows),
      substanceAbuseHistory,
      substanceAbuseDenies,
      typeArray: extraRows,
    }),
    [fixedRows, extraRows, substanceAbuseHistory, substanceAbuseDenies],
  );

  const selectHandlers = useSubstanceAbuseSelectHandlers(legacy);

  const sectionProps = useMemo(
    () => ({
      ...selectHandlers,
      ...legacy,
    }),
    [legacy, selectHandlers],
  );

  return {
    fixedRows,
    extraRows,
    otherDraft,
    legacy,
    selectHandlers,
    sectionProps,
    loadFromApi,
    updateFixedRow,
    appendOtherDraft,
    removeExtraRow,
    setExtraRows,
    toSubmitSnapshot,
  };
}

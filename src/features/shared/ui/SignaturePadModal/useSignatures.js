/** @format */

import { useState, useCallback } from "react";

/**
 * Manages the INLINE PEN signatures state for a form.
 *
 * Role object shape:
 *   { name, signature, date, time, rawSignatureImage }
 *
 * The existing "SAVED AND SIGNED" (typed) flow on each form is completely
 * separate and must not be touched by this hook.
 */
const EMPTY_SECTION = Object.freeze({
  name: "",
  signature: "",
  date: "",
  time: "",
  rawSignatureImage: "",
});

const ROLES = ["admin", "bhp", "bht", "resident", "witness"];

const mergeSection = (initial) => ({ ...EMPTY_SECTION, ...(initial || {}) });

export const useSignatures = (initial = {}) => {
  const buildInitial = () =>
    ROLES.reduce((acc, role) => {
      acc[role] = mergeSection(initial?.[role]);
      return acc;
    }, {});

  const [signatures, setSignatures] = useState(buildInitial);

  const updateSignature = useCallback((role, patch) => {
    setSignatures((s) => ({ ...s, [role]: { ...s[role], ...patch } }));
  }, []);

  const loadFromApi = useCallback((apiSignatures) => {
    if (!apiSignatures) return;
    const loaded = ROLES.reduce((acc, role) => {
      acc[role] = mergeSection(apiSignatures?.[role]);
      return acc;
    }, {});
    setSignatures(loaded);
  }, []);

  return {
    signatures,
    setSignatures,
    updateSignature,
    loadFromApi,
  };
};

export default useSignatures;

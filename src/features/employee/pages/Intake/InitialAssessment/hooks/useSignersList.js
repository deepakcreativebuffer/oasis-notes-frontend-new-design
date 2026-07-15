/** @format */

import { useCallback, useMemo } from "react";

/**
 * Shared multi-signer list helpers (employee edit, resident edit/view).
 */
export function useSignersList(signers, setSigners, profileInfo, options = {}) {
  const { includeAssignedPatients = false } = options;

  const signerIndex = useMemo(() => {
    const idx = signers?.findIndex?.((signer) => {
      if (signer.signerId === profileInfo?._id) return true;
      if (
        includeAssignedPatients &&
        profileInfo?.patientsAssigned?.includes(signer.signerId)
      ) {
        return true;
      }
      return false;
    });
    return idx === undefined || idx === null ? -1 : idx;
  }, [signers, profileInfo, includeAssignedPatients]);

  const updateSignerField = useCallback(
    (field, value) => {
      if (signerIndex === -1) return;
      setSigners((current) => {
        const next = [...current];
        next[signerIndex] = { ...next[signerIndex], [field]: value };
        return next;
      });
    },
    [signerIndex, setSigners],
  );

  const setSignerSignature = useCallback(
    (sign) => updateSignerField("signature", sign),
    [updateSignerField],
  );
  const setSignerDate = useCallback(
    (date) => updateSignerField("dateSigned", date),
    [updateSignerField],
  );
  const setSignerTime = useCallback(
    (time) => updateSignerField("signedTime", time),
    [updateSignerField],
  );

  return {
    signerIndex,
    setSignerSignature,
    setSignerDate,
    setSignerTime,
  };
}

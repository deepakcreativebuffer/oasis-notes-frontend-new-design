/** @format */

import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import {
  allPenSignaturesHaveNames,
  hasAnyTypedSignature,
  isWitnessIncomplete,
} from "../utils/validators";

/**
 * Centralizes signature pad + typed guard logic for Initial Assessment.
 */
export function useSignatureManagement() {
  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();

  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });

  const witnessIncomplete = isWitnessIncomplete(signatures);
  const allPenSigsHaveNames = allPenSignaturesHaveNames(signatures);

  return {
    signatures,
    updateSignature,
    loadSignaturesFromApi,
    guardTyped,
    typedGuardDialog,
    witnessIncomplete,
    allPenSigsHaveNames,
    hasAnyTypedSignature: (extra = {}) =>
      hasAnyTypedSignature({ signatures, ...extra }),
  };
}

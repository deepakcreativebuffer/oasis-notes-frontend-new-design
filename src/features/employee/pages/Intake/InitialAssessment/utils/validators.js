/** @format */

/**
 * Signature validation helpers for Initial Assessment forms.
 */
export function isWitnessIncomplete(signatures) {
  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  return witnessSigPresent && !witnessNamePresent;
}

export function allPenSignaturesHaveNames(signatures) {
  return Object.values(signatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );
}

export function hasAnyTypedSignature({
  bhpSignature,
  adminSignature,
  signatures,
}) {
  const hasPenSig = Object.values(signatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );
  return !!bhpSignature || !!adminSignature || hasPenSig;
}

/** @format */

import React, { useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import InlineSignatureBox from "./InlineSignatureBox";
import SignatureConflictDialog from "./SignatureConflictDialog";
import "./SignaturePadModal.css";
import { ROLES } from "../../constants";

const SignaturePadModal = React.lazy(() => import("./SignaturePadModal"));

/**
 * Inline PEN signature section for one role.
 *
 * Deliberately PEN-ONLY — the existing "SAVED AND SIGNED" (typed) flow on
 * each form stays untouched except for the click-guard wiring.
 *
 * Mutual exclusivity (FORM-LEVEL):
 *   Pass formHasTyped={true} if any legacy typed signature is populated
 *   anywhere in the form (bhpSignature || adminSignature || ...). Pass
 *   onClearAllTyped={fn} that wipes every legacy typed field. If
 *   formHasTyped is true and user clicks the inline pen box, the
 *   confirmation dialog fires. On confirm, onClearAllTyped() runs and the
 *   pen modal opens.
 *
 * Props:
 *   role                "admin" | "bhp" | "bht" | "resident" | "witness"
 *   label               display text
 *   variant             color variant
 *   signature           section state
 *   onUpdate            (role, patch) => void
 *   mode                "edit" | "view"
 *   visible             default true
 *   externalName        default false
 *   signerNameOverride  optional
 *   formHasTyped        default false — if true, pen click shows dialog
 *   onClearAllTyped     () => void — called when user confirms clearing typed
 */
const SignatureSection = ({
  role,
  label,
  variant = "green",
  signature,
  onUpdate,
  mode = "edit",
  visible = true,
  externalName = false,
  signerNameOverride,
  formHasTyped = false,
  onClearAllTyped,
  inlineDateFallback = "",
}) => {
  const [penOpen, setPenOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);
  const profile = useSelector(userProfile);
  const isAdminUser = profile?.userType === ROLES.ADMIN;

  // Auto-populate rule per userType:
  //   - BHT   auto-populates when the logged-in user IS the BHT (Employee)
  //   - Admin auto-populates when the logged-in user IS the Admin
  // For those roles, override any externalName prop from the form.
  let effectiveExternalName = externalName;
  if (role === "bht") effectiveExternalName = isAdminUser;
  else if (role === "admin") effectiveExternalName = !isAdminUser;

  if (!visible) return null;
  const sec = signature || {};

  // --- VIEW MODE ---
  if (mode === "view") {
    if (!sec.rawSignatureImage) return null;
    // Print Name fallback: if the saved sec.name is empty (e.g. legacy record
    // signed before the modal name-fallback fix), fall back to whatever the
    // form passed as signerNameOverride. Useful for Resident sigs where the
    // form knows the resident's name even if the record didn't capture it.
    const resolvedPrintName =
      sec.name && sec.name.trim() && sec.name !== "undefined undefined"
        ? sec.name
        : signerNameOverride && signerNameOverride !== "undefined undefined"
          ? signerNameOverride
          : "";
    return (
      <InlineSignatureBox
        label={label}
        variant={variant}
        imgSrc={sec.rawSignatureImage}
        dateValue={sec.date || inlineDateFallback}
        printName={resolvedPrintName}
        mode="view"
      />
    );
  }

  // --- EDIT MODE ---

  const resolvedEditPrintName =
    sec.name && sec.name.trim() && sec.name !== "undefined undefined"
      ? sec.name
      : signerNameOverride &&
          String(signerNameOverride).trim() &&
          signerNameOverride !== "undefined undefined"
        ? signerNameOverride
        : "";

  const effectiveOverride =
    signerNameOverride !== undefined
      ? signerNameOverride
      : effectiveExternalName
        ? sec.name || ""
        : undefined;

  const handlePenValue = (sign) =>
    onUpdate(role, { name: sign, signature: sign });
  const handlePenDate = (date) => onUpdate(role, { date });
  const handlePenTime = (time) => onUpdate(role, { time });
  const handleRawImage = (img) => onUpdate(role, { rawSignatureImage: img });

  // TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): typed-vs-pen mutex disabled
  // per client request. Box click now opens the pen modal directly even
  // when typed signatures are present. To restore the mutex, uncomment the
  // formHasTyped guard below. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md.
  const handleBoxClick = () => {
    // TEMP-DISABLED-BHP-BHT-ADMIN: if (formHasTyped) { setConflictOpen(true); return; }
    setPenOpen(true);
  };

  const handleConflictConfirm = () => {
    if (onClearAllTyped) onClearAllTyped();
    setConflictOpen(false);
    setPenOpen(true);
  };

  return (
    <>
      <SignatureConflictDialog
        show={conflictOpen}
        onHide={() => setConflictOpen(false)}
        onConfirm={handleConflictConfirm}
        existingMethod="typed"
        roleLabel="This form"
      />
      <Suspense fallback={null}>
        <SignaturePadModal
          show={penOpen}
          onHide={() => setPenOpen(false)}
          setValue={handlePenValue}
          setDate={handlePenDate}
          setTime={handlePenTime}
          setRawSignatureImage={handleRawImage}
          signerNameOverride={effectiveOverride}
        />
      </Suspense>
      <InlineSignatureBox
        label={label}
        variant={variant}
        imgSrc={sec.rawSignatureImage}
        dateValue={sec.date || inlineDateFallback}
        printName={resolvedEditPrintName}
        mode="edit"
        onClick={handleBoxClick}
      />
    </>
  );
};

export default SignatureSection;

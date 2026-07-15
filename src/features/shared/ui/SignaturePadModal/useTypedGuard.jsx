/** @format */

import React, { useState, useCallback, useMemo } from "react";
import SignatureConflictDialog from "./SignatureConflictDialog";

/**
 * FORM-LEVEL mutual exclusivity guard from the TYPED side.
 *
 * When any "SAVED AND SIGNED" button is clicked, call guardTyped(openTypedFn).
 * If ANY inline pen signature OR panel Print Name is populated anywhere in
 * the form, a conflict dialog fires. On confirm, ALL pen+panel state is
 * wiped and openTypedFn is invoked.
 *
 * Returns:
 *   guardTyped(openTypedFn)  — call from each SAVED AND SIGNED onClick
 *   dialog                    — render once in form's JSX
 *   hasAnyPenOrPanel          — boolean flag for other components to consume
 *
 * Example:
 *   const { guardTyped, dialog, hasAnyPenOrPanel } = useTypedGuard({
 *     signatures, updateSignature,
 *   });
 *   <Button onClick={() => guardTyped(() => setOpen(true))}>SAVED AND SIGNED</Button>
 *   {dialog}
 */

const ROLES = ["admin", "bhp", "bht", "resident", "witness"];

export const useTypedGuard = ({ signatures, updateSignature }) => {
  const [conflict, setConflict] = useState(null);

  const hasAnyPenOrPanel = useMemo(() => {
    if (!signatures) return false;
    return ROLES.some((role) => {
      const s = signatures[role] || {};
      return !!s.rawSignatureImage || !!s.name;
    });
  }, [signatures]);

  // TEMP-DISABLED-BHP-BHT-ADMIN (2026-04-26): typed-vs-pen mutex disabled per
  // client request — SAVED AND SIGNED and inline pen now coexist freely. The
  // guard is now a pass-through. To restore the mutex, uncomment the original
  // body below. See documentation/BHP_BHT_ADMIN_DISABLE_PLAN.md.
  const guardTyped = useCallback((openTyped) => {
    if (openTyped) openTyped();
  }, []);
  /* TEMP-DISABLED-BHP-BHT-ADMIN: original guardTyped
  const guardTyped = useCallback(
    (openTyped) => {
      if (hasAnyPenOrPanel) {
        setConflict({ openTyped });
      } else {
        if (openTyped) openTyped();
      }
    },
    [hasAnyPenOrPanel]
  );
  */

  const handleConfirm = useCallback(() => {
    if (!conflict) return;
    // Clear ALL pen + panel state across every role
    ROLES.forEach((role) => {
      updateSignature(role, {
        name: "",
        signature: "",
        date: "",
        time: "",
        rawSignatureImage: "",
      });
    });
    const fn = conflict.openTyped;
    setConflict(null);
    if (fn) fn();
  }, [conflict, updateSignature]);

  const dialog = (
    <SignatureConflictDialog
      show={!!conflict}
      onHide={() => setConflict(null)}
      onConfirm={handleConfirm}
      existingMethod="pen"
      roleLabel="This form"
    />
  );

  return { guardTyped, dialog, hasAnyPenOrPanel };
};

export default useTypedGuard;

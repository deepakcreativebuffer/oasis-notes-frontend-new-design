/** @format */

import React from "react";
import "./SignaturePadModal.css";

/**
 * Confirmation dialog shown when a user tries to use one signature method
 * (typed or pen) while the other method is already populated.
 *
 * Props:
 *   show             boolean — controls visibility
 *   onHide           () => void — user clicked Cancel / backdrop
 *   onConfirm        () => void — user clicked Clear & Continue
 *   existingMethod   "typed" | "pen" — which method is already in use
 *   roleLabel        string — e.g. "Admin Signature" for context
 */
const LABELS = {
  typed: {
    name: "SAVED AND SIGNED (typed)",
    other: "pen",
  },
  pen: {
    name: "pen (inline)",
    other: "SAVED AND SIGNED",
  },
};

const SignatureConflictDialog = ({
  show,
  onHide,
  onConfirm,
  existingMethod = "typed",
  roleLabel,
}) => {
  if (!show) return null;

  const existing = LABELS[existingMethod] || LABELS.typed;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onHide) onHide();
  };

  return (
    <div
      className="sig-pad-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div className="sig-pad-modal sig-conflict-modal">
        <div className="sig-pad-header">
          <h3 className="sig-pad-title">Only one signature method allowed</h3>
          <button
            type="button"
            className="sig-pad-close"
            onClick={onHide}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="sig-pad-body">
          <p className="mb-2">
            {roleLabel ? <strong>{roleLabel}</strong> : "This section"} is
            already signed with <strong>{existing.name}</strong>.
          </p>
          <p className="mb-0">
            You can only use one method at a time. Clear the existing signature
            to continue with <strong>{existing.other}</strong>, or cancel to
            keep it.
          </p>
        </div>
        <div className="sig-pad-footer">
          <button
            type="button"
            className="sig-pad-btn sig-pad-btn-secondary"
            onClick={onHide}
          >
            Cancel
          </button>
          <button
            type="button"
            className="sig-pad-btn sig-pad-btn-primary"
            onClick={onConfirm}
          >
            Clear &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureConflictDialog;

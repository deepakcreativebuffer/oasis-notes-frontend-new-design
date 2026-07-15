/** @format */

import React from "react";
import { formatSignatureDateOnly } from "@/utils/utils";
import "./SignaturePadModal.css";

/**
 * Reusable inline signature box — one per signature section.
 *
 * Props:
 *   label        string  e.g. "BHT Signature"
 *   variant      "green" | "purple" | "pink" | "blue" | "yellow"
 *   imgSrc       string  base64 PNG of the pen drawing (empty if unsigned)
 *   dateValue    string|Date  raw state value (handled by formatSignatureDateOnly)
 *   printName    string  name displayed in the Print Name row
 *   mode         "edit" | "view"  — edit makes the box clickable
 *   onClick      () => void  — invoked when box clicked (edit mode only)
 *   placeholder  string  — defaults to "xSign"
 *
 * Colors map:
 *   BHT      → green
 *   BHP      → purple
 *   Admin    → pink
 *   Resident → blue
 *   Witness  → yellow
 */
const InlineSignatureBox = ({
  label,
  variant = "green",
  imgSrc = "",
  dateValue,
  printName,
  mode = "view",
  onClick,
  placeholder = "xSign",
}) => {
  const isEdit = mode === "edit";
  const clickable = isEdit && typeof onClick === "function";

  const handleClick = () => {
    if (clickable) onClick();
  };

  const handleKeyDown = (e) => {
    if (clickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const dateDisplay = dateValue ? formatSignatureDateOnly(dateValue) : "";

  return (
    <div className="sig-doc-section">
      <div className="sig-doc-row">
        <span className="sig-doc-label">{label}</span>
        <div
          className={`sig-doc-box sig-${variant}${
            clickable ? " sig-doc-clickable" : ""
          }`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role={clickable ? "button" : undefined}
          tabIndex={clickable ? 0 : undefined}
          title={clickable ? "Click for signature" : undefined}
        >
          {imgSrc ? (
            <img src={imgSrc} alt={`${label} signature`} />
          ) : (
            <span className="sig-doc-placeholder">{placeholder}</span>
          )}
        </div>
        <span className="sig-doc-date-label">Date:</span>
        <span className={`sig-doc-date-box sig-${variant}`}>
          {dateDisplay || (
            <span className="sig-doc-placeholder">Date Signed</span>
          )}
        </span>
      </div>
      <div className="sig-doc-name-row">
        <span className="sig-doc-name-label">Print Name:</span>
        <span className={`sig-doc-name-value sig-${variant}`}>
          {printName || <span className="sig-doc-placeholder">Full Name</span>}
        </span>
      </div>
    </div>
  );
};

export default InlineSignatureBox;

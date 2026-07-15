/** @format */

import React from "react";
import "./RonPrint.css";

const RON_HEADER_IMAGE = `/images/ron-ahcccs-header.png`;

export function RonPrintHeader({ breakBefore = false }) {
  const rootClass = [
    "ron-print-header",
    "d-none",
    "d-print-flex",
    "w-100",
    "align-items-start",
    breakBefore ? "ron-print-break-before" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className="ron-print-header-logo-clip">
        <img
          src={RON_HEADER_IMAGE}
          alt=""
          className="ron-print-header-logo-img"
          decoding="async"
          aria-hidden="true"
        />
      </div>
      <div className="ron-print-header-titles">
        <div className="ron-print-header-line ron-print-header-line-teal">
          Outpatient Behavioral Health
        </div>
        <div className="ron-print-header-line ron-print-header-line-teal">
          Re-Certification of Need (RON) Form
        </div>
        {breakBefore ? null : (
          <>
            <div className="ron-print-header-line ron-print-header-line-orange">
              (For Behavioral Health Residential Facilities and
            </div>
            <div className="ron-print-header-line ron-print-header-line-orange">
              Intensive Outpatient Treatment Programs)
            </div>
          </>
        )}
      </div>
    </div>
  );
}

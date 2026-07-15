/** @format */

import React from "react";
import "./AssessmentTypeHeader.css";

/**
 * Annual vs Initial assessment toggle (intake — Employee + Resident + Guardian).
 */
const AssessmentTypeHeader = ({
  assessmentType,
  setAssessmentType,
  disabled = false,
  showPrintTitle = false,
  uppercaseLabels = false,
  wrapperClassName = "therapy-notes-multiple-radio-wb mb-3",
}) => {
  const annualLabel = uppercaseLabels
    ? "ANNUAL ASSESSMENT"
    : "Annual Assessment";
  const initialLabel = uppercaseLabels
    ? "INITIAL ASSESSMENT"
    : "Initial Assessment";

  return (
    <>
      {showPrintTitle && (
        <h1 className="pdfTitle my-3 w-100 text-center hidden">
          {assessmentType === "Annual Assessment"
            ? "ANNUAL ASSESSMENT"
            : "INITIAL ASSESSMENT"}
        </h1>
      )}
      <div className={wrapperClassName}>
        <div className="main">
          <div className="checkboxitem125555">
            <label>{annualLabel}</label>
            <input
              disabled={disabled}
              type="checkbox"
              checked={assessmentType === "Annual Assessment"}
              onChange={() => setAssessmentType("Annual Assessment")}
            />
          </div>
        </div>
        <div className="main">
          <div className="checkboxitem125555">
            <label>{initialLabel}</label>
            <input
              disabled={disabled}
              type="checkbox"
              checked={assessmentType === "Initial Assessment"}
              onChange={() => setAssessmentType("Initial Assessment")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentTypeHeader;

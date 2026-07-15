/** @format */

import React from "react";
import { Card, Form } from "react-bootstrap";
import {
  RON_VI_DISCLAIMER,
  RON_VI_INTRO,
  RON_VI_PROGRESS_NOTES,
  RON_VI_SUBITEMS,
} from "./ronConstants";

function TreatmentPlanCheckLabel() {
  return (
    <span>
      Most current treatment plan, which must include documentation of{" "}
      <u>
        <strong>all</strong>
      </u>{" "}
      of the following:
      <ul className="ron-vi-accompany-sublist">
        {RON_VI_SUBITEMS.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </span>
  );
}

export default function RonSectionViAccompanying({
  accompanyTreatmentPlan,
  accompanyProgressNotes,
  onAccompanyTreatmentPlanChange,
  onAccompanyProgressNotesChange,
  readOnly,
  treatmentCheckboxId = "ron-vi-accompany-treatment",
  progressCheckboxId = "ron-vi-accompany-progress",
}) {
  return (
    <Card body className="mb-3 ron-print-avoid">
      <h5 className="ron-view-section-title mb-3">
        VI. Accompanying Documentation (Required)
      </h5>
      <p className="fst-italic small mb-3">{RON_VI_INTRO}</p>
      <Form.Check
        type="checkbox"
        id={treatmentCheckboxId}
        readOnly={readOnly}
        disabled={readOnly}
        checked={!!accompanyTreatmentPlan}
        onChange={readOnly ? undefined : onAccompanyTreatmentPlanChange}
        className={`mb-2 align-items-start ${readOnly ? "ron-view-readonly-check" : ""}`}
        label={<TreatmentPlanCheckLabel />}
      />
      <Form.Check
        type="checkbox"
        id={progressCheckboxId}
        readOnly={readOnly}
        disabled={readOnly}
        checked={!!accompanyProgressNotes}
        onChange={readOnly ? undefined : onAccompanyProgressNotesChange}
        className={`mb-2 align-items-start ${readOnly ? "ron-view-readonly-check" : ""}`}
        label={RON_VI_PROGRESS_NOTES}
      />
      <p className="small fst-italic mt-2 mb-0">{RON_VI_DISCLAIMER}</p>
    </Card>
  );
}

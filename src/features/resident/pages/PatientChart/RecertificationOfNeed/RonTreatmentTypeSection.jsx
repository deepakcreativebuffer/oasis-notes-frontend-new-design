/** @format */

import React from "react";
import { Card, Form } from "react-bootstrap";
import { SECTION_I_REQUIRED_LINE, TREATMENT_OPTIONS } from "./ronConstants";

export default function RonTreatmentTypeSection({
  treatmentType,
  setTreatmentType = () => {},
  readOnly,
}) {
  return (
    <Card body className="mb-4 ron-card-section ron-section-i-card">
      <h5 className="ron-section-heading">I. Treatment Type</h5>
      <p className="ron-section-i-required mb-4">{SECTION_I_REQUIRED_LINE}</p>
      {TREATMENT_OPTIONS.map((opt) => (
        <div key={opt.value} className="ron-treatment-option">
          <Form.Check
            type="radio"
            name="treatmentTypeRon"
            id={`tt-${opt.value}`}
            checked={treatmentType === opt.value}
            onChange={readOnly ? undefined : () => setTreatmentType(opt.value)}
            readOnly={!!readOnly}
            disabled={!!readOnly}
            className={`ron-treatment-check${readOnly ? " ron-view-readonly-check" : ""}`}
            label={
              <span className="ron-treatment-label-text">
                <strong>{opt.title}</strong> {opt.body}
              </span>
            }
          />
        </div>
      ))}
    </Card>
  );
}

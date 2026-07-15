/** @format */

import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { useViewInitialAssessmentForm } from "../formContext";

export default function WithdrawalMseIntroSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row className="mb-3">
        <Col
          xs={12}
          className={`${!f.noneReportedOrObserved && !f.Vomiting && !f.Anxiety && !f.Agitation && !f.Headache && !f.Tremors && !f.Nausea && !f.VisualDisturbances && !f.TactileDisturbances && !f.VisualDisturbancesOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body>
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Active Withdrawal Symptoms :{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  inline
                  label="None reported or observed"
                  type="checkbox"
                  id="noneReportedOrObserved"
                  value={f.noneReportedOrObserved}
                  checked={f.noneReportedOrObserved}
                  onChange={() =>
                    f.setNoneReportedOrObserved(!f.noneReportedOrObserved)
                  }
                  className={`pointer-events-none ${!f.noneReportedOrObserved && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Vomiting"
                  type="checkbox"
                  id="Vomiting"
                  value={f.Vomiting}
                  checked={f.Vomiting}
                  onChange={() => f.setVomiting(!f.Vomiting)}
                  className={`pointer-events-none ${!f.Vomiting && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Anxiety"
                  type="checkbox"
                  id="Anxiety"
                  value={f.Anxiety}
                  checked={f.Anxiety}
                  onChange={() => f.setAnxiety(!f.Anxiety)}
                  className={`pointer-events-none ${!f.Anxiety && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Agitation"
                  type="checkbox"
                  id="Agitation"
                  value={f.Agitation}
                  checked={f.Agitation}
                  onChange={() => f.setAgitation(!f.Agitation)}
                  className={`pointer-events-none ${!f.Agitation && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Headache"
                  type="checkbox"
                  id="Headache"
                  value={f.Headache}
                  checked={f.Headache}
                  onChange={() => f.setHeadache(!f.Headache)}
                  className={`pointer-events-none ${!f.Headache && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Tremors"
                  type="checkbox"
                  id="Tremors"
                  value={f.Tremors}
                  checked={f.Tremors}
                  onChange={() => f.setTremors(!f.Tremors)}
                  className={`pointer-events-none ${!f.Tremors && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Nausea"
                  type="checkbox"
                  id="Nausea"
                  value={f.Nausea}
                  checked={f.Nausea}
                  onChange={() => f.setNausea(!f.Nausea)}
                  className={`pointer-events-none ${!f.Nausea && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Tactile Disturbances"
                  type="checkbox"
                  id="TactileDisturbances"
                  value={f.TactileDisturbances}
                  checked={f.TactileDisturbances}
                  onChange={() =>
                    f.setTactileDisturbances(!f.TactileDisturbances)
                  }
                  className={`pointer-events-none ${!f.TactileDisturbances && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Visual Disturbances"
                  type="checkbox"
                  id="VisualDisturbances"
                  value={f.VisualDisturbances}
                  checked={f.VisualDisturbances}
                  onChange={() =>
                    f.setVisualDisturbances(!f.VisualDisturbances)
                  }
                  className={`pointer-events-none ${!f.VisualDisturbances && "print-hide"}`}
                />
                <Form.Check
                  disabled
                  inline
                  label="Other"
                  type="checkbox"
                  id="VisualDisturbancesOtherBoolean"
                  value={f.VisualDisturbancesOtherBoolean}
                  checked={f.VisualDisturbancesOtherBoolean}
                  onChange={() =>
                    f.setVisualDisturbancesOtherBoolean(
                      !f.VisualDisturbancesOtherBoolean,
                    )
                  }
                  className={`pointer-events-none ${!f.VisualDisturbancesOtherBoolean && "print-hide"}`}
                />
                {f.VisualDisturbancesOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.VisualDisturbancesOtherType}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col
          xs={12}
          className={`${!f.Sweats && !f.GooseBumps && !f.BonePain && !f.Seizures && !f.Paranoia && !f.Runningnose && !f.Tearing && !f.LossofMuscleCoordination && !f.LossofMuscleCoordinationOtherBoolean && "table-row-hide-print"}`}
        >
          <Card body>
            <Form.Group className="view-details-grid-inline">
              <Form.Label className="fw-bold flex-shrink-0">
                Other Withdraw Symptoms:
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Sweats"
                  type="checkbox"
                  id="Sweats"
                  value={f.Sweats}
                  checked={f.Sweats}
                  onChange={() => f.setSweats(!f.Sweats)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Goose Bumps"
                  type="checkbox"
                  id="GooseBumps"
                  value={f.GooseBumps}
                  checked={f.GooseBumps}
                  onChange={() => f.setGooseBumps(!f.GooseBumps)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Bone Pain"
                  type="checkbox"
                  id="BonePain"
                  value={f.BonePain}
                  checked={f.BonePain}
                  onChange={() => f.setBonePain(!f.BonePain)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Seizures"
                  type="checkbox"
                  id="Seizures"
                  value={f.Seizures}
                  checked={f.Seizures}
                  onChange={() => f.setSeizures(!f.Seizures)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Paranoia"
                  type="checkbox"
                  id="Paranoia"
                  value={f.Paranoia}
                  checked={f.Paranoia}
                  onChange={() => f.setParanoia(!f.Paranoia)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Running nose"
                  type="checkbox"
                  id="Runningnose"
                  value={f.Runningnose}
                  checked={f.Runningnose}
                  onChange={() => f.setRunningnose(!f.Runningnose)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Tearing"
                  type="checkbox"
                  id="Tearing"
                  value={f.Tearing}
                  checked={f.Tearing}
                  onChange={() => f.setTearing(!f.Tearing)}
                />
                <Form.Check
                  disabled
                  className="pointer-events-none"
                  inline
                  label="Loss of muscle coordination"
                  type="checkbox"
                  id="LossofMuscleCoordination"
                  value={f.LossofMuscleCoordination}
                  checked={f.LossofMuscleCoordination}
                  onChange={() =>
                    f.setLossofMuscleCoordination(!f.LossofMuscleCoordination)
                  }
                />
                <Form.Check
                  disabled
                  inline
                  label="Other"
                  type="checkbox"
                  id="LossofMuscleCoordination"
                  value={f.LossofMuscleCoordinationOtherBoolean}
                  checked={f.LossofMuscleCoordinationOtherBoolean}
                  onChange={() =>
                    f.setLossofMuscleCoordinationBoolean(
                      !f.LossofMuscleCoordinationOtherBoolean,
                    )
                  }
                  className={`pointer-events-none ${!f.LossofMuscleCoordinationOtherBoolean && "print-hide"}`}
                />
                {f.LossofMuscleCoordinationOtherBoolean && (
                  <span className="pointer-events-none view-value">
                    {f.LossofMuscleCoordinationOtherType}
                  </span>
                )}
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
}

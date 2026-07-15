/** @format */

import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { BorderlessInput } from "@/utils/Makers";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";

export default function ActiveWithdrawalSymptomsSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Row className="mb-3">
        <Col xs={12}>
          <Card body className="mb-3 ">
            <Form.Label className="fw-bold">
              Active Withdrawal Symptoms
            </Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="None reported or observed"
                type="checkbox"
                id="noneReportedOrObserved"
                value={f.noneReportedOrObserved}
                checked={f.noneReportedOrObserved}
                onChange={() =>
                  f.setNoneReportedOrObserved(!f.noneReportedOrObserved)
                }
              />
              <Form.Check
                inline
                label="Vomiting"
                type="checkbox"
                id="Vomiting"
                value={f.Vomiting}
                checked={f.Vomiting}
                onChange={() => f.setVomiting(!f.Vomiting)}
              />
              <Form.Check
                inline
                label="Anxiety"
                type="checkbox"
                id="Anxiety"
                value={f.Anxiety}
                checked={f.Anxiety}
                onChange={() => f.setAnxiety(!f.Anxiety)}
              />
              <Form.Check
                inline
                label="Agitation"
                type="checkbox"
                id="Agitation"
                value={f.Agitation}
                checked={f.Agitation}
                onChange={() => f.setAgitation(!f.Agitation)}
              />
              <Form.Check
                inline
                label="Headache"
                type="checkbox"
                id="Headache"
                value={f.Headache}
                checked={f.Headache}
                onChange={() => f.setHeadache(!f.Headache)}
              />
              <Form.Check
                inline
                label="Tremors"
                type="checkbox"
                id="Tremors"
                value={f.Tremors}
                checked={f.Tremors}
                onChange={() => f.setTremors(!f.Tremors)}
              />
              <Form.Check
                inline
                label="Nausea"
                type="checkbox"
                id="Nausea"
                value={f.Nausea}
                checked={f.Nausea}
                onChange={() => f.setNausea(!f.Nausea)}
              />
              <Form.Check
                inline
                label="Tactile Disturbances"
                type="checkbox"
                id="TactileDisturbances"
                value={f.TactileDisturbances}
                checked={f.TactileDisturbances}
                onChange={() =>
                  f.setTactileDisturbances(!f.TactileDisturbances)
                }
              />
              <Form.Check
                inline
                label="Visual Disturbances"
                type="checkbox"
                id="VisualDisturbances"
                value={f.VisualDisturbances}
                checked={f.VisualDisturbances}
                onChange={() => f.setVisualDisturbances(!f.VisualDisturbances)}
              />
              <Form.Check
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
              />
              {f.VisualDisturbancesOtherBoolean && (
                <BorderlessInput
                  className={`${!f.VisualDisturbancesOtherType && "hidePrint"}`}
                  value={f.VisualDisturbancesOtherType}
                  setState={f.setVisualDisturbancesOtherType}
                  placeholder={" "}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Other Withdraw Symptoms</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Sweats"
                type="checkbox"
                id="Sweats"
                value={f.Sweats}
                checked={f.Sweats}
                onChange={() => f.setSweats(!f.Sweats)}
              />
              <Form.Check
                inline
                label="Goose Bumps"
                type="checkbox"
                id="GooseBumps"
                value={f.GooseBumps}
                checked={f.GooseBumps}
                onChange={() => f.setGooseBumps(!f.GooseBumps)}
              />
              <Form.Check
                inline
                label="Bone Pain"
                type="checkbox"
                id="BonePain"
                value={f.BonePain}
                checked={f.BonePain}
                onChange={() => f.setBonePain(!f.BonePain)}
              />
              <Form.Check
                inline
                label="Seizures"
                type="checkbox"
                id="Seizures"
                value={f.Seizures}
                checked={f.Seizures}
                onChange={() => f.setSeizures(!f.Seizures)}
              />
              <Form.Check
                inline
                label="Paranoia"
                type="checkbox"
                id="Paranoia"
                value={f.Paranoia}
                checked={f.Paranoia}
                onChange={() => f.setParanoia(!f.Paranoia)}
              />
              <Form.Check
                inline
                label="Running nose"
                type="checkbox"
                id="Runningnose"
                value={f.Runningnose}
                checked={f.Runningnose}
                onChange={() => f.setRunningnose(!f.Runningnose)}
              />
              <Form.Check
                inline
                label="Tearing"
                type="checkbox"
                id="Tearing"
                value={f.Tearing}
                checked={f.Tearing}
                onChange={() => f.setTearing(!f.Tearing)}
              />
              <Form.Check
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
                inline
                label="Other"
                type="checkbox"
                id="LossofMuscleCoordination1"
                value={f.LossofMuscleCoordinationOtherBoolean}
                checked={f.LossofMuscleCoordinationOtherBoolean}
                onChange={() =>
                  f.setLossofMuscleCoordinationBoolean(
                    !f.LossofMuscleCoordinationOtherBoolean,
                  )
                }
              />
              {f.LossofMuscleCoordinationOtherBoolean && (
                <BorderlessInput
                  className={`${!f.LossofMuscleCoordinationOtherType && "hidePrint"}`}
                  value={f.LossofMuscleCoordinationOtherType}
                  setState={f.setLossofMuscleCoordinationType}
                  placeholder={" "}
                />
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}

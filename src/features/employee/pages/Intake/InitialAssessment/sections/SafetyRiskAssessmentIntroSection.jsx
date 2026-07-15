/** @format */

import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";

export default function SafetyRiskAssessmentIntroSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold">
            Safety and Risk Assessment
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Are you currently thinking about harming yourself or committing
                suicide?
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelf"
                  checked={f.currentThoughtsOfHarmingSelf === true}
                  onChange={() => f.setCurrentThoughtsOfHarmingSelf(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelfno"
                  checked={f.currentThoughtsOfHarmingSelf === false}
                  onChange={() => f.setCurrentThoughtsOfHarmingSelf(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Are you currently thinking about harming others or have
                homicidal thoughts?
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingOthers"
                  checked={f.currentThoughtsOfHarmingOthers === true}
                  onChange={() => f.setCurrentThoughtsOfHarmingOthers(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="currentThoughtsOfHarmingOthersno"
                  checked={f.currentThoughtsOfHarmingOthers === false}
                  onChange={() => f.setCurrentThoughtsOfHarmingOthers(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Ideation</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Fleeting"
                  id="Fleeting"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("Fleeting")}
                  onChange={() => f.handleMultiSuicidalIdeation("Fleeting")}
                />
                <Form.Check
                  inline
                  label="Periodic"
                  id="Periodic"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("Periodic")}
                  onChange={() => f.handleMultiSuicidalIdeation("Periodic")}
                />
                <Form.Check
                  inline
                  label="Constant"
                  id="Constant"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("Constant")}
                  onChange={() => f.handleMultiSuicidalIdeation("Constant")}
                />
                <Form.Check
                  inline
                  label="N/A"
                  id="N/AIdeation"
                  type="checkbox"
                  checked={f.suicidalIdeation?.includes("N/A")}
                  onChange={() => f.handleMultiSuicidalIdeation("N/A")}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">Increasing in:</Form.Label>
            <Form.Group className="d-flex">
              <Form.Label className="fw-bold pr-2">Urgency :</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="suicidalIdeationUrgency"
                  checked={f.suicidalIdeationUrgency === true}
                  onChange={() => f.setSuicidalIdeationUrgency(true)}
                />
                <Form.Check
                  inline
                  label="NO"
                  type="checkbox"
                  id="suicidalIdeationUrgencyno"
                  checked={f.suicidalIdeationUrgency === false}
                  onChange={() => f.setSuicidalIdeationUrgency(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Severity</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelf1"
                  checked={f.suicidalIdeationSeverity === true}
                  onChange={() => f.setSuicidalIdeationSeverity(true)}
                />
                <Form.Check
                  inline
                  label="NO"
                  type="checkbox"
                  id="suicidalIdeationSeverityno"
                  checked={f.suicidalIdeationSeverity === false}
                  onChange={() => f.setSuicidalIdeationSeverity(false)}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
}

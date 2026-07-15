/** @format */

import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";

export default function LivingSafetyExtrasSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Fall risk</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="fallRisk"
                  disabled
                  checked={f.fallRisk === true}
                  onChange={() => f.setFallRisk(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="fallRiskno"
                  disabled
                  checked={f.fallRisk === false}
                  onChange={() => f.setFallRisk(false)}
                />
              </div>
            </Form.Group>
            <Form.Group className={`${!f.fallRiskExplanation && "hidePrint"}`}>
              <Form.Label className="fw-bold">If yes please explain</Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={f.fallRiskExplanation}
                placeholder="Enter text"
                disabled
                onChange={(e) => f.setFallRiskExplanation(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md="6" className={`${!f.triggers && "hidePrint"}`}>
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Triggers</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter text"
                value={f.triggers}
                disabled
                onChange={(e) => f.setTriggers(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          md="12"
          lg={6}
          className={`${!f.hobbiesLeisureActivities && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Hobbies/Leisure Activities
              </Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={f.hobbiesLeisureActivities}
                placeholder="Enter text"
                disabled
                onChange={(e) => f.setHobbiesLeisureActivities(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>

        <Col
          xs={12}
          md="12"
          lg={6}
          className={`${!f.selectedValueMedical && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Medical Equipment</Form.Label>
              <span className="show-print-inline hidden">
                {f.selectedValueMedical
                  ?.map((status) => status?.label)
                  .join(", ")}
              </span>
              <div className="hidePrint">
                <CustomMultiSelectInput
                  className="w-100"
                  value={f.selectedValueMedical}
                  onChange={f.diagnosisSelect.selectedValueMedicalHandler}
                  options={f.diagnosisSelect.selectedValueMedicalOption}
                  isCreatable={true}
                  onKeyDown={f.diagnosisSelect.handleKeySelectedValueMedical}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          md="12"
          lg={6}
          className={`${!f.selectedValueSpecialPrecautions && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold w-100">
                Special Precautions
              </Form.Label>
              <span className="show-print-inline ms-2 hidden">
                {f.selectedValueSpecialPrecautions
                  ?.map((status) => status?.label)
                  .join(", ")}
              </span>
              <div className="hidePrint">
                <CustomMultiSelectInput
                  value={f.selectedValueSpecialPrecautions}
                  className="w-100"
                  onChange={
                    f.diagnosisSelect.selectedValueSpecialPrecautionsHandler
                  }
                  options={
                    f.diagnosisSelect.selectedValueSpecialPrecautionsOption
                  }
                  isCreatable={true}
                  onKeyDown={
                    f.diagnosisSelect.handleKeySelectedValueSpecialPrecautions
                  }
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
}

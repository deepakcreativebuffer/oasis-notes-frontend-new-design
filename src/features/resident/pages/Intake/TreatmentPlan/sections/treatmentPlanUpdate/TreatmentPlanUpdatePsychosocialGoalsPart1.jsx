/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Table,
  Container,
  Button,
} from "react-bootstrap";
import { useTreatmentPlanUpdateFormContext } from "../../context/TreatmentPlanUpdateFormContext";
import { BorderlessInput } from "@/utils/Makers";
import ReactQuill from "react-quill";
import { checkAnyValue } from "@/utils/utils";
import { formatDateToMMDDYYYY, extractParagraphText } from "@/utils/utils";

export default function TreatmentPlanUpdatePsychosocialGoalsPart1() {
  const f = useTreatmentPlanUpdateFormContext();
  return (
    <>
      <Row>
        <Form.Group className="d-flex justify-content-between">
          <Form.Label className="fw-bold ">
            Goals for Changes in the Resident psychosocial Interaction or
            Behaviors
          </Form.Label>
          <Form.Group className="d-flex align-items-center mb-2">
            <Form.Label className="fw-bold mb-md-0 flex-shrink-0">
              Desired measure
            </Form.Label>
            <BorderlessInput
              className="ms-2 border-bottom px-2 pe-none"
              value={f.desiredMeasure}
              setState={f.setDesiredMeasure}
              placeholder=""
              type="text"
            />
          </Form.Group>
        </Form.Group>
      </Row>

      <Row>
        <Col>
          {checkAnyValue(
            f.sobrietyEditorValue,
            f.sobrietyObjectivesEditorValue,
            f.sobrietyInterventionsEditorValue,
            f.admissionMeasure1,
            f.currentMeasure1,
            f.estimatedDateOfCompletion1,
            f.comments1,
            f.isMeasureMet1,
          ) && (
            <Card body className="mb-3">
              <Row>
                <Form.Label className="fw-bold !text-lg">
                  Measurables Treatment Goals
                </Form.Label>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline  md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Maintain sobriety :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.sobrietyEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Objective : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.sobrietyObjectivesEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Interventions : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.sobrietyInterventionsEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :
                      {extractParagraphText(f.admissionMeasure1)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure1)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion1
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion1)
                        : ""}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Progress towards goals :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.comments1}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">Measure Met</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="measureMet1"
                        checked={f.isMeasureMet1 === true}
                        onChange={() =>
                          f.setIsMeasureMet1((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet1"
                        checked={f.isMeasureMet1 === false}
                        onChange={() =>
                          f.setIsMeasureMet1((prev) =>
                            prev === false ? null : false,
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          )}
          {checkAnyValue(
            f.independentEditorValue,
            f.independentObjectivesEditorValue,
            f.independentInterventionsEditorValue,
            f.admissionMeasure2,
            f.currentMeasure2,
            f.estimatedDateOfCompletion2,
            f.comments2,
            f.isMeasureMet2,
          ) && (
            <Card body className="mb-3">
              <Row>
                <Form.Label className="fw-bold !text-lg">
                  Measurables Treatment Goals
                </Form.Label>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline  md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Independent Living Skills :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.independentEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Objective : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.independentObjectivesEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Interventions : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.independentInterventionsEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure2)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure2)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion2
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion2)
                        : ""}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Progress towards goals :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.comments2}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">Measure Met</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="measureMet1"
                        checked={f.isMeasureMet2 === true}
                        onChange={() =>
                          f.setIsMeasureMet2((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet2"
                        checked={f.isMeasureMet2 === false}
                        onChange={() =>
                          f.setIsMeasureMet2((prev) =>
                            prev === false ? null : false,
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          )}

          {checkAnyValue(
            f.employmentEditorValue,
            f.employmentObjectivesEditorValue,
            f.employmentInterventionsEditorValue,
            f.admissionMeasure3,
            f.currentMeasure3,
            f.estimatedDateOfCompletion3,
            f.comments3,
            f.isMeasureMet3,
          ) && (
            <Card body className="mb-3">
              <Row>
                <Form.Label className="fw-bold !text-lg">
                  Measurables Treatment Goals
                </Form.Label>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline  md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Employment : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.employmentEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Objective : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.employmentObjectivesEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Interventions : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.employmentInterventionsEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure3)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure3)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion3
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion3)
                        : ""}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Progress towards goals :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.comments3}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">Measure Met</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="measureMet1"
                        checked={f.isMeasureMet3 === true}
                        onChange={() =>
                          f.setIsMeasureMet3((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet3"
                        checked={f.isMeasureMet3 === false}
                        onChange={() =>
                          f.setIsMeasureMet3((prev) =>
                            prev === false ? null : false,
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          )}
          {checkAnyValue(
            f.adlsEditorValue,
            f.adlsObjectivesEditorValue,
            f.adlsInterventionsEditorValue,
            f.admissionMeasure4,
            f.currentMeasure4,
            f.estimatedDateOfCompletion4,
            f.comments4,
            f.isMeasureMet4,
          ) && (
            <Card body className="mb-3">
              <Row>
                <Form.Label className="fw-bold !text-lg">
                  Measurables Treatment Goals
                </Form.Label>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline  md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">ADLS : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.adlsEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Objective : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.adlsObjectivesEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Interventions : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.adlsInterventionsEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure4)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure4)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion4
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion4)
                        : ""}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Progress towards goals :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.comments4}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">Measure Met</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="measureMet4"
                        checked={f.isMeasureMet4 === true}
                        onChange={() =>
                          f.setIsMeasureMet4((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet4"
                        checked={f.isMeasureMet4 === false}
                        onChange={() =>
                          f.setIsMeasureMet4((prev) =>
                            prev === false ? null : false,
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          )}

          {checkAnyValue(
            f.safetyEditorValue,
            f.safetyObjectivesEditorValue,
            f.safetyInterventionsEditorValue,
            f.admissionMeasure5,
            f.currentMeasure5,
            f.estimatedDateOfCompletion5,
            f.comments5,
            f.isMeasureMet5,
          ) && (
            <Card body className="mb-3">
              <Row>
                <Form.Label className="fw-bold !text-lg">
                  Measurables Treatment Goals
                </Form.Label>
              </Row>

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline  md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Safety : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.safetyEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Objective : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.safetyObjectivesEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">Interventions : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.safetyInterventionsEditorValue}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure5)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure5)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion5
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion5)
                        : ""}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Progress towards goals :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.comments5}
                      readOnly={true}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Form.Group className="d-flex flex-column">
                    <Form.Label className="fw-bold">Measure Met</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="measureMet5"
                        checked={f.isMeasureMet5 === true}
                        onChange={() =>
                          f.setIsMeasureMet5((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet5"
                        checked={f.isMeasureMet5 === false}
                        onChange={() =>
                          f.setIsMeasureMet5((prev) =>
                            prev === false ? null : false,
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          )}
        </Col>
      </Row>
    </>
  );
}

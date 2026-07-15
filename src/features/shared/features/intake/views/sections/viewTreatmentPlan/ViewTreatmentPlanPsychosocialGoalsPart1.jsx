/** @format */

import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";
import ReactQuill from "react-quill";
import { checkAnyValue } from "@/utils/utils";
import { formatDateToMMDDYYYY, extractParagraphText } from "@/utils/utils";

export default function ViewTreatmentPlanPsychosocialGoalsPart1() {
  const f = useViewTreatmentPlanFormContext();
  return (
    <>
      <Row>
        <Col
          xs={12}
          sm={8}
          md={8}
          lg={8}
          className={`${!f.admissionMeasure1 && !f.currentMeasure1 && !f.estimatedDateOfCompletion1 && !f.comments1 && !f.admissionMeasure2 && f.option2?.length < 1 && !f.estimatedDateOfCompletion2 && !f.comments2 && !f.admissionMeasure3 && f.option3?.length < 1 && !f.currentMeasure3 && !f.estimatedDateOfCompletion3 && !f.comments3 && f.option4?.length < 1 && !f.admissionMeasure4 && !f.currentMeasure4 && !f.estimatedDateOfCompletion4 && !f.comments4 && f.option5?.length < 1 && !f.admissionMeasure5 && !f.currentMeasure5 && !f.estimatedDateOfCompletion5 && !f.comments5 && f.option6?.length < 1 && !f.admissionMeasure6 && !f.currentMeasure6 && !f.estimatedDateOfCompletion6 && !f.comments6 && !f.admissionMeasure7 && f.option7?.length < 1 && !f.currentMeasure7 && !f.estimatedDateOfCompletion7 && !f.comments7 && !f.admissionMeasure8 && f.option8?.length < 1 && !f.currentMeasure8 && !f.estimatedDateOfCompletion8 && !f.comments8 && "hide-data-on-view-print"}`}
        >
          <Form.Label className={`fw-bold w-100 mt-2`}>
            Goals for Changes in the Resident psychosocial Interaction or
            Behaviour
          </Form.Label>
        </Col>
        {f.desiredMeasure && (
          <Col
            xs={12}
            sm={4}
            md={4}
            lg={4}
            className={`text-sm-end ${!f.desiredMeasure && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid-inline mt-2">
              <p className="view-label fw-bold mb-2">Desired measure :</p>
              <h5 className="view-value"> {f.desiredMeasure}</h5>
            </div>
          </Col>
        )}
      </Row>
      <Row>
        <Col>
          <Form.Label className="fw-bold !text-lg">
            Measurables Treatment Goals
          </Form.Label>
        </Col>
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
              {/* <Row>
                      <Form.Label className="fw-bold !text-lg">
                        Measurables Treatment Goals
                      </Form.Label>
                     </Row> */}

              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid-inline  my-md-2 reactquillprint">
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
                <Col xs={4} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline my-md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure1)}
                    </p>
                  </div>
                </Col>
                <Col xs={4} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure1)}
                    </p>
                  </div>
                </Col>
                <Col xs={4} sm={4} md={6} lg={4} xxl={4}>
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
              {/* <Row>
                      <Form.Label className="fw-bold !text-lg">
                        Measurables Treatment Goals
                      </Form.Label>
                     </Row> */}

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
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure2)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure2)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
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
              {/* <Row>
                      <Form.Label className="fw-bold !text-lg">
                        Measurables Treatment Goals
                      </Form.Label>
                     </Row> */}

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
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure3)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure3)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
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
              {/* <Row>
                      <Form.Label className="fw-bold !text-lg">
                        Measurables Treatment Goals
                      </Form.Label>
                     </Row> */}

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
                {" "}
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
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure4)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure4)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
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
              {/* <Row>
                      <Form.Label className="fw-bold !text-lg">
                        Measurables Treatment Goals
                      </Form.Label>
                     </Row> */}

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
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Admission Measure :{" "}
                      {extractParagraphText(f.admissionMeasure5)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure5)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
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

/** @format */

import React from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";
import ReactQuill from "react-quill";
import { checkAnyValue } from "@/utils/utils";
import { formatDateToMMDDYYYY, extractParagraphText } from "@/utils/utils";

export default function ViewTreatmentPlanPsychosocialGoalsPart2() {
  const f = useViewTreatmentPlanFormContext();
  return (
    <>
      <Row>
        <Col>
          {checkAnyValue(
            f.medicationEditorValue,
            f.medicationObjectivesEditorValue,
            f.medicationInterventionsEditorValue,
            f.admissionMeasure6,
            f.currentMeasure6,
            f.estimatedDateOfCompletion6,
            f.comments6,
            f.isMeasureMet6,
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
                      Medication Education :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.medicationEditorValue}
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
                      value={f.medicationObjectivesEditorValue}
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
                      value={f.medicationInterventionsEditorValue}
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
                      {extractParagraphText(f.admissionMeasure6)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure6)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion6
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion6)
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
                      value={f.comments6}
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
                        id="measureMet6"
                        checked={f.isMeasureMet6 === true}
                        onChange={() =>
                          f.setIsMeasureMet6((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet6"
                        checked={f.isMeasureMet6 === false}
                        onChange={() =>
                          f.setIsMeasureMet6((prev) =>
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
            f.mentalHealthEditorValue,
            f.mentalHealthObjectivesEditorValue,
            f.mentalHealthInterventionsEditorValue,
            f.admissionMeasure7,
            f.currentMeasure7,
            f.estimatedDateOfCompletion7,
            f.comments7,
            f.isMeasureMet7,
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
                      Managing Mental Health :{" "}
                    </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.mentalHealthEditorValue}
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
                      value={f.mentalHealthObjectivesEditorValue}
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
                      value={f.mentalHealthInterventionsEditorValue}
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
                      {extractParagraphText(f.admissionMeasure7)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure7)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion7
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion7)
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
                      value={f.comments7}
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
                        id="measureMet7"
                        checked={f.isMeasureMet7 === true}
                        onChange={() =>
                          f.setIsMeasureMet7((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />{" "}
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet7"
                        checked={f.isMeasureMet7 === false}
                        onChange={() =>
                          f.setIsMeasureMet7((prev) =>
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
            f.legalEditorValue,
            f.legalObjectivesEditorValue,
            f.legalHealthInterventionsEditorValue,
            f.admissionMeasure8,
            f.currentMeasure8,
            f.estimatedDateOfCompletion8,
            f.comments8,
            f.isMeasureMet8,
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
                    <p className="view-label mb-2 fw-bold">Legal : </p>
                    <ReactQuill
                      theme="bubble"
                      value={f.legalEditorValue}
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
                      value={f.legalObjectivesEditorValue}
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
                      value={f.legalHealthInterventionsEditorValue}
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
                      {extractParagraphText(f.admissionMeasure8)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Current Measure :{" "}
                      {extractParagraphText(f.currentMeasure8)}
                    </p>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                  <div className="view-details-grid-inline md-2 reactquillprint">
                    <p className="view-label mb-2 fw-bold">
                      Target Date of Completion :{" "}
                      {f.estimatedDateOfCompletion8
                        ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion8)
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
                      value={f.comments8}
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
                        checked={f.isMeasureMet8 === true}
                        onChange={() =>
                          f.setIsMeasureMet8((prev) =>
                            prev === true ? null : true,
                          )
                        }
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="measureMet8"
                        checked={f.isMeasureMet8 === false}
                        onChange={() =>
                          f.setIsMeasureMet8((prev) =>
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
          {f.otherArray?.length > 0 &&
            f.otherArray?.map((data, index) => (
              <Card body className="mb-3" key={index}>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="view-details-grid-inline  md-2 reactquillprint">
                      <p className="view-label mb-2 fw-bold">
                        {(data?.goalTitle ?? "Other") || "Other"} :{" "}
                      </p>
                      <ReactQuill
                        theme="bubble"
                        value={data?.otherType}
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
                        value={data?.objectiveEdiorValue}
                        readOnly={true}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="view-details-grid-inline md-2 reactquillprint">
                      <p className="view-label mb-2 fw-bold">
                        Interventions :{" "}
                      </p>
                      <ReactQuill
                        theme="bubble"
                        value={data?.interventions}
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
                        {extractParagraphText(data?.admissionMeasure)}
                      </p>
                    </div>
                  </Col>
                  <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                    <div className="view-details-grid-inline md-2 reactquillprint">
                      <p className="view-label mb-2 fw-bold">
                        Current Measure :{" "}
                        {extractParagraphText(data?.currentMeasure)}
                      </p>
                    </div>
                  </Col>
                  <Col xs={12} sm={4} md={6} lg={4} xxl={4}>
                    <div className="view-details-grid-inline md-2 reactquillprint">
                      <p className="view-label mb-2 fw-bold">
                        Target Date of Completion :{" "}
                        {data?.estimatedDateOfCompletion
                          ? formatDateToMMDDYYYY(
                              data?.estimatedDateOfCompletion,
                            )
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
                        value={data?.comments}
                        readOnly={true}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <div className="view-details-grid-inline md-2 reactquillprint">
                      <p className="view-label mb-2 fw-bold">Measure Met : </p>
                      {data?.isMeasureMetOther ? "Yes" : "No"}
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}

          {/* commented table section continues in full backup */}
          {/* <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Table
                  responsive="md"
                  bordered
                  className={`table-fix-layout ${!f.admissionMeasure1 &&
                    !f.currentMeasure1 &&
                    !f.estimatedDateOfCompletion1 &&
                    !f.comments1 &&
                    !f.admissionMeasure2 &&
                    f.option2?.length < 1 &&
                    !f.estimatedDateOfCompletion2 &&
                    !f.comments2 &&
                    !f.admissionMeasure3 &&
                    f.option3?.length < 1 &&
                    !f.currentMeasure3 &&
                    !f.estimatedDateOfCompletion3 &&
                    !f.comments3 &&
                    f.option4?.length < 1 &&
                    !f.admissionMeasure4 &&
                    !f.currentMeasure4 &&
                    !f.estimatedDateOfCompletion4 &&
                    !f.comments4 &&
                    f.option5?.length < 1 &&
                    !f.admissionMeasure5 &&
                    !f.currentMeasure5 &&
                    !f.estimatedDateOfCompletion5 &&
                    !f.comments5 &&
                    f.option6?.length < 1 &&
                    !f.admissionMeasure6 &&
                    !f.currentMeasure6 &&
                    !f.estimatedDateOfCompletion6 &&
                    !f.comments6 &&
                    !f.admissionMeasure7 &&
                    f.option7?.length < 1 &&
                    !f.currentMeasure7 &&
                    !f.estimatedDateOfCompletion7 &&
                    !f.comments7 &&
                    !f.admissionMeasure8 &&
                    f.option8?.length < 1 &&
                    !f.currentMeasure8 &&
                    !f.estimatedDateOfCompletion8 &&
                    !f.comments8 &&
                    f.otherArray.length === 0 &&
                    "hide-data-on-view-print"
                    }`}
                >
                  <thead
                    className={`${!f.admissionMeasure1 &&
                      !f.currentMeasure1 &&
                      !f.estimatedDateOfCompletion1 &&
                      !f.comments1 &&
                      !f.admissionMeasure2 &&
                      f.option2?.length < 1 &&
                      !f.estimatedDateOfCompletion2 &&
                      !f.comments2 &&
                      !f.admissionMeasure3 &&
                      f.option3?.length < 1 &&
                      !f.currentMeasure3 &&
                      !f.estimatedDateOfCompletion3 &&
                      !f.comments3 &&
                      f.option4?.length < 1 &&
                      !f.admissionMeasure4 &&
                      !f.currentMeasure4 &&
                      !f.estimatedDateOfCompletion4 &&
                      !f.comments4 &&
                      f.option5?.length < 1 &&
                      !f.admissionMeasure5 &&
                      !f.currentMeasure5 &&
                      !f.estimatedDateOfCompletion5 &&
                      !f.comments5 &&
                      f.option6?.length < 1 &&
                      !f.admissionMeasure6 &&
                      !f.currentMeasure6 &&
                      !f.estimatedDateOfCompletion6 &&
                      !f.comments6 &&
                      !f.admissionMeasure7 &&
                      f.option7?.length < 1 &&
                      !f.currentMeasure7 &&
                      !f.estimatedDateOfCompletion7 &&
                      !f.comments7 &&
                      !f.admissionMeasure8 &&
                      f.option8?.length < 1 &&
                      !f.currentMeasure8 &&
                      !f.estimatedDateOfCompletion8 &&
                      !f.comments8 &&
                      f.otherArray.length === 0 &&
                      "hide-data-on-view-print"
                      }`}
                  >
                    <tr>
                      <th>Measurables Treatment Goals</th>
                      <th>Objectives</th>
                      <th>Admission Measure</th>
                      <th>Current Measure</th>
                      <th>Estimated Date of Goal Completion</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(f.option1?.length > 0 ||
                      f.admissionMeasure1 ||
                      f.currentMeasure1 ||
                      f.estimatedDateOfCompletion1 ||
                      f.comments1) && (
                        <tr
                          className={`${f.option1?.length < 1 &&
                            !f.admissionMeasure1 &&
                            !f.currentMeasure1 &&
                            !f.estimatedDateOfCompletion1 &&
                            !f.comments1 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold"> Maintain sobriety:</p>
                            <ul className="ps-3 mt-2">
                              {f.option1?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify"> 
                              <ul className="ps-3 mt-2">
                              {f.maintainSobrietyObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                            </td>
                          <td className="text-justify">{f.admissionMeasure1}</td>
                          <td className="text-justify">{f.currentMeasure1}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion1)}
                          </td>
                          <td className="text-justify">{f.comments1}</td>
                        </tr>
                      )}
                      {(f.admissionMeasure2 ||
                      f.option2?.length > 0 ||
                      f.estimatedDateOfCompletion2 ||
                      f.comments2 ||
                      f.currentMeasure2) && (
                        <tr
                          className={`${!f.admissionMeasure2 &&
                            f.option2?.length < 1 &&
                            !f.estimatedDateOfCompletion2 &&
                            !f.comments2 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold">
                              Independent Living Skills:
                            </p>
                            <ul className="ps-3 mt-2">
                              {f.option2?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                               <ul className="ps-3 mt-2">
                              {f.independentLivingSkillsObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                            </td>
                          <td className="text-justify">{f.admissionMeasure2}</td>
                          <td className="text-justify">{f.currentMeasure2}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion2)}
                          </td>
                          <td className="text-justify">{f.comments2}</td>
                        </tr>
                      )}
                      {(f.admissionMeasure3 ||
                      f.option3?.length > 0 ||
                      f.currentMeasure3 ||
                      f.estimatedDateOfCompletion3 ||
                      f.comments3) && (
                        <tr
                          className={`${!f.admissionMeasure3 &&
                            f.option3?.length < 1 &&
                            !f.currentMeasure3 &&
                            !f.estimatedDateOfCompletion3 &&
                            !f.comments3 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            <p className="mb-0 fw-bold"> Employment:</p>
                            <ul className="ps-3 mt-2">
                              {f.option3?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                                 <ul className="ps-3 mt-2">
                              {f.employmentObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                            
                          </td>
                          <td className="text-justify">{f.admissionMeasure3}</td>
                          <td className="text-justify">{f.currentMeasure3}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion3)}
                          </td>
                          <td className="text-justify">{f.comments3}</td>
                        </tr>
                      )}
                      {(f.option4?.length > 0 ||
                      f.admissionMeasure4 ||
                      f.currentMeasure4 ||
                      f.estimatedDateOfCompletion4 ||
                      f.comments4) && (
                        <tr
                          className={`${f.option4?.length < 1 &&
                            !f.admissionMeasure4 &&
                            !f.currentMeasure4 &&
                            !f.estimatedDateOfCompletion4 &&
                            !f.comments4 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold">ADLS:</p>
                            <ul className="ps-3 mt-2">
                              {f.option4?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                                 <ul className="ps-3 mt-2">
                              {f.adlsSecondObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">{f.admissionMeasure4}</td>
                          <td className="text-justify">{f.currentMeasure4}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion4)}
                          </td>
                          <td className="text-justify">{f.comments4}</td>
                        </tr>
                      )}
                      {(f.option5?.length > 0 ||
                      f.admissionMeasure5 ||
                      f.currentMeasure5 ||
                      f.estimatedDateOfCompletion5 ||
                      f.comments5) && (
                        <tr
                          className={`${f.option5?.length < 1 &&
                            !f.admissionMeasure5 &&
                            !f.currentMeasure5 &&
                            !f.estimatedDateOfCompletion5 &&
                            !f.comments5 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold">Safety:</p>
                            <ul className="ps-3 mt-2">
                              {f.option5?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                                      <ul className="ps-3 mt-2">
                              {f.safetyObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul></td>
                          <td className="text-justify">{f.admissionMeasure5}</td>
                          <td className="text-justify">{f.currentMeasure5}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion5)}
                          </td>
                          <td className="text-justify">{f.comments5}</td>
                        </tr>
                      )}
                      {(f.option6?.length > 0 ||
                      f.admissionMeasure6 ||
                      f.currentMeasure6 ||
                      f.estimatedDateOfCompletion6 ||
                      f.comments6) && (
                        <tr
                          className={`${f.option6?.length < 1 &&
                            !f.admissionMeasure6 &&
                            !f.currentMeasure6 &&
                            !f.estimatedDateOfCompletion6 &&
                            !f.comments6 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold"> Medication Education:</p>
                            <ul className="ps-3 mt-2">
                              {f.option6?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                            <ul className="ps-3 mt-2">
                              {f.medicationEducationObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                            </td>
                          <td className="text-justify">{f.admissionMeasure6}</td>
                          <td className="text-justify">{f.currentMeasure6}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion6)}
                          </td>
                          <td className="text-justify">{f.comments6}</td>
                        </tr>
                      )}
                      {(f.admissionMeasure7 ||
                      f.option7?.length > 0 ||
                      f.currentMeasure7 ||
                      f.estimatedDateOfCompletion7 ||
                      f.comments7) && (
                        <tr
                          className={`${!f.admissionMeasure7 &&
                            f.option7?.length < 1 &&
                            !f.currentMeasure7 &&
                            !f.estimatedDateOfCompletion7 &&
                            !f.comments7 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold">
                              {" "}
                              Managing Mental Health:
                            </p>
                            <ul className="ps-3 mt-2">
                              {f.option7?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                    key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                            <ul className="ps-3 mt-2">
                              {f.managingMentalHealthObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                            </td>
                          <td className="text-justify">{f.admissionMeasure7}</td>
                          <td className="text-justify">{f.currentMeasure7}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion7)}
                          </td>
                          <td className="text-justify">{f.comments7}</td>
                        </tr>
                      )}
                      {(f.admissionMeasure8 ||
                      f.option8?.length > 0 ||
                      f.currentMeasure8 ||
                      f.estimatedDateOfCompletion8 ||
                      f.comments8) && (
                        <tr
                          className={`${!f.admissionMeasure8 &&
                            f.option8?.length < 1 &&
                            !f.currentMeasure8 &&
                            !f.estimatedDateOfCompletion8 &&
                            !f.comments8 &&
                            "hide-data-on-view-print"
                            }`}
                        >
                          <td>
                            {" "}
                            <p className="mb-0 fw-bold">Legal:</p>
                            <ul className="ps-3 mt-2">
                              {f.option8?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                    key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="text-justify">
                               <ul className="ps-3 mt-2">
                              {f.legalObjective?.map((i, index) => (
                                <li
                                  className="mb-2 list-disc"
                                  key={index}
                                >
                                  {i.label}
                                </li>
                              ))}
                            </ul>
                            </td>
                          <td className="text-justify">{f.admissionMeasure8}</td>
                          <td className="text-justify">{f.currentMeasure8}</td>
                          <td className="text-justify">
                            {formatDateToMMDDYYYY(f.estimatedDateOfCompletion8)}
                          </td>
                          <td className="text-justify">{f.comments8}</td>
                        </tr>
                      )}
                      {f.otherArray.length > 0 &&
                      f.otherArray.map((data, index) => (
                        <tr
                          key={index}
                          className={`${!data?.otherType &&
                            !data?.admissionMeasure &&
                            !data?.currentMeasure &&
                            !data?.estimatedDateOfCompletion &&
                            !data?.comments &&
                            "hide-data-on-view-print"
                            }`}
                        >                           <td>
                            <p className="mb-0 fw-bold">
                              {(data?.goalTitle ?? "Other") || "Other"}:
                            </p>
                            <SafeHtml
                              html={`${data?.otherType
                                ?.split("\n")
                                ?.map(
                                  (value) =>
                                    value &&
                                    `<ul style="margin-top:0px;margin-bottom:10px;padding-left: 1rem;"><li style="list-style: disc;">${value}</li></ul>`
                                )
                                ?.join("")}`}
                            />
                          </td>
                          <SafeHtml
                            as="td"
                            html={`${data?.objective
                              ?.map(
                                (value) =>
                                  value &&
                                  `<ul style="margin-top:0px;margin-bottom:10px;padding-left: 1rem;"><li style="list-style: disc;">${value}</li></ul>`
                              )
                              ?.join("")}`}
                          />
                          <td className="text-justify">
                            {data?.admissionMeasure}
                          </td>
                          <td className="text-justify">
                            {data?.currentMeasure}
                          </td>
                          <td className="text-justify">
                            {data?.estimatedDateOfCompletion
                              ? formatDateToMMDDYYYY(
                                data?.estimatedDateOfCompletion
                              )
                              : ""}
                          </td>
                          <td>{data?.comments}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
             </Row> */}
          {(f.residentParticipation !== "undefined" ||
            f.residentParticipation) && (
            <div
              className={`${f.residentParticipation?.length < 1 && "hide-data-on-view-print"}`}
            >
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label fw-bold mb-1">
                      Resident overall participation in treatment :{" "}
                    </p>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="100%"
                        className="pe-none"
                        type="checkbox"
                        id="100%"
                        checked={f.residentParticipation?.includes("100%")}
                        onChange={() => f.setResidentParticipation("100%")}
                      />
                      <Form.Check
                        inline
                        label="75%"
                        className="pe-none"
                        type="checkbox"
                        id="75%"
                        checked={f.residentParticipation?.includes("75%")}
                        onChange={() => f.setResidentParticipation("75%")}
                      />
                      <Form.Check
                        inline
                        label="50%"
                        className="pe-none"
                        type="checkbox"
                        id="50%"
                        checked={f.residentParticipation?.includes("50%")}
                        onChange={() => f.setResidentParticipation("50%")}
                      />
                      <Form.Check
                        inline
                        label="25%"
                        className="pe-none"
                        type="checkbox"
                        id="25%"
                        checked={f.residentParticipation?.includes("25%")}
                        onChange={() => f.setResidentParticipation("25%")}
                      />
                      <Form.Check
                        inline
                        label="≤5%"
                        className="pe-none"
                        type="checkbox"
                        id="≤5%"
                        checked={f.residentParticipation?.includes("≤5%")}
                        onChange={() => f.setResidentParticipation("≤5%")}
                      />
                      <Form.Check
                        inline
                        label="Initial"
                        className="pe-none"
                        type="checkbox"
                        id="Initial"
                        checked={f.residentParticipation?.includes("Initial")}
                        onChange={() => f.setResidentParticipation("Initial")}
                      />
                      <Form.Check
                        inline
                        label="Other"
                        className="pe-none"
                        type="checkbox"
                        id="Other"
                        checked={f.residentParticipation?.includes("Other")}
                        onChange={() => f.setResidentParticipation("Other")}
                      />
                      {f.residentParticipation?.includes("Other") && (
                        <span className="view-value">
                          {f.residentParticipationOtherText}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
          {f.residentAttitute !== "undefined" && (
            <div
              className={`${!f.residentAttitute && "hide-data-on-view-print"}`}
            >
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label fw-bold mb-1">
                      Resident Attitude :{" "}
                    </p>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="Attentive"
                        className="pe-none"
                        type="checkbox"
                        id="Attentive"
                        checked={f.residentAttitute?.includes("Attentive")}
                        onChange={() => f.setResidentAttitute("Attentive")}
                      />
                      <Form.Check
                        inline
                        label="Supportive"
                        className="pe-none"
                        type="checkbox"
                        id="Supportive"
                        checked={f.residentAttitute?.includes("Supportive")}
                        onChange={() => f.setResidentAttitute("Supportive")}
                      />
                      <Form.Check
                        inline
                        label="Sharing"
                        className="pe-none"
                        type="checkbox"
                        id="Sharing"
                        checked={f.residentAttitute?.includes("Sharing")}
                        onChange={() => f.setResidentAttitute("Sharing")}
                      />
                      <Form.Check
                        inline
                        label="Intrusive"
                        className="pe-none"
                        type="checkbox"
                        id="Intrusive"
                        checked={f.residentAttitute?.includes("Intrusive")}
                        onChange={() => f.setResidentAttitute("Intrusive")}
                      />
                      <Form.Check
                        inline
                        label="Resistant"
                        className="pe-none"
                        type="checkbox"
                        id="Resistant"
                        checked={f.residentAttitute?.includes("Resistant")}
                        onChange={() => f.setResidentAttitute("Resistant")}
                      />
                      <Form.Check
                        inline
                        label="Initial"
                        className="pe-none"
                        type="checkbox"
                        id="Initialgfud"
                        checked={f.residentAttitute?.includes("Initial")}
                        onChange={() => f.setResidentAttitute("Initial")}
                      />
                      <Form.Check
                        inline
                        label="Other"
                        className="pe-none"
                        type="checkbox"
                        id="Other"
                        checked={f.residentAttitute?.includes("Other")}
                        onChange={() => f.setResidentAttitute("Other")}
                      />
                      {f.residentAttitute?.includes("Other") && (
                        <span className="view-value">
                          {f.residentAttituteOtherText}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
          {f.residentProgress !== "undefined" && (
            <div
              className={`${!f.residentProgress && "hide-data-on-view-print"}`}
            >
              <Row>
                <Col xs={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label fw-bold mb-1">
                      Resident progress :{" "}
                    </p>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        label="Deterioration"
                        className="pe-none"
                        type="checkbox"
                        id="Deterioration"
                        checked={f.residentProgress?.includes("Deterioration")}
                        onChange={() => f.setResidentProgress("Deterioration")}
                      />
                      <Form.Check
                        inline
                        label="No Progress"
                        className="pe-none"
                        type="checkbox"
                        id="No Progress"
                        checked={f.residentProgress?.includes("No Progress")}
                        onChange={() => f.setResidentProgress("No Progress")}
                      />
                      <Form.Check
                        inline
                        label="Small progress"
                        className="pe-none"
                        type="checkbox"
                        id="Small progress"
                        checked={f.residentProgress?.includes("Small progress")}
                        onChange={() => f.setResidentProgress("Small progress")}
                      />
                      <Form.Check
                        inline
                        label="Good Progress"
                        className="pe-none"
                        type="checkbox"
                        id="Good Progress"
                        checked={f.residentProgress?.includes("Good Progress")}
                        onChange={() => f.setResidentProgress("Good Progress")}
                      />
                      <Form.Check
                        inline
                        label="Goal achieved"
                        className="pe-none"
                        type="checkbox"
                        id="Goal achieved"
                        checked={f.residentProgress?.includes("Goal achieved")}
                        onChange={() => f.setResidentProgress("Goal achieved")}
                      />
                      <Form.Check
                        inline
                        label="Initial"
                        className="pe-none"
                        type="checkbox"
                        id="InitialGoal"
                        checked={f.residentProgress?.includes("Initial")}
                        onChange={() => f.setResidentProgress("Initial")}
                      />

                      <Form.Check
                        inline
                        label="Other"
                        className="pe-none"
                        type="checkbox"
                        id="Other"
                        checked={f.residentProgress?.includes("Other")}
                        onChange={() => f.setResidentProgress("Other")}
                      />
                      {f.residentProgress?.includes("Other") && (
                        <span className="view-value">
                          {f.residentProgressOtherText}
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}

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
import { useTreatmentPlanFormContext } from "../context/TreatmentPlanFormContext";
import TextEditor from "@/features/shared/ui/TextEditor/TextEditor";
import MultiSelectWithEditor from "@/features/shared/ui/MultiSelectWithEditor/MultiSelectEditor";
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import { formatDateToMMDDYYYY, extractParagraphText } from "@/utils/utils";

export default function TreatmentPlanPsychosocialGoalsSection() {
  const f = useTreatmentPlanFormContext();
  return (
    <>
      <Row>
        <Form.Group className="d-lg-flex justify-content-between">
          <Form.Label className="fw-bold ">
            Goals for Changes in the Resident psychosocial Interaction or
            Behaviors
          </Form.Label>
          <Form.Group className="d-flex align-items-center mb-2">
            <Form.Label className="fw-bold mb-md-0 flex-shrink-0">
              Desired measure
            </Form.Label>
            <BorderlessInput
              className="ms-2 border-bottom px-2"
              value={f.desiredMeasure}
              setState={f.setDesiredMeasure}
              placeholder=""
              type="text"
            />
          </Form.Group>
        </Form.Group>
      </Row>
      <Row>
        {/* Maintain sobriety */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Maintain sobriety</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option1}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption1(optionValue)
                  }
                  options={f.option1Option}
                  editorValue={f.sobrietyEditorValue}
                  setEditorValue={f.setSobrietyEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.sobrietyObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setSobrietyObjectivesSelected(optionValue)
                  }
                  options={f.objective1Option}
                  editorValue={f.sobrietyObjectivesEditorValue}
                  setEditorValue={f.setSobrietyObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions1}
                        setValue={f.setInterventions1}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.sobrietyInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setSobrietyInterventionsSelected(optionValue)
                  }
                  options={f.interventions1Option}
                  editorValue={f.sobrietyInterventionsEditorValue}
                  setEditorValue={f.setSobrietyInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3" controlId="rating1">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure1,
                        f.setAdmissionMeasure1Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure1)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure1Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure1Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3" controlId="rating1">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure1,
                        f.setCurrentMeasure1Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure1)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure1Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure1Error}
                  </Form.Control.Feedback>
                  {/* <TextEditor value={f.admissionMeasure1} setValue={f.setAdmissionMeasure1} /> */}
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion1)}
                  className={`form-control ${!f.estimatedDateOfCompletion1 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion1(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion1
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion1)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments1} setValue={f.setComment1} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet1a"
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
                      id="measureMet1b"
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
          </Row>
        </Card>
        {/* Independent Living Skills */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">
                  Independent Living Skills
                </Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option2}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption2(optionValue)
                  }
                  options={f.option2Option}
                  editorValue={f.independentEditorValue}
                  setEditorValue={f.setIndependentEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.independentObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setIndependentObjectivesSelected(optionValue)
                  }
                  options={f.objective2Option}
                  editorValue={f.independentObjectivesEditorValue}
                  setEditorValue={f.setIndependentObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions2}
                        setValue={f.setInterventions2}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.independentInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setIndependentInterventionsSelected(optionValue)
                  }
                  options={f.interventions2Option}
                  editorValue={f.independentInterventionsEditorValue}
                  setEditorValue={f.setIndependentInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure2,
                        f.setAdmissionMeasure2Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure2)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure2Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure2Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure2,
                        f.setCurrentMeasure2Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure2)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure2Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure2Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion2)}
                  className={`form-control ${!f.estimatedDateOfCompletion2 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion2(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion2
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion2)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments2} setValue={f.setComment2} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet2a"
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
                      id="measureMet2b"
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
          </Row>
        </Card>
        {/* Employment */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Employment</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option3}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption3(optionValue)
                  }
                  options={f.option3Option}
                  editorValue={f.employmentEditorValue}
                  setEditorValue={f.setEmploymentEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.employmentObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setEmploymentObjectivesSelected(optionValue)
                  }
                  options={f.objective3Option}
                  editorValue={f.employmentObjectivesEditorValue}
                  setEditorValue={f.setEmploymentObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions3}
                        setValue={f.setInterventions3}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.employmentInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setEmploymentInterventionsSelected(optionValue)
                  }
                  options={f.interventions3Option}
                  editorValue={f.employmentInterventionsEditorValue}
                  setEditorValue={f.setEmploymentInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure3,
                        f.setAdmissionMeasure3Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure3)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure3Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure3Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure3,
                        f.setCurrentMeasure3Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure3)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure3Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure3Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion3)}
                  className={`form-control ${!f.estimatedDateOfCompletion3 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion3(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion3
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion3)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments3} setValue={f.setComment3} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet3a"
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
                      id="measureMet3b"
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
          </Row>
        </Card>
        {/* ADLS */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">ADLS</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option4}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption4(optionValue)
                  }
                  options={f.option4Option}
                  editorValue={f.adlsEditorValue}
                  setEditorValue={f.setAdlsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.adlsObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setAdlsObjectivesSelected(optionValue)
                  }
                  options={f.objective4Option}
                  editorValue={f.adlsObjectivesEditorValue}
                  setEditorValue={f.setAdlsObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions4}
                        setValue={f.setInterventions4}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.adlsInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setAdlsInterventionsSelected(optionValue)
                  }
                  options={f.interventions4Option}
                  editorValue={f.adlsInterventionsEditorValue}
                  setEditorValue={f.setAdlsInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure4,
                        f.setAdmissionMeasure4Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure4)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure4Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure4Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure4,
                        f.setCurrentMeasure3Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure4)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure4Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure4Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion4)}
                  className={`form-control ${!f.estimatedDateOfCompletion4 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion4(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion4
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion4)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments4} setValue={f.setComment4} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet4a"
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
                      id="measureMet4b"
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
          </Row>
        </Card>
        {/* Safety */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Safety</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option5}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption5(optionValue)
                  }
                  options={f.option5Option}
                  editorValue={f.safetyEditorValue}
                  setEditorValue={f.setSafetyEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.safetyObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setSafetyObjectivesSelected(optionValue)
                  }
                  options={f.objective5Option}
                  editorValue={f.safetyObjectivesEditorValue}
                  setEditorValue={f.setSafetyObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions5}
                        setValue={f.setInterventions5}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.safetyInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setSafetyInterventionsSelected(optionValue)
                  }
                  options={f.interventions5Option}
                  editorValue={f.safetyInterventionsEditorValue}
                  setEditorValue={f.setSafetyInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure5,
                        f.setAdmissionMeasure5Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure5)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure5Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure5Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure5,
                        f.setCurrentMeasure5Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure5)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure5Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure5Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion5)}
                  className={`form-control ${!f.estimatedDateOfCompletion5 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion5(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion5
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion5)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments5} setValue={f.setComment5} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet5a"
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
                      id="measureMet5b"
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
          </Row>
        </Card>
        {/* Medication */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Medication</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option6}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption6(optionValue)
                  }
                  options={f.option6Option}
                  editorValue={f.medicationEditorValue}
                  setEditorValue={f.setMedicationEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.medicationObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setMedicationObjectivesSelected(optionValue)
                  }
                  options={f.objective6Option}
                  editorValue={f.medicationObjectivesEditorValue}
                  setEditorValue={f.setMedicationObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions6}
                        setValue={f.setInterventions6}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.medicationInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setMedicationInterventionsSelected(optionValue)
                  }
                  options={f.interventions6Option}
                  editorValue={f.medicationEducationInterventionsEditorValue}
                  setEditorValue={
                    f.setMedicationEducationInterventionsEditorValue
                  }
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure6,
                        f.setAdmissionMeasure6Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure6)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure6Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure6Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure6,
                        f.setCurrentMeasure6Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure6)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure6Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure6Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion6)}
                  className={`form-control ${!f.estimatedDateOfCompletion6 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion6(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion6
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion6)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments6} setValue={f.setComment6} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet6a"
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
                      id="measureMet6b"
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
          </Row>
        </Card>
        {/* Mental Health */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">
                  Managing Mental Health
                </Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option7}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption7(optionValue)
                  }
                  options={f.option7Option}
                  editorValue={f.mentalHealthEditorValue}
                  setEditorValue={f.setMentalHealthEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.mentalHealthObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setMentalHealthObjectivesSelected(optionValue)
                  }
                  options={f.objective7Option}
                  editorValue={f.mentalHealthObjectivesEditorValue}
                  setEditorValue={f.setMentalHealthObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions7}
                        setValue={f.setInterventions7}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.mentalHealthInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setMentalHealthInterventionsSelected(optionValue)
                  }
                  options={f.interventions7Option}
                  editorValue={f.mentalHealthInterventionsEditorValue}
                  setEditorValue={f.setMentalHealthInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure7,
                        f.setAdmissionMeasure7Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure7)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure7Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure7Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure7,
                        f.setCurrentMeasure7Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure7)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure7Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure7Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion7)}
                  className={`form-control ${!f.estimatedDateOfCompletion7 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion7(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion7
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion7)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments7} setValue={f.setComment7} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet7a"
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
                      id="measureMet7b"
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
          </Row>
        </Card>
        {/* Legal */}
        <Card body className="mb-3">
          <Row>
            <Form.Label className="fw-bold !text-lg">
              Measurables Treatment Goals
            </Form.Label>
          </Row>
          <Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold">Legal</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.option8}
                  setMultiSelectValue={(optionValue) =>
                    f.setOption8(optionValue)
                  }
                  options={f.option8Option}
                  editorValue={f.legalEditorValue}
                  setEditorValue={f.setLegalEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Objectives</Form.Label>
                <MultiSelectWithEditor
                  multiSelectValue={f.legalObjectivesSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setLegalObjectivesSelected(optionValue)
                  }
                  options={f.objective8Option}
                  editorValue={f.legalObjectivesEditorValue}
                  setEditorValue={f.setLegalObjectivesEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold">Interventions</Form.Label>
                {/* <TextEditor
                        value={f.interventions8}
                        setValue={f.setInterventions8}
                       /> */}
                <MultiSelectWithEditor
                  multiSelectValue={f.legalHealthInterventionsSelected}
                  setMultiSelectValue={(optionValue) =>
                    f.setLegalHealthInterventionsSelected(optionValue)
                  }
                  options={f.interventions8Option}
                  editorValue={f.legalInterventionsEditorValue}
                  setEditorValue={f.setLegalInterventionsEditorValue}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Admission Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setAdmissionMeasure8,
                        f.setAdmissionMeasure8Error,
                      )
                    }
                    value={extractParagraphText(f.admissionMeasure8)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.admissionMeasure8Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.admissionMeasure8Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Current Measure</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      f.handleRatingChange(
                        e,
                        f.setCurrentMeasure8,
                        f.setCurrentMeasure8Error,
                      )
                    }
                    value={extractParagraphText(f.currentMeasure8)}
                    type="text"
                    placeholder="Enter Rating like: (1/10)"
                    isInvalid={!!f.currentMeasure8Error}
                  />
                  <Form.Control.Feedback type="invalid">
                    {f.currentMeasure8Error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
                <Form.Label className="fw-bold w-full">
                  Target Date of Completion
                </Form.Label>
                <DatePicker
                  isClearable
                  selected={formatDateToMMDDYYYY(f.estimatedDateOfCompletion8)}
                  className={`form-control ${!f.estimatedDateOfCompletion8 && "table-row-hide-print"}`}
                  onChange={(selectedDate) =>
                    f.setEstimatedDateOfCompletion8(
                      selectedDate?.toDateString(),
                    )
                  }
                  dateFormat="MM/dd/yyyy"
                  placeholderText="MM/DD/YYYY"
                  highlightDates={[
                    {
                      "react-datepicker__day--highlighted-custom": [
                        f.estimatedDateOfCompletion8
                          ? formatDateToMMDDYYYY(f.estimatedDateOfCompletion8)
                          : new Date(),
                      ],
                    },
                  ]}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xxl={12}>
                <Form.Label className="fw-bold mt-3">
                  Progress towards goals
                </Form.Label>
                <TextEditor value={f.comments8} setValue={f.setComment8} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Group className="d-flex flex-column mb-3">
                  <Form.Label className="fw-bold">Measure Met</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label="Yes"
                      type="checkbox"
                      id="measureMet8a"
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
                      id="measureMet8b"
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
          </Row>
        </Card>
      </Row>
    </>
  );
}

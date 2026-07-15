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
import { AiFillDelete } from "react-icons/ai";
import {
  formatDateToMMDDYYYY,
  checkMultiValues,
  extractParagraphText,
} from "@/utils/utils";

export default function TreatmentPlanObjectivesMeasuresSection() {
  const f = useTreatmentPlanFormContext();
  return (
    <>
      {f.otherArray?.map((data, index) => (
        <Card body className="mb-3" key={index}>
          <Row>
            <Col className="d-flex justify-content-end">
              <span className="del-btn">
                <AiFillDelete onClick={() => f.handleDelete(index)} />
              </span>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Goal Title</Form.Label>
                <Form.Control
                  value={data.goalTitle ?? "Other"}
                  placeholder="Enter goal title"
                  onChange={(e) =>
                    f.handleChange(index, "goalTitle", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Form.Label className="fw-bold">Other</Form.Label>
              <TextEditor
                value={data.otherType}
                setValue={(val) => f.handleChange(index, "otherType", val)}
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12}>
              <Form.Label className="fw-bold">Objectives</Form.Label>
              <TextEditor
                value={data.objectiveEdiorValue}
                setValue={(val) =>
                  f.handleChange(index, "objectiveEdiorValue", val)
                }
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12}>
              <Form.Label className="fw-bold">Interventions</Form.Label>
              <TextEditor
                value={data.intervention}
                setValue={(val) => f.handleChange(index, "intervention", val)}
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Admission Measure</Form.Label>
                <Form.Control
                  value={extractParagraphText(data.admissionMeasure)}
                  onChange={(e) =>
                    f.handleRatingChange(
                      e,
                      (val) => f.handleChange(index, "admissionMeasure", val),
                      (err) =>
                        f.handleChange(index, "admissionMeasureError", err),
                    )
                  }
                  isInvalid={!!data.admissionMeasureError}
                />
                <Form.Control.Feedback type="invalid">
                  {data.admissionMeasureError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6} lg={4} xxl={4}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Current Measure</Form.Label>
                <Form.Control
                  value={extractParagraphText(data.currentMeasure)}
                  onChange={(e) =>
                    f.handleRatingChange(
                      e,
                      (val) => f.handleChange(index, "currentMeasure", val),
                      (err) =>
                        f.handleChange(index, "currentMeasureError", err),
                    )
                  }
                  isInvalid={!!data.currentMeasureError}
                />
                <Form.Control.Feedback type="invalid">
                  {data.currentMeasureError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xxl={4}
              className="d-flex flex-col"
            >
              <Form.Label className="fw-bold">
                Target Date of Completion
              </Form.Label>
              <DatePicker
                isClearable
                selected={
                  data.estimatedDateOfCompletion
                    ? new Date(data.estimatedDateOfCompletion)
                    : null
                }
                onChange={(date) =>
                  f.handleChange(index, "estimatedDateOfCompletion", date)
                }
                className="form-control"
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12}>
              <Form.Label className="fw-bold">
                Progress towards goals
              </Form.Label>
              <TextEditor
                value={data.comments}
                setValue={(val) => f.handleChange(index, "comments", val)}
              />
            </Col>
          </Row>

          <Row className="mt-3">
            <Col xs={12}>
              <Form.Group className="d-flex flex-column">
                <Form.Label className="fw-bold">Measure Met</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Yes"
                    type="checkbox"
                    checked={data.isMeasureMet === true}
                    onChange={() => f.handleChange(index, "isMeasureMet", true)}
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="checkbox"
                    checked={data.isMeasureMet === false}
                    onChange={() =>
                      f.handleChange(index, "isMeasureMet", false)
                    }
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card>
      ))}
      <Row className="my-3">
        <Col xs={12} sm={12} className="text-center">
          <Button
            type="button"
            className="theme-button hidePrint"
            onClick={f.handleAddButtonClick}
          >
            ADD
          </Button>
        </Col>
      </Row>
      {/* <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Table
                  responsive="md"
                  bordered
                  className="fixed-table-data-treatment-plan"
                >
                  <thead className="overflow-clip">
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
                    <tr
                      className={`${
                        f.option1?.length < 1 &&
                        !f.currentMeasure1 &&
                        !f.estimatedDateOfCompletion1 &&
                        !f.comments1 &&
                        "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">
                          Maintain sobriety:
                        </Form.Label>
                     
                        <MultiSelectWithEditor
                          multiSelectValue={f.option1}
                          setMultiSelectValue={option1Handler}
                          options={f.option1Option}
                          editorValue={f.editorValue}
                          setEditorValue={f.setEditorValue}
                        />
                      </td>
                      <td>
                 
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={maintainSobrietyObjective}
                          onChange={setMaintainSobrietyObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${
                            !f.admissionMeasure1 && "table-row-hide-print"
                          }`}
                          type="text"
                          value={f.admissionMeasure1}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure1(e.target.value)}
                        ></Form.Control>
                      </td>
                        <td>
                        <Form.Control
                          as="textarea"
                          className={`${
                            !f.currentMeasure1 && "table-row-hide-print"
                          }`}
                          type="text"
                          value={f.currentMeasure1}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure1(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion1
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion1 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion1(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion1
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion1
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div
                          className={`${!f.comments1 && "table-row-hide-print"}`}
                        >
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments1 ? f.comments1.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments1 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment1(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment1(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      <tr
                      className={`${
                        f.option2?.length < 1 &&
                        !f.admissionMeasure2 &&
                        !f.currentMeasure2 &&
                        !f.estimatedDateOfCompletion2 &&
                        !f.comments2 &&
                        "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">
                          Independent Living Skills:
                        </Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option2Option}
                          value={f.option2}
                          onChange={f.option2Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption2}
                        />
                      </td>
                      <td>
                 
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={independentLivingSkillsObjective}
                          onChange={setIndependentLivingSkillsObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          type="text"
                          className={`${!f.admissionMeasure2 && "hidePrint"}`}
                          value={f.admissionMeasure2}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure2(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          type="text"
                          className={`${!f.currentMeasure2 && "hidePrint"}`}
                          value={f.currentMeasure2}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure2(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion2
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion2 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion2(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion2
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion2
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div className={`${!f.comments2 && "hidePrint"}`}>
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments2 ? f.comments2.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments2 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment2(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment2(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      <tr
                      className={`${
                        f.option3?.length < 1 &&
                        !f.admissionMeasure3 &&
                        !f.currentMeasure3 &&
                        !f.estimatedDateOfCompletion3 &&
                        !f.comments3 &&
                        "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">
                          {" "}
                          Employment:
                        </Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option3Option}
                          value={f.option3}
                          onChange={f.option3Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption3}
                        />
                      </td>
                      <td>
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={employmentObjective}
                          onChange={setEmploymentObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.admissionMeasure3 && "hidePrint"}`}
                          type="text"
                          value={f.admissionMeasure3}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure3(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          type="text"
                          className={`${!f.currentMeasure3 && "hidePrint"}`}
                          value={f.currentMeasure3}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure3(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion3
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion3 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion3(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion3
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion3
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div className={`${!f.comments3 && "hidePrint"}`}>
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments3 ? f.comments3.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments3 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment3(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment3(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      <tr
                      className={`${
                        f.option4?.length < 1 &&
                        !f.admissionMeasure4 &&
                        !f.currentMeasure4 &&
                        !f.estimatedDateOfCompletion4 &&
                        "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">ADLS:</Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option4Option}
                          value={f.option4}
                          onChange={f.option4Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption4}
                        />
                      </td>
                      <td>
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={adlsSecondObjective}
                          onChange={setAdlsSecondObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.admissionMeasure4 && "hidePrint"}`}
                          value={f.admissionMeasure4}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure4(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          type="text"
                          className={`${!f.currentMeasure4 && "hidePrint"}`}
                          value={f.currentMeasure4}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure4(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion4
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion4 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion4(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion4
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion4
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div className={`${!f.comments4 && "hidePrint"}`}>
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments4 ? f.comments4.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments4 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment4(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment4(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      <tr
                      className={`${
                        f.option5?.length < 1 &&
                        !f.admissionMeasure5 &&
                        !f.currentMeasure5 &&
                        !f.estimatedDateOfCompletion5 &&
                        "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">Safety:</Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option5Option}
                          value={f.option5}
                          onChange={f.option5Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption5}
                        />
                      </td>
                      <td>
                
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={safetyObjective}
                          onChange={setSafetyObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.admissionMeasure5 && "hidePrint"}`}
                          value={f.admissionMeasure5}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure5(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.currentMeasure5 && "hidePrint"}`}
                          value={f.currentMeasure5}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure5(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion5
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion5 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion5(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion5
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion5
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div className={`${!f.comments5 && "hidePrint"}`}>
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments5 ? f.comments5.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments5 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment5(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment5(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      <tr
                      className={`${
                        f.option6?.length < 1 &&
                        !f.admissionMeasure6 &&
                        !f.currentMeasure6 &&
                        !f.estimatedDateOfCompletion6 &&
                        "table-row-hide-print"
                      } treatment-word-wrap`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">
                          Medication Education:
                        </Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option6Option}
                          value={f.option6}
                          onChange={f.option6Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption6}
                        />
                      </td>
                      <td>
               
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={medicationEducationObjective}
                          onChange={setMedicationEducationObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.admissionMeasure6 && "hidePrint"}`}
                          value={f.admissionMeasure6}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure6(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.currentMeasure6 && "hidePrint"}`}
                          value={f.currentMeasure6}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure6(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion6
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion6 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion6(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion6
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion6
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div className={`${!f.comments6 && "hidePrint"}`}>
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments6 ? f.comments6.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments6 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment6(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment6(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      <tr
                      className={`${
                        f.option7?.length < 1 &&
                        !f.admissionMeasure7 &&
                        !f.currentMeasure7 &&
                        !f.estimatedDateOfCompletion7 &&
                        "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">
                          Managing Mental Health:
                        </Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option7Option}
                          value={f.option7}
                          onChange={f.option7Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption7}
                        />
                      </td>
                      <td>
                     
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={managingMentalHealthObjective}
                          onChange={setManagingMentalHealthObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          value={f.admissionMeasure7}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure7(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.currentMeasure7 && "hidePrint"}`}
                          type="text"
                          value={f.currentMeasure7}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure7(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion7
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion7 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion7(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion7
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion7
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div className={`${!f.comments7 && "hidePrint"}`}>
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments7 ? f.comments7.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments7 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment7(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment7(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                    <tr
                      className={`${
                        f.option8?.length < 1 && "table-row-hide-print"
                      }`}
                    >
                      <td>
                        {" "}
                        <Form.Label className="fw-bold">Legal:</Form.Label>
                        <SelectMultiPrint
                          isMulti
                          options={f.option8Option}
                          value={f.option8}
                          onChange={f.option8Handler}
                          isCreatable={true}
                          onKeyDown={f.handleKeyOption8}
                        />
                      </td>
                      <td>
                 
                        <SelectMultiPrint
                          isMulti
                          options={[]}
                          value={legalObjective}
                          onChange={setLegalObjective}
                          isCreatable={true}
                        />
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.admissionMeasure8 && "hidePrint"}`}
                          value={f.admissionMeasure8}
                          placeholder=""
                          required
                          onChange={(e) => f.setAdmissionMeasure8(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <Form.Control
                          as="textarea"
                          className={`${!f.currentMeasure8 && "hidePrint"}`}
                          value={f.currentMeasure8}
                          placeholder=""
                          required
                          onChange={(e) => f.setCurrentMeasure8(e.target.value)}
                        ></Form.Control>
                      </td>
                      <td>
                        <DatePicker
                          selected={formatDateToMMDDYYYY(
                            f.estimatedDateOfCompletion8
                          )}
                          className={`form-control ${
                            !f.estimatedDateOfCompletion8 &&
                            "table-row-hide-print"
                          }`}
                          onChange={(selectedDate) =>
                            f.setEstimatedDateOfCompletion8(
                              selectedDate?.toDateString()
                            )
                          }
                          dateFormat="MM/dd/yyyy"
                          placeholderText="MM/DD/YYYY"
                          highlightDates={[
                            {
                              "react-datepicker__day--highlighted-custom": [
                                f.estimatedDateOfCompletion8
                                  ? formatDateToMMDDYYYY(
                                      f.estimatedDateOfCompletion8
                                    )
                                  : new Date(),
                              ],
                            },
                          ]}
                        />
                      </td>
                      <td>
                        <div
                          className={`${!f.comments8 && "table-row-hide-print"}`}
                        >
                          <Form.Control
                            as="textarea"
                            rows={Math.max(
                              f.comments8 ? f.comments8.split("\n")?.length : 1,
                              1
                            )}
                            value={f.comments8 || ""}
                            placeholder=""
                            onChange={(e) => f.setComment8(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setComment8(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </div>
                      </td>
                    </tr>
                      
                      {f.showOther && (
                      <tr
                        className={`${!f.optionOther && "table-row-hide-print"}`}
                      >
                        <td>
                          <Form.Group>
                            <Form.Label className="fw-bold">Other:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={Math.max(
                                f.optionOther
                                  ? f.optionOther.split("\n")?.length
                                  : 1,
                                1
                              )}
                              value={f.optionOther || ""}
                              placeholder=""
                              onChange={(e) => f.setOptionOther(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  f.setOptionOther(
                                    (prevComment) => prevComment + "\n"
                                  );
                                }
                              }}
                            ></Form.Control>
                          </Form.Group>
                        </td>
                        <td>
              
                          <SelectMultiPrint
                            isMulti
                            options={[]}
                            value={f.objectiveOther}
                            onChange={f.setObjectiveOther}
                            isCreatable={true}
                          />
                        </td>
                        <td>
                          <Form.Control
                            as="textarea"
                            value={f.admissionMeasureOther}
                            className={`${
                              !f.admissionMeasureOther && "hidePrint"
                            }`}
                            placeholder=""
                            required
                            onChange={(e) =>
                              f.setAdmissionMeasureOther(e.target.value)
                            }
                          ></Form.Control>
                        </td>
                        <td>
                          <Form.Control
                            as="textarea"
                            className={`${!f.currentMeasureOther && "hidePrint"}`}
                            value={f.currentMeasureOther}
                            placeholder=""
                            required
                            onChange={(e) =>
                              f.setCurrentMeasureOther(e.target.value)
                            }
                          ></Form.Control>
                        </td>
                        <td>
                          <DatePicker
                            selected={formatDateToMMDDYYYY(
                              f.estimatedDateOfCompletionOther
                            )}
                            onChange={(selectedDate) =>
                              f.setEstimatedDateOfCompletionOther(
                                selectedDate?.toDateString()
                              )
                            }
                            dateFormat="MM/dd/yyyy"
                            placeholderText="MM/DD/YYYY"
                            className={`form-control ${
                              !f.estimatedDateOfCompletionOther && "hidePrint"
                            }`}
                            highlightDates={[
                              {
                                "react-datepicker__day--highlighted-custom": [
                                  f.estimatedDateOfCompletionOther
                                    ? formatDateToMMDDYYYY(
                                        f.estimatedDateOfCompletionOther
                                      )
                                    : new Date(),
                                ],
                              },
                            ]}
                          />
                        </td>
                        <td>
                          <Form.Control
                            as="textarea"
                            className={`${
                              commentsOther?.length < 1 && "hidePrint"
                            }`}
                            rows={Math.max(commentsOther.split("\n")?.length, 1)}
                            value={commentsOther}
                            placeholder=""
                            onChange={(e) => f.setCommentOther(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                f.setCommentOther(
                                  (prevComment) => prevComment + "\n"
                                );
                              }
                            }}
                          ></Form.Control>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
             </Row> */}

      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">
                Resident overall participation in treatment:{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="100%"
                  type="checkbox"
                  id="100%"
                  checked={f.residentParticipation?.includes("100%")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "100%",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="75%"
                  type="checkbox"
                  id="75%"
                  checked={f.residentParticipation?.includes("75%")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "75%",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="50%"
                  type="checkbox"
                  id="50%"
                  checked={f.residentParticipation?.includes("50%")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "50%",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="25%"
                  type="checkbox"
                  id="25%"
                  checked={f.residentParticipation?.includes("25%")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "25%",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="≤5%"
                  type="checkbox"
                  id="≤5%"
                  checked={f.residentParticipation?.includes("≤5%")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "≤5%",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Initial"
                  type="checkbox"
                  id="Initial"
                  checked={f.residentParticipation?.includes("Initial")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "Initial",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  id="residentParticipationOther"
                  checked={f.residentParticipation?.includes("Other")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentParticipation,
                      f.residentParticipation,
                      "Other",
                    )
                  }
                />
                {f.residentParticipation?.includes("Other") && (
                  <BorderlessInput
                    value={f.residentParticipationOtherText}
                    setState={f.setResidentParticipationOtherText}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Resident Attitude</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Attentive"
                  type="checkbox"
                  id="Attentive"
                  checked={f.residentAttitute?.includes("Attentive")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Attentive",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Supportive"
                  type="checkbox"
                  id="Supportive"
                  checked={f.residentAttitute?.includes("Supportive")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Supportive",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Sharing"
                  type="checkbox"
                  id="Sharing"
                  checked={f.residentAttitute?.includes("Sharing")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Sharing",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Intrusive"
                  type="checkbox"
                  id="Intrusive"
                  checked={f.residentAttitute?.includes("Intrusive")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Intrusive",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Resistant"
                  type="checkbox"
                  id="Resistant"
                  checked={f.residentAttitute?.includes("Resistant")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Resistant",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Initial"
                  type="checkbox"
                  id="Initialgfud"
                  checked={f.residentAttitute?.includes("Initial")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Initial",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  id="residentAttituteOther"
                  checked={f.residentAttitute?.includes("Other")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentAttitute,
                      f.residentAttitute,
                      "Other",
                    )
                  }
                />
                {f.residentAttitute?.includes("Other") && (
                  <BorderlessInput
                    value={f.residentAttituteOtherText}
                    setState={f.setResidentAttituteOtherText}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">Resident progress</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Deterioration"
                  type="checkbox"
                  id="Deterioration"
                  checked={f.residentProgress?.includes("Deterioration")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "Deterioration",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="No Progress"
                  type="checkbox"
                  id="No Progress"
                  checked={f.residentProgress?.includes("No Progress")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "No Progress",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Small progress"
                  type="checkbox"
                  id="Small progress"
                  checked={f.residentProgress?.includes("Small progress")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "Small progress",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Good Progress"
                  type="checkbox"
                  id="Good Progress"
                  checked={f.residentProgress?.includes("Good Progress")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "Good Progress",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Goal achieved"
                  type="checkbox"
                  id="Goal achieved"
                  checked={f.residentProgress?.includes("Goal achieved")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "Goal achieved",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Initial"
                  type="checkbox"
                  id="InitialGoal"
                  checked={f.residentProgress?.includes("Initial")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "Initial",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  id="residentProgressOther"
                  checked={f.residentProgress?.includes("Other")}
                  onChange={() =>
                    checkMultiValues(
                      f.setResidentProgress,
                      f.residentProgress,
                      "Other",
                    )
                  }
                />
                {f.residentProgress?.includes("Other") && (
                  <BorderlessInput
                    value={f.residentProgressOtherText}
                    setState={f.setResidentProgressOtherText}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
    </>
  );
}

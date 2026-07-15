/** @format */

import React from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { BorderlessInput } from "@/utils/Makers";
import { useInitialAssessmentFormContext } from "../context/InitialAssessmentFormContext";

export default function DiagnosesStressorsSection() {
  const f = useInitialAssessmentFormContext();
  return (
    <>
      <Card body className="mb-3">
        <Form.Group>
          <Form.Label className="fw-bold">
            Considering the responses to the above risk factors in combination
            with all the other information you know about the person (gender,
            age, diagnosis, balancing factors-resiliency and supports, would you
            rate the level of risk for this person for danger to self (DTS) as:
          </Form.Label>
          <div className="radio-inline">
            <Form.Check
              inline
              label="No Risk"
              id="No Risk"
              type="checkbox"
              checked={f.riskLevel === "No Risk"}
              onChange={() => f.setRiskLevel("No Risk")}
            />
            <Form.Check
              inline
              label="Low Risk"
              id="Low Risk"
              type="checkbox"
              checked={f.riskLevel === "Low Risk"}
              onChange={() => f.setRiskLevel("Low Risk")}
            />
            <Form.Check
              inline
              label="Moderate Risk"
              id="Moderate Risk"
              type="checkbox"
              checked={f.riskLevel === "Moderate Risk"}
              onChange={() => f.setRiskLevel("Moderate Risk")}
            />
            <Form.Check
              inline
              label="High Risk"
              id="High Risk"
              type="checkbox"
              checked={f.riskLevel === "High Risk"}
              onChange={() => f.setRiskLevel("High Risk")}
            />
          </div>
        </Form.Group>
      </Card>
      <Row>
        <Col
          xs={12}
          md={12}
          className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && !f.otherPsychiatricOption && !f.othericdCode && "table-row-hinde-print"}`}
        >
          <Form.Label className="fw-bold">Diagnoses</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
          <Table
            responsive="lg"
            bordered
            className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && !f.otherPsychiatricOption && !f.othericdCode && "table-row-hinde-print"}`}
          >
            <thead
              className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && !f.otherPsychiatricOption && !f.othericdCode && "table-row-hinde-print"}`}
            >
              <tr>
                <th>Mental Health Diagnoses</th>
                <th>ICD Code</th>
                <th className="w-50">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && "table-row-hinde-print"}`}
              >
                <td>Primary*</td>
                <td>
                  <Form.Control
                    as="textarea"
                    type="text"
                    rows="1"
                    className={`${!f.psychiatricPrimaryIcdCode && "hidePrint"}`}
                    placeholder=""
                    value={f.psychiatricPrimaryIcdCode}
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricPrimaryIcdCode(e.target.value)
                    }
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    className={`${!f.psychiatricPrimaryDescription && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof f.psychiatricPrimaryDescription === "string"
                        ? f.psychiatricPrimaryDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.psychiatricPrimaryDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricPrimaryDescription(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setPsychiatricPrimaryDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${!f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && "table-row-hinde-print"}`}
              >
                <td>Secondary</td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!f.psychiatricSecondaryicdCode && "hidePrint"}`}
                    rows="1"
                    type="text"
                    placeholder=""
                    value={f.psychiatricSecondaryicdCode}
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricSecondaryIcdCode(e.target.value)
                    }
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    as="textarea"
                    className={`${!f.psychiatricSecondaryDescription && "table-row-hinde-print"}`}
                    rows={Math.max(
                      typeof f.psychiatricSecondaryDescription === "string"
                        ? f.psychiatricSecondaryDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.psychiatricSecondaryDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricSecondaryDescription(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setPsychiatricSecondaryDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${!f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && "table-row-hinde-print"}`}
              >
                <td>Tertiary</td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!f.psychiatricTertiaryIcdCode && "table-row-hinde-print"}`}
                    rows="1"
                    type="text"
                    placeholder=""
                    value={f.psychiatricTertiaryIcdCode}
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricTertiaryIcdCode(e.target.value)
                    }
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    as="textarea"
                    className={`${!f.psychiatricTertiaryDescription && "hidePrint"}`}
                    rows={Math.max(
                      typeof f.psychiatricTertiaryDescription === "string"
                        ? f.psychiatricTertiaryDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.psychiatricTertiaryDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricTertiaryDescription(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setPsychiatricTertiaryDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${!f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hinde-print"}`}
              >
                <td>Additional</td>
                <td>
                  <Form.Control
                    as="textarea"
                    className={`${!f.psychiatricAdditionalicdCode && "hidePrint"}`}
                    rows="1"
                    type="text"
                    placeholder=""
                    value={f.psychiatricAdditionalicdCode}
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricAdditionalIcdCode(e.target.value)
                    }
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    as="textarea"
                    className={`${!f.psychiatricAdditionalDescription && "hidePrint"}`}
                    rows={Math.max(
                      typeof f.psychiatricAdditionalDescription === "string"
                        ? f.psychiatricAdditionalDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.psychiatricAdditionalDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) =>
                      f.setPsychiatricAdditionalDescription(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setPsychiatricAdditionalDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>

              {f.psychiatricDiagnosesArray.map((i, index) => (
                <tr
                  key={index}
                  className={`${!i?.name && !i?.icdCode && "table-row-hinde-print"}`}
                >
                  <td>{i?.name}</td>
                  <td>{i?.icdCode}</td>
                  <td className="flex justify-between">
                    <p className={`${!i.description && "hidePrint"}`}>
                      {i.description}
                    </p>
                    {/* Psychiatric Diagnoses is read-only, so no delete button */}
                  </td>
                </tr>
              ))}

              <tr
                className={`${!f.otherPsychiatricOption && !f.othericdCode && "table-row-hinde-print"}`}
              >
                <td>
                  Other:{" "}
                  <input
                    className={`${!f.otherPsychiatricOption && "table-row-hinde-print"}`}
                    type="text"
                    value={f.otherPsychiatricOption}
                    placeholder="__________"
                    disabled
                    onChange={(e) =>
                      f.setOtherPsychiatricOption(e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    className={`${!f.othericdCode && "table-row-hinde-print"}`}
                    as="textarea"
                    rows="1"
                    type="text"
                    placeholder=""
                    value={f.othericdCode}
                    disabled
                    onChange={(e) => f.setOtherIcdCode(e.target.value)}
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    as="textarea"
                    className={`${!f.otherdescription && "table-row-hinde-print"}`}
                    rows={Math.max(
                      typeof f.otherdescription === "string"
                        ? f.otherdescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.otherdescription}
                    placeholder=""
                    disabled
                    onChange={(e) => f.setOtherDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setOtherDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mb-3 hidePrint">
        <Col xs={12} md={12} className="text-center">
          <Button
            type="button"
            className="theme-button"
            onClick={f.handlePsychiatricDiagnoses}
            disabled
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          md={12}
          className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && !f.OtherMedicalOption && !f.OthericdCodeMedicalDiagnoses && "table-row-hinde-print"}`}
        >
          <Form.Label className="fw-bold">Medical Diagnoses</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
          <Table
            responsive="lg"
            bordered
            className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && !f.OtherMedicalOption && !f.OthericdCodeMedicalDiagnoses && "table-row-hinde-print"}`}
          >
            <thead
              className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && !f.OtherMedicalOption && !f.OthericdCodeMedicalDiagnoses && "table-row-hinde-print"}`}
            >
              <tr>
                <th>Medical Diagnoses</th>
                <th>ICD Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${!f.primaryIcdCode && !f.primaryDescription && "table-row-hinde-print"}`}
              >
                <td>Primary*</td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows="1"
                    className={`${!f.primaryIcdCode && "hidePrint"}`}
                    type="text"
                    placeholder=""
                    value={f.primaryIcdCode}
                    disabled
                    onChange={(e) => f.setPrimaryIcdCode(e.target.value)}
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    className={`${!f.primaryDescription && "table-row-hinde-print"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof f.primaryDescription === "string"
                        ? f.primaryDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.primaryDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) => f.setPrimaryDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setPrimaryDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${!f.secondaryicdCode && !f.secondaryDescription && "table-row-hinde-print"}`}
              >
                <td>Secondary</td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows="1"
                    className={`${!f.secondaryicdCode && "hidePrint"}`}
                    type="text"
                    placeholder=""
                    disabled
                    value={f.secondaryicdCode}
                    onChange={(e) => f.setSecondaryIcdCode(e.target.value)}
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    className={`${!f.secondaryDescription && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof f.secondaryDescription === "string"
                        ? f.secondaryDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.secondaryDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) => f.setSecondaryDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setSecondaryDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${!f.TertiaryIcdCode && !f.TertiaryDescription && "table-row-hinde-print"}`}
              >
                <td>Tertiary</td>
                <td>
                  <Form.Control
                    className={`${!f.TertiaryIcdCode && "hidePrint"}`}
                    as="textarea"
                    rows="1"
                    type="text"
                    placeholder=""
                    value={f.TertiaryIcdCode}
                    disabled
                    onChange={(e) => f.setTertiaryIcdCode(e.target.value)}
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    className={`${!f.TertiaryDescription && "hidePrint"}`}
                    as="textarea"
                    rows={Math.max(
                      typeof f.TertiaryDescription === "string"
                        ? f.TertiaryDescription.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.TertiaryDescription || ""}
                    placeholder=""
                    disabled
                    onChange={(e) => f.setTertiaryDescription(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setTertiaryDescription(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
              <tr
                className={`${!f.Additional1icdCode && !f.Additional1Description && "table-row-hinde-print"}`}
              >
                <td>Additional</td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows="1"
                    className={`${!f.Additional1icdCode && "hidePrint"}`}
                    type="text"
                    placeholder=""
                    value={f.Additional1icdCode}
                    disabled
                    onChange={(e) => f.setAdditional1IcdCode(e.target.value)}
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    as="textarea"
                    className={`${!f.Additional1Description && "hidePrint"}`}
                    rows={Math.max(
                      typeof f.Additional1Description === "string"
                        ? f.Additional1Description.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.Additional1Description || ""}
                    placeholder=""
                    disabled
                    onChange={(e) =>
                      f.setAdditional1Description(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setAdditional1Description(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>

              {f.medicalDiagnosesArray.map((i, index) => (
                <tr
                  key={index}
                  className={`${!i?.icdCode && !i.description && "table-row-hinde-print"}`}
                >
                  <td>{i?.name}</td>
                  <td className={`${!i?.icdCode && "table-row-hinde-print"}`}>
                    {i?.icdCode}
                  </td>
                  <td className="flex justify-between">
                    <p
                      className={`${!i.description && "table-row-hinde-print"}`}
                    >
                      {i.description}
                    </p>
                    {/* Medical Diagnoses is read-only, so no delete button */}
                  </td>
                </tr>
              ))}

              <tr
                className={`${!f.OtherMedicalOption && !f.OthericdCodeMedicalDiagnoses && "table-row-hinde-print"}`}
              >
                <td>
                  Other:{" "}
                  <input
                    type="text"
                    value={f.OtherMedicalOption}
                    placeholder="___________"
                    className={`${!f.OtherMedicalOption && "table-row-hinde-print"}`}
                    disabled
                    onChange={(e) => f.setOtherMedicalOption(e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows="1"
                    type="text"
                    placeholder=""
                    className={`${!f.OthericdCodeMedicalDiagnoses && "table-row-hinde-print"}`}
                    value={f.OthericdCodeMedicalDiagnoses}
                    disabled
                    onChange={(e) =>
                      f.setOtherIcdCodeMedicalDiagnoses(e.target.value)
                    }
                  ></Form.Control>
                </td>
                <td>
                  {" "}
                  <Form.Control
                    as="textarea"
                    className={`${!f.OtherdescriptionMedicalDiagnoses && "table-row-hinde-print"}`}
                    rows={Math.max(
                      typeof f.OtherdescriptionMedicalDiagnoses === "string"
                        ? f.OtherdescriptionMedicalDiagnoses.split("\n").length
                        : 1,
                      1,
                    )}
                    value={f.OtherdescriptionMedicalDiagnoses}
                    placeholder=""
                    disabled
                    onChange={(e) =>
                      f.setOtherDescriptionMedicalDiagnoses(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        f.setOtherDescriptionMedicalDiagnoses(
                          (prevComment) => prevComment + "\n",
                        );
                      }
                    }}
                  ></Form.Control>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row className="mb-3 hidePrint">
        <Col xs={12} md={12} className="text-center">
          <Button
            type="button"
            className="theme-button"
            onClick={f.handleMedicalDiagnoses}
            disabled
          >
            Add
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
          <Form.Label className="fw-bold">
            Psychosocial or Environmental Stressors
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12}>
          <Card body className="mb-3">
            <Form.Label className="fw-bold">
              Problems with / related to
            </Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Primary Support Group"
                type="checkbox"
                id="primarySupportGroup"
                checked={f.primarySupportGroup}
                onChange={() =>
                  f.setPrimarySupportGroup(!f.primarySupportGroup)
                }
              />
              <Form.Check
                inline
                label="Educational problems"
                type="checkbox"
                id="educationalProblems"
                checked={f.educationalProblems}
                onChange={() =>
                  f.setEducationalProblems(!f.educationalProblems)
                }
              />
              <Form.Check
                inline
                label="Occupational problems"
                type="checkbox"
                id="occupationalProblems"
                checked={f.occupationalProblems}
                onChange={() =>
                  f.setOccupationalProblems(!f.occupationalProblems)
                }
              />
              <Form.Check
                inline
                label="Sexual problems"
                type="checkbox"
                id="sexualProblems"
                checked={f.sexualProblems}
                onChange={() => f.setSexualProblems(!f.sexualProblems)}
              />
              <Form.Check
                inline
                label="Marital problems"
                type="checkbox"
                id="maritalProblems"
                checked={f.maritalProblems}
                onChange={() => f.setMaritalProblems(!f.maritalProblems)}
              />
              <Form.Check
                inline
                label="Housing problems"
                type="checkbox"
                id="housingProblems"
                checked={f.housingProblems}
                onChange={() => f.setHousingProblems(!f.housingProblems)}
              />
              <Form.Check
                inline
                label="Interaction with legal system"
                type="checkbox"
                id="interactionWithLegalSystem"
                checked={f.interactionWithLegalSystem}
                onChange={() =>
                  f.setInteractionWithLegalSystem(!f.interactionWithLegalSystem)
                }
              />
              <Form.Check
                inline
                label="Other (please specify)"
                type="checkbox"
                id="otherBoolean"
                checked={f.otherBoolean}
                onChange={() => f.setOtherBoolean(!f.otherBoolean)}
              />
              {f.otherBoolean && (
                <BorderlessInput
                  className={`${!f.otherStressors && "hidePrint"}`}
                  value={f.otherStressors}
                  setState={f.setOtherStressors}
                  placeholder={" "}
                />
              )}
            </div>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Access to health care services"
                type="checkbox"
                id="accessToHealthCareServices"
                checked={f.accessToHealthCareServices}
                onChange={() =>
                  f.setAccessToHealthCareServices(!f.accessToHealthCareServices)
                }
              />
              <Form.Check
                inline
                label="Family problems"
                type="checkbox"
                id="familyProblems"
                checked={f.familyProblems}
                onChange={() => f.setFamilyProblems(!f.familyProblems)}
              />
              <Form.Check
                inline
                label="Substance use in home"
                type="checkbox"
                id="substanceUseInHome"
                checked={f.substanceUseInHome}
                onChange={() => f.setSubstanceUseInHome(!f.substanceUseInHome)}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Significant recent losses
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="setSetNoAndYes"
                  checked={f.setNoAndYes === true}
                  onChange={() => f.setSetNoAndYes(true)}
                />
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="setSetNoAndYesno"
                  checked={f.setNoAndYes === false}
                  onChange={() => f.setSetNoAndYes(false)}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                If yes, please check applicable loss(es)
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Death"
                  type="checkbox"
                  id="death"
                  checked={f.death}
                  onChange={() => f.setDeath(!f.death)}
                />
                <Form.Check
                  inline
                  label="Injury"
                  type="checkbox"
                  id="injury"
                  checked={f.injury}
                  onChange={() => f.setInjury(!f.injury)}
                />
                <Form.Check
                  inline
                  label="Medical/ surgical"
                  type="checkbox"
                  id="medicalSurgical"
                  checked={f.medicalSurgical}
                  onChange={() => f.setMedicalSurgical(!f.medicalSurgical)}
                />
                <Form.Check
                  inline
                  label="Job"
                  type="checkbox"
                  id="job"
                  checked={f.job}
                  onChange={() => f.setJob(!f.job)}
                />{" "}
                <Form.Check
                  inline
                  label="Divorce / separation"
                  type="checkbox"
                  id="divorceSeparation"
                  checked={f.divorceSeparation}
                  onChange={() => f.setDivorceSeparation(!f.divorceSeparation)}
                />{" "}
                <Form.Check
                  inline
                  label="Accident / injury"
                  type="checkbox"
                  id="accidentInjury"
                  checked={f.accidentInjury}
                  onChange={() => f.setAccidentInjury(!f.accidentInjury)}
                />
                <Form.Check
                  inline
                  label="Child removed from house"
                  type="checkbox"
                  id="childRemovedFromHouse"
                  checked={f.childRemovedFromHouse}
                  onChange={() =>
                    f.setChildRemovedFromHouse(!f.childRemovedFromHouse)
                  }
                />
                <Form.Check
                  inline
                  label="Violent acts against person/family"
                  type="checkbox"
                  id="violentActsAgainstPersonFamily"
                  checked={f.violentActsAgainstPersonFamily}
                  onChange={() =>
                    f.setViolentActsAgainstPersonFamily(
                      !f.violentActsAgainstPersonFamily,
                    )
                  }
                />{" "}
                <Form.Check
                  inline
                  label="Other (please specify)"
                  type="checkbox"
                  id="otherSignificantRecentLosses"
                  checked={f.otherSignificantRecentLosses}
                  onChange={() =>
                    f.setOtherSignificantRecentLosses(
                      !f.otherSignificantRecentLosses,
                    )
                  }
                />
                {f.otherSignificantRecentLosses && (
                  <BorderlessInput
                    className={`${!f.otherSignificantRecentLossesType && "hidePrint"}`}
                    value={f.otherSignificantRecentLossesType}
                    setState={f.setOtherSignificantRecentLossesType}
                    placeholder={" "}
                  />
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                className={`${!f.additionalNotes && "hidePrint"}`}
                id="approvedby"
                value={f.additionalNotes}
                placeholder="Enter text"
                onChange={(e) => f.setAdditionalNotes(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Clinical Summary</Form.Label>
              <Form.Control
                as="textarea"
                className={`${!f.clinicalSummary && "hidePrint"}`}
                id="clinicalsummary"
                value={f.clinicalSummary}
                placeholder="Enter text"
                onChange={(e) => f.setClinicalSummary(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <Card body className="mb-3 ">
            <Form.Label className="fw-bold">
              Treatment Recommendations
            </Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="BHRF"
                type="checkbox"
                id="BHRF"
                checked={f.treatmentRecommendations?.includes("BHRF")}
                onChange={() => f.treatmentRecommendationsHandler("BHRF")}
              />
              <Form.Check
                inline
                label="PHP"
                type="checkbox"
                id="PHP"
                checked={f.treatmentRecommendations?.includes("PHP")}
                onChange={() => f.treatmentRecommendationsHandler("PHP")}
              />

              <Form.Check
                inline
                label="IOP"
                type="checkbox"
                id="IOP"
                checked={f.treatmentRecommendations?.includes("IOP")}
                onChange={() => f.treatmentRecommendationsHandler("IOP")}
              />
              <Form.Check
                inline
                label="Sober Living"
                type="checkbox"
                id="soberLiving"
                checked={f.treatmentRecommendations?.includes("soberLiving")}
                onChange={() =>
                  f.treatmentRecommendationsHandler("soberLiving")
                }
              />
              <Form.Check
                inline
                label="Assisted Living"
                type="checkbox"
                id="assistedLiving"
                checked={f.treatmentRecommendations?.includes("assistedLiving")}
                onChange={() =>
                  f.treatmentRecommendationsHandler("assistedLiving")
                }
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Check
              label={`Yes, I ${f.residentName || f.getApiData?.data?.residentName} am in agreement with the
                      types and levels of services included in my behavior
                      plan.`}
              type="checkbox"
              checked={f.acceptResident === true}
              onChange={() => f.setAcceptResident(true)}
            />{" "}
            <Form.Check
              label={`No, I ${f.residentName || f.getApiData?.data?.residentName} disagree with the types
                      and/or levels of some or all of the services. By
                      checking this box, I ${f.residentName || f.getApiData?.data?.residentName} will receive
                      the services that I have agreed to receive and may
                      appeal the treatment team’s decision to not include
                      all the types and/ or levels of services that I have
                      requested.`}
              type="checkbox"
              checked={f.acceptResident === false}
              onChange={() => f.setAcceptResident(false)}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
}

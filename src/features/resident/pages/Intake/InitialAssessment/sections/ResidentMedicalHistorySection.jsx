/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useResidentInitialAssessmentFormContext } from "../context/ResidentInitialAssessmentFormContext";

export default function ResidentMedicalHistorySection() {
  const f = useResidentInitialAssessmentFormContext();
  return (
    <>
      <Row className="my-3">
        <Col xs={12}>
          <Form.Label className="fw-bold h5 w-100 text-center">
            SECTION II
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold w-100">
            A. Currently prescribed medications are attached on a separate page.
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold w-100">
            B. Current and Past Medical/Psychiatric Conditions.
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Table
            responsive="lg"
            bordered
            className={`${f.yesDiabetes === undefined && f.yesHeart === undefined && f.yesHistory === undefined && f.yesHigh === undefined && f.yesLung === undefined && f.yesSeizures === undefined && f.yesCancer === undefined && f.yesLiver === undefined && f.yesThyroid === undefined && f.yesbrain === undefined && f.yesInjury === undefined && f.yesChronic === undefined && f.AllergiesYes === undefined && f.SurgeriesYes === undefined && f.pregnanciesYes === undefined && f.SubstanceYes === undefined && f.DepressionYes === undefined && f.AnxietyYes === undefined && f.InsomniaYes === undefined && f.BipolarYes === undefined && f.SchizophreniaYes === undefined && f.ObsessiveYes === undefined && f.PersonalityYes === undefined && f.PhobiasYes === undefined && f.healthConditionsYes === undefined && f.InfectionYes === undefined && !f.OtherConditionOther && "table-row-hide-print"}`}
          >
            <thead>
              <tr
                className={`${f.yesDiabetes === undefined && f.yesHeart === undefined && f.yesHistory === undefined && f.yesHigh === undefined && f.yesLung === undefined && f.yesSeizures === undefined && f.yesCancer === undefined && f.yesLiver === undefined && f.yesThyroid === undefined && f.yesbrain === undefined && f.yesInjury === undefined && f.yesChronic === undefined && f.AllergiesYes === undefined && f.SurgeriesYes === undefined && f.pregnanciesYes === undefined && f.SubstanceYes === undefined && f.DepressionYes === undefined && f.AnxietyYes === undefined && f.InsomniaYes === undefined && f.BipolarYes === undefined && f.SchizophreniaYes === undefined && f.ObsessiveYes === undefined && f.PersonalityYes === undefined && f.PhobiasYes === undefined && f.healthConditionsYes === undefined && f.InfectionYes === undefined && !f.OtherConditionOther && "table-row-hide-print"}`}
              >
                <th>Conditions</th>
                <th className="text-center">Yes</th>
                <th className="text-center">No</th>
                <th className="w-50">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className={`${f.yesDiabetes === undefined && "table-row-hide-print"}`}
              >
                <td>Diabetes</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="diabetes"
                    checked={f.yesDiabetes === true}
                    onChange={() => f.setYesDiabetes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="diabetesno"
                    checked={f.yesDiabetes === false}
                    onChange={() => f.setYesDiabetes(false)}
                  />
                </td>
                <td>{f.commentDiabety || ""}</td>
              </tr>
              <tr
                className={`${f.yesHeart === undefined && "table-row-hide-print"}`}
              >
                <td>Heart disease / heart attack</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesHeart"
                    checked={f.yesHeart === true}
                    onChange={() => f.setYesHeart(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesHeartno"
                    checked={f.yesHeart === false}
                    onChange={() => f.setYesHeart(false)}
                  />
                </td>
                <td>{f.commentHeart || ""}</td>
              </tr>
              <tr
                className={`${f.yesHistory === undefined && "table-row-hide-print"}`}
              >
                <td>History of stroke</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesHistory"
                    checked={f.yesHistory === true}
                    onChange={() => f.setYesHistory(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesHistoryno"
                    checked={f.yesHistory === false}
                    onChange={() => f.setYesHistory(false)}
                  />
                </td>
                <td>{f.commentHistory || ""}</td>
              </tr>
              <tr
                className={`${f.yesHigh === undefined && "table-row-hide-print"}`}
              >
                <td>High Blood Pressure</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesHigh"
                    checked={f.yesHigh === true}
                    onChange={() => f.setYesHigh(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesHighno"
                    checked={f.yesHigh === false}
                    onChange={() => f.setYesHigh(false)}
                  />
                </td>
                <td>{f.commentHigh || ""}</td>
              </tr>
              <tr
                className={`${f.yesLung === undefined && "table-row-hide-print"}`}
              >
                <td>Lung disease (ie asthma, COPD, emphysema)</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesLung"
                    checked={f.yesLung === true}
                    onChange={() => f.setYesLung(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesLungno"
                    checked={f.yesLung === false}
                    onChange={() => f.setYesLung(false)}
                  />
                </td>
                <td>{f.commentLung || ""}</td>
              </tr>
              <tr
                className={`${f.yesSeizures === undefined && "table-row-hide-print"}`}
              >
                <td>Seizures</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="diabetes"
                    checked={f.yesSeizures === true}
                    onChange={() => f.setYesSeizures(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesSeizuresno"
                    checked={f.yesSeizures === false}
                    onChange={() => f.setYesSeizures(false)}
                  />
                </td>
                <td>{f.commentSeizures || ""}</td>
              </tr>
              <tr
                className={`${f.yesCancer === undefined && "table-row-hide-print"}`}
              >
                <td>Cancer</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesCancer"
                    checked={f.yesCancer === true}
                    onChange={() => f.setYesCancer(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesCancerno"
                    checked={f.yesCancer === false}
                    onChange={() => f.setYesCancer(false)}
                  />
                </td>
                <td>{f.commentCancer || ""}</td>
              </tr>
              <tr
                className={`${f.yesLiver === undefined && "table-row-hide-print"}`}
              >
                <td>Liver/kidney disease</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesLiver"
                    checked={f.yesLiver === true}
                    onChange={() => f.setYesLiver(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesLiverno"
                    checked={f.yesLiver === false}
                    onChange={() => f.setYesLiver(false)}
                  />
                </td>
                <td>{f.commentLiver || ""}</td>
              </tr>
              <tr
                className={`${f.yesThyroid === undefined && "table-row-hide-print"}`}
              >
                <td className="print-fw-300">Thyroid disorder</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesThyroid"
                    checked={f.yesThyroid === true}
                    onChange={() => f.setYesThyroid(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="setYesThyroidno"
                    checked={f.yesThyroid === false}
                    onChange={() => f.setYesThyroid(false)}
                  />
                </td>
                <td>
                  <span className="view-value">
                    {f.thyroidDisorder
                      ?.map((status) => status?.label)
                      .join(", ")}
                  </span>
                </td>
              </tr>

              <tr
                className={`${f.yesInjury === undefined && "table-row-hide-print"}`}
              >
                <td>History of head trauma/traumatic brain injury</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesInjury"
                    checked={f.yesInjury === true}
                    onChange={() => f.setYesInjury(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="yesInjuryno"
                    checked={f.yesInjury === false}
                    onChange={() => f.setYesInjury(false)}
                  />
                </td>
                <td>{f.commentInjury || ""}</td>
              </tr>
              <tr
                className={`${f.yesChronic === undefined && "table-row-hide-print"}`}
              >
                <td>Chronic pain</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="Chronic"
                    checked={f.yesChronic === true}
                    onChange={() => f.setYesChronic(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="Chronicno"
                    checked={f.yesChronic === false}
                    onChange={() => f.setYesChronic(false)}
                  />
                </td>
                <td>{f.chronicCommit || ""}</td>
              </tr>
              <tr
                className={`${f.AllergiesYes === undefined && "table-row-hide-print"}`}
              >
                <td>Allergies (food, environment, medications)</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="AllergiesYes"
                    checked={f.AllergiesYes === true}
                    onChange={() => f.setAllergiesYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="AllergiesYesno"
                    checked={f.AllergiesYes === false}
                    onChange={() => f.setAllergiesYes(false)}
                  />
                </td>
                <td>{f.AllergiesComment || ""}</td>
              </tr>
              <tr
                className={`${f.SurgeriesYes === undefined && "table-row-hide-print"}`}
              >
                <td>Surgeries</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="SurgeriesYes"
                    checked={f.SurgeriesYes === true}
                    onChange={() => f.setSurgeriessYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="SurgeriesYesno"
                    checked={f.SurgeriesYes === false}
                    onChange={() => f.setSurgeriessYes(false)}
                  />
                </td>
                <td>{f.SurgeriesComment || ""}</td>
              </tr>
              <tr
                className={`${f.pregnanciesYes === undefined && "table-row-hide-print"}`}
              >
                <td>Number of pregnancies / births</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="pregnanciesYes"
                    checked={f.pregnanciesYes === true}
                    onChange={() => f.setPregnanciesYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="pregnanciesYesno"
                    checked={f.pregnanciesYes === false}
                    onChange={() => f.setPregnanciesYes(false)}
                  />
                </td>
                <td>{f.pregnanciesComment || ""}</td>
              </tr>
              <tr
                className={`${f.SubstanceYes === undefined && "table-row-hide-print"}`}
              >
                <td>Substance use disorder (please specify)</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="SubstanceYes"
                    checked={f.SubstanceYes === true}
                    onChange={() => f.setSubstanceYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="SubstanceYesno"
                    checked={f.SubstanceYes === false}
                    onChange={() => f.setSubstanceYes(false)}
                  />
                </td>
                <td>{f.SubstanceComment || ""}</td>
              </tr>
              <tr
                className={`${f.DepressionYes === undefined && "table-row-hide-print"}`}
              >
                <td>Depression</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="DepressionYes"
                    checked={f.DepressionYes === true}
                    onChange={() => f.setDepressionYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="DepressionYesno"
                    checked={f.DepressionYes === false}
                    onChange={() => f.setDepressionYes(false)}
                  />
                </td>
                <td>{f.DepressionComment || ""}</td>
              </tr>
              <tr
                className={`${f.AnxietyYes === undefined && "table-row-hide-print"}`}
              >
                <td>Anxiety/panic attacks</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="AnxietyYes"
                    checked={f.AnxietyYes === true}
                    onChange={() => f.setAnxietyYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="AnxietyYesno"
                    checked={f.AnxietyYes === false}
                    onChange={() => f.setAnxietyYes(false)}
                  />
                </td>
                <td>{f.AnxietyComment || ""}</td>
              </tr>
              <tr
                className={`${f.InsomniaYes === undefined && "table-row-hide-print"}`}
              >
                <td>Insomnia</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="InsomniaYes"
                    checked={f.InsomniaYes === true}
                    onChange={() => f.setInsomniaYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="InsomniaYesno"
                    checked={f.InsomniaYes === false}
                    onChange={() => f.setInsomniaYes(false)}
                  />
                </td>
                <td>{f.InsomniaComment || ""}</td>
              </tr>
              <tr
                className={`${f.BipolarYes === undefined && "table-row-hide-print"}`}
              >
                <td>Bipolar disorder</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="BipolarYes"
                    checked={f.BipolarYes === true}
                    onChange={() => f.setBipolarYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="BipolarYesno"
                    checked={f.BipolarYes === false}
                    onChange={() => f.setBipolarYes(false)}
                  />
                </td>
                <td>{f.BipolarComment || ""}</td>
              </tr>
              <tr
                className={`${f.SchizophreniaYes === undefined && "table-row-hide-print"}`}
              >
                <td>Schizophrenia</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="SchizophreniaYes"
                    checked={f.SchizophreniaYes === true}
                    onChange={() => f.setSchizophreniaYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="SchizophreniaYesno"
                    checked={f.SchizophreniaYes === false}
                    onChange={() => f.setSchizophreniaYes(false)}
                  />
                </td>
                <td>{f.SchizophreniaComment || ""}</td>
              </tr>
              <tr
                className={`${f.ObsessiveYes === undefined && "table-row-hide-print"}`}
              >
                <td>Obsessive compulsive disorder</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="ObsessiveYes"
                    checked={f.ObsessiveYes === true}
                    onChange={() => f.setObsessiveYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="ObsessiveYesno"
                    checked={f.ObsessiveYes === false}
                    onChange={() => f.setObsessiveYes(false)}
                  />
                </td>
                <td>{f.ObsessiveComment || ""}</td>
              </tr>
              <tr
                className={`${f.PersonalityYes === undefined && "table-row-hide-print"}`}
              >
                <td>Personality disorder (please specify)</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="PersonalityYes"
                    checked={f.PersonalityYes === true}
                    onChange={() => f.setPersonalityYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="PersonalityYesno"
                    checked={f.PersonalityYes === false}
                    onChange={() => f.setPersonalityYes(false)}
                  />
                </td>
                <td>{f.PersonalityComment || ""}</td>
              </tr>
              <tr
                className={`${f.PhobiasYes === undefined && "table-row-hide-print"}`}
              >
                <td>Phobias</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="PhobiasYes"
                    checked={f.PhobiasYes === true}
                    onChange={() => f.setPhobiasYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="PhobiasYesno"
                    checked={f.PhobiasYes === false}
                    onChange={() => f.setPhobiasYes(false)}
                  />
                </td>
                <td>{f.PhobiasComment || ""}</td>
              </tr>
              <tr
                className={`${f.healthConditionsYes === undefined && "table-row-hide-print"}`}
              >
                <td>Any other health conditions</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="healthConditionsYes"
                    checked={f.healthConditionsYes === true}
                    onChange={() => f.setHealthConditionsYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="healthConditionsYesno"
                    checked={f.healthConditionsYes === false}
                    onChange={() => f.setHealthConditionsYes(false)}
                  />
                </td>
                <td>{f.healthConditionsYesComment || ""}</td>
              </tr>
              <tr
                className={`${f.InfectionYes === undefined && "table-row-hide-print"}`}
              >
                <td className="print-fw-300">Infection or Diseases</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="InfectionYes"
                    checked={f.InfectionYes === true}
                    onChange={() => f.setInfectionYes(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    id="InfectionYesno"
                    checked={f.InfectionYes === false}
                    onChange={() => f.setInfectionYes(false)}
                  />
                </td>
                <td>
                  <span className="view-value">
                    {f.infectionDiseases
                      ?.map((status) => status?.label)
                      .join(", ")}
                  </span>
                </td>
              </tr>
              {f.otherConditionArray?.map((i, index) => (
                <tr
                  className={`${!i.condition && !i.yes === undefined && "table-row-hide-print"}`}
                >
                  <td>{i.condition}</td>
                  <td className="text-center">
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.yes === true}
                    />
                  </td>
                  <td className="text-center">
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={i.yes === false}
                    />
                  </td>
                  <td className="flex justify-between">
                    <p>{i.comments}</p>
                  </td>
                </tr>
              ))}
              <tr
                className={`${!f.OtherConditionOther && f.otherConditionYesNO === undefined && "table-row-hide-print"} hidden`}
              >
                <td>Other: {f.OtherConditionOther}</td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.otherConditionYesNO === true}
                    onChange={() => f.setOtherConditionYesNo(true)}
                  />
                </td>
                <td className="text-center">
                  <Form.Check
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.otherConditionYesNO === false}
                    onChange={() => f.setOtherConditionYesNo(false)}
                  />
                </td>
                <td>{f.otherConditionDiscription || ""}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Significant Family Medical/Psychiatric History :{" "}
            </p>
            <h5 className="view-value mb-0">
              {f.SignificantFamilyMedicalPsychiatricHistory?.map(
                (status) => status?.label,
              ).join(", ")}
            </h5>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md="12">
          <Form.Label className="fw-bold">
            Mental Health Treatment History (in Resident hospitalization,
            partial hospitalization, out Resident, etc) :
          </Form.Label>
          {f.typeOfServiceArray.length > 0 && (
            <Table responsive="lg" bordered>
              <thead>
                <tr>
                  <th>Type of Services</th>
                  <th>Where</th>
                  <th>Dates</th>
                  <th className="w-50">Diagnosis/Reason for Treatment </th>
                </tr>
              </thead>
              <tbody>
                {f.typeOfServiceArray?.map((i, index) => (
                  <tr
                    className={`${!i?.typeOfService && "table-row-hide-print"}`}
                  >
                    <td>
                      {i?.typeOfService?.map((item) => (
                        <p key={item?.value}>{item?.value}</p>
                      ))}
                    </td>
                    <td>{`${i?.where}`} </td>
                    <td>{`${
                      // new Date(i?.dates) instanceof Date && !isNaN(new Date(i?.dates))
                      //   ? formatDateToMMDDYYYY(i?.dates)
                      //   :
                      i?.dates
                    }`}</td>
                    <td>
                      {i?.diagnosisReason?.map((item) => (
                        <p key={item?.value}>{item?.value}</p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
}

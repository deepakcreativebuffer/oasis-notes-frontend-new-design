/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { Card, Row, Col, Form, Button, Table } from "react-bootstrap";
import { ROLES } from "@/features/shared/constants/index";
import { useResidentInitialAssessmentFormContext } from "../context/ResidentInitialAssessmentFormContext";

export default function ResidentSafetyRiskDiagnosesSection() {
  const f = useResidentInitialAssessmentFormContext();
  return (
    <>
      <div className="pointer-events-none">
        <Row>
          <Col xs={12}>
            <Form.Label
              className={`fw-bold flex-shirnk-0 ${f.currentThoughtsOfHarmingSelf !== true && f.currentThoughtsOfHarmingSelf !== false && "table-row-hide-print"}`}
            >
              Safety and Risk Assessment
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            lg={12}
            className={`${f.currentThoughtsOfHarmingSelf !== true && f.currentThoughtsOfHarmingSelf !== false && "table-row-hide-print"}`}
          >
            <div className="view-details-grid my-1 view-details-grid-inline my-md-2 p-3">
              <p className="view-label mb-1">
                Are you currently thinking about harming yourself or committing
                suicide? :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelf"
                  checked={f.currentThoughtsOfHarmingSelf === true}
                  onChange={() => f.setCurrentThoughtsOfHarmingSelf(true)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelfno"
                  checked={f.currentThoughtsOfHarmingSelf === false}
                  onChange={() => f.setCurrentThoughtsOfHarmingSelf(false)}
                />
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            lg={12}
            className={`${f.currentThoughtsOfHarmingOthers !== true && f.currentThoughtsOfHarmingOthers !== false && "table-row-hide-print"}`}
          >
            <div className="view-details-grid my-1 view-details-grid-inline my-md-2 p-3">
              <p className="view-label mb-1">
                Are you currently thinking about harming others or have
                homicidal thoughts? :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingOthers"
                  checked={f.currentThoughtsOfHarmingOthers === true}
                  onChange={() => f.setCurrentThoughtsOfHarmingOthers(true)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="currentThoughtsOfHarmingOthersno"
                  checked={f.currentThoughtsOfHarmingOthers === false}
                  onChange={() => f.setCurrentThoughtsOfHarmingOthers(false)}
                />
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            lg={6}
            className={`${!f.suicidalIdeation && "table-row-hide-print"}`}
          >
            <div className="view-details-grid my-1 view-details-grid-inline my-md-2 p-3">
              <p className="view-label mb-1">Ideation : </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Fleeting"
                  type="checkbox"
                  checked={f.suicidalIdeation === "Fleeting"}
                  onChange={() => f.setSuicidalIdeation("Fleeting")}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Periodic"
                  type="checkbox"
                  checked={f.suicidalIdeation === "Periodic"}
                  onChange={() => f.setSuicidalIdeation("Periodic")}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Constant"
                  type="checkbox"
                  checked={f.suicidalIdeation === "Constant"}
                  onChange={() => f.setSuicidalIdeation("Constant")}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="N/A"
                  type="checkbox"
                  checked={f.suicidalIdeation === "N/A"}
                  onChange={() => f.setSuicidalIdeation("N/A")}
                />
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            lg={6}
            className={`${f.suicidalIdeationUrgency !== true && f.suicidalIdeationUrgency !== false && "table-row-hide-print"}`}
          >
            <div className="view-details-grid my-1 view-details-grid-inline my-md-2 p-3">
              <p className="view-label mb-1">Urgency : </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="suicidalIdeationUrgency"
                  checked={f.suicidalIdeationUrgency === true}
                  onChange={() => f.setSuicidalIdeationUrgency(true)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="NO"
                  type="checkbox"
                  id="suicidalIdeationUrgencyno"
                  checked={f.suicidalIdeationUrgency === false}
                  onChange={() => f.setSuicidalIdeationUrgency(false)}
                />
              </div>
            </div>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={6}
            className={`${f.suicidalIdeationSeverity !== false && f.suicidalIdeationSeverity !== true && "table-row-hide-print"}`}
          >
            <div className="view-details-grid my-1 view-details-grid-inline my-md-2 p-3">
              <p className="view-label mb-1">Severity : </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="currentThoughtsOfHarmingSelf"
                  checked={f.suicidalIdeationSeverity === true}
                  onChange={() => f.setSuicidalIdeationSeverity(true)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="NO"
                  type="checkbox"
                  id="suicidalIdeationSeverityno"
                  checked={f.suicidalIdeationSeverity === false}
                  onChange={() => f.setSuicidalIdeationSeverity(false)}
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col
            xs={12}
            className={`${f.riskYesNo === undefined && f.PriorYesNo === undefined && f.AccessYesNo === undefined && f.SubstanceYesNo === undefined && f.abusingYesNo === undefined && f.RecentYesNo === undefined && f.behaviourYesNO === undefined && f.SymptomsYesNO === undefined && f.FamilyYesNO === undefined && f.TerminalYesNO === undefined && f.CurrentYesNO === undefined && f.ChronicYesNO === undefined && "table-row-hide-print"}`}
          >
            <Form.Label className="fw-bold w-100">Risk Factors</Form.Label>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Table
              responsive="lg"
              bordered
              className={`${f.riskYesNo === undefined && f.PriorYesNo === undefined && f.AccessYesNo === undefined && f.SubstanceYesNo === undefined && f.abusingYesNo === undefined && f.RecentYesNo === undefined && f.behaviourYesNO === undefined && f.SymptomsYesNO === undefined && f.FamilyYesNO === undefined && f.TerminalYesNO === undefined && f.CurrentYesNO === undefined && f.ChronicYesNO === undefined && "table-row-hide-print"}`}
            >
              <thead
                className={`${f.riskYesNo === undefined && f.PriorYesNo === undefined && f.AccessYesNo === undefined && f.SubstanceYesNo === undefined && f.abusingYesNo === undefined && f.RecentYesNo === undefined && f.behaviourYesNO === undefined && f.SymptomsYesNO === undefined && f.FamilyYesNO === undefined && f.TerminalYesNO === undefined && f.CurrentYesNO === undefined && f.ChronicYesNO === undefined && "table-row-hide-print"}`}
              >
                <tr>
                  <th>Select risk factors that apply</th>
                  <th>Yes</th>
                  <th>No</th>
                  <th className="w-50">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className={`${f.riskYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Current suicidal ideation </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.riskYesNo === true}
                      onChange={() => f.setRiskYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.riskYesNo === false}
                      onChange={() => f.setRiskYesNo(false)}
                    />
                  </td>
                  <td>{f.riskComment}</td>
                </tr>

                <tr
                  className={`${f.PriorYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Prior suicide attempt</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.PriorYesNo === true}
                      onChange={() => f.setPriorYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.PriorYesNo === false}
                      onChange={() => f.setPriorYesNo(false)}
                    />
                  </td>
                  <td>{f.PriorComment}</td>
                </tr>

                <tr
                  className={`${f.AccessYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Access to means (i.e. weapon)</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.AccessYesNo === true}
                      onChange={() => f.setAccessYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.AccessYesNo === false}
                      onChange={() => f.setAccessYesNo(false)}
                    />
                  </td>
                  <td>{f.AccessComment}</td>
                </tr>

                <tr
                  className={`${f.SubstanceYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Substance abuse</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SubstanceYesNo === true}
                      onChange={() => f.setSubstanceYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SubstanceYesNo === false}
                      onChange={() => f.setSubstanceYesNo(false)}
                    />
                  </td>
                  <td>{f.SubstanceAbuseComment}</td>
                </tr>

                <tr
                  className={`${f.abusingYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Other self-abusing behavior</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.abusingYesNo === true}
                      onChange={() => f.setabusingYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.abusingYesNo === false}
                      onChange={() => f.setabusingYesNo(false)}
                    />
                  </td>
                  <td>{f.abusingComment}</td>
                </tr>

                <tr
                  className={`${f.RecentYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Recent losses/lack of support</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.RecentYesNo === true}
                      onChange={() => f.setRecentYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.RecentYesNo === false}
                      onChange={() => f.setRecentYesNo(false)}
                    />
                  </td>
                  <td>{f.RecentComment}</td>
                </tr>

                <tr
                  className={`${f.behaviourYesNO === undefined && "table-row-hide-print"}`}
                >
                  <td>Behavior cues</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.behaviourYesNO === true}
                      onChange={() => f.setBehaviourYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.behaviourYesNO === false}
                      onChange={() => f.setBehaviourYesNo(false)}
                    />
                  </td>
                  <td>
                    {f.behaviorcuesDropDown?.map((i) => i.label)?.join(", ")}
                  </td>
                </tr>

                <tr
                  className={`${f.SymptomsYesNO === undefined && "table-row-hide-print"}`}
                >
                  <td>Symptoms of psychosis </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SymptomsYesNO === true}
                      onChange={() => f.setSymptomsYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SymptomsYesNO === false}
                      onChange={() => f.setSymptomsYesNo(false)}
                    />
                  </td>
                  <td>
                    {f.symptomsOfPsychosisDropDown
                      ?.map((i) => i.label)
                      ?.join(", ")}
                  </td>
                </tr>

                <tr
                  className={`${f.FamilyYesNO === undefined && "table-row-hide-print"}`}
                >
                  <td>Family history of suicide</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.FamilyYesNO === true}
                      onChange={() => f.setFamilyYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.FamilyYesNO === false}
                      onChange={() => f.setFamilyYesNo(false)}
                    />
                  </td>
                  <td>{f.Family}</td>
                </tr>

                <tr
                  className={`${f.TerminalYesNO === undefined && "table-row-hide-print"}`}
                >
                  <td>Terminal physical illness</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.TerminalYesNO === true}
                      onChange={() => f.setTerminalYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.TerminalYesNO === false}
                      onChange={() => f.setTerminalYesNo(false)}
                    />
                  </td>
                  <td>{f.Terminal}</td>
                </tr>

                <tr
                  className={`${f.CurrentYesNO === undefined && "table-row-hide-print"}`}
                >
                  <td>Current stressors (specify)</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.CurrentYesNO === true}
                      onChange={() => f.setCurrentYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.CurrentYesNO === false}
                      onChange={() => f.setCurrentYesNo(false)}
                    />
                  </td>
                  <td>{f.Current}</td>
                </tr>

                <tr
                  className={`${f.ChronicYesNO === undefined && "table-row-hide-print"}`}
                >
                  <td>Chronic pain</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.ChronicYesNO === true}
                      onChange={() => f.setChronicYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.ChronicYesNO === false}
                      onChange={() => f.setChronicYesNo(false)}
                    />
                  </td>
                  <td>{f.ChronicPain}</td>
                </tr>

                {f.riskFactorArray.length > 0 &&
                  f.riskFactorArray?.map((i, index) => (
                    <tr key={index}>
                      <td>{i.type}</td>
                      <td>
                        <Form.Check
                          className="pointer-events-f.none"
                          type="checkbox"
                          checked={i.yesNo === true}
                        />
                      </td>
                      <td>
                        <Form.Check
                          className="pointer-events-f.none"
                          type="checkbox"
                          checked={i.yesNo === false}
                        />
                      </td>
                      <td className="pl-[20px]">{`${i.comment}`}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <Form.Label
              className={`fw-bold flex-shirnk-0 ${f.SupportsYesNo === undefined && f.SpiritualYesNo === undefined && f.ReligiousYesNo === undefined && f.FearYesNo === undefined && f.interventionYesNo === undefined && f.WillingYesNo === undefined && "table-row-hide-print"}`}
            >
              Protective factors
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Table
              responsive="lg"
              bordered
              className={`${f.SupportsYesNo === undefined && f.SpiritualYesNo === undefined && f.ReligiousYesNo === undefined && f.FearYesNo === undefined && f.interventionYesNo === undefined && f.WillingYesNo === undefined && "table-row-hide-print"}`}
            >
              <thead
                className={`${f.SupportsYesNo === undefined && f.SpiritualYesNo === undefined && f.ReligiousYesNo === undefined && f.FearYesNo === undefined && f.interventionYesNo === undefined && f.WillingYesNo === undefined && "table-row-hide-print"}`}
              >
                <tr>
                  <th>Protective factors that apply</th>
                  <th>Yes</th>
                  <th>No</th>
                  <th className="w-50">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className={`${f.SupportsYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Supports available (family friends)</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SupportsYesNo === true}
                      onChange={() => f.setSupportsYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SupportsYesNo === false}
                      onChange={() => f.setSupportsYesNo(false)}
                    />
                  </td>
                  <td>{f.SupportsComment}</td>
                </tr>
                <tr
                  className={`${f.SpiritualYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Spiritual / religious support</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SpiritualYesNo === true}
                      onChange={() => f.setSpiritualYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.SpiritualYesNo === false}
                      onChange={() => f.setSpiritualYesNo(false)}
                    />
                  </td>
                  <td>{f.SpiritualComment}</td>
                </tr>

                <tr
                  className={`${f.ReligiousYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Religious/cultural prohibitions</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.ReligiousYesNo === true}
                      onChange={() => f.setReligiousYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.ReligiousYesNo === false}
                      onChange={() => f.setReligiousYesNo(false)}
                    />
                  </td>
                  <td>{f.ReligiousComment}</td>
                </tr>

                <tr
                  className={`${f.FearYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Fear of consequences</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.FearYesNo === true}
                      onChange={() => f.setFearYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.FearYesNo === false}
                      onChange={() => f.setFearYesNo(false)}
                    />
                  </td>
                  <td>{f.FearComment}</td>
                </tr>

                <tr
                  className={`${f.interventionYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Able to be engaged in intervention</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.interventionYesNo === true}
                      onChange={() => f.setInterventionYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.interventionYesNo === false}
                      onChange={() => f.setInterventionYesNo(false)}
                    />
                  </td>
                  <td>{f.interventionComment}</td>
                </tr>
                <tr
                  className={`${f.WillingYesNo === undefined && "table-row-hide-print"}`}
                >
                  <td>Willing to commit to keeping self safe</td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.WillingYesNo === true}
                      onChange={() => f.setWillingYesNo(true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      className="pointer-events-f.none"
                      type="checkbox"
                      checked={f.WillingYesNo === false}
                      onChange={() => f.setWillingYesNo(false)}
                    />
                  </td>
                  <td>{f.WillingComment}</td>
                </tr>

                {f.protectiveFactorsArray?.map((i, index) => (
                  <tr key={index}>
                    <td>{i?.type}</td>
                    <td>
                      <Form.Check
                        className="pointer-events-f.none"
                        type="checkbox"
                        checked={i.yesNo === true}
                      />
                    </td>
                    <td>
                      <Form.Check
                        className="pointer-events-f.none"
                        type="checkbox"
                        checked={i.yesNo === false}
                      />
                    </td>
                    <td className="pl-[20px]">{` ${i.comment}`}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col
            xs={12}
            md={12}
            className={`${!f.riskLevel && "table-row-hide-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label">
                Considering the responses to the above risk factors in
                combination with all the other information you know about the
                person (gender, age, f.diagnosis, balancing factors-resiliency
                and supports, would you rate the level of risk for this person
                for danger to self (DTS) as :
              </p>
              <div className="radio-inline">
                <Form.Check
                  className="pe-f.none"
                  inline
                  label="No Risk"
                  type="checkbox"
                  checked={f.riskLevel === "No Risk"}
                  onChange={() => f.setRiskLevel("No Risk")}
                />
                <Form.Check
                  className="pe-f.none"
                  inline
                  label="Low Risk"
                  type="checkbox"
                  checked={f.riskLevel === "Low Risk"}
                  onChange={() => f.setRiskLevel("Low Risk")}
                />
                <Form.Check
                  className="pe-f.none"
                  inline
                  label="Moderate Risk"
                  type="checkbox"
                  checked={f.riskLevel === "Moderate Risk"}
                  onChange={() => f.setRiskLevel("Moderate Risk")}
                />
                <Form.Check
                  className="pe-f.none"
                  inline
                  label="High Risk"
                  type="checkbox"
                  checked={f.riskLevel === "High Risk"}
                  onChange={() => f.setRiskLevel("High Risk")}
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col
            xs={12}
            md={12}
            className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
          >
            <Form.Label className="fw-bold w-100">Diagnoses</Form.Label>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Table
              responsive="lg"
              bordered
              className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
            >
              <thead
                className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && !f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && !f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && !f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
              >
                <tr>
                  <th>Mental Health Diagnoses</th>
                  <th>ICD Code</th>
                  <th className="w-50">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className={`${!f.psychiatricPrimaryIcdCode && !f.psychiatricPrimaryDescription && "table-row-hide-print"}`}
                >
                  <td>Primary*</td>
                  <td>{f.psychiatricPrimaryIcdCode}</td>
                  <td>{f.psychiatricPrimaryDescription || ""}</td>
                </tr>

                <tr
                  className={`${!f.psychiatricSecondaryicdCode && !f.psychiatricSecondaryDescription && "table-row-hide-print"}`}
                >
                  <td>Secondary</td>
                  <td>{f.psychiatricSecondaryicdCode}</td>
                  <td>{f.psychiatricSecondaryDescription || ""}</td>
                </tr>

                <tr
                  className={`${!f.psychiatricTertiaryIcdCode && !f.psychiatricTertiaryDescription && "table-row-hide-print"}`}
                >
                  <td>Tertiary</td>
                  <td>{f.psychiatricTertiaryIcdCode}</td>
                  <td>{f.psychiatricTertiaryDescription || ""}</td>
                </tr>

                <tr
                  className={`${!f.psychiatricAdditionalicdCode && !f.psychiatricAdditionalDescription && "table-row-hide-print"}`}
                >
                  <td>Additional</td>
                  <td>{f.psychiatricAdditionalicdCode}</td>
                  <td>{f.psychiatricAdditionalDescription || ""}</td>
                </tr>

                {f.psychiatricDiagnosesArray.map((i, index) => (
                  <tr key={index}>
                    <td>{i?.name}</td>
                    <td className="pl-[20px]">{i?.icdCode}</td>
                    <td className="pl-[20px]">{i?.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <Form.Label
              className={`fw-bold flex-shirnk-0 ${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
            >
              Medical Diagnoses
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            <Table
              responsive="lg"
              bordered
              className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
            >
              <thead
                className={`${!f.primaryIcdCode && !f.primaryDescription && !f.secondaryicdCode && !f.secondaryDescription && !f.TertiaryIcdCode && !f.TertiaryDescription && !f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
              >
                <tr>
                  <th>Medical Diagnoses</th>
                  <th>ICD Code</th>
                  <th className="w-50">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  className={`${!f.primaryIcdCode && !f.primaryDescription && "table-row-hide-print"}`}
                >
                  <td>Primary*</td>
                  <td>{f.primaryIcdCode}</td>
                  <td>{f.primaryDescription || ""}</td>
                </tr>

                <tr
                  className={`${!f.secondaryicdCode && !f.secondaryDescription && "table-row-hide-print"}`}
                >
                  <td>Secondary</td>
                  <td>{f.secondaryicdCode}</td>
                  <td>{f.secondaryDescription || ""}</td>
                </tr>

                <tr
                  className={`${!f.TertiaryIcdCode && !f.TertiaryDescription && "table-row-hide-print"}`}
                >
                  <td>Tertiary</td>
                  <td>{f.TertiaryIcdCode}</td>
                  <td>{f.TertiaryDescription || ""}</td>
                </tr>

                <tr
                  className={`${!f.Additional1icdCode && !f.Additional1Description && "table-row-hide-print"}`}
                >
                  <td>Additional</td>
                  <td>{f.Additional1icdCode}</td>
                  <td>{f.Additional1Description || ""}</td>
                </tr>

                {f.medicalDiagnosesArray.map((i, index) => (
                  <tr key={index}>
                    <td>{i?.name}</td>
                    <td className="pl-[20px]">{i?.icdCode}</td>
                    <td className="pl-[20px]">{i?.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={12}>
            <Form.Label
              className={`fw-bold flex-shirnk-0 ${!f.primarySupportGroup && !f.educationalProblems && !f.occupationalProblems && !f.sexualProblems && !f.maritalProblems && !f.housingProblems && !f.interactionWithLegalSystem && !f.otherBoolean && !f.accessToHealthCareServices && !f.familyProblems && !f.substanceUseInHome && "table-row-hide-print"}`}
            >
              Psychosocial or Environmental Stressors
            </Form.Label>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={12}
            className={`${!f.primarySupportGroup && !f.educationalProblems && !f.occupationalProblems && !f.sexualProblems && !f.maritalProblems && !f.housingProblems && !f.interactionWithLegalSystem && !f.otherBoolean && !f.accessToHealthCareServices && !f.familyProblems && !f.substanceUseInHome && "table-row-hide-print"}`}
          >
            <Card body className="mb-3">
              <div className="view-details-grid-inline">
                <p className="view-label fw-bold mb-1">
                  Problems with / related to :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    className="pointer-events-f.none"
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
                    className="pointer-events-f.none"
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
                    className="pointer-events-f.none"
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
                    className="pointer-events-f.none"
                    inline
                    label="Sexual problems"
                    type="checkbox"
                    id="sexualProblems"
                    checked={f.sexualProblems}
                    onChange={() => f.setSexualProblems(!f.sexualProblems)}
                  />
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Marital problems"
                    type="checkbox"
                    id="maritalProblems"
                    checked={f.maritalProblems}
                    onChange={() => f.setMaritalProblems(!f.maritalProblems)}
                  />
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Housing problems"
                    type="checkbox"
                    id="housingProblems"
                    checked={f.housingProblems}
                    onChange={() => f.setHousingProblems(!f.housingProblems)}
                  />
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Interaction with legal system"
                    type="checkbox"
                    id="interactionWithLegalSystem"
                    checked={f.interactionWithLegalSystem}
                    onChange={() =>
                      f.setInteractionWithLegalSystem(
                        !f.interactionWithLegalSystem,
                      )
                    }
                  />
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Other (please specify)"
                    type="checkbox"
                    id="otherBoolean"
                    checked={f.otherBoolean}
                    onChange={() => f.setOtherBoolean(!f.otherBoolean)}
                  />
                  {f.otherBoolean && (
                    <span className="view-value">{f.otherStressors}</span>
                  )}
                </div>
                <div className="radio-inline">
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Access to health care services"
                    type="checkbox"
                    id="accessToHealthCareServices"
                    checked={f.accessToHealthCareServices}
                    onChange={() =>
                      f.setAccessToHealthCareServices(
                        !f.accessToHealthCareServices,
                      )
                    }
                  />
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Family problems"
                    type="checkbox"
                    id="familyProblems"
                    checked={f.familyProblems}
                    onChange={() => f.setFamilyProblems(!f.familyProblems)}
                  />
                  <Form.Check
                    className="pointer-events-f.none"
                    inline
                    label="Substance use in home"
                    type="checkbox"
                    id="substanceUseInHome"
                    checked={f.substanceUseInHome}
                    onChange={() =>
                      f.setSubstanceUseInHome(!f.substanceUseInHome)
                    }
                  />
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={12}
            lg={12}
            className={`${f.setNoAndYes !== true && f.setNoAndYes !== false && "table-row-hide-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label">Significant recent losses : </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Yes"
                  type="checkbox"
                  id="setSetNoAndYes"
                  checked={f.setNoAndYes === true}
                  onChange={() => f.setSetNoAndYes(true)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="No"
                  type="checkbox"
                  id="setSetNoAndYesno"
                  checked={f.setNoAndYes === false}
                  onChange={() => f.setSetNoAndYes(false)}
                />
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col
            xs={12}
            md={12}
            lg={12}
            className={`${!f.death && !f.injury && !f.medicalSurgical && !f.job && !f.divorceSeparation && !f.accidentInjury && !f.childRemovedFromHouse && !f.violentActsAgainstPersonFamily && !f.otherSignificantRecentLosses && "table-row-hide-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label">
                If yes, please check applicable loss(es) :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Death"
                  type="checkbox"
                  id="death"
                  checked={f.death}
                  onChange={() => f.setDeath(!f.death)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Injury"
                  type="checkbox"
                  id="injury"
                  checked={f.injury}
                  onChange={() => f.setInjury(!f.injury)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Medical/ surgical"
                  type="checkbox"
                  id="medicalSurgical"
                  checked={f.medicalSurgical}
                  onChange={() => f.setMedicalSurgical(!f.medicalSurgical)}
                />
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Job"
                  type="checkbox"
                  id="job"
                  checked={f.job}
                  onChange={() => f.setJob(!f.job)}
                />{" "}
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Divorce / separation"
                  type="checkbox"
                  id="divorceSeparation"
                  checked={f.divorceSeparation}
                  onChange={() => f.setDivorceSeparation(!f.divorceSeparation)}
                />{" "}
                <Form.Check
                  className="pointer-events-f.none"
                  inline
                  label="Accident /injury"
                  type="checkbox"
                  id="accidentInjury"
                  checked={f.accidentInjury}
                  onChange={() => f.setAccidentInjury(!f.accidentInjury)}
                />
                <Form.Check
                  className="pointer-events-f.none"
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
                  className="pointer-events-f.none"
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
                  className="pointer-events-f.none"
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
                  <span className="pe-f.none view-value">
                    {f.otherSignificantRecentLossesType}
                  </span>
                )}
              </div>
            </div>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Additional Notes : </p>
              <h5 className="view-value mb-0">{f.additionalNotes}</h5>
            </div>
            <div className="view-details-grid view-details-grid-inline my-1 mt-md-2 p-3 mb-3">
              <p className="view-label mb-1"> Clinical Summary : </p>
              <h5 className="view-value mb-0">{f.clinicalSummary}</h5>
            </div>
          </Col>
        </Row>
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
                />
                <Form.Check
                  inline
                  label="PHP"
                  type="checkbox"
                  id=" PHP"
                  checked={f.treatmentRecommendations?.includes("PHP")}
                />
                {/* <Form.Check
                                      inline
                                      label="Maladaptive physical or sexual behaviors"
                                      type="checkbox"
                                      id="maladaptivePhysical"
                                      checked={f.treatmentRecommendations?.includes("maladaptivePhysical")}
                                                                         /> */}
                <Form.Check
                  inline
                  label="IOP"
                  type="checkbox"
                  id="IOP"
                  checked={f.treatmentRecommendations?.includes("IOP")}
                />
                <Form.Check
                  inline
                  label="Sober Living"
                  type="checkbox"
                  id="soberLiving"
                  checked={f.treatmentRecommendations?.includes("soberLiving")}
                />
                <Form.Check
                  inline
                  label="Assisted Living"
                  type="checkbox"
                  id="assistedLiving"
                  checked={f.treatmentRecommendations?.includes(
                    "assistedLiving",
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
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
              disabled={
                f.Profile.userType === ROLES.EMPLOYEE ||
                f.Profile.userType === ROLES.ADMIN
              }
              className={`${f.Profile.userType === ROLES.EMPLOYEE || f.Profile.userType === ROLES.ADMIN ? "pe-f.none" : ""}`}
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
              disabled={
                f.Profile.userType === ROLES.EMPLOYEE ||
                f.Profile.userType === ROLES.ADMIN
              }
              className={`${f.Profile.userType === ROLES.EMPLOYEE || f.Profile.userType === ROLES.ADMIN ? "pe-f.none" : ""}`}
              checked={f.acceptResident === false}
              onChange={() => f.setAcceptResident(false)}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
}

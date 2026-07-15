/** @format */

import React from "react";
import { Row, Col, Form, Table } from "react-bootstrap";
import { useViewInitialAssessmentForm } from "../formContext";

export default function SafetyRiskSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          className={`${f.riskYesNo === undefined && f.PriorYesNo === undefined && f.AccessYesNo === undefined && f.SubstanceYesNo === undefined && f.abusingYesNo === undefined && f.RecentYesNo === undefined && f.behaviourYesNO === undefined && f.SymptomsYesNO === undefined && f.FamilyYesNO === undefined && f.TerminalYesNO === undefined && f.CurrentYesNO === undefined && f.ChronicYesNO === undefined && "table-row-hide-print"}`}
        >
          <Form.Label className="fw-bold w-100">Risk Factors</Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12}>
          <Table
            responsive
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
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.riskYesNo === true}
                    onChange={() => f.setRiskYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.riskYesNo === false}
                    onChange={() => f.setRiskYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.riskComment}</td>
              </tr>

              <tr
                className={`${f.PriorYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Prior suicide attempt</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PriorYesNo === true}
                    onChange={() => f.setPriorYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.PriorYesNo === false}
                    onChange={() => f.setPriorYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.PriorComment}</td>
              </tr>

              <tr
                className={`${f.AccessYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Access to means (i.e. weapon)</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.AccessYesNo === true}
                    onChange={() => f.setAccessYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.AccessYesNo === false}
                    onChange={() => f.setAccessYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.AccessComment}</td>
              </tr>

              <tr
                className={`${f.SubstanceYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Substance abuse</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SubstanceYesNo === true}
                    onChange={() => f.setSubstanceYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SubstanceYesNo === false}
                    onChange={() => f.setSubstanceYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.SubstanceAbuseComment}</td>
              </tr>

              <tr
                className={`${f.abusingYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Other self-abusing behavior</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.abusingYesNo === true}
                    onChange={() => f.setabusingYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.abusingYesNo === false}
                    onChange={() => f.setabusingYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.abusingComment}</td>
              </tr>

              <tr
                className={`${f.RecentYesNo === undefined && "table-row-hide-print"}`}
              >
                <td>Recent losses/lack of support</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.RecentYesNo === true}
                    onChange={() => f.setRecentYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.RecentYesNo === false}
                    onChange={() => f.setRecentYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.RecentComment}</td>
              </tr>

              <tr
                className={`${f.behaviourYesNO === undefined && "table-row-hide-print"}`}
              >
                <td>Behavior cues</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.behaviourYesNO === true}
                    onChange={() => f.setBehaviourYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.behaviourYesNO === false}
                    onChange={() => f.setBehaviourYesNo(false)}
                  />
                </td>
                <td className="text-justify">
                  <ul className="ps-3 mt-0 mb-0">
                    {f.behaviorcuesDropDown?.map((i, index) => (
                      <li className="mb-2 list-disc" key={index}>
                        {i.label}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              <tr
                className={`${f.SymptomsYesNO === undefined && "table-row-hide-print"}`}
              >
                <td>Symptoms of psychosis </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SymptomsYesNO === true}
                    onChange={() => f.setSymptomsYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.SymptomsYesNO === false}
                    onChange={() => f.setSymptomsYesNo(false)}
                  />
                </td>
                <td className="text-justify">
                  <ul className="ps-3 mt-0 mb-0">
                    {f.symptomsOfPsychosisDropDown?.map((i, index) => (
                      <li className="mb-2 list-disc" key={index}>
                        {i.label}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              <tr
                className={`${f.FamilyYesNO === undefined && "table-row-hide-print"}`}
              >
                <td>Family history of suicide</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.FamilyYesNO === true}
                    onChange={() => f.setFamilyYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.FamilyYesNO === false}
                    onChange={() => f.setFamilyYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.Family}</td>
              </tr>

              <tr
                className={`${f.TerminalYesNO === undefined && "table-row-hide-print"}`}
              >
                <td>Terminal physical illness</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TerminalYesNO === true}
                    onChange={() => f.setTerminalYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.TerminalYesNO === false}
                    onChange={() => f.setTerminalYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.Terminal}</td>
              </tr>

              <tr
                className={`${f.CurrentYesNO === undefined && "table-row-hide-print"}`}
              >
                <td>Current stressors (specify)</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.CurrentYesNO === true}
                    onChange={() => f.setCurrentYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.CurrentYesNO === false}
                    onChange={() => f.setCurrentYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.Current}</td>
              </tr>

              <tr
                className={`${f.ChronicYesNO === undefined && "table-row-hide-print"}`}
              >
                <td>Chronic pain</td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ChronicYesNO === true}
                    onChange={() => f.setChronicYesNo(true)}
                  />
                </td>
                <td>
                  <Form.Check
                    disabled
                    inline
                    className="pointer-events-f.none"
                    type="checkbox"
                    checked={f.ChronicYesNO === false}
                    onChange={() => f.setChronicYesNo(false)}
                  />
                </td>
                <td className="text-justify">{f.ChronicPain}</td>
              </tr>

              {f.riskFactorArray.length > 0 &&
                f.riskFactorArray?.map((i, index) => (
                  <tr key={index}>
                    <td>{i.type}</td>
                    <td>
                      <Form.Check
                        disabled
                        inline
                        className="pointer-events-f.none"
                        type="checkbox"
                        checked={i.yesNo === true}
                      />
                    </td>
                    <td>
                      <Form.Check
                        disabled
                        inline
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
    </>
  );
}

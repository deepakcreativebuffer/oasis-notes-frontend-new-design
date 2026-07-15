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

export default function TreatmentPlanUpdateProvidersGoalsSection() {
  const f = useTreatmentPlanUpdateFormContext();
  return (
    <>
      <div
        className={`${!f.residentGoal && !f.allergies && !f.Triggers && f.strengths?.length < 1 && f.Barriers?.length < 1 && "hide-data-on-view-print"}`}
      >
        <Form.Label className="fw-bold w-100">
          Residents receive treatment services from the above provider(s) every
          1 to 2 months or earlier as needed. Specialty providers are to be
          managed and referred per primary care medical provider.
        </Form.Label>

        <Row>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className={`${!f.residentGoal && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Resident Goals : </p>
              <h5 className="view-value mb-0">{f.residentGoal}</h5>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="mb-3">
            {(() => {
              let yes = null;
              let comment = "";
              const arr =
                f.patientDetail?.allergies ||
                f.getApiData?.data?.patientId?.allergies ||
                f.getApiData?.patientId?.allergies;
              if (arr && Array.isArray(arr) && arr.length > 0) {
                const allergy = arr[0];
                if (allergy) {
                  yes = allergy.yes;
                  comment = allergy.comments || "";
                }
              }

              return (
                <Table responsive="lg" bordered className="mb-0 mt-3">
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th className="text-center">Yes</th>
                      <th className="text-center">No</th>
                      <th className="w-50">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Allergies</td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={yes === true}
                          readOnly
                          disabled
                        />
                      </td>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          checked={yes === false}
                          readOnly
                          disabled
                        />
                      </td>
                      <td>{comment}</td>
                    </tr>
                  </tbody>
                </Table>
              );
            })()}
          </Col>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className={`${!f.Triggers && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Triggers : </p>
              <h5 className="view-value mb-0">{f.Triggers}</h5>
            </div>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            className={`mb-3 ${f.strengths?.length < 1 && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
              <p className="view-label mb-1">Resident's Strength : </p>
              <div className="view-value">
                <ul className="ps-3 mt-2 mb-0 tw-column">
                  {f.strengths?.map((i, index) => (
                    <li className="mb-2 list-disc" key={index}>
                      {i.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold mb-1">Barriers</Form.Label>
              <div className="radio-inline">
                {[
                  { label: "Cognitive", value: "Cognitive" },
                  { label: "Lack of Insight", value: "Lack of Insight" },
                  { label: "Financial", value: "Financial" },
                  {
                    label: "Refusal of Treatment/services",
                    value: "Refusal of Treatment/services",
                  },
                  { label: "Social Stigma", value: "Social Stigma" },
                  {
                    label: "Housing instability",
                    value: "Housing instability",
                  },
                  {
                    label: "Racial/Cultural discrimination",
                    value: "Racial/Cultural discrimination",
                  },
                  {
                    label: "Language/Communication barriers",
                    value: "Language/Communication barriers",
                  },
                  {
                    label: "Poor health literacy",
                    value: "Poor health literacy",
                  },
                  {
                    label: "Social determinants of health",
                    value: "Social determinants of health",
                  },
                  {
                    label:
                      "Limited availibility to Mental Health awareness & Education",
                    value:
                      "Limited availibility to Mental Health awareness & Education",
                  },
                  {
                    label: "Lack of Mental Health professionals & Services",
                    value: "Lack of Mental Health professionals & Services",
                  },
                  {
                    label:
                      "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                    value:
                      "Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations",
                  },
                  { label: "Unresolved Trauma", value: "Unresolved Trauma" },
                  {
                    label: "Emerging Psychotic symptoms",
                    value: "Emerging Psychotic symptoms",
                  },
                  {
                    label: "Substance use cravings",
                    value: "Substance use cravings",
                  },
                  {
                    label: "Cognitive distortions",
                    value: "Cognitive distortions",
                  },
                  {
                    label: "Functional dependence",
                    value: "Functional dependence",
                  },
                  {
                    label: "Lack of coordination between care providers",
                    value: "Lack of coordination between care providers",
                  },
                  {
                    label: "Geographical barriers",
                    value: "Geographical barriers",
                  },
                  { label: "Transportation", value: "Transportation" },
                  { label: "Childcare", value: "Childcare" },
                  { label: "Time constraint", value: "Time constraint" },
                  { label: "Other", value: "Other" },
                ].map((opt, idx) => (
                  <Form.Check
                    key={idx}
                    inline
                    label={opt.label}
                    type="checkbox"
                    id={`barrier-${idx}`}
                    disabled
                    checked={
                      f.Barriers?.includes(opt.value) ||
                      f.Barriers?.includes(
                        opt.label.charAt(0).toLowerCase() +
                          opt.label.slice(1).replace(/[^a-zA-Z]/g, ""),
                      ) ||
                      f.Barriers?.includes(opt.value.toLowerCase())
                    }
                  />
                ))}
                {f.barriersBoolean && (
                  <input
                    type="text"
                    className="border-bottom border-0 outline-none ms-2 bg-transparent"
                    style={{ borderBottom: "1px solid #ced4da" }}
                    disabled
                    value={f.barriersOther || ""}
                  />
                )}
              </div>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label className="fw-bold mb-1">Comment</Form.Label>
              <Form.Control
                as="textarea"
                disabled
                value={f.barriersText || ""}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
    </>
  );
}

/** @format */

import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";
import { useViewInitialAssessmentForm } from "../formContext";

export default function PatientAdmissionSection() {
  const f = useViewInitialAssessmentForm();
  return (
    <>
      <Row className="print-block-row">
        <Col xs={12}>
          <Form.Label className="fw-bold w-100 h5 text-center">
            SECTION I
          </Form.Label>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col xs={12} sm={5} md={6} lg={4}>
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Resident's Full Name :</p>
            <h5 className="view-value mb-0">{f.residentName}</h5>
          </div>
        </Col>
        <Col xs={12} sm={3} md={6} lg={4}>
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">AHCCCS ID : </p>
            <h5 className="view-value mb-0">{f.ahcccsId}</h5>
          </div>
        </Col>
        <Col xs={12} sm={4} md={12} lg={4}>
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Date of Birth : </p>
            <h5 className="view-value mb-0">
              {f.dob && formatDateToMMDDYYYY(f.dob)}
            </h5>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={8}
          md={12}
          lg={12}
          className={`${!f.sex && "table-row-hide-print"}`}
        >
          {f.userType !== ROLES.PATIENT ? (
            <div className="view-details-grid align-items-lg-center my-1 my-md-2 p-3">
              <p className="view-label mb-1 mb-md-0">Gender : </p>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Male"
                  type="radio"
                  id="maleRadio"
                  checked={f.sex === "Male"}
                  onChange={() => f.setSex("Male")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Female"
                  type="radio"
                  id="femaleRadio"
                  checked={f.sex === "Female"}
                  onChange={() => f.setSex("Female")}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Transgender"
                  type="radio"
                  id="femaleRadio"
                  checked={f.sex === "Transgender"}
                  onChange={() => f.setSex("Transgender")}
                />
              </div>
            </div>
          ) : (
            <div className="view-details-grid align-items-lg-center my-1 my-md-2 p-3">
              <p className="view-label mb-1 mb-md-0">Gender : </p>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  inline
                  className="pointer-events-f.none"
                  label="Male"
                  type="radio"
                  id="maleRadio"
                  checked={f.sex === "Male"}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Female"
                  type="radio"
                  id="femaleRadio"
                  checked={f.sex === "Female"}
                />
                <Form.Check
                  disabled
                  className="pointer-events-f.none"
                  inline
                  label="Transgender"
                  type="radio"
                  id="femaleRadio"
                  checked={f.sex === "Transgender"}
                />
              </div>
            </div>
          )}
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col xs={12} sm={4} md={6} lg={4}>
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Admit Date : </p>
            <h5 className="view-value mb-0">
              {f.dateOfAssessment && formatDateToMMDDYYYY(f.dateOfAssessment)}
            </h5>
          </div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={8}>
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Diagnosis (specify if new or continuing) :{" "}
            </p>
            <h5 className="view-value mb-0">{f.diagnosis}</h5>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!f.preferredLanguage && "table-row-hide-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Preferred Language : </p>
            <h5 className="view-value mb-0">{f.preferredLanguage}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={8}
          className={`${!f.ethnicity && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Ethnicity : </p>
            <h5 className="view-value mb-0">{f.ethnicity}</h5>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={4}
          className={`${!f.programLocation && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Program Location & Address : </p>
            <h5 className="view-value mb-0">{f.programLocation}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={8}
          className={`${f.admissionStatus?.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Admission Status : </p>
            <div className="radio-inline">
              <Form.Check
                disabled
                inline
                label="Voluntary"
                type="checkbox"
                id="Voluntary"
                checked={f.admissionStatus.includes("Voluntary")}
              />
              <Form.Check
                disabled
                inline
                label="Court Ordered Treatment"
                type="checkbox"
                id="courtOrderedTreatment"
                checked={f.admissionStatus.includes("Court Ordered Treatment")}
              />
            </div>
            {/* <div className="view-value mb-0">
                      <ul className="ps-3 mt-2">
                        {f.admissionStatus?.map((i, index) => (
                          <li
                            className="mb-2 list-disc"
                            key={index}
                          >
                            {i.label}
                          </li>
                        ))}
                      </ul>
                     </div> */}
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={4}
          className={`${!f.guardianship && "table-row-hide-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Guardianship Yes/No : </p>
            <h5 className="view-value mb-0">{f.guardianship}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={4}
          className={`${!f.powerOfAttorneyStatus && "table-row-hide-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Power of Attorney Status : </p>
            <h5 className="view-value mb-0">{f.powerOfAttorneyStatus}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={6}
          lg={4}
          className={`${!f.todayDate && "table-row-hide-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Today’s Date : </p>
            <h5 className="view-value mb-0">
              {f.todayDate && formatDateToMMDDYYYY(f.todayDate)}
            </h5>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={8}
          className={`${!f.guardianshipPoaPubFidName && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Guardianship/POA/PUB FID Name : </p>
            <h5 className="view-value mb-0">{f.guardianshipPoaPubFidName}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!f.approvedBy && "table-row-hide-print"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Approved By : </p>
            <h5 className="view-value mb-0">{f.approvedBy}</h5>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={8}
          className={`mb-3 ${f.reasonForAdmission.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
            <p className="view-label mb-1">Presenting Problems : </p>
            <div className="view-value mb-0">
              <ul className="ps-3 mt-2 mb-0">
                {f.reasonForAdmission?.map((i, index) => (
                  <li className="mb-2 list-disc" key={index}>
                    {i.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`mb-3 ${f.residentStrengths.length < 1 && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
            <p className="view-label mb-1">Resident’s Strength : </p>
            <div className="view-value mb-0">
              <ul className="ps-3 mt-2 mb-0">
                {f.residentStrengths?.map((i, index) => (
                  <li className="mb-2 list-disc" key={index}>
                    {i.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col xs={12} sm={12} md={12} lg={12}>
          <Card body className="mb-3 ">
            <Form.Label className="fw-bold">BHRF Criteria</Form.Label>
            <div className="radio-inline">
              <Form.Check
                disabled
                inline
                label="Thoughts or behaviors of suicide, homicide, or harm to self or others"
                type="checkbox"
                id="thoughtsBehaviorsOfSuicide"
                checked={f.bhrfCriteria?.includes("thoughtsBehaviorsOfSuicide")}
              />
              <Form.Check
                disabled
                inline
                label="Impulsivity with poor judgement/insight"
                type="checkbox"
                id="impulsivityWithPoorJudgement"
                checked={f.bhrfCriteria?.includes(
                  "impulsivityWithPoorJudgement",
                )}
              />
              <Form.Check
                disabled
                inline
                label="Maladaptive physical or sexual behaviors"
                type="checkbox"
                id="maladaptivePhysical"
                checked={f.bhrfCriteria?.includes("maladaptivePhysical")}
              />
              <Form.Check
                disabled
                inline
                label="Inability to remain safe within environment, despite environmental support (i.e. informal support)"
                type="checkbox"
                id="inabilityToRemainSafe"
                checked={f.bhrfCriteria?.includes("inabilityToRemainSafe")}
              />
              <Form.Check
                disabled
                inline
                label="Medication side effects due to toxicity or contraindications"
                type="checkbox"
                id="medicationSideEffects"
                checked={f.bhrfCriteria?.includes("medicationSideEffects")}
              />
              <Form.Check
                disabled
                inline
                label="Inability to complete developmentally appropriate selfcare or self-regulation due to behavioral health condition(s)"
                type="checkbox"
                id="inabilityToCompleteDevelopmentally"
                checked={f.bhrfCriteria?.includes(
                  "inabilityToCompleteDevelopmentally",
                )}
              />
              <Form.Check
                disabled
                inline
                label="Neglect or disruption of ability to attend to majority of basic needs, such as personal safety, hygiene, nutrition, or medical care"
                type="checkbox"
                id="neglectDisruptionOfAbility"
                checked={f.bhrfCriteria?.includes("neglectDisruptionOfAbility")}
              />
              <Form.Check
                disabled
                inline
                label="Frequent inpatient psychiatric admissions, or legal involvement due to lack of insight or judgement associated with psychotic or affective/mood symptoms or major psychiatric disorders"
                type="checkbox"
                id="frequentInpatientPsychiatricAdmissions"
                checked={f.bhrfCriteria?.includes(
                  "frequentInpatientPsychiatricAdmissions",
                )}
              />
              <Form.Check
                disabled
                inline
                label="Frequent withdrawal management services, which can include but are not limited to, detox facilities, Medicated Assisted Treatment (MAT), and ambulatory detox"
                type="checkbox"
                id="frequentWithdrawalManagementServices"
                checked={f.bhrfCriteria?.includes(
                  "frequentWithdrawalManagementServices",
                )}
              />
              <Form.Check
                disabled
                inline
                label="Inability to independently self-administer medically necessary psychotropic medication despite interventions such as education, regimen simplification, daily outpatient dispensing, and long acting injectable medications"
                type="checkbox"
                id="inabilityToIndependently"
                checked={f.bhrfCriteria?.includes("inabilityToIndependently")}
              />
              <Form.Check
                disabled
                inline
                label="Impairments persisting in the absence of situational stressors that delay recovery from the presenting problem"
                type="checkbox"
                id="impairmentsPersisting"
                checked={f.bhrfCriteria?.includes("impairmentsPersisting")}
              />
              <Form.Check
                disabled
                inline
                label="A behavioral health need for 24 hour supervision to develop adequate and effective coping skills that will allow the member to live safely in the community"
                type="checkbox"
                id="behavioralHealth"
                checked={f.bhrfCriteria?.includes("behavioralHealth")}
              />
              <Form.Check
                disabled
                inline
                label="Anticipated stabilization cannot be achieved in a less restrictive setting"
                type="checkbox"
                id="anticipatedStabilization"
                checked={f.bhrfCriteria?.includes("anticipatedStabilization")}
              />
              <Form.Check
                disabled
                inline
                label="Evidence that behavioral health treatment in a less restrictive level of care (e.g. Intensive Outpatient Program, IOP, Partial Hospitalization Program,  PHP, etc.) has not been successful or is not available, therefore "
                type="checkbox"
                id="evidenceThatBehavioral"
                checked={f.bhrfCriteria?.includes("evidenceThatBehavioral")}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!f.residentGoals && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Resident’s Goals : </p>
            <h5 className="view-value mb-0">{f.residentGoals}</h5>
          </div>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!f.stepDownBarriers?.length && "table-row-hide-print"}`}
        >
          <Card body className="mb-3">
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
                    disabled
                    key={idx}
                    inline
                    label={opt.label}
                    type="checkbox"
                    id={`barrier-${idx}`}
                    className="pointer-events-f.none"
                    checked={f.stepDownBarriers?.includes(opt.value)}
                  />
                ))}

                {f.stepDownBarriersBoolean && (
                  <input
                    type="text"
                    className="border-bottom border-0 outline-none ms-2 bg-transparent"
                    style={{ borderBottom: "1px solid #ced4da" }}
                    disabled
                    value={f.stepDownBarriersOther || ""}
                  />
                )}
              </div>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label className="fw-bold">Comment:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={f.stepDownBarriersText}
                disabled
              />
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row className="print-block-row">
        <Col
          xs={12}
          md={12}
          lg={12}
          className={`${!f.currentBehavioralIssues && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Current Behavioral / Medical Issues / Symptoms Reported by the
              Resident :{" "}
            </p>
            <h5 className="view-value mb-0">{f.currentBehavioralIssues}</h5>
          </div>
        </Col>
      </Row>
    </>
  );
}

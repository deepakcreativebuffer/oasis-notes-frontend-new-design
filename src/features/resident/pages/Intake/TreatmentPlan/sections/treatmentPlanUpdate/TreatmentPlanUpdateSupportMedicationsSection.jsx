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
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { BorderlessInput } from "@/utils/Makers";

export default function TreatmentPlanUpdateSupportMedicationsSection() {
  const f = useTreatmentPlanUpdateFormContext();
  return (
    <>
      <div
        className={`${f.supportSystem?.length < 1 && !f.supportSystemPhoneNumber && !f.currentMedications && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col
            xs={12}
            md={12}
            lg={12}
            className={`${f.supportSystem?.length < 1 && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">Support System : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Family"
                  className="pe-none"
                  type="checkbox"
                  id="Family"
                  checked={f.supportSystem.includes("Family")}
                  onChange={() => f.handleCheckboxChangeSupportSystem("Family")}
                />
                <Form.Check
                  inline
                  label="Friends"
                  className="pe-none"
                  type="checkbox"
                  id="Friends"
                  checked={f.supportSystem.includes("Friends")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Friends")
                  }
                />
                <Form.Check
                  inline
                  label="BHRF Staff"
                  className="pe-none"
                  type="checkbox"
                  id="BHRF f.staff"
                  checked={f.supportSystem.includes("BHRF f.staff")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("BHRF f.staff")
                  }
                />
                <Form.Check
                  inline
                  label="Clinical Team"
                  className="pe-none"
                  type="checkbox"
                  id="clinicalteam"
                  checked={f.supportSystem.includes("Clinical Team")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Clinical Team")
                  }
                />
                <Form.Check
                  inline
                  label="Guardian"
                  className="pe-none"
                  type="checkbox"
                  id="Guardian"
                  checked={f.supportSystem.includes("Guardian")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Guardian")
                  }
                />
                <Form.Check
                  inline
                  label="Sponsor Name"
                  className="pe-none"
                  type="checkbox"
                  id="Sponsor name"
                  checked={f.supportSystem.includes("Sponsor name")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Sponsor name")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  className="pe-none"
                  type="checkbox"
                  checked={f.supportSystem.includes("Other")}
                  onChange={() => f.handleCheckboxChangeSupportSystem("Other")}
                />
                {f.supportSystemOtherTextBoolean && (
                  <span className="view-value">{f.supportSystemOtherText}</span>
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className={`${!f.supportSystemPhoneNumber && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Phone Number : </p>
              <h5 className="view-value mb-0">{f.supportSystemPhoneNumber}</h5>
            </div>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className={`${!f.currentMedications && "hidePrint" && "hide-data-on-view-print"}`}
          >
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Current List of medication : </p>
              <h5 className="view-value mb-0">{f.currentMedications}</h5>
            </div>
          </Col>
        </Row>
      </div>
      <div className={`${!f.religiousPreference && "hide-data-on-view-print"}`}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">
                Religious/Cultural Preference :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Christian"
                  className="pe-none"
                  type="checkbox"
                  id="Christian"
                  checked={f.religiousPreference?.includes("Christian")}
                  onChange={() => f.setreligiousPreference("Christian")}
                />
                <Form.Check
                  inline
                  label="Catholic"
                  className="pe-none"
                  type="checkbox"
                  id="Catholic"
                  checked={f.religiousPreference?.includes("Catholic")}
                  onChange={() => f.setreligiousPreference("Catholic")}
                />
                <Form.Check
                  inline
                  label="Buddhist"
                  className="pe-none"
                  type="checkbox"
                  id="Buddhist"
                  checked={f.religiousPreference?.includes("Buddhist")}
                  onChange={() => f.setreligiousPreference("Buddhist")}
                />
                <Form.Check
                  inline
                  label="Islam"
                  className="pe-none"
                  type="checkbox"
                  id="Islam"
                  checked={f.religiousPreference?.includes("Islam")}
                  onChange={() => f.setreligiousPreference("Islam")}
                />
                <Form.Check
                  inline
                  label="Judaism"
                  className="pe-none"
                  type="checkbox"
                  id="Judaism"
                  checked={f.religiousPreference?.includes("Judaism")}
                  onChange={() => f.setreligiousPreference("Judaism")}
                />
                <Form.Check
                  inline
                  label="Hinduism"
                  className="pe-none"
                  type="checkbox"
                  id="Hinduism"
                  checked={f.religiousPreference?.includes("Hinduism")}
                  onChange={() => f.setreligiousPreference("Hinduism")}
                />
                <Form.Check
                  inline
                  label="Mormonism"
                  className="pe-none"
                  type="checkbox"
                  id="Mormonism"
                  checked={f.religiousPreference?.includes("Mormonism")}
                  onChange={() => f.setreligiousPreference("Mormonism")}
                />
                <Form.Check
                  inline
                  label="Other"
                  className="pe-none"
                  type="checkbox"
                  id="Other"
                  checked={f.religiousPreference?.includes("Other")}
                  onChange={() => f.setreligiousPreference("Other")}
                />
                {(f.religiousPreference === "Other" ||
                  f.religiousPreference?.includes("Other")) && (
                  <span className="view-value">
                    {f.religiousPreferenceText}
                  </span>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        body
        className={`mb-3 ${f.nutritionAndWellnessPlanning?.length < 1 && "hidePrint" && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3 h-100">
              <p className="view-label fw-bold mb-1">
                Nutrition and wellness Planning :{" "}
              </p>
              <div className="d-inline pointer-events-none">
                <div className="view-value">
                  <ul className="ps-3 mt-2 mb-0 tw-column">
                    {f.nutritionAndWellnessPlanning?.map((i, index) => (
                      <li className="mb-2 list-disc" key={index}>
                        {i.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`mb-sm-2 mb-md-3 ${(f.isRequiresAssistance === null || f.isRequiresAssistance === undefined) && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1 ">
                  Resident requires Assistance to maintain personal funds and/or
                  handle personal finances :
                </p>
                <h5 className="view-value mb-0 mx-2">
                  {f.isRequiresAssistance === true ? "Yes" : "No"}
                </h5>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">{f.personalFinancesComment}</h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`mb-sm-2 mb-md-3 ${(f.isFallRisk === null || f.isFallRisk === undefined) && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">Fall Risk :</p>
                <h5 className="view-value mb-0 mx-2">
                  {f.isFallRisk === true ? "Yes" : "No"}
                </h5>
              </div>
              <div className={`view-details-grid-inline my-md-2 px-3 py-2`}>
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">{f.fallRiskComment}</h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`${!f.recommendationToExtendResidentialTreatment && !f.personalFinances && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">
                Recommendation to extend residential treatment for :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="30 Days"
                  className="pe-none"
                  type="checkbox"
                  id="30 Days"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "30 Days",
                  )}
                  onChange={() =>
                    f.setRecommendationToExtendResidentialTreatment("30 Days")
                  }
                />
                <Form.Check
                  inline
                  label="60 Days"
                  className="pe-none"
                  type="checkbox"
                  id="60 Days"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "60 Days",
                  )}
                  onChange={() =>
                    f.setRecommendationToExtendResidentialTreatment("60 Days")
                  }
                />
                <Form.Check
                  inline
                  label="90 Day"
                  className="pe-none"
                  type="checkbox"
                  id="90 Day"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "90 Day",
                  )}
                  onChange={() =>
                    f.setRecommendationToExtendResidentialTreatment("90 Day")
                  }
                />
                <Form.Check
                  inline
                  label="Initial"
                  className="pe-none"
                  type="checkbox"
                  id="Initial"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "Initial",
                  )}
                  onChange={() =>
                    f.setRecommendationToExtendResidentialTreatment("Initial")
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Table
            responsive="md"
            bordered
            className={`table-fix-layout ${!f.services.length > 0 && "hide-data-on-view-print"}`}
          >
            <thead
              className={`${!f.services.length > 0 && "hide-data-on-view-print"}`}
            >
              <tr>
                <th>Services Provided</th>
                <th>Daily</th>
                <th>Weekly</th>
                <th>Monthly</th>
                <th>As Needed</th>
                <th> Additional Notes</th>
              </tr>
            </thead>
            <tbody>
              {f.services?.length > 0 &&
                f.services?.map((service, index) => (
                  <tr key={index}>
                    <td>{service.serviceProvided}</td>
                    <td>
                      {
                        <ul className="ps-3 mt-2">
                          {service.daily?.map((i, index) => (
                            <li className="mb-2 list-disc" key={index}>
                              {i.label}
                            </li>
                          ))}
                        </ul>
                      }
                    </td>
                    <td>
                      {
                        <ul className="ps-3 mt-2">
                          {service.weekly?.map((i, index) => (
                            <li className="mb-2 list-disc" key={index}>
                              {i.label}
                            </li>
                          ))}
                        </ul>
                      }
                    </td>
                    <td>
                      {
                        <ul className="ps-3 mt-2">
                          {service.monthly?.map((i, index) => (
                            <li className="mb-2 list-disc" key={index}>
                              {i.label}
                            </li>
                          ))}
                        </ul>
                      }
                    </td>
                    <td>
                      {
                        <ul className="ps-3 mt-2">
                          {service.asNeeded?.map((i, index) => (
                            <li className="mb-2 list-disc" key={index}>
                              {i.label}
                            </li>
                          ))}
                        </ul>
                      }
                    </td>
                    <td className="text-justify">{service.additionalNotes}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {f.bhServicesLimitsFunctioning !== null && (
        <div
          className={`${f.bhServicesLimitsFunctioning === null && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid d-block my-1 my-md-2 p-3">
                <div
                  className={`mt-3 form-print-group ${f.bhServicesLimitsFunctioning === null && "hide-data-on-view-print"}`}
                >
                  <div className="view-details-grid-inline">
                    <p className="view-label mb-1">
                      BH Services for members whose BH issues limits their
                      ability to function independently :
                    </p>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="bhServicesYes"
                        checked={f.bhServicesLimitsFunctioning === true}
                        readOnly
                        disabled
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="bhServicesNo"
                        checked={f.bhServicesLimitsFunctioning === false}
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="view-details-grid-inline">
                  <p className="view-label fw-bold mb-1">
                    Discharge planning & Re-evaluation of initial symptoms,
                    behaviours & Goals :{" "}
                  </p>
                  <div
                    className={`radio-inline ${f.dischargePlanning?.length < 1 && "hide-data-on-view-print"}`}
                  >
                    {[
                      "Follow-up Medical appointments upon discharge",
                      "Submit application for higher or lower level of care",
                      "Continue with case manager for additional support and resources",
                      "Continue counseling services after discharge",
                      "Follow up with parole/probation officers to ensure compliance",
                      "Resident will follow up with Psychiatric provider 7 days after discharge",
                      "Resident to follow up with other specialist as scheduled or sooner if necessary",
                      "Resident to follow up with Primary Care Provider 7 days after discharge",
                      "Case manager will coordinate with the client to ensure access to ongoing outpatient therapy, substance use counseling, and mental health services after discharge (post-discharge)",
                      "Resident to continue (weekly, monthly) counseling to support ongoing mental and physical health",
                      "If court involvement applies, coordinate with parole/probation officers to ensure compliance",
                      "Participation in life skills development (financial literacy, job readiness, conflict resolution)",
                      "Encouragement to rebuild family relationships and expand pro-social support systems",
                      "Reconnect with culturally grounded identity and long-term wellness goals",
                      "Connection with a tribal behavioral health representative or community elder for spiritual guidance",
                      "Participation in culturally relevant practices such as talking circles, smudging, or traditional ceremonies when available",
                      "Provide all providers contact information for care coordination",
                      "Other",
                    ].map((opt, idx) => (
                      <Form.Check
                        disabled
                        key={idx}
                        inline
                        label={opt}
                        className="pe-none"
                        type="checkbox"
                        id={`tp-discharge-${idx}`}
                        checked={(f.dischargePlanning ?? []).includes(opt)}
                        onChange={() => f.setDischargePlanning(opt)}
                      />
                    ))}
                    {(f.dischargePlanning ?? []).includes("Other") && (
                      <BorderlessInput
                        value={f.dischargePlanningOther}
                        setState={f.setDischargePlanningOther}
                        placeholder=""
                        disabled
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`mt-3 form-print-group ${f.isAdditionalDischargePlanningChecked === null && "hide-data-on-view-print"}`}
                >
                  <div className="view-details-grid-inline">
                    <p className="view-label mb-1">
                      Additional discharge planning details :
                    </p>
                    <div>
                      <Form.Check
                        disabled
                        inline
                        label="Yes"
                        type="checkbox"
                        id="fallriskyes"
                        checked={
                          f.isAdditionalDischargePlanningChecked === true
                        }
                      />
                      <Form.Check
                        disabled
                        inline
                        label="No"
                        type="checkbox"
                        id="fallriskNo"
                        checked={
                          f.isAdditionalDischargePlanningChecked === false
                        }
                      />
                    </div>
                  </div>
                </div>
                {f.isAdditionalDischargePlanningChecked && (
                  <div
                    className={`mt-3 ${!f.additionalComment && "hide-data-on-view-print"}`}
                  >
                    <div className="view-details-grid-inline">
                      <p className="view-label mb-1">
                        Specify ( If Others ) :{" "}
                      </p>
                      <h5 className="view-value mb-0">{f.additionalComment}</h5>
                    </div>
                  </div>
                )}
                <div
                  className={`mt-3 form-print-group ${!f.readinessDischarge && "hide-data-on-view-print"}`}
                >
                  <div className="view-details-grid-inline">
                    <p className="view-label mb-1">Readiness for discharge :</p>
                    <h5 className="view-value mb-0">{f.readinessDischarge}</h5>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}

      <div
        className={`${f.recommendationsForFurtherPrograms?.length < 1 && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">
                Transition planning and recommendations for further programs
                upon discharge :{" "}
              </p>
              <div className="radio-inline">
                {[
                  "PHP",
                  "IOP",
                  "Sober living",
                  "Home",
                  "Flex Care 23.9",
                  "Flex Care 16",
                  "Flex Care 8",
                  "ABHTH",
                  "Transition to ALTC",
                  "Other",
                ].map((opt, idx) => (
                  <Form.Check
                    disabled
                    key={idx}
                    inline
                    label={opt}
                    className="pe-none"
                    type="checkbox"
                    id={`transition-planning-${idx}`}
                    checked={f.recommendationsForFurtherPrograms?.includes(opt)}
                    onChange={() =>
                      f.handleCheckboxChangerecommendationsForFurtherPrograms(
                        opt,
                      )
                    }
                  />
                ))}
                {f.recommendationsForFurtherProgramsBoolean && (
                  <span className="view-value">
                    {f.recommendationsForFurtherProgramsOther}
                  </span>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`${f.afterCareAndTransitionPlanning?.length < 1 && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label fw-bold mb-1">
                After care and Transition planning / Community Resources :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  inline
                  label="National suicide hotline 988 or 1-800-273-8255"
                  className="pe-none"
                  type="checkbox"
                  id="suicideHotlineCheckbox"
                  checked={f.afterCareAndTransitionPlanning.includes(
                    "National suicide hotline 988 or 1-800-273-8255",
                  )}
                  onChange={() =>
                    f.handleCheckboxChangeafterCareAndTransitionPlanning(
                      "National suicide hotline 988 or 1-800-273-8255",
                    )
                  }
                />
                <Form.Check
                  disabled
                  inline
                  label="Emergency care 911"
                  className="pe-none"
                  type="checkbox"
                  id="emergencyCareCheckbox"
                  checked={f.afterCareAndTransitionPlanning.includes(
                    "Emergency care 911",
                  )}
                  onChange={() =>
                    f.handleCheckboxChangeafterCareAndTransitionPlanning(
                      "Emergency care 911",
                    )
                  }
                />
                <Form.Check
                  disabled
                  inline
                  label="24-Hour crisis in Maricopa County 602-222-9444"
                  className="pe-none"
                  type="checkbox"
                  id="crisisLineCheckbox"
                  checked={f.afterCareAndTransitionPlanning.includes(
                    "24-Hour crisis in Maricopa County 602-222-9444",
                  )}
                  onChange={() =>
                    f.handleCheckboxChangeafterCareAndTransitionPlanning(
                      "24-Hour crisis in Maricopa County 602-222-9444",
                    )
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Card
        className={`${f.clinicalSummary?.length < 1 && !f.treatmentPlanReviewDate && !f.dischargePlanDate && "hide-data-on-view-print"}`}
      >
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className=" view-details-grid-inline md-2 p-3">
              <Form.Label>
                This behavioral health treatment plan has been developed before
                the resident receives physical health services or behavioral
                health services or within 48hours after the initial assessment
                is completed. It will be review and updated on an on-going basis
                according to the review date specified in the behavioral health
                treatment plan, when a treatment goal is accomplished or
                changed, when additional information that affects the resident’s
                behavioral health assessment is identified and when the resident
                has a significant change in condition or experiences an event
                that affects treatment.
              </Form.Label>
            </div>
            {f.clinicalSummary?.length > 0 && (
              <div
                className={` ${f.clinicalSummary?.length < 1 && "hidePrint" && "hide-data-on-view-print"}`}
              >
                <div className=" view-details-grid-inline  my-md-2 px-3">
                  <p className="view-label mb-1 fw-bold">
                    Clinical Summary /Recommendations/Intervention :{" "}
                  </p>
                  <div className="view-value">
                    <ul className="ps-3 mb-0">
                      {f.clinicalSummary?.map((i, index) => (
                        <li className="list-disc" key={index}>
                          {i.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div
              className={`mt-3 form-print-group ${!f.clientCareCoordinationTeam && "hide-data-on-view-print"}`}
            >
              <div className="view-details-grid-inline d-flex flex-column  my-md-2 px-3">
                <p className="view-label mb-1 fw-bold">
                  Client Care Coordination Team
                </p>
                <h5 className="view-value mb-0">
                  {f.clientCareCoordinationTeam}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          {f.treatmentPlanReviewDate && (
            <Col
              xs={12}
              md={12}
              lg={6}
              className={`${!f.treatmentPlanReviewDate && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className=" view-details-grid-inline  my-md-2 px-3">
                <p className="view-label  fw-bold">
                  Behavioral Health Treatment plan review date :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(f.treatmentPlanReviewDate)}
                </h5>
              </div>
            </Col>
          )}
          {f.dischargePlanDate && (
            <Col
              xs={12}
              md={12}
              lg={6}
              className={`${!f.dischargePlanDate && "hidePrint" && "hide-data-on-view-print"}`}
            >
              <div className=" view-details-grid-inline  my-md-2 px-3">
                <p className="view-label  fw-bold">Discharge Plan Date : </p>
                <h5 className="view-value mb-0">
                  {formatDateToMMDDYYYY(f.dischargePlanDate)}
                </h5>
              </div>
            </Col>
          )}
        </Row>
      </Card>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1 ">Note : </p>
            <h5 className="view-value mb-0">
              Earlier review may be performed if resident has a significant
              change in condition or event that affects treatment.
            </h5>
          </div>
        </Col>
      </Row>
    </>
  );
}

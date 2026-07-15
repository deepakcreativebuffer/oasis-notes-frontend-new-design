/** @format */

import React from "react";
import { Form, Row, Col, Card, Table } from "react-bootstrap";
import { useViewTreatmentPlanFormContext } from "../../context/ViewTreatmentPlanFormContext";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { BorderlessInput } from "@/utils/Makers";
import { DISCHARGE_PLANNING_OPTIONS } from "@/features/shared/constants";

export default function ViewTreatmentPlanSupportMedicationsSection() {
  const f = useViewTreatmentPlanFormContext();

  const currentDischargePlanning =
    f.getApiData?.patientId?.dischargePlanningAndAfterCarePlanning || [];
  const currentDischargePlanningOther =
    f.getApiData?.patientId?.dischargePlanningAndAfterCarePlanningOther || "";
  const currentIsAdditionalDischargePlanningChecked =
    f.getApiData?.patientId?.isAdditionalDischargePlanningChecked ?? null;
  const currentAdditionalComment =
    f.getApiData?.patientId?.additionalDischargePlanningComment || "";
  const currentReadinessDischarge =
    f.getApiData?.patientId?.readinessDischarge || "";
  const currentRecommendationsForFurtherPrograms =
    f.getApiData?.patientId?.recommendationsForFurtherPrograms || [];
  const currentRecommendationsForFurtherProgramsOther =
    f.getApiData?.patientId?.recommendationsForFurtherProgramsOther || "";
  const currentAfterCareAndTransitionPlanning =
    f.getApiData?.patientId?.afterCareAndTransitionPlanning || [];

  return (
    <>
      {(f.supportSystem?.length > 0 || f.supportSystemOtherText) && (
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
                    onChange={() =>
                      f.handleCheckboxChangeSupportSystem("Family")
                    }
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
                    onChange={() =>
                      f.handleCheckboxChangeSupportSystem("Other")
                    }
                  />
                  {(f.supportSystemOtherText ||
                    f.supportSystem.includes("Other")) && (
                    <span className="view-value">
                      {f.supportSystemOtherText}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            {f.supportSystemPhoneNumber && (
              <Col
                xs={12}
                sm={12}
                md={6}
                lg={6}
                className={`${!f.supportSystemPhoneNumber && "hidePrint" && "hide-data-on-view-print"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Phone Number : </p>
                  <h5 className="view-value mb-0">
                    {f.supportSystemPhoneNumber}
                  </h5>
                </div>
              </Col>
            )}
            {f.currentMedications && (
              <Col
                xs={12}
                sm={12}
                md={6}
                lg={6}
                className={`${!f.currentMedications && "hidePrint" && "hide-data-on-view-print"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Current List of medication :{" "}
                  </p>
                  <h5 className="view-value mb-0">{f.currentMedications}</h5>
                </div>
              </Col>
            )}
          </Row>
        </div>
      )}
      {(f.religiousPreferenceText || f.religiousPreference !== "undefined") && (
        <div
          className={`${!f.religiousPreference && "hide-data-on-view-print"}`}
        >
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
      )}
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
              <div className="view-value">
                <ul className="ps-3 mt-2 mb-0 tw-column">
                  {f.nutritionOptions?.map((i, index) => (
                    <li className="mb-2 list-disc" key={index}>
                      {i.label}
                    </li>
                  ))}
                </ul>
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
                <p className="view-label fw-bold mb-1">
                  Resident requires Assistance to maintain personal funds and/or
                  handle personal finances :
                </p>
                <h5 className="view-value mb-0 mx-2">
                  {f.isRequiresAssistance === true ? "Yes" : "No"}
                </h5>
              </div>
              <div className={`view-details-grid-inline my-md-2 px-3 py-2`}>
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
      {(f.personalFinances ||
        f.recommendationToExtendResidentialTreatment !== "undefined") && (
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
                  {/* <Form.Check
                            inline
                            label="Resident requires Assistance to maintain personal funds
                         and/or handle personal finances"
                            className="pe-none"
                            type="checkbox"
                            id="f.personalFinances"
                            checked={f.personalFinances}
                            onChange={() =>
                              f.setPersonalFinances(!f.personalFinances)
                            }
                          /> */}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}

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
                    <SafeHtml
                      as="td"
                      html={service?.serviceProvided
                        ?.split("\n")
                        ?.map(
                          (value) =>
                            value &&
                            `<ul style="margin-top:0px;margin-bottom:10px;padding-left: 1rem;">
                    <li style="list-style: disc;">${value}</li>
                  </ul>`,
                        )
                        ?.join("")}
                    />
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
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="bhServicesNo"
                        checked={f.bhServicesLimitsFunctioning === false}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="view-details-grid-inline">
                  <p className="view-label fw-bold mb-1">
                    Discharge planning and After care planning :{" "}
                  </p>
                  <div
                    className={`radio-inline ${currentDischargePlanning?.length < 1 && "hide-data-on-view-print"}`}
                  >
                    {DISCHARGE_PLANNING_OPTIONS.map((opt, idx) => (
                      <Form.Check
                        key={idx}
                        inline
                        className="pe-none"
                        label={opt}
                        type="checkbox"
                        id={`view-tp-discharge-${idx}`}
                        checked={currentDischargePlanning.includes(opt)}
                        onChange={() => {}}
                      />
                    ))}
                    {currentDischargePlanning.includes("Other") && (
                      <BorderlessInput
                        value={currentDischargePlanningOther}
                        setState={() => {}}
                        placeholder=""
                        className="pe-none"
                        disabled
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`mt-3 form-print-group ${currentIsAdditionalDischargePlanningChecked === null && "hide-data-on-view-print"}`}
                >
                  <div className="view-details-grid-inline">
                    <p className="view-label mb-1">
                      Additional discharge planning details :
                    </p>
                    <div>
                      <Form.Check
                        inline
                        label="Yes"
                        type="checkbox"
                        id="Additionalyes"
                        checked={
                          currentIsAdditionalDischargePlanningChecked === true
                        }
                      />
                      <Form.Check
                        inline
                        label="No"
                        type="checkbox"
                        id="AdditionalNo"
                        checked={
                          currentIsAdditionalDischargePlanningChecked === false
                        }
                      />
                    </div>
                  </div>
                </div>
                {currentIsAdditionalDischargePlanningChecked && (
                  <div
                    className={`mt-3 form-print-group ${!currentAdditionalComment && "hide-data-on-view-print"}`}
                  >
                    <div className="view-details-grid-inline">
                      <p className="view-label mb-1">
                        Specify ( If Others ) :{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {currentAdditionalComment}
                      </h5>
                    </div>
                  </div>
                )}
                <div
                  className={`mt-3 form-print-group ${!currentReadinessDischarge && "hide-data-on-view-print"}`}
                >
                  <div className="view-details-grid-inline">
                    <p className="view-label mb-1">Readiness for discharge :</p>
                    <h5 className="view-value mb-0">
                      {currentReadinessDischarge}
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {(currentRecommendationsForFurtherPrograms?.length > 0 ||
        currentRecommendationsForFurtherProgramsOther) && (
        <div
          className={`${currentRecommendationsForFurtherPrograms?.length < 1 && "hide-data-on-view-print"}`}
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
                      key={idx}
                      inline
                      label={opt}
                      className="pe-none"
                      type="checkbox"
                      id={`view-transition-planning-${idx}`}
                      checked={currentRecommendationsForFurtherPrograms?.includes(
                        opt,
                      )}
                      onChange={() => {}}
                    />
                  ))}
                  {currentRecommendationsForFurtherPrograms?.includes(
                    "Other",
                  ) && (
                    <span className="view-value">
                      {currentRecommendationsForFurtherProgramsOther}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {currentAfterCareAndTransitionPlanning?.length > 0 && (
        <div
          className={`${currentAfterCareAndTransitionPlanning?.length < 1 && "hide-data-on-view-print"}`}
        >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label fw-bold mb-1">
                  After care and Transition planning / Community Resources
                  :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="National suicide hotline 988 or 1-800-273-8255"
                    className="pe-none"
                    type="checkbox"
                    id="suicideHotlineCheckbox"
                    checked={currentAfterCareAndTransitionPlanning.includes(
                      "National suicide hotline 988 or 1-800-273-8255",
                    )}
                    onChange={() => {}}
                  />
                  <Form.Check
                    inline
                    label="Emergency care 911"
                    className="pe-none"
                    type="checkbox"
                    id="emergencyCareCheckbox"
                    checked={currentAfterCareAndTransitionPlanning.includes(
                      "Emergency care 911",
                    )}
                    onChange={() => {}}
                  />
                  <Form.Check
                    inline
                    label="24-Hour crisis in Maricopa County 602-222-9444"
                    className="pe-none"
                    type="checkbox"
                    id="crisisLineCheckbox"
                    checked={currentAfterCareAndTransitionPlanning.includes(
                      "24-Hour crisis in Maricopa County 602-222-9444",
                    )}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
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
                className={`${f.clinicalSummary?.length < 1 && "hidePrint" && "hide-data-on-view-print"}`}
              >
                <div className=" view-details-grid-inline  my-md-2 px-3">
                  <p className="view-label mb-1 fw-bold">
                    Clinical Summary /Recommendations/Intervention :{" "}
                  </p>
                  <div className="view-value ">
                    <ul className="ps-3  mb-0">
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
                  Client Care Coordination Team :
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
              <div className="view-details-grid-inline  my-md-2 px-3">
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
            <p className="view-label mb-1">Note : </p>
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

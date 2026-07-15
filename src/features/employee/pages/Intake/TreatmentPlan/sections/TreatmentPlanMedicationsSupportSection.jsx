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
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import { DISCHARGE_PLANNING_OPTIONS } from "@/features/shared/constants";
import { AiFillDelete } from "react-icons/ai";
import { formatDateToMMDDYYYY, checkMultiValues } from "@/utils/utils";
import { SelectMultiPrint } from "../components/TreatmentPlanPrintFields";

export default function TreatmentPlanMedicationsSupportSection() {
  const f = useTreatmentPlanFormContext();
  return (
    <>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Support System</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Family"
                  type="checkbox"
                  id="Family"
                  checked={(f.supportSystem ?? []).includes("Family")}
                  onChange={() => f.handleCheckboxChangeSupportSystem("Family")}
                />
                <Form.Check
                  inline
                  label="Friends"
                  type="checkbox"
                  id="Friends"
                  checked={(f.supportSystem ?? []).includes("Friends")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Friends")
                  }
                />
                <Form.Check
                  inline
                  label="BHRF Staff"
                  type="checkbox"
                  id="BHRF staff"
                  checked={(f.supportSystem ?? []).includes("BHRF staff")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("BHRF staff")
                  }
                />
                <Form.Check
                  inline
                  label="Clinical Team"
                  type="checkbox"
                  id="clinicalteam"
                  checked={(f.supportSystem ?? []).includes("Clinical Team")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Clinical Team")
                  }
                />
                <Form.Check
                  inline
                  label="Guardian"
                  type="checkbox"
                  id="Guardian"
                  checked={(f.supportSystem ?? []).includes("Guardian")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Guardian")
                  }
                />
                <Form.Check
                  inline
                  label="Sponsor Name"
                  type="checkbox"
                  id="Sponsor name"
                  checked={(f.supportSystem ?? []).includes("Sponsor name")}
                  onChange={() =>
                    f.handleCheckboxChangeSupportSystem("Sponsor name")
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  checked={(f.supportSystem ?? []).includes("Other")}
                  onChange={() => f.handleCheckboxChangeSupportSystem("Other")}
                  id="supportSystemOther"
                />
                {f.supportSystemOtherTextBoolean && (
                  <BorderlessInput
                    value={f.supportSystemOtherText}
                    setState={f.setSupportSystemOtherText}
                    placeholder=" "
                  />
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Phone Number</Form.Label>
              <Form.Control
                placeholder="Type number"
                type="number"
                className={`${!f.supportSystemPhoneNumber && "hidePrint"}`}
                value={f.supportSystemPhoneNumber}
                onChange={(e) => f.setSupportSystemPhoneNumber(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Current List of medication
              </Form.Label>
              <Form.Control
                type="text"
                className={`${!f.currentMedications && "hidePrint"}`}
                value={f.currentMedications}
                placeholder="Enter medication"
                onChange={(e) => f.setCurrentMedications(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Religious/Cultural Preference
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Christian"
                  type="checkbox"
                  id="Christian"
                  checked={f.religiousPreference?.includes("Christian")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Christian",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Catholic"
                  type="checkbox"
                  id="Catholic"
                  checked={f.religiousPreference?.includes("Catholic")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Catholic",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Buddhist"
                  type="checkbox"
                  id="Buddhist"
                  checked={f.religiousPreference?.includes("Buddhist")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Buddhist",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Islam"
                  type="checkbox"
                  id="Islam"
                  checked={f.religiousPreference?.includes("Islam")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Islam",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Judaism"
                  type="checkbox"
                  id="Judaism"
                  checked={f.religiousPreference?.includes("Judaism")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Judaism",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Hinduism"
                  type="checkbox"
                  id="Hinduism"
                  checked={f.religiousPreference?.includes("Hinduism")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Hinduism",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Mormonism"
                  type="checkbox"
                  id="Mormonism"
                  checked={f.religiousPreference?.includes("Mormonism")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Mormonism",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Other"
                  type="checkbox"
                  id="Other"
                  checked={f.religiousPreference?.includes("Other")}
                  onChange={() =>
                    checkMultiValues(
                      f.setreligiousPreference,
                      f.religiousPreference,
                      "Other",
                    )
                  }
                />
                {(f.religiousPreference?.includes("Other") ||
                  f.religiousPreference === "Other") && (
                  <BorderlessInput
                    value={f.religiousPreferenceText}
                    setState={f.setReligiousPreferenceText}
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
              <Form.Label className="fw-bold">
                Nutrition and wellness Planning{" "}
              </Form.Label>
              <SelectMultiPrint
                id="f.nutritionAndWellnessPlanning"
                value={f.nutritionAndWellnessPlanning}
                options={[
                  {
                    value: "eating a balanced diet",
                    label: "Eating a balanced diet",
                  },
                  {
                    value: "drinking adequate fluid",
                    label: "Drinking adequate fluid",
                  },
                  {
                    value: "ongoing health maintenance",
                    label: "Ongoing health maintenance",
                  },
                ]}
                onChange={f.setNutritionAndWellnessPlanning}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="d-flex flex-column">
              <Form.Label className="fw-bold">
                Resident requires Assistance to maintain personal funds and/or
                handle personal finances
              </Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="AssistanceYes"
                  checked={f.isRequiresAssistance === true}
                  onChange={() =>
                    f.setIsRequiresAssistance((prev) =>
                      prev === true ? null : true,
                    )
                  }
                />{" "}
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="AssistanceNo"
                  checked={f.isRequiresAssistance === false}
                  onChange={() =>
                    f.setIsRequiresAssistance((prev) =>
                      prev === false ? null : false,
                    )
                  }
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Comment </Form.Label>
              <Form.Control
                type="text"
                value={f.personalFinancesComment}
                placeholder="Enter text"
                onChange={(e) => f.setPersonalFinancesComment(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="d-flex flex-column">
              <Form.Label className="fw-bold">Fall Risk</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="fallriskyes"
                  checked={f.isFallRisk === true}
                  onChange={() =>
                    f.setIsFallRisk((prev) => (prev === true ? null : true))
                  }
                  disabled
                />{" "}
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="fallriskNo"
                  checked={f.isFallRisk === false}
                  onChange={() =>
                    f.setIsFallRisk((prev) => (prev === false ? null : false))
                  }
                  disabled
                />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Comment </Form.Label>
              <Form.Control
                type="text"
                value={f.fallRiskComment}
                placeholder="Enter text"
                onChange={(e) => f.setFallRiskComment(e.target.value)}
                disabled
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">
                Recommendation to extend residential treatment for
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="30 Days"
                  type="checkbox"
                  id="30 Days"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "30 Days",
                  )}
                  onChange={() =>
                    checkMultiValues(
                      f.setRecommendationToExtendResidentialTreatment,
                      f.recommendationToExtendResidentialTreatment,
                      "30 Days",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="60 Days"
                  type="checkbox"
                  id="60 Days"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "60 Days",
                  )}
                  onChange={() =>
                    checkMultiValues(
                      f.setRecommendationToExtendResidentialTreatment,
                      f.recommendationToExtendResidentialTreatment,
                      "60 Days",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="90 Day"
                  type="checkbox"
                  id="90 Day"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "90 Days",
                  )}
                  onChange={() =>
                    checkMultiValues(
                      f.setRecommendationToExtendResidentialTreatment,
                      f.recommendationToExtendResidentialTreatment,
                      "90 Days",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Initial"
                  type="checkbox"
                  id="Initialhhg"
                  checked={f.recommendationToExtendResidentialTreatment?.includes(
                    "Initial",
                  )}
                  onChange={() =>
                    checkMultiValues(
                      f.setRecommendationToExtendResidentialTreatment,
                      f.recommendationToExtendResidentialTreatment,
                      "Initial",
                    )
                  }
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>

      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Table responsive="xl" bordered className="service-table-data">
            <thead className="overflow-clip">
              <tr>
                <th>Services Provided</th>
                <th>Daily</th>
                <th>Weekly</th>
                <th>Monthly</th>
                <th>As Needed</th>
                <th>Additional Notes</th>
              </tr>
            </thead>
            <tbody>
              {/* Fixed Services */}
              {f.services?.map((service, index) => (
                <tr key={`fixed-${index}`} c>
                  <td>
                    <span className="text-gray-900 font-medium">
                      {service.serviceProvided}
                    </span>
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.daily}
                      onChange={(value) =>
                        f.updateFixedService(index, "daily", value)
                      }
                      options={f.FREQUENCY_DAILY}
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.weekly}
                      onChange={(value) =>
                        f.updateFixedService(index, "weekly", value)
                      }
                      options={f.FREQUENCY_WEEKLY}
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.monthly}
                      onChange={(value) =>
                        f.updateFixedService(index, "monthly", value)
                      }
                      options={f.FREQUENCY_MONTHLY}
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.asNeeded}
                      onChange={(value) =>
                        f.updateFixedService(index, "asNeeded", value)
                      }
                      options={f.FREQUENCY_AS_NEEDED}
                    />
                  </td>
                  <td>
                    <Form.Control
                      as="textarea"
                      rows={Math.max(
                        service.additionalNotes
                          ? service.additionalNotes.split("\n")?.length
                          : 1,
                        1,
                      )}
                      value={service.additionalNotes || ""}
                      placeholder=""
                      onChange={(e) =>
                        f.updateFixedService(
                          index,
                          "additionalNotes",
                          e.target.value,
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          f.updateFixedService(
                            (prevComment) => prevComment + "\n",
                          );
                        }
                      }}
                    ></Form.Control>
                  </td>
                </tr>
              ))}

              {/* Dynamic Services */}
              {f.dynamicServices?.map((service, index) => (
                <tr key={`dynamic-${index}`}>
                  <td>
                    <Form.Label>Other :</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={service.serviceProvided}
                      onChange={(e) =>
                        f.updateDynamicService(
                          index,
                          "serviceProvided",
                          e.target.value,
                        )
                      }
                      placeholder="Enter service"
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.daily}
                      onChange={(value) =>
                        f.updateDynamicService(index, "daily", value)
                      }
                      options={f.FREQUENCY_DAILY}
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.weekly}
                      onChange={(value) =>
                        f.updateDynamicService(index, "weekly", value)
                      }
                      options={f.FREQUENCY_WEEKLY}
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.monthly}
                      onChange={(value) =>
                        f.updateDynamicService(index, "monthly", value)
                      }
                      options={f.FREQUENCY_MONTHLY}
                    />
                  </td>
                  <td>
                    <SelectMultiPrint
                      value={service.asNeeded}
                      onChange={(value) =>
                        f.updateDynamicService(index, "asNeeded", value)
                      }
                      options={f.FREQUENCY_AS_NEEDED}
                    />
                  </td>
                  <td>
                    <div className="d-xl-flex align-items-start gap-2">
                      <Form.Control
                        as="textarea"
                        rows={Math.max(
                          service.additionalNotes
                            ? service.additionalNotes.split("\n")?.length
                            : 1,
                          1,
                        )}
                        value={service.additionalNotes || ""}
                        placeholder=""
                        onChange={(e) =>
                          f.updateDynamicService(
                            index,
                            "additionalNotes",
                            e.target.value,
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            f.updateDynamicService(
                              (prevComment) => prevComment + "\n",
                            );
                          }
                        }}
                      ></Form.Control>
                      {f.canDelete && (
                        <div className="justify-content-center mt-1 mt-xl-0 icon-joiner hidePrint">
                          <span className="del-btn">
                            <AiFillDelete
                              onClick={() => f.removeDynamicService(index)}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="my-3">
        <Col xs={12} sm={12} className="text-center">
          <Button
            type="button"
            className="theme-button hidePrint"
            onClick={f.addNewService}
          >
            ADD
          </Button>
        </Col>
      </Row>

      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="d-flex flex-column mb-3">
              <Form.Label className="fw-bold">
                BH Services for members whose BH issues limits their ability to
                function independently
              </Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Yes"
                  type="checkbox"
                  id="BhServicesYes"
                  checked={f.bhServicesLimitsFunctioning === true}
                  onChange={() =>
                    f.setBhServicesLimitsFunctioning((prev) =>
                      prev === true ? null : true,
                    )
                  }
                />{" "}
                <Form.Check
                  inline
                  label="No"
                  type="checkbox"
                  id="BhServicesNo"
                  checked={f.bhServicesLimitsFunctioning === false}
                  onChange={() =>
                    f.setBhServicesLimitsFunctioning((prev) =>
                      prev === false ? null : false,
                    )
                  }
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Discharge planning and After care planning
              </Form.Label>
              <div className="radio-inline">
                {DISCHARGE_PLANNING_OPTIONS.map((opt, idx) => (
                  <Form.Check
                    key={idx}
                    inline
                    label={opt}
                    type="checkbox"
                    id={`tp-discharge-${idx}`}
                    checked={(f.dischargePlanning ?? []).includes(opt)}
                    onChange={() => f.handleCheckboxChanges(opt)}
                    disabled
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
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label className="fw-bold">
                Additional discharge planning details
              </Form.Label>
              {/* <Form.Control disabled
                      as="textarea"
                      className={`${
                        !f.additionalDischargePlanning && "hidePrint"
                      }`}
                      value={f.additionalDischargePlanning}
                      cols={130}
                      placeholder="Type Here....."
                      onChange={(e) =>
                        f.setAdditionalDischargePlanning(e.target.value)
                      }
                     ></Form.Control> */}
              <div>
                <Form.Check
                  disabled
                  inline
                  label="Yes"
                  type="checkbox"
                  id="isAddtionalYes"
                  checked={f.isAdditionalDischargePlanningChecked === true}
                  onChange={() =>
                    f.setIsAdditionalDischargePlanningChecked((prev) =>
                      prev === true ? null : true,
                    )
                  }
                />{" "}
                <Form.Check
                  disabled
                  inline
                  label="No"
                  type="checkbox"
                  id="isAddtionalNo"
                  checked={f.isAdditionalDischargePlanningChecked === false}
                  onChange={() =>
                    f.setIsAdditionalDischargePlanningChecked((prev) =>
                      prev === false ? null : false,
                    )
                  }
                />
              </div>
            </Form.Group>
            {f.isAdditionalDischargePlanningChecked && (
              <Form.Group className="mt-3">
                <Form.Label className="fw-bold">
                  Specify ( If Others )
                </Form.Label>
                <Form.Control
                  disabled
                  as="textarea"
                  className={`${!f.additionalComment && "hidePrint"}`}
                  value={f.additionalComment}
                  cols={130}
                  placeholder="Type Here....."
                  onChange={(e) => f.setAdditionalComment(e.target.value)}
                ></Form.Control>
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label className="fw-bold">
                Readiness for discharge{" "}
              </Form.Label>
              <Form.Control
                disabled
                as="textarea"
                className={`${!f.readinessDischarge && "hidePrint"}`}
                value={f.readinessDischarge}
                cols={130}
                placeholder="Type Here....."
                onChange={(e) => f.setReadinessDischarge(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group>
              <Form.Label className="fw-bold">
                Transition planning and recommendations for further programs
                upon discharge
              </Form.Label>
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
                    type="checkbox"
                    id={`emp-transition-${idx}`}
                    checked={f.recommendationsForFurtherPrograms?.includes(opt)}
                    onChange={() =>
                      f.handleCheckboxChangerecommendationsForFurtherPrograms(
                        opt,
                      )
                    }
                  />
                ))}
                {f.recommendationsForFurtherProgramsBoolean && (
                  <BorderlessInput
                    disabled
                    value={f.recommendationsForFurtherProgramsOther}
                    setState={f.setRecommendationsForFurtherProgramsOther}
                    placeholder=""
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
              <Form.Label className="fw-bold">
                After care and Transition planning / Community Resources
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  disabled
                  inline
                  label="National suicide hotline 988 or 1-800-273-8255"
                  type="checkbox"
                  id="suicideHotlineCheckbox"
                  checked={(f.afterCareAndTransitionPlanning ?? []).includes(
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
                  type="checkbox"
                  id="emergencyCareCheckbox"
                  checked={(f.afterCareAndTransitionPlanning ?? []).includes(
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
                  type="checkbox"
                  id="crisisLineCheckbox"
                  checked={(f.afterCareAndTransitionPlanning ?? []).includes(
                    "24-Hour crisis in Maricopa County 602-222-9444",
                  )}
                  onChange={() =>
                    f.handleCheckboxChangeafterCareAndTransitionPlanning(
                      "24-Hour crisis in Maricopa County 602-222-9444",
                    )
                  }
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label>
                This treatment plan has been developed before the resident
                receives physical health services or behavioral health services
                or within 48hours after the initial assessment is completed. It
                will be review and updated on an on-going basis according to the
                review date specified in the behavioral health treatment plan,
                when a treatment goal is accomplished or changed, when
                additional information that affects the resident’s behavioral
                health assessment is identified and when the resident has a
                significant change in condition or experiences an event that
                affects treatment.
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Clinical Summary /Recommendations/Intervention
              </Form.Label>
              <SelectMultiPrint
                isMulti
                value={f.clinicalSummary}
                options={f.clinicalSummaryOption}
                onChange={f.clinicalSummaryHandler}
                isCreatable={true}
                onKeyDown={f.handleKeyClinicalSummary}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Client Care Coordination Team :
              </Form.Label>
              <Form.Control
                as="textarea"
                className={`${!f.clientCareCoordinationTeam && "hidePrint"}`}
                value={f.clientCareCoordinationTeam}
                cols={130}
                placeholder="Type Here....."
                onChange={(e) =>
                  f.setClientCareCoordinationTeam(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={6}>
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">
                Behavioral Health Treatment plan review date
              </Form.Label>

              <DatePicker
                selected={formatDateToMMDDYYYY(f.treatmentPlanReviewDate)}
                className={`form-control ${!f.treatmentPlanReviewDate && "hidePrint"}`}
                onChange={(selectedDate) =>
                  f.setTreatmentPlanReviewDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      f.treatmentPlanReviewDate
                        ? formatDateToMMDDYYYY(f.treatmentPlanReviewDate)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <Form.Group className="mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">Discharge Plan Date</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(f.dischargePlanDate)}
                className={`form-control ${!f.dischargePlanDate && "hidePrint"}`}
                onChange={(selectedDate) =>
                  f.setDischargePlanDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      f.dischargePlanDate
                        ? formatDateToMMDDYYYY(f.dischargePlanDate)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <Form.Label className="fw-bold">
              Note: Earlier review may be performed if resident has a
              significant change in condition or event that affects treatment.
            </Form.Label>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Form.Label className="fw-bold">
            Individual Participating in Developing the Service Plan
          </Form.Label>
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={6} md={12} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Resident</Form.Label>
              <Form.Control
                className={`${!f.resident && "hidePrint"}`}
                type="text"
                value={f.resident}
                placeholder="Type here"
                onChange={(e) => f.setResident(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={12} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Guardian</Form.Label>
              <Form.Control
                type="text"
                className={`${!f.guardian && "hidePrint"}`}
                value={f.guardian}
                placeholder="Type here"
                onChange={(e) => f.setGuardian(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={12} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Staff</Form.Label>
              <Form.Control
                type="text"
                className={`${!f.staff && "hidePrint"}`}
                value={f.staff}
                placeholder="Type here"
                onChange={(e) => f.setStaff(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={12} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">BHP</Form.Label>
              <Form.Control
                type="text"
                className={`${!f.bpn && "hidePrint"}`}
                value={f.bpn}
                placeholder="Type here"
                onChange={(e) => f.setBph(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={12} lg={3}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Other</Form.Label>
              <Form.Control
                type="text"
                className={`${!f.otherIndividual && "hidePrint"}`}
                value={f.otherIndividual}
                placeholder="Type here"
                onChange={(e) => f.setOtherIndividual(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                as="textarea"
                className={`${!f.commentIndividual && "hidePrint"}`}
                value={f.commentIndividual}
                placeholder="Enter comment"
                onChange={(e) => f.setCommentIndividual(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
    </>
  );
}

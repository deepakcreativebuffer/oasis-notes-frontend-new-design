/* eslint-disable no-unused-vars */
/** @format */

import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import Select from "@/features/shared/ui/Search/Search";
import { formatDateToMMDDYYYY } from "@/utils/utils";

/**
 * SECTION I — patient / resident demographic and admission information.
 */
export default function PatientInformationSection(props) {
  const {
    VisualDisturbancesOtherBoolean,
    VisualDisturbancesOtherType,
    admissionStatus,
    ahcccsId,
    approvedBy,
    bhrfCriteria,
    bhrfCriteriaHandler,
    currentBehavioralIssues,
    dateOfAssessment,
    diagnosis,
    dob,
    ethnicity,
    getApiData,
    Barriers,
    barriersBoolean,
    barriersOther,
    barriersText,
    guardianship,
    guardianshipPoaPubFidName,
    handleCheckboxAdmisionStatus,
    handleKeyDownReasionForAdmission,
    handleKeyDownResidentStrength,
    handleSelectChange,
    handleSelectChangeAdmission,
    handleSelectChangeAdmissionReasonForAdmission,
    id,
    option_value_Admission,
    option_value_ReasonForAdmission,
    powerOfAttorneyStatus,
    preferredLanguage,
    programLocation,
    qualitiesOptions,
    reasonForAdmission,
    residentGoals,
    residentLimitations,
    residentName,
    residentStrengths,
    setAhcccsId,
    setApprovedBy,
    setCurrentBehavioralIssues,
    setDateOfAssessment,
    setDiagnosis,
    setDob,
    setEthnicity,
    setGuardianship,
    setGuardianshipPoaPubFidName,
    setPatientDetail,
    setPatient_Id,
    setPowerOfAttorneyStatus,
    setPreferredLanguage,
    setProgramLocation,
    setResidentGoals,
    setResidentLimitations,
    setResidentName,
    setSex,
    setTodayDate,
    setVisualDisturbancesOtherBoolean,
    setVisualDisturbancesOtherType,
    sex,
    todayDate,
  } = props;

  return (
    <>
      <Row>
        <Col xs={12}>
          <Form.Label className="fw-bold w-100 h5 text-center">
            SECTION I
          </Form.Label>
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12}>
          {id ? (
            <>
              <Card body className="mb-3 print-shadow-none">
                <Form.Group className={"resident-name-print w-100"}>
                  <Form.Label
                    className="fw-bold increse-size flex-shrink-0"
                    htmlFor="residentFullName"
                  >
                    Resident's Full Name:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="residentFullName"
                    value={residentName || getApiData?.data?.residentName}
                    placeholder="Enter full name"
                    required
                    className="fw-bold increse-size"
                  />
                </Form.Group>
              </Card>
            </>
          ) : (
            <PatientComponent
              MainPatientId={setPatient_Id}
              MainResidentName={setResidentName}
              setWholeData={setPatientDetail}
              className="mb-3"
            />
          )}
        </Col>
      </Row>
      <Card body className="mb-3">
        <Row>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={4}
            className={`${!(ahcccsId || getApiData?.data?.patientId?.ahcccsId) && "hidePrint"}`}
          >
            <Form.Group className="mb-3 form-print-group-align form-print-group">
              <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
              <Form.Control
                type="text"
                id="ahcccsId"
                value={ahcccsId}
                disabled
                onChange={(e) => setAhcccsId(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={4}
            className={`${!(dob || getApiData?.data?.patientId?.dob) && "hidePrint"}`}
          >
            <Form.Group className="mb-3 d-flex flex-column form-print-group-align form-print-group">
              <Form.Label className="fw-bold">Date of Birth</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(dob)}
                disabled
                onChange={(selectedDate) =>
                  setDob(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      dob ? formatDateToMMDDYYYY(dob) : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={4}
            className={`${!(diagnosis || getApiData?.data?.patientId?.diagnosis) && "hidePrint"}`}
          >
            <Form.Group className="mb-3 form-print-group-align form-print-group">
              <Form.Label className="fw-bold">
                Diagnosis (specify if new or continuing)
              </Form.Label>
              <Form.Control
                type="text"
                id="ahcccsId"
                value={diagnosis}
                disabled
                onChange={(e) => setDiagnosis(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        <Col xs={12} sm={12} md={12} lg={4}>
          <Card body className="mb-3">
            <Form.Group className="form-print-group-align form-print-group">
              <Form.Label className="fw-bold">Gender</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Male"
                  type="radio"
                  id="maleRadio"
                  checked={sex === "Male"}
                  onChange={() => setSex("Male")}
                />
                <Form.Check
                  inline
                  label="Female"
                  type="radio"
                  id="femaleRadio"
                  checked={sex === "Female"}
                  onChange={() => setSex("Female")}
                />
                <Form.Check
                  inline
                  label="Transgender"
                  type="radio"
                  id="transgenderRadio"
                  checked={sex === "Transgender"}
                  onChange={() => setSex("Transgender")}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={3}>
          <Card body className={`mb-3 ${!dateOfAssessment && "hidePrint"}`}>
            <Form.Group className="form-print-group-align form-print-group d-flex flex-column">
              <Form.Label className="fw-bold">Admit Date</Form.Label>
              <Form.Control
                className="show-print-inline hidden"
                type="text"
                value={
                  dateOfAssessment && formatDateToMMDDYYYY(dateOfAssessment)
                }
                placeholder="Enter Date"
                required
                onChange={(e) => setDateOfAssessment(e.target.value)}
              ></Form.Control>

              <DatePicker
                selected={formatDateToMMDDYYYY(dateOfAssessment)}
                disabled
                onChange={(selectedDate) =>
                  setDateOfAssessment(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="form-control hidePrint"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      dateOfAssessment
                        ? formatDateToMMDDYYYY(dateOfAssessment)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={3}
          className={`${!preferredLanguage && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="form-print-group-align form-print-group">
              <Form.Label className="fw-bold">Preferred Language</Form.Label>
              <Form.Control
                type="text"
                disabled
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={2}
          className={`${!ethnicity && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="form-print-group-align form-print-group">
              <Form.Label className="fw-bold">Ethnicity</Form.Label>
              <Form.Control
                type="text"
                disabled
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!admissionStatus && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="form-print-group-align form-print-group">
              <Form.Label className="fw-bold">Admission Status</Form.Label>
              {/* <CustomMultiSelectInput
                          multiselect={true}
                          value={admissionStatus}
                          onChange={handleSelectChangeAdmission}
                          options={option_value_Admission}
                          className="hidePrint"
                         /> */}
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Voluntary"
                  type="checkbox"
                  id="Voluntary"
                  disabled
                  checked={admissionStatus.includes("Voluntary")}
                  onChange={() => handleCheckboxAdmisionStatus("Voluntary")}
                />
                <Form.Check
                  inline
                  label="Court Ordered Treatment"
                  type="checkbox"
                  id="courtOrderedTreatment"
                  disabled
                  checked={admissionStatus.includes("Court Ordered Treatment")}
                  onChange={() =>
                    handleCheckboxAdmisionStatus("Court Ordered Treatment")
                  }
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!programLocation && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="form-print-group-align form-print-group">
              <Form.Label className="fw-bold">
                Program Location & Address:{" "}
              </Form.Label>
              <Form.Control
                type="text"
                disabled
                value={programLocation}
                onChange={(e) => setProgramLocation(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!guardianship && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Guardianship Yes/No</Form.Label>
              <Form.Control
                type="text"
                id="attorneystatus"
                value={guardianship}
                placeholder="Enter text"
                disabled
                onChange={(e) => setGuardianship(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!powerOfAttorneyStatus && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Power of Attorney Status
              </Form.Label>
              <Form.Control
                type="text"
                id="attorneystatus"
                value={powerOfAttorneyStatus}
                placeholder="Enter text"
                //required
                onChange={(e) => setPowerOfAttorneyStatus(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!todayDate && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group className="d-flex flex-column">
              <Form.Label className="fw-bold">Today’s Date</Form.Label>

              <DatePicker
                selected={formatDateToMMDDYYYY(todayDate)}
                onChange={(selectedDate) =>
                  setTodayDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className="hidePrint d-inline form-control"
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      todayDate ? formatDateToMMDDYYYY(todayDate) : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!guardianshipPoaPubFidName && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Guardianship/POA/PUB FID Name
              </Form.Label>
              <Form.Control
                type="text"
                id="fidname"
                value={guardianshipPoaPubFidName}
                placeholder="Enter name"
                disabled
                onChange={(e) => setGuardianshipPoaPubFidName(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={4}
          className={`${!approvedBy && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Approved By</Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={approvedBy}
                placeholder="Enter text"
                //required
                onChange={(e) => setApprovedBy(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!reasonForAdmission && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Presenting Problems</Form.Label>
              <span className="show-print-inline ms-2 hidden">
                {reasonForAdmission?.map((status) => status?.label).join(", ")}
              </span>
              <div className="hidePrint">
                <CustomMultiSelectInput
                  className="w-100"
                  value={reasonForAdmission}
                  onChange={handleSelectChangeAdmissionReasonForAdmission}
                  options={option_value_ReasonForAdmission}
                  isCreatable={true}
                  isDisabled
                  onKeyDown={handleKeyDownReasionForAdmission}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>

        <Col xs={12}>
          <Card body className="mb-3 ">
            <Form.Label className="fw-bold">BHRF Criteria</Form.Label>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Thoughts or behaviors of suicide, homicide, or harm to self or others"
                type="checkbox"
                id="thoughtsBehaviorsOfSuicide"
                checked={bhrfCriteria?.includes("thoughtsBehaviorsOfSuicide")}
                onChange={() =>
                  bhrfCriteriaHandler("thoughtsBehaviorsOfSuicide")
                }
              />
              <Form.Check
                inline
                label="Impulsivity with poor judgement/insight"
                type="checkbox"
                id="impulsivityWithPoorJudgement"
                checked={bhrfCriteria?.includes("impulsivityWithPoorJudgement")}
                onChange={() =>
                  bhrfCriteriaHandler("impulsivityWithPoorJudgement")
                }
              />
              <Form.Check
                inline
                label="Maladaptive physical or sexual behaviors"
                type="checkbox"
                id="maladaptivePhysical"
                checked={bhrfCriteria?.includes("maladaptivePhysical")}
                onChange={() => bhrfCriteriaHandler("maladaptivePhysical")}
              />
              <Form.Check
                inline
                label="Inability to remain safe within environment, despite environmental support (i.e. informal support)"
                type="checkbox"
                id="inabilityToRemainSafe"
                checked={bhrfCriteria?.includes("inabilityToRemainSafe")}
                onChange={() => bhrfCriteriaHandler("inabilityToRemainSafe")}
              />
              <Form.Check
                inline
                label="Medication side effects due to toxicity or contraindications"
                type="checkbox"
                id="medicationSideEffects"
                checked={bhrfCriteria?.includes("medicationSideEffects")}
                onChange={() => bhrfCriteriaHandler("medicationSideEffects")}
              />
              <Form.Check
                inline
                label="Inability to complete developmentally appropriate selfcare or self-regulation due to behavioral health condition(s)"
                type="checkbox"
                id="inabilityToCompleteDevelopmentally"
                checked={bhrfCriteria?.includes(
                  "inabilityToCompleteDevelopmentally",
                )}
                onChange={() =>
                  bhrfCriteriaHandler("inabilityToCompleteDevelopmentally")
                }
              />
              <Form.Check
                inline
                label="Neglect or disruption of ability to attend to majority of basic needs, such as personal safety, hygiene, nutrition, or medical care"
                type="checkbox"
                id="neglectDisruptionOfAbility"
                checked={bhrfCriteria?.includes("neglectDisruptionOfAbility")}
                onChange={() =>
                  bhrfCriteriaHandler("neglectDisruptionOfAbility")
                }
              />
              <Form.Check
                inline
                label="Frequent inpatient psychiatric admissions, or legal involvement due to lack of insight or judgement associated with psychotic or affective/mood symptoms or major psychiatric disorders"
                type="checkbox"
                id="frequentInpatientPsychiatricAdmissions"
                checked={bhrfCriteria?.includes(
                  "frequentInpatientPsychiatricAdmissions",
                )}
                onChange={() =>
                  bhrfCriteriaHandler("frequentInpatientPsychiatricAdmissions")
                }
              />
              <Form.Check
                inline
                label="Frequent withdrawal management services, which can include but are not limited to, detox facilities, Medicated Assisted Treatment (MAT), and ambulatory detox"
                type="checkbox"
                id="frequentWithdrawalManagementServices"
                checked={bhrfCriteria?.includes(
                  "frequentWithdrawalManagementServices",
                )}
                onChange={() =>
                  bhrfCriteriaHandler("frequentWithdrawalManagementServices")
                }
              />
              <Form.Check
                inline
                label="Inability to independently self-administer medically necessary psychotropic medication despite interventions such as education, regimen simplification, daily outpatient dispensing, and long acting injectable medications"
                type="checkbox"
                id="inabilityToIndependently"
                checked={bhrfCriteria?.includes("inabilityToIndependently")}
                onChange={() => bhrfCriteriaHandler("inabilityToIndependently")}
              />
              <Form.Check
                inline
                label="Impairments persisting in the absence of situational stressors that delay recovery from the presenting problem"
                type="checkbox"
                id="impairmentsPersisting"
                checked={bhrfCriteria?.includes("impairmentsPersisting")}
                onChange={() => bhrfCriteriaHandler("impairmentsPersisting")}
              />
              <Form.Check
                inline
                label="A behavioral health need for 24 hour supervision to develop adequate and effective coping skills that will allow the member to live safely in the community"
                type="checkbox"
                id="behavioralHealth"
                checked={bhrfCriteria?.includes("behavioralHealth")}
                onChange={() => bhrfCriteriaHandler("behavioralHealth")}
              />
              <Form.Check
                inline
                label="Anticipated stabilization cannot be achieved in a less restrictive setting"
                type="checkbox"
                id="anticipatedStabilization"
                checked={bhrfCriteria?.includes("anticipatedStabilization")}
                onChange={() => bhrfCriteriaHandler("anticipatedStabilization")}
              />
              <Form.Check
                inline
                label="Evidence that behavioral health treatment in a less restrictive level of care (e.g. Intensive Outpatient Program, IOP, Partial Hospitalization Program,  PHP, etc.) has not been successful or is not available, therefore "
                type="checkbox"
                id="evidenceThatBehavioral"
                checked={bhrfCriteria?.includes("evidenceThatBehavioral")}
                onChange={() => bhrfCriteriaHandler("evidenceThatBehavioral")}
              />
              {/* <Form.Check
                          inline
                          label="Other"
                          type="checkbox"
                          id="VisualDisturbancesOtherBoolean"
                          value={VisualDisturbancesOtherBoolean}
                          checked={VisualDisturbancesOtherBoolean}
                          onChange={() =>
                            setVisualDisturbancesOtherBoolean(
                              !VisualDisturbancesOtherBoolean
                            )
                          }
                         />
                         {VisualDisturbancesOtherBoolean && (
                          <BorderlessInput
                            className={`${!VisualDisturbancesOtherType && "hidePrint"
                              }`}
                            value={VisualDisturbancesOtherType}
                            setState={setVisualDisturbancesOtherType}
                            placeholder={" "}
                          />
                         )} */}
            </div>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!residentGoals && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Resident’s Goals</Form.Label>
              <Form.Control
                type="text"
                id="approvedby"
                value={residentGoals}
                placeholder="Enter goal"
                disabled
                onChange={(e) => setResidentGoals(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!residentStrengths && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">Resident’s Strength</Form.Label>
              <span className="show-print-inline ms-2 hidden">
                {residentStrengths?.map((status) => status?.label).join(", ")}
              </span>
              <div className="hidePrint">
                <CustomMultiSelectInput
                  multiselect={true}
                  className="w-100"
                  value={residentStrengths}
                  onChange={handleSelectChange}
                  options={qualitiesOptions}
                  isCreatable={true}
                  isDisabled={true}
                  onKeyDown={handleKeyDownResidentStrength}
                />
              </div>
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!residentLimitations && "hidePrint"}`}
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
                    key={idx}
                    inline
                    label={opt.label}
                    type="checkbox"
                    id={`barrier-${idx}`}
                    disabled
                    checked={Barriers?.includes(opt.value)}
                  />
                ))}
                {barriersBoolean && (
                  <input
                    type="text"
                    className="border-bottom border-0 outline-none ms-2 bg-transparent"
                    style={{ borderBottom: "1px solid #ced4da" }}
                    disabled
                    value={barriersOther || ""}
                  />
                )}
              </div>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label className="fw-bold mb-1">Comment</Form.Label>
              <Form.Control as="textarea" disabled value={barriersText || ""} />
            </Form.Group>
          </Card>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={`${!currentBehavioralIssues && "hidePrint"}`}
        >
          <Card body className="mb-3">
            <Form.Group>
              <Form.Label className="fw-bold">
                Current Behavioral / Medical Issues / Symptoms Reported by the
                Resident:
              </Form.Label>
              <Form.Control
                as="textarea"
                value={currentBehavioralIssues}
                placeholder="Enter text"
                onChange={(e) => setCurrentBehavioralIssues(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export const PATIENT_INFORMATION_SECTION_PROP_KEYS = [
  "VisualDisturbancesOtherBoolean",
  "VisualDisturbancesOtherType",
  "admissionStatus",
  "ahcccsId",
  "approvedBy",
  "Barriers",
  "barriersBoolean",
  "barriersOther",
  "barriersText",
  "bhrfCriteria",
  "bhrfCriteriaHandler",
  "currentBehavioralIssues",
  "dateOfAssessment",
  "diagnosis",
  "dob",
  "ethnicity",
  "getApiData",
  "guardianship",
  "guardianshipPoaPubFidName",
  "handleCheckboxAdmisionStatus",
  "handleKeyDownReasionForAdmission",
  "handleKeyDownResidentStrength",
  "handleSelectChange",
  "handleSelectChangeAdmission",
  "handleSelectChangeAdmissionReasonForAdmission",
  "id",
  "option_value_Admission",
  "option_value_ReasonForAdmission",
  "powerOfAttorneyStatus",
  "preferredLanguage",
  "programLocation",
  "qualitiesOptions",
  "reasonForAdmission",
  "residentGoals",
  "residentLimitations",
  "residentName",
  "residentStrengths",
  "setAhcccsId",
  "setApprovedBy",
  "setCurrentBehavioralIssues",
  "setDateOfAssessment",
  "setDiagnosis",
  "setDob",
  "setEthnicity",
  "setGuardianship",
  "setGuardianshipPoaPubFidName",
  "setPatientDetail",
  "setPatient_Id",
  "setPowerOfAttorneyStatus",
  "setPreferredLanguage",
  "setProgramLocation",
  "setResidentGoals",
  "setResidentLimitations",
  "setResidentName",
  "setSex",
  "setTodayDate",
  "setVisualDisturbancesOtherBoolean",
  "setVisualDisturbancesOtherType",
  "sex",
  "todayDate",
];

/* eslint-disable no-unused-vars */
/** @format */
import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const NursingAssessmentFormContentPart1 = (props) => {
  const {
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionDate,
    age,
    ahcccsId,
    allergies,
    back,
    behavioralSymptoms,
    bhpTime,
    bhtDate,
    bhtName,
    bhtSignature,
    careProvidedPhysicalServices,
    careProvidedPhysicalServicesHandler,
    checkSign,
    codeStatus,
    commentFigure,
    currentMedications,
    dateOfBirth,
    diagnosis,
    editDateHandler,
    editSignHandler,
    editTimeHandler,
    employ,
    front,
    getApiData,
    handleCodeStatusChange,
    handleMultiNutritionDiet,
    handleMultiTbScreeningResults,
    handlePost,
    handlePrint2,
    handlebehavioralSymptoms,
    handlephysicalSymptoms,
    handlerepsychosocialSymptoms,
    handlereviewOfSystemsAllergicImmunologic,
    handlereviewOfSystemsCardiovascular,
    handlereviewOfSystemsConstitutional,
    handlereviewOfSystemsEndocrine,
    handlereviewOfSystemsGastrointestinal,
    handlereviewOfSystemsGenitourinary,
    handlereviewOfSystemsHeadNeckThroat,
    handlereviewOfSystemsHematologyOncology,
    handlereviewOfSystemsIntegumentary,
    handlereviewOfSystemsMusculoskeletal,
    handlereviewOfSystemsNeurologic,
    handlereviewOfSystemsPsychiatric,
    handlereviewOfSystemsRespiratory,
    imagesPair,
    isNotEditableWithSigner,
    isSubmitEnabled,
    lastTBScreeningDate,
    legBack,
    legFront,
    legLeft,
    legRight,
    loading,
    name,
    navigate,
    nutritionDiet,
    nutritionFluidRestrictions,
    nutritionSpecialDietOrder,
    patientDetail,
    patientId,
    physicalSymptoms,
    psychosocialSymptoms,
    residentDeniesSkinConcerns,
    residentName,
    reviewOfBehavioralSymptomsOther,
    reviewOfCurrentMedicationsOther,
    reviewOfNutritionDietOther,
    reviewOfPhysicalSymptomsOther,
    reviewOfSkinCheckOther,
    reviewOfSystemsCardiovascular,
    reviewOfSystemsCardiovascularOther,
    reviewOfSystemsConstitutional,
    reviewOfSystemsConstitutionalOther,
    reviewOfSystemsEndocrine,
    reviewOfSystemsEndocrineOther,
    reviewOfSystemsGastrointestinal,
    reviewOfSystemsGastrointestinalOther,
    reviewOfSystemsGenitourinary,
    reviewOfSystemsGenitourinaryOther,
    reviewOfSystemsHeadNeckThroat,
    reviewOfSystemsHeadNeckThroatOther,
    reviewOfSystemsHematologyOncology,
    reviewOfSystemsHematologyOncologyOther,
    reviewOfSystemsIntegumentary,
    reviewOfSystemsIntegumentaryOther,
    reviewOfSystemsMusculoskeletal,
    reviewOfSystemsMusculoskeletalOther,
    reviewOfSystemsNeurologic,
    reviewOfSystemsNeurologicOther,
    reviewOfSystemsPsychiatric,
    reviewOfSystemsPsychiatricOther,
    reviewOfSystemsRespiratory,
    reviewOfSystemsRespiratoryOther,
    rnDate,
    rnName,
    rnSignature,
    rnTime,
    safetyPlanComment,
    saveAsDrafIsNotEditable,
    setShowSingInOne,
    setShowSingInTwo,
    sex,
    sideLeft,
    sideRight,
    signatureModals,
    signers,
    skinCheck,
    tbScreeningResults,
    todayDate,
    userDetail,
    setAhcccsId,
    setTodayDate,
    setAdmissionDate,
    setDateOfBirth,
    setDiagnosis,
    setAge,
    setSex,
    setLastTBScreeningDate,
    setVitalsBloodPressure,
    setVitalsPulse,
    setVitalsRespiratoryRate,
    setVitalsTemperature,
    setVitalsOxygenLevel,
    setVitalsWeight,
    setVitalsHeightFeet,
    setAllergies,
    setReviewOfSystemsConstitutionalOther,
    setReviewOfSystemsCardiovascularOther,
    setReviewOfSystemsGastrointestinalOther,
    setReviewOfSystemsGenitourinaryOther,
    setReviewOfSystemsHematologyOncologyOther,
    setReviewOfSystemsHeadNeckThroatOther,
    setReviewOfSystemsIntegumentaryOther,
    setReviewOfSystemsMusculoskeletalOther,
    setReviewOfSystemsEndocrineOther,
    userId,
    vitalsBloodPressure,
    vitalsHeightFeet,
    vitalsHeightInches,
    vitalsOxygenLevel,
    vitalsPulse,
    vitalsRespiratoryRate,
    vitalsTemperature,
    vitalsWeight,
  } = props;

  return (
    <>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={6} lg={4} xl={3}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">AHCCCS ID</Form.Label>
              <Form.Control
                type="text"
                id="ahcccsId"
                disabled
                value={ahcccsId}
                className={`${!ahcccsId && "hidePrint"}`}
                onChange={(e) => setAhcccsId(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={4} xl={3}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">Created Date</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(todayDate)}
                onChange={(selectedDate) =>
                  setTodayDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className={`form-control ${!todayDate && "hidePrint"}`}
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      todayDate ? formatDateToMMDDYYYY(todayDate) : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={4} xl={3}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">Admit Date</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(admissionDate)}
                disabled
                onChange={(selectedDate) =>
                  setAdmissionDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className={`form-control ${!admissionDate && "hidePrint"}`}
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      admissionDate
                        ? formatDateToMMDDYYYY(admissionDate)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} lg={4} xl={3}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">Date of Birth</Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(dateOfBirth)}
                disabled
                onChange={(selectedDate) =>
                  setDateOfBirth(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className={`form-control ${!dateOfBirth && "hidePrint"}`}
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      dateOfBirth
                        ? formatDateToMMDDYYYY(dateOfBirth)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={6} xl={6}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">
                Diagnosis (specify if new or continuing)
              </Form.Label>
              <Form.Control
                type="text"
                id="Diagnosis"
                disabled
                className={`${!diagnosis && "hidePrint"}`}
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={4} xl={3}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">Enter Age</Form.Label>
              <Form.Control
                type="number"
                id="dateOfBirth"
                value={age}
                className={`${!age && "hidePrint"}`}
                placeholder="Enter Age"
                required
                onChange={(e) => setAge(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} lg={6} xl={3}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">Gender</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Male"
                  type="checkbox"
                  checked={sex === "Male"}
                  onChange={() => setSex("Male")}
                  id="Male"
                />
                <Form.Check
                  inline
                  label="Female"
                  type="checkbox"
                  checked={sex === "Female"}
                  onChange={() => setSex("Female")}
                  id="Female"
                />
                <Form.Check
                  inline
                  label="Transgender"
                  type="checkbox"
                  checked={sex === "Transgender"}
                  onChange={() => setSex("Transgender")}
                  id="Transgender"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} lg={6}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">Code Status</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Full Code"
                  type="checkbox"
                  checked={codeStatus.includes("Full Code")}
                  onChange={() => handleCodeStatusChange("Full Code")}
                  id="Full Code"
                />
                <Form.Check
                  inline
                  label="DNR"
                  type="checkbox"
                  checked={codeStatus.includes("DNR")}
                  onChange={() => handleCodeStatusChange("DNR")}
                  id="DNR"
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3 d-flex flex-column">
              <Form.Label className="fw-bold">
                Date of Last TB Screening
              </Form.Label>
              <DatePicker
                selected={formatDateToMMDDYYYY(lastTBScreeningDate)}
                onChange={(selectedDate) =>
                  setLastTBScreeningDate(selectedDate?.toDateString())
                }
                dateFormat="MM/dd/yyyy"
                placeholderText="MM/DD/YYYY"
                className={`form-control ${!lastTBScreeningDate && "hidePrint"}`}
                highlightDates={[
                  {
                    "react-datepicker__day--highlighted-custom": [
                      lastTBScreeningDate
                        ? formatDateToMMDDYYYY(lastTBScreeningDate)
                        : new Date(),
                    ],
                  },
                ]}
              />
            </Form.Group>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">Results</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Negative"
                  id="Negative"
                  type="checkbox"
                  checked={tbScreeningResults?.includes("Negative")}
                  onChange={() => handleMultiTbScreeningResults("Negative")}
                />
                <Form.Check
                  inline
                  label="Positive"
                  id="Positive"
                  type="checkbox"
                  checked={tbScreeningResults?.includes("Positive")}
                  onChange={() => handleMultiTbScreeningResults("Positive")}
                />
                <Form.Check
                  inline
                  label="Pending"
                  id="Pending"
                  type="checkbox"
                  checked={tbScreeningResults?.includes("Pending")}
                  onChange={() => handleMultiTbScreeningResults("Pending")}
                />
              </div>
            </Form.Group>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Group className="form-group form-print-group form-print-group-align mb-3">
              <Form.Label className="fw-bold">Care to be provided</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Physical Services"
                  id="Physical Services"
                  type="checkbox"
                  checked={careProvidedPhysicalServices.includes(
                    "PhysicalServices",
                  )}
                  onChange={() =>
                    careProvidedPhysicalServicesHandler("PhysicalServices")
                  }
                />
                <Form.Check
                  inline
                  label="Behavioral Health Services"
                  id="Behavioral Health Services"
                  type="checkbox"
                  checked={careProvidedPhysicalServices.includes(
                    "BehavioralHealthServices",
                  )}
                  onChange={() =>
                    careProvidedPhysicalServicesHandler(
                      "BehavioralHealthServices",
                    )
                  }
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Form.Label className="fw-bold">Vitals</Form.Label>
      <Card body className="mb-3">
        <Row>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsBloodPressure && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Blood Pressure:</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                size="sm"
                className={`w-[${vitalsBloodPressure?.length ? vitalsBloodPressure?.length * 20 + "px" : "60px"}]`}
                type="text"
                placeholder="___________"
                pattern="{0-9}"
                value={vitalsBloodPressure}
                required
                onChange={(e) => setVitalsBloodPressure(e.target.value)}
              ></Form.Control>
              <Form.Control
                size="sm"
                type="tel"
                placeholder="___________"
                value={"BP"}
                className="w-[60px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsPulse && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Pulse Rate :</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                size="sm"
                type="text"
                placeholder="___________"
                className={`w-[${vitalsPulse?.length ? vitalsPulse?.length * 20 + "px" : "60px"}]`}
                value={vitalsPulse}
                required
                onChange={(e) => setVitalsPulse(e.target.value)}
              ></Form.Control>
              <Form.Control
                size="sm"
                type="tel"
                placeholder="___________"
                value={"BPM"}
                className="w-[60px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsRespiratoryRate && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Respiration Rate :</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                size="sm"
                type="text"
                placeholder="___________"
                className={`w-[${vitalsRespiratoryRate?.length ? vitalsRespiratoryRate?.length * 20 + "px" : "60px"}]`}
                value={vitalsRespiratoryRate}
                required
                onChange={(e) => setVitalsRespiratoryRate(e.target.value)}
              ></Form.Control>
              <Form.Control
                size="sm"
                type="tel"
                placeholder="___________"
                value={"RR"}
                className="w-[60px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsTemperature && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Body Temperature :</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                size="sm"
                type="text"
                placeholder="___________"
                className={`w-[${vitalsTemperature?.length ? vitalsTemperature?.length * 20 + "px" : "60px"}]`}
                value={vitalsTemperature}
                required
                onChange={(e) => setVitalsTemperature(e.target.value)}
              ></Form.Control>
              <Form.Control
                size="sm"
                type="tel"
                placeholder="___________"
                value={"F"}
                className="w-[60px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsOxygenLevel && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Blood Oxygen:</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                size="sm"
                className={`w-[${vitalsOxygenLevel?.length ? vitalsOxygenLevel?.length * 20 + "px" : "60px"}]`}
                value={vitalsOxygenLevel}
                required
                onChange={(e) => setVitalsOxygenLevel(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="tel"
                size="sm"
                value={"O2%"}
                className="w-[60px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsWeight && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Weight :</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                type="number"
                size="sm"
                className="w-[60px]"
                value={vitalsWeight}
                required
                onChange={(e) => setVitalsWeight(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="tel"
                size="sm"
                value={"LBS"}
                className="w-[60px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!vitalsHeightFeet && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Height :</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                size="sm"
                className="w-[60px]"
                value={vitalsHeightFeet}
                required
                onChange={(e) => setVitalsHeightFeet(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="tel"
                size="sm"
                value={"Ft/Inches"}
                className="w-[80px] ml-0"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className={`${!allergies && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">Allergies :</Form.Label>
            <Form.Group className="d-flex gap-2 mb-3">
              <Form.Control
                type="text"
                size="sm"
                value={allergies}
                required
                onChange={(e) => setAllergies(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <div className="heading-nas">
        <Form.Label className="fw-bold">Review Of Systems</Form.Label>

        <Card body className="mb-3">
          <Row>
            <Col xs={12} sm={12} lg={12}>
              <Form.Group className="form-group form-mob-label-margin mb-3">
                <Form.Label className="fw-bold">Constitutional</Form.Label>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="DENIES"
                    type="checkbox"
                    id="DENIES222"
                    checked={reviewOfSystemsConstitutional?.includes("DENIES")}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("DENIES")
                    }
                  />
                  <Form.Check
                    inline
                    label="Fever"
                    type="checkbox"
                    id="Fever"
                    checked={reviewOfSystemsConstitutional?.includes("Fever")}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("Fever")
                    }
                  />
                  <Form.Check
                    inline
                    label="Poor appetite"
                    type="checkbox"
                    id="Poor appetite"
                    checked={reviewOfSystemsConstitutional?.includes(
                      "Poor appetite",
                    )}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("Poor appetite")
                    }
                  />
                  <Form.Check
                    inline
                    label="Unexplained weight gain"
                    type="checkbox"
                    id="Unexplained weight gain"
                    checked={reviewOfSystemsConstitutional?.includes(
                      "Unexplained weight gain",
                    )}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional(
                        "Unexplained weight gain",
                      )
                    }
                  />
                  <Form.Check
                    inline
                    label="Fatigue"
                    type="checkbox"
                    id="Fatigue"
                    checked={reviewOfSystemsConstitutional?.includes("Fatigue")}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("Fatigue")
                    }
                  />
                  <Form.Check
                    inline
                    label="Chills"
                    type="checkbox"
                    id="Chills"
                    checked={reviewOfSystemsConstitutional?.includes("Chills")}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("Chills")
                    }
                  />
                  <Form.Check
                    inline
                    label="Change in appetite"
                    type="checkbox"
                    id="Change in appetite"
                    checked={reviewOfSystemsConstitutional?.includes(
                      "Change in appetite",
                    )}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("Change in appetite")
                    }
                  />
                  <Form.Check
                    inline
                    label="Night Sweats"
                    type="checkbox"
                    id="Night Sweats"
                    checked={reviewOfSystemsConstitutional?.includes(
                      "Night Sweats",
                    )}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional("Night Sweats")
                    }
                  />
                  <Form.Check
                    inline
                    label="Unexplained weight loss"
                    type="checkbox"
                    id="Unexplained weight loss"
                    checked={reviewOfSystemsConstitutional?.includes(
                      "Unexplained weight loss",
                    )}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional(
                        "Unexplained weight loss",
                      )
                    }
                  />
                </div>
              </Form.Group>
            </Col>
            <Col
              xs={12}
              md={12}
              lg={12}
              className={`${!reviewOfSystemsConstitutionalOther && "hidePrint"}`}
            >
              <Form.Group>
                <Form.Label className="fw-bold">Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  id="reviewOfSystemsConstitutionalOther&address"
                  value={reviewOfSystemsConstitutionalOther}
                  placeholder="Enter text"
                  cols={82}
                  onChange={(e) =>
                    setReviewOfSystemsConstitutionalOther(e.target.value)
                  }
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Card>
      </div>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Cardiovascular</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  id="DENIESCard"
                  type="checkbox"
                  checked={reviewOfSystemsCardiovascular?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsCardiovascular("DENIES")}
                />
                <Form.Check
                  inline
                  label="Chest pain"
                  type="checkbox"
                  id="Chest pain"
                  checked={reviewOfSystemsCardiovascular?.includes(
                    "Chest pain",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsCardiovascular("Chest pain")
                  }
                />
                <Form.Check
                  inline
                  label="Shortness of breath"
                  type="checkbox"
                  id="Shortness of breath"
                  checked={reviewOfSystemsCardiovascular?.includes(
                    "Shortness of breath",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsCardiovascular("Shortness of breath")
                  }
                />
                <Form.Check
                  inline
                  label="Racing Pulse"
                  type="checkbox"
                  id="Racing Pulse"
                  checked={reviewOfSystemsCardiovascular?.includes(
                    "Racing Pulse",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsCardiovascular("Racing Pulse")
                  }
                />
                <Form.Check
                  inline
                  label="Swelling of the feet/hands"
                  type="checkbox"
                  id="Swelling of the feet/hands"
                  checked={reviewOfSystemsCardiovascular?.includes(
                    "Swelling of the feet/hands",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsCardiovascular(
                      "Swelling of the feet/hands",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Irregular heartbeat"
                  type="checkbox"
                  id="Irregular heartbeat"
                  checked={reviewOfSystemsCardiovascular?.includes(
                    "Irregular heartbeat",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsCardiovascular("Irregular heartbeat")
                  }
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsCardiovascularOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsCardiovascularOther"
                value={reviewOfSystemsCardiovascularOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsCardiovascularOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Endocrine</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesEndocrine"
                  checked={reviewOfSystemsEndocrine?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsEndocrine("DENIES")}
                />
                <Form.Check
                  inline
                  label="Excess thirst"
                  type="checkbox"
                  id="excessThirst"
                  checked={reviewOfSystemsEndocrine?.includes("Excess thirst")}
                  onChange={() =>
                    handlereviewOfSystemsEndocrine("Excess thirst")
                  }
                />
                <Form.Check
                  inline
                  label="Excessive urination"
                  type="checkbox"
                  id="excessiveUrination"
                  checked={reviewOfSystemsEndocrine?.includes(
                    "Excessive urination",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsEndocrine("Excessive urination")
                  }
                />
                <Form.Check
                  inline
                  label="Heat Intolerance"
                  type="checkbox"
                  id="heatIntolerance"
                  checked={reviewOfSystemsEndocrine?.includes(
                    "Heat Intolerance",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsEndocrine("Heat Intolerance")
                  }
                />
                <Form.Check
                  inline
                  label="Cold Intolerance"
                  type="checkbox"
                  id="coldIntolerance"
                  checked={reviewOfSystemsEndocrine?.includes(
                    "Cold Intolerance",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsEndocrine("Cold Intolerance")
                  }
                />
                <Form.Check
                  inline
                  label="Hair loss"
                  type="checkbox"
                  id="hairLoss"
                  checked={reviewOfSystemsEndocrine?.includes("Hair loss")}
                  onChange={() => handlereviewOfSystemsEndocrine("Hair loss")}
                />
                <Form.Check
                  inline
                  label="N/A"
                  type="checkbox"
                  id="N/a"
                  checked={reviewOfSystemsEndocrine?.includes("N/a")}
                  onChange={() => handlereviewOfSystemsEndocrine("N/a")}
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsEndocrineOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsEndocrineOther"
                value={reviewOfSystemsEndocrineOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsEndocrineOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Gastrointestinal</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesGastrointestinal"
                  checked={reviewOfSystemsGastrointestinal?.includes("DENIES")}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("DENIES")
                  }
                />
                <Form.Check
                  inline
                  label="Abdominal pain"
                  type="checkbox"
                  id="abdominalPain"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Abdominal pain",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Abdominal pain")
                  }
                />
                <Form.Check
                  inline
                  label="Nausea"
                  type="checkbox"
                  id="nausea"
                  checked={reviewOfSystemsGastrointestinal?.includes("Nausea")}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Nausea")
                  }
                />
                <Form.Check
                  inline
                  label="Diarrhea"
                  type="checkbox"
                  id="diarrhea"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Diarrhea",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Diarrhea")
                  }
                />
                <Form.Check
                  inline
                  label="Bloody stools"
                  type="checkbox"
                  id="bloodyStools"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Bloody stools",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Bloody stools")
                  }
                />
                <Form.Check
                  inline
                  label="Stomach Ulcers"
                  type="checkbox"
                  id="stomachUlcers"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Stomach Ulcers",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Stomach Ulcers")
                  }
                />
                <Form.Check
                  inline
                  label="Constipation"
                  type="checkbox"
                  id="constipation"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Constipation",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Constipation")
                  }
                />
                <Form.Check
                  inline
                  label="Trouble Swallowing"
                  type="checkbox"
                  id="troubleSwallowing"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Trouble Swallowing",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal("Trouble Swallowing")
                  }
                />
                <Form.Check
                  inline
                  label="Jaundice/yellow skin"
                  type="checkbox"
                  id="jaundiceYellowSkin"
                  checked={reviewOfSystemsGastrointestinal?.includes(
                    "Jaundice/yellow skin",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGastrointestinal(
                      "Jaundice/yellow skin",
                    )
                  }
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsGastrointestinalOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="programlocation&address"
                value={reviewOfSystemsGastrointestinalOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsGastrointestinalOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Genitourinary</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesGenitourinary"
                  checked={reviewOfSystemsGenitourinary?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsGenitourinary("DENIES")}
                />
                <Form.Check
                  inline
                  label="Genital sores or ulcers"
                  type="checkbox"
                  id="genitalSoresUlcers"
                  checked={reviewOfSystemsGenitourinary?.includes(
                    "Genital sores or ulcers",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGenitourinary(
                      "Genital sores or ulcers",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Kidney failure/problems"
                  type="checkbox"
                  id="kidneyFailureProblems"
                  checked={reviewOfSystemsGenitourinary?.includes(
                    "Kidney failure/problems",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGenitourinary(
                      "Kidney failure/problems",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Kidney stones"
                  type="checkbox"
                  id="Kidney stones"
                  checked={reviewOfSystemsGenitourinary?.includes(
                    "Kidney stones",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGenitourinary("Kidney stones")
                  }
                />
                <Form.Check
                  inline
                  label="Painful/difficult urination"
                  type="checkbox"
                  id="Painful/difficult urination"
                  checked={reviewOfSystemsGenitourinary?.includes(
                    "Painful/difficult urination",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGenitourinary(
                      "Painful/difficult urination",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Testicular pain"
                  type="checkbox"
                  id="Testicular pain"
                  checked={reviewOfSystemsGenitourinary?.includes(
                    "Testicular pain",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGenitourinary("Testicular pain")
                  }
                />
                <Form.Check
                  inline
                  label="Urinary discharge"
                  type="checkbox"
                  id="Urinary discharge"
                  checked={reviewOfSystemsGenitourinary?.includes(
                    "Urinary discharge",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsGenitourinary("Urinary discharge")
                  }
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsGenitourinaryOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="programlocation&address"
                value={reviewOfSystemsGenitourinaryOther}
                placeholder="Enter text"
                rows={2}
                cols={82}
                as="textarea"
                onChange={(e) =>
                  setReviewOfSystemsGenitourinaryOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Hematology/Oncology</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesHematologyOncology"
                  checked={reviewOfSystemsHematologyOncology?.includes(
                    "DENIES",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHematologyOncology("DENIES")
                  }
                />
                <Form.Check
                  inline
                  label="Easy bruising"
                  type="checkbox"
                  id="easyBruising"
                  checked={reviewOfSystemsHematologyOncology?.includes(
                    "Easy bruising",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHematologyOncology("Easy bruising")
                  }
                />
                <Form.Check
                  inline
                  label="Prolonged bleeding"
                  type="checkbox"
                  id="prolongedBleeding"
                  checked={reviewOfSystemsHematologyOncology?.includes(
                    "Prolongedbleeding",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHematologyOncology("Prolongedbleeding")
                  }
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsHematologyOncologyOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                value={reviewOfSystemsHematologyOncologyOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsHematologyOncologyOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">
                Head, Ear, Nose, Throat:{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesHeadNeckThroat"
                  checked={reviewOfSystemsHeadNeckThroat?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsHeadNeckThroat("DENIES")}
                />
                <Form.Check
                  inline
                  label="Hearing loss"
                  type="checkbox"
                  id="hearingLoss"
                  checked={reviewOfSystemsHeadNeckThroat?.includes(
                    "Hearing loss",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat("Hearing loss")
                  }
                />
                <Form.Check
                  inline
                  label="Sore throat"
                  type="checkbox"
                  id="soreThroat"
                  checked={reviewOfSystemsHeadNeckThroat?.includes(
                    "Sore throat",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat("Sore throat")
                  }
                />
                <Form.Check
                  inline
                  label="Runny nose"
                  type="checkbox"
                  id="runnyNose"
                  checked={reviewOfSystemsHeadNeckThroat?.includes(
                    "Runny nose",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat("Runny nose")
                  }
                />
                <Form.Check
                  inline
                  label="Dry mouth"
                  type="checkbox"
                  id="dryMouth"
                  checked={reviewOfSystemsHeadNeckThroat?.includes("Dry mouth")}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat("Dry mouth")
                  }
                />
                <Form.Check
                  inline
                  label="Jaw Claudication (pain in jaw when chewing)"
                  type="checkbox"
                  id="jawClaudication"
                  checked={reviewOfSystemsHeadNeckThroat?.includes(
                    "Jaw Claudication (pain in jaw when chewing)",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat(
                      "Jaw Claudication (pain in jaw when chewing)",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Earache"
                  type="checkbox"
                  id="earache"
                  checked={reviewOfSystemsHeadNeckThroat?.includes("Earache")}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat("Earache")
                  }
                />
                <Form.Check
                  inline
                  label="Missing teeth"
                  type="checkbox"
                  id="missingTeeth"
                  checked={reviewOfSystemsHeadNeckThroat?.includes(
                    "Missing teeth",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsHeadNeckThroat("Missing teeth")
                  }
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsHeadNeckThroatOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="programlocation&address"
                value={reviewOfSystemsHeadNeckThroatOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsHeadNeckThroatOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Integumentary</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesIntegumentary"
                  checked={reviewOfSystemsIntegumentary?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsIntegumentary("DENIES")}
                />
                <Form.Check
                  inline
                  label="Rash"
                  type="checkbox"
                  id="rash"
                  checked={reviewOfSystemsIntegumentary?.includes("Rash")}
                  onChange={() => handlereviewOfSystemsIntegumentary("Rash")}
                />
                <Form.Check
                  inline
                  label="Change in mole"
                  type="checkbox"
                  id="changeInMole"
                  checked={reviewOfSystemsIntegumentary?.includes(
                    "Change in mole",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsIntegumentary("Change in mole")
                  }
                />
                <Form.Check
                  inline
                  label="Skin sores"
                  type="checkbox"
                  id="skinSores"
                  checked={reviewOfSystemsIntegumentary?.includes("Skin sores")}
                  onChange={() =>
                    handlereviewOfSystemsIntegumentary("Skin sores")
                  }
                />
                <Form.Check
                  inline
                  label="Skin cancer"
                  type="checkbox"
                  id="skinCancer"
                  checked={reviewOfSystemsIntegumentary?.includes(
                    "Skin cancer",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsIntegumentary("Skin cancer")
                  }
                />
                <Form.Check
                  inline
                  label="Severe itching"
                  type="checkbox"
                  id="severeItching"
                  checked={reviewOfSystemsIntegumentary?.includes(
                    "Severe itching",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsIntegumentary("Severe itching")
                  }
                />
                <Form.Check
                  inline
                  label="Loss of hair"
                  type="checkbox"
                  id="lossOfHair"
                  checked={reviewOfSystemsIntegumentary?.includes(
                    "Loss of hair",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsIntegumentary("Loss of hair")
                  }
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsIntegumentaryOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="programlocation&address"
                value={reviewOfSystemsIntegumentaryOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsIntegumentaryOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default NursingAssessmentFormContentPart1;

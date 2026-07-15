/* eslint-disable no-unused-vars, jsx-a11y/heading-has-content */
/** @format */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import {
  body1,
  body2,
  body3,
  body4,
  body5,
  body6,
  body7,
  body8,
} from "@/assets";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";

const NursingAssessmentContentPart1 = (props) => {
  const {
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionDate,
    admissionDiagnoses,
    age,
    ahcccsId,
    allergies,
    back,
    behavioralSymptoms,
    bhpTime,
    bhtDate,
    bhtName,
    bhtSignature,
    cardiovascularBloodPressure,
    careProvidedPhysicalServices,
    careProvidedPhysicalServicesHandler,
    codeStatus,
    commentFigure,
    componentRef,
    currentMedications,
    dateOfBirth,
    draftModel,
    employ,
    endocrineBloodSuger,
    filedForm,
    front,
    getApiData,
    handleCodeStatusChange,
    handleData,
    handlePost,
    handlePrint2,
    handleSaveAsDraft,
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
    initialData,
    lastTBScreeningDate,
    legBack,
    legFront,
    legLeft,
    legRight,
    loading,
    newSigners,
    nutritionDiet,
    nutritionFluidRestrictions,
    nutritionSpecialDietOrder,
    physicalSymptoms,
    print,
    psychosocialSymptoms,
    residentDeniesSkinConcerns,
    residentName,
    reviewOfBehavioralSymptomsOther,
    reviewOfCurrentMedicationsOther,
    reviewOfNutritionDietOther,
    reviewOfPhysicalSymptomsOther,
    reviewOfSkinCheckOther,
    reviewOfSystemsCardiovascular,
    reviewOfSystemsConstitutional,
    reviewOfSystemsEndocrine,
    reviewOfSystemsEndocrineOther,
    reviewOfSystemsGastrointestinal,
    reviewOfSystemsGenitourinary,
    reviewOfSystemsHeadNeckThroat,
    reviewOfSystemsIntegumentary,
    reviewOfSystemsMusculoskeletal,
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
    saveAsDraft,
    sex,
    showSignatureResident,
    sideLeft,
    sideRight,
    signers,
    skinCheck,
    tbScreeningResults,
    todayDate,
    useNursingAssessmentLogic,
    userDetail,
    userId,
    vitalsBloodPressure,
    vitalsHeightFeet,
    vitalsHeightInches,
    vitalsOxygenLevel,
    vitalsPulse,
    vitalsRespiratoryRate,
    vitalsTemperature,
    vitalsWeight,
    reviewOfSystemsCardiovascularOther,
    reviewOfSystemsConstitutionalOther,
    reviewOfSystemsGastrointestinalOther,
    reviewOfSystemsGenitourinaryOther,
    reviewOfSystemsHeadNeckThroatOther,
    reviewOfSystemsHematologyOncology,
    reviewOfSystemsHematologyOncologyOther,
    reviewOfSystemsIntegumentaryOther,
    reviewOfSystemsMusculoskeletalOther,
    setSex,
    setTbScreeningResults,
  } = props;

  return (
    <>
      <Row>
        <Col
          xs={12}
          sm={5}
          md={4}
          lg={4}
          className={`${!residentName && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Resident Name : </p>
            <h5 className="view-value mb-0">{residentName}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={4}
          md={4}
          lg={4}
          className={`${!todayDate && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Created Date : </p>
            <h5 className="view-value mb-0">
              {formatDateToMMDDYYYY(todayDate)}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={3}
          md={4}
          lg={4}
          className={`${!admissionDate && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Admit Date : </p>
            <h5 className="view-value mb-0">
              {formatDateToMMDDYYYY(admissionDate)}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={12}
          className={`${!admissionDiagnoses && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">
              Diagnosis (specify if new or continuing) :{" "}
            </p>
            <h5 className="view-value mb-0">{admissionDiagnoses}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={4}
          className={`${!dateOfBirth && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Date of Birth : </p>
            <h5 className="view-value mb-0">
              {formatDateToMMDDYYYY(dateOfBirth)}
            </h5>
          </div>
        </Col>
        <Col xs={12} sm={12} lg={4} className={`${!age && "hidePrint"}`}>
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Enter Age : </p>
            <h5 className="view-value mb-0">{age}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={12}
          lg={4}
          className={`${!ahcccsId && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">AHCCCS ID : </p>
            <h5 className="view-value mb-0">{ahcccsId}</h5>
          </div>
        </Col>
        <Col xs={12} sm={12} lg={6}>
          <div className="view-details-grid d-lg-flex align-items-md-center my-1 my-md-2 p-3">
            <p className="view-label mb-1">Gender : </p>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Male"
                className="pointer-events-none"
                type="checkbox"
                checked={sex === "Male"}
                onChange={() => setSex("Male")}
              />
              <Form.Check
                inline
                label="Female"
                className="pointer-events-none"
                type="checkbox"
                checked={sex === "Female"}
                onChange={() => setSex("Female")}
              />
              <Form.Check
                inline
                label="Transgender"
                className="pointer-events-none"
                type="checkbox"
                checked={sex === "Transgender"}
                onChange={() => setSex("Transgender")}
              />
            </div>
          </div>
        </Col>

        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!codeStatus && "table-row-hide-print"}`}
        >
          <div className="view-details-grid d-lg-flex align-items-md-center my-1 my-md-2 p-3">
            <p className="view-label mb-1">Code Status : </p>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Full Code"
                type="checkbox"
                className={`pointer-events-none ${!codeStatus.includes("Full Code") && "hidePrint"}`}
                checked={codeStatus.includes("Full Code")}
                onChange={() => handleCodeStatusChange("Full Code")}
              />
              <Form.Check
                inline
                label="DNR"
                type="checkbox"
                className={`pointer-events-none ${!codeStatus.includes("DNR") && "hidePrint"}`}
                checked={codeStatus.includes("DNR")}
                onChange={() => handleCodeStatusChange("DNR")}
              />
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={6}
          className={`${!lastTBScreeningDate && "hidePrint"}`}
        >
          <div className="view-details-grid my-1 my-md-2 p-3">
            <p className="view-label mb-1">Date of Last TB Screening : </p>
            <h5 className="view-value mb-0">
              {formatDateToMMDDYYYY(lastTBScreeningDate)}
            </h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          lg={6}
          className={`${!tbScreeningResults && "table-row-hide-print"}`}
        >
          <div className="view-details-grid d-lg-flex align-items-md-center my-1 my-md-2 p-3">
            <p className="view-label mb-1">Results : </p>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Negative"
                type="checkbox"
                className={`pointer-events-none ${!tbScreeningResults?.includes("Negative") && "hidePrint"}`}
                checked={tbScreeningResults?.includes("Negative")}
                onChange={() => setTbScreeningResults("Negative")}
              />
              <Form.Check
                inline
                label="Positive"
                type="checkbox"
                className={`pointer-events-none ${!tbScreeningResults?.includes("Positive") && "hidePrint"}`}
                checked={tbScreeningResults?.includes("Positive")}
                onChange={() => setTbScreeningResults("Positive")}
              />
              <Form.Check
                inline
                label="Pending"
                type="checkbox"
                className={`pointer-events-none ${!tbScreeningResults?.includes("Pending") && "hidePrint"}`}
                checked={tbScreeningResults?.includes("Pending")}
                onChange={() => setTbScreeningResults("Pending")}
              />
            </div>
          </div>
        </Col>
        <Col
          xs={12}
          sm={12}
          lg={12}
          className={`${!careProvidedPhysicalServices && "table-row-hide-print"}`}
        >
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label mb-1">Care to be provided : </p>
            <div className="radio-inline">
              <Form.Check
                inline
                label="Physical Services"
                type="checkbox"
                className={`pointer-events-none ${!careProvidedPhysicalServices.includes("PhysicalServices") && "hidePrint"}`}
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
                type="checkbox"
                className={`pointer-events-none ${!careProvidedPhysicalServices.includes("BehavioralHealthServices") && "hidePrint"}`}
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
          </div>
        </Col>
      </Row>
      <Form.Label className="fw-bold mt-3">Vitals</Form.Label>
      <Row>
        <Col
          xs={12}
          sm={6}
          lg={3}
          className={`${!vitalsBloodPressure && "hidePrint"}`}
        >
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Blood Pressure : </p>
            <h5 className="view-value mb-0">{vitalsBloodPressure}</h5>
            <h5 className="view-value mb-0">{"BP"}</h5>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3} className={`${!vitalsPulse && "hidePrint"}`}>
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Pulse Rate : </p>
            <h5 className="view-value mb-0">{vitalsPulse}</h5>
            <h5 className="view-value mb-0">{"BPM"}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          lg={3}
          className={`${!vitalsRespiratoryRate && "hidePrint"}`}
        >
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Respiration Rate : </p>
            <h5 className="view-value mb-0">{vitalsRespiratoryRate}</h5>
            <h5 className="view-value mb-0">{"RR"}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          lg={3}
          className={`${!vitalsTemperature && "hidePrint"}`}
        >
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Body Temperature : </p>
            <h5 className="view-value mb-0">{vitalsTemperature}</h5>
            <h5 className="view-value mb-0">{"F"}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          lg={3}
          className={`${!vitalsOxygenLevel && "hidePrint"}`}
        >
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Blood Oxygen : </p>
            <h5 className="view-value mb-0">{vitalsOxygenLevel}</h5>
            <h5 className="view-value mb-0">{"O2%"}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          lg={3}
          className={`${!vitalsWeight && "hidePrint"}`}
        >
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Weight : </p>
            <h5 className="view-value mb-0">{vitalsWeight}</h5>
            <h5 className="view-value mb-0">{"LBS"}</h5>
          </div>
        </Col>
        <Col
          xs={12}
          sm={6}
          lg={3}
          className={`${!vitalsHeightFeet && "hidePrint"}`}
        >
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Height : </p>
            <h5 className="view-value mb-0">{vitalsHeightFeet}</h5>
            <h5 className="view-value mb-0">{"Ft/Inches"}</h5>
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3} className={`${!allergies && "hidePrint"}`}>
          <div className="view-details-grid d-flex align-items-center gap-2 my-1 my-md-2 p-3">
            <p className="view-label mb-0">Allergies : </p>
            <h5 className="view-value mb-0">{allergies}</h5>
          </div>
        </Col>
      </Row>
      <div className="heading-nas mt-3">
        <div className="">
          <Form.Label className="fw-bold w-100">Review Of Systems</Form.Label>
        </div>
        <Row className="mb-3">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsConstitutional?.length < 1 ? "table-row-hide-print" : " "}`}
              >
                <p className="view-label fw-bold mb-1">Constitutional : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="DENIES"
                    type="checkbox"
                    id="DENIES222"
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("DENIES") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Fever") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Poor appetite") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Unexplained weight gain") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Fatigue") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Chills") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Change in appetite") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Night Sweats") && "hidePrint"}`}
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
                    className={`pointer-events-none ${!reviewOfSystemsConstitutional?.includes("Unexplained weight loss") && "hidePrint"}`}
                    onChange={() =>
                      handlereviewOfSystemsConstitutional(
                        "Unexplained weight loss",
                      )
                    }
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsConstitutionalOther && "table-row-hide-print"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfSystemsConstitutionalOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsCardiovascular?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Cardiovascular : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className={`pointer-events-none ${!reviewOfSystemsCardiovascular?.includes("DENIES") && "hidePrint"}`}
                  type="checkbox"
                  checked={reviewOfSystemsCardiovascular?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsCardiovascular("DENIES")}
                />
                <Form.Check
                  inline
                  label="Chest pain"
                  className={`pointer-events-none ${!reviewOfSystemsCardiovascular?.includes("Chest pain") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsCardiovascular?.includes("Shortness of breath") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsCardiovascular?.includes("Racing Pulse") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!handlereviewOfSystemsCardiovascular("Swelling of the feet/hands") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!handlereviewOfSystemsCardiovascular("Irregular heartbeat") && "hidePrint"}`}
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
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsCardiovascularOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsCardiovascularOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsEndocrine?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Endocrine : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("DENIES") && "hidePrint"}`}
                  type="checkbox"
                  id="deniesEndocrine"
                  checked={reviewOfSystemsEndocrine?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsEndocrine("DENIES")}
                />
                <Form.Check
                  inline
                  label="Excess thirst"
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("Excess thirst") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("Excessive urination") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("Heat Intolerance") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("Cold Intolerance") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("Hair loss") && "hidePrint"}`}
                  type="checkbox"
                  id="hairLoss"
                  checked={reviewOfSystemsEndocrine?.includes("Hair loss")}
                  onChange={() => handlereviewOfSystemsEndocrine("Hair loss")}
                />
                <Form.Check
                  inline
                  label="N/A"
                  className={`pointer-events-none ${!reviewOfSystemsEndocrine?.includes("N/a") && "hidePrint"}`}
                  type="checkbox"
                  id="N/a"
                  checked={reviewOfSystemsEndocrine?.includes("N/a")}
                  onChange={() => handlereviewOfSystemsEndocrine("N/a")}
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsEndocrineOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsEndocrineOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsGastrointestinal?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Gastrointestinal : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("DENIES") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Abdominal pain") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Nausea") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Diarrhea") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Bloody stools") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Stomach Ulcers") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Constipation") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Trouble Swallowing") && "hidePrint"}`}
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
                  className={`pointer-events-none ${!reviewOfSystemsGastrointestinal?.includes("Jaundice/yellow skin") && "hidePrint"}`}
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
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsGastrointestinalOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsGastrointestinalOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsGenitourinary?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Genitourinary : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesGenitourinary"
                  checked={reviewOfSystemsGenitourinary?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsGenitourinary("DENIES")}
                />
                <Form.Check
                  inline
                  label="Genital sores or ulcers"
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
            </div>
            <div className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}>
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsGenitourinaryOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsHematologyOncology?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Hematology/Oncology : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsHematologyOncologyOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsHematologyOncologyOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsHeadNeckThroat?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">
                Head, Ear, Nose, Throat :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesHeadNeckThroat"
                  checked={reviewOfSystemsHeadNeckThroat?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsHeadNeckThroat("DENIES")}
                />
                <Form.Check
                  inline
                  label="Hearing loss"
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsHeadNeckThroatOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsHeadNeckThroatOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsIntegumentary?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Integumentary : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesIntegumentary"
                  checked={reviewOfSystemsIntegumentary?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsIntegumentary("DENIES")}
                />
                <Form.Check
                  inline
                  label="Rash"
                  className="pointer-events-none"
                  type="checkbox"
                  id="rash"
                  checked={reviewOfSystemsIntegumentary?.includes("Rash")}
                  onChange={() => handlereviewOfSystemsIntegumentary("Rash")}
                />
                <Form.Check
                  inline
                  label="Change in mole"
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
                  className="pointer-events-none"
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
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsIntegumentaryOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0"></h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsMusculoskeletal?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Musculoskeletal : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesMusculoskeletal"
                  checked={reviewOfSystemsMusculoskeletal?.includes("DENIES")}
                  onChange={() =>
                    handlereviewOfSystemsMusculoskeletal("DENIES")
                  }
                />
                <Form.Check
                  inline
                  label="Muscle aches"
                  className="pointer-events-none"
                  type="checkbox"
                  id="muscleAches"
                  checked={reviewOfSystemsMusculoskeletal?.includes(
                    "Muscle aches",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsMusculoskeletal("Muscle aches")
                  }
                />
                <Form.Check
                  inline
                  label="Difficulty laying flat due to muscle pain"
                  className="pointer-events-none"
                  type="checkbox"
                  id="difficultyLayingFlat"
                  checked={reviewOfSystemsMusculoskeletal?.includes(
                    "Difficulty laying flat due to muscle pain",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsMusculoskeletal(
                      "Difficulty laying flat due to muscle pain",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Back pain"
                  className="pointer-events-none"
                  type="checkbox"
                  id="backPain"
                  checked={reviewOfSystemsMusculoskeletal?.includes(
                    "Back pain",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsMusculoskeletal("Back pain")
                  }
                />
                <Form.Check
                  inline
                  label="Joint pain"
                  className="pointer-events-none"
                  type="checkbox"
                  id="jointPain"
                  checked={reviewOfSystemsMusculoskeletal?.includes(
                    "Joint pain",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsMusculoskeletal("Joint pain")
                  }
                />
                <Form.Check
                  inline
                  label="Deformities"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deformities"
                  checked={reviewOfSystemsMusculoskeletal?.includes(
                    "Deformities",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsMusculoskeletal("Deformities")
                  }
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsMusculoskeletalOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0"></h5>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NursingAssessmentContentPart1;

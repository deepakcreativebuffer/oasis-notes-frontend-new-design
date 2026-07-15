/* eslint-disable no-unused-vars */
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

const NursingAssessmentContentPart2 = (props) => {
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
    hoursFormat,
    profile,
    reviewOfNutritionFluidRestrictionsOther,
    reviewOfPsychosocialSymptomsOther,
    reviewOfSuicidalRiskAssessmentOther,
    reviewOfSystemsAllergicImmunologic,
    reviewOfSystemsAllergicImmunologicOther,
    setBack,
    setCurrentMedications,
    setFront,
    setLegBack,
    setLegFront,
    setLegLeft,
    setLegRight,
    setNutritionDiet,
    setNutritionFluidRestrictions,
    setShowSignatureResident,
    setSideLeft,
    setSideRight,
    setSkinCheck,
    setSuicidalRiskAssessmentDeniesSymptomsBellow,
    suicidalRiskAssessmentDeniesSymptomsBellow,
  } = props;

  return (
    <>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsPsychiatric?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Psychiatric : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesPsychiatric"
                  checked={reviewOfSystemsPsychiatric?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsPsychiatric("DENIES")}
                />
                <Form.Check
                  inline
                  label="Insomnia"
                  className="pointer-events-none"
                  type="checkbox"
                  id="insomnia"
                  checked={reviewOfSystemsPsychiatric?.includes("Insomnia")}
                  onChange={() => handlereviewOfSystemsPsychiatric("Insomnia")}
                />
                <Form.Check
                  inline
                  label="Irritability"
                  className="pointer-events-none"
                  type="checkbox"
                  id="irritability"
                  checked={reviewOfSystemsPsychiatric?.includes("Irritability")}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Irritability")
                  }
                />
                <Form.Check
                  inline
                  label="Depression"
                  className="pointer-events-none"
                  type="checkbox"
                  id="depression"
                  checked={reviewOfSystemsPsychiatric?.includes("Depression")}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Depression")
                  }
                />
                <Form.Check
                  inline
                  label="Anxiety"
                  className="pointer-events-none"
                  type="checkbox"
                  id="anxiety"
                  checked={reviewOfSystemsPsychiatric?.includes("Anxiety")}
                  onChange={() => handlereviewOfSystemsPsychiatric("Anxiety")}
                />
                <Form.Check
                  inline
                  label="Recurrent bad thoughts"
                  className="pointer-events-none"
                  type="checkbox"
                  id="recurrentBadThoughts"
                  checked={reviewOfSystemsPsychiatric?.includes(
                    "Recurrent bad thoughts",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Recurrent bad thoughts")
                  }
                />
                <Form.Check
                  inline
                  label="Mood swings"
                  className="pointer-events-none"
                  type="checkbox"
                  id="moodSwings"
                  checked={reviewOfSystemsPsychiatric?.includes("Mood swings")}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Mood swings")
                  }
                />
                <Form.Check
                  inline
                  label="Hallucinations"
                  className="pointer-events-none"
                  type="checkbox"
                  id="hallucinations"
                  checked={reviewOfSystemsPsychiatric?.includes(
                    "Hallucinations",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Hallucinations")
                  }
                />
                <Form.Check
                  inline
                  label="N/A"
                  className="pointer-events-none"
                  type="checkbox"
                  id="compulsions"
                  checked={reviewOfSystemsPsychiatric?.includes("Compulsions")}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Compulsions")
                  }
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsPsychiatricOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsPsychiatricOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsNeurologic?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Neurologic : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesNeurologic"
                  checked={reviewOfSystemsNeurologic?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsNeurologic("DENIES")}
                />
                <Form.Check
                  inline
                  label="Weakness"
                  className="pointer-events-none"
                  type="checkbox"
                  id="weakness"
                  checked={reviewOfSystemsNeurologic?.includes("Weakness")}
                  onChange={() => handlereviewOfSystemsNeurologic("Weakness")}
                />
                <Form.Check
                  inline
                  label="Headaches"
                  className="pointer-events-none"
                  type="checkbox"
                  id="headaches"
                  checked={reviewOfSystemsNeurologic?.includes("Headaches")}
                  onChange={() => handlereviewOfSystemsNeurologic("Headaches")}
                />
                <Form.Check
                  inline
                  label="Scalp tenderness"
                  className="pointer-events-none"
                  type="checkbox"
                  id="scalpTenderness"
                  checked={reviewOfSystemsNeurologic?.includes(
                    "Scalp tenderness",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsNeurologic("Scalp tenderness")
                  }
                />
                <Form.Check
                  inline
                  label="Dizziness"
                  className="pointer-events-none"
                  type="checkbox"
                  id="dizziness"
                  checked={reviewOfSystemsNeurologic?.includes("Dizziness")}
                  onChange={() => handlereviewOfSystemsNeurologic("Dizziness")}
                />
                <Form.Check
                  inline
                  label="Problems with balance"
                  className="pointer-events-none"
                  type="checkbox"
                  id="balanceProblems"
                  checked={reviewOfSystemsNeurologic?.includes(
                    "Problems with balance",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsNeurologic("Problems with balance")
                  }
                />
                <Form.Check
                  inline
                  label="Paralysis of extremities"
                  className="pointer-events-none"
                  type="checkbox"
                  id="paralysis"
                  checked={reviewOfSystemsNeurologic?.includes(
                    "Paralysis of extremities",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsNeurologic("Paralysis of extremities")
                  }
                />
                <Form.Check
                  inline
                  label="Tremor"
                  className="pointer-events-none"
                  type="checkbox"
                  id="tremor"
                  checked={reviewOfSystemsNeurologic?.includes("Tremor")}
                  onChange={() => handlereviewOfSystemsNeurologic("Tremor")}
                />
                <Form.Check
                  inline
                  label="Stroke"
                  className="pointer-events-none"
                  type="checkbox"
                  id="stroke"
                  checked={reviewOfSystemsNeurologic?.includes("Stroke")}
                  onChange={() => handlereviewOfSystemsNeurologic("Stroke")}
                />
                <Form.Check
                  inline
                  label="Numbness or tingling"
                  className="pointer-events-none"
                  type="checkbox"
                  id="numbnessTingling"
                  checked={reviewOfSystemsNeurologic?.includes(
                    "Numbness or tingling",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsNeurologic("Numbness or tingling")
                  }
                />
                <Form.Check
                  inline
                  label="Seizures or convulsions"
                  className="pointer-events-none"
                  type="checkbox"
                  id="seizures"
                  checked={reviewOfSystemsNeurologic?.includes(
                    "Seizures or convulsions",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsNeurologic("Seizures or convulsions")
                  }
                />
                <Form.Check
                  inline
                  label="Fainting"
                  className="pointer-events-none"
                  type="checkbox"
                  id="fainting"
                  checked={reviewOfSystemsNeurologic?.includes("Fainting")}
                  onChange={() => handlereviewOfSystemsNeurologic("Fainting")}
                />
                <Form.Check
                  inline
                  label="Problems walking"
                  className="pointer-events-none"
                  type="checkbox"
                  id="walkingProblems"
                  checked={reviewOfSystemsNeurologic?.includes(
                    "Problems walking",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsNeurologic("Problems walking")
                  }
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsNeurologicOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsNeurologicOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsRespiratory?.length < 1 && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Respiratory : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesRespiratory"
                  checked={reviewOfSystemsRespiratory?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsRespiratory("DENIES")}
                />
                <Form.Check
                  inline
                  label="Excess thirst"
                  className="pointer-events-none"
                  type="checkbox"
                  id="wheezing"
                  checked={reviewOfSystemsRespiratory?.includes("Wheezing")}
                  onChange={() => handlereviewOfSystemsRespiratory("Wheezing")}
                />
                <Form.Check
                  inline
                  label="Cough"
                  className="pointer-events-none"
                  type="checkbox"
                  id="cough"
                  checked={reviewOfSystemsRespiratory?.includes("Cough")}
                  onChange={() => handlereviewOfSystemsRespiratory("Cough")}
                />
                <Form.Check
                  inline
                  label="Coughing up blood"
                  className="pointer-events-none"
                  type="checkbox"
                  id="coughingUpBlood"
                  checked={reviewOfSystemsRespiratory?.includes(
                    "Coughing up blood",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsRespiratory("Coughing up blood")
                  }
                />
                <Form.Check
                  inline
                  label="Severe or Frequent colds"
                  className="pointer-events-none"
                  type="checkbox"
                  id="severeOrFrequentColds"
                  checked={reviewOfSystemsRespiratory?.includes(
                    "Severe or Frequent colds",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsRespiratory("Severe or Frequent colds")
                  }
                />
                <Form.Check
                  inline
                  label="Difficulty breathing"
                  className="pointer-events-none"
                  type="checkbox"
                  id="difficultyBreathing"
                  checked={reviewOfSystemsRespiratory?.includes(
                    "Difficulty breathing",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsRespiratory("Difficulty breathing")
                  }
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsRespiratoryOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsRespiratoryOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsAllergicImmunologicOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Allergic/Immunologic : </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  className="pointer-events-none"
                  type="checkbox"
                  id="deniesAllergicImmunologic"
                  checked={reviewOfSystemsAllergicImmunologic?.includes(
                    "DENIES",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsAllergicImmunologic("DENIES")
                  }
                />
                <Form.Check
                  inline
                  label="Seasonal allergies"
                  className="pointer-events-none"
                  type="checkbox"
                  id="seasonalAllergies"
                  checked={reviewOfSystemsAllergicImmunologic?.includes(
                    "Seasonal allergies",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsAllergicImmunologic(
                      "Seasonal allergies",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Hay fever symptoms"
                  className="pointer-events-none"
                  type="checkbox"
                  id="hayFeverSymptoms"
                  checked={reviewOfSystemsAllergicImmunologic?.includes(
                    "Hay fever symptoms",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsAllergicImmunologic(
                      "Hay fever symptoms",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Itching"
                  className="pointer-events-none"
                  type="checkbox"
                  id="itching"
                  checked={reviewOfSystemsAllergicImmunologic?.includes(
                    "Itching",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsAllergicImmunologic("Itching")
                  }
                />
                <Form.Check
                  inline
                  label="Frequent infections"
                  className="pointer-events-none"
                  type="checkbox"
                  id="frequentInfections"
                  checked={reviewOfSystemsAllergicImmunologic?.includes(
                    "Frequent infections",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsAllergicImmunologic(
                      "Frequent infections",
                    )
                  }
                />
                <Form.Check
                  inline
                  label="Exposure to HIV"
                  className="pointer-events-none"
                  type="checkbox"
                  id="exposureToHIV"
                  checked={reviewOfSystemsAllergicImmunologic?.includes(
                    "Exposure to HIV",
                  )}
                  onChange={() =>
                    handlereviewOfSystemsAllergicImmunologic("Exposure to HIV")
                  }
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsAllergicImmunologicOther && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSystemsAllergicImmunologicOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!suicidalRiskAssessmentDeniesSymptomsBellow && "table-row-hide-print"}`}
            >
              <p className="view-label fw-bold mb-1">
                Suicidal Risk Assessment :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Denies symptoms below"
                  className="pointer-events-none"
                  type="checkbox"
                  id="suicidalRiskAssessmentDeniesSymptomsBellow"
                  checked={suicidalRiskAssessmentDeniesSymptomsBellow}
                  onChange={() =>
                    setSuicidalRiskAssessmentDeniesSymptomsBellow(
                      !suicidalRiskAssessmentDeniesSymptomsBellow,
                    )
                  }
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSuicidalRiskAssessmentOther && "hidePrint"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">
                {reviewOfSuicidalRiskAssessmentOther}
              </h5>
            </div>
          </div>
        </Col>
      </Row>

      <div
        className={`mb-3 ${behavioralSymptoms?.length < 1 && "table-row-hide-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">
                  Behavioral symptoms :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Self-injuring"
                    className="pointer-events-none"
                    type="checkbox"
                    id="selfInjuring"
                    checked={behavioralSymptoms?.includes("self-injuring")}
                    onChange={() => handlebehavioralSymptoms("self-injuring")}
                  />
                  <Form.Check
                    inline
                    label="Reckless behavior"
                    className="pointer-events-none"
                    type="checkbox"
                    id="recklessBehavior"
                    checked={behavioralSymptoms?.includes("reckless behavior")}
                    onChange={() =>
                      handlebehavioralSymptoms("reckless behavior")
                    }
                  />
                  <Form.Check
                    inline
                    label="Impulsive behaviors"
                    className="pointer-events-none"
                    type="checkbox"
                    id="impulsiveBehaviors"
                    checked={behavioralSymptoms?.includes(
                      "impulsive behaviors",
                    )}
                    onChange={() =>
                      handlebehavioralSymptoms("impulsive behaviors")
                    }
                  />
                  <Form.Check
                    inline
                    label="Shifts in temperament"
                    className="pointer-events-none"
                    type="checkbox"
                    id="shiftsInTemperament"
                    checked={behavioralSymptoms?.includes(
                      "shifts in temperament",
                    )}
                    onChange={() =>
                      handlebehavioralSymptoms("shifts in temperament")
                    }
                  />
                  <Form.Check
                    inline
                    label="No longer enjoying previous activities"
                    className="pointer-events-none"
                    type="checkbox"
                    id="noLongerEnjoyingActivities"
                    checked={behavioralSymptoms?.includes(
                      "no longer enjoying previous activities",
                    )}
                    onChange={() =>
                      handlebehavioralSymptoms(
                        "no longer enjoying previous activities",
                      )
                    }
                  />
                  <Form.Check
                    inline
                    label="Talking or writing about death"
                    className="pointer-events-none"
                    type="checkbox"
                    id="talkingOrWritingAboutDeath"
                    checked={behavioralSymptoms?.includes(
                      "talking or writing about death",
                    )}
                    onChange={() =>
                      handlebehavioralSymptoms("talking or writing about death")
                    }
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfBehavioralSymptomsOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfBehavioralSymptomsOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div
        className={`mb-3 ${physicalSymptoms?.length < 1 && "table-row-hide-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">Physical symptoms : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Insomnia"
                    className="pointer-events-none"
                    type="checkbox"
                    id="insomniap"
                    checked={physicalSymptoms?.includes("insomnia")}
                    onChange={() => handlephysicalSymptoms("insomnia")}
                  />
                  <Form.Check
                    inline
                    label="Hypersomnia"
                    className="pointer-events-none"
                    type="checkbox"
                    id="hypersomnia"
                    checked={physicalSymptoms?.includes("hypersomnia")}
                    onChange={() => handlephysicalSymptoms("hypersomnia")}
                  />
                  <Form.Check
                    inline
                    label="Changes in appetite"
                    className="pointer-events-none"
                    type="checkbox"
                    id="changesInAppetite"
                    checked={physicalSymptoms?.includes("changes in appetite")}
                    onChange={() =>
                      handlephysicalSymptoms("changes in appetite")
                    }
                  />
                  <Form.Check
                    inline
                    label="Weight loss/gain"
                    className="pointer-events-none"
                    type="checkbox"
                    id="weightLossGain"
                    checked={physicalSymptoms?.includes("weight loss/gain")}
                    onChange={() => handlephysicalSymptoms("weight loss/gain")}
                  />
                  <Form.Check
                    inline
                    label="Panic attacks"
                    className="pointer-events-none"
                    type="checkbox"
                    id="panicAttacks"
                    checked={physicalSymptoms?.includes("panic attacks")}
                    onChange={() => handlephysicalSymptoms("panic attacks")}
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfPhysicalSymptomsOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfPhysicalSymptomsOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`mb-3 ${psychosocialSymptoms?.length < 1 && "table-row-hide-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">
                  Psychosocial symptoms :{" "}
                </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Helplessness"
                    className="pointer-events-none"
                    type="checkbox"
                    id="helplessnessHopelessness"
                    checked={psychosocialSymptoms?.includes(
                      "helplessness/hopelessness",
                    )}
                    onChange={() =>
                      handlerepsychosocialSymptoms("helplessness/hopelessness")
                    }
                  />
                  <Form.Check
                    inline
                    label="Worthlessness"
                    className="pointer-events-none"
                    type="checkbox"
                    id="worthlessness"
                    checked={psychosocialSymptoms?.includes("worthlessness")}
                    onChange={() =>
                      handlerepsychosocialSymptoms("worthlessness")
                    }
                  />
                  <Form.Check
                    inline
                    label="Depression"
                    className="pointer-events-none"
                    type="checkbox"
                    id="depression"
                    checked={psychosocialSymptoms?.includes("depression")}
                    onChange={() => handlerepsychosocialSymptoms("depression")}
                  />
                  <Form.Check
                    inline
                    label="Anxiety"
                    className="pointer-events-none"
                    type="checkbox"
                    id="anxiety"
                    checked={psychosocialSymptoms?.includes("anxiety")}
                    onChange={() => handlerepsychosocialSymptoms("anxiety")}
                  />
                  <Form.Check
                    inline
                    label="Mood swings"
                    className="pointer-events-none"
                    type="checkbox"
                    id="moodSwings1111"
                    checked={psychosocialSymptoms?.includes("mood swings")}
                    onChange={() => handlerepsychosocialSymptoms("mood swings")}
                  />
                  <Form.Check
                    inline
                    label="Irritable"
                    className="pointer-events-none"
                    type="checkbox"
                    id="irritable"
                    checked={psychosocialSymptoms?.includes("Irritable")}
                    onChange={() => handlerepsychosocialSymptoms("Irritable")}
                  />
                  <Form.Check
                    inline
                    label="Resident contracts for safety"
                    className="pointer-events-none"
                    type="checkbox"
                    id="residentContractsForSafety"
                    checked={psychosocialSymptoms?.includes(
                      "Resident contracts for safety",
                    )}
                    onChange={() =>
                      handlerepsychosocialSymptoms(
                        "Resident contracts for safety",
                      )
                    }
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfPsychosocialSymptomsOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfPsychosocialSymptomsOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row className="mb-2">
        <Col xs={12}>
          <div className="view-details-grid d-block">
            <div className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}>
              <p className="view-label fw-bold mb-1">
                Resident Safety Plan to be completed within 48 hours of
                admission{" "}
              </p>
            </div>
            <div className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}>
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">{safetyPlanComment}</h5>
            </div>
          </div>
        </Col>
      </Row>
      <div className={`mb-3 ${!currentMedications && "table-row-hide-print"}`}>
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">Current Medications :</p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Verified that a list of current medications is present on file."
                    type="checkbox"
                    checked={currentMedications}
                    onChange={() => setCurrentMedications(!currentMedications)}
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfCurrentMedicationsOther && "hidePrint"} `}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfCurrentMedicationsOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`mb-3 ${nutritionDiet !== "As tolerated" && nutritionDiet !== "Special diet" && "table-row-hide-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">Nutrition Diet : </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="As tolerated"
                    className="pointer-events-none"
                    type="checkbox"
                    id="As tolerated"
                    checked={nutritionDiet === "As tolerated"}
                    onChange={() => setNutritionDiet("As tolerated")}
                  />
                  <Form.Check
                    inline
                    label="Special diet ordered"
                    className="pointer-events-none"
                    type="checkbox"
                    id="Special diet"
                    checked={nutritionDiet === "Special diet"}
                    onChange={() => setNutritionDiet("Special diet")}
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfNutritionDietOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfNutritionDietOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div
        className={`mb-3 ${nutritionFluidRestrictions !== true && nutritionFluidRestrictions !== false && "table-row-hide-print"}`}
      >
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfNutritionFluidRestrictionsOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Fluid restrictions? </p>
                <div className="radio-inline">
                  <Form.Check
                    inline
                    label="Yes"
                    type="checkbox"
                    id="nutritionFluidRestrictions"
                    checked={nutritionFluidRestrictions === true}
                    onChange={() => setNutritionFluidRestrictions(true)}
                  />
                  <Form.Check
                    inline
                    label="No"
                    type="checkbox"
                    id="nutritionFluidRestrictionsno"
                    checked={nutritionFluidRestrictions === false}
                    onChange={() => setNutritionFluidRestrictions(false)}
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfNutritionFluidRestrictionsOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="mb-3">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}>
              <p className="view-label fw-bold mb-1">
                Skin Check - Areas requiring treatment marked and labeled :{" "}
              </p>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Resident denies skin concerns"
                  className="pointer-events-none"
                  type="checkbox"
                  checked={skinCheck}
                  onChange={(e) => setSkinCheck(!skinCheck)}
                />
              </div>
            </div>
            <div
              className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSkinCheckOther && "hidePrint"}`}
            >
              <p className="view-label fw-bold mb-1">Comment : </p>
              <h5 className="view-value mb-0">{reviewOfSkinCheckOther}</h5>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={front}
                onChange={() => setFront(!front)}
              />
              <div className="text-center w-100">
                <img
                  src={body1}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={back}
                onChange={() => setBack(!back)}
              />
              <div className="text-center w-100">
                <img
                  src={body2}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={sideLeft}
                onChange={() => setSideLeft(!sideLeft)}
              />
              <div className="text-center w-100">
                <img
                  src={body3}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={sideRight}
                onChange={() => setSideRight(!sideRight)}
              />
              <div className="text-center w-100">
                <img
                  src={body4}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={legFront}
                onChange={() => setLegFront(!legFront)}
              />
              <div className="text-center w-100">
                <img
                  src={body5}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={legBack}
                onChange={() => setLegBack(!legBack)}
              />
              <div className="text-center w-100">
                <img
                  src={body6}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={legLeft}
                onChange={() => setLegLeft(!legLeft)}
              />
              <div className="text-center w-100">
                <img
                  src={body7}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={legRight}
                onChange={() => setLegRight(!legRight)}
              />
              <div className="text-center w-100">
                <img
                  src={body8}
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                  alt=""
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className={`${!commentFigure && "table-row-hide-print"}`}>
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label fw-bold mb-1">Comment : </p>
            <h5 className="view-value mb-0">{commentFigure}</h5>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} lg={6} className="d-flex align-items-start">
          <Button
            type="button"
            className="theme-button me-2 hidePrint"
            onClick={() => setShowSignatureResident(true)}
          >
            SAVED AND SIGNED
          </Button>
        </Col>
        <Col xs={12} lg={6} className="text-end">
          <p className="text-end mb-0">
            {rnSignature &&
              signatureFormat({
                sign: rnSignature,
                date: rnDate,
                time: rnTime,
                hoursFormat,
              })}
            {signatureFormat({
              sign: adminSignature,
              date: adminSignatureDate,
              time: adminSignatureTime,
              hoursFormat,
            })}
          </p>
          <p className="text-end mb-0">
            {signers?.map(
              (signer) =>
                signer.signature && (
                  <div key={signer?.signerId}>
                    {signatureFormat({
                      sign: signer.signature,
                      date: signer.dateSigned,
                      time: signer.signedTime,
                      hoursFormat,
                    })}
                  </div>
                ),
            )}
          </p>
        </Col>
      </Row>

      {(profile.userType === ROLES.PATIENT ||
        profile.userType === ROLES.GUARDIAN) && (
        <Row>
          <Col xs={12}>
            <div className="employee_btn_div hidePrint">
              <button
                type="submit"
                onClick={handlePost}
                className="employee_create_btn"
              >
                SUBMIT DETAILS
              </button>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default NursingAssessmentContentPart2;

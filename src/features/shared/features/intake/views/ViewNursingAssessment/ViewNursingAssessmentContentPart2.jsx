/** @format */
import React from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
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
import { signatureFormat } from "@/utils/utils";

const ViewNursingAssessmentContentPart2 = (props) => {
  const {
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    back,
    behavioralSymptoms,
    commentFigure,
    currentMedications,
    front,
    legBack,
    legFront,
    legLeft,
    legRight,
    nutritionDiet,
    nutritionFluidRestrictions,
    physicalSymptoms,
    print,
    psychosocialSymptoms,
    reviewOfBehavioralSymptomsOther,
    reviewOfCurrentMedicationsOther,
    reviewOfNutritionDietOther,
    reviewOfPhysicalSymptomsOther,
    reviewOfSkinCheckOther,
    reviewOfSystemsNeurologic,
    reviewOfSystemsNeurologicOther,
    reviewOfSystemsPsychiatric,
    reviewOfSystemsPsychiatricOther,
    reviewOfSystemsRespiratory,
    reviewOfSystemsRespiratoryOther,
    rnDate,
    rnSignature,
    rnTime,
    safetyPlanComment,
    sideLeft,
    sideRight,
    signers,
    skinCheck,
    reviewOfSystemsAllergicImmunologic,
    reviewOfSystemsAllergicImmunologicOther,
    suicidalRiskAssessmentDeniesSymptomsBellow,
    reviewOfSuicidalRiskAssessmentOther,
    reviewOfPsychosocialSymptomsOther,
    setCurrentMedications,
    setNutritionFluidRestrictions,
    reviewOfNutritionFluidRestrictionsOther,
    setLegRight,
    hoursFormat,
  } = props;

  return (
    <>
      {reviewOfSystemsPsychiatric?.length > 0 && (
        <Row className="mb-2 print-bottom-0">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsPsychiatric?.length < 1 && "hidePrint"}`}
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
                  />
                  <Form.Check
                    inline
                    label="Insomnia"
                    className="pointer-events-none"
                    type="checkbox"
                    id="insomnia"
                    checked={reviewOfSystemsPsychiatric?.includes("Insomnia")}
                  />
                  <Form.Check
                    inline
                    label="Irritability"
                    className="pointer-events-none"
                    type="checkbox"
                    id="irritability"
                    checked={reviewOfSystemsPsychiatric?.includes(
                      "Irritability",
                    )}
                  />
                  <Form.Check
                    inline
                    label="Depression"
                    className="pointer-events-none"
                    type="checkbox"
                    id="depression"
                    checked={reviewOfSystemsPsychiatric?.includes("Depression")}
                  />
                  <Form.Check
                    inline
                    label="Anxiety"
                    className="pointer-events-none"
                    type="checkbox"
                    id="anxiety"
                    checked={reviewOfSystemsPsychiatric?.includes("Anxiety")}
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
                  />
                  <Form.Check
                    inline
                    label="Mood swings"
                    className="pointer-events-none"
                    type="checkbox"
                    id="moodSwings"
                    checked={reviewOfSystemsPsychiatric?.includes(
                      "Mood swings",
                    )}
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
                  />
                  <Form.Check
                    inline
                    label="N/A"
                    className="pointer-events-none"
                    type="checkbox"
                    id="compulsions"
                    checked={reviewOfSystemsPsychiatric?.includes(
                      "Compulsions",
                    )}
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsPsychiatricOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfSystemsPsychiatricOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      )}
      {reviewOfSystemsNeurologic?.length > 0 && (
        <Row className="mb-2 print-bottom-0">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsNeurologic?.length < 1 && "hidePrint"}`}
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
                  />
                  <Form.Check
                    inline
                    label="Weakness"
                    className="pointer-events-none"
                    type="checkbox"
                    id="weakness"
                    checked={reviewOfSystemsNeurologic?.includes("Weakness")}
                  />
                  <Form.Check
                    inline
                    label="Headaches"
                    className="pointer-events-none"
                    type="checkbox"
                    id="headaches"
                    checked={reviewOfSystemsNeurologic?.includes("Headaches")}
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
                  />
                  <Form.Check
                    inline
                    label="Dizziness"
                    className="pointer-events-none"
                    type="checkbox"
                    id="dizziness"
                    checked={reviewOfSystemsNeurologic?.includes("Dizziness")}
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
                  />
                  <Form.Check
                    inline
                    label="Tremor"
                    className="pointer-events-none"
                    type="checkbox"
                    id="tremor"
                    checked={reviewOfSystemsNeurologic?.includes("Tremor")}
                  />
                  <Form.Check
                    inline
                    label="Stroke"
                    className="pointer-events-none"
                    type="checkbox"
                    id="stroke"
                    checked={reviewOfSystemsNeurologic?.includes("Stroke")}
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
                  />
                  <Form.Check
                    inline
                    label="Fainting"
                    className="pointer-events-none"
                    type="checkbox"
                    id="fainting"
                    checked={reviewOfSystemsNeurologic?.includes("Fainting")}
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
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsNeurologicOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfSystemsNeurologicOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      )}
      {reviewOfSystemsRespiratory?.length > 0 && (
        <Row className="mb-2 print-bottom-0">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsRespiratory?.length < 1 && "hidePrint"}`}
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
                  />
                  <Form.Check
                    inline
                    label="Excess thirst"
                    className="pointer-events-none"
                    type="checkbox"
                    id="wheezing"
                    checked={reviewOfSystemsRespiratory?.includes("Wheezing")}
                  />
                  <Form.Check
                    inline
                    label="Cough"
                    className="pointer-events-none"
                    type="checkbox"
                    id="cough"
                    checked={reviewOfSystemsRespiratory?.includes("Cough")}
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
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsRespiratoryOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfSystemsRespiratoryOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      )}
      {reviewOfSystemsAllergicImmunologic?.length > 0 && (
        <Row className="mb-2 print-bottom-0">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${reviewOfSystemsAllergicImmunologic?.length < 1 && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">
                  Allergic/Immunologic :{" "}
                </p>
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
                  />
                </div>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfSystemsAllergicImmunologicOther && "hidePrint"}`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">
                  {reviewOfSystemsAllergicImmunologicOther}
                </h5>
              </div>
            </div>
          </Col>
        </Row>
      )}
      {suicidalRiskAssessmentDeniesSymptomsBellow && (
        <Row className="mb-2 print-bottom-0">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!suicidalRiskAssessmentDeniesSymptomsBellow && "hidePrint"}`}
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
      )}
      <div className={`${behavioralSymptoms?.length < 1 && "hidePrint"}`}>
        <Row className="mb-2">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}
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
                  />
                  <Form.Check
                    inline
                    label="Reckless behavior"
                    className="pointer-events-none"
                    type="checkbox"
                    id="recklessBehavior"
                    checked={behavioralSymptoms?.includes("reckless behavior")}
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
      <div className={` ${physicalSymptoms?.length < 1 && "hidePrint"}`}>
        <Row className="mb-2">
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
                  />
                  <Form.Check
                    inline
                    label="Hypersomnia"
                    className="pointer-events-none"
                    type="checkbox"
                    id="hypersomnia"
                    checked={physicalSymptoms?.includes("hypersomnia")}
                  />
                  <Form.Check
                    inline
                    label="Changes in appetite"
                    className="pointer-events-none"
                    type="checkbox"
                    id="changesInAppetite"
                    checked={physicalSymptoms?.includes("changes in appetite")}
                  />
                  <Form.Check
                    inline
                    label="Weight loss/gain"
                    className="pointer-events-none"
                    type="checkbox"
                    id="weightLossGain"
                    checked={physicalSymptoms?.includes("weight loss/gain")}
                  />
                  <Form.Check
                    inline
                    label="Panic attacks"
                    className="pointer-events-none"
                    type="checkbox"
                    id="panicAttacks"
                    checked={physicalSymptoms?.includes("panic attacks")}
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
      <div className={`${psychosocialSymptoms?.length < 1 && "hidePrint"}`}>
        <Row className="mb-2">
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
                  />
                  <Form.Check
                    inline
                    label="Worthlessness"
                    className="pointer-events-none"
                    type="checkbox"
                    id="worthlessness"
                    checked={psychosocialSymptoms?.includes("worthlessness")}
                  />
                  <Form.Check
                    inline
                    label="Depression"
                    className="pointer-events-none"
                    type="checkbox"
                    id="depression"
                    checked={psychosocialSymptoms?.includes("depression")}
                  />
                  <Form.Check
                    inline
                    label="Anxiety"
                    className="pointer-events-none"
                    type="checkbox"
                    id="anxiety"
                    checked={psychosocialSymptoms?.includes("anxiety")}
                  />
                  <Form.Check
                    inline
                    label="Mood swings"
                    className="pointer-events-none"
                    type="checkbox"
                    id="moodSwings1111"
                    checked={psychosocialSymptoms?.includes("mood swings")}
                  />
                  <Form.Check
                    inline
                    label="Irritable"
                    className="pointer-events-none"
                    type="checkbox"
                    id="irritable"
                    checked={psychosocialSymptoms?.includes("Irritable")}
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
      <div className={`${!safetyPlanComment && "hidePrint"}`}>
        <Row className="mb-2">
          <Col xs={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}
              >
                <p className="view-label fw-bold mb-1">
                  Resident Safety Plan to be completed within 48 hours of
                  admission{" "}
                </p>
              </div>
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}
              >
                <p className="view-label fw-bold mb-1">Comment : </p>
                <h5 className="view-value mb-0">{safetyPlanComment}</h5>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={`${!currentMedications && "hidePrint"}`}>
        <Row className="mb-2">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">
                  Current Medications :{" "}
                </p>
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
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfCurrentMedicationsOther && "hidePrint"}`}
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
        className={`${nutritionDiet !== "As tolerated" && nutritionDiet !== "Special diet" && "hidePrint"}`}
      >
        <Row className="mb-2">
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
                    checked={nutritionDiet?.includes("As tolerated")}
                  />
                  <Form.Check
                    inline
                    label="Special diet ordered"
                    className="pointer-events-none"
                    type="checkbox"
                    id="Special diet"
                    checked={nutritionDiet?.includes("Special diet")}
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
        className={`${nutritionFluidRestrictions !== true && nutritionFluidRestrictions !== false && "hidePrint"}`}
      >
        <Row className="mb-2">
          <Col xs={12} sm={12} lg={12}>
            <div className="view-details-grid d-block">
              <div
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 `}
              >
                <p className="view-label fw-bold mb-1">
                  Fluid restrictions? :{" "}
                </p>
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
                className={`view-details-grid-inline my-1 my-md-2 px-3 py-2 ${!reviewOfNutritionFluidRestrictionsOther && "hidePrint"}`}
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
      <Row className="mb-2">
        <Col xs={12} sm={12} lg={12}>
          <div className="view-details-grid d-block">
            <div className={`view-details-grid-inline my-1 my-md-2 px-3 py-2`}>
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
      <Row className="mt-2">
        <Col xs={12} sm={4} md={4} lg={3}>
          <Card body className="mb-3">
            <div className="main">
              <Form.Check
                inline
                className="pointer-events-none"
                type="checkbox"
                checked={front}
              />
              <div className="text-center w-100">
                <img
                  src={body1}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
              />
              <div className="text-center w-100">
                <img
                  src={body2}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
              />
              <div className="text-center w-100">
                <img
                  src={body3}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
              />
              <div className="text-center w-100">
                <img
                  src={body4}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
              />
              <div className="text-center w-100">
                <img
                  src={body5}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
              />
              <div className="text-center w-100">
                <img
                  src={body6}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
              />
              <div className="text-center w-100">
                <img
                  src={body7}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
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
                type="checkbox"
                checked={legRight}
                onChange={() => setLegRight(!legRight)}
              />
              <div className="text-center w-100">
                <img
                  src={body8}
                  alt=""
                  className="img-nursing w-[120px] h-[189px] mx-auto"
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className={`${!commentFigure && "hidePrint"}`}>
          <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
            <p className="view-label fw-bold mb-1">Comment : </p>
            <h5 className="view-value mb-0">{commentFigure}</h5>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={12} className="text-end">
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
        </Col>
      </Row>
      <Row className="hidePrint text-end">
        <Col xs={12} lg={12}>
          <p className="text-end mb-0">
            {signers?.map(
              (signer) =>
                signer.signature && (
                  <div key={signer.signerId}>
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
      <Row className="mt-3 text-center">
        <Col xs={12} md={12}>
          <div className="employee-btn-joiner hidePrint">
            <button
              className="employee_create_btn"
              type="button"
              onClick={print}
            >
              PRINT THIS FORM
            </button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ViewNursingAssessmentContentPart2;

/* eslint-disable no-unused-vars */
/** @format */
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import {
  frontBody,
  backBody,
  leftBody,
  rightBody,
  legs,
  frontLegs,
  leftLegs,
  rightLegs,
} from "@/assets/index";
import { CheckBoxMaker } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import DatePicker from "react-datepicker";
import {
  formatDateToMMDDYYYY,
  deletePermission,
  signatureFormat,
} from "@/utils/utils";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";

const NursingAssessmentFormContentPart2 = (props) => {
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
    reviewOfSystemsConstitutional,
    reviewOfSystemsEndocrine,
    reviewOfSystemsEndocrineOther,
    reviewOfSystemsGastrointestinal,
    reviewOfSystemsGenitourinary,
    reviewOfSystemsHeadNeckThroat,
    reviewOfSystemsIntegumentary,
    reviewOfSystemsMusculoskeletal,
    reviewOfSystemsMusculoskeletalOther,
    reviewOfSystemsAllergicImmunologic,
    reviewOfSystemsAllergicImmunologicOther,
    suicidalRiskAssessmentDeniesSymptomsBellow,
    reviewOfSuicidalRiskAssessmentOther,
    reviewOfPsychosocialSymptomsOther,
    reviewOfNutritionFluidRestrictionsOther,
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
    id,
    profileInfo,
    saveAsDrafIsNotEditableWithoutSigner,
    setShowSignatureResident,
    setReviewOfSystemsMusculoskeletalOther,
    setReviewOfSystemsPsychiatricOther,
    setReviewOfSystemsNeurologicOther,
    setReviewOfSystemsRespiratoryOther,
    setReviewOfSystemsAllergicImmunologicOther,
    setSuicidalRiskAssessmentDeniesSymptomsBellow,
    setReviewOfSuicidalRiskAssessmentOther,
    setReviewOfPsychosocialSymptomsOther,
    setCurrentMedications,
    setNutritionFluidRestrictions,
    setReviewOfNutritionFluidRestrictionsOther,
    setLegRight,
    setBack,
    setFront,
    setLegBack,
    setLegFront,
    setLegLeft,
    setSideLeft,
    setSideRight,
    setNutritionDiet,
    setSkinCheck,
    setCommentFigure,
    setSafetyPlanComment,
    setReviewOfBehavioralSymptomsOther,
    setReviewOfPhysicalSymptomsOther,
    setReviewOfCurrentMedicationsOther,
    setReviewOfSkinCheckOther,
    setReviewOfNutritionDietOther,
    setSigners,
  } = props;

  return (
    <>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Musculoskeletal: </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsMusculoskeletalOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="programlocation&address"
                value={reviewOfSystemsMusculoskeletalOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsMusculoskeletalOther(e.target.value)
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
              <Form.Label className="fw-bold">Psychiatric: </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesPsychiatric"
                  checked={reviewOfSystemsPsychiatric?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsPsychiatric("DENIES")}
                />
                <Form.Check
                  inline
                  label="Insomnia"
                  type="checkbox"
                  id="insomnia"
                  checked={reviewOfSystemsPsychiatric?.includes("Insomnia")}
                  onChange={() => handlereviewOfSystemsPsychiatric("Insomnia")}
                />
                <Form.Check
                  inline
                  label="Irritability"
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
                  type="checkbox"
                  id="anxiety"
                  checked={reviewOfSystemsPsychiatric?.includes("Anxiety")}
                  onChange={() => handlereviewOfSystemsPsychiatric("Anxiety")}
                />
                <Form.Check
                  inline
                  label="Recurrent bad thoughts"
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
                  label="Compulsions"
                  type="checkbox"
                  id="Compulsions"
                  checked={reviewOfSystemsPsychiatric?.includes("Compulsions")}
                  onChange={() =>
                    handlereviewOfSystemsPsychiatric("Compulsions")
                  }
                />
                <Form.Check
                  inline
                  label="N/A"
                  type="checkbox"
                  id="N/APsychiatric"
                  checked={reviewOfSystemsPsychiatric?.includes("N/A")}
                  onChange={() => handlereviewOfSystemsPsychiatric("N/A")}
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsPsychiatricOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                value={reviewOfSystemsPsychiatricOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsPsychiatricOther(e.target.value)
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
              <Form.Label className="fw-bold">Neurologic: </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesNeurologic"
                  checked={reviewOfSystemsNeurologic?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsNeurologic("DENIES")}
                />
                <Form.Check
                  inline
                  label="Weakness"
                  type="checkbox"
                  id="weakness"
                  checked={reviewOfSystemsNeurologic?.includes("Weakness")}
                  onChange={() => handlereviewOfSystemsNeurologic("Weakness")}
                />
                <Form.Check
                  inline
                  label="Headaches"
                  type="checkbox"
                  id="headaches"
                  checked={reviewOfSystemsNeurologic?.includes("Headaches")}
                  onChange={() => handlereviewOfSystemsNeurologic("Headaches")}
                />
                <Form.Check
                  inline
                  label="Scalp tenderness"
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
                  type="checkbox"
                  id="dizziness"
                  checked={reviewOfSystemsNeurologic?.includes("Dizziness")}
                  onChange={() => handlereviewOfSystemsNeurologic("Dizziness")}
                />
                <Form.Check
                  inline
                  label="Problems with balance"
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
                  type="checkbox"
                  id="tremor"
                  checked={reviewOfSystemsNeurologic?.includes("Tremor")}
                  onChange={() => handlereviewOfSystemsNeurologic("Tremor")}
                />
                <Form.Check
                  inline
                  label="Stroke"
                  type="checkbox"
                  id="stroke"
                  checked={reviewOfSystemsNeurologic?.includes("Stroke")}
                  onChange={() => handlereviewOfSystemsNeurologic("Stroke")}
                />
                <Form.Check
                  inline
                  label="Numbness or tingling"
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
                  type="checkbox"
                  id="fainting"
                  checked={reviewOfSystemsNeurologic?.includes("Fainting")}
                  onChange={() => handlereviewOfSystemsNeurologic("Fainting")}
                />
                <Form.Check
                  inline
                  label="Problems walking"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsNeurologicOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsNeurologicOther"
                value={reviewOfSystemsNeurologicOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsNeurologicOther(e.target.value)
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
              <Form.Label className="fw-bold">Respiratory: </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
                  type="checkbox"
                  id="deniesRespiratory"
                  checked={reviewOfSystemsRespiratory?.includes("DENIES")}
                  onChange={() => handlereviewOfSystemsRespiratory("DENIES")}
                />
                <Form.Check
                  inline
                  label="Excess thirst"
                  type="checkbox"
                  id="wheezing"
                  checked={reviewOfSystemsRespiratory?.includes("Wheezing")}
                  onChange={() => handlereviewOfSystemsRespiratory("Wheezing")}
                />
                <Form.Check
                  inline
                  label="Cough"
                  type="checkbox"
                  id="cough"
                  checked={reviewOfSystemsRespiratory?.includes("Cough")}
                  onChange={() => handlereviewOfSystemsRespiratory("Cough")}
                />
                <Form.Check
                  inline
                  label="Coughing up blood"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsRespiratoryOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsRespiratoryOther"
                value={reviewOfSystemsRespiratoryOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsRespiratoryOther(e.target.value)
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
                Allergic/Immunologic:{" "}
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="DENIES"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSystemsAllergicImmunologicOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfSystemsAllergicImmunologicOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSystemsAllergicImmunologicOther(e.target.value)
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
                Suicidal Risk Assessment
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Denies symptoms below"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSuicidalRiskAssessmentOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfSuicidalRiskAssessmentOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfSuicidalRiskAssessmentOther(e.target.value)
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
              <Form.Label className="fw-bold">Behavioral symptoms: </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Self-injuring"
                  type="checkbox"
                  id="selfInjuring"
                  checked={behavioralSymptoms?.includes("self-injuring")}
                  onChange={() => handlebehavioralSymptoms("self-injuring")}
                />
                <Form.Check
                  inline
                  label="Reckless behavior"
                  type="checkbox"
                  id="recklessBehavior"
                  checked={behavioralSymptoms?.includes("reckless behavior")}
                  onChange={() => handlebehavioralSymptoms("reckless behavior")}
                />
                <Form.Check
                  inline
                  label="Impulsive behaviors"
                  type="checkbox"
                  id="impulsiveBehaviors"
                  checked={behavioralSymptoms?.includes("impulsive behaviors")}
                  onChange={() =>
                    handlebehavioralSymptoms("impulsive behaviors")
                  }
                />
                <Form.Check
                  inline
                  label="Shifts in temperament"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfBehavioralSymptomsOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfBehavioralSymptomsOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfBehavioralSymptomsOther(e.target.value)
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
              <Form.Label className="fw-bold">Physical symptoms</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Insomnia"
                  type="checkbox"
                  id="insomniap"
                  checked={physicalSymptoms?.includes("insomnia")}
                  onChange={() => handlephysicalSymptoms("insomnia")}
                />
                <Form.Check
                  inline
                  label="Hypersomnia"
                  type="checkbox"
                  id="hypersomnia"
                  checked={physicalSymptoms?.includes("hypersomnia")}
                  onChange={() => handlephysicalSymptoms("hypersomnia")}
                />
                <Form.Check
                  inline
                  label="Changes in appetite"
                  type="checkbox"
                  id="changesInAppetite"
                  checked={physicalSymptoms?.includes("changes in appetite")}
                  onChange={() => handlephysicalSymptoms("changes in appetite")}
                />
                <Form.Check
                  inline
                  label="Weight loss/gain"
                  type="checkbox"
                  id="weightLossGain"
                  checked={physicalSymptoms?.includes("weight loss/gain")}
                  onChange={() => handlephysicalSymptoms("weight loss/gain")}
                />
                <Form.Check
                  inline
                  label="Panic attacks"
                  type="checkbox"
                  id="panicAttacks"
                  checked={physicalSymptoms?.includes("panic attacks")}
                  onChange={() => handlephysicalSymptoms("panic attacks")}
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfPhysicalSymptomsOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfPhysicalSymptomsOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfPhysicalSymptomsOther(e.target.value)
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
              <Form.Label className="fw-bold">Psychosocial symptoms</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Helplessness"
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
                  type="checkbox"
                  id="worthlessness"
                  checked={psychosocialSymptoms?.includes("worthlessness")}
                  onChange={() => handlerepsychosocialSymptoms("worthlessness")}
                />
                <Form.Check
                  inline
                  label="Depression"
                  type="checkbox"
                  id="depressionPsychosocial "
                  checked={psychosocialSymptoms?.includes("depression")}
                  onChange={() => handlerepsychosocialSymptoms("depression")}
                />
                <Form.Check
                  inline
                  label="Anxiety"
                  type="checkbox"
                  id="anxietyPsychosocial "
                  checked={psychosocialSymptoms?.includes("anxiety")}
                  onChange={() => handlerepsychosocialSymptoms("anxiety")}
                />
                <Form.Check
                  inline
                  label="Mood swings"
                  type="checkbox"
                  id="moodSwingsPsychosocial "
                  checked={psychosocialSymptoms?.includes("mood swings")}
                  onChange={() => handlerepsychosocialSymptoms("mood swings")}
                />
                <Form.Check
                  inline
                  label="Irritable"
                  type="checkbox"
                  id="irritablePsychosocial "
                  checked={psychosocialSymptoms?.includes("Irritable")}
                  onChange={() => handlerepsychosocialSymptoms("Irritable")}
                />
                <Form.Check
                  inline
                  label="Resident contracts for safety"
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfPsychosocialSymptomsOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfPsychosocialSymptomsOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfPsychosocialSymptomsOther(e.target.value)
                }
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!safetyPlanComment && "hidePrint"}`}
          >
            <Form.Label className="fw-bold">
              Resident Safety Plan to be completed within 48 hours of admission
            </Form.Label>
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                value={safetyPlanComment}
                placeholder="Enter text"
                cols={82}
                onChange={(e) => setSafetyPlanComment(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Current Medications</Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Verified that a list of current medications is present on file."
                  id="currentMedications"
                  type="checkbox"
                  checked={currentMedications}
                  onChange={() => setCurrentMedications(!currentMedications)}
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfCurrentMedicationsOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfCurrentMedicationsOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfCurrentMedicationsOther(e.target.value)
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
              <Form.Label className="fw-bold">Nutrition Diet: </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="As tolerated"
                  type="checkbox"
                  id="As tolerated"
                  checked={nutritionDiet?.includes("As tolerated")}
                  onChange={() => handleMultiNutritionDiet("As tolerated")}
                />
                <Form.Check
                  inline
                  label="Special diet ordered"
                  type="checkbox"
                  id="Special diet"
                  checked={nutritionDiet?.includes("Special diet")}
                  onChange={() => handleMultiNutritionDiet("Special diet")}
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfNutritionDietOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfNutritionDietOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) => setReviewOfNutritionDietOther(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Card body className="mb-3">
        <Row>
          <Col xs={12} sm={12} lg={12}>
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Fluid restrictions?</Form.Label>
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
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfNutritionFluidRestrictionsOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfNutritionFluidRestrictionsOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) =>
                  setReviewOfNutritionFluidRestrictionsOther(e.target.value)
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
                Skin Check - Areas requiring treatment marked and labeled
              </Form.Label>
              <div className="radio-inline">
                <Form.Check
                  inline
                  label="Resident denies skin concerns"
                  type="checkbox"
                  id="Resident denies skin concerns"
                  checked={skinCheck === true ? true : false}
                  onChange={(e) => setSkinCheck(Boolean(e.target.value))}
                />
              </div>
            </Form.Group>
          </Col>
          <Col
            xs={12}
            sm={12}
            lg={12}
            className={`${!reviewOfSkinCheckOther && "hidePrint"}`}
          >
            <Form.Group>
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                id="reviewOfSystemsAllergicImmunologicOther"
                value={reviewOfSkinCheckOther}
                placeholder="Enter text"
                as="textarea"
                cols={82}
                onChange={(e) => setReviewOfSkinCheckOther(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Card>
      <Row>
        {imagesPair?.map((i, index) => (
          <Col xs={12} sm={4} md={4} lg={3} key={`imageCol${index}`}>
            <Card body className="mb-3">
              <div className="main">
                <CheckBoxMaker
                  setValue={i.setValue}
                  value={!i.value}
                  id={`${i.title}`}
                  label={""}
                  checked={i.value}
                />
                <div className="text-center w-100" htmlFor={`${i.title}`}>
                  <img
                    src={i.img}
                    className="img-nursing w-[120px] h-[189px] my-0 mx-auto"
                    alt=""
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col xs={12} className={`${!commentFigure && "hidePrint"}`}>
          <Card body className="mb-3">
            <Form.Group className="form-group form-mob-label-margin mb-3">
              <Form.Label className="fw-bold">Comment</Form.Label>
              <Form.Control
                as="textarea"
                value={commentFigure}
                placeholder="Enter Comment"
                onChange={(e) => setCommentFigure(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6} className="d-flex align-items-start">
          <Button
            type="button"
            className={`theme-button me-2 hidePrint inline-block ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"} inline-block`}
            onClick={() => setShowSingInTwo(true)}
          >
            SAVED AND SIGNED
          </Button>
        </Col>
        <Col xs={12} lg={6} className="text-end">
          {signatureFormat({
            sign: rnSignature,
            time: rnTime,
            date: rnDate,
            hoursFormat,
          })}
          {signatureFormat({
            sign: adminSignature,
            date: adminSignatureDate,
            time: adminSignatureTime,
            hoursFormat,
          })}

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
        </Col>
      </Row>

      {!id && (
        <Row className="hidePrint mt-3">
          <Col xs={12} lg={12}>
            <Form.Group className="form-group form-print-group mb-3">
              <Form.Label className="fw-bold">Signers</Form.Label>
              <MultiEmployee
                alsoResident
                setValue={setSigners}
                value={signers}
              />
            </Form.Group>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12}>
          <div className="employee_btn_div hidePrint">
            <button
              className={`employee_create_btn ${!saveAsDrafIsNotEditableWithoutSigner && "pointer-events-auto"}`}
              type="submit"
              disabled={
                id
                  ? !isSubmitEnabled
                  : profileInfo?.userType === ROLES.ADMIN
                    ? false
                    : rnSignature?.length === 0
              }
            >
              {loading ? <ClipLoader color="#fff" /> : "SUBMIT DETAILS"}
            </button>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NursingAssessmentFormContentPart2;

/* eslint-disable no-unused-vars */
/** @format */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { residentService } from "@/features/shared/services/index";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { signatureFormat } from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { intakeService } from "@/features/shared/services/index";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { ROLES } from "@/features/shared/constants/index";
import { EMPLOYEE_APIS } from "@/features/shared/services/index";
export const useNursingAssessmentLogic = () => {
  const [loading, setLoading] = useState(false);
  const [safetyPlanComment, setSafetyPlanComment] = useState("");
  const [draftModel, setDraftModel] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [getApiData, setGetApiData] = useState("");
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
      profile,
    ),
    pageStyle: `
    @page {
      margin: 12mm 9mm!important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .heading-nas {
      page-break-inside: avoid;
    }
    .table-row-hide-print{
      display:none;
    }
  `,
  });
  const navigate = useNavigate();
  const [filedForm, setFiledForm] = useState("");
  const [employ, setEmploy] = useState([]);
  const [userDetail, setUserDetail] = useState("");

  //all useState value
  const { id } = useParams();
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  const [userId, setUserId] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [sex, setSex] = useState("");
  const [admissionDiagnoses, setAdmissionDiagnoses] = useState("");
  const [codeStatus, setCodeStatus] = useState([]);
  const [lastTBScreeningDate, setLastTBScreeningDate] = useState("");
  const [tbScreeningResults, setTbScreeningResults] = useState([]);
  const [careProvidedPhysicalServices, setCareProvidedPhysicalServices] =
    useState([]);
  const [vitalsBloodPressure, setVitalsBloodPressure] = useState("");
  const [vitalsPulse, setVitalsPulse] = useState();
  const [vitalsRespiratoryRate, setVitalsRespiratoryRate] = useState();
  const [vitalsOxygenLevel, setVitalsOxygenLevel] = useState();
  const [vitalsTemperature, setVitalsTemperature] = useState();
  const [vitalsWeight, setVitalsWeight] = useState();
  const [vitalsHeightFeet, setVitalsHeightFeet] = useState();
  const [vitalsHeightInches, setVitalsHeightInches] = useState();
  const [allergies, setAllergies] = useState("");
  const [reviewOfSystemsConstitutional, setReviewOfSystemsConstitutional] =
    useState([]);
  const [
    reviewOfSystemsConstitutionalOther,
    setReviewOfSystemsConstitutionalOther,
  ] = useState("");
  const [reviewOfSystemsCardiovascular, setReviewOfSystemsCardiovascular] =
    useState([]);
  const [cardiovascularBloodPressure, setCardiovascularBloodPressure] =
    useState("");
  const [
    reviewOfSystemsCardiovascularOther,
    setReviewOfSystemsCardiovascularOther,
  ] = useState("");
  const [reviewOfSystemsEndocrine, setReviewOfSystemsEndocrine] = useState([]);
  const [endocrineBloodSuger, setEndocrineBloodSuger] = useState("");
  const [reviewOfSystemsEndocrineOther, setReviewOfSystemsEndocrineOther] =
    useState("");
  const [reviewOfSystemsGastrointestinal, setReviewOfSystemsGastrointestinal] =
    useState([]);
  const [
    reviewOfSystemsGastrointestinalOther,
    setReviewOfSystemsGastrointestinalOther,
  ] = useState("");
  const [reviewOfSystemsGenitourinary, setReviewOfSystemsGenitourinary] =
    useState([]);
  const [
    reviewOfSystemsGenitourinaryOther,
    setReviewOfSystemsGenitourinaryOther,
  ] = useState("");
  const [
    reviewOfSystemsHematologyOncology,
    setReviewOfSystemsHematologyOncology,
  ] = useState([]);
  const [
    reviewOfSystemsHematologyOncologyOther,
    setReviewOfSystemsHematologyOncologyOther,
  ] = useState("");
  const [reviewOfSystemsHeadNeckThroat, setReviewOfSystemsHeadNeckThroat] =
    useState([]);
  const [
    reviewOfSystemsHeadNeckThroatOther,
    setReviewOfSystemsHeadNeckThroatOther,
  ] = useState("");
  const [reviewOfSystemsIntegumentary, setReviewOfSystemsIntegumentary] =
    useState([]);
  const [
    reviewOfSystemsIntegumentaryOther,
    setReviewOfSystemsIntegumentaryOther,
  ] = useState("");
  const [reviewOfSystemsMusculoskeletal, setReviewOfSystemsMusculoskeletal] =
    useState([]);
  const [
    reviewOfSystemsMusculoskeletalOther,
    setReviewOfSystemsMusculoskeletalOther,
  ] = useState("");
  const [reviewOfSystemsPsychiatric, setReviewOfSystemsPsychiatric] = useState(
    [],
  );
  const [reviewOfSystemsPsychiatricOther, setReviewOfSystemsPsychiatricOther] =
    useState("");
  const [reviewOfSystemsNeurologic, setReviewOfSystemsNeurologic] = useState(
    [],
  );
  const [reviewOfSystemsNeurologicOther, setReviewOfSystemsNeurologicOther] =
    useState("");
  const [reviewOfSystemsRespiratory, setReviewOfSystemsRespiratory] = useState(
    [],
  );
  const [reviewOfSystemsRespiratoryOther, setReviewOfSystemsRespiratoryOther] =
    useState("");
  const [
    reviewOfSystemsAllergicImmunologic,
    setReviewOfSystemsAllergicImmunologic,
  ] = useState([]);
  const [
    reviewOfSystemsAllergicImmunologicOther,
    setReviewOfSystemsAllergicImmunologicOther,
  ] = useState("");
  const [
    suicidalRiskAssessmentDeniesSymptomsBellow,
    setSuicidalRiskAssessmentDeniesSymptomsBellow,
  ] = useState(false);
  const [behavioralSymptoms, setBehavioralSymptoms] = useState([]);
  const [physicalSymptoms, setPhysicalSymptoms] = useState([]);
  const [psychosocialSymptoms, setPsychosocialSymptoms] = useState([]);
  const [currentMedications, setCurrentMedications] = useState(false);
  const [nutritionDiet, setNutritionDiet] = useState("");
  const [nutritionSpecialDietOrder, setNutritionSpecialDietOrder] =
    useState("");
  const [nutritionFluidRestrictions, setNutritionFluidRestrictions] =
    useState();
  const [skinCheck, setSkinCheck] = useState(false);
  const [residentDeniesSkinConcerns, setResidentDeniesSkinConcerns] =
    useState(false);
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  const [sideLeft, setSideLeft] = useState(false);
  const [sideRight, setSideRight] = useState(false);
  const [legFront, setLegFront] = useState(false);
  const [legBack, setLegBack] = useState(false);
  const [legLeft, setLegLeft] = useState(false);
  const [legRight, setLegRight] = useState(false);
  const [commentFigure, setCommentFigure] = useState("");
  const [bhtName, setBhtName] = useState("");
  const [bhtSignature, setBhtSignature] = useState("");
  const [bhtDate, setbhtDate] = useState("");
  const [bhpTime, setBhpTime] = useState("");
  const [rnName, setRnName] = useState("");
  const [rnSignature, setRnSignature] = useState("");
  const [rnDate, setrnDate] = useState("");
  const [rnTime, setRnTime] = useState("");
  const [signers, setSigners] = useState([]);
  const [showSignatureResident, setShowSignatureResident] = useState(false);
  const [
    reviewOfSuicidalRiskAssessmentOther,
    setReviewOfSuicidalRiskAssessmentOther,
  ] = useState("");
  const [reviewOfBehavioralSymptomsOther, setReviewOfBehavioralSymptomsOther] =
    useState("");
  const [reviewOfPhysicalSymptomsOther, setReviewOfPhysicalSymptomsOther] =
    useState("");
  const [
    reviewOfPsychosocialSymptomsOther,
    setReviewOfPsychosocialSymptomsOther,
  ] = useState("");
  const [reviewOfCurrentMedicationsOther, setReviewOfCurrentMedicationsOther] =
    useState("");
  const [reviewOfNutritionDietOther, setReviewOfNutritionDietOther] =
    useState("");
  const [
    reviewOfNutritionFluidRestrictionsOther,
    setReviewOfNutritionFluidRestrictionsOther,
  ] = useState("");
  const [reviewOfSkinCheckOther, setReviewOfSkinCheckOther] = useState("");
  useEffect(() => {
    if (getApiData) {
      setSafetyPlanComment(getApiData?.safetyPlanComment || "");
      setSaveAsDraft(getApiData?.saveAsDraft);
      setResidentName(
        `${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}`,
      );
      setDateOfBirth(
        getApiData?.patientId?.dateOfBirth
          ? getApiData?.patientId?.dateOfBirth?.slice(0, 10)
          : "",
      );
      setAge(getApiData?.age);
      setAhcccsId(getApiData?.patientId?.ahcccsId);
      setSex(getApiData?.patientId?.gender);
      setAdmissionDate(
        getApiData?.patientId?.admitDate
          ? getApiData?.patientId?.admitDate.slice(0, 10)
          : "",
      );
      setTodayDate(getApiData?.todayDate ? getApiData?.todayDate : "");
      setAdmissionDiagnoses(getApiData?.patientId?.diagnosis);
      setCodeStatus(getApiData?.codeStatus ? getApiData?.codeStatus : []);
      setLastTBScreeningDate(
        getApiData?.lastTBScreeningDate
          ? getApiData.lastTBScreeningDate.slice(0, 10)
          : "",
      );
      setTbScreeningResults(getApiData?.tbScreeningResults?.split(",") ?? []);
      setCareProvidedPhysicalServices(
        getApiData?.careProvided ? getApiData?.careProvided : [],
      );
      setVitalsBloodPressure(getApiData?.vitalsBloodPressure);
      setVitalsPulse(getApiData?.vitalsPulse);
      setVitalsRespiratoryRate(getApiData?.vitalsRespiratoryRate);
      setVitalsOxygenLevel(getApiData?.vitalsOxygenLevel);
      setVitalsTemperature(getApiData?.vitalsTemperature);
      setVitalsWeight(getApiData?.vitalsWeight);
      setVitalsHeightFeet(getApiData?.vitalsHeightFeet);
      setVitalsHeightInches(getApiData?.vitalsHeightInches);
      setAllergies(getApiData?.allergies);
      setReviewOfSuicidalRiskAssessmentOther(
        getApiData?.reviewOfSuicidalRiskAssessmentOther,
      );
      setReviewOfBehavioralSymptomsOther(
        getApiData?.reviewOfBehavioralSymptomsOther,
      );
      setReviewOfPhysicalSymptomsOther(
        getApiData?.reviewOfPhysicalSymptomsOther,
      );
      setReviewOfPsychosocialSymptomsOther(
        getApiData?.reviewOfPsychosocialSymptomsOther,
      );
      setReviewOfCurrentMedicationsOther(
        getApiData?.reviewOfCurrentMedicationsOther,
      );
      setReviewOfNutritionDietOther(getApiData?.reviewOfNutritionDietOther);
      setReviewOfNutritionFluidRestrictionsOther(
        getApiData?.reviewOfNutritionFluidRestrictionsOther,
      );
      setReviewOfSkinCheckOther(getApiData?.reviewOfSkinCheckOther);
      setReviewOfSystemsConstitutional(
        getApiData?.reviewOfSystemsConstitutional,
      );
      setReviewOfSystemsConstitutionalOther(
        getApiData?.reviewOfSystemsConstitutionalComment,
      );
      setReviewOfSystemsCardiovascular(
        getApiData?.reviewOfSystemsCardiovascular,
      );
      setReviewOfSystemsCardiovascularOther(
        getApiData?.reviewOfSystemsCardiovascularComment,
      );
      setReviewOfSystemsEndocrine(getApiData?.reviewOfSystemsEndocrine);
      setCardiovascularBloodPressure(getApiData?.cardiovascularBloodPressure);
      setEndocrineBloodSuger(getApiData?.endocrineBloodSuger);
      setReviewOfSystemsEndocrineOther(
        getApiData?.reviewOfSystemsEndocrineComment,
      );
      setReviewOfSystemsGastrointestinal(
        getApiData?.reviewOfSystemsGastrointestinal,
      );
      setReviewOfSystemsGastrointestinalOther(
        getApiData?.reviewOfSystemsGastrointestinalComment,
      );
      setReviewOfSystemsGenitourinary(getApiData?.reviewOfSystemsGenitourinary);
      setReviewOfSystemsGenitourinaryOther(
        getApiData?.reviewOfSystemsGenitourinaryComment,
      );
      setReviewOfSystemsHematologyOncology(
        getApiData?.reviewOfSystemsHematologyOncology,
      );
      setReviewOfSystemsHematologyOncologyOther(
        getApiData?.reviewOfSystemsHematologyOncologyomment,
      );
      setReviewOfSystemsHeadNeckThroat(
        getApiData?.reviewOfSystemsHeadNeckThroat,
      );
      setReviewOfSystemsHeadNeckThroatOther(
        getApiData?.reviewOfSystemsHeadNeckThroatComment,
      );
      setReviewOfSystemsIntegumentary(getApiData?.reviewOfSystemsIntegumentary);
      setReviewOfSystemsIntegumentaryOther(
        getApiData?.reviewOfSystemsIntegumentaryComment,
      );
      setReviewOfSystemsMusculoskeletal(
        getApiData?.reviewOfSystemsMusculoskeletal,
      );
      setReviewOfSystemsMusculoskeletalOther(
        getApiData?.reviewOfSystemsMusculoskeletalComment,
      );
      setReviewOfSystemsPsychiatric(getApiData?.reviewOfSystemsPsychiatric);
      setReviewOfSystemsPsychiatricOther(
        getApiData?.reviewOfSystemsPsychiatricComment,
      );
      setReviewOfSystemsNeurologic(getApiData?.reviewOfSystemsNeurologic);
      setReviewOfSystemsNeurologicOther(
        getApiData?.reviewOfSystemsNeurologicComment,
      );
      setReviewOfSystemsRespiratory(getApiData?.reviewOfSystemsRespiratory);
      setReviewOfSystemsRespiratoryOther(
        getApiData?.reviewOfSystemsRespiratoryComment,
      );
      setReviewOfSystemsAllergicImmunologic(
        getApiData?.reviewOfSystemsAllergicImmunologic,
      );
      setReviewOfSystemsAllergicImmunologicOther(
        getApiData?.reviewOfSystemsAllergicImmunologicComment,
      );
      setSuicidalRiskAssessmentDeniesSymptomsBellow(
        getApiData?.suicidalRiskAssessmentDeniesSymptomsBellow,
      );
      setBehavioralSymptoms(
        getApiData?.behavioralSymptoms ? getApiData?.behavioralSymptoms : [],
      );
      setPhysicalSymptoms(
        getApiData?.physicalSymptoms ? getApiData?.physicalSymptoms : [],
      );
      setPsychosocialSymptoms(
        getApiData?.psychosocialSymptoms
          ? getApiData?.psychosocialSymptoms
          : [],
      );
      setCurrentMedications(getApiData?.currentMedications);
      setNutritionDiet(getApiData?.nutritionDiet);
      setNutritionSpecialDietOrder(getApiData?.nutritionSpecialDietOrder);
      setNutritionFluidRestrictions(getApiData?.nutritionFluidRestrictions);
      setSkinCheck(getApiData?.skinCheck);
      setResidentDeniesSkinConcerns(getApiData?.residentDeniesSkinConcerns);
      setFront(getApiData?.front);
      setBack(getApiData?.back);
      setSideLeft(getApiData?.sideLeft);
      setSideRight(getApiData?.sideRight);
      setLegFront(getApiData?.legFront);
      setLegBack(getApiData?.legBack);
      setLegLeft(getApiData?.legLeft);
      setLegRight(getApiData?.legRight);
      setCommentFigure(getApiData?.legComment);
      setBhtName(getApiData?.bhtName?._id);
      setBhtSignature(getApiData?.bhtSignature);
      setbhtDate(getApiData?.bhpDate ? getApiData?.bhpDate : "");
      setBhpTime(getApiData?.bhpTime);
      setRnName(getApiData?.rnName?._id);
      setRnSignature(getApiData?.rnSignature);
      setrnDate(getApiData?.rnDate ? getApiData?.rnDate : "");
      setRnTime(getApiData?.rnTime);
      setSigners(getApiData?.signers);
      setAdminSignature(getApiData?.adminSignature);
      setAdminSignatureDate(getApiData?.adminSignatureDate);
      setAdminSignatureTime(getApiData?.adminSignatureTime);
    }
  }, [getApiData]);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: EMPLOYEE_APIS.EMPLOYEE_GETNURSINGASSESSMENTBYID(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
  }, [id]);
  useEffect(() => {
    setFiledForm(userDetail?.nursingAssessment);
    setUserId(userDetail?._id);
  }, [userDetail?._id, userDetail?.nursingAssessment]);
  useEffect(() => {
    if (profile) {
      setUserDetail(profile);
    }
  }, [profile]);
  useEffect(() => {
    residentService.getEmployeeDetails(setEmploy);
  }, []);
  const initialData = () => {
    setResidentName("");
    setSex("");
    setDateOfBirth("");
    setAge("");
    setUserId("");
    setAdmissionDate("");
    setSex("");
    setTodayDate("");
    setAdmissionDiagnoses("");
    setCodeStatus("");
    setLastTBScreeningDate("");
    setTbScreeningResults([]);
    setCareProvidedPhysicalServices("");
    setVitalsBloodPressure(0);
    setVitalsPulse(0);
    setVitalsRespiratoryRate(0);
    setVitalsOxygenLevel(0);
    setVitalsTemperature(0);
    setVitalsWeight(0);
    setVitalsHeightFeet(0);
    setVitalsHeightInches(0);
    setAllergies("");
    setReviewOfSystemsConstitutional([]);
    setCardiovascularBloodPressure("");
    setEndocrineBloodSuger("");
    setReviewOfSystemsConstitutionalOther("");
    setReviewOfSystemsCardiovascular([]);
    setReviewOfSystemsCardiovascularOther("");
    setReviewOfSystemsEndocrine([]);
    setReviewOfSystemsEndocrineOther("");
    setReviewOfSystemsGastrointestinal("");
    setReviewOfSystemsGenitourinary();
    setReviewOfSystemsGastrointestinalOther("");
    setReviewOfSystemsHematologyOncology([]);
    setReviewOfSystemsHematologyOncologyOther("");
    setReviewOfSystemsHeadNeckThroat([]);
    setReviewOfSystemsHeadNeckThroatOther("");
    setReviewOfSystemsIntegumentary([]);
    setReviewOfSystemsIntegumentaryOther("");
    setReviewOfSystemsMusculoskeletal([]);
    setReviewOfSystemsMusculoskeletalOther("");
    setReviewOfSystemsPsychiatric([]);
    setReviewOfSystemsPsychiatricOther("");
    setReviewOfSystemsNeurologic([]);
    setReviewOfSystemsNeurologicOther("");
    setReviewOfSystemsRespiratory([]);
    setReviewOfSystemsRespiratoryOther("");
    setReviewOfSystemsAllergicImmunologic([]);
    setReviewOfSystemsAllergicImmunologicOther("");
    setSuicidalRiskAssessmentDeniesSymptomsBellow(false);
    setBehavioralSymptoms("");
    setPhysicalSymptoms("");
    setPsychosocialSymptoms([]);
    setCurrentMedications("");
    setNutritionDiet("");
    setNutritionSpecialDietOrder("");
    setNutritionFluidRestrictions("");
    setSkinCheck(false);
    setResidentDeniesSkinConcerns(false);
    setFront("");
    setBack("");
    setSideLeft("");
    setSideRight("");
    setLegFront("");
    setLegBack("");
    setLegLeft("");
    setLegRight("");
    setCommentFigure("");
    setBhtName("");
    setBhtSignature("");
    setbhtDate("");
    setBhpTime("");
    setRnName("");
    setRnSignature("");
    setrnDate("");
    setRnTime("");
  };
  const handlePost = (e) => {
    e.preventDefault();
    const data = {
      patientId: userId,
      saveAsDraft,
      residentName,
      dateOfBirth,
      admissionDate,
      age,
      sex,
      todayDate,
      admissionDiagnoses,
      codeStatus,
      lastTBScreeningDate,
      tbScreeningResults: tbScreeningResults?.join(),
      careProvided: careProvidedPhysicalServices,
      vitalsBloodPressure,
      vitalsPulse,
      vitalsRespiratoryRate,
      vitalsOxygenLevel,
      vitalsTemperature,
      vitalsWeight,
      vitalsHeightFeet,
      vitalsHeightInches,
      allergies,
      reviewOfSystemsConstitutional,
      reviewOfSystemsConstitutionalComment: reviewOfSystemsConstitutionalOther,
      reviewOfSystemsCardiovascular,
      cardiovascularBloodPressure,
      reviewOfSystemsCardiovascularComment: reviewOfSystemsCardiovascularOther,
      reviewOfSystemsEndocrine,
      endocrineBloodSuger,
      reviewOfSystemsEndocrineComment: reviewOfSystemsEndocrineOther,
      reviewOfSystemsGastrointestinal,
      reviewOfSystemsGastrointestinalComment:
        reviewOfSystemsGastrointestinalOther,
      reviewOfSystemsGenitourinary,
      reviewOfSystemsGenitourinaryComment: reviewOfSystemsGenitourinaryOther,
      reviewOfSystemsHematologyOncology,
      reviewOfSystemsHematologyOncologyomment:
        reviewOfSystemsHematologyOncologyOther,
      reviewOfSystemsHeadNeckThroat,
      reviewOfSystemsHeadNeckThroatComment: reviewOfSystemsHeadNeckThroatOther,
      reviewOfSystemsIntegumentary: reviewOfSystemsIntegumentary,
      reviewOfSystemsIntegumentaryComment: reviewOfSystemsIntegumentaryOther,
      reviewOfSystemsMusculoskeletal,
      reviewOfSystemsMusculoskeletalComment:
        reviewOfSystemsMusculoskeletalOther,
      reviewOfSystemsPsychiatric,
      reviewOfSystemsPsychiatricComment: reviewOfSystemsPsychiatricOther,
      reviewOfSystemsNeurologic,
      reviewOfSystemsNeurologicComment: reviewOfSystemsNeurologicOther,
      reviewOfSystemsRespiratory,
      reviewOfSystemsRespiratoryComment: reviewOfSystemsRespiratoryOther,
      reviewOfSystemsAllergicImmunologic,
      reviewOfSystemsAllergicImmunologicComment:
        reviewOfSystemsAllergicImmunologicOther,
      suicidalRiskAssessmentDeniesSymptomsBellow,
      behavioralSymptoms,
      physicalSymptoms,
      psychosocialSymptoms,
      currentMedications,
      nutritionDiet,
      nutritionSpecialDietOrder,
      nutritionFluidRestrictions,
      skinCheck,
      residentDeniesSkinConcerns,
      front,
      back,
      sideLeft,
      sideRight,
      legFront,
      legBack,
      legLeft,
      legRight,
      legComment: commentFigure,
      bhtName,
      bhtSignature,
      bhtDate,
      bhpTime,
      rnName,
      rnSignature,
      rnDate,
      rnTime,
      signers,
    };
    intakeService.nursingAssessment.update(id, data, {
      setLoading,
      navigate,
    });
    initialData();
  };
  const handleData = () => {
    const data = {
      patientId: userId,
      saveAsDraft,
      residentName,
      dateOfBirth,
      admissionDate,
      age,
      sex,
      todayDate,
      admissionDiagnoses,
      codeStatus,
      lastTBScreeningDate,
      tbScreeningResults,
      careProvided: careProvidedPhysicalServices,
      vitalsBloodPressure,
      vitalsPulse,
      vitalsRespiratoryRate,
      vitalsOxygenLevel,
      vitalsTemperature,
      vitalsWeight,
      vitalsHeightFeet,
      vitalsHeightInches,
      allergies,
      reviewOfSystemsConstitutional,
      reviewOfSystemsConstitutionalComment: reviewOfSystemsConstitutionalOther,
      reviewOfSystemsCardiovascular,
      cardiovascularBloodPressure,
      reviewOfSystemsCardiovascularComment: reviewOfSystemsCardiovascularOther,
      reviewOfSystemsEndocrine,
      endocrineBloodSuger,
      reviewOfSystemsEndocrineComment: reviewOfSystemsEndocrineOther,
      reviewOfSystemsGastrointestinal,
      reviewOfSystemsGastrointestinalComment:
        reviewOfSystemsGastrointestinalOther,
      reviewOfSystemsGenitourinary,
      reviewOfSystemsGenitourinaryComment: reviewOfSystemsGenitourinaryOther,
      reviewOfSystemsHematologyOncology,
      reviewOfSystemsHematologyOncologyomment:
        reviewOfSystemsHematologyOncologyOther,
      reviewOfSystemsHeadNeckThroat,
      reviewOfSystemsHeadNeckThroatComment: reviewOfSystemsHeadNeckThroatOther,
      reviewOfSystemsIntegumentary: reviewOfSystemsIntegumentary,
      reviewOfSystemsIntegumentaryComment: reviewOfSystemsIntegumentaryOther,
      reviewOfSystemsMusculoskeletal,
      reviewOfSystemsMusculoskeletalComment:
        reviewOfSystemsMusculoskeletalOther,
      reviewOfSystemsPsychiatric,
      reviewOfSystemsPsychiatricComment: reviewOfSystemsPsychiatricOther,
      reviewOfSystemsNeurologic,
      reviewOfSystemsNeurologicComment: reviewOfSystemsNeurologicOther,
      reviewOfSystemsRespiratory,
      reviewOfSystemsRespiratoryComment: reviewOfSystemsRespiratoryOther,
      reviewOfSystemsAllergicImmunologic,
      reviewOfSystemsAllergicImmunologicComment:
        reviewOfSystemsAllergicImmunologicOther,
      suicidalRiskAssessmentDeniesSymptomsBellow,
      behavioralSymptoms,
      physicalSymptoms,
      psychosocialSymptoms,
      currentMedications,
      nutritionDiet,
      nutritionSpecialDietOrder,
      nutritionFluidRestrictions,
      skinCheck,
      residentDeniesSkinConcerns,
      front,
      back,
      sideLeft,
      sideRight,
      legFront,
      legBack,
      legLeft,
      legRight,
      legComment: commentFigure,
      bhtName,
      bhtSignature,
      bhtDate,
      bhpTime,
      rnName,
      rnSignature,
      rnDate,
      rnTime,
      signers,
    };
    intakeService.nursingAssessment.update(id, data, {
      setLoading,
      navigate,
    });
  };
  const handleSaveAsDraft = () => {
    setSaveAsDraft(!saveAsDraft);
  };
  const careProvidedPhysicalServicesHandler = (status) => {
    if (careProvidedPhysicalServices.includes(status)) {
      // If selected, remove it from the array
      setCareProvidedPhysicalServices((prevStatus) =>
        prevStatus.filter((item) => item !== status),
      );
    } else {
      // If not selected, add it to the array
      setCareProvidedPhysicalServices((prevStatus) => [...prevStatus, status]);
    }
  };

  // status code
  const handleCodeStatusChange = (status) => {
    if (codeStatus.includes(status)) {
      // If selected, remove it from the array
      setCodeStatus((prevStatus) =>
        prevStatus.filter((item) => item !== status),
      );
    } else {
      setCodeStatus((prevStatus) => [...prevStatus, status]);
    }
  };
  const handlereviewOfSystemsConstitutional = (symptom) => {};
  const handlereviewOfSystemsCardiovascular = (symptom) => {
    return reviewOfSystemsCardiovascular?.includes(symptom);
  };
  const handlereviewOfSystemsEndocrine = (symptom) => {};
  const handlereviewOfSystemsGastrointestinal = (symptom) => {};
  const handlereviewOfSystemsGenitourinary = (symptom) => {};
  const handlereviewOfSystemsHematologyOncology = (symptom) => {};
  const handlereviewOfSystemsHeadNeckThroat = (symptom) => {};
  const handlereviewOfSystemsIntegumentary = (symptom) => {};
  const handlereviewOfSystemsMusculoskeletal = (symptom) => {};
  const handlereviewOfSystemsPsychiatric = (symptom) => {};
  const handlereviewOfSystemsNeurologic = (symptom) => {};
  const handlereviewOfSystemsRespiratory = (symptom) => {};
  const handlereviewOfSystemsAllergicImmunologic = (symptom) => {};

  // changes ====>
  const handlebehavioralSymptoms = (symptom) => {};
  const handlephysicalSymptoms = (symptom) => {};
  const handlerepsychosocialSymptoms = (symptom) => {};
  const profileInfo = useSelector(userProfile);
  let signerIndex = signers?.findIndex?.(
    (signer, i) =>
      signer.signerId === profileInfo._id ||
      profileInfo?.patientsAssigned?.includes(signer.signerId),
  );
  if (signerIndex === undefined || signerIndex === null) signerIndex = -1;
  function setSignerSignature(sign) {
    if (signerIndex !== -1)
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signature: sign,
        };
        return newSigners;
      });
  }
  function setSignerDate(date) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          dateSigned: date,
        };
        return newSigners;
      });
    }
  }
  function setSignerTime(time) {
    if (signerIndex !== -1) {
      setSigners((signers) => {
        const newSigners = [...signers];
        newSigners[signerIndex] = {
          ...newSigners[signerIndex],
          signedTime: time,
        };
        return newSigners;
      });
    }
  }

  return {
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
    handlePrint,
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
    hoursFormat,
    id,
    initialData,
    lastTBScreeningDate,
    legBack,
    legFront,
    legLeft,
    legRight,
    loading,
    navigate,
    nutritionDiet,
    nutritionFluidRestrictions,
    nutritionSpecialDietOrder,
    physicalSymptoms,
    profile,
    psychosocialSymptoms,
    residentDeniesSkinConcerns,
    residentName,
    reviewOfBehavioralSymptomsOther,
    reviewOfCurrentMedicationsOther,
    reviewOfNutritionDietOther,
    reviewOfNutritionFluidRestrictionsOther,
    reviewOfPsychosocialSymptomsOther,
    reviewOfSuicidalRiskAssessmentOther,
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
    reviewOfSystemsAllergicImmunologic,
    reviewOfSystemsAllergicImmunologicOther,
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
    setDraftModel,
    setGetApiData,
    setLoading,
    setShowSignatureResident,
    setSex,
    setTbScreeningResults,
    setBack,
    setFront,
    setLegBack,
    setLegFront,
    setLegLeft,
    setLegRight,
    setSideLeft,
    setSideRight,
    setCurrentMedications,
    setNutritionDiet,
    setNutritionFluidRestrictions,
    setSkinCheck,
    setSuicidalRiskAssessmentDeniesSymptomsBellow,
    suicidalRiskAssessmentDeniesSymptomsBellow,
    sex,
    showSignatureResident,
    sideLeft,
    sideRight,
    signers,
    skinCheck,
    tbScreeningResults,
    todayDate,
    userDetail,
    userId,
    setSignerSignature,
    setSignerDate,
    setSignerTime,
    vitalsBloodPressure,
    vitalsHeightFeet,
    vitalsHeightInches,
    vitalsOxygenLevel,
    vitalsPulse,
    vitalsRespiratoryRate,
    vitalsTemperature,
    vitalsWeight,
    setRnSignature,
    setrnDate,
    setRnTime,
    setBhtName,
    setBhtSignature,
    setbhtDate,
    setBhpTime,
    setRnName,
  };
};

/* eslint-disable no-unused-vars, no-dupe-keys */
/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  intakeService,
  patientService,
} from "@/features/shared/services/index";
import {
  AddSignature,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { CheckBoxMaker } from "@/utils/Makers";
import { ClipLoader } from "react-spinners";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { Button, Card, Container, Row, Col, Form } from "react-bootstrap";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import DatePicker from "react-datepicker";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import {
  downloadReport,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/index";
export const useNursingAssessmentFormLogic = () => {
  const url = useLocation().pathname;
  const [signers, setSigners] = useState([]);
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [safetyPlanComment, setSafetyPlanComment] = useState("");
  const [signatureModals, setSignatureModals] = useState({
    showSingInOne: false,
    showSingInTwo: false,
  });
  const setShowSingInOne = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        showSingInOne: v(prev.showSingInOne),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, showSingInOne: v }));
    }
  };
  const setShowSingInTwo = (v) => {
    if (typeof v === "function") {
      setSignatureModals((prev) => ({
        ...prev,
        showSingInTwo: v(prev.showSingInTwo),
      }));
    } else {
      setSignatureModals((prev) => ({ ...prev, showSingInTwo: v }));
    }
  };
  const showSingInOne = signatureModals.showSingInOne;
  const showSingInTwo = signatureModals.showSingInTwo;
  const [employ, setEmploy] = useState([]);
  const [getApiData, setGetApiData] = useState("");
  const [userDetail, setUserDetail] = useState({});
  const [userId, setUserId] = useState("");
  const [todayDate, setTodayDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [admissionDate, setAdmissionDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
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
  const [
    reviewOfSystemsCardiovascularOther,
    setReviewOfSystemsCardiovascularOther,
  ] = useState("");
  const [reviewOfSystemsEndocrine, setReviewOfSystemsEndocrine] = useState([]);
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
  const [behavioralSymptoms, setBehavioralSymptoms] = useState([]);
  const [physicalSymptoms, setPhysicalSymptoms] = useState([]);
  const [psychosocialSymptoms, setPsychosocialSymptoms] = useState([]);
  const [currentMedications, setCurrentMedications] = useState(false);
  const [nutritionDiet, setNutritionDiet] = useState("As tolerated");
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
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [residentName, setResidentName] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  useEffect(() => {
    if (getApiData) {
      let item;
      if (
        Array.isArray(getApiData?.data) &&
        getApiData?.data.length > 0 &&
        url === "/nursing-assessment"
      ) {
        item = getApiData?.data[0];
      } else {
        item = getApiData?.data;
      }
      if (item) {
        setPatientId(
          item?.patientId?._id || item?.patientId || patientDetail?._id,
        );
        setTodayDate(
          item?.createdAt
            ? formatDateWithoutUTCHandleToMMDDYYYY(item?.createdAt)
            : "",
        );
        if (url !== "/nursing-assessment") {
          setAdmissionDate(item?.patientId?.admitDate);
          setDateOfBirth(item?.patientId?.dateOfBirth);
          setSex(item?.patientId?.gender);
        }
        setCodeStatus(item?.codeStatus ? item?.codeStatus : []);
        setLastTBScreeningDate(item?.lastTBScreeningDate);
        setTbScreeningResults(item?.tbScreeningResults?.split(",") ?? []);
        setCareProvidedPhysicalServices(
          item?.careProvided ? item?.careProvided : [],
        );
        setVitalsBloodPressure(item?.vitalsBloodPressure);
        setVitalsPulse(item?.vitalsPulse);
        setVitalsRespiratoryRate(item?.vitalsRespiratoryRate);
        setVitalsOxygenLevel(item?.vitalsOxygenLevel);
        setVitalsTemperature(item?.vitalsTemperature);
        setVitalsWeight(item?.vitalsWeight);
        setVitalsHeightFeet(item?.vitalsHeightFeet);
        setVitalsHeightInches(item?.vitalsHeightInches);
        setAllergies(item?.allergies);
        setReviewOfSystemsConstitutional(item?.reviewOfSystemsConstitutional);
        setReviewOfSystemsConstitutionalOther(
          item?.reviewOfSystemsConstitutionalComment,
        );
        setReviewOfSystemsCardiovascular(item?.reviewOfSystemsCardiovascular);
        setReviewOfSystemsCardiovascularOther(
          item?.reviewOfSystemsCardiovascularComment,
        );
        setReviewOfSystemsEndocrine(item?.reviewOfSystemsEndocrine);
        setReviewOfSystemsEndocrineOther(item?.reviewOfSystemsEndocrineComment);
        setReviewOfSystemsGastrointestinal(
          item?.reviewOfSystemsGastrointestinal,
        );
        setReviewOfSystemsGastrointestinalOther(
          item?.reviewOfSystemsGastrointestinalComment,
        );
        setReviewOfSystemsGenitourinary(item?.reviewOfSystemsGenitourinary);
        setReviewOfSystemsGenitourinaryOther(
          item?.reviewOfSystemsGenitourinaryComment,
        );
        setReviewOfSystemsHematologyOncology(
          item?.reviewOfSystemsHematologyOncology,
        );
        setReviewOfSystemsHematologyOncologyOther(
          item?.reviewOfSystemsHematologyOncologyomment,
        );
        setReviewOfSystemsHeadNeckThroat(item?.reviewOfSystemsHeadNeckThroat);
        setReviewOfSystemsHeadNeckThroatOther(
          item?.reviewOfSystemsHeadNeckThroatComment,
        );
        setReviewOfSystemsIntegumentary(item?.reviewOfSystemsIntegumentary);
        setReviewOfSystemsIntegumentaryOther(
          item?.reviewOfSystemsIntegumentaryComment,
        );
        setReviewOfSystemsMusculoskeletal(item?.reviewOfSystemsMusculoskeletal);
        setReviewOfSystemsMusculoskeletalOther(
          item?.reviewOfSystemsMusculoskeletalComment,
        );
        setReviewOfSystemsPsychiatric(item?.reviewOfSystemsPsychiatric);
        setReviewOfSystemsPsychiatricOther(
          item?.reviewOfSystemsPsychiatricComment,
        );
        setReviewOfSystemsNeurologic(item?.reviewOfSystemsNeurologic);
        setReviewOfSystemsNeurologicOther(
          item?.reviewOfSystemsNeurologicComment,
        );
        setReviewOfSystemsRespiratory(item?.reviewOfSystemsRespiratory);
        setReviewOfSystemsRespiratoryOther(
          item?.reviewOfSystemsRespiratoryComment,
        );
        setReviewOfSystemsAllergicImmunologic(
          item?.reviewOfSystemsAllergicImmunologic,
        );
        setReviewOfSystemsAllergicImmunologicOther(
          item?.reviewOfSystemsAllergicImmunologicComment,
        );
        setReviewOfSuicidalRiskAssessmentOther(
          item?.reviewOfSuicidalRiskAssessmentOther,
        );
        setReviewOfBehavioralSymptomsOther(
          item?.reviewOfBehavioralSymptomsOther,
        );
        setReviewOfPhysicalSymptomsOther(item?.reviewOfPhysicalSymptomsOther);
        setReviewOfPsychosocialSymptomsOther(
          item?.reviewOfPsychosocialSymptomsOther,
        );
        setReviewOfCurrentMedicationsOther(
          item?.reviewOfCurrentMedicationsOther,
        );
        setReviewOfNutritionDietOther(item?.reviewOfNutritionDietOther);
        setReviewOfNutritionFluidRestrictionsOther(
          item?.reviewOfNutritionFluidRestrictionsOther,
        );
        setReviewOfSkinCheckOther(item?.reviewOfSkinCheckOther);
        setSuicidalRiskAssessmentDeniesSymptomsBellow(
          item?.suicidalRiskAssessmentDeniesSymptomsBellow,
        );
        setBehavioralSymptoms(
          item?.behavioralSymptoms ? item?.behavioralSymptoms : [],
        );
        setPhysicalSymptoms(
          item?.physicalSymptoms ? item?.physicalSymptoms : [],
        );
        setPsychosocialSymptoms(
          item?.psychosocialSymptoms ? item?.psychosocialSymptoms : [],
        );
        setCurrentMedications(item?.currentMedications);
        setNutritionDiet(item?.nutritionDiet);
        setNutritionSpecialDietOrder(item?.nutritionSpecialDietOrder);
        setNutritionFluidRestrictions(item?.nutritionFluidRestrictions);
        setSkinCheck(item?.skinCheck);
        setResidentDeniesSkinConcerns(item?.residentDeniesSkinConcerns);
        setFront(item?.front);
        setBack(item?.back);
        setSideLeft(item?.sideLeft);
        setSideRight(item?.sideRight);
        setLegFront(item?.legFront);
        setLegBack(item?.legBack);
        setLegLeft(item?.legLeft);
        setLegRight(item?.legRight);
        setCommentFigure(item?.legComment);
        setSafetyPlanComment(item?.safetyPlanComment || "");
      }
      if (url === "/nursing-assessment") {
        setBhtName("");
        setBhtSignature("");
        setbhtDate("");
        setBhpTime("");
        setRnName("");
        setRnSignature("");
        setrnDate("");
        setRnTime("");
        setSigners([]);
      } else {
        setBhtName(item?.bhtName?.fullName);
        setBhtSignature(item?.bhtSignature);
        setbhtDate(item?.bhpDate);
        setBhpTime(item?.bhpTime);
        setRnName(item?.rnName?._id);
        setRnSignature(item?.rnSignature);
        setrnDate(item?.rnDate);
        setRnTime(item?.rnTime);
        setAdminSignature(item?.adminSignature);
        setAdminSignatureDate(item?.adminSignatureDate);
        setAdminSignatureTime(item?.adminSignatureTime);
        setSigners(item?.signers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData, url]);
  useEffect(() => {
    if (patientId && url === "/nursing-assessment") {
      intakeService.getNursingAssessment({
        patientId,
        setResponse: setGetApiData,
        setLoading,
      });
    }
  }, [patientId, url]);
  useEffect(() => {
    if (id) {
      intakeService.getNursingAssessment({ id, setResponse: setGetApiData });
    }
  }, [id]);
  useEffect(() => {
    const pId =
      getApiData?.data?.patientId?._id ||
      getApiData?.data?.patientId ||
      patientId;
    if (pId) {
      patientService.getById(pId, { setResponse: setUserDetail });
    }
  }, [getApiData?.data?.patientId, patientId]);
  useEffect(() => {
    intakeService.getResidentEmployees({ setResponse: setEmploy });
  }, []);
  useEffect(() => {
    if (userDetail) {
      const detail = userDetail?.data;
      const birthDate = new Date(detail?.dateOfBirth);
      const currentDate = new Date();
      const timeDiff = currentDate.getTime() - birthDate.getTime();
      const ageInMilliseconds = new Date(timeDiff);
      const ageInYears = Math.abs(ageInMilliseconds.getUTCFullYear() - 1970);
      setAge(ageInYears);
      setUserId(detail?._id);
      setName(`${detail?.firstName} ${detail?.lastName} `);
      setDateOfBirth(detail?.dateOfBirth);
      setRnName(
        getApiData?.data?.rnName ? getApiData?.data?.rnName : profileInfo._id,
      );
      setBhtName(
        getApiData?.data?.bhtName?.fullName
          ? getApiData?.data?.bhtName?.fullName
          : profileInfo._id,
      );
    }
  }, [
    getApiData?.data?.bhtName?.fullName,
    getApiData?.data?.rnName,
    getApiData?.data?.sex,
    profileInfo._id,
    profileInfo.fullName,
    userDetail,
  ]);
  useEffect(() => {
    if (patientDetail) {
      if (url === "/nursing-assessment") {
        setDateOfBirth(patientDetail?.dateOfBirth);
        setAdmissionDate(patientDetail?.admitDate);
        setSex(
          patientDetail?.gender
            ? patientDetail?.gender
            : getApiData?.data?.gender,
        );
      }
      setAge(getApiData?.data?.age);
      setAhcccsId(
        patientDetail?.ahcccsId
          ? patientDetail?.ahcccsId
          : userDetail?.data?.ahcccsId,
      );
      setDiagnosis(
        patientDetail?.diagnosis
          ? patientDetail?.diagnosis
          : userDetail?.data?.diagnosis,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getApiData?.data?.age,
    patientDetail,
    userDetail?.data?.ahcccsId,
    userDetail?.data?.diagnosis,
  ]);
  const handlePost = (e) => {
    e.preventDefault();
    const data = {
      patientId,
      residentName,
      admissionDate,
      dateOfBirth,
      age,
      todayDate,
      codeStatus,
      lastTBScreeningDate,
      tbScreeningResults: tbScreeningResults?.join(","),
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
      reviewOfSystemsCardiovascularComment: reviewOfSystemsCardiovascularOther,
      reviewOfSystemsEndocrine,
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
      reviewOfSuicidalRiskAssessmentOther,
      behavioralSymptoms,
      reviewOfBehavioralSymptomsOther,
      physicalSymptoms,
      reviewOfPhysicalSymptomsOther,
      psychosocialSymptoms,
      reviewOfPsychosocialSymptomsOther,
      currentMedications,
      reviewOfCurrentMedicationsOther,
      nutritionDiet,
      reviewOfNutritionDietOther,
      nutritionSpecialDietOrder,
      nutritionFluidRestrictions,
      reviewOfNutritionFluidRestrictionsOther,
      skinCheck,
      reviewOfSkinCheckOther,
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
      bhtSignature,
      bhtDate,
      bhpTime,
      rnSignature,
      rnDate,
      rnTime,
      adminSignature,
      adminSignatureDate,
      adminSignatureTime,
      signers: id
        ? signers
        : signers.map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
            type: signer.type,
          })),
      safetyPlanComment,
    };
    if (url === "/nursing-assessment") {
      intakeService.nursingAssessment.create({
        patientId,
        payload: data,
        successMsg: "Nursing Assisment Updated !",
        setLoading,
        navigate,
      });
    } else {
      intakeService.nursingAssessment.update(id, data, {
        setLoading,
        navigate,
      });
    }
  };
  useEffect(() => {
    if (!getApiData?.data) return;
    if (getApiData?.data) {
      const { saveAsDraft, signers } = getApiData.data;
      const { _id, userType, accountType, userPermissions } = profileInfo;
      const isSigner = signers?.findIndex?.(
        (signer, i) => signer.signerId === _id,
      );
      const isEmployeeRegular =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.REGULAR;
      const isEmployeeRestricted =
        userType === ROLES.EMPLOYEE && accountType === ACCOUNT_TYPES.RESTRICTED;
      const cannotEditDocument = !userPermissions?.edit
        ?.split(":")
        .includes("nass");
      const isSignerFound = isSigner !== -1;
      const isSignerNotFound = isSigner === -1;

      const isRegularSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerFound;
      const isRestrictedSigner = isEmployeeRestricted && isSignerFound;
      const isNotEditableSigner =
        isRegularSignerWithoutEdit || isRestrictedSigner;

      const isRegularNonSignerWithoutEdit =
        isEmployeeRegular && cannotEditDocument && isSignerNotFound;
      const isRestrictedNonSigner = isEmployeeRestricted && isSignerNotFound;

      const isSaveAsDraftWithSigner = saveAsDraft && isNotEditableSigner;
      setSaveAsDrafIsNotEditable(isSaveAsDraftWithSigner);

      const isSaveAsDraftWithoutSigner =
        saveAsDraft && (isRegularNonSignerWithoutEdit || isRestrictedNonSigner);
      setSaveAsDrafIsNotEditableWithoutSigner(isSaveAsDraftWithoutSigner);

      setIsNotEditableWithSigner(isNotEditableSigner);
    }
  }, [
    getApiData?.data,
    profileInfo,
    profileInfo?._id,
    profileInfo?.accountType,
    profileInfo?.userPermissions?.edit,
    profileInfo?.userType,
  ]);
  const careProvidedPhysicalServicesHandler = (status) => {
    if (careProvidedPhysicalServices.includes(status)) {
      setCareProvidedPhysicalServices((prevStatus) =>
        prevStatus.filter((item) => item !== status),
      );
    } else {
      setCareProvidedPhysicalServices((prevStatus) => [...prevStatus, status]);
    }
  };
  const handleCodeStatusChange = (status) => {
    if (codeStatus.includes(status)) {
      setCodeStatus((prevStatus) =>
        prevStatus.filter((item) => item !== status),
      );
    } else {
      setCodeStatus((prevStatus) => [...prevStatus, status]);
    }
  };
  const handlereviewOfSystemsConstitutional = (symptom) => {
    setReviewOfSystemsConstitutional((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState?.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsCardiovascular = (symptom) => {
    setReviewOfSystemsCardiovascular((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsEndocrine = (symptom) => {
    setReviewOfSystemsEndocrine((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsGastrointestinal = (symptom) => {
    setReviewOfSystemsGastrointestinal((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsGenitourinary = (symptom) => {
    setReviewOfSystemsGenitourinary((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsHematologyOncology = (symptom) => {
    setReviewOfSystemsHematologyOncology((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsHeadNeckThroat = (symptom) => {
    setReviewOfSystemsHeadNeckThroat((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsIntegumentary = (symptom) => {
    setReviewOfSystemsIntegumentary((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsMusculoskeletal = (symptom) => {
    setReviewOfSystemsMusculoskeletal((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsPsychiatric = (symptom) => {
    setReviewOfSystemsPsychiatric((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsNeurologic = (symptom) => {
    setReviewOfSystemsNeurologic((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsRespiratory = (symptom) => {
    setReviewOfSystemsRespiratory((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlereviewOfSystemsAllergicImmunologic = (symptom) => {
    setReviewOfSystemsAllergicImmunologic((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlebehavioralSymptoms = (symptom) => {
    setBehavioralSymptoms((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState?.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlephysicalSymptoms = (symptom) => {
    setPhysicalSymptoms((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const handlerepsychosocialSymptoms = (symptom) => {
    setPsychosocialSymptoms((prevState) => {
      if (prevState?.includes(symptom)) {
        return prevState.filter((item) => item !== symptom);
      } else {
        if (prevState?.length) {
          return [...prevState, symptom];
        } else return [symptom];
      }
    });
  };
  const imagesPair = [
    {
      img: frontBody,
      setValue: setFront,
      value: front,
      title: "frontImage",
    },
    {
      img: backBody,
      setValue: setBack,
      value: back,
      title: "backImag",
    },
    {
      img: leftBody,
      setValue: setSideLeft,
      value: sideLeft,
      title: "sideLeftImag",
    },
    {
      img: rightBody,
      setValue: setSideRight,
      value: sideRight,
      title: "sideRightImage",
    },
    {
      img: legs,
      setValue: setLegFront,
      value: legFront,
      title: "legFrontImage",
    },
    {
      img: frontLegs,
      setValue: setLegBack,
      value: legBack,
      title: "frontLegsImage",
    },
    {
      img: leftLegs,
      setValue: setLegLeft,
      value: legLeft,
      title: "legLeftImage",
    },
    {
      img: rightLegs,
      setValue: setLegRight,
      value: legRight,
      title: "legRightImage",
    },
  ];
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        profileInfo,
        profileInfo,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId,
      getApiData?.data,
    ),
    pageStyle: `
    @page {
      margin: 15mm !important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .heading-nas {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const checkSign = useCallback(async () => {
    let signerIndex = signers?.findIndex?.(
      (signer, i) => signer.signerId === profileInfo._id,
    );
    let isSignerValid =
      signerIndex !== -1 && signers?.[signerIndex]?.signature?.length > 0;
    let isAdminConditionValid = profileInfo.userType === ROLES.ADMIN;
    let isEmployeeConditionValid =
      (getApiData?.data?.employeeId === profileInfo?._id ||
        getApiData?.data?.employeeId?._id === profileInfo?._id) &&
      rnSignature?.length > 0;
    let signerGuadianIndex = signers?.findIndex?.((signer, i) =>
      profileInfo.patientsAssigned?.includes(signer.signerId),
    );
    let isGuadianConditionValid =
      signerGuadianIndex !== -1 &&
      signers?.[signerGuadianIndex]?.signature?.length > 0;
    if (
      isSignerValid ||
      isAdminConditionValid ||
      isEmployeeConditionValid ||
      isGuadianConditionValid
    ) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [
    signers,
    profileInfo.userType,
    profileInfo._id,
    profileInfo.patientsAssigned,
    getApiData?.data?.employeeId,
    rnSignature?.length,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [rnSignature, adminSignature, id, checkSign]);
  let signerIndex = signers?.findIndex?.(
    (signer, i) => signer.signerId === profileInfo._id,
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
  const editSignHandler = (sign) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerSignature(sign);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            signature: sign,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: sign,
              dateSigned: "",
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignature(sign);
    }
  };
  const editDateHandler = (date) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerDate(date);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setSigners((prevSigners) => {
        const signerIndex = prevSigners.findIndex(
          (signer) => signer.signerId === profileInfo?._id,
        );
        if (signerIndex !== -1) {
          const updatedSigners = [...prevSigners];
          updatedSigners[signerIndex] = {
            ...updatedSigners[signerIndex],
            dateSigned: date,
          };
          return updatedSigners;
        } else {
          return [
            ...prevSigners,
            {
              signerId: profileInfo._id,
              signature: "",
              dateSigned: date,
              signedTime: "",
            },
          ];
        }
      });
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignatureDate(date);
    }
  };
  const editTimeHandler = (time) => {
    if (signers?.[signerIndex]?.signerId === profileInfo?._id) {
      setSignerTime(time);
    } else if (profileInfo.userType === ROLES.EMPLOYEE) {
      setRnTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignatureTime(time);
    }
  };
  const handleMultiTbScreeningResults = (value) => {
    setTbScreeningResults((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  const handleMultiNutritionDiet = (value) => {
    if (nutritionDiet?.includes(value))
      setNutritionDiet((pre) => pre?.replace(value, ""));
    else setNutritionDiet((pre) => pre + value);
  };

  return {
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
    componentRef,
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
    handlePrint,
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
    hoursFormat,
    id,
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
    profileInfo,
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
    saveAsDrafIsNotEditable,
    setGetApiData,
    setLoading,
    setPatientDetail,
    setPatientId,
    setResidentName,
    setShowSingInOne,
    setShowSingInTwo,
    setSigners,
    sex,
    showSingInOne,
    showSingInTwo,
    sideLeft,
    sideRight,
    signatureModals,
    signers,
    skinCheck,
    tbScreeningResults,
    todayDate,
    url,
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
    setReviewOfSystemsPsychiatricOther,
    setReviewOfSystemsNeurologicOther,
    setReviewOfSystemsRespiratoryOther,
    setReviewOfSystemsAllergicImmunologicOther,
    setReviewOfSystemsAllergicImmunologic,
    setSuicidalRiskAssessmentDeniesSymptomsBellow,
    suicidalRiskAssessmentDeniesSymptomsBellow,
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
    setReviewOfSystemsEndocrineOther,
    setTbScreeningResults,
    saveAsDrafIsNotEditableWithoutSigner,
    profileInfo,
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

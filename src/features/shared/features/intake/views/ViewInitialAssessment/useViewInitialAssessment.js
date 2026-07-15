// ResidentForm.js

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { residentService } from "@/features/shared/services/index";
import "@/assets/styles/Print.css";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { usePrint } from "@shared/hooks";
import { EMPLOYEE_APIS } from "@/features/shared/services/index";

import { getApiArrayData } from "./utils";

export function useViewInitialAssessment() {
  const { id } = useParams();
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  const componentRef = React.useRef();
  const printRef = useRef(null);
  const [getApiData, setGetApiData] = useState([]);
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        getApiData?.data?.patientId || getApiData?.patientId,
        Profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      getApiData?.data?.patientId || getApiData?.patientId,
      Profile,
    ),
    pageStyle: `
      @page {
        size: portrait!important;
        margin:12mm 9mm!important;
      } 
      .card {
        page-break-inside: avoid;
      }
      .view-details-grid {
        page-break-inside: avoid;
      }
      th,td {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .table-row-hide-print {
        display: none
      }
      .print-block-row {
        display: block !important;
      }
      .print-block-row > [class*="col-"] {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
  `,
  });
  const handlePrint2 = (e) => {
    e?.preventDefault();
    handlePrint();
  };
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  //singin model
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [showSignatureResident, setShowSignatureResident] = useState(false);
  const [filedForm, setFiledForm] = useState("");
  const [userData, setUserData] = useState("");
  const [userType, setUserType] = useState("");
  const profile = useSelector(userProfile);

  //state define
  const [assessmentType, setAssessmentType] = useState("");
  const [hasNotified, setHasNotified] = useState("");
  const [assessmentOn, setAssessmentOn] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [residentName, setResidentName] = useState("");
  const [sex, setSex] = useState("");
  const [dateOfAssessment, setDateOfAssessment] = useState("");
  const [ahcccsNumber, setAhcccsNumber] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  // admission status is array
  const [admissionStatus, setAdmissionStatus] = useState([]);
  const [programLocation, setProgramLocation] = useState("");
  const [guardianship, setGuardianship] = useState("");
  const [powerOfAttorneyStatus, setPowerOfAttorneyStatus] = useState("");
  const [todayDate, setTodayDate] = useState("");
  const [guardianshipPoaPubFidName, setGuardianshipPoaPubFidName] =
    useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [reasonForAdmission, setReasonForAdmission] = useState([]);
  const [residentGoals, setResidentGoals] = useState("");

  // Resident Strengths (Array)
  const [residentStrengths, setResidentStrengths] = useState([]);
  const [residentLimitations, setResidentLimitations] = useState("");
  const [stepDownBarriers, setStepDownBarriers] = useState([]);
  const [stepDownBarriersBoolean, setStepDownBarriersBoolean] = useState(false);
  const [stepDownBarriersOther, setStepDownBarriersOther] = useState("");
  const [stepDownBarriersText, setStepDownBarriersText] = useState("");
  const [currentBehavioralIssues, setCurrentBehavioralIssues] = useState("");

  // Medical Conditions (Array of Objects) array second section is start ===>
  // diabetes =======>
  const [yesDiabetes, setYesDiabetes] = useState();
  const [commentDiabety, setCommentDeabetes] = useState("");

  //Heart disease / heart attack
  const [yesHeart, setYesHeart] = useState();
  const [commentHeart, setCommentHeart] = useState("");

  //History
  const [yesHistory, setYesHistory] = useState();
  const [commentHistory, setCommentHistory] = useState("");

  //High Blood Pressure
  const [yesHigh, setYesHigh] = useState();
  const [commentHigh, setCommentHigh] = useState("");

  //Lung disease (ie asthma, COPD, emphysema)
  const [yesLung, setYesLung] = useState();
  const [commentLung, setCommentLung] = useState("");

  //Seizures
  const [yesSeizures, setYesSeizures] = useState();
  const [commentSeizures, setCommentSeizures] = useState("");

  //Cancer
  const [yesCancer, setYesCancer] = useState();
  const [commentCancer, setCommentCancer] = useState("");

  // Liver/kidney disease
  const [yesLiver, setYesLiver] = useState();
  const [commentLiver, setCommentLiver] = useState("");

  //Thyroid disorder
  const [yesThyroid, setYesThyroid] = useState();
  const [thyroidDisorder, setThyroidDisorder] = useState([]);
  //dropdown

  // History of head trauma/traumatic brain injury
  const [yesbrain, setYesBrain] = useState();
  const [commentbrain, setbrain] = useState("");

  // injury
  const [yesInjury, setYesInjury] = useState();
  const [commentInjury, setCommentInjury] = useState("");

  //Chronic painChronic pain
  const [yesChronic, setYesChronic] = useState();
  const [chronicCommit, setChronicCommit] = useState("");

  // Allergies (food, environment, medications)
  const [AllergiesYes, setAllergiesYes] = useState();
  const [AllergiesComment, setAllergiesComment] = useState("");

  // Surgeries
  const [SurgeriesYes, setSurgeriessYes] = useState();
  const [SurgeriesComment, setSurgeriesComment] = useState("");

  //Number of pregnancies / births
  const [pregnanciesYes, setPregnanciesYes] = useState();
  const [pregnanciesComment, setPregnanciesComment] = useState("");

  // Substance use disorder (please specify)
  const [SubstanceYes, setSubstanceYes] = useState();
  const [SubstanceComment, setSubstanceComment] = useState("");

  // Depression
  const [DepressionYes, setDepressionYes] = useState();
  const [DepressionComment, setDepressionComment] = useState("");

  // Anxiety/panic attacks
  const [AnxietyYes, setAnxietyYes] = useState();
  const [AnxietyComment, setAnxietyComment] = useState("");

  // Insomnia
  const [InsomniaYes, setInsomniaYes] = useState();
  const [InsomniaComment, setInsomniaComment] = useState("");

  // Bipolar disorder
  const [BipolarYes, setBipolarYes] = useState();
  const [BipolarComment, setBipolarComment] = useState("");

  // Schizophrenia
  const [SchizophreniaYes, setSchizophreniaYes] = useState();
  const [SchizophreniaComment, setSchizophreniaComment] = useState("");

  // Obsessive compulsive disorder
  const [ObsessiveYes, setObsessiveYes] = useState();
  const [ObsessiveComment, setObsessiveComment] = useState("");

  // Personality disorder (please specify) shishpal
  const [PersonalityYes, setPersonalityYes] = useState(false);
  const [PersonalityComment, setPersonalityComment] = useState("");

  // Phobias
  const [PhobiasYes, setPhobiasYes] = useState();
  const [PhobiasComment, setPhobiasComment] = useState("");

  // Any other health conditions
  const [healthConditionsYes, setHealthConditionsYes] = useState();
  const [healthConditionsYesComment, sethealthConditionsYesComment] =
    useState("");

  // Infection or Diseases
  const [InfectionYes, setInfectionYes] = useState();
  // drop down c
  const [infectionDiseases, setInfectionDiseases] = useState([]);

  //section 2 condition other array
  const [OtherConditionOther, setOtherConditionOther] = useState("");
  const [otherConditionYesNO, setOtherConditionYesNo] = useState();
  const [otherConditionDiscription, setOtherConditionDiscription] =
    useState("");
  const [otherConditionArray, setOtherConditionArray] = useState([]);
  const handleAddCondition = () => {
    if (
      OtherConditionOther ||
      otherConditionYesNO ||
      otherConditionDiscription
    ) {
      const data = {
        condition: OtherConditionOther,
        yes: otherConditionYesNO,
        comments: otherConditionDiscription,
      };
      setOtherConditionArray((prev) => [...prev, data]);
      setOtherConditionOther("");
      setOtherConditionYesNo();
      setOtherConditionDiscription("");
    }
  };
  const [
    SignificantFamilyMedicalPsychiatricHistory,
    setSignificantFamilyMedicalPsychiatricHistory,
  ] = useState([]);
  const [typeOfServiceArray, setTypeOfServicesArray] = useState([]);
  const [substanceAbuseHistory, setSubstanceAbuseHistory] = useState("");
  const [substanceAbuseDenies, setSubstanceAbuseDenies] = useState("");

  //Alcohol data
  const [
    substanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseAlcohol,
    setSubstanceAbuseHistoryDataLastUseAlcohol,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyAlcohol,
    setSubstanceAbuseHistoryDataFrequencyAlcohol,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyAlcohol,
    setSubstanceAbuseHistoryDataLengthOfSobrietyAlcohol,
  ] = useState("");
  //Benzodiazepines
  const [
    substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
    setSubstanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseBenzodiazepines,
    setSubstanceAbuseHistoryDataLastUseBenzodiazepines,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyBenzodiazepines,
    setSubstanceAbuseHistoryDataFrequencyBenzodiazepines,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines,
    setSubstanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines,
  ] = useState("");
  //Crack
  const [
    substanceAbuseHistoryDataAgeOfFirstUseCrack,
    setSubstanceAbuseHistoryDataAgeOfFirstUseCrack,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseCrack,
    setSubstanceAbuseHistoryDataLastUseCrack,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyCrack,
    setSubstanceAbuseHistoryDataFrequencyCrack,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyCrack,
    setSubstanceAbuseHistoryDataLengthOfSobrietyCrack,
  ] = useState("");
  //Heroin
  const [
    substanceAbuseHistoryDataAgeOfFirstUseHeroin,
    setSubstanceAbuseHistoryDataAgeOfFirstUseHeroin,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseHeroin,
    setSubstanceAbuseHistoryDataLastUseHeroin,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyHeroin,
    setSubstanceAbuseHistoryDataFrequencyHeroin,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyHeroin,
    setSubstanceAbuseHistoryDataLengthOfSobrietyHeroin,
  ] = useState("");
  //Inhalants
  const [
    substanceAbuseHistoryDataAgeOfFirstUseInhalants,
    setSubstanceAbuseHistoryDataAgeOfFirstUseInhalants,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseInhalants,
    setSubstanceAbuseHistoryDataLastUseInhalants,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyInhalants,
    setSubstanceAbuseHistoryDataFrequencyInhalants,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyInhalants,
    setSubstanceAbuseHistoryDataLengthOfSobrietyInhalants,
  ] = useState("");
  //Marijuana
  const [
    substanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMarijuana,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseMarijuana,
    setSubstanceAbuseHistoryDataLastUseMarijuana,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyMarijuana,
    setSubstanceAbuseHistoryDataFrequencyMarijuana,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMarijuana,
  ] = useState("");
  //Methamphetamine
  const [
    substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseMethamphetamine,
    setSubstanceAbuseHistoryDataLastUseMethamphetamine,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyMethamphetamine,
    setSubstanceAbuseHistoryDataFrequencyMethamphetamine,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
  ] = useState("");
  //Methadone
  const [
    substanceAbuseHistoryDataAgeOfFirstUseMethadone,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMethadone,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseMethadone,
    setSubstanceAbuseHistoryDataLastUseMethadone,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyMethadone,
    setSubstanceAbuseHistoryDataFrequencyMethadone,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyMethadone,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMethadone,
  ] = useState("");
  //MDMA
  const [
    substanceAbuseHistoryDataAgeOfFirstUseMDMA,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMDMA,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseMDMA,
    setSubstanceAbuseHistoryDataLastUseMDMA,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyMDMA,
    setSubstanceAbuseHistoryDataFrequencyMDMA,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyMDMA,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMDMA,
  ] = useState("");
  const [
    substanceAbuseHistoryDataAgeOfFirstUsePCP,
    setSubstanceAbuseHistoryDataAgeOfFirstUsePCP,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUsePCP,
    setSubstanceAbuseHistoryDataLastUsePCP,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyPCP,
    setSubstanceAbuseHistoryDataFrequencyPCP,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyPCP,
    setSubstanceAbuseHistoryDataLengthOfSobrietyPCP,
  ] = useState("");
  //Prescription
  const [
    substanceAbuseHistoryDataAgeOfFirstUsePrescription,
    setSubstanceAbuseHistoryDataAgeOfFirstUsePrescription,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUsePrescription,
    setSubstanceAbuseHistoryDataLastUsePrescription,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyPrescription,
    setSubstanceAbuseHistoryDataFrequencyPrescription,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyPrescription,
    setSubstanceAbuseHistoryDataLengthOfSobrietyPrescription,
  ] = useState("");
  //OTC
  const [
    substanceAbuseHistoryDataAgeOfFirstUseOTC,
    setSubstanceAbuseHistoryDataAgeOfFirstUseOTC,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseOTC,
    setSubstanceAbuseHistoryDataLastUseOTC,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyOTC,
    setSubstanceAbuseHistoryDataFrequencyOTC,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyOTC,
    setSubstanceAbuseHistoryDataLengthOfSobrietyOTC,
  ] = useState("");
  //Cocaine
  const [
    substanceAbuseHistoryDataAgeOfFirstUseCocaine,
    setSubstanceAbuseHistoryDataAgeOfFirstUseCocaine,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseCocaine,
    setSubstanceAbuseHistoryDataLastUseCocaine,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyCocaine,
    setSubstanceAbuseHistoryDataFrequencyCocaine,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyCocaine,
    setSubstanceAbuseHistoryDataLengthOfSobrietyCocaine,
  ] = useState("");
  //Hallucinogens
  const [
    substanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
    setSubstanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLastUseHallucinogens,
    setSubstanceAbuseHistoryDataLastUseHallucinogens,
  ] = useState("");
  const [
    substanceAbuseHistoryDataFrequencyHallucinogens,
    setSubstanceAbuseHistoryDataFrequencyHallucinogens,
  ] = useState("");
  const [
    substanceAbuseHistoryDataLengthOfSobrietyHallucinogens,
    setSubstanceAbuseHistoryDataLengthOfSobrietyHallucinogens,
  ] = useState("");

  // arr the value in array
  const [typeArray, setTypeArray] = useState([]);
  // other array
  const [otherTypeOther, setOtherTypeOther] = useState("");
  const [otherAgeOfFirstUse, setOtherAgeOfFirstUse] = useState("");
  const [otherLastUse, setOtherLastUse] = useState("");

  // Active Withdrawal Symptoms
  const [noneReportedOrObserved, setNoneReportedOrObserved] = useState(false);
  const [Agitation, setAgitation] = useState(false);
  const [Nausea, setNausea] = useState(false);
  const [Vomiting, setVomiting] = useState(false);
  const [Headache, setHeadache] = useState(false);
  const [TactileDisturbances, setTactileDisturbances] = useState(false);
  const [Anxiety, setAnxiety] = useState(false);
  const [Tremors, setTremors] = useState(false);
  const [VisualDisturbances, setVisualDisturbances] = useState(false);
  const [VisualDisturbancesOtherBoolean, setVisualDisturbancesOtherBoolean] =
    useState(false);
  const [VisualDisturbancesOtherType, setVisualDisturbancesOtherType] =
    useState("");
  const [Sweats, setSweats] = useState(false);
  const [Paranoia, setParanoia] = useState(false);
  const [GooseBumps, setGooseBumps] = useState(false);
  const [Runningnose, setRunningnose] = useState(false);
  const [BonePain, setBonePain] = useState(false);
  const [Tearing, setTearing] = useState(false);
  const [Seizures, setSeizures] = useState(false);
  const [LossofMuscleCoordination, setLossofMuscleCoordination] =
    useState(false);
  const [
    LossofMuscleCoordinationOtherBoolean,
    setLossofMuscleCoordinationBoolean,
  ] = useState(false);
  const [LossofMuscleCoordinationOtherType, setLossofMuscleCoordinationType] =
    useState("");

  // mentalStatusExam
  //apparentAge
  const [consistent, setConsistent] = useState(false);
  const [younger, setYounger] = useState(false);
  const [older, setOlder] = useState(false);
  const [olderOtherBoolean, setOlderOtherBoolean] = useState(false);
  const [olderOther, setOlderOther] = useState("");
  //height
  const [averageHeight, setAverageHeight] = useState(false);
  const [short, setShort] = useState(false);
  const [tall, setTall] = useState(false);
  const [heigthBoolean, setHeigthBoolean] = useState(false);
  const [heigthOther, setHeigthOther] = useState("");

  //Weight
  const [averageWeight, setAverageWeight] = useState(false);
  const [obese, setObese] = useState(false);
  const [overweight, setOverweight] = useState(false);
  const [thin, setThin] = useState(false);
  const [emaciated, setEmaciated] = useState(false);
  const [WeightBoolean, setWeightBoolean] = useState(false);
  const [WeightOther, setWeightOther] = useState("");
  //attire
  const [casual, setCasual] = useState(false);
  const [neat, setNeat] = useState(false);
  const [tattered, setTattered] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [attireBoolean, setAttireBoolaen] = useState(false);
  const [attireOther, setAttireOther] = useState("");
  //Grooming
  const [wellGroomed, setWellGroomed] = useState(false);
  const [adequateGrooming, setAdequateGrooming] = useState(false);
  const [unkempt, setUnkempt] = useState(false);
  const [disheveled, setDisheveled] = useState(false);
  const [GroomingBoolean, setGroomingBoolean] = useState(false);
  const [GroomingOther, setGroomingOther] = useState("");
  //Mood
  const [euthymic, setEuthymic] = useState(false);
  const [irritable, setIrritable] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [depressedMood, setDepressedMood] = useState(false);
  const [anxious, setAnxious] = useState(false);
  const [euthymicOtherBoolean, seteuthymicOtherBoolean] = useState(false);
  const [euthymicOtherBooleanType, seteuthymicOtherBooleanType] = useState("");
  //Affect
  const [normalRange, setNormalRange] = useState(false);
  const [depressedAffect, setDepressedAffect] = useState(false);
  const [labile, setLabile] = useState(false);
  const [constricted, setConstricted] = useState(false);
  const [other, setOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  //EyeContact
  const [appropriate, setAppropriate] = useState(false);
  const [minimal, setMinimal] = useState(false);
  const [poor, setPoor] = useState(false);
  const [adequateEyeContact, setAdequateEyeContact] = useState(false);
  const [EyeContactOtherBoolean, setEyeContactOtherBoolean] = useState(false);
  const [EyeContactOtherBooleanType, setEyeContactOtherBooleanType] =
    useState("");

  //Cooperation
  const [appropriateCooperation, setAppropriateCooperation] = useState(false);
  const [hostile, setHostile] = useState(false);
  const [evasive, setEvasive] = useState(false);
  const [defensive, setDefensive] = useState(false);
  const [indifferent, setIndifferent] = useState(false);
  const [CooperationOtherBoolean, setCooperationOtherBoolean] = useState(false);
  const [CooperationOtherBooleanType, setCooperationOtherBooleanType] =
    useState("");

  //Speech section 3

  //Articulation
  const [normalArticulation, setNormalArticulation] = useState(false);
  const [unintelligible, setUnintelligible] = useState(false);
  const [mumbled, setMumbled] = useState(false);
  const [slurred, setSlurred] = useState(false);
  const [stuttered, setStuttered] = useState(false);
  const [ArticulationOtherBoolean, setArticulationOtherBoolean] =
    useState(false);
  const [ArticulationOtherBooleanOther, setArticulationOtherBooleanOther] =
    useState("");
  //Tone
  const [normalTone, setNormalTone] = useState(false);
  const [soft, setSoft] = useState(false);
  const [loud, setLoud] = useState(false);
  const [pressured, setPressured] = useState(false);
  const [ToneOtherBoolean, setToneOtherBoolean] = useState(false);
  const [ToneOtherBooleanOther, setToneOtherBooleanOther] = useState("");
  //Rate
  const [normalRate, setNormalRate] = useState(false);
  const [slow, setSlow] = useState(false);
  const [fast, setFast] = useState(false);
  const [RateOtherBoolean, setRateOtherBoolean] = useState(false);
  const [RateOtherBooleanOther, setRateOtherBooleanOther] = useState("");

  //Quantity
  const [normalQuantity, setNormalQuantity] = useState(false);
  const [verbose, setVerbose] = useState(false);
  const [mutism, setMutism] = useState(false);
  const [QuantityOtherBoolean, setQuantityOtherBoolean] = useState(false);
  const [QuantityOtherBooleanOther, setQuantityOtherBooleanOther] =
    useState("");

  //responseLatency
  const [normalresponseLatency, setNormalresponseLatency] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const [shortened, setShortened] = useState(false);
  const [responseLatencyOtherBoolean, setresponseLatencyOtherBoolean] =
    useState(false);
  const [
    responseLatencyOtherBooleanOther,
    setresponseLatencyOtherBooleanOther,
  ] = useState("");

  // sesion 3 Cognition
  // thoughtContent
  const [unremarkablethoughtContent, setUnremarkablethoughtContent] =
    useState(false);
  const [suspicious, setSuspicious] = useState(false);
  const [negative, setNegative] = useState(false);
  const [concrete, setConcrete] = useState(false);
  const [thoughtContentBoolaen, setthoughtContentBoolean] = useState(false);
  const [thoughtContentOther, setThoughtContentOther] = useState("");
  //thoughtProcesses
  const [logicalCoherent, setLogicalCoherent] = useState(false);
  const [tangential, setTangential] = useState(false);
  const [circumstantial, setCircumstantial] = useState(false);
  const [vague, setVague] = useState(false);
  const [thoughtProcessesBoolean, setThoughtProcessesBoolaen] = useState(false);
  const [thoughtProcessesOther, setThoughtProcessesOther] = useState("");

  //Delusions
  const [noDelusions, setNoDelusions] = useState(false);
  const [yesPersecutory, setYesPersecutory] = useState(false);
  const [yesSomatic, setYesSomatic] = useState(false);
  const [yesGrandiose, setYesGrandiose] = useState(false);
  const [yesOtherDelusionsBoolean, setYesOtherDelusionsBoolean] =
    useState(false);
  const [yesOtherDelusionsText, setYesOtherDelusionsText] = useState("");
  //Hallucinations
  const [unremarkableHallucinations, setUnremarkableHallucinations] =
    useState(false);
  const [visualHallucinations, setVisualHallucinations] = useState(false);
  const [auditoryHallucinations, setAuditoryHallucinations] = useState(false);
  const [tactileHallucinations, setTactileHallucinations] = useState(false);
  const [yesOtherHallucinationsBoolean, setYesOtherHallucinationsBoolean] =
    useState(false);
  const [yesOtherHallucinationsText, setYesOtherHallucinationsText] =
    useState("");
  // Motor activity
  //Gait
  const [normalGait, setNormalGait] = useState(false);
  const [staggering, setStaggering] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [slowGait, setSlowGait] = useState(false);
  const [awkward, setAwkward] = useState(false);
  const [gaitOtherBoolen, setGailOtherBoolen] = useState(false);
  const [gaitOther, setgetOther] = useState("");
  //Posture
  const [normalPosture, setNormalPosture] = useState(false);
  const [relaxed, setRelaxed] = useState(false);
  const [rigid, setRigid] = useState(false);
  const [tense, setTense] = useState(false);
  const [slouched, setSlouched] = useState(false);
  const [PostureOtherBoolen, setgaitOtherBoolen] = useState(false);
  const [PostureOther, setPostureOther] = useState("");
  //PsychomotorActivity
  const [withinNormalLimits, setWithinNormalLimits] = useState(false);
  const [calm, setCalm] = useState(false);
  const [hyperactive, setHyperactive] = useState(false);
  const [agitated, setAgitated] = useState(false);
  const [hypoactive, setHypoactive] = useState(false);
  const [PsychomotorActivityOtherBoolen, setPsychomotorActivityOtherBoolen] =
    useState(false);
  const [PsychomotorActivityOther, setPsychomotorActivityOther] = useState("");
  //Mannerisms
  const [none, setNone] = useState(false);
  const [tics, setTics] = useState(false);
  const [tremorsMannerisms, setTremorsMannerisms] = useState(false);
  const [rocking, setRocking] = useState(false);
  const [picking, setPicking] = useState(false);
  const [MannerismsOtherBoolen, setMannerismsOtherBoolen] = useState(false);
  const [MannerismsOther, setMannerismsOther] = useState("");
  //Orientation to Person:
  //orientation
  const [person, setPerson] = useState(false);
  const [place, setPlace] = useState(false);
  const [time, setTime] = useState(false);
  const [circumstances, setCircumstances] = useState(false);

  //Judgment
  const [goodJudgment, setGoodJudgment] = useState(false);
  const [fairJudgment, setFairJudgment] = useState(false);
  const [poorJudgment, setPoorJudgment] = useState(false);

  //Insight
  const [goodInsight, setGoodInsight] = useState(false);
  const [fairInsight, setFairInsight] = useState(false);
  const [poorInsight, setPoorInsight] = useState(false);

  //Memory
  const [goodMemory, setGoodMemory] = useState(false);
  const [fairMemory, setFairMemory] = useState(false);
  const [poorMemory, setPoorMemory] = useState(false);

  //AbilityToConcentration
  const [intactAbilityToConcentration, setIntactAbilityToConcentration] =
    useState(false);
  const [
    intactAbilityToConcentrationOtherBoolean,
    setIntactAbilityToConcentrationOtherBoolean,
  ] = useState(false);
  const [otherAbilityToConcentration, setOtherAbilityToConcentration] =
    useState("");

  // Significant Social Developmental History
  const [
    significantSocialDevelopmentalHistory,
    setSignificantSocialDevelopmentalHistory,
  ] = useState("");

  // Personal Information (Nested Object)
  const [educationalHistory, setEducationalHistory] = useState("");
  // const [highestEducation, setHighestEducation] = useState("");
  const [specialEducation, setSpecialEducation] = useState();
  const [currentStudent, setCurrentStudent] = useState();
  const [ifYesWhere, setIfYesWhere] = useState("");

  // Employment History (Nested Object) shishpal
  const [currentlyEmployed, setCurrentlyEmployed] = useState(false);
  const [employmentLocation, setEmploymentLocation] = useState("");
  const [workHistory, setWorkHistory] = useState("");

  // Military History (Nested Object)  shishpal
  const [militaryService, setMilitaryService] = useState(false);
  const [activeDuty, setActiveDuty] = useState("");

  // Arrested History (Multiple Fields) legalHistory
  const [selectedValue, setSelectedValue] = useState([]);

  // Current Independent Living Skills:
  const [BathingGood, setBathingGood] = useState(false);
  const [BathingFair, setBathingFair] = useState(false);
  const [BathingNotSoGood, setBathingNotSoGood] = useState(false);
  const [BathingGoodNeedAssist, setBathingGoodNeedAssist] = useState(null);
  const [BathingComments, setBathingComments] = useState("");
  const [GroomingGood, setGroomingGood] = useState(false);
  const [GroomingFair, setGroomingFair] = useState(false);
  const [GroomingNotSoGood, setGroomingNotSoGood] = useState(false);
  const [GroomingGoodNeedAssist, setGroomingGoodNeedAssist] = useState(null);
  const [GroomingComments, setGroomingComments] = useState("");
  const [MobilityGood, setMobilityGood] = useState(false);
  const [MobilityFair, setMobilityFair] = useState(false);
  const [MobilityNotSoGood, setMobilityNotSoGood] = useState(false);
  const [MobilityGoodNeedAssist, setMobilityGoodNeedAssist] = useState(null);
  const [MobilityComments, setMobilityComments] = useState("");
  const [HouseworkGood, setHouseworkGood] = useState(false);
  const [HouseworkFair, setHouseworkFair] = useState(false);
  const [HouseworkNotSoGood, setHouseworkNotSoGood] = useState(false);
  const [HouseworkGoodNeedAssist, setHouseworkGoodNeedAssist] = useState(null);
  const [HouseworkComments, setHouseworkComments] = useState("");
  const [ShoppingGood, setShoppingGood] = useState(false);
  const [ShoppingFair, setShoppingFair] = useState(false);
  const [ShoppingNotSoGood, setShoppingNotSoGood] = useState(false);
  const [ShoppingGoodNeedAssist, setShoppingGoodNeedAssist] = useState(null);
  const [ShoppingComments, setShoppingComments] = useState("");
  const [ManagingGood, setManagingGood] = useState(false);
  const [ManagingFair, setManagingFair] = useState(false);
  const [ManagingNotSoGood, setManagingNotSoGood] = useState(false);
  const [ManagingGoodNeedAssist, setManagingGoodNeedAssist] = useState(null);
  const [ManagingComments, setManagingComments] = useState("");
  const [PreparingGood, setPreparingGood] = useState(false);
  const [PreparingFair, setPreparingFair] = useState(false);
  const [PreparingNotSoGood, setPreparingNotSoGood] = useState(false);
  const [PreparingGoodNeedAssist, setPreparingGoodNeedAssist] = useState(null);
  const [PreparingComments, setPreparingComments] = useState("");
  const [EatingGood, setEatingGood] = useState(false);
  const [EatingFair, setEatingFair] = useState(false);
  const [EatingNotSoGood, setEatingNotSoGood] = useState(false);
  const [EatingGoodNeedAssist, setEatingGoodNeedAssist] = useState(null);
  const [EatingComments, setEatingComments] = useState("");
  const [ToiletingGood, setToiletingGood] = useState(false);
  const [ToiletingFair, setToiletingFair] = useState(false);
  const [ToiletingNotSoGood, setToiletingNotSoGood] = useState(false);
  const [ToiletingGoodNeedAssist, setToiletingGoodNeedAssist] = useState(null);
  const [ToiletingComments, setToiletingComments] = useState("");
  const [TakingGood, setTakingGood] = useState(false);
  const [TakingFair, setTakingFair] = useState(false);
  const [TakingNotSoGood, setTakingNotSoGood] = useState(false);
  const [TakingGoodNeedAssist, setTakingGoodNeedAssist] = useState(null);
  const [TakingComments, setTakingComments] = useState("");
  const [signers, setSigners] = useState([]);
  const [handleRiskFactorActivityArray, setHandleRiskFactorActivityArray] =
    useState([]);
  const [triggers, setTriggers] = useState("");
  const [fallRisk, setFallRisk] = useState("");
  const [fallRiskExplanation, setFallRiskExplanation] = useState("");
  const [hobbiesLeisureActivities, setHobbiesLeisureActivities] = useState("");

  // Medical Equipment
  const [selectedValueMedical, setSelectedValueMedical] = useState([]);
  // Special Precautions (Nested Object)
  const [selectedValueSpecialPrecautions, setSelectedValueSpecialPrecautions] =
    useState([]);

  // Safety and Risk Assessment shishpal
  const [currentThoughtsOfHarmingSelf, setCurrentThoughtsOfHarmingSelf] =
    useState(false);
  const [suicidalIdeation, setSuicidalIdeation] = useState("");
  const [suicidalIdeationUrgency, setSuicidalIdeationUrgency] = useState(false);
  const [suicidalIdeationSeverity, setSuicidalIdeationSeverity] =
    useState(false);
  const [currentThoughtsOfHarmingOthers, setCurrentThoughtsOfHarmingOthers] =
    useState(false);

  // Risk Factors (Nested Object)

  const [riskYesNo, setRiskYesNo] = useState(null);
  const [riskComment, setRiskComment] = useState("");
  const [PriorYesNo, setPriorYesNo] = useState(null);
  const [PriorComment, setPriorComment] = useState("");
  const [AccessYesNo, setAccessYesNo] = useState(null);
  const [AccessComment, setAccessComment] = useState("");
  const [SubstanceYesNo, setSubstanceYesNo] = useState(null);
  const [SubstanceAbuseComment, setSubstanceCommentAbuse] = useState("");
  const [abusingYesNo, setabusingYesNo] = useState(null);
  const [abusingComment, setabusingComment] = useState("");
  const [RecentYesNo, setRecentYesNo] = useState(null);
  const [RecentComment, setRecentComment] = useState("");
  const [behaviourYesNO, setBehaviourYesNo] = useState(null);
  const [behaviorcuesDropDown, setBehaviorcuesDropDown] = useState([]);
  const [SymptomsYesNO, setSymptomsYesNo] = useState(null);
  const [symptomsOfPsychosisDropDown, setSymptomsOfPsychosisDropDown] =
    useState([]);
  const [FamilyYesNO, setFamilyYesNo] = useState(null);
  const [Family, setFamily] = useState("");
  const [TerminalYesNO, setTerminalYesNo] = useState(null);
  const [Terminal, setTerminal] = useState("");
  const [CurrentYesNO, setCurrentYesNo] = useState(null);
  const [Current, setCurrent] = useState("");
  const [ChronicYesNO, setChronicYesNo] = useState(null);
  const [ChronicPain, setChronicPain] = useState("");
  const [riskFactorArray, setRiskFactoeArray] = useState([]);

  // State variables for protectiveFactors
  const [SupportsYesNo, setSupportsYesNo] = useState();
  const [SupportsComment, setSupportsComment] = useState("");
  const [SpiritualYesNo, setSpiritualYesNo] = useState();
  const [SpiritualComment, setSpiritualComment] = useState("");
  const [ReligiousYesNo, setReligiousYesNo] = useState();
  const [ReligiousComment, setReligiousComment] = useState("");
  const [FearYesNo, setFearYesNo] = useState();
  const [FearComment, setFearComment] = useState("");

  // dharmu code
  const [interventionYesNo, setInterventionYesNo] = useState();
  const [interventionComment, setInterventionComment] = useState("");
  // shishpal
  const [WillingYesNo, setWillingYesNo] = useState(false);
  const [WillingComment, setWillingComment] = useState("");
  const [protectiveFactorsArray, setProtectiveFactorsArray] = useState([]);

  // State variable for riskLevel
  const [riskLevel, setRiskLevel] = useState("");

  // State variables for psychiatricDiagnoses
  const [psychiatricPrimaryIcdCode, setPsychiatricPrimaryIcdCode] =
    useState("");
  const [psychiatricPrimaryDescription, setPsychiatricPrimaryDescription] =
    useState("");
  const [psychiatricSecondaryicdCode, setPsychiatricSecondaryIcdCode] =
    useState("");
  const [psychiatricSecondaryDescription, setPsychiatricSecondaryDescription] =
    useState("");
  const [psychiatricTertiaryIcdCode, setPsychiatricTertiaryIcdCode] =
    useState("");
  const [psychiatricTertiaryDescription, setPsychiatricTertiaryDescription] =
    useState("");
  const [psychiatricAdditionalicdCode, setPsychiatricAdditionalIcdCode] =
    useState("");
  const [
    psychiatricAdditionalDescription,
    setPsychiatricAdditionalDescription,
  ] = useState("");

  //psychiatricDiagnoses state other

  const [psychiatricDiagnosesArray, setPsychiatricDiagnosesArray] = useState(
    [],
  );

  // State variables for medicalDiagnoses
  const [primaryIcdCode, setPrimaryIcdCode] = useState("");
  const [primaryDescription, setPrimaryDescription] = useState("");
  const [secondaryicdCode, setSecondaryIcdCode] = useState("");
  const [secondaryDescription, setSecondaryDescription] = useState("");
  const [TertiaryIcdCode, setTertiaryIcdCode] = useState("");
  const [TertiaryDescription, setTertiaryDescription] = useState("");
  const [Additional1icdCode, setAdditional1IcdCode] = useState("");
  const [Additional1Description, setAdditional1Description] = useState("");
  const [medicalDiagnosesArray, setMedicalDiagnosesArray] = useState([]);

  // State variable for primarySupportGroup
  const [primarySupportGroup, setPrimarySupportGroup] = useState(false);

  // State variable for maritalProblems
  const [maritalProblems, setMaritalProblems] = useState(false);

  // State variable for accessToHealthCareServices
  const [accessToHealthCareServices, setAccessToHealthCareServices] =
    useState(false);

  // State variable for educationalProblems
  const [educationalProblems, setEducationalProblems] = useState(false);

  // State variable for housingProblems
  const [housingProblems, setHousingProblems] = useState(false);

  // State variable for familyProblems
  const [familyProblems, setFamilyProblems] = useState(false);

  // State variable for occupationalProblems
  const [occupationalProblems, setOccupationalProblems] = useState(false);

  // State variable for interactionWithLegalSystem, substanceUseInHome, sexualProblems, otherStressors
  const [interactionWithLegalSystem, setInteractionWithLegalSystem] =
    useState(false);
  const [substanceUseInHome, setSubstanceUseInHome] = useState(false);
  const [sexualProblems, setSexualProblems] = useState(false);
  const [otherBoolean, setOtherBoolean] = useState(false);
  const [otherStressors, setOtherStressors] = useState("");
  const [setNoAndYes, setSetNoAndYes] = useState(false);
  const [death, setDeath] = useState(false);
  const [job, setJob] = useState(false);
  const [childRemovedFromHouse, setChildRemovedFromHouse] = useState(false);
  const [injury, setInjury] = useState(false);
  const [divorceSeparation, setDivorceSeparation] = useState(false);
  const [violentActsAgainstPersonFamily, setViolentActsAgainstPersonFamily] =
    useState(false);
  const [medicalSurgical, setMedicalSurgical] = useState(false);
  const [accidentInjury, setAccidentInjury] = useState(false);
  const [otherSignificantRecentLosses, setOtherSignificantRecentLosses] =
    useState(false);
  const [
    otherSignificantRecentLossesType,
    setOtherSignificantRecentLossesType,
  ] = useState("");
  const [residentRepresentative, setResidentRepresentative] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [acceptResident, setAcceptResident] = useState(false);
  //gresedent gaudent name and information
  const [residentGuardianName, setResidentGuardianName] = useState("");
  const [residentGauardianSignature, setResidentGauardianSignature] =
    useState("");
  const [residentGuardianDate, setResidentGuardianDate] = useState("");
  const [residentGuardianTime, setResidentGuardianTime] = useState("");

  // State variables for staffInformation
  const [staffName, setStaffName] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [staffDate, setStaffDate] = useState("");
  const [staffDateTime, setStaffDateTime] = useState("");

  // State variables for bhpInformation
  const [bhpName, setBhpName] = useState("");
  const [bhpCredentials, setBhpCredentials] = useState("");
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpDate, setBhpDate] = useState("");
  const [bhpTime, setBhpTime] = useState("");
  const [bhrfCriteria, setBhrfCriteria] = useState([]);
  const [clinicalSummary, setClinicalSummary] = useState("");
  const [treatmentRecommendations, setTreatmentRecommendations] = useState([]);
  useEffect(() => {
    if (getApiData) {
      setSigners(getApiData.signers);
      setDob(getApiData?.patientId?.dateOfBirth);
      setDiagnosis(getApiData?.patientId?.diagnosis);
      setAhcccsId(getApiData?.patientId?.ahcccsId);
      setResidentName(getApiData?.residentName);
      setAssessmentType(getApiData?.assessmentType);
      setHasNotified(getApiData?.hasNotified);
      setAssessmentOn(getApiData?.assessmentOn);
      setCompanyName((prev) => {
        const newCompany =
          profileInfo?.userType === "admin"
            ? profileInfo?.companyName
            : profileInfo?.adminId?.companyName;
        return prev !== newCompany ? newCompany : prev;
      });
      setSex(getApiData?.patientId?.gender);
      setDateOfAssessment(
        getApiData?.patientId?.admitDate
          ? getApiData?.patientId?.admitDate?.slice(0, 10)
          : "",
      );
      setAhcccsNumber(getApiData?.ahcccsNumber);
      setPreferredLanguage(getApiData?.preferredLanguage);
      setEthnicity(getApiData?.ethnicity);
      setAdmissionStatus(getApiData?.patientId?.admissionStatus || []);
      setProgramLocation(getApiData?.programLocation);
      setGuardianship(getApiData?.guardianship);
      setPowerOfAttorneyStatus(getApiData?.powerOfAttorneyStatus);
      setTodayDate(
        getApiData?.todayDate ? getApiData?.todayDate?.slice(0, 10) : "",
      );
      setGuardianshipPoaPubFidName(getApiData?.guardianshipPoaPubFidName);
      setApprovedBy(getApiData?.approvedBy);
      const presentingProbs =
        getApiData?.reasonForAdmission?.length > 0
          ? getApiData?.reasonForAdmission
          : getApiData?.patientId?.presentingProblems;
      setReasonForAdmission(
        presentingProbs
          ? presentingProbs.map((item) => ({
              label: typeof item === "string" ? item : item?.label,
              value: typeof item === "string" ? item : item?.value,
            }))
          : [],
      );
      setResidentGoals(getApiData?.residentGoals);
      setResidentStrengths(
        getApiData?.residentStrengths
          ? getApiData?.residentStrengths?.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setResidentLimitations(
        getApiData?.barries || getApiData?.residentLimitations,
      );
      setStepDownBarriers(
        getApiData?.patientId?.stepDownBarriers ||
          getApiData?.stepDownBarriers ||
          [],
      );
      setStepDownBarriersBoolean(
        getApiData?.patientId?.stepDownBarriers?.includes("Other") ||
          getApiData?.stepDownBarriers?.includes("Other") ||
          false,
      );
      setStepDownBarriersOther(
        getApiData?.patientId?.stepDownBarriersOther ||
          getApiData?.stepDownBarriersOther ||
          "",
      );
      setStepDownBarriersText(
        getApiData?.patientId?.stepDownBarriersText ||
          getApiData?.stepDownBarriersText ||
          "",
      );
      setCurrentBehavioralIssues(
        getApiData?.patientId?.currentBehavioralIssues,
      );
      setBhrfCriteria(getApiData?.bhrfCriteria ?? []);
      setClinicalSummary(getApiData?.clinicalSummary ?? "");
      setTreatmentRecommendations(getApiData?.treatmentRecommendations ?? []);
      setTriggers(getApiData?.patientId?.triggers);
      const fRisk = getApiData?.patientId?.fallRisk;
      if (
        fRisk === true ||
        fRisk === "Yes" ||
        (typeof fRisk === "string" && fRisk.toLowerCase() === "true")
      ) {
        setFallRisk(true);
      } else if (
        fRisk === false ||
        fRisk === "No" ||
        (typeof fRisk === "string" && fRisk.toLowerCase() === "false")
      ) {
        setFallRisk(false);
      } else {
        setFallRisk("");
      }
      setFallRiskExplanation(getApiData?.patientId?.fallRiskExplanation);
      // Helper to find condition by name, ignoring index shifts.
      const getConditionData = (names) => {
        const nameArray = Array.isArray(names) ? names : [names];
        return getApiData?.medicalConditions?.find(
          (c) =>
            c?.condition &&
            nameArray.some(
              (n) => c.condition.toLowerCase() === n.toLowerCase(),
            ),
        );
      };

      const diabetesData = getConditionData("diabetes");
      setYesDiabetes(diabetesData?.yes);
      setCommentDeabetes(diabetesData?.comments ?? diabetesData?.comment ?? "");

      const heartData = getConditionData("Heart disease / heart attack");
      setYesHeart(heartData?.yes);
      setCommentHeart(heartData?.comments ?? heartData?.comment ?? "");

      const historyData = getConditionData("History");
      setYesHistory(historyData?.yes);
      setCommentHistory(historyData?.comments ?? historyData?.comment ?? "");

      const highBloodData = getConditionData("High Blood Pressure");
      setYesHigh(highBloodData?.yes);
      setCommentHigh(highBloodData?.comments ?? highBloodData?.comment ?? "");

      const lungData = getConditionData(
        "Lung disease (ie asthma, COPD, emphysema)",
      );
      setYesLung(lungData?.yes);
      setCommentLung(lungData?.comments ?? lungData?.comment ?? "");

      const seizuresData = getConditionData("Seizures");
      setYesSeizures(seizuresData?.yes);
      setCommentSeizures(seizuresData?.comments ?? seizuresData?.comment ?? "");

      const cancerData = getConditionData("Cancer");
      setYesCancer(cancerData?.yes);
      setCommentCancer(cancerData?.comments ?? cancerData?.comment ?? "");

      const liverData = getConditionData("Liver/kidney disease");
      setYesLiver(liverData?.yes);
      setCommentLiver(liverData?.comments ?? liverData?.comment ?? "");

      const thyroidData = getConditionData("Thyroid disorder");
      setYesThyroid(thyroidData?.yes);
      const tComment = thyroidData?.comment ?? thyroidData?.comments;
      setThyroidDisorder(
        Array.isArray(tComment)
          ? tComment.map((item) => ({ label: item, value: item }))
          : [],
      );

      const brainData = getConditionData(
        "History of head trauma/traumatic brain injury",
      );
      setYesBrain(brainData?.yes);
      setbrain(brainData?.comments ?? brainData?.comment ?? "");

      const injuryData = getConditionData("injury");
      setYesInjury(injuryData?.yes);
      setCommentInjury(injuryData?.comments ?? injuryData?.comment ?? "");

      const chronicData = getConditionData([
        "Chronic pain",
        "Chronic painChronic pain",
      ]);
      setYesChronic(chronicData?.yes);
      setChronicCommit(chronicData?.comments ?? chronicData?.comment ?? "");

      const allergies = getApiData?.patientId?.allergies;
      if (allergies && allergies.length > 0) {
        let isYes = undefined;
        let comments = "";
        const allergy = allergies[0];

        if (typeof allergy === "object" && allergy !== null) {
          if (allergy.yes !== undefined && allergy.yes !== null) {
            if (typeof allergy.yes === "string") {
              isYes = allergy.yes.toLowerCase() === "true";
            } else {
              isYes = Boolean(allergy.yes);
            }
          }
          comments = allergy.comments || allergy.name || "";

          if (isYes === undefined && comments) {
            isYes = true;
          }
        } else if (typeof allergy === "string") {
          comments = allergies.join(", ");
          const lowerComments = comments.toLowerCase();
          if (
            lowerComments === "none" ||
            lowerComments === "n/a" ||
            lowerComments === "no" ||
            lowerComments === "false"
          ) {
            isYes = false;
          } else {
            isYes = true;
          }
        }

        if (isYes !== undefined) {
          setAllergiesYes(isYes);
          setAllergiesComment(comments);
        } else {
          setAllergiesYes(true);
          setAllergiesComment(
            allergies
              .map((a) =>
                typeof a === "object"
                  ? a.name || a.comments || JSON.stringify(a)
                  : a,
              )
              .join(", "),
          );
        }
      } else {
        setAllergiesYes(null);
        setAllergiesComment("");
      }

      const surgeriesData = getConditionData("Surgeries");
      setSurgeriessYes(surgeriesData?.yes);
      setSurgeriesComment(
        surgeriesData?.comments ?? surgeriesData?.comment ?? "",
      );

      const pregnanciesData = getConditionData(
        "Number of pregnancies / births",
      );
      setPregnanciesYes(pregnanciesData?.yes);
      setPregnanciesComment(
        pregnanciesData?.comments ?? pregnanciesData?.comment ?? "",
      );

      const substanceData = getConditionData(
        "Substance use disorder (please specify)",
      );
      setSubstanceYes(substanceData?.yes);
      setSubstanceComment(
        substanceData?.comments ?? substanceData?.comment ?? "",
      );

      const depressionData = getConditionData("Depression");
      setDepressionYes(depressionData?.yes);
      setDepressionComment(
        depressionData?.comments ?? depressionData?.comment ?? "",
      );

      const anxietyData = getConditionData("Anxiety/panic attacks");
      setAnxietyYes(anxietyData?.yes);
      setAnxietyComment(anxietyData?.comments ?? anxietyData?.comment ?? "");

      const insomniaData = getConditionData("Insomnia");
      setInsomniaYes(insomniaData?.yes);
      setInsomniaComment(insomniaData?.comments ?? insomniaData?.comment ?? "");

      const bipolarData = getConditionData("Bipolar disorder");
      setBipolarYes(bipolarData?.yes);
      setBipolarComment(bipolarData?.comments ?? bipolarData?.comment ?? "");

      const schizophreniaData = getConditionData("Schizophrenia");
      setSchizophreniaYes(schizophreniaData?.yes);
      setSchizophreniaComment(
        schizophreniaData?.comments ?? schizophreniaData?.comment ?? "",
      );

      const obsessiveData = getConditionData("Obsessive compulsive disorder");
      setObsessiveYes(obsessiveData?.yes);
      setObsessiveComment(
        obsessiveData?.comments ?? obsessiveData?.comment ?? "",
      );

      const personalityData = getConditionData(
        "Personality disorder (please specify)",
      );
      setPersonalityYes(personalityData?.yes);
      setPersonalityComment(
        personalityData?.comments ?? personalityData?.comment ?? "",
      );

      const phobiasData = getConditionData("Phobias");
      setPhobiasYes(phobiasData?.yes);
      setPhobiasComment(phobiasData?.comments ?? phobiasData?.comment ?? "");

      const healthConditionsData = getConditionData(
        "Any other health conditions",
      );
      setHealthConditionsYes(healthConditionsData?.yes);
      sethealthConditionsYesComment(
        healthConditionsData?.comments ?? healthConditionsData?.comment ?? "",
      );

      const infectionData = getConditionData("Infection or Diseases");
      setInfectionYes(infectionData?.yes);
      const iComment = infectionData?.comment ?? infectionData?.comments;
      setInfectionDiseases(
        Array.isArray(iComment)
          ? iComment.map((item) => ({ label: item, value: item }))
          : [],
      );

      const fixedConditionNames = [
        "diabetes",
        "heart disease / heart attack",
        "history",
        "high blood pressure",
        "lung disease (ie asthma, copd, emphysema)",
        "seizures",
        "cancer",
        "liver/kidney disease",
        "thyroid disorder",
        "history of head trauma/traumatic brain injury",
        "injury",
        "chronic pain",
        "chronic painchronic pain",
        "allergies",
        "surgeries",
        "number of pregnancies / births",
        "substance use disorder (please specify)",
        "depression",
        "anxiety/panic attacks",
        "insomnia",
        "bipolar disorder",
        "schizophrenia",
        "obsessive compulsive disorder",
        "personality disorder (please specify)",
        "phobias",
        "any other health conditions",
        "infection or diseases",
      ];
      setOtherConditionArray(
        getApiData?.medicalConditions?.filter(
          (row) =>
            row?.condition &&
            !fixedConditionNames.includes(row.condition.toLowerCase()),
        ) || [],
      );

      setSignificantFamilyMedicalPsychiatricHistory(
        getApiData?.SignificantFamilyMedicalPsychiatricHistory
          ? getApiData?.SignificantFamilyMedicalPsychiatricHistory.map(
              (item) => ({
                label: item,
                value: item,
              }),
            )
          : [],
      );

      setTypeOfServicesArray(
        getApiData?.mentalHealthTreatmentHistory
          ? getApiData?.mentalHealthTreatmentHistory?.flatMap((item) => ({
              diagnosisReason: item?.diagnosisReason?.map((i) => ({
                value: i?.value,
                label: i?.label,
              })),
              typeOfService: item?.typeOfService?.map((i) => ({
                value: i?.value,
                label: i?.label,
              })),
              dates: item?.dates,
              where: item?.where,
            }))
          : [],
      );
      setSubstanceAbuseHistory(getApiData?.substanceAbuseHistory);
      setSubstanceAbuseDenies(getApiData?.substanceAbuseDenies);
      if (getApiData?.substanceAbuseHistoryData?.[0]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol(
          getApiData?.substanceAbuseHistoryData?.[0]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseAlcohol(
          getApiData?.substanceAbuseHistoryData?.[0]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[0]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[0]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyAlcohol(
          getApiData?.substanceAbuseHistoryData?.[0]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[0]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[0]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyAlcohol(
          getApiData?.substanceAbuseHistoryData?.[0]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[0]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[0]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol("");
        setSubstanceAbuseHistoryDataLastUseAlcohol("");
        setSubstanceAbuseHistoryDataFrequencyAlcohol("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyAlcohol("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[1]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines(
          getApiData?.substanceAbuseHistoryData?.[1]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseBenzodiazepines(
          getApiData?.substanceAbuseHistoryData?.[1]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[1]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[1]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyBenzodiazepines(
          getApiData?.substanceAbuseHistoryData?.[1]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[1]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[1]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines(
          getApiData?.substanceAbuseHistoryData?.[1]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[1]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[1]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines("");
        setSubstanceAbuseHistoryDataLastUseBenzodiazepines("");
        setSubstanceAbuseHistoryDataFrequencyBenzodiazepines("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[2]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseCrack(
          getApiData?.substanceAbuseHistoryData?.[2]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseCrack(
          getApiData?.substanceAbuseHistoryData?.[2]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[2]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[2]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyCrack(
          getApiData?.substanceAbuseHistoryData?.[2]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[2]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[2]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyCrack(
          getApiData?.substanceAbuseHistoryData?.[2]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[2]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[2]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseCrack("");
        setSubstanceAbuseHistoryDataLastUseCrack("");
        setSubstanceAbuseHistoryDataFrequencyCrack("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyCrack("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[3]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseHeroin(
          getApiData?.substanceAbuseHistoryData?.[3]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseHeroin(
          getApiData?.substanceAbuseHistoryData?.[3]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[3]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[3]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyHeroin(
          getApiData?.substanceAbuseHistoryData?.[3]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[3]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[3]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyHeroin(
          getApiData?.substanceAbuseHistoryData?.[3]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[3]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[3]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseHeroin("");
        setSubstanceAbuseHistoryDataLastUseHeroin("");
        setSubstanceAbuseHistoryDataFrequencyHeroin("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyHeroin("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[4]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseInhalants(
          getApiData?.substanceAbuseHistoryData?.[4]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseInhalants(
          getApiData?.substanceAbuseHistoryData?.[4]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[4]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[4]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyInhalants(
          getApiData?.substanceAbuseHistoryData?.[4]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[4]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[4]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyInhalants(
          getApiData?.substanceAbuseHistoryData?.[4]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[4]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[4]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseInhalants("");
        setSubstanceAbuseHistoryDataLastUseInhalants("");
        setSubstanceAbuseHistoryDataFrequencyInhalants("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyInhalants("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[5]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMarijuana(
          getApiData?.substanceAbuseHistoryData?.[5]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseMarijuana(
          getApiData?.substanceAbuseHistoryData?.[5]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[5]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[5]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyMarijuana(
          getApiData?.substanceAbuseHistoryData?.[5]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[5]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[5]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyMarijuana(
          getApiData?.substanceAbuseHistoryData?.[5]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[5]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[5]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMarijuana("");
        setSubstanceAbuseHistoryDataLastUseMarijuana("");
        setSubstanceAbuseHistoryDataFrequencyMarijuana("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyMarijuana("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[6]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMethamphetamine(
          getApiData?.substanceAbuseHistoryData?.[6]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseMethamphetamine(
          getApiData?.substanceAbuseHistoryData?.[6]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[6]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[6]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyMethamphetamine(
          getApiData?.substanceAbuseHistoryData?.[6]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[6]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[6]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyMethamphetamine(
          getApiData?.substanceAbuseHistoryData?.[6]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[6]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[6]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMethamphetamine("");
        setSubstanceAbuseHistoryDataLastUseMethamphetamine("");
        setSubstanceAbuseHistoryDataFrequencyMethamphetamine("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyMethamphetamine("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[7]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMethadone(
          getApiData?.substanceAbuseHistoryData?.[7]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseMethadone(
          getApiData?.substanceAbuseHistoryData?.[7]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[7]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[7]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyMethadone(
          getApiData?.substanceAbuseHistoryData?.[7]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[7]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[7]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyMethadone(
          getApiData?.substanceAbuseHistoryData?.[7]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[7]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[7]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMethadone("");
        setSubstanceAbuseHistoryDataLastUseMethadone("");
        setSubstanceAbuseHistoryDataFrequencyMethadone("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyMethadone("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[8]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMDMA(
          getApiData?.substanceAbuseHistoryData?.[8]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseMDMA(
          getApiData?.substanceAbuseHistoryData?.[8]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[8]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[8]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyMDMA(
          getApiData?.substanceAbuseHistoryData?.[8]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[8]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[8]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyMDMA(
          getApiData?.substanceAbuseHistoryData?.[8]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[8]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[8]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseMDMA("");
        setSubstanceAbuseHistoryDataLastUseMDMA("");
        setSubstanceAbuseHistoryDataFrequencyMDMA("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyMDMA("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[9]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUsePCP(
          getApiData?.substanceAbuseHistoryData?.[9]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUsePCP(
          getApiData?.substanceAbuseHistoryData?.[9]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[9]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[9]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyPCP(
          getApiData?.substanceAbuseHistoryData?.[9]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[9]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[9]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyPCP(
          getApiData?.substanceAbuseHistoryData?.[9]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[9]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[9]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUsePCP("");
        setSubstanceAbuseHistoryDataLastUsePCP("");
        setSubstanceAbuseHistoryDataFrequencyPCP("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyPCP("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[10]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUsePrescription(
          getApiData?.substanceAbuseHistoryData?.[10]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUsePrescription(
          getApiData?.substanceAbuseHistoryData?.[10]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[10]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[10]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyPrescription(
          getApiData?.substanceAbuseHistoryData?.[10]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[10]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[10]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyPrescription(
          getApiData?.substanceAbuseHistoryData?.[10]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[10]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[10]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUsePrescription("");
        setSubstanceAbuseHistoryDataLastUsePrescription("");
        setSubstanceAbuseHistoryDataFrequencyPrescription("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyPrescription("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[11]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseOTC(
          getApiData?.substanceAbuseHistoryData?.[11]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseOTC(
          getApiData?.substanceAbuseHistoryData?.[11]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[11]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[11]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyOTC(
          getApiData?.substanceAbuseHistoryData?.[11]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[11]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[11]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyOTC(
          getApiData?.substanceAbuseHistoryData?.[11]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[11]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[11]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseOTC("");
        setSubstanceAbuseHistoryDataLastUseOTC("");
        setSubstanceAbuseHistoryDataFrequencyOTC("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyOTC("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[12]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseCocaine(
          getApiData?.substanceAbuseHistoryData?.[12]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseCocaine(
          getApiData?.substanceAbuseHistoryData?.[12]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[12]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[12]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyCocaine(
          getApiData?.substanceAbuseHistoryData?.[12]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[12]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[12]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyCocaine(
          getApiData?.substanceAbuseHistoryData?.[12]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[12]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[12]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseCocaine("");
        setSubstanceAbuseHistoryDataLastUseCocaine("");
        setSubstanceAbuseHistoryDataFrequencyCocaine("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyCocaine("");
      }
      if (getApiData?.substanceAbuseHistoryData?.[13]) {
        setSubstanceAbuseHistoryDataAgeOfFirstUseHallucinogens(
          getApiData?.substanceAbuseHistoryData?.[13]?.ageOfFirstUse,
        );
        setSubstanceAbuseHistoryDataLastUseHallucinogens(
          getApiData?.substanceAbuseHistoryData?.[13]?.lastUse
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[13]?.lastUse,
                value: getApiData?.substanceAbuseHistoryData?.[13]?.lastUse,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataFrequencyHallucinogens(
          getApiData?.substanceAbuseHistoryData?.[13]?.frequency
            ? {
                label: getApiData?.substanceAbuseHistoryData?.[13]?.frequency,
                value: getApiData?.substanceAbuseHistoryData?.[13]?.frequency,
              }
            : "",
        );
        setSubstanceAbuseHistoryDataLengthOfSobrietyHallucinogens(
          getApiData?.substanceAbuseHistoryData?.[13]?.lengthOfSobriety
            ? {
                label:
                  getApiData?.substanceAbuseHistoryData?.[13]?.lengthOfSobriety,
                value:
                  getApiData?.substanceAbuseHistoryData?.[13]?.lengthOfSobriety,
              }
            : "",
        );
      } else {
        setSubstanceAbuseHistoryDataAgeOfFirstUseHallucinogens("");
        setSubstanceAbuseHistoryDataLastUseHallucinogens("");
        setSubstanceAbuseHistoryDataFrequencyHallucinogens("");
        setSubstanceAbuseHistoryDataLengthOfSobrietyHallucinogens("");
      }
      setTypeArray(
        getApiData?.substanceAbuseHistoryData
          ? getApiArrayData(
              14,
              getApiData?.substanceAbuseHistoryData?.length,
              getApiData?.substanceAbuseHistoryData,
            )
          : [],
      );

      // start
      setNoneReportedOrObserved(
        getApiData?.ActiveWithdrawalSymptoms?.noneReportedOrObserved,
      );
      setAgitation(getApiData?.ActiveWithdrawalSymptoms?.Agitation);
      setNausea(getApiData?.ActiveWithdrawalSymptoms?.Nausea);
      setVomiting(getApiData?.ActiveWithdrawalSymptoms?.Vomiting);
      setHeadache(getApiData?.ActiveWithdrawalSymptoms?.Headache);
      setTactileDisturbances(
        getApiData?.ActiveWithdrawalSymptoms?.TactileDisturbances,
      );
      setAnxiety(getApiData?.ActiveWithdrawalSymptoms?.Anxiety);
      setTremors(getApiData?.ActiveWithdrawalSymptoms?.Tremors);
      setVisualDisturbances(
        getApiData?.ActiveWithdrawalSymptoms?.VisualDisturbances,
      );
      setVisualDisturbancesOtherBoolean(
        getApiData?.ActiveWithdrawalSymptoms?.AuditoryDisturbances
          ? true
          : false,
      );
      setVisualDisturbancesOtherType(
        getApiData?.ActiveWithdrawalSymptoms?.AuditoryDisturbances,
      );
      setSweats(getApiData?.ActiveWithdrawalSymptoms?.Sweats);
      setParanoia(getApiData?.ActiveWithdrawalSymptoms?.Paranoia);
      setGooseBumps(getApiData?.ActiveWithdrawalSymptoms?.GooseBumps);
      setRunningnose(getApiData?.ActiveWithdrawalSymptoms?.Runningnose);
      setBonePain(getApiData?.ActiveWithdrawalSymptoms?.BonePain);
      setTearing(getApiData?.ActiveWithdrawalSymptoms?.Tearing);
      setSeizures(getApiData?.ActiveWithdrawalSymptoms?.Seizures);
      setLossofMuscleCoordination(
        getApiData?.ActiveWithdrawalSymptoms?.LossofMuscleCoordination,
      );
      setLossofMuscleCoordinationBoolean(
        getApiData?.ActiveWithdrawalSymptoms?.LossofMuscleCoordinationOtherType
          ? true
          : false,
      );
      setLossofMuscleCoordinationType(
        getApiData?.ActiveWithdrawalSymptoms?.LossofMuscleCoordinationOtherType,
      );
      setConsistent(getApiData?.mentalStatusExam?.apparentAge?.consistent);
      setYounger(getApiData?.mentalStatusExam?.apparentAge?.younger);
      setOlder(getApiData?.mentalStatusExam?.apparentAge?.older);
      setOlderOtherBoolean(
        getApiData?.mentalStatusExam?.apparentAge?.otherComment ? true : false,
      );
      setOlderOther(getApiData?.mentalStatusExam?.apparentAge?.otherComment);
      setAverageHeight(getApiData?.mentalStatusExam?.height?.average);
      setShort(getApiData?.mentalStatusExam?.height?.short);
      setTall(getApiData?.mentalStatusExam?.height?.tall);
      setHeigthBoolean(
        getApiData?.mentalStatusExam?.height?.otherComment ? true : false,
      );
      setHeigthOther(getApiData?.mentalStatusExam?.height?.otherComment);
      setAverageWeight(getApiData?.mentalStatusExam?.weight?.average);
      setObese(getApiData?.mentalStatusExam?.weight?.obese);
      setOverweight(getApiData?.mentalStatusExam?.weight?.overweight);
      setThin(getApiData?.mentalStatusExam?.weight?.thin);
      setEmaciated(getApiData?.mentalStatusExam?.weight?.emaciated);
      setWeightBoolean(
        getApiData?.mentalStatusExam?.weight?.otherComment ? true : false,
      );
      setWeightOther(getApiData?.mentalStatusExam?.weight?.otherComment);
      setCasual(getApiData?.mentalStatusExam?.attire?.Casual);
      setNeat(getApiData?.mentalStatusExam?.attire?.Neat);
      setTattered(getApiData?.mentalStatusExam?.attire?.Tattered);
      setDirty(getApiData?.mentalStatusExam?.attire?.Dirty);
      setAttireBoolaen(
        getApiData?.mentalStatusExam?.attire?.otherComment ? true : false,
      );
      setAttireOther(getApiData?.mentalStatusExam?.attire?.otherComment);
      setWellGroomed(getApiData?.mentalStatusExam?.grooming?.wellGroomed);
      setAdequateGrooming(getApiData?.mentalStatusExam?.grooming?.adequate);
      setUnkempt(getApiData?.mentalStatusExam?.grooming?.unkempt);
      setDisheveled(getApiData?.mentalStatusExam?.grooming?.disheveled);
      setGroomingBoolean(
        getApiData?.mentalStatusExam?.grooming?.otherComment ? true : false,
      );
      setGroomingOther(getApiData?.mentalStatusExam?.grooming?.otherComment);
      setEuthymic(getApiData?.mentalStatusExam?.Mood?.Euthymic);
      setIrritable(getApiData?.mentalStatusExam?.Mood?.Irritable);
      setElevated(getApiData?.mentalStatusExam?.Mood?.Elevated);
      setDepressedMood(getApiData?.mentalStatusExam?.Mood?.Depressed);
      setAnxious(getApiData?.mentalStatusExam?.Mood?.Anxious);
      seteuthymicOtherBoolean(
        getApiData?.mentalStatusExam?.Mood?.otherComment ? true : false,
      );
      seteuthymicOtherBooleanType(
        getApiData?.mentalStatusExam?.Mood?.otherComment,
      );
      setNormalRange(getApiData?.mentalStatusExam?.Affect?.normalRange);
      setDepressedAffect(getApiData?.mentalStatusExam?.Affect?.Depressed);
      setLabile(getApiData?.mentalStatusExam?.Affect?.Labile);
      setConstricted(getApiData?.mentalStatusExam?.Affect?.Constricted);
      setOther(
        getApiData?.mentalStatusExam?.Affect?.otherComment ? true : false,
      );
      setOtherText(getApiData?.mentalStatusExam?.Affect?.otherComment);
      setAppropriate(getApiData?.mentalStatusExam?.EyeContact?.Appropriate);
      setMinimal(getApiData?.mentalStatusExam?.EyeContact?.Minimal);
      setPoor(getApiData?.mentalStatusExam?.EyeContact?.Poor);
      setAdequateEyeContact(getApiData?.mentalStatusExam?.EyeContact?.Adequate);
      setEyeContactOtherBoolean(
        getApiData?.mentalStatusExam?.EyeContact?.otherComment ? true : false,
      );
      setEyeContactOtherBooleanType(
        getApiData?.mentalStatusExam?.EyeContact?.otherComment,
      );
      setAppropriateCooperation(
        getApiData?.mentalStatusExam?.Cooperation?.Appropriate,
      );
      setHostile(getApiData?.mentalStatusExam?.Cooperation?.Hostile);
      setEvasive(getApiData?.mentalStatusExam?.Cooperation?.Evasive);
      setDefensive(getApiData?.mentalStatusExam?.Cooperation?.Defensive);
      setIndifferent(getApiData?.mentalStatusExam?.Cooperation?.Indifferent);
      setCooperationOtherBoolean(
        getApiData?.mentalStatusExam?.Cooperation?.otherComment ? true : false,
      );
      setCooperationOtherBooleanType(
        getApiData?.mentalStatusExam?.Cooperation?.otherComment,
      );
      setNormalArticulation(getApiData?.mentalStatusExam?.Articulation?.Normal);
      setUnintelligible(
        getApiData?.mentalStatusExam?.Articulation?.Unintelligible,
      );
      setMumbled(getApiData?.mentalStatusExam?.Articulation?.Mumbled);
      setSlurred(getApiData?.mentalStatusExam?.Articulation?.Slurred);
      setStuttered(getApiData?.mentalStatusExam?.Articulation?.Stuttered);
      setArticulationOtherBoolean(
        getApiData?.mentalStatusExam?.Articulation?.otherComment ? true : false,
      );
      setArticulationOtherBooleanOther(
        getApiData?.mentalStatusExam?.Articulation?.otherComment,
      );
      setNormalTone(getApiData?.mentalStatusExam?.Tone?.Normal);
      setSoft(getApiData?.mentalStatusExam?.Tone?.Soft);
      setLoud(getApiData?.mentalStatusExam?.Tone?.Loud);
      setPressured(getApiData?.mentalStatusExam?.Tone?.Pressured);
      setToneOtherBoolean(
        getApiData?.mentalStatusExam?.Tone?.otherComment ? true : false,
      );
      setToneOtherBooleanOther(
        getApiData?.mentalStatusExam?.Tone?.otherComment,
      );
      setNormalRate(getApiData?.mentalStatusExam?.Rate?.Normal);
      setSlow(getApiData?.mentalStatusExam?.Rate?.Slow);
      setFast(getApiData?.mentalStatusExam?.Rate?.Fast);
      setRateOtherBoolean(
        getApiData?.mentalStatusExam?.Rate?.otherComment ? true : false,
      );
      setRateOtherBooleanOther(
        getApiData?.mentalStatusExam?.Rate?.otherComment,
      );
      setNormalQuantity(getApiData?.mentalStatusExam?.Quantity?.Normal);
      setVerbose(getApiData?.mentalStatusExam?.Quantity?.Verbose);
      setMutism(getApiData?.mentalStatusExam?.Quantity?.Mutism);
      setQuantityOtherBoolean(
        getApiData?.mentalStatusExam?.Quantity?.otherComment ? true : false,
      );
      setQuantityOtherBooleanOther(
        getApiData?.mentalStatusExam?.Quantity?.otherComment,
      );
      setNormalresponseLatency(
        getApiData?.mentalStatusExam?.responseLatency?.Normal,
      );
      setDelayed(getApiData?.mentalStatusExam?.responseLatency?.Delayed);
      setShortened(getApiData?.mentalStatusExam?.responseLatency?.Shortened);
      setresponseLatencyOtherBoolean(
        getApiData?.mentalStatusExam?.responseLatency?.otherComment
          ? true
          : false,
      );
      setresponseLatencyOtherBooleanOther(
        getApiData?.mentalStatusExam?.responseLatency?.otherComment,
      );
      setUnremarkablethoughtContent(
        getApiData?.mentalStatusExam?.thoughtContent?.Unremarkable,
      );
      setSuspicious(getApiData?.mentalStatusExam?.thoughtContent?.Suspicious);
      setNegative(getApiData?.mentalStatusExam?.thoughtContent?.Negative);
      setConcrete(getApiData?.mentalStatusExam?.thoughtContent?.Concrete);
      setthoughtContentBoolean(
        getApiData?.mentalStatusExam?.thoughtContent?.otherComment
          ? true
          : false,
      );
      setThoughtContentOther(
        getApiData?.mentalStatusExam?.thoughtContent?.otherComment,
      );
      setLogicalCoherent(
        getApiData?.mentalStatusExam?.thoughtProcesses?.logicalCoherent,
      );
      setTangential(getApiData?.mentalStatusExam?.thoughtProcesses?.Tangential);
      setCircumstantial(
        getApiData?.mentalStatusExam?.thoughtProcesses?.Circumstantial,
      );
      setVague(getApiData?.mentalStatusExam?.thoughtProcesses?.Vague);
      setThoughtProcessesBoolaen(
        getApiData?.mentalStatusExam?.thoughtProcesses?.otherComment
          ? true
          : false,
      );
      setThoughtProcessesOther(
        getApiData?.mentalStatusExam?.thoughtProcesses?.otherComment,
      );
      setNoDelusions(getApiData?.mentalStatusExam?.Delusions?.No);
      setYesPersecutory(
        getApiData?.mentalStatusExam?.Delusions?.YesPersecutory,
      );
      setYesSomatic(getApiData?.mentalStatusExam?.Delusions?.YesSomatic);
      setYesGrandiose(getApiData?.mentalStatusExam?.Delusions?.YesGrandiose);
      setYesOtherDelusionsBoolean(
        getApiData?.mentalStatusExam?.Delusions?.otherComment ? true : false,
      );
      setYesOtherDelusionsText(
        getApiData?.mentalStatusExam?.Delusions?.otherComment,
      );
      setUnremarkableHallucinations(
        getApiData?.mentalStatusExam?.Hallucinations?.Unremarkable,
      );
      setVisualHallucinations(
        getApiData?.mentalStatusExam?.Hallucinations?.VisualHallucinations,
      );
      setAuditoryHallucinations(
        getApiData?.mentalStatusExam?.Hallucinations?.AuditoryHallucinations,
      );
      setTactileHallucinations(
        getApiData?.mentalStatusExam?.Hallucinations?.TactileHallucinations,
      );
      setYesOtherHallucinationsBoolean(
        getApiData?.mentalStatusExam?.Hallucinations?.otherComment
          ? true
          : false,
      );
      setYesOtherHallucinationsText(
        getApiData?.mentalStatusExam?.Hallucinations?.otherComment,
      );
      setNormalGait(getApiData?.mentalStatusExam?.Gait?.Normal);
      setStaggering(getApiData?.mentalStatusExam?.Gait?.Staggering);
      setShuffling(getApiData?.mentalStatusExam?.Gait?.Shuffling);
      setSlowGait(getApiData?.mentalStatusExam?.Gait?.Slow);
      setAwkward(getApiData?.mentalStatusExam?.Gait?.Awkward);
      setGailOtherBoolen(
        getApiData?.mentalStatusExam?.Gait?.otherComment ? true : false,
      );
      setgetOther(getApiData?.mentalStatusExam?.Gait?.otherComment);
      setNormalPosture(getApiData?.mentalStatusExam?.Posture?.Normal);
      setRelaxed(getApiData?.mentalStatusExam?.Posture?.Relaxed);
      setRigid(getApiData?.mentalStatusExam?.Posture?.Rigid);
      setTense(getApiData?.mentalStatusExam?.Posture?.Tense);
      setSlouched(getApiData?.mentalStatusExam?.Posture?.Slouched);
      setgaitOtherBoolen(
        getApiData?.mentalStatusExam?.Posture?.otherComment ? true : false,
      );
      setPostureOther(getApiData?.mentalStatusExam?.Posture?.otherComment);
      setWithinNormalLimits(
        getApiData?.mentalStatusExam?.PsychomotorActivity?.Withinnormallimits,
      );
      setCalm(getApiData?.mentalStatusExam?.PsychomotorActivity?.Calm);
      setHyperactive(
        getApiData?.mentalStatusExam?.PsychomotorActivity?.Hyperactive,
      );
      setAgitated(getApiData?.mentalStatusExam?.PsychomotorActivity?.Agitated);
      setHypoactive(
        getApiData?.mentalStatusExam?.PsychomotorActivity?.Hypoactive,
      );
      setPsychomotorActivityOtherBoolen(
        getApiData?.mentalStatusExam?.PsychomotorActivity?.otherComment
          ? true
          : false,
      );
      setPsychomotorActivityOther(
        getApiData?.mentalStatusExam?.PsychomotorActivity?.otherComment,
      );
      setNone(getApiData?.mentalStatusExam?.Mannerisms?.None);
      setTics(getApiData?.mentalStatusExam?.Mannerisms?.Tics);
      setTremorsMannerisms(getApiData?.mentalStatusExam?.Mannerisms?.Tremors);
      setRocking(getApiData?.mentalStatusExam?.Mannerisms?.Rocking);
      setPicking(getApiData?.mentalStatusExam?.Mannerisms?.Picking);
      setMannerismsOtherBoolen(
        getApiData?.mentalStatusExam?.Mannerisms?.otherComment ? true : false,
      );
      setMannerismsOther(
        getApiData?.mentalStatusExam?.Mannerisms?.otherComment,
      );
      setPerson(getApiData?.mentalStatusExam?.orientation?.person);
      setPlace(getApiData?.mentalStatusExam?.orientation?.place);
      setTime(getApiData?.mentalStatusExam?.orientation?.time);
      setCircumstances(
        getApiData?.mentalStatusExam?.orientation?.circumstances,
      );
      setGoodJudgment(getApiData?.mentalStatusExam?.Judgment?.Good);
      setFairJudgment(getApiData?.mentalStatusExam?.Judgment?.Fair);
      setPoorJudgment(getApiData?.mentalStatusExam?.Insight?.Poor);
      setGoodInsight(getApiData?.mentalStatusExam?.Judgment?.Good);
      setFairInsight(getApiData?.mentalStatusExam?.Insight?.Fair);
      setPoorInsight(getApiData?.mentalStatusExam?.Insight?.Poor);
      setGoodMemory(getApiData?.mentalStatusExam?.Memory?.Good);
      setFairMemory(getApiData?.mentalStatusExam?.Memory?.Fair);
      setPoorMemory(getApiData?.mentalStatusExam?.Memory?.Poor);
      setIntactAbilityToConcentration(
        getApiData?.mentalStatusExam?.AbilityToConcentration?.Intact,
      );
      setIntactAbilityToConcentrationOtherBoolean(
        getApiData?.mentalStatusExam?.AbilityToConcentration?.Other
          ? true
          : false,
      );
      setOtherAbilityToConcentration(
        getApiData?.mentalStatusExam?.AbilityToConcentration?.Other,
      );
      setSignificantSocialDevelopmentalHistory(
        getApiData?.significantSocialDevelopmentalHistory,
      );
      setEducationalHistory(
        getApiData?.personalInformation?.educationalHistory,
      );
      // setHighestEducation(getApiData?.personalInformation?.highestEducation);
      setSpecialEducation(getApiData?.personalInformation?.specialEducation);
      setCurrentStudent(getApiData?.personalInformation?.currentStudent);
      setIfYesWhere(getApiData?.personalInformation?.currentStudentLocation);
      setCurrentlyEmployed(getApiData?.employmentHistory?.currentlyEmployed);
      setEmploymentLocation(getApiData?.employmentHistory?.employmentLocation);
      setWorkHistory(getApiData?.workHistory);
      setMilitaryService(getApiData?.militaryHistory?.militaryService);
      setActiveDuty(getApiData?.militaryHistory?.activeDuty);
      setSelectedValue(
        getApiData?.legalHistory
          ? getApiData?.legalHistory.map((item) => ({
              label: item,
              // Assuming 'name' is the property you want to use as label
              value: item, // Assuming 'id' is the property you want to use as value
            }))
          : [],
      );
      if (getApiData?.independentLivingSkills?.[0]) {
        setBathingGood(getApiData?.independentLivingSkills?.[0]?.good);
        setBathingFair(getApiData?.independentLivingSkills?.[0]?.fair);
        setBathingNotSoGood(
          getApiData?.independentLivingSkills?.[0]?.otherCurrentNotSoGood,
        );
        setBathingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[0]?.needAssist,
        );
        setBathingComments(getApiData?.independentLivingSkills?.[0]?.comments);
      } else {
        setBathingGood(false);
        setBathingFair(false);
        setBathingNotSoGood(false);
        setBathingGoodNeedAssist(null);
        setBathingComments("");
      }
      if (getApiData?.independentLivingSkills?.[1]) {
        setGroomingGood(getApiData?.independentLivingSkills?.[1]?.good);
        setGroomingFair(getApiData?.independentLivingSkills?.[1]?.fair);
        setGroomingNotSoGood(
          getApiData?.independentLivingSkills?.[1]?.otherCurrentNotSoGood,
        );
        setGroomingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[1]?.needAssist,
        );
        setGroomingComments(getApiData?.independentLivingSkills?.[1]?.comments);
      } else {
        setGroomingGood(false);
        setGroomingFair(false);
        setGroomingNotSoGood(false);
        setGroomingGoodNeedAssist(null);
        setGroomingComments("");
      }
      if (getApiData?.independentLivingSkills?.[2]) {
        setMobilityGood(getApiData?.independentLivingSkills?.[2]?.good);
        setMobilityFair(getApiData?.independentLivingSkills?.[2]?.fair);
        setMobilityNotSoGood(
          getApiData?.independentLivingSkills?.[2]?.otherCurrentNotSoGood,
        );
        setMobilityGoodNeedAssist(
          getApiData?.independentLivingSkills?.[2]?.needAssist,
        );
        setMobilityComments(getApiData?.independentLivingSkills?.[2]?.comments);
      } else {
        setMobilityGood(false);
        setMobilityFair(false);
        setMobilityNotSoGood(false);
        setMobilityGoodNeedAssist(null);
        setMobilityComments("");
      }
      if (getApiData?.independentLivingSkills?.[3]) {
        setHouseworkGood(getApiData?.independentLivingSkills?.[3]?.good);
        setHouseworkFair(getApiData?.independentLivingSkills?.[3]?.fair);
        setHouseworkNotSoGood(
          getApiData?.independentLivingSkills?.[3]?.otherCurrentNotSoGood,
        );
        setHouseworkGoodNeedAssist(
          getApiData?.independentLivingSkills?.[3]?.needAssist,
        );
        setHouseworkComments(
          getApiData?.independentLivingSkills?.[3]?.comments,
        );
      } else {
        setHouseworkGood(false);
        setHouseworkFair(false);
        setHouseworkNotSoGood(false);
        setHouseworkGoodNeedAssist(null);
        setHouseworkComments("");
      }

      // Shopping
      if (getApiData?.independentLivingSkills?.[4]) {
        setShoppingGood(getApiData?.independentLivingSkills?.[4]?.good);
        setShoppingFair(getApiData?.independentLivingSkills?.[4]?.fair);
        setShoppingNotSoGood(
          getApiData?.independentLivingSkills?.[4]?.otherCurrentNotSoGood,
        );
        setShoppingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[4]?.needAssist,
        );
        setShoppingComments(getApiData?.independentLivingSkills?.[4]?.comments);
      } else {
        setShoppingGood(false);
        setShoppingFair(false);
        setShoppingNotSoGood(false);
        setShoppingGoodNeedAssist(null);
        setShoppingComments("");
      }

      // Managing
      if (getApiData?.independentLivingSkills?.[5]) {
        setManagingGood(getApiData?.independentLivingSkills?.[5]?.good);
        setManagingFair(getApiData?.independentLivingSkills?.[5]?.fair);
        setManagingNotSoGood(
          getApiData?.independentLivingSkills?.[5]?.otherCurrentNotSoGood,
        );
        setManagingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[5]?.needAssist,
        );
        setManagingComments(getApiData?.independentLivingSkills?.[5]?.comments);
      } else {
        setManagingGood(false);
        setManagingFair(false);
        setManagingNotSoGood(false);
        setManagingGoodNeedAssist(null);
        setManagingComments("");
      }

      // Preparing
      if (getApiData?.independentLivingSkills?.[6]) {
        setPreparingGood(getApiData?.independentLivingSkills?.[6]?.good);
        setPreparingFair(getApiData?.independentLivingSkills?.[6]?.fair);
        setPreparingNotSoGood(
          getApiData?.independentLivingSkills?.[6]?.otherCurrentNotSoGood,
        );
        setPreparingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[6]?.needAssist,
        );
        setPreparingComments(
          getApiData?.independentLivingSkills?.[6]?.comments,
        );
      } else {
        setPreparingGood(false);
        setPreparingFair(false);
        setPreparingNotSoGood(false);
        setPreparingGoodNeedAssist(null);
        setPreparingComments("");
      }

      // Eating
      if (getApiData?.independentLivingSkills?.[7]) {
        setEatingGood(getApiData?.independentLivingSkills?.[7]?.good);
        setEatingFair(getApiData?.independentLivingSkills?.[7]?.fair);
        setEatingNotSoGood(
          getApiData?.independentLivingSkills?.[7]?.otherCurrentNotSoGood,
        );
        setEatingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[7]?.needAssist,
        );
        setEatingComments(getApiData?.independentLivingSkills?.[7]?.comments);
      } else {
        setEatingGood(false);
        setEatingFair(false);
        setEatingNotSoGood(false);
        setEatingGoodNeedAssist(null);
        setEatingComments("");
      }

      // Toileting
      if (getApiData?.independentLivingSkills?.[8]) {
        setToiletingGood(getApiData?.independentLivingSkills?.[8]?.good);
        setToiletingFair(getApiData?.independentLivingSkills?.[8]?.fair);
        setToiletingNotSoGood(
          getApiData?.independentLivingSkills?.[8]?.otherCurrentNotSoGood,
        );
        setToiletingGoodNeedAssist(
          getApiData?.independentLivingSkills?.[8]?.needAssist,
        );
        setToiletingComments(
          getApiData?.independentLivingSkills?.[8]?.comments,
        );
      } else {
        setToiletingGood(false);
        setToiletingFair(false);
        setToiletingNotSoGood(false);
        setToiletingGoodNeedAssist(null);
        setToiletingComments("");
      }
      setTakingGood(getApiData?.independentLivingSkills?.[9]?.good);
      setTakingFair(getApiData?.independentLivingSkills?.[9]?.fair);
      setTakingNotSoGood(
        getApiData?.independentLivingSkills?.[9]?.otherCurrentNotSoGood,
      );
      setTakingGoodNeedAssist(
        getApiData?.independentLivingSkills?.[9]?.needAssist,
      );
      setTakingComments(getApiData?.independentLivingSkills?.[9]?.comments);
      setHandleRiskFactorActivityArray(
        getApiData?.independentLivingSkills
          ? getApiArrayData(
              10,
              getApiData?.independentLivingSkills?.length,
              getApiData?.independentLivingSkills,
            )
          : [],
      );

      setHobbiesLeisureActivities(getApiData?.hobbiesLeisureActivities);
      setSelectedValueMedical(
        getApiData?.medicalEquipmentArray
          ? getApiData?.medicalEquipmentArray.map((item) => ({
              label: item,
              // Assuming 'name' is the property you want to use as label
              value: item, // Assuming 'id' is the property you want to use as value
            }))
          : [],
      );
      setSelectedValueSpecialPrecautions(
        getApiData?.specialPrecautions
          ? getApiData?.specialPrecautions.map((item) => ({
              label: item,
              // Assuming 'name' is the property you want to use as label
              value: item, // Assuming 'id' is the property you want to use as value
            }))
          : [],
      );
      setCurrentThoughtsOfHarmingSelf(getApiData?.currentThoughtsOfHarmingSelf);
      setSuicidalIdeation(getApiData?.suicidalIdeation);
      setSuicidalIdeationUrgency(getApiData?.suicidalIdeationUrgency);
      setSuicidalIdeationSeverity(getApiData?.suicidalIdeationSeverity);
      setCurrentThoughtsOfHarmingOthers(
        getApiData?.currentThoughtsOfHarmingOthers,
      );
      if (getApiData?.riskFactors?.[0]) {
        setRiskYesNo(getApiData?.riskFactors?.[0]?.yesNo);
        setRiskComment(getApiData?.riskFactors?.[0]?.comment);
      } else {
        setRiskYesNo(null);
        setRiskComment("");
      }
      if (getApiData?.riskFactors?.[1]) {
        setPriorYesNo(getApiData?.riskFactors?.[1]?.yesNo);
        setPriorComment(getApiData?.riskFactors?.[1]?.comment);
      } else {
        setPriorYesNo(null);
        setPriorComment("");
      }
      if (getApiData?.riskFactors?.[2]) {
        setAccessYesNo(getApiData?.riskFactors?.[2]?.yesNo);
        setAccessComment(getApiData?.riskFactors?.[2]?.comment);
      } else {
        setAccessYesNo(null);
        setAccessComment("");
      }
      if (getApiData?.riskFactors?.[3]) {
        setSubstanceYesNo(getApiData?.riskFactors?.[3]?.yesNo);
        setSubstanceCommentAbuse(getApiData?.riskFactors?.[3]?.comment);
      } else {
        setSubstanceYesNo(null);
        setSubstanceCommentAbuse("");
      }
      if (getApiData?.riskFactors?.[4]) {
        setabusingYesNo(getApiData?.riskFactors?.[4]?.yesNo);
        setabusingComment(getApiData?.riskFactors?.[4]?.comment);
      } else {
        setabusingYesNo(null);
        setabusingComment("");
      }
      if (getApiData?.riskFactors?.[5]) {
        setRecentYesNo(getApiData?.riskFactors?.[5]?.yesNo);
        setRecentComment(getApiData?.riskFactors?.[5]?.comment);
      } else {
        setRecentYesNo(null);
        setRecentComment("");
      }
      if (getApiData?.riskFactors?.[6]) {
        setBehaviourYesNo(getApiData?.riskFactors?.[6]?.yesNo);
        setBehaviorcuesDropDown(
          getApiData?.riskFactors?.[6]?.comments
            ? getApiData?.riskFactors?.[6]?.comments.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
      } else {
        setBehaviourYesNo(null);
        setBehaviorcuesDropDown([]);
      }
      if (getApiData?.riskFactors?.[7]) {
        setSymptomsYesNo(getApiData?.riskFactors?.[7]?.yesNo);
        setSymptomsOfPsychosisDropDown(
          getApiData?.riskFactors?.[7]?.comments
            ? getApiData?.riskFactors?.[7]?.comments.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
      } else {
        setSymptomsYesNo(null);
        setSymptomsOfPsychosisDropDown([]);
      }
      if (getApiData?.riskFactors?.[8]) {
        setFamilyYesNo(getApiData?.riskFactors?.[8]?.yesNo);
        setFamily(getApiData?.riskFactors?.[8]?.comment);
      } else {
        setFamilyYesNo(null);
        setFamily("");
      }
      if (getApiData?.riskFactors?.[9]) {
        setTerminalYesNo(getApiData?.riskFactors?.[9]?.yesNo);
        setTerminal(getApiData?.riskFactors?.[9]?.comment);
      } else {
        setTerminalYesNo(null);
        setTerminal("");
      }
      if (getApiData?.riskFactors?.[10]) {
        setCurrentYesNo(getApiData?.riskFactors?.[10]?.yesNo);
        setCurrent(getApiData?.riskFactors?.[10]?.comment);
      } else {
        setCurrentYesNo(null);
        setCurrent("");
      }
      if (getApiData?.riskFactors?.[11]) {
        setChronicYesNo(getApiData?.riskFactors?.[11]?.yesNo);
        setChronicPain(getApiData?.riskFactors?.[11]?.comment);
      } else {
        setChronicYesNo(null);
        setChronicPain("");
      }
      setRiskFactoeArray(
        getApiData?.riskFactors
          ? getApiArrayData(
              12,
              getApiData?.riskFactors?.length,
              getApiData?.riskFactors,
            )
          : [],
      );
      if (getApiData?.protectiveFactors?.[0]) {
        setSupportsYesNo(getApiData?.protectiveFactors?.[0]?.yesNo);
        setSupportsComment(getApiData?.protectiveFactors?.[0]?.comment);
      } else {
        setSupportsYesNo(null);
        setSupportsComment("");
      }
      if (getApiData?.protectiveFactors?.[1]) {
        setSpiritualYesNo(getApiData?.protectiveFactors?.[1]?.yesNo);
        setSpiritualComment(getApiData?.protectiveFactors?.[1]?.comment);
      } else {
        setSpiritualYesNo(null);
        setSpiritualComment("");
      }
      if (getApiData?.protectiveFactors?.[2]) {
        setReligiousYesNo(getApiData?.protectiveFactors?.[2]?.yesNo);
        setReligiousComment(getApiData?.protectiveFactors?.[2]?.comment);
      } else {
        setReligiousYesNo(null);
        setReligiousComment("");
      }
      if (getApiData?.protectiveFactors?.[3]) {
        setFearYesNo(getApiData?.protectiveFactors?.[3]?.yesNo);
        setFearComment(getApiData?.protectiveFactors?.[3]?.comment);
      } else {
        setFearYesNo(null);
        setFearComment("");
      }
      if (getApiData?.protectiveFactors?.[4]) {
        setInterventionYesNo(getApiData?.protectiveFactors?.[4]?.yesNo);
        setInterventionComment(getApiData?.protectiveFactors?.[4]?.comment);
      } else {
        setInterventionYesNo(null);
        setInterventionComment("");
      }
      if (getApiData?.protectiveFactors?.[5]) {
        setWillingYesNo(getApiData?.protectiveFactors?.[5]?.yesNo);
        setWillingComment(getApiData?.protectiveFactors?.[5]?.comment);
      } else {
        setWillingYesNo(null);
        setWillingComment("");
      }
      setProtectiveFactorsArray(
        getApiData?.protectiveFactors
          ? getApiArrayData(
              6,
              getApiData?.protectiveFactors?.length,
              getApiData?.protectiveFactors,
            )
          : [],
      );
      setRiskLevel(getApiData?.riskLevel);
      const patientDataObj =
        getApiData?.data?.patientId || getApiData?.patientId || {};
      const psychDiagnoses =
        patientDataObj?.psychiatricDiagnoses?.length > 0
          ? patientDataObj?.psychiatricDiagnoses
          : getApiData?.psychiatricDiagnoses || [];
      const psychPrimary =
        psychDiagnoses.find((d) => d?.name === "Primary") || {};
      setPsychiatricPrimaryIcdCode(psychPrimary.icdCode || null);
      setPsychiatricPrimaryDescription(psychPrimary.description || "");

      const psychSecondary =
        psychDiagnoses.find((d) => d?.name === "Secondary") || {};
      setPsychiatricSecondaryIcdCode(psychSecondary.icdCode || null);
      setPsychiatricSecondaryDescription(psychSecondary.description || "");

      const psychTertiary =
        psychDiagnoses.find((d) => d?.name === "Tertiary") || {};
      setPsychiatricTertiaryIcdCode(psychTertiary.icdCode || null);
      setPsychiatricTertiaryDescription(psychTertiary.description || "");

      const psychAdditional =
        psychDiagnoses.find((d) => d?.name === "Additional") || {};
      setPsychiatricAdditionalIcdCode(psychAdditional.icdCode || null);
      setPsychiatricAdditionalDescription(psychAdditional.description || "");

      setPsychiatricDiagnosesArray(
        psychDiagnoses.filter(
          (d) =>
            !["Primary", "Secondary", "Tertiary", "Additional"].includes(
              d?.name,
            ),
        ),
      );

      const medDiagnoses =
        patientDataObj?.medicalDiagnoses?.length > 0
          ? patientDataObj?.medicalDiagnoses
          : getApiData?.medicalDiagnoses || [];
      const medPrimary = medDiagnoses.find((d) => d?.name === "Primary") || {};
      setPrimaryIcdCode(medPrimary.icdCode || null);
      setPrimaryDescription(medPrimary.description || "");

      const medSecondary =
        medDiagnoses.find((d) => d?.name === "Secondary") || {};
      setSecondaryIcdCode(medSecondary.icdCode || null);
      setSecondaryDescription(medSecondary.description || "");

      const medTertiary =
        medDiagnoses.find((d) => d?.name === "Tertiary") || {};
      setTertiaryIcdCode(medTertiary.icdCode || null);
      setTertiaryDescription(medTertiary.description || "");

      const medAdditional =
        medDiagnoses.find((d) => d?.name === "Additional") || {};
      setAdditional1IcdCode(medAdditional.icdCode || null);
      setAdditional1Description(medAdditional.description || "");

      setMedicalDiagnosesArray(
        medDiagnoses.filter(
          (d) =>
            !["Primary", "Secondary", "Tertiary", "Additional"].includes(
              d?.name,
            ),
        ),
      );
      setPrimarySupportGroup(getApiData?.primarySupportGroup);
      setMaritalProblems(getApiData?.maritalProblems);
      setAccessToHealthCareServices(getApiData?.accessToHealthCareServices);
      setEducationalProblems(getApiData?.educationalProblems);
      setHousingProblems(getApiData?.housingProblems);
      setFamilyProblems(getApiData?.familyProblems);
      setOccupationalProblems(getApiData?.occupationalProblems);
      setInteractionWithLegalSystem(getApiData?.interactionWithLegalSystem);
      setSubstanceUseInHome(getApiData?.substanceUseInHome);
      setSexualProblems(getApiData?.sexualProblems);
      setOtherBoolean(getApiData?.otherStressors ? true : false);
      setOtherStressors(getApiData?.otherStressors);
      setSetNoAndYes(getApiData?.significantRecentLosses?.yes);
      setDeath(getApiData?.significantRecentLosses?.typeOfLoss?.death);
      setJob(getApiData?.significantRecentLosses?.typeOfLoss?.job);
      setChildRemovedFromHouse(
        getApiData?.significantRecentLosses?.typeOfLoss?.childRemovedFromHouse,
      );
      setInjury(getApiData?.significantRecentLosses?.typeOfLoss?.injury);
      setDivorceSeparation(
        getApiData?.significantRecentLosses?.typeOfLoss?.divorceSeparation,
      );
      setViolentActsAgainstPersonFamily(
        getApiData?.significantRecentLosses?.typeOfLoss
          ?.violentActsAgainstPersonFamily,
      );
      setMedicalSurgical(
        getApiData?.significantRecentLosses?.typeOfLoss?.medicalSurgical,
      );
      setAccidentInjury(
        getApiData?.significantRecentLosses?.typeOfLoss?.accidentInjury,
      );
      setOtherSignificantRecentLosses(
        getApiData?.significantRecentLosses?.comment ? true : false,
      );
      setOtherSignificantRecentLossesType(
        getApiData?.significantRecentLosses?.comment,
      );
      setAdditionalNotes(getApiData?.additionalNotes);
      setAcceptResident(getApiData?.acceptResident);
      setResidentGuardianName(getApiData?.residentInformation?.ResidentName);
      setResidentGauardianSignature(
        getApiData?.residentInformation?.ResidentSignature,
      );
      setResidentGuardianDate(
        getApiData?.residentInformation?.ResidentDate
          ? getApiData?.residentInformation?.ResidentDate
          : "",
      );
      setResidentGuardianTime(getApiData?.residentInformation?.time);
      setStaffName(getApiData?.staffInformation?.staffName);
      setStaffSignature(getApiData?.staffInformation?.staffSignature);
      setStaffDate(
        getApiData?.staffInformation?.staffDate
          ? getApiData?.staffInformation?.staffDate
          : "",
      );
      setStaffDateTime(getApiData?.staffInformation?.time);
      setBhpName(getApiData?.bhpInformation?.bhpName);
      setBhpCredentials(getApiData?.bhpInformation?.bhpCredentials);
      setBhpSignature(getApiData?.bhpInformation?.bhpSignature);
      setBhpDate(
        getApiData?.bhpInformation?.bhpDate
          ? getApiData?.bhpInformation?.bhpDate
          : "",
      );
      setBhpTime(getApiData?.bhpInformation?.time);
      setAdminSignature(getApiData?.adminSignature);
      setAdminSignatureDate(getApiData?.adminSignatureDate);
      setAdminSignatureTime(getApiData?.adminSignatureTime);
      setResidentRepresentative(getApiData?.residentRepresentative);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData]);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: EMPLOYEE_APIS.EMPLOYEE_GETINITIALASSESSMENTBYID(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
  }, [id]);
  useEffect(() => {
    setPatientId(userData?._id);
    setUserType(userData?.userType);
    setFiledForm(userData?.initialAssessment);
  }, [userData]);
  useEffect(() => {
    if (profile) {
      setUserData(profile);
    }
  }, [profile]);
  const handleSubmit = (e) => {
    e.preventDefault();
    let SignificantFamilyMedicalPsychiatricHistoryArray = [];
    SignificantFamilyMedicalPsychiatricHistory.forEach((item) => {
      SignificantFamilyMedicalPsychiatricHistoryArray.push(item?.value);
    });
    const admissionStatusArray = [];
    admissionStatus.forEach((item) => {
      admissionStatusArray.push(item?.value);
    });
    const selectedValueArray = [];
    selectedValue.forEach((item) => {
      selectedValueArray.push(item?.value);
    });
    const selectedValueMedicalArray = [];
    selectedValueMedical.forEach((item) => {
      selectedValueMedicalArray.push(item?.value);
    });
    const selectedValueSpecialPrecautionsArray = [];
    selectedValueSpecialPrecautions.forEach((item) => {
      selectedValueSpecialPrecautionsArray.push(item?.value);
    });
    const thyroidDisorderArray = [];
    thyroidDisorder.forEach((item) => {
      thyroidDisorderArray.push(item.value);
    });
    const infectionDiseasesArray = [];
    infectionDiseases.forEach((item) => {
      infectionDiseasesArray.push(item.value);
    });
    const reasonForAdmissionArray = [];
    reasonForAdmission.forEach((item) => {
      reasonForAdmissionArray.push(item?.value);
    });
    const riskFacrtor1 = [];
    behaviorcuesDropDown.forEach((item) => {
      riskFacrtor1.push(item?.value);
    });
    const riskFacrtor2 = [];
    symptomsOfPsychosisDropDown.forEach((item) => {
      riskFacrtor2.push(item?.value);
    });
    navigate("/intake");
  };
  const profileInfo = useSelector(userProfile);
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
  const print = usePrint(printRef, handlePrint2);
  const [searchParams] = useSearchParams();
  const [hasAutoPrinted, setHasAutoPrinted] = useState(false);
  useEffect(() => {
    if (
      !hasAutoPrinted &&
      searchParams.get("autoPrint") === "1" &&
      getApiData
    ) {
      setHasAutoPrinted(true);
      setTimeout(() => handlePrint2(), 600);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData, searchParams, hasAutoPrinted]);

  return {
    AccessComment,
    AccessYesNo,
    Additional1Description,
    Additional1icdCode,
    Agitation,
    AllergiesComment,
    AllergiesYes,
    Anxiety,
    AnxietyComment,
    AnxietyYes,
    ArticulationOtherBoolean,
    ArticulationOtherBooleanOther,
    BathingComments,
    BathingFair,
    BathingGood,
    BathingGoodNeedAssist,
    BathingNotSoGood,
    BipolarComment,
    BipolarYes,
    BonePain,
    ChronicPain,
    ChronicYesNO,
    CooperationOtherBoolean,
    CooperationOtherBooleanType,
    Current,
    CurrentYesNO,
    DepressionComment,
    DepressionYes,
    EatingComments,
    EatingFair,
    EatingGood,
    EatingGoodNeedAssist,
    EatingNotSoGood,
    EyeContactOtherBoolean,
    EyeContactOtherBooleanType,
    Family,
    FamilyYesNO,
    FearComment,
    FearYesNo,
    GooseBumps,
    GroomingBoolean,
    GroomingComments,
    GroomingFair,
    GroomingGood,
    GroomingGoodNeedAssist,
    GroomingNotSoGood,
    GroomingOther,
    Headache,
    HouseworkComments,
    HouseworkFair,
    HouseworkGood,
    HouseworkGoodNeedAssist,
    HouseworkNotSoGood,
    InfectionYes,
    InsomniaComment,
    InsomniaYes,
    LossofMuscleCoordination,
    LossofMuscleCoordinationOtherBoolean,
    LossofMuscleCoordinationOtherType,
    ManagingComments,
    ManagingFair,
    ManagingGood,
    ManagingGoodNeedAssist,
    ManagingNotSoGood,
    MannerismsOther,
    MannerismsOtherBoolen,
    MobilityComments,
    MobilityFair,
    MobilityGood,
    MobilityGoodNeedAssist,
    MobilityNotSoGood,
    Nausea,
    ObsessiveComment,
    ObsessiveYes,
    OtherConditionOther,
    Paranoia,
    PersonalityComment,
    PersonalityYes,
    PhobiasComment,
    PhobiasYes,
    PostureOther,
    PostureOtherBoolen,
    PreparingComments,
    PreparingFair,
    PreparingGood,
    PreparingGoodNeedAssist,
    PreparingNotSoGood,
    PriorComment,
    PriorYesNo,
    Profile,
    PsychomotorActivityOther,
    PsychomotorActivityOtherBoolen,
    QuantityOtherBoolean,
    QuantityOtherBooleanOther,
    RateOtherBoolean,
    RateOtherBooleanOther,
    RecentComment,
    RecentYesNo,
    ReligiousComment,
    ReligiousYesNo,
    Runningnose,
    SchizophreniaComment,
    SchizophreniaYes,
    Seizures,
    ShoppingComments,
    ShoppingFair,
    ShoppingGood,
    ShoppingGoodNeedAssist,
    ShoppingNotSoGood,
    SignificantFamilyMedicalPsychiatricHistory,
    SpiritualComment,
    SpiritualYesNo,
    SubstanceAbuseComment,
    SubstanceComment,
    SubstanceYes,
    SubstanceYesNo,
    SupportsComment,
    SupportsYesNo,
    SurgeriesComment,
    SurgeriesYes,
    Sweats,
    SymptomsYesNO,
    TactileDisturbances,
    TakingComments,
    TakingFair,
    TakingGood,
    TakingGoodNeedAssist,
    TakingNotSoGood,
    Tearing,
    Terminal,
    TerminalYesNO,
    TertiaryDescription,
    TertiaryIcdCode,
    ToiletingComments,
    ToiletingFair,
    ToiletingGood,
    ToiletingGoodNeedAssist,
    ToiletingNotSoGood,
    ToneOtherBoolean,
    ToneOtherBooleanOther,
    Tremors,
    VisualDisturbances,
    VisualDisturbancesOtherBoolean,
    VisualDisturbancesOtherType,
    Vomiting,
    WeightBoolean,
    WeightOther,
    WillingComment,
    WillingYesNo,
    abusingComment,
    abusingYesNo,
    acceptResident,
    accessToHealthCareServices,
    accidentInjury,
    activeDuty,
    additionalNotes,
    adequateEyeContact,
    adequateGrooming,
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionStatus,
    agitated,
    ahcccsId,
    ahcccsNumber,
    anxious,
    appropriate,
    appropriateCooperation,
    approvedBy,
    assessmentOn,
    assessmentType,
    attireBoolean,
    attireOther,
    auditoryHallucinations,
    averageHeight,
    averageWeight,
    awkward,
    behaviorcuesDropDown,
    behaviourYesNO,
    bhpCredentials,
    bhpDate,
    bhpName,
    bhpSignature,
    bhpTime,
    bhrfCriteria,
    calm,
    casual,
    childRemovedFromHouse,
    chronicCommit,
    circumstances,
    circumstantial,
    clinicalSummary,
    commentCancer,
    commentDiabety,
    commentHeart,
    commentHigh,
    commentHistory,
    commentInjury,
    commentLiver,
    commentLung,
    commentSeizures,
    commentbrain,
    companyName,
    componentRef,
    concrete,
    consistent,
    constricted,
    currentBehavioralIssues,
    currentStudent,
    currentThoughtsOfHarmingOthers,
    currentThoughtsOfHarmingSelf,
    currentlyEmployed,
    dateOfAssessment,
    death,
    defensive,
    delayed,
    depressedAffect,
    depressedMood,
    diagnosis,
    dirty,
    disheveled,
    divorceSeparation,
    dob,
    educationalHistory,
    educationalProblems,
    elevated,
    emaciated,
    employmentLocation,
    ethnicity,
    euthymic,
    euthymicOtherBoolean,
    euthymicOtherBooleanType,
    evasive,
    fairInsight,
    fairJudgment,
    fairMemory,
    fallRisk,
    fallRiskExplanation,
    familyProblems,
    fast,
    filedForm,
    gaitOther,
    gaitOtherBoolen,
    getApiData,
    goodInsight,
    goodJudgment,
    goodMemory,
    guardianship,
    guardianshipPoaPubFidName,
    handleAddCondition,
    handlePrint,
    handlePrint2,
    handleRiskFactorActivityArray,
    handleSubmit,
    hasAutoPrinted,
    hasNotified,
    healthConditionsYes,
    healthConditionsYesComment,
    heigthBoolean,
    heigthOther,
    hobbiesLeisureActivities,
    hostile,
    hoursFormat,
    housingProblems,
    hyperactive,
    hypoactive,
    id,
    ifYesWhere,
    indifferent,
    infectionDiseases,
    injury,
    intactAbilityToConcentration,
    intactAbilityToConcentrationOtherBoolean,
    interactionWithLegalSystem,
    interventionComment,
    interventionYesNo,
    irritable,
    job,
    labile,
    logicalCoherent,
    loud,
    maritalProblems,
    medicalDiagnosesArray,
    medicalSurgical,
    militaryService,
    minimal,
    mumbled,
    mutism,
    navigate,
    neat,
    negative,
    noDelusions,
    none,
    noneReportedOrObserved,
    normalArticulation,
    normalGait,
    normalPosture,
    normalQuantity,
    normalRange,
    normalRate,
    normalTone,
    normalresponseLatency,
    obese,
    occupationalProblems,
    older,
    olderOther,
    olderOtherBoolean,
    other,
    otherAbilityToConcentration,
    otherAgeOfFirstUse,
    otherBoolean,
    otherConditionArray,
    otherConditionDiscription,
    otherConditionYesNO,
    otherLastUse,
    otherSignificantRecentLosses,
    otherSignificantRecentLossesType,
    otherStressors,
    otherText,
    otherTypeOther,
    overweight,
    patientId,
    person,
    picking,
    place,
    poor,
    poorInsight,
    poorJudgment,
    poorMemory,
    powerOfAttorneyStatus,
    preferredLanguage,
    pregnanciesComment,
    pregnanciesYes,
    pressured,
    primaryDescription,
    primaryIcdCode,
    primarySupportGroup,
    print,
    printRef,
    profile,
    profileInfo,
    programLocation,
    protectiveFactorsArray,
    psychiatricAdditionalDescription,
    psychiatricAdditionalicdCode,
    psychiatricDiagnosesArray,
    psychiatricPrimaryDescription,
    psychiatricPrimaryIcdCode,
    psychiatricSecondaryDescription,
    psychiatricSecondaryicdCode,
    psychiatricTertiaryDescription,
    psychiatricTertiaryIcdCode,
    reasonForAdmission,
    relaxed,
    residentGauardianSignature,
    residentGoals,
    residentGuardianDate,
    residentGuardianName,
    residentGuardianTime,
    residentLimitations,
    stepDownBarriers,
    stepDownBarriersBoolean,
    stepDownBarriersOther,
    stepDownBarriersText,
    residentName,
    residentRepresentative,
    residentStrengths,
    responseLatencyOtherBoolean,
    responseLatencyOtherBooleanOther,
    rigid,
    riskComment,
    riskFactorArray,
    riskLevel,
    riskYesNo,
    rocking,
    saveAsDraft,
    searchParams,
    secondaryDescription,
    secondaryicdCode,
    selectedValue,
    selectedValueMedical,
    selectedValueSpecialPrecautions,
    setAcceptResident,
    setAccessComment,
    setAccessToHealthCareServices,
    setAccessYesNo,
    setAccidentInjury,
    setActiveDuty,
    setAdditional1Description,
    setAdditional1IcdCode,
    setAdditionalNotes,
    setAdequateEyeContact,
    setAdequateGrooming,
    setAdminSignature,
    setAdminSignatureDate,
    setAdminSignatureTime,
    setAdmissionStatus,
    setAgitated,
    setAgitation,
    setAhcccsId,
    setAhcccsNumber,
    setAllergiesComment,
    setAllergiesYes,
    setAnxiety,
    setAnxietyComment,
    setAnxietyYes,
    setAnxious,
    setAppropriate,
    setAppropriateCooperation,
    setApprovedBy,
    setArticulationOtherBoolean,
    setArticulationOtherBooleanOther,
    setAssessmentOn,
    setAssessmentType,
    setAttireBoolaen,
    setAttireOther,
    setAuditoryHallucinations,
    setAverageHeight,
    setAverageWeight,
    setAwkward,
    setBathingComments,
    setBathingFair,
    setBathingGood,
    setBathingGoodNeedAssist,
    setBathingNotSoGood,
    setBehaviorcuesDropDown,
    setBehaviourYesNo,
    setBhpCredentials,
    setBhpDate,
    setBhpName,
    setBhpSignature,
    setBhpTime,
    setBhrfCriteria,
    setBipolarComment,
    setBipolarYes,
    setBonePain,
    setCalm,
    setCasual,
    setChildRemovedFromHouse,
    setChronicCommit,
    setChronicPain,
    setChronicYesNo,
    setCircumstances,
    setCircumstantial,
    setClinicalSummary,
    setCommentCancer,
    setCommentDeabetes,
    setCommentHeart,
    setCommentHigh,
    setCommentHistory,
    setCommentInjury,
    setCommentLiver,
    setCommentLung,
    setCommentSeizures,
    setCompanyName,
    setConcrete,
    setConsistent,
    setConstricted,
    setCooperationOtherBoolean,
    setCooperationOtherBooleanType,
    setCurrent,
    setCurrentBehavioralIssues,
    setCurrentStudent,
    setCurrentThoughtsOfHarmingOthers,
    setCurrentThoughtsOfHarmingSelf,
    setCurrentYesNo,
    setCurrentlyEmployed,
    setDateOfAssessment,
    setDeath,
    setDefensive,
    setDelayed,
    setDepressedAffect,
    setDepressedMood,
    setDepressionComment,
    setDepressionYes,
    setDiagnosis,
    setDirty,
    setDisheveled,
    setDivorceSeparation,
    setDob,
    setEatingComments,
    setEatingFair,
    setEatingGood,
    setEatingGoodNeedAssist,
    setEatingNotSoGood,
    setEducationalHistory,
    setEducationalProblems,
    setElevated,
    setEmaciated,
    setEmploymentLocation,
    setEthnicity,
    setEuthymic,
    setEvasive,
    setEyeContactOtherBoolean,
    setEyeContactOtherBooleanType,
    setFairInsight,
    setFairJudgment,
    setFairMemory,
    setFallRisk,
    setFallRiskExplanation,
    setFamily,
    setFamilyProblems,
    setFamilyYesNo,
    setFast,
    setFearComment,
    setFearYesNo,
    setFiledForm,
    setGailOtherBoolen,
    setGetApiData,
    setGoodInsight,
    setGoodJudgment,
    setGoodMemory,
    setGooseBumps,
    setGroomingBoolean,
    setGroomingComments,
    setGroomingFair,
    setGroomingGood,
    setGroomingGoodNeedAssist,
    setGroomingNotSoGood,
    setGroomingOther,
    setGuardianship,
    setGuardianshipPoaPubFidName,
    setHandleRiskFactorActivityArray,
    setHasAutoPrinted,
    setHasNotified,
    setHeadache,
    setHealthConditionsYes,
    setHeigthBoolean,
    setHeigthOther,
    setHobbiesLeisureActivities,
    setHostile,
    setHouseworkComments,
    setHouseworkFair,
    setHouseworkGood,
    setHouseworkGoodNeedAssist,
    setHouseworkNotSoGood,
    setHousingProblems,
    setHyperactive,
    setHypoactive,
    setIfYesWhere,
    setIndifferent,
    setInfectionDiseases,
    setInfectionYes,
    setInjury,
    setInsomniaComment,
    setInsomniaYes,
    setIntactAbilityToConcentration,
    setIntactAbilityToConcentrationOtherBoolean,
    setInteractionWithLegalSystem,
    setInterventionComment,
    setInterventionYesNo,
    setIrritable,
    setJob,
    setLabile,
    setLogicalCoherent,
    setLossofMuscleCoordination,
    setLossofMuscleCoordinationBoolean,
    setLossofMuscleCoordinationType,
    setLoud,
    setManagingComments,
    setManagingFair,
    setManagingGood,
    setManagingGoodNeedAssist,
    setManagingNotSoGood,
    setMannerismsOther,
    setMannerismsOtherBoolen,
    setMaritalProblems,
    setMedicalDiagnosesArray,
    setMedicalSurgical,
    setMilitaryService,
    setMinimal,
    setMobilityComments,
    setMobilityFair,
    setMobilityGood,
    setMobilityGoodNeedAssist,
    setMobilityNotSoGood,
    setMumbled,
    setMutism,
    setNausea,
    setNeat,
    setNegative,
    setNoAndYes,
    setNoDelusions,
    setNone,
    setNoneReportedOrObserved,
    setNormalArticulation,
    setNormalGait,
    setNormalPosture,
    setNormalQuantity,
    setNormalRange,
    setNormalRate,
    setNormalTone,
    setNormalresponseLatency,
    setObese,
    setObsessiveComment,
    setObsessiveYes,
    setOccupationalProblems,
    setOlder,
    setOlderOther,
    setOlderOtherBoolean,
    setOther,
    setOtherAbilityToConcentration,
    setOtherAgeOfFirstUse,
    setOtherBoolean,
    setOtherConditionArray,
    setOtherConditionDiscription,
    setOtherConditionOther,
    setOtherConditionYesNo,
    setOtherLastUse,
    setOtherSignificantRecentLosses,
    setOtherSignificantRecentLossesType,
    setOtherStressors,
    setOtherText,
    setOtherTypeOther,
    setOverweight,
    setParanoia,
    setPatientId,
    setPerson,
    setPersonalityComment,
    setPersonalityYes,
    setPhobiasComment,
    setPhobiasYes,
    setPicking,
    setPlace,
    setPoor,
    setPoorInsight,
    setPoorJudgment,
    setPoorMemory,
    setPostureOther,
    setPowerOfAttorneyStatus,
    setPreferredLanguage,
    setPregnanciesComment,
    setPregnanciesYes,
    setPreparingComments,
    setPreparingFair,
    setPreparingGood,
    setPreparingGoodNeedAssist,
    setPreparingNotSoGood,
    setPressured,
    setPrimaryDescription,
    setPrimaryIcdCode,
    setPrimarySupportGroup,
    setPriorComment,
    setPriorYesNo,
    setProgramLocation,
    setProtectiveFactorsArray,
    setPsychiatricAdditionalDescription,
    setPsychiatricAdditionalIcdCode,
    setPsychiatricDiagnosesArray,
    setPsychiatricPrimaryDescription,
    setPsychiatricPrimaryIcdCode,
    setPsychiatricSecondaryDescription,
    setPsychiatricSecondaryIcdCode,
    setPsychiatricTertiaryDescription,
    setPsychiatricTertiaryIcdCode,
    setPsychomotorActivityOther,
    setPsychomotorActivityOtherBoolen,
    setQuantityOtherBoolean,
    setQuantityOtherBooleanOther,
    setRateOtherBoolean,
    setRateOtherBooleanOther,
    setReasonForAdmission,
    setRecentComment,
    setRecentYesNo,
    setRelaxed,
    setReligiousComment,
    setReligiousYesNo,
    setResidentGauardianSignature,
    setResidentGoals,
    setResidentGuardianDate,
    setResidentGuardianName,
    setResidentGuardianTime,
    setResidentLimitations,
    setStepDownBarriers,
    setStepDownBarriersBoolean,
    setStepDownBarriersOther,
    setStepDownBarriersText,
    setResidentName,
    setResidentRepresentative,
    setResidentStrengths,
    setRigid,
    setRiskComment,
    setRiskFactoeArray,
    setRiskLevel,
    setRiskYesNo,
    setRocking,
    setRunningnose,
    setSaveAsDraft,
    setSchizophreniaComment,
    setSchizophreniaYes,
    setSecondaryDescription,
    setSecondaryIcdCode,
    setSeizures,
    setSelectedValue,
    setSelectedValueMedical,
    setSelectedValueSpecialPrecautions,
    setSetNoAndYes,
    setSex,
    setSexualProblems,
    setShoppingComments,
    setShoppingFair,
    setShoppingGood,
    setShoppingGoodNeedAssist,
    setShoppingNotSoGood,
    setShort,
    setShortened,
    setShowSignatureResident,
    setShuffling,
    setSignerDate,
    setSignerSignature,
    setSignerTime,
    setSigners,
    setSignificantFamilyMedicalPsychiatricHistory,
    setSignificantSocialDevelopmentalHistory,
    setSlouched,
    setSlow,
    setSlowGait,
    setSlurred,
    setSoft,
    setSpecialEducation,
    setSpiritualComment,
    setSpiritualYesNo,
    setStaffDate,
    setStaffDateTime,
    setStaffName,
    setStaffSignature,
    setStaggering,
    setStuttered,
    setSubstanceAbuseDenies,
    setSubstanceAbuseHistory,
    setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    setSubstanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
    setSubstanceAbuseHistoryDataAgeOfFirstUseCocaine,
    setSubstanceAbuseHistoryDataAgeOfFirstUseCrack,
    setSubstanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
    setSubstanceAbuseHistoryDataAgeOfFirstUseHeroin,
    setSubstanceAbuseHistoryDataAgeOfFirstUseInhalants,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMDMA,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMethadone,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
    setSubstanceAbuseHistoryDataAgeOfFirstUseOTC,
    setSubstanceAbuseHistoryDataAgeOfFirstUsePCP,
    setSubstanceAbuseHistoryDataAgeOfFirstUsePrescription,
    setSubstanceAbuseHistoryDataFrequencyAlcohol,
    setSubstanceAbuseHistoryDataFrequencyBenzodiazepines,
    setSubstanceAbuseHistoryDataFrequencyCocaine,
    setSubstanceAbuseHistoryDataFrequencyCrack,
    setSubstanceAbuseHistoryDataFrequencyHallucinogens,
    setSubstanceAbuseHistoryDataFrequencyHeroin,
    setSubstanceAbuseHistoryDataFrequencyInhalants,
    setSubstanceAbuseHistoryDataFrequencyMDMA,
    setSubstanceAbuseHistoryDataFrequencyMarijuana,
    setSubstanceAbuseHistoryDataFrequencyMethadone,
    setSubstanceAbuseHistoryDataFrequencyMethamphetamine,
    setSubstanceAbuseHistoryDataFrequencyOTC,
    setSubstanceAbuseHistoryDataFrequencyPCP,
    setSubstanceAbuseHistoryDataFrequencyPrescription,
    setSubstanceAbuseHistoryDataLastUseAlcohol,
    setSubstanceAbuseHistoryDataLastUseBenzodiazepines,
    setSubstanceAbuseHistoryDataLastUseCocaine,
    setSubstanceAbuseHistoryDataLastUseCrack,
    setSubstanceAbuseHistoryDataLastUseHallucinogens,
    setSubstanceAbuseHistoryDataLastUseHeroin,
    setSubstanceAbuseHistoryDataLastUseInhalants,
    setSubstanceAbuseHistoryDataLastUseMDMA,
    setSubstanceAbuseHistoryDataLastUseMarijuana,
    setSubstanceAbuseHistoryDataLastUseMethadone,
    setSubstanceAbuseHistoryDataLastUseMethamphetamine,
    setSubstanceAbuseHistoryDataLastUseOTC,
    setSubstanceAbuseHistoryDataLastUsePCP,
    setSubstanceAbuseHistoryDataLastUsePrescription,
    setSubstanceAbuseHistoryDataLengthOfSobrietyAlcohol,
    setSubstanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines,
    setSubstanceAbuseHistoryDataLengthOfSobrietyCocaine,
    setSubstanceAbuseHistoryDataLengthOfSobrietyCrack,
    setSubstanceAbuseHistoryDataLengthOfSobrietyHallucinogens,
    setSubstanceAbuseHistoryDataLengthOfSobrietyHeroin,
    setSubstanceAbuseHistoryDataLengthOfSobrietyInhalants,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMDMA,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMethadone,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
    setSubstanceAbuseHistoryDataLengthOfSobrietyOTC,
    setSubstanceAbuseHistoryDataLengthOfSobrietyPCP,
    setSubstanceAbuseHistoryDataLengthOfSobrietyPrescription,
    setSubstanceComment,
    setSubstanceCommentAbuse,
    setSubstanceUseInHome,
    setSubstanceYes,
    setSubstanceYesNo,
    setSuicidalIdeation,
    setSuicidalIdeationSeverity,
    setSuicidalIdeationUrgency,
    setSupportsComment,
    setSupportsYesNo,
    setSurgeriesComment,
    setSurgeriessYes,
    setSuspicious,
    setSweats,
    setSymptomsOfPsychosisDropDown,
    setSymptomsYesNo,
    setTactileDisturbances,
    setTactileHallucinations,
    setTakingComments,
    setTakingFair,
    setTakingGood,
    setTakingGoodNeedAssist,
    setTakingNotSoGood,
    setTall,
    setTangential,
    setTattered,
    setTearing,
    setTense,
    setTerminal,
    setTerminalYesNo,
    setTertiaryDescription,
    setTertiaryIcdCode,
    setThin,
    setThoughtContentOther,
    setThoughtProcessesBoolaen,
    setThoughtProcessesOther,
    setThyroidDisorder,
    setTics,
    setTime,
    setTodayDate,
    setToiletingComments,
    setToiletingFair,
    setToiletingGood,
    setToiletingGoodNeedAssist,
    setToiletingNotSoGood,
    setToneOtherBoolean,
    setToneOtherBooleanOther,
    setTreatmentRecommendations,
    setTremors,
    setTremorsMannerisms,
    setTriggers,
    setTypeArray,
    setTypeOfServicesArray,
    setUnintelligible,
    setUnkempt,
    setUnremarkableHallucinations,
    setUnremarkablethoughtContent,
    setUserData,
    setUserType,
    setVague,
    setVerbose,
    setViolentActsAgainstPersonFamily,
    setVisualDisturbances,
    setVisualDisturbancesOtherBoolean,
    setVisualDisturbancesOtherType,
    setVisualHallucinations,
    setVomiting,
    setWeightBoolean,
    setWeightOther,
    setWellGroomed,
    setWillingComment,
    setWillingYesNo,
    setWithinNormalLimits,
    setWorkHistory,
    setYesBrain,
    setYesCancer,
    setYesChronic,
    setYesDiabetes,
    setYesGrandiose,
    setYesHeart,
    setYesHigh,
    setYesHistory,
    setYesInjury,
    setYesLiver,
    setYesLung,
    setYesOtherDelusionsBoolean,
    setYesOtherDelusionsText,
    setYesOtherHallucinationsBoolean,
    setYesOtherHallucinationsText,
    setYesPersecutory,
    setYesSeizures,
    setYesSomatic,
    setYesThyroid,
    setYounger,
    setabusingComment,
    setabusingYesNo,
    setbrain,
    seteuthymicOtherBoolean,
    seteuthymicOtherBooleanType,
    setgaitOtherBoolen,
    setgetOther,
    sethealthConditionsYesComment,
    setresponseLatencyOtherBoolean,
    setresponseLatencyOtherBooleanOther,
    setthoughtContentBoolean,
    sex,
    sexualProblems,
    short,
    shortened,
    showSignatureResident,
    shuffling,
    signers,
    significantSocialDevelopmentalHistory,
    slouched,
    slow,
    slowGait,
    slurred,
    soft,
    specialEducation,
    staffDate,
    staffDateTime,
    staffName,
    staffSignature,
    staggering,
    stuttered,
    substanceAbuseDenies,
    substanceAbuseHistory,
    substanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
    substanceAbuseHistoryDataAgeOfFirstUseCocaine,
    substanceAbuseHistoryDataAgeOfFirstUseCrack,
    substanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
    substanceAbuseHistoryDataAgeOfFirstUseHeroin,
    substanceAbuseHistoryDataAgeOfFirstUseInhalants,
    substanceAbuseHistoryDataAgeOfFirstUseMDMA,
    substanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    substanceAbuseHistoryDataAgeOfFirstUseMethadone,
    substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
    substanceAbuseHistoryDataAgeOfFirstUseOTC,
    substanceAbuseHistoryDataAgeOfFirstUsePCP,
    substanceAbuseHistoryDataAgeOfFirstUsePrescription,
    substanceAbuseHistoryDataFrequencyAlcohol,
    substanceAbuseHistoryDataFrequencyBenzodiazepines,
    substanceAbuseHistoryDataFrequencyCocaine,
    substanceAbuseHistoryDataFrequencyCrack,
    substanceAbuseHistoryDataFrequencyHallucinogens,
    substanceAbuseHistoryDataFrequencyHeroin,
    substanceAbuseHistoryDataFrequencyInhalants,
    substanceAbuseHistoryDataFrequencyMDMA,
    substanceAbuseHistoryDataFrequencyMarijuana,
    substanceAbuseHistoryDataFrequencyMethadone,
    substanceAbuseHistoryDataFrequencyMethamphetamine,
    substanceAbuseHistoryDataFrequencyOTC,
    substanceAbuseHistoryDataFrequencyPCP,
    substanceAbuseHistoryDataFrequencyPrescription,
    substanceAbuseHistoryDataLastUseAlcohol,
    substanceAbuseHistoryDataLastUseBenzodiazepines,
    substanceAbuseHistoryDataLastUseCocaine,
    substanceAbuseHistoryDataLastUseCrack,
    substanceAbuseHistoryDataLastUseHallucinogens,
    substanceAbuseHistoryDataLastUseHeroin,
    substanceAbuseHistoryDataLastUseInhalants,
    substanceAbuseHistoryDataLastUseMDMA,
    substanceAbuseHistoryDataLastUseMarijuana,
    substanceAbuseHistoryDataLastUseMethadone,
    substanceAbuseHistoryDataLastUseMethamphetamine,
    substanceAbuseHistoryDataLastUseOTC,
    substanceAbuseHistoryDataLastUsePCP,
    substanceAbuseHistoryDataLastUsePrescription,
    substanceAbuseHistoryDataLengthOfSobrietyAlcohol,
    substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines,
    substanceAbuseHistoryDataLengthOfSobrietyCocaine,
    substanceAbuseHistoryDataLengthOfSobrietyCrack,
    substanceAbuseHistoryDataLengthOfSobrietyHallucinogens,
    substanceAbuseHistoryDataLengthOfSobrietyHeroin,
    substanceAbuseHistoryDataLengthOfSobrietyInhalants,
    substanceAbuseHistoryDataLengthOfSobrietyMDMA,
    substanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    substanceAbuseHistoryDataLengthOfSobrietyMethadone,
    substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
    substanceAbuseHistoryDataLengthOfSobrietyOTC,
    substanceAbuseHistoryDataLengthOfSobrietyPCP,
    substanceAbuseHistoryDataLengthOfSobrietyPrescription,
    substanceUseInHome,
    suicidalIdeation,
    suicidalIdeationSeverity,
    suicidalIdeationUrgency,
    suspicious,
    symptomsOfPsychosisDropDown,
    tactileHallucinations,
    tall,
    tangential,
    tattered,
    tense,
    thin,
    thoughtContentBoolaen,
    thoughtContentOther,
    thoughtProcessesBoolean,
    thoughtProcessesOther,
    thyroidDisorder,
    tics,
    time,
    todayDate,
    treatmentRecommendations,
    tremorsMannerisms,
    triggers,
    typeArray,
    typeOfServiceArray,
    unintelligible,
    unkempt,
    unremarkableHallucinations,
    unremarkablethoughtContent,
    userData,
    userType,
    vague,
    verbose,
    violentActsAgainstPersonFamily,
    visualHallucinations,
    wellGroomed,
    withinNormalLimits,
    workHistory,
    yesCancer,
    yesChronic,
    yesDiabetes,
    yesGrandiose,
    yesHeart,
    yesHigh,
    yesHistory,
    yesInjury,
    yesLiver,
    yesLung,
    yesOtherDelusionsBoolean,
    yesOtherDelusionsText,
    yesOtherHallucinationsBoolean,
    yesOtherHallucinationsText,
    yesPersecutory,
    yesSeizures,
    yesSomatic,
    yesThyroid,
    yesbrain,
    younger,
  };
}

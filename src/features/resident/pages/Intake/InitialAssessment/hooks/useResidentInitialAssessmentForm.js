/* eslint-disable no-unused-vars */
// ResidentForm.js

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { residentService } from "@/features/shared/services/index";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { AddSignature, signatureFormat } from "@/utils/utils";
import HOC from "@/features/shared/layout/Inner/HOC";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { intakeService } from "@/features/shared/services/index";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { ROLES } from "@/features/shared/constants/index";
import { EMPLOYEE_APIS } from "@/features/shared/services/index";
import { useResidentInitialAssessmentDynamicForms } from "./useResidentInitialAssessmentDynamicForms";

export function useResidentInitialAssessmentForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const navigate = useNavigate();
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  const {
    signatures,
    updateSignature,
    loadFromApi: loadSignaturesFromApi,
  } = useSignatures();
  const { guardTyped, dialog: typedGuardDialog } = useTypedGuard({
    signatures,
    updateSignature,
  });
  // Witness coupled-pair (2026-04-26): block submit if witness sig XOR name.
  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;
  const allPenSigsHaveNames = Object.values(signatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );
  const componentRef = React.useRef();
  const [getApiData, setGetApiData] = useState([]);
  const [residentRepresentative, setResidentRepresentative] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");

  //singin model
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [showSignatureResident, setShowSignatureResident] = useState(false);
  const [filedForm, setFiledForm] = useState("");
  const [userData, setUserData] = useState("");
  const [userType, setUserType] = useState("");

  // const {profile } = useDataContext();
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
  const [residentLimitations, setResidentLimitations] = useState([]);
  const [stepDownBarriersOther, setStepDownBarriersOther] = useState("");
  const [stepDownBarriersText, setStepDownBarriersText] = useState("");
  const [stepDownBarriersBoolean, setStepDownBarriersBoolean] = useState(false);
  const [currentBehavioralIssues, setCurrentBehavioralIssues] = useState("");

  const dynamicForms = useResidentInitialAssessmentDynamicForms();
  const medicalConditions = dynamicForms.medicalConditions;
  const handleAddCondition = () => medicalConditions.appendOtherDraft();
  const removehandleAddCondition = (index) =>
    medicalConditions.removeExtraRow(index);
  const {
    yesDiabetes,
    setYesDiabetes,
    commentDiabety,
    setCommentDeabetes,
    yesHeart,
    setYesHeart,
    commentHeart,
    setCommentHeart,
    yesHistory,
    setYesHistory,
    commentHistory,
    setCommentHistory,
    yesHigh,
    setYesHigh,
    commentHigh,
    setCommentHigh,
    yesLung,
    setYesLung,
    commentLung,
    setCommentLung,
    yesSeizures,
    setYesSeizures,
    commentSeizures,
    setCommentSeizures,
    yesCancer,
    setYesCancer,
    commentCancer,
    setCommentCancer,
    yesLiver,
    setYesLiver,
    commentLiver,
    setCommentLiver,
    yesThyroid,
    setYesThyroid,
    thyroidDisorder,
    setThyroidDisorder,
    yesbrain,
    setYesBrain,
    commentbrain,
    setbrain,
    yesInjury,
    setYesInjury,
    commentInjury,
    setCommentInjury,
    yesChronic,
    setYesChronic,
    chronicCommit,
    setChronicCommit,
    AllergiesYes,
    setAllergiesYes,
    AllergiesComment,
    setAllergiesComment,
    SurgeriesYes,
    setSurgeriessYes,
    SurgeriesComment,
    setSurgeriesComment,
    pregnanciesYes,
    setPregnanciesYes,
    pregnanciesComment,
    setPregnanciesComment,
    SubstanceYes,
    setSubstanceYes,
    SubstanceComment,
    setSubstanceComment,
    DepressionYes,
    setDepressionYes,
    DepressionComment,
    setDepressionComment,
    AnxietyYes,
    setAnxietyYes,
    AnxietyComment,
    setAnxietyComment,
    InsomniaYes,
    setInsomniaYes,
    InsomniaComment,
    setInsomniaComment,
    BipolarYes,
    setBipolarYes,
    BipolarComment,
    setBipolarComment,
    SchizophreniaYes,
    setSchizophreniaYes,
    SchizophreniaComment,
    setSchizophreniaComment,
    ObsessiveYes,
    setObsessiveYes,
    ObsessiveComment,
    setObsessiveComment,
    PersonalityYes,
    setPersonalityYes,
    PersonalityComment,
    setPersonalityComment,
    PhobiasYes,
    setPhobiasYes,
    PhobiasComment,
    setPhobiasComment,
    healthConditionsYes,
    setHealthConditionsYes,
    healthConditionsYesComment,
    sethealthConditionsYesComment,
    InfectionYes,
    setInfectionYes,
    infectionDiseases,
    setInfectionDiseases,
    OtherConditionOther,
    setOtherConditionOther,
    otherConditionYesNO,
    setOtherConditionYesNo,
    otherConditionDiscription,
    setOtherConditionDiscription,
    otherConditionArray,
  } = medicalConditions.legacy;
  const [
    SignificantFamilyMedicalPsychiatricHistory,
    setSignificantFamilyMedicalPsychiatricHistory,
  ] = useState([]);
  const [
    mentalHealthTreatmentHistoryTypeOfService,
    setMentalHealthTreatmentHistoryTypeOfService,
  ] = useState([]);
  const [
    mentalHealthTreatmentHistoryWhere,
    setMentalHealthTreatmentHistoryWhere,
  ] = useState("");
  const [
    mentalHealthTreatmentHistoryDates,
    setMentalHealthTreatmentHistoryDates,
  ] = useState("");
  const [
    mentalHealthTreatmentHistoryDiagnosisReason,
    setMentalHealthTreatmentHistoryDiagnosisReason,
  ] = useState([]);
  const [typeOfServiceArray, setTypeOfServicesArray] = useState([]);
  const handleTypeOfService = () => {
    if (
      mentalHealthTreatmentHistoryDiagnosisReason &&
      mentalHealthTreatmentHistoryDates &&
      mentalHealthTreatmentHistoryWhere &&
      mentalHealthTreatmentHistoryTypeOfService
    ) {
      const data = {
        diagnosisReason: mentalHealthTreatmentHistoryDiagnosisReason?.map(
          (item) => item,
        ),
        dates: mentalHealthTreatmentHistoryDates,
        where: mentalHealthTreatmentHistoryWhere,
        typeOfService: mentalHealthTreatmentHistoryTypeOfService?.map(
          (item) => item,
        ),
      };
      setTypeOfServicesArray((prev) => [...prev, data]);
      setMentalHealthTreatmentHistoryTypeOfService([]);
      setMentalHealthTreatmentHistoryWhere("");
      setMentalHealthTreatmentHistoryDates("");
      setMentalHealthTreatmentHistoryDiagnosisReason([]);
    }
  };
  const handleRemoveItem = (index) => {
    const updatedArray = [...typeOfServiceArray];
    updatedArray.splice(index, 1);
    setTypeOfServicesArray(updatedArray);
  };
  const substanceAbuse = dynamicForms.substanceAbuse;
  const {
    substanceAbuseHistory,
    setSubstanceAbuseHistory,
    substanceAbuseDenies,
    setSubstanceAbuseDenies,
    typeArray,
    otherTypeOther,
    setOtherTypeOther,
    otherAgeOfFirstUse,
    setOtherAgeOfFirstUse,
    otherLastUse,
    setOtherLastUse,
    otherFrequancy,
    setOtherFrequancy,
    OtherlengthOfSobrifty,
    setOtherLengthOfSobirty,
    substanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    setSubstanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    substanceAbuseHistoryDataLastUseAlcohol,
    setSubstanceAbuseHistoryDataLastUseAlcohol,
    substanceAbuseHistoryDataFrequencyAlcohol,
    setSubstanceAbuseHistoryDataFrequencyAlcohol,
    substanceAbuseHistoryDataLengthOfSobrietyAlcohol,
    setSubstanceAbuseHistoryDataLengthOfSobrietyAlcohol,
    substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
    setSubstanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
    substanceAbuseHistoryDataLastUseBenzodiazepines,
    setSubstanceAbuseHistoryDataLastUseBenzodiazepines,
    substanceAbuseHistoryDataFrequencyBenzodiazepines,
    setSubstanceAbuseHistoryDataFrequencyBenzodiazepines,
    substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines,
    setSubstanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines,
    substanceAbuseHistoryDataAgeOfFirstUseCrack,
    setSubstanceAbuseHistoryDataAgeOfFirstUseCrack,
    substanceAbuseHistoryDataLastUseCrack,
    setSubstanceAbuseHistoryDataLastUseCrack,
    substanceAbuseHistoryDataFrequencyCrack,
    setSubstanceAbuseHistoryDataFrequencyCrack,
    substanceAbuseHistoryDataLengthOfSobrietyCrack,
    setSubstanceAbuseHistoryDataLengthOfSobrietyCrack,
    substanceAbuseHistoryDataAgeOfFirstUseHeroin,
    setSubstanceAbuseHistoryDataAgeOfFirstUseHeroin,
    substanceAbuseHistoryDataLastUseHeroin,
    setSubstanceAbuseHistoryDataLastUseHeroin,
    substanceAbuseHistoryDataFrequencyHeroin,
    setSubstanceAbuseHistoryDataFrequencyHeroin,
    substanceAbuseHistoryDataLengthOfSobrietyHeroin,
    setSubstanceAbuseHistoryDataLengthOfSobrietyHeroin,
    substanceAbuseHistoryDataAgeOfFirstUseInhalants,
    setSubstanceAbuseHistoryDataAgeOfFirstUseInhalants,
    substanceAbuseHistoryDataLastUseInhalants,
    setSubstanceAbuseHistoryDataLastUseInhalants,
    substanceAbuseHistoryDataFrequencyInhalants,
    setSubstanceAbuseHistoryDataFrequencyInhalants,
    substanceAbuseHistoryDataLengthOfSobrietyInhalants,
    setSubstanceAbuseHistoryDataLengthOfSobrietyInhalants,
    substanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    substanceAbuseHistoryDataLastUseMarijuana,
    setSubstanceAbuseHistoryDataLastUseMarijuana,
    substanceAbuseHistoryDataFrequencyMarijuana,
    setSubstanceAbuseHistoryDataFrequencyMarijuana,
    substanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
    substanceAbuseHistoryDataLastUseMethamphetamine,
    setSubstanceAbuseHistoryDataLastUseMethamphetamine,
    substanceAbuseHistoryDataFrequencyMethamphetamine,
    setSubstanceAbuseHistoryDataFrequencyMethamphetamine,
    substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
    substanceAbuseHistoryDataAgeOfFirstUseMethadone,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMethadone,
    substanceAbuseHistoryDataLastUseMethadone,
    setSubstanceAbuseHistoryDataLastUseMethadone,
    substanceAbuseHistoryDataFrequencyMethadone,
    setSubstanceAbuseHistoryDataFrequencyMethadone,
    substanceAbuseHistoryDataLengthOfSobrietyMethadone,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMethadone,
    substanceAbuseHistoryDataAgeOfFirstUseMDMA,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMDMA,
    substanceAbuseHistoryDataLastUseMDMA,
    setSubstanceAbuseHistoryDataLastUseMDMA,
    substanceAbuseHistoryDataFrequencyMDMA,
    setSubstanceAbuseHistoryDataFrequencyMDMA,
    substanceAbuseHistoryDataLengthOfSobrietyMDMA,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMDMA,
    substanceAbuseHistoryDataAgeOfFirstUsePCP,
    setSubstanceAbuseHistoryDataAgeOfFirstUsePCP,
    substanceAbuseHistoryDataLastUsePCP,
    setSubstanceAbuseHistoryDataLastUsePCP,
    substanceAbuseHistoryDataFrequencyPCP,
    setSubstanceAbuseHistoryDataFrequencyPCP,
    substanceAbuseHistoryDataLengthOfSobrietyPCP,
    setSubstanceAbuseHistoryDataLengthOfSobrietyPCP,
    substanceAbuseHistoryDataAgeOfFirstUsePrescription,
    setSubstanceAbuseHistoryDataAgeOfFirstUsePrescription,
    substanceAbuseHistoryDataLastUsePrescription,
    setSubstanceAbuseHistoryDataLastUsePrescription,
    substanceAbuseHistoryDataFrequencyPrescription,
    setSubstanceAbuseHistoryDataFrequencyPrescription,
    substanceAbuseHistoryDataLengthOfSobrietyPrescription,
    setSubstanceAbuseHistoryDataLengthOfSobrietyPrescription,
    substanceAbuseHistoryDataAgeOfFirstUseOTC,
    setSubstanceAbuseHistoryDataAgeOfFirstUseOTC,
    substanceAbuseHistoryDataLastUseOTC,
    setSubstanceAbuseHistoryDataLastUseOTC,
    substanceAbuseHistoryDataFrequencyOTC,
    setSubstanceAbuseHistoryDataFrequencyOTC,
    substanceAbuseHistoryDataLengthOfSobrietyOTC,
    setSubstanceAbuseHistoryDataLengthOfSobrietyOTC,
    substanceAbuseHistoryDataAgeOfFirstUseCocaine,
    setSubstanceAbuseHistoryDataAgeOfFirstUseCocaine,
    substanceAbuseHistoryDataLastUseCocaine,
    setSubstanceAbuseHistoryDataLastUseCocaine,
    substanceAbuseHistoryDataFrequencyCocaine,
    setSubstanceAbuseHistoryDataFrequencyCocaine,
    substanceAbuseHistoryDataLengthOfSobrietyCocaine,
    setSubstanceAbuseHistoryDataLengthOfSobrietyCocaine,
    substanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
    setSubstanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
    substanceAbuseHistoryDataLastUseHallucinogens,
    setSubstanceAbuseHistoryDataLastUseHallucinogens,
    substanceAbuseHistoryDataFrequencyHallucinogens,
    setSubstanceAbuseHistoryDataFrequencyHallucinogens,
    substanceAbuseHistoryDataLengthOfSobrietyHallucinogens,
    setSubstanceAbuseHistoryDataLengthOfSobrietyHallucinogens,
  } = substanceAbuse.legacy;
  const handleTypeOfArray = () => substanceAbuse.appendOtherDraft();
  const removeTypeArray = (index) => substanceAbuse.removeExtraRow(index);

  const activeWithdrawalForm = dynamicForms.activeWithdrawalForm;
  const mentalStatusExamForm = dynamicForms.mentalStatusExamForm;
  const {
    noneReportedOrObserved,
    setNoneReportedOrObserved,
    Agitation,
    setAgitation,
    Nausea,
    setNausea,
    Vomiting,
    setVomiting,
    Headache,
    setHeadache,
    TactileDisturbances,
    setTactileDisturbances,
    Anxiety,
    setAnxiety,
    Tremors,
    setTremors,
    VisualDisturbances,
    setVisualDisturbances,
    VisualDisturbancesOtherBoolean,
    setVisualDisturbancesOtherBoolean,
    VisualDisturbancesOtherType,
    setVisualDisturbancesOtherType,
    Sweats,
    setSweats,
    Paranoia,
    setParanoia,
    GooseBumps,
    setGooseBumps,
    Runningnose,
    setRunningnose,
    BonePain,
    setBonePain,
    Tearing,
    setTearing,
    Seizures,
    setSeizures,
    LossofMuscleCoordination,
    setLossofMuscleCoordination,
    LossofMuscleCoordinationOtherBoolean,
    setLossofMuscleCoordinationBoolean,
    LossofMuscleCoordinationOtherType,
    setLossofMuscleCoordinationType,
    consistent,
    setConsistent,
    younger,
    setYounger,
    older,
    setOlder,
    olderOtherBoolean,
    setOlderOtherBoolean,
    olderOther,
    setOlderOther,
    averageHeight,
    setAverageHeight,
    short,
    setShort,
    tall,
    setTall,
    heigthBoolean,
    setHeigthBoolean,
    heigthOther,
    setHeigthOther,
    averageWeight,
    setAverageWeight,
    obese,
    setObese,
    overweight,
    setOverweight,
    thin,
    setThin,
    emaciated,
    setEmaciated,
    WeightBoolean,
    setWeightBoolean,
    WeightOther,
    setWeightOther,
    casual,
    setCasual,
    neat,
    setNeat,
    tattered,
    setTattered,
    dirty,
    setDirty,
    attireBoolean,
    setAttireBoolaen,
    attireOther,
    setAttireOther,
    wellGroomed,
    setWellGroomed,
    adequateGrooming,
    setAdequateGrooming,
    unkempt,
    setUnkempt,
    disheveled,
    setDisheveled,
    GroomingBoolean,
    setGroomingBoolean,
    GroomingOther,
    setGroomingOther,
    euthymic,
    setEuthymic,
    irritable,
    setIrritable,
    elevated,
    setElevated,
    depressedMood,
    setDepressedMood,
    anxious,
    setAnxious,
    euthymicOtherBoolean,
    seteuthymicOtherBoolean,
    euthymicOtherBooleanType,
    seteuthymicOtherBooleanType,
    normalRange,
    setNormalRange,
    depressedAffect,
    setDepressedAffect,
    labile,
    setLabile,
    constricted,
    setConstricted,
    other,
    setOther,
    otherText,
    setOtherText,
    appropriate,
    setAppropriate,
    minimal,
    setMinimal,
    poor,
    setPoor,
    adequateEyeContact,
    setAdequateEyeContact,
    EyeContactOtherBoolean,
    setEyeContactOtherBoolean,
    EyeContactOtherBooleanType,
    setEyeContactOtherBooleanType,
    appropriateCooperation,
    setAppropriateCooperation,
    hostile,
    setHostile,
    evasive,
    setEvasive,
    defensive,
    setDefensive,
    indifferent,
    setIndifferent,
    CooperationOtherBoolean,
    setCooperationOtherBoolean,
    CooperationOtherBooleanType,
    setCooperationOtherBooleanType,
    normalArticulation,
    setNormalArticulation,
    unintelligible,
    setUnintelligible,
    mumbled,
    setMumbled,
    slurred,
    setSlurred,
    stuttered,
    setStuttered,
    ArticulationOtherBoolean,
    setArticulationOtherBoolean,
    ArticulationOtherBooleanOther,
    setArticulationOtherBooleanOther,
    normalTone,
    setNormalTone,
    soft,
    setSoft,
    loud,
    setLoud,
    pressured,
    setPressured,
    ToneOtherBoolean,
    setToneOtherBoolean,
    ToneOtherBooleanOther,
    setToneOtherBooleanOther,
    normalRate,
    setNormalRate,
    slow,
    setSlow,
    fast,
    setFast,
    RateOtherBoolean,
    setRateOtherBoolean,
    RateOtherBooleanOther,
    setRateOtherBooleanOther,
    normalQuantity,
    setNormalQuantity,
    verbose,
    setVerbose,
    mutism,
    setMutism,
    QuantityOtherBoolean,
    setQuantityOtherBoolean,
    QuantityOtherBooleanOther,
    setQuantityOtherBooleanOther,
    normalresponseLatency,
    setNormalresponseLatency,
    delayed,
    setDelayed,
    shortened,
    setShortened,
    responseLatencyOtherBoolean,
    setresponseLatencyOtherBoolean,
    responseLatencyOtherBooleanOther,
    setresponseLatencyOtherBooleanOther,
    unremarkablethoughtContent,
    setUnremarkablethoughtContent,
    suspicious,
    setSuspicious,
    negative,
    setNegative,
    concrete,
    setConcrete,
    thoughtContentBoolaen,
    setthoughtContentBoolean,
    thoughtContentOther,
    setThoughtContentOther,
    logicalCoherent,
    setLogicalCoherent,
    tangential,
    setTangential,
    circumstantial,
    setCircumstantial,
    vague,
    setVague,
    thoughtProcessesBoolean,
    setThoughtProcessesBoolaen,
    thoughtProcessesOther,
    setThoughtProcessesOther,
    noDelusions,
    setNoDelusions,
    yesPersecutory,
    setYesPersecutory,
    yesSomatic,
    setYesSomatic,
    yesGrandiose,
    setYesGrandiose,
    yesOtherDelusionsBoolean,
    setYesOtherDelusionsBoolean,
    yesOtherDelusionsText,
    setYesOtherDelusionsText,
    unremarkableHallucinations,
    setUnremarkableHallucinations,
    visualHallucinations,
    setVisualHallucinations,
    auditoryHallucinations,
    setAuditoryHallucinations,
    tactileHallucinations,
    setTactileHallucinations,
    yesOtherHallucinationsBoolean,
    setYesOtherHallucinationsBoolean,
    yesOtherHallucinationsText,
    setYesOtherHallucinationsText,
    normalGait,
    setNormalGait,
    staggering,
    setStaggering,
    shuffling,
    setShuffling,
    slowGait,
    setSlowGait,
    awkward,
    setAwkward,
    gaitOtherBoolen,
    setGailOtherBoolen,
    gaitOther,
    setgetOther,
    normalPosture,
    setNormalPosture,
    relaxed,
    setRelaxed,
    rigid,
    setRigid,
    tense,
    setTense,
    slouched,
    setSlouched,
    PostureOtherBoolen,
    setgaitOtherBoolen,
    PostureOther,
    setPostureOther,
    withinNormalLimits,
    setWithinNormalLimits,
    calm,
    setCalm,
    hyperactive,
    setHyperactive,
    agitated,
    setAgitated,
    hypoactive,
    setHypoactive,
    PsychomotorActivityOtherBoolen,
    setPsychomotorActivityOtherBoolen,
    PsychomotorActivityOther,
    setPsychomotorActivityOther,
    none,
    setNone,
    tics,
    setTics,
    tremorsMannerisms,
    setTremorsMannerisms,
    rocking,
    setRocking,
    picking,
    setPicking,
    MannerismsOtherBoolen,
    setMannerismsOtherBoolen,
    MannerismsOther,
    setMannerismsOther,
    person,
    setPerson,
    place,
    setPlace,
    time,
    setTime,
    circumstances,
    setCircumstances,
    goodJudgment,
    setGoodJudgment,
    fairJudgment,
    setFairJudgment,
    poorJudgment,
    setPoorJudgment,
    goodInsight,
    setGoodInsight,
    fairInsight,
    setFairInsight,
    poorInsight,
    setPoorInsight,
    goodMemory,
    setGoodMemory,
    fairMemory,
    setFairMemory,
    poorMemory,
    setPoorMemory,
    intactAbilityToConcentrationOtherBoolean,
    setIntactAbilityToConcentrationOtherBoolean,
    intactAbilityToConcentration,
    setIntactAbilityToConcentration,
    otherAbilityToConcentration,
    setOtherAbilityToConcentration,
  } = {
    ...activeWithdrawalForm.legacy,
    ...mentalStatusExamForm.legacy,
  };
  const [
    significantSocialDevelopmentalHistory,
    setSignificantSocialDevelopmentalHistory,
  ] = useState("");
  const [educationalHistory, setEducationalHistory] = useState("");
  const [highestEducation, setHighestEducation] = useState("");
  const [specialEducation, setSpecialEducation] = useState();
  const [currentStudent, setCurrentStudent] = useState();
  const [ifYesWhere, setIfYesWhere] = useState("");
  const [currentlyEmployed, setCurrentlyEmployed] = useState(false);
  const [employmentLocation, setEmploymentLocation] = useState("");
  const [workHistory, setWorkHistory] = useState("");
  const [militaryService, setMilitaryService] = useState(false);
  const [activeDuty, setActiveDuty] = useState("");
  const [selectedValue, setSelectedValue] = useState([]);
  const independentLiving = dynamicForms.independentLiving;
  const {
    BathingGood,
    setBathingGood,
    BathingFair,
    setBathingFair,
    BathingNotSoGood,
    setBathingNotSoGood,
    BathingGoodNeedAssist,
    setBathingGoodNeedAssist,
    BathingComments,
    setBathingComments,
    GroomingGood,
    setGroomingGood,
    GroomingFair,
    setGroomingFair,
    GroomingNotSoGood,
    setGroomingNotSoGood,
    GroomingGoodNeedAssist,
    setGroomingGoodNeedAssist,
    GroomingComments,
    setGroomingComments,
    MobilityGood,
    setMobilityGood,
    MobilityFair,
    setMobilityFair,
    MobilityNotSoGood,
    setMobilityNotSoGood,
    MobilityGoodNeedAssist,
    setMobilityGoodNeedAssist,
    MobilityComments,
    setMobilityComments,
    HouseworkGood,
    setHouseworkGood,
    HouseworkFair,
    setHouseworkFair,
    HouseworkNotSoGood,
    setHouseworkNotSoGood,
    HouseworkGoodNeedAssist,
    setHouseworkGoodNeedAssist,
    HouseworkComments,
    setHouseworkComments,
    ShoppingGood,
    setShoppingGood,
    ShoppingFair,
    setShoppingFair,
    ShoppingNotSoGood,
    setShoppingNotSoGood,
    ShoppingGoodNeedAssist,
    setShoppingGoodNeedAssist,
    ShoppingComments,
    setShoppingComments,
    ManagingGood,
    setManagingGood,
    ManagingFair,
    setManagingFair,
    ManagingNotSoGood,
    setManagingNotSoGood,
    ManagingGoodNeedAssist,
    setManagingGoodNeedAssist,
    ManagingComments,
    setManagingComments,
    PreparingGood,
    setPreparingGood,
    PreparingFair,
    setPreparingFair,
    PreparingNotSoGood,
    setPreparingNotSoGood,
    PreparingGoodNeedAssist,
    setPreparingGoodNeedAssist,
    PreparingComments,
    setPreparingComments,
    EatingGood,
    setEatingGood,
    EatingFair,
    setEatingFair,
    EatingNotSoGood,
    setEatingNotSoGood,
    EatingGoodNeedAssist,
    setEatingGoodNeedAssist,
    EatingComments,
    setEatingComments,
    ToiletingGood,
    setToiletingGood,
    ToiletingFair,
    setToiletingFair,
    ToiletingNotSoGood,
    setToiletingNotSoGood,
    ToiletingGoodNeedAssist,
    setToiletingGoodNeedAssist,
    ToiletingComments,
    setToiletingComments,
    TakingGood,
    setTakingGood,
    TakingFair,
    setTakingFair,
    TakingNotSoGood,
    setTakingNotSoGood,
    TakingGoodNeedAssist,
    setTakingGoodNeedAssist,
    TakingComments,
    setTakingComments,
    handleRiskFactorActivityArray,
    setHandleRiskFactorActivityArray,
  } = {
    ...independentLiving.legacy,
    setHandleRiskFactorActivityArray: independentLiving.setExtraRows,
  };

  const [triggers, setTriggers] = useState("");
  const [fallRisk, setFallRisk] = useState("");
  const [fallRiskExplanation, setFallRiskExplanation] = useState("");
  const [hobbiesLeisureActivities, setHobbiesLeisureActivities] = useState("");
  const [selectedValueMedical, setSelectedValueMedical] = useState([]);
  const [selectedValueSpecialPrecautions, setSelectedValueSpecialPrecautions] =
    useState([]);
  const [currentThoughtsOfHarmingSelf, setCurrentThoughtsOfHarmingSelf] =
    useState(false);
  const [suicidalIdeation, setSuicidalIdeation] = useState("");
  const [suicidalIdeationUrgency, setSuicidalIdeationUrgency] = useState(false);
  const [suicidalIdeationSeverity, setSuicidalIdeationSeverity] =
    useState(false);
  const [currentThoughtsOfHarmingOthers, setCurrentThoughtsOfHarmingOthers] =
    useState(false);
  const riskFactors = dynamicForms.riskFactors;
  const protectiveFactors = dynamicForms.protectiveFactors;
  const {
    riskYesNo,
    setRiskYesNo,
    riskComment,
    setRiskComment,
    PriorYesNo,
    setPriorYesNo,
    PriorComment,
    setPriorComment,
    AccessYesNo,
    setAccessYesNo,
    AccessComment,
    setAccessComment,
    SubstanceYesNo,
    setSubstanceYesNo,
    SubstanceAbuseComment,
    setSubstanceCommentAbuse,
    abusingYesNo,
    setabusingYesNo,
    abusingComment,
    setabusingComment,
    RecentYesNo,
    setRecentYesNo,
    RecentComment,
    setRecentComment,
    behaviourYesNO,
    setBehaviourYesNo,
    behaviorcuesDropDown,
    setBehaviorcuesDropDown,
    SymptomsYesNO,
    setSymptomsYesNo,
    symptomsOfPsychosisDropDown,
    setSymptomsOfPsychosisDropDown,
    FamilyYesNO,
    setFamilyYesNo,
    Family,
    setFamily,
    TerminalYesNO,
    setTerminalYesNo,
    Terminal,
    setTerminal,
    CurrentYesNO,
    setCurrentYesNo,
    Current,
    setCurrent,
    ChronicYesNO,
    setChronicYesNo,
    ChronicPain,
    setChronicPain,
    riskFactorArray,
  } = riskFactors.legacy;
  const {
    SupportsYesNo,
    setSupportsYesNo,
    SupportsComment,
    setSupportsComment,
    SpiritualYesNo,
    setSpiritualYesNo,
    SpiritualComment,
    setSpiritualComment,
    ReligiousYesNo,
    setReligiousYesNo,
    ReligiousComment,
    setReligiousComment,
    FearYesNo,
    setFearYesNo,
    FearComment,
    setFearComment,
    interventionYesNo,
    setInterventionYesNo,
    interventionComment,
    setInterventionComment,
    WillingYesNo,
    setWillingYesNo,
    WillingComment,
    setWillingComment,
    protectiveFactorsArray,
  } = protectiveFactors.legacy;

  const [riskLevel, setRiskLevel] = useState("");
  const psychiatricDiagnosesForm = dynamicForms.psychiatricDiagnosesForm;
  const medicalDiagnosesForm = dynamicForms.medicalDiagnosesForm;
  const {
    psychiatricPrimaryIcdCode,
    setPsychiatricPrimaryIcdCode,
    psychiatricPrimaryDescription,
    setPsychiatricPrimaryDescription,
    psychiatricSecondaryicdCode,
    setPsychiatricSecondaryIcdCode,
    psychiatricSecondaryDescription,
    setPsychiatricSecondaryDescription,
    psychiatricTertiaryIcdCode,
    setPsychiatricTertiaryIcdCode,
    psychiatricTertiaryDescription,
    setPsychiatricTertiaryDescription,
    psychiatricAdditionalicdCode,
    setPsychiatricAdditionalIcdCode,
    psychiatricAdditionalDescription,
    setPsychiatricAdditionalDescription,
    psychiatricDiagnosesArray,
    primaryIcdCode,
    setPrimaryIcdCode,
    primaryDescription,
    setPrimaryDescription,
    secondaryicdCode,
    setSecondaryIcdCode,
    secondaryDescription,
    setSecondaryDescription,
    TertiaryIcdCode,
    setTertiaryIcdCode,
    TertiaryDescription,
    setTertiaryDescription,
    Additional1icdCode,
    setAdditional1IcdCode,
    Additional1Description,
    setAdditional1Description,
    medicalDiagnosesArray,
  } = {
    ...psychiatricDiagnosesForm.legacy,
    ...medicalDiagnosesForm.legacy,
  };
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

  // State variables for significantRecentLosses
  // set this value in api calling
  // shishpal
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
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [acceptResident, setAcceptResident] = useState(false);
  const [signers, setSigners] = useState([]);
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
  const hasTypedInForm = !!bhpSignature || !!adminSignature;
  const clearAllTyped = () => {
    setBhpSignature("");
    setBhpDate("");
    setBhpTime("");
    setAdminSignature("");
    setAdminSignatureDate("");
    setAdminSignatureTime("");
  };
  const [bhrfCriteria, setBhrfCriteria] = useState([]);
  const [clinicalSummary, setClinicalSummary] = useState("");
  const [treatmentRecommendations, setTreatmentRecommendations] = useState([]);

  // get array in api
  function getApiArrayData(startIndex, arrayLength, array) {
    if (arrayLength <= startIndex) {
      // Return an empty array if invalid parameters are provided
      return [];
    }
    const arr = [];
    for (let i = startIndex; i < arrayLength; i++) {
      arr.push(array[i]);
    }
    return arr;
  }
  useEffect(() => {
    if (getApiData) {
      setSigners(getApiData.signers);
      setSex(getApiData?.patientId?.gender);
      setDob(getApiData?.patientId?.dateOfBirth);
      setDiagnosis(getApiData?.patientId?.diagnosis);
      setAhcccsId(getApiData?.patientId?.ahcccsId);
      setResidentName(getApiData?.residentName);
      setAssessmentType(getApiData?.assessmentType);
      setHasNotified(getApiData?.hasNotified);
      setAssessmentOn(getApiData?.assessmentOn);
      setCompanyName(getApiData?.companyName);
      setDateOfAssessment(
        getApiData?.patientId?.admitDate
          ? getApiData?.patientId?.admitDate?.slice(0, 10)
          : "",
      );
      setBhrfCriteria(getApiData?.bhrfCriteria ?? []);
      setClinicalSummary(getApiData?.clinicalSummary ?? "");
      setTreatmentRecommendations(getApiData?.treatmentRecommendations ?? []);
      setAhcccsNumber(getApiData?.ahcccsNumber);
      setPreferredLanguage(getApiData?.preferredLanguage);
      setEthnicity(getApiData?.ethnicity);
      setAdmissionStatus(
        getApiData?.admissionStatus ? getApiData?.admissionStatus : [],
      );
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
        getApiData?.patientId?.stepDownBarriers ||
          getApiData?.stepDownBarriers ||
          getApiData?.residentLimitations ||
          [],
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
      setStepDownBarriersBoolean(
        getApiData?.patientId?.stepDownBarriers?.includes("Other") ||
          getApiData?.stepDownBarriers?.includes("Other") ||
          getApiData?.residentLimitations?.includes("Other") ||
          false,
      );
      setCurrentBehavioralIssues(getApiData?.currentBehavioralIssues);
      dynamicForms.loadFromApi(getApiData);
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

      // start
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
      setTriggers(getApiData?.triggers);
      setFallRisk(getApiData?.fallRisk);
      setFallRiskExplanation(getApiData?.fallRiskExplanation);
      setHobbiesLeisureActivities(getApiData?.hobbiesLeisureActivities);
      setSelectedValueMedical(
        getApiData?.medicalEquipmentArray
          ? getApiData?.medicalEquipmentArray.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setSelectedValueSpecialPrecautions(
        getApiData?.specialPrecautions
          ? getApiData?.specialPrecautions.map((item) => ({
              label: item,
              value: item,
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
      setRiskLevel(getApiData?.riskLevel);
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
      if (getApiData?.signatures) {
        loadSignaturesFromApi(getApiData.signatures);
      }
    }
    setResidentRepresentative(getApiData?.residentRepresentative);
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
    setCompanyName(userData?.companyName);
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
    const stringValues = residentStrengths.map((item) => item.value);
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

    // medical condition
    const otherConditionArrayTemp = [
      {
        condition: "diabetes",
        yes: yesDiabetes,
        comments: commentDiabety,
        state: true,
      },
      {
        condition: "Heart disease / heart attack",
        yes: yesHeart,
        comments: commentHeart,
        state: true,
      },
      {
        condition: "History",
        yes: yesHistory,
        comments: commentHistory,
        state: true,
      },
      {
        condition: "High Blood Pressure",
        yes: yesHigh,
        comments: commentHigh,
        state: true,
      },
      {
        condition: "Lung disease (ie asthma, COPD, emphysema)",
        yes: yesLung,
        comments: commentLung,
        state: true,
      },
      {
        condition: "Seizures",
        yes: yesSeizures,
        comments: commentSeizures,
        state: true,
      },
      {
        condition: "Cancer",
        yes: yesCancer,
        comments: commentCancer,
        state: true,
      },
      {
        condition: "Liver/kidney disease",
        yes: yesLiver,
        comments: commentLiver,
        state: true,
      },
      {
        condition: "Thyroid disorder",
        yes: yesThyroid,
        comment: thyroidDisorderArray,
        state: true,
      },
      {
        condition: "History of head trauma/traumatic brain injury",
        yes: yesbrain,
        comments: commentbrain,
        state: true,
      },
      {
        condition: "injury",
        yes: yesInjury,
        comments: commentInjury,
        state: true,
      },
      {
        condition: "Chronic painChronic pain",
        yes: yesChronic,
        comments: chronicCommit,
        state: true,
      },
      {
        condition: "Allergies",
        yes: AllergiesYes,
        comments: AllergiesComment,
        state: true,
      },
      {
        condition: "Surgeries",
        yes: SurgeriesYes,
        comments: SurgeriesComment,
        state: true,
      },
      {
        condition: "Number of pregnancies / births",
        yes: pregnanciesYes,
        comments: pregnanciesComment,
        state: true,
      },
      {
        condition: "Substance use disorder (please specify)",
        yes: SubstanceYes,
        comments: SubstanceComment,
        state: true,
      },
      {
        condition: "Depression",
        yes: DepressionYes,
        comments: DepressionComment,
        state: true,
      },
      {
        condition: "Anxiety/panic attacks",
        yes: AnxietyYes,
        comments: AnxietyComment,
        state: true,
      },
      {
        condition: "Insomnia",
        yes: InsomniaYes,
        comments: InsomniaComment,
        state: true,
      },
      {
        condition: "Bipolar disorder",
        yes: BipolarYes,
        comments: BipolarComment,
        state: true,
      },
      {
        condition: "Schizophrenia",
        yes: SchizophreniaYes,
        comments: SchizophreniaComment,
        state: true,
      },
      {
        condition: "Obsessive compulsive disorder",
        yes: ObsessiveYes,
        comments: ObsessiveComment,
        state: true,
      },
      {
        condition: "Personality disorder (please specify)",
        yes: PersonalityYes,
        comments: PersonalityComment,
        state: true,
      },
      {
        condition: "Phobias",
        yes: PhobiasYes,
        comments: PhobiasComment,
        state: true,
      },
      {
        condition: "Any other health conditions",
        yes: healthConditionsYes,
        comments: healthConditionsYesComment,
        state: true,
      },
      {
        condition: "Infection or Diseases",
        yes: healthConditionsYes,
        comment: infectionDiseasesArray,
        state: true,
      },
    ];
    const otherConditionArrayTempAns =
      dynamicForms.toSubmitSnapshots().medicalConditions;

    // substance array
    const typeArrayTemp = [
      {
        types: "Alcohol",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseAlcohol,
        lastUse: substanceAbuseHistoryDataLastUseAlcohol?.value,
        frequency: substanceAbuseHistoryDataFrequencyAlcohol?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyAlcohol?.value,
        state: true,
      },
      {
        types: "Benzodiazepines",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
        lastUse: substanceAbuseHistoryDataLastUseBenzodiazepines?.value,
        frequency: substanceAbuseHistoryDataFrequencyBenzodiazepines?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines?.value,
        state: true,
      },
      {
        types: "Crack",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseCrack,
        lastUse: substanceAbuseHistoryDataLastUseCrack?.value,
        frequency: substanceAbuseHistoryDataFrequencyCrack?.value,
        lengthOfSobriety: substanceAbuseHistoryDataLengthOfSobrietyCrack?.value,
        state: true,
      },
      {
        types: "Heroin",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseHeroin,
        lastUse: substanceAbuseHistoryDataLastUseHeroin?.value,
        frequency: substanceAbuseHistoryDataFrequencyHeroin?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyHeroin?.value,
        state: true,
      },
      {
        types: "Inhalants",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseInhalants,
        lastUse: substanceAbuseHistoryDataLastUseInhalants?.value,
        frequency: substanceAbuseHistoryDataFrequencyInhalants?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyInhalants?.value,
        state: true,
      },
      {
        types: "Marijuana",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseMarijuana,
        lastUse: substanceAbuseHistoryDataLastUseMarijuana?.value,
        frequency: substanceAbuseHistoryDataFrequencyMarijuana?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyMarijuana?.value,
        state: true,
      },
      {
        types: "Methamphetamine",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine,
        lastUse: substanceAbuseHistoryDataLastUseMethamphetamine?.value,
        frequency: substanceAbuseHistoryDataFrequencyMethamphetamine?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine?.value,
        state: true,
      },
      {
        types: "Methadone",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseMethadone,
        lastUse: substanceAbuseHistoryDataLastUseMethadone?.value,
        frequency: substanceAbuseHistoryDataFrequencyMethadone?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyMethadone?.value,
        state: true,
      },
      {
        types: "MDMA (ecstasy)",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseMDMA,
        lastUse: substanceAbuseHistoryDataLastUseMDMA?.value,
        frequency: substanceAbuseHistoryDataFrequencyMDMA?.value,
        lengthOfSobriety: substanceAbuseHistoryDataLengthOfSobrietyMDMA?.value,
        state: true,
      },
      {
        types: "Primary Care Physician (angel dust)",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUsePCP,
        lastUse: substanceAbuseHistoryDataLastUsePCP?.value,
        frequency: substanceAbuseHistoryDataFrequencyPCP?.value,
        lengthOfSobriety: substanceAbuseHistoryDataLengthOfSobrietyPCP?.value,
        state: true,
      },
      {
        types: "Prescription medicine",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUsePrescription,
        lastUse: substanceAbuseHistoryDataLastUsePrescription?.value,
        frequency: substanceAbuseHistoryDataFrequencyPrescription?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyPrescription?.value,
        state: true,
      },
      {
        types: "OTC medicine",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseOTC,
        lastUse: substanceAbuseHistoryDataLastUseOTC?.value,
        frequency: substanceAbuseHistoryDataFrequencyOTC?.value,
        lengthOfSobriety: substanceAbuseHistoryDataLengthOfSobrietyOTC?.value,
        state: true,
      },
      {
        types: "Cocaine",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseCocaine,
        lastUse: substanceAbuseHistoryDataLastUseCocaine?.value,
        frequency: substanceAbuseHistoryDataFrequencyCocaine?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyCocaine?.value,
        state: true,
      },
      {
        types: "Hallucinogens",
        ageOfFirstUse: substanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
        lastUse: substanceAbuseHistoryDataLastUseHallucinogens?.value,
        frequency: substanceAbuseHistoryDataFrequencyHallucinogens?.value,
        lengthOfSobriety:
          substanceAbuseHistoryDataLengthOfSobrietyHallucinogens?.value,
        state: true,
      },
    ];
    const typeArrayTempAns = [...typeArrayTemp, ...typeArray];
    const handleRiskFactorActivityArrayTemp = [
      {
        type: "Bathing/Showering",
        good: BathingGood,
        fair: BathingFair,
        otherCurrentNotSoGood: BathingNotSoGood,
        needAssist: BathingGoodNeedAssist,
        comments: BathingComments,
        state: true,
      },
      {
        type: "Grooming/hygiene",
        good: GroomingGood,
        fair: GroomingFair,
        otherCurrentNotSoGood: GroomingNotSoGood,
        needAssist: GroomingGoodNeedAssist,
        comments: GroomingComments,
        state: true,
      },
      {
        type: "Mobility",
        good: MobilityGood,
        fair: MobilityFair,
        otherCurrentNotSoGood: MobilityNotSoGood,
        needAssist: MobilityGoodNeedAssist,
        comments: MobilityComments,
        state: true,
      },
      {
        type: "Housework",
        good: HouseworkGood,
        fair: HouseworkFair,
        otherCurrentNotSoGood: HouseworkNotSoGood,
        needAssist: HouseworkGoodNeedAssist,
        comments: HouseworkComments,
        state: true,
      },
      {
        type: "Shopping",
        good: ShoppingGood,
        fair: ShoppingFair,
        otherCurrentNotSoGood: ShoppingNotSoGood,
        needAssist: ShoppingGoodNeedAssist,
        comments: ShoppingComments,
        state: true,
      },
      {
        type: "Managing money/budget",
        good: ManagingGood,
        fair: ManagingFair,
        otherCurrentNotSoGood: ManagingNotSoGood,
        needAssist: ManagingGoodNeedAssist,
        comments: ManagingComments,
        state: true,
      },
      {
        type: "Preparing food",
        good: PreparingGood,
        fair: PreparingFair,
        otherCurrentNotSoGood: PreparingNotSoGood,
        needAssist: PreparingGoodNeedAssist,
        comments: PreparingComments,
        state: true,
      },
      {
        type: "Eating",
        good: EatingGood,
        fair: EatingFair,
        otherCurrentNotSoGood: EatingNotSoGood,
        needAssist: EatingGoodNeedAssist,
        comments: EatingComments,
        state: true,
      },
      {
        type: "Toileting",
        good: ToiletingGood,
        fair: ToiletingFair,
        otherCurrentNotSoGood: ToiletingNotSoGood,
        needAssist: ToiletingGoodNeedAssist,
        comments: ToiletingComments,
        state: true,
      },
      {
        type: "Taking medications",
        good: TakingGood,
        fair: TakingFair,
        otherCurrentNotSoGood: TakingNotSoGood,
        needAssist: TakingGoodNeedAssist,
        comments: TakingComments,
        state: true,
      },
    ];
    const handleRiskFactorActivityArrayTempAns = [
      ...handleRiskFactorActivityArrayTemp,
      ...handleRiskFactorActivityArray,
    ];

    // riskFactors
    const riskFactorsTemp = [
      {
        type: "Current suicidal ideation",
        yesNo: riskYesNo,
        comment: riskComment,
        state: true,
      },
      {
        type: "Prior suicide attempt",
        yesNo: PriorYesNo,
        comment: PriorComment,
        state: true,
      },
      {
        type: "Access to means (i.e. weapon)",
        yesNo: AccessYesNo,
        comment: AccessComment,
        state: true,
      },
      {
        type: "Substance abuse",
        yesNo: SubstanceYesNo,
        comment: SubstanceAbuseComment,
        state: true,
      },
      {
        type: "Other self-abusing behavior",
        yesNo: abusingYesNo,
        comment: abusingComment,
        state: true,
      },
      {
        type: "Recent losses/lack of support",
        yesNo: RecentYesNo,
        comment: RecentComment,
        state: true,
      },
      {
        type: "Behavior cues",
        yesNo: behaviourYesNO,
        comments: riskFacrtor1,
        state: true,
      },
      {
        type: "Symptoms of psychosis",
        yesNo: SymptomsYesNO,
        comments: riskFacrtor2,
        state: true,
      },
      {
        type: "Family history of suicide",
        yesNo: FamilyYesNO,
        comment: Family,
        state: true,
      },
      {
        type: "Terminal physical illness",
        yesNo: TerminalYesNO,
        comment: Terminal,
        state: true,
      },
      {
        type: "Current stressors (specify)",
        yesNo: CurrentYesNO,
        comment: Current,
        state: true,
      },
      {
        type: "Chronic pain",
        yesNo: ChronicYesNO,
        comment: ChronicPain,
        state: true,
      },
    ];
    const riskFactorArrayTempAns = [...riskFactorsTemp, ...riskFactorArray];

    // protectiveFactorsArray
    const protectiveFactorsArrayTemp = [
      {
        type: "Supports available (family friends)",
        yesNo: SupportsYesNo,
        comment: SupportsComment,
        state: true,
      },
      {
        type: "Spiritual / religious support",
        yesNo: SpiritualYesNo,
        comment: SpiritualComment,
        state: true,
      },
      {
        type: "Religious/cultural prohibitions",
        yesNo: ReligiousYesNo,
        comment: ReligiousComment,
        state: true,
      },
      {
        type: "Fear of consequences",
        yesNo: FearYesNo,
        comment: FearComment,
        state: true,
      },
      {
        type: "Able to be engaged in intervention",
        yesNo: interventionYesNo,
        comment: interventionComment,
        state: true,
      },
      {
        type: "Willing to commit to keeping self safe",
        yesNo: WillingYesNo,
        comment: WillingComment,
        state: true,
      },
    ];
    const protectiveFactorsArrayTempAns = [
      ...protectiveFactorsArrayTemp,
      ...protectiveFactorsArray,
    ];

    //psychiatricDiagnoses
    const psychiatricDiagnosesArrayTemp = [
      {
        icdCode: psychiatricPrimaryIcdCode,
        description: psychiatricPrimaryDescription,
        name: "Primary",
        state: true,
      },
      {
        icdCode: psychiatricSecondaryicdCode,
        description: psychiatricSecondaryDescription,
        name: "Secondary",
        state: true,
      },
      {
        icdCode: psychiatricTertiaryIcdCode,
        description: psychiatricTertiaryDescription,
        name: "Tertiary",
        state: true,
      },
      {
        icdCode: psychiatricAdditionalicdCode,
        description: psychiatricAdditionalDescription,
        name: "Additional",
        state: true,
      },
    ];
    const psychiatricDiagnosesArrayAns = [
      ...psychiatricDiagnosesArrayTemp,
      ...psychiatricDiagnosesArray,
    ];
    const medicalDiagnosesArrayTemp = [
      {
        icdCode: primaryIcdCode,
        description: primaryDescription,
        name: "Primary",
        state: true,
      },
      {
        icdCode: secondaryicdCode,
        description: secondaryDescription,
        name: "Secondary",
        state: true,
      },
      {
        icdCode: TertiaryIcdCode,
        description: TertiaryDescription,
        name: "Tertiary",
        state: true,
      },
      {
        icdCode: Additional1icdCode,
        description: Additional1Description,
        name: "Additional",
        state: true,
      },
    ];
    const medicalDiagnosesArrayTempAns = [
      ...medicalDiagnosesArrayTemp,
      ...psychiatricDiagnosesArray,
    ];
    const data = {
      residentName,
      dateOfBirth: dob,
      sex,
      assessmentType,
      patientId: patientId,
      hasNotified,
      assessmentOn,
      companyName,
      dateOfAssessment,
      ahcccsNumber,
      preferredLanguage,
      ethnicity,
      admissionStatus,
      programLocation,
      guardianship,
      powerOfAttorneyStatus,
      todayDate,
      guardianshipPoaPubFidName,
      approvedBy,
      reasonForAdmission: reasonForAdmissionArray,
      residentGoals,
      residentStrengths: stringValues,
      residentLimitations,
      currentBehavioralIssues,
      medicalConditions: otherConditionArrayTempAns,
      SignificantFamilyMedicalPsychiatricHistory:
        SignificantFamilyMedicalPsychiatricHistoryArray,
      mentalHealthTreatmentHistory: typeOfServiceArray,
      substanceAbuseHistory,
      substanceAbuseDenies,
      substanceAbuseHistoryData: typeArrayTempAns,
      ActiveWithdrawalSymptoms: {
        noneReportedOrObserved,
        Agitation,
        Nausea,
        Vomiting,
        Headache,
        TactileDisturbances,
        Anxiety,
        Tremors,
        VisualDisturbances,
        AuditoryDisturbances: VisualDisturbancesOtherType,
        Sweats,
        Paranoia,
        GooseBumps,
        Runningnose,
        BonePain,
        Tearing,
        Seizures,
        LossofMuscleCoordination,
        LossofMuscleCoordinationOtherType,
      },
      mentalStatusExam: {
        apparentAge: {
          consistent: consistent,
          younger,
          older,
          otherComment: olderOther,
        },
        height: {
          average: averageHeight,
          short,
          tall,
          otherComment: heigthOther,
        },
        weight: {
          average: averageWeight,
          obese,
          overweight,
          thin,
          emaciated,
          otherComment: WeightOther,
        },
        attire: {
          Casual: casual,
          Neat: neat,
          Tattered: tattered,
          Dirty: dirty,
          otherComment: attireOther,
        },
        grooming: {
          wellGroomed: wellGroomed,
          adequate: adequateGrooming,
          unkempt,
          disheveled,
          otherComment: GroomingOther,
        },
        Mood: {
          Euthymic: euthymic,
          Irritable: irritable,
          Elevated: elevated,
          Depressed: depressedMood,
          Anxious: anxious,
          otherComment: euthymicOtherBooleanType,
        },
        Affect: {
          normalRange,
          Depressed: depressedAffect,
          Labile: labile,
          Constricted: constricted,
          otherComment: otherText,
        },
        EyeContact: {
          Appropriate: appropriate,
          Minimal: minimal,
          Poor: poor,
          Adequate: adequateEyeContact,
          otherComment: EyeContactOtherBooleanType,
        },
        Cooperation: {
          Appropriate: appropriateCooperation,
          Hostile: hostile,
          Evasive: evasive,
          Defensive: defensive,
          Indifferent: indifferent,
          otherComment: CooperationOtherBooleanType,
        },
        Articulation: {
          Normal: normalArticulation,
          Unintelligible: unintelligible,
          Mumbled: mumbled,
          Slurred: slurred,
          Stuttered: stuttered,
          otherComment: ArticulationOtherBooleanOther,
        },
        Tone: {
          Normal: normalTone,
          Soft: soft,
          Loud: loud,
          Pressured: pressured,
          otherComment: ToneOtherBooleanOther,
        },
        Rate: {
          Normal: normalRate,
          Slow: slow,
          Fast: fast,
          otherComment: RateOtherBooleanOther,
        },
        Quantity: {
          Normal: normalQuantity,
          Verbose: verbose,
          Mutism: mutism,
          otherComment: QuantityOtherBooleanOther,
        },
        responseLatency: {
          Normal: normalresponseLatency,
          Delayed: delayed,
          Shortened: shortened,
          otherComment: responseLatencyOtherBooleanOther,
        },
        thoughtContent: {
          Unremarkable: unremarkablethoughtContent,
          Suspicious: suspicious,
          Negative: negative,
          Concrete: concrete,
          otherComment: thoughtContentOther,
        },
        thoughtProcesses: {
          logicalCoherent: logicalCoherent,
          Tangential: tangential,
          Circumstantial: circumstantial,
          Vague: vague,
          otherComment: thoughtProcessesOther,
        },
        Delusions: {
          No: noDelusions,
          YesPersecutory: yesPersecutory,
          YesSomatic: yesSomatic,
          YesGrandiose: yesGrandiose,
          otherComment: yesOtherDelusionsText,
        },
        Hallucinations: {
          Unremarkable: unremarkableHallucinations,
          VisualHallucinations: visualHallucinations,
          AuditoryHallucinations: auditoryHallucinations,
          TactileHallucinations: tactileHallucinations,
          otherComment: yesOtherHallucinationsText,
        },
        Gait: {
          Normal: normalGait,
          Staggering: staggering,
          Shuffling: shuffling,
          Slow: slowGait,
          Awkward: awkward,
          otherComment: gaitOther,
        },
        Posture: {
          Normal: normalPosture,
          Relaxed: relaxed,
          Rigid: rigid,
          Tense: tense,
          Slouched: slouched,
          otherComment: PostureOther,
        },
        PsychomotorActivity: {
          Withinnormallimits: withinNormalLimits,
          Calm: calm,
          Hyperactive: hyperactive,
          Agitated: agitated,
          Hypoactive: hypoactive,
          otherComment: PsychomotorActivityOther,
        },
        Mannerisms: {
          None: none,
          Tics: tics,
          Tremors: tremorsMannerisms,
          Rocking: rocking,
          Picking: picking,
          otherComment: MannerismsOther,
        },
        orientation: {
          person,
          place,
          time,
          circumstances: circumstances,
        },
        Judgment: {
          Good: goodJudgment,
          Fair: fairJudgment,
          Poor: poorJudgment,
        },
        Insight: {
          Good: goodInsight,
          Fair: fairInsight,
          Poor: poorInsight,
        },
        Memory: {
          Good: goodMemory,
          Fair: fairMemory,
          Poor: poorMemory,
        },
        AbilityToConcentration: {
          Intact: intactAbilityToConcentration,
          Other: otherAbilityToConcentration,
        },
      },
      significantSocialDevelopmentalHistory,
      personalInformation: {
        educationalHistory,
        // highestEducation,
        specialEducation,
        currentStudent,
        currentStudentLocation: ifYesWhere,
      },
      employmentHistory: {
        currentlyEmployed,
        employmentLocation,
      },
      workHistory,
      militaryHistory: {
        militaryService,
        activeDuty,
      },
      legalHistory: selectedValueArray,
      independentLivingSkills: handleRiskFactorActivityArrayTempAns,
      triggers,
      fallRisk,
      fallRiskExplanation,
      hobbiesLeisureActivities,
      medicalEquipmentArray: selectedValueMedicalArray,
      specialPrecautions: selectedValueSpecialPrecautionsArray,
      currentThoughtsOfHarmingSelf,
      suicidalIdeation,
      suicidalIdeationUrgency,
      suicidalIdeationSeverity,
      currentThoughtsOfHarmingOthers,
      riskFactors: riskFactorArrayTempAns,
      protectiveFactors: protectiveFactorsArrayTempAns,
      riskLevel,
      psychiatricDiagnoses: psychiatricDiagnosesArrayAns,
      medicalDiagnoses: medicalDiagnosesArrayTempAns,
      primarySupportGroup,
      maritalProblems,
      accessToHealthCareServices,
      educationalProblems,
      housingProblems,
      familyProblems,
      occupationalProblems,
      interactionWithLegalSystem,
      substanceUseInHome,
      sexualProblems,
      otherStressors,
      significantRecentLosses: {
        yes: setNoAndYes,
        typeOfLoss: {
          death,
          injury,
          medicalSurgical,
          job,
          divorceSeparation: divorceSeparation,
          accidentInjury,
          childRemovedFromHouse,
          violentActsAgainstPersonFamily: violentActsAgainstPersonFamily,
          comment: otherSignificantRecentLossesType ? true : false,
        },
        comment: otherSignificantRecentLossesType,
      },
      additionalNotes,
      acceptResident,
      saveAsDraft: saveAsDraft,
      signatures,
      signers,
    };
    intakeService.initialAssessment.update(id, data, {
      setLoading,
      navigate,
    });
  };
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
    abusingComment,
    abusingYesNo,
    acceptResident,
    AccessComment,
    accessToHealthCareServices,
    AccessYesNo,
    accidentInjury,
    activeDuty,
    activeWithdrawalForm,
    Additional1Description,
    Additional1icdCode,
    additionalNotes,
    adequateEyeContact,
    adequateGrooming,
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionStatus,
    agitated,
    Agitation,
    ahcccsId,
    ahcccsNumber,
    AllergiesComment,
    AllergiesYes,
    allPenSigsHaveNames,
    Anxiety,
    AnxietyComment,
    AnxietyYes,
    anxious,
    appropriate,
    appropriateCooperation,
    approvedBy,
    ArticulationOtherBoolean,
    ArticulationOtherBooleanOther,
    assessmentOn,
    assessmentType,
    attireBoolean,
    attireOther,
    auditoryHallucinations,
    averageHeight,
    averageWeight,
    awkward,
    BathingComments,
    BathingFair,
    BathingGood,
    BathingGoodNeedAssist,
    BathingNotSoGood,
    behaviorcuesDropDown,
    behaviourYesNO,
    bhpCredentials,
    bhpDate,
    bhpName,
    bhpSignature,
    bhpTime,
    bhrfCriteria,
    BipolarComment,
    BipolarYes,
    BonePain,
    calm,
    casual,
    childRemovedFromHouse,
    chronicCommit,
    ChronicPain,
    ChronicYesNO,
    circumstances,
    circumstantial,
    clearAllTyped,
    clinicalSummary,
    commentbrain,
    commentCancer,
    commentDiabety,
    commentHeart,
    commentHigh,
    commentHistory,
    commentInjury,
    commentLiver,
    commentLung,
    commentSeizures,
    companyName,
    componentRef,
    concrete,
    consistent,
    constricted,
    CooperationOtherBoolean,
    CooperationOtherBooleanType,
    Current,
    currentBehavioralIssues,
    currentlyEmployed,
    currentStudent,
    currentThoughtsOfHarmingOthers,
    currentThoughtsOfHarmingSelf,
    CurrentYesNO,
    dateOfAssessment,
    death,
    defensive,
    delayed,
    depressedAffect,
    depressedMood,
    DepressionComment,
    DepressionYes,
    diagnosis,
    dirty,
    disheveled,
    divorceSeparation,
    dob,
    dynamicForms,
    EatingComments,
    EatingFair,
    EatingGood,
    EatingGoodNeedAssist,
    EatingNotSoGood,
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
    EyeContactOtherBoolean,
    EyeContactOtherBooleanType,
    fairInsight,
    fairJudgment,
    fairMemory,
    fallRisk,
    fallRiskExplanation,
    Family,
    familyProblems,
    FamilyYesNO,
    fast,
    FearComment,
    FearYesNo,
    filedForm,
    gaitOther,
    gaitOtherBoolen,
    getApiArrayData,
    getApiData,
    goodInsight,
    goodJudgment,
    goodMemory,
    GooseBumps,
    GroomingBoolean,
    GroomingComments,
    GroomingFair,
    GroomingGood,
    GroomingGoodNeedAssist,
    GroomingNotSoGood,
    GroomingOther,
    guardianship,
    guardianshipPoaPubFidName,
    guardTyped,
    handleAddCondition,
    handleRemoveItem,
    handleRiskFactorActivityArray,
    handleSubmit,
    handleTypeOfArray,
    handleTypeOfService,
    hasNotified,
    hasTypedInForm,
    Headache,
    healthConditionsYes,
    healthConditionsYesComment,
    heigthBoolean,
    heigthOther,
    highestEducation,
    hobbiesLeisureActivities,
    hostile,
    hoursFormat,
    HouseworkComments,
    HouseworkFair,
    HouseworkGood,
    HouseworkGoodNeedAssist,
    HouseworkNotSoGood,
    housingProblems,
    hyperactive,
    hypoactive,
    id,
    ifYesWhere,
    independentLiving,
    indifferent,
    infectionDiseases,
    InfectionYes,
    injury,
    InsomniaComment,
    InsomniaYes,
    intactAbilityToConcentration,
    intactAbilityToConcentrationOtherBoolean,
    interactionWithLegalSystem,
    interventionComment,
    interventionYesNo,
    irritable,
    job,
    labile,
    loading,
    logicalCoherent,
    LossofMuscleCoordination,
    LossofMuscleCoordinationOtherBoolean,
    LossofMuscleCoordinationOtherType,
    loud,
    ManagingComments,
    ManagingFair,
    ManagingGood,
    ManagingGoodNeedAssist,
    ManagingNotSoGood,
    MannerismsOther,
    MannerismsOtherBoolen,
    maritalProblems,
    medicalConditions,
    medicalDiagnosesArray,
    medicalDiagnosesForm,
    medicalSurgical,
    mentalHealthTreatmentHistoryDates,
    mentalHealthTreatmentHistoryDiagnosisReason,
    mentalHealthTreatmentHistoryTypeOfService,
    mentalHealthTreatmentHistoryWhere,
    mentalStatusExamForm,
    militaryService,
    minimal,
    MobilityComments,
    MobilityFair,
    MobilityGood,
    MobilityGoodNeedAssist,
    MobilityNotSoGood,
    mumbled,
    mutism,
    Nausea,
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
    normalresponseLatency,
    normalTone,
    obese,
    ObsessiveComment,
    ObsessiveYes,
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
    OtherConditionOther,
    otherConditionYesNO,
    otherFrequancy,
    otherLastUse,
    OtherlengthOfSobrifty,
    otherSignificantRecentLosses,
    otherSignificantRecentLossesType,
    otherStressors,
    otherText,
    otherTypeOther,
    overweight,
    Paranoia,
    patientId,
    person,
    PersonalityComment,
    PersonalityYes,
    PhobiasComment,
    PhobiasYes,
    picking,
    place,
    poor,
    poorInsight,
    poorJudgment,
    poorMemory,
    PostureOther,
    PostureOtherBoolen,
    powerOfAttorneyStatus,
    preferredLanguage,
    pregnanciesComment,
    pregnanciesYes,
    PreparingComments,
    PreparingFair,
    PreparingGood,
    PreparingGoodNeedAssist,
    PreparingNotSoGood,
    pressured,
    primaryDescription,
    primaryIcdCode,
    primarySupportGroup,
    PriorComment,
    PriorYesNo,
    profile,
    Profile,
    profileInfo,
    programLocation,
    protectiveFactors,
    protectiveFactorsArray,
    psychiatricAdditionalDescription,
    psychiatricAdditionalicdCode,
    psychiatricDiagnosesArray,
    psychiatricDiagnosesForm,
    psychiatricPrimaryDescription,
    psychiatricPrimaryIcdCode,
    psychiatricSecondaryDescription,
    psychiatricSecondaryicdCode,
    psychiatricTertiaryDescription,
    psychiatricTertiaryIcdCode,
    PsychomotorActivityOther,
    PsychomotorActivityOtherBoolen,
    QuantityOtherBoolean,
    QuantityOtherBooleanOther,
    RateOtherBoolean,
    RateOtherBooleanOther,
    reasonForAdmission,
    RecentComment,
    RecentYesNo,
    relaxed,
    ReligiousComment,
    ReligiousYesNo,
    removehandleAddCondition,
    removeTypeArray,
    residentGauardianSignature,
    residentGoals,
    residentGuardianDate,
    residentGuardianName,
    residentGuardianTime,
    residentLimitations,
    residentName,
    residentRepresentative,
    residentStrengths,
    responseLatencyOtherBoolean,
    responseLatencyOtherBooleanOther,
    rigid,
    riskComment,
    riskFactorArray,
    riskFactors,
    riskLevel,
    riskYesNo,
    rocking,
    Runningnose,
    saveAsDraft,
    SchizophreniaComment,
    SchizophreniaYes,
    secondaryDescription,
    secondaryicdCode,
    Seizures,
    selectedValue,
    selectedValueMedical,
    selectedValueSpecialPrecautions,
    setabusingComment,
    setabusingYesNo,
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
    setbrain,
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
    setCurrentlyEmployed,
    setCurrentStudent,
    setCurrentThoughtsOfHarmingOthers,
    setCurrentThoughtsOfHarmingSelf,
    setCurrentYesNo,
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
    seteuthymicOtherBoolean,
    seteuthymicOtherBooleanType,
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
    setgaitOtherBoolen,
    setGetApiData,
    setgetOther,
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
    setHasNotified,
    setHeadache,
    setHealthConditionsYes,
    sethealthConditionsYesComment,
    setHeigthBoolean,
    setHeigthOther,
    setHighestEducation,
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
    setLoading,
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
    setMedicalSurgical,
    setMentalHealthTreatmentHistoryDates,
    setMentalHealthTreatmentHistoryDiagnosisReason,
    setMentalHealthTreatmentHistoryTypeOfService,
    setMentalHealthTreatmentHistoryWhere,
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
    setNormalresponseLatency,
    setNormalTone,
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
    setOtherConditionDiscription,
    setOtherConditionOther,
    setOtherConditionYesNo,
    setOtherFrequancy,
    setOtherLastUse,
    setOtherLengthOfSobirty,
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
    setPsychiatricAdditionalDescription,
    setPsychiatricAdditionalIcdCode,
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
    stepDownBarriersOther,
    stepDownBarriersText,
    stepDownBarriersBoolean,
    setStepDownBarriersOther,
    setStepDownBarriersText,
    setStepDownBarriersBoolean,
    setResidentLimitations,
    setResidentName,
    setResidentRepresentative,
    setResidentStrengths,
    setresponseLatencyOtherBoolean,
    setresponseLatencyOtherBooleanOther,
    setRigid,
    setRiskComment,
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
    setSigners,
    setSignerSignature,
    setSignerTime,
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
    setSubstanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    setSubstanceAbuseHistoryDataAgeOfFirstUseMDMA,
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
    setSubstanceAbuseHistoryDataFrequencyMarijuana,
    setSubstanceAbuseHistoryDataFrequencyMDMA,
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
    setSubstanceAbuseHistoryDataLastUseMarijuana,
    setSubstanceAbuseHistoryDataLastUseMDMA,
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
    setSubstanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    setSubstanceAbuseHistoryDataLengthOfSobrietyMDMA,
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
    setthoughtContentBoolean,
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
    sex,
    sexualProblems,
    ShoppingComments,
    ShoppingFair,
    ShoppingGood,
    ShoppingGoodNeedAssist,
    ShoppingNotSoGood,
    short,
    shortened,
    showSignatureResident,
    shuffling,
    signatures,
    signerIndex,
    signers,
    SignificantFamilyMedicalPsychiatricHistory,
    significantSocialDevelopmentalHistory,
    slouched,
    slow,
    slowGait,
    slurred,
    soft,
    specialEducation,
    SpiritualComment,
    SpiritualYesNo,
    staffDate,
    staffDateTime,
    staffName,
    staffSignature,
    staggering,
    stuttered,
    substanceAbuse,
    SubstanceAbuseComment,
    substanceAbuseDenies,
    substanceAbuseHistory,
    substanceAbuseHistoryDataAgeOfFirstUseAlcohol,
    substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines,
    substanceAbuseHistoryDataAgeOfFirstUseCocaine,
    substanceAbuseHistoryDataAgeOfFirstUseCrack,
    substanceAbuseHistoryDataAgeOfFirstUseHallucinogens,
    substanceAbuseHistoryDataAgeOfFirstUseHeroin,
    substanceAbuseHistoryDataAgeOfFirstUseInhalants,
    substanceAbuseHistoryDataAgeOfFirstUseMarijuana,
    substanceAbuseHistoryDataAgeOfFirstUseMDMA,
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
    substanceAbuseHistoryDataFrequencyMarijuana,
    substanceAbuseHistoryDataFrequencyMDMA,
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
    substanceAbuseHistoryDataLastUseMarijuana,
    substanceAbuseHistoryDataLastUseMDMA,
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
    substanceAbuseHistoryDataLengthOfSobrietyMarijuana,
    substanceAbuseHistoryDataLengthOfSobrietyMDMA,
    substanceAbuseHistoryDataLengthOfSobrietyMethadone,
    substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine,
    substanceAbuseHistoryDataLengthOfSobrietyOTC,
    substanceAbuseHistoryDataLengthOfSobrietyPCP,
    substanceAbuseHistoryDataLengthOfSobrietyPrescription,
    SubstanceComment,
    substanceUseInHome,
    SubstanceYes,
    SubstanceYesNo,
    suicidalIdeation,
    suicidalIdeationSeverity,
    suicidalIdeationUrgency,
    SupportsComment,
    SupportsYesNo,
    SurgeriesComment,
    SurgeriesYes,
    suspicious,
    Sweats,
    symptomsOfPsychosisDropDown,
    SymptomsYesNO,
    TactileDisturbances,
    tactileHallucinations,
    TakingComments,
    TakingFair,
    TakingGood,
    TakingGoodNeedAssist,
    TakingNotSoGood,
    tall,
    tangential,
    tattered,
    Tearing,
    tense,
    Terminal,
    TerminalYesNO,
    TertiaryDescription,
    TertiaryIcdCode,
    thin,
    thoughtContentBoolaen,
    thoughtContentOther,
    thoughtProcessesBoolean,
    thoughtProcessesOther,
    thyroidDisorder,
    tics,
    time,
    todayDate,
    ToiletingComments,
    ToiletingFair,
    ToiletingGood,
    ToiletingGoodNeedAssist,
    ToiletingNotSoGood,
    ToneOtherBoolean,
    ToneOtherBooleanOther,
    treatmentRecommendations,
    Tremors,
    tremorsMannerisms,
    triggers,
    typeArray,
    typedGuardDialog,
    typeOfServiceArray,
    unintelligible,
    unkempt,
    unremarkableHallucinations,
    unremarkablethoughtContent,
    updateSignature,
    userData,
    userType,
    vague,
    verbose,
    violentActsAgainstPersonFamily,
    VisualDisturbances,
    VisualDisturbancesOtherBoolean,
    VisualDisturbancesOtherType,
    visualHallucinations,
    Vomiting,
    WeightBoolean,
    WeightOther,
    wellGroomed,
    WillingComment,
    WillingYesNo,
    withinNormalLimits,
    witnessIncomplete,
    witnessNamePresent,
    witnessSigPresent,
    workHistory,
    yesbrain,
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
    younger,
  };
}

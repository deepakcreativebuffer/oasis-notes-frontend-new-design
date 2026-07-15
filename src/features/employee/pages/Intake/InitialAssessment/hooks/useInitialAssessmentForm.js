/* eslint-disable no-unused-vars */
/** @format */
import React, { useCallback, useEffect, useState } from "react";
import "../InitialAssessment.css";
import { AiFillDelete } from "react-icons/ai";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Select from "@/features/shared/ui/Search/Search";
import {
  intakeService,
  employeeService,
  patientService,
} from "@/features/shared/services/index";
import { AutoSize } from "@/features/shared/ui/forms/AutoSize";
import {
  AddSignature,
  deletePermission,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import { ClipLoader } from "react-spinners";
import PatientComponent from "@/features/shared/ui/Search/PatientComponent";
import "@/features/resident/pages/Intake/FaceSheet/Facesheet.css";
import "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css";
import MultiEmployee from "@/features/shared/ui/Search/MultiEmployee";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import DatePicker from "react-datepicker";
import { BorderlessInput } from "@/utils/Makers";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import { ROLES, ACCOUNT_TYPES } from "@/features/shared/constants/index";
import { logger } from "@/utils/index";
import { buildAssessmentPayload } from "../utils/payloadMapper";
import { usePrintAssessment } from "./usePrintAssessment";
import { useSignatureManagement } from "./useSignatureManagement";
import { useAssessmentForm } from "./useAssessmentForm";
import SelectSinglePrint from "../components/common/SelectSinglePrint";
import { useResidentStrengths } from "./useResidentStrengths";
import { useIndependentLivingSkills } from "./useIndependentLivingSkills";
import { mergeDynamicFormSnapshots } from "../utils/formSnapshotBridge";
import { useActiveWithdrawalSymptoms } from "./useActiveWithdrawalSymptoms";
import { useMentalStatusExam } from "./useMentalStatusExam";
import { useRiskFactors } from "./useRiskFactors";
import { useProtectiveFactors } from "./useProtectiveFactors";
import { useMedicalConditions } from "./useMedicalConditions";
import { useDiagnosisSlots } from "./useDiagnosisSlots";
import { useSubstanceAbuseHistory } from "./useSubstanceAbuseHistory";
import {
  useDiagnosisSelectHandlers,
  useFamilyMentalHealthSelectHandlers,
  useMedicalConditionsSelectHandlers,
  usePatientInformationSelectHandlers,
  useRiskFactorsSelectHandlers,
} from "./useInitialAssessmentSelectHandlers";
import {
  PSYCHIATRIC_DIAGNOSIS_SLOTS,
  MEDICAL_DIAGNOSIS_SLOTS,
} from "../config/diagnosisSlotsConfig";

export function useInitialAssessmentForm() {
  const navigate = useNavigate();
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const url = useLocation().pathname;
  const [signInModel7, setSigInModel7] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    signatures,
    updateSignature,
    loadSignaturesFromApi,
    guardTyped,
    typedGuardDialog,
    witnessIncomplete,
    allPenSigsHaveNames,
  } = useSignatureManagement();
  const [user, setUser] = useState("");
  const [userData, setUserData] = useState("");
  const [getApiData, setGetApiData] = useState([]);
  const [assessmentType, setAssessmentType] = useState("");
  const [hasNotified, setHasNotified] = useState("");
  const [assessmentOn, setAssessmentOn] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patient_Id, setPatient_Id] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [dob, setDob] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [residentName, setResidentName] = useState("");
  const [sex, setSex] = useState("");
  const [dateOfAssessment, setDateOfAssessment] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [admissionStatus, setAdmissionStatus] = useState([]);
  const [programLocation, setProgramLocation] = useState("");
  const [guardianship, setGuardianship] = useState("");
  const [powerOfAttorneyStatus, setPowerOfAttorneyStatus] = useState("");
  const [todayDate, setTodayDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [guardianshipPoaPubFidName, setGuardianshipPoaPubFidName] =
    useState("");
  const [adminSignature, setAdminSignature] = useState("");
  const [adminSignatureDate, setAdminSignatureDate] = useState("");
  const [adminSignatureTime, setAdminSignatureTime] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [reasonForAdmission, setReasonForAdmission] = useState([]);
  const [residentGoals, setResidentGoals] = useState("");
  const [residentStrengths, setResidentStrengths] = useState([]);
  const [residentLimitations, setResidentLimitations] = useState("");
  const [Barriers, setBarriers] = useState([]);
  const [barriersBoolean, setBarriersBoolean] = useState(false);
  const [barriersOther, setBarriersOther] = useState("");
  const [barriersText, setBarriersText] = useState("");
  const [currentBehavioralIssues, setCurrentBehavioralIssues] = useState("");
  const [need, setNeed] = useState("");
  const [intervention, setIntervention] = useState("");
  const [behavioralInterventionsArray, setbehavioralInterventionsArray] =
    useState([]);
  const behavioralInterventionaArrayHandle = () => {
    setbehavioralInterventionsArray((prev) => [
      ...prev,
      {
        need,
        intervention,
      },
    ]);
    setNeed("");
    setIntervention("");
  };
  const medicalConditions = useMedicalConditions();
  const [residentRepresentative, setResidentRepresentative] = useState("");
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
  const substanceAbuse = useSubstanceAbuseHistory();
  const handleTypeOfArray = () => substanceAbuse.appendOtherDraft();
  const removeTypeArray = (index) => substanceAbuse.removeExtraRow(index);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const activeWithdrawalForm = useActiveWithdrawalSymptoms();
  const mentalStatusExamForm = useMentalStatusExam();
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
  const independentLiving = useIndependentLivingSkills();
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
  const riskFactors = useRiskFactors();
  const patientInfoSelect = usePatientInformationSelectHandlers({
    admissionStatus,
    setAdmissionStatus,
    reasonForAdmission,
    setReasonForAdmission,
  });
  const medicalConditionsSelect = useMedicalConditionsSelectHandlers({
    thyroidDisorder,
    setThyroidDisorder,
    infectionDiseases,
    setInfectionDiseases,
  });
  const familyMentalHealthSelect = useFamilyMentalHealthSelectHandlers({
    SignificantFamilyMedicalPsychiatricHistory,
    setSignificantFamilyMedicalPsychiatricHistory,
    mentalHealthTreatmentHistoryTypeOfService,
    setMentalHealthTreatmentHistoryTypeOfService,
    mentalHealthTreatmentHistoryDiagnosisReason,
    setMentalHealthTreatmentHistoryDiagnosisReason,
  });
  const diagnosisSelect = useDiagnosisSelectHandlers({
    selectedValue,
    setSelectedValue,
    selectedValueMedical,
    setSelectedValueMedical,
    selectedValueSpecialPrecautions,
    setSelectedValueSpecialPrecautions,
  });
  const riskFactorsSelect = useRiskFactorsSelectHandlers({ riskFactors });
  const protectiveFactors = useProtectiveFactors();
  const [riskLevel, setRiskLevel] = useState("");
  const psychiatricDiagnosesForm = useDiagnosisSlots(
    PSYCHIATRIC_DIAGNOSIS_SLOTS,
    { extraArrayKey: "psychiatricDiagnosesArray" },
  );
  const medicalDiagnosesForm = useDiagnosisSlots(MEDICAL_DIAGNOSIS_SLOTS, {
    extraArrayKey: "medicalDiagnosesArray",
  });
  const [otherPsychiatricOption, setOtherPsychiatricOption] = useState("");
  const [othericdCode, setOtherIcdCode] = useState("");
  const [otherdescription, setOtherDescription] = useState("");
  const handlePsychiatricDiagnoses = () => {
    if (otherPsychiatricOption && (othericdCode || otherdescription)) {
      psychiatricDiagnosesForm.setExtraRows((prev) => [
        ...prev,
        {
          name: otherPsychiatricOption,
          icdCode: othericdCode,
          description: otherdescription,
        },
      ]);
      setOtherPsychiatricOption("");
      setOtherIcdCode("");
      setOtherDescription("");
    }
  };
  const removePsychiatricDiagnosesArray = (index) => {
    psychiatricDiagnosesForm.removeExtraRow(index);
  };
  const [OtherMedicalOption, setOtherMedicalOption] = useState("");
  const [OthericdCodeMedicalDiagnoses, setOtherIcdCodeMedicalDiagnoses] =
    useState("");
  const [
    OtherdescriptionMedicalDiagnoses,
    setOtherDescriptionMedicalDiagnoses,
  ] = useState("");
  const handleMedicalDiagnoses = () => {
    if (
      OtherMedicalOption &&
      (OthericdCodeMedicalDiagnoses || OtherdescriptionMedicalDiagnoses)
    ) {
      medicalDiagnosesForm.setExtraRows((prev) => [
        ...prev,
        {
          name: OtherMedicalOption,
          icdCode: OthericdCodeMedicalDiagnoses,
          description: OtherdescriptionMedicalDiagnoses,
        },
      ]);
      setOtherMedicalOption("");
      setOtherIcdCodeMedicalDiagnoses("");
      setOtherDescriptionMedicalDiagnoses("");
    }
  };
  const removeMedicalDiagnosesArray = (index) => {
    medicalDiagnosesForm.removeExtraRow(index);
  };
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
  const [primarySupportGroup, setPrimarySupportGroup] = useState(false);
  const [maritalProblems, setMaritalProblems] = useState(false);
  const [accessToHealthCareServices, setAccessToHealthCareServices] =
    useState(false);
  const [educationalProblems, setEducationalProblems] = useState(false);
  const [housingProblems, setHousingProblems] = useState(false);
  const [familyProblems, setFamilyProblems] = useState(false);
  const [occupationalProblems, setOccupationalProblems] = useState(false);
  const [interactionWithLegalSystem, setInteractionWithLegalSystem] =
    useState(false);
  const [substanceUseInHome, setSubstanceUseInHome] = useState(false);
  const [sexualProblems, setSexualProblems] = useState(false);
  const [otherBoolean, setOtherBoolean] = useState(false);
  const [otherStressors, setOtherStressors] = useState("");
  const [setNoAndYes, setSetNoAndYes] = useState(false);
  const Profile = useSelector(userProfile);
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
  const [acceptResident, setAcceptResident] = useState(null);
  const [residentGuardianName, setResidentGuardianName] = useState("");
  const [residentGauardianSignature, setResidentGauardianSignature] =
    useState("");
  const [residentGuardianDate, setResidentGuardianDate] = useState("");
  const [residentGuardianTime, setResidentGuardianTime] = useState("");
  const [staffName, setStaffName] = useState("");
  const [staffSignature, setStaffSignature] = useState("");
  const [staffDate, setStaffDate] = useState("");
  const [staffDateTime, setStaffDateTime] = useState("");
  const [bhpName, setBhpName] = useState("");
  const [bhpCredentials, setBhpCredentials] = useState("");
  const [bhpSignature, setBhpSignature] = useState("");
  const [bhpDate, setBhpDate] = useState("");
  const [bhpTime, setBhpTime] = useState("");
  const hasTypedInForm = !!bhpSignature || !!adminSignature;
  const hasAnyPenSig = Object.values(signatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );
  // Witness coupled-pair: block submit if signature exists without name OR
  const clearAllTyped = () => {
    setBhpSignature("");
    setBhpDate("");
    setBhpTime("");
    setAdminSignature("");
    setAdminSignatureDate("");
    setAdminSignatureTime("");
  };
  const { id } = useParams();
  const [signers, setSigners] = useState([]);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const [bhrfCriteria, setBhrfCriteria] = useState([]);
  const [clinicalSummary, setClinicalSummary] = useState("");
  const [treatmentRecommendations, setTreatmentRecommendations] = useState([]);
  function getApiArrayData(startIndex, arrayLength, array) {
    if (arrayLength <= startIndex) {
      // Return an empty array if invalid parameters are provided
      return [];
    }
    const slice = [];
    for (let i = startIndex; i < arrayLength; i++) {
      slice.push(array[i]);
    }
    return slice;
  }
  const componentRef = React.useRef();
  const { handlePrintClick: handlePrint2 } = usePrintAssessment({
    componentRef,
    patient: getApiData?.data?.patientId,
    profile: Profile,
  });
  useEffect(() => {
    if (getApiData) {
      let detail = getApiData?.data;
      if (
        Array.isArray(getApiData?.data) &&
        getApiData?.data.length > 0 &&
        url === "/initial-assessment"
      ) {
        detail = getApiData?.data[getApiData?.data?.length - 1];
      } else {
        detail = getApiData?.data;
      }
      if (detail !== "undefined" || detail?.length > 0) {
        if (detail && url !== "/initial-assessment") {
          setPatient_Id(detail?.patientId?._id || detail?.patientId);
          setResidentName(detail?.residentName);
          setDob(detail?.patientId?.dateOfBirth);
          setSex(detail?.patientId?.gender || detail?.sex);
          setDateOfAssessment(detail?.patientId?.admitDate);
          setAhcccsId(detail?.patientId?.ahcccsId);
        }
        setBhrfCriteria(detail?.bhrfCriteria ?? []);
        setClinicalSummary(detail?.clinicalSummary ?? "");
        setTreatmentRecommendations(detail?.treatmentRecommendations ?? []);
        setAssessmentType(detail?.assessmentType);
        setHasNotified(detail?.hasNotified);
        setAssessmentOn(detail?.assessmentOn);
        setCompanyName(
          profileInfo?.userType === ROLES.ADMIN
            ? profileInfo?.companyName
            : profileInfo?.adminId?.companyName,
        );
        setDiagnosis(detail?.patientId?.diagnosis);
        if (url !== "/initial-assessment") {
          setAcceptResident(detail?.acceptResident);
          setResidentRepresentative(detail?.residentRepresentative);
          setPowerOfAttorneyStatus(detail?.powerOfAttorneyStatus);
        }
        if (url === "/initial-assessment") {
          setTodayDate(formatDateToMMDDYYYY(new Date()));
        } else {
          setTodayDate(detail?.todayDate);
        }
        setApprovedBy(detail?.approvedBy);
        if (url !== "/initial-assessment") {
          // Fields moved to patientDetail sync
        }
        setCurrentBehavioralIssues(detail?.currentBehavioralIssues);
        medicalConditions.loadFromApi(detail?.medicalConditions);
        setSignificantFamilyMedicalPsychiatricHistory(
          detail?.SignificantFamilyMedicalPsychiatricHistory
            ? detail?.SignificantFamilyMedicalPsychiatricHistory?.map(
                (item) => ({
                  label: item,
                  value: item,
                }),
              )
            : [],
        );
        setTypeOfServicesArray(
          detail?.mentalHealthTreatmentHistory
            ? detail?.mentalHealthTreatmentHistory?.flatMap((item) => ({
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
        substanceAbuse.loadFromApi(detail);

        activeWithdrawalForm.loadFromApi(detail?.ActiveWithdrawalSymptoms);
        mentalStatusExamForm.loadFromApi(detail?.mentalStatusExam);
        setSignificantSocialDevelopmentalHistory(
          detail?.significantSocialDevelopmentalHistory,
        );
        setEducationalHistory(detail?.personalInformation?.educationalHistory);
        setHighestEducation(detail?.personalInformation?.highestEducation);
        setSpecialEducation(detail?.personalInformation?.specialEducation);
        setCurrentStudent(detail?.personalInformation?.currentStudent);
        setIfYesWhere(detail?.personalInformation?.currentStudentLocation);
        setCurrentlyEmployed(detail?.employmentHistory?.currentlyEmployed);
        setEmploymentLocation(detail?.employmentHistory?.employmentLocation);
        setWorkHistory(detail?.workHistory);
        setMilitaryService(detail?.militaryHistory?.militaryService);
        setActiveDuty(detail?.militaryHistory?.activeDuty);
        setSelectedValue(
          detail?.legalHistory
            ? detail?.legalHistory?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        independentLiving.loadFromApi(detail?.independentLivingSkills);
        if (url !== "/initial-assessment") {
          // Fields moved to patientDetail sync
        }
        setSelectedValueMedical(
          detail?.medicalEquipmentArray
            ? detail?.medicalEquipmentArray?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setSelectedValueSpecialPrecautions(
          detail?.specialPrecautions
            ? detail?.specialPrecautions?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setCurrentThoughtsOfHarmingSelf(detail?.currentThoughtsOfHarmingSelf);
        setSuicidalIdeation(detail?.suicidalIdeation);
        setSuicidalIdeationUrgency(detail?.suicidalIdeationUrgency);
        setSuicidalIdeationSeverity(detail?.suicidalIdeationSeverity);
        setCurrentThoughtsOfHarmingOthers(
          detail?.currentThoughtsOfHarmingOthers,
        );
        riskFactors.loadFromApi(detail?.riskFactors);
        protectiveFactors.loadFromApi(detail?.protectiveFactors);
        setRiskLevel(detail?.riskLevel);
        if (url !== "/initial-assessment") {
          // Fields moved to patientDetail sync
        }
        setPrimarySupportGroup(detail?.primarySupportGroup);
        setMaritalProblems(detail?.maritalProblems);
        setAccessToHealthCareServices(detail?.accessToHealthCareServices);
        setEducationalProblems(detail?.educationalProblems);
        setHousingProblems(detail?.housingProblems);
        setFamilyProblems(detail?.familyProblems);
        setOccupationalProblems(detail?.occupationalProblems);
        setInteractionWithLegalSystem(detail?.interactionWithLegalSystem);
        setSubstanceUseInHome(detail?.substanceUseInHome);
        setSexualProblems(detail?.sexualProblems);
        setOtherBoolean(detail?.otherStressors ? true : false);
        setOtherStressors(detail?.otherStressors);
        setSetNoAndYes(detail?.significantRecentLosses?.yes);
        setDeath(detail?.significantRecentLosses?.typeOfLoss?.death);
        setJob(detail?.significantRecentLosses?.typeOfLoss?.job);
        setChildRemovedFromHouse(
          detail?.significantRecentLosses?.typeOfLoss?.childRemovedFromHouse,
        );
        setInjury(detail?.significantRecentLosses?.typeOfLoss?.injury);
        setDivorceSeparation(
          detail?.significantRecentLosses?.typeOfLoss?.divorceSeparation,
        );
        setViolentActsAgainstPersonFamily(
          detail?.significantRecentLosses?.typeOfLoss
            ?.violentActsAgainstPersonFamily,
        );
        setMedicalSurgical(
          detail?.significantRecentLosses?.typeOfLoss?.medicalSurgical,
        );
        setAccidentInjury(
          detail?.significantRecentLosses?.typeOfLoss?.accidentInjury,
        );
        setOtherSignificantRecentLosses(
          detail?.significantRecentLosses?.comment ? true : false,
        );
        setOtherSignificantRecentLossesType(
          detail?.significantRecentLosses?.comment,
        );
        setAdditionalNotes(detail?.additionalNotes);
        setResidentGuardianName(detail?.residentInformation?.ResidentName);
        setResidentGauardianSignature(
          detail?.residentInformation?.ResidentSignature,
        );
        setResidentGuardianDate(
          detail?.residentInformation?.ResidentDate
            ? detail?.residentInformation?.ResidentDate
            : "",
        );
        setResidentGuardianTime(detail?.residentInformation?.time);
        setStaffName(detail?.staffInformation?.staffName);
        setStaffSignature(detail?.staffInformation?.staffSignature);
        setStaffDate(
          detail?.staffInformation?.staffDate
            ? detail?.staffInformation?.staffDate
            : "",
        );
        setStaffDateTime(detail?.staffInformation?.time);
        setBhpName(detail?.bhpInformation?.bhpName);
        setBhpCredentials(detail?.bhpInformation?.bhpCredentials);
        setBhpSignature(detail?.bhpInformation?.bhpSignature);
        setBhpDate(
          detail?.bhpInformation?.bhpDate
            ? detail?.bhpInformation?.bhpDate
            : "",
        );
        if (url === "/initial-assessment") {
          setBhpTime("");
          setSigners([]);
          setResidentGuardianName("");
          setResidentGauardianSignature("");
          setResidentGuardianDate("");
          setResidentGuardianTime("");
          setStaffName("");
          setStaffSignature("");
          setStaffDate("");
          setStaffDateTime("");
          setBhpName("");
          setBhpCredentials("");
          setBhpSignature("");
          setBhpDate("");
        } else {
          setBhpTime(detail?.bhpInformation?.time);
          setSigners(detail?.signers);
          setResidentGuardianName(detail?.residentInformation?.ResidentName);
          setResidentGauardianSignature(
            detail?.residentInformation?.ResidentSignature,
          );
          setResidentGuardianDate(
            detail?.residentInformation?.ResidentDate
              ? detail?.residentInformation?.ResidentDate
              : "",
          );
          setResidentGuardianTime(detail?.residentInformation?.time);
          setStaffName(detail?.staffInformation?.staffName);
          setStaffSignature(detail?.staffInformation?.staffSignature);
          setStaffDate(
            detail?.staffInformation?.staffDate
              ? detail?.staffInformation?.staffDate
              : "",
          );
          setStaffDateTime(detail?.staffInformation?.time);
          setBhpName(detail?.bhpInformation?.bhpName);
          setBhpCredentials(detail?.bhpInformation?.bhpCredentials);
          setBhpSignature(detail?.bhpInformation?.bhpSignature);
          setBhpDate(
            detail?.bhpInformation?.bhpDate
              ? detail?.bhpInformation?.bhpDate
              : "",
          );
          setAdminSignature(detail?.adminSignature);
          setAdminSignatureDate(detail?.adminSignatureDate);
          setAdminSignatureTime(detail?.adminSignatureTime);
          // 2026-04-29: don't auto-populate inline signatures on the CREATE
          // path — prior records pre-fill demographic fields, but signatures
          // must always start fresh and be re-signed for each new IA.
          if (detail?.signatures && url !== "/initial-assessment") {
            loadSignaturesFromApi(detail.signatures);
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData, url, loadSignaturesFromApi]);
  useEffect(() => {
    if (patient_Id && url === "/initial-assessment") {
      intakeService.getInitialAssessment({
        patientId: patient_Id,
        setResponse: setGetApiData,
        setLoading,
      });
    }
  }, [patient_Id, url]);
  useEffect(() => {
    if (getApiData?.data?.patientId?._id && url !== "/initial-assessment") {
      patientService.getById(getApiData?.data?.patientId?._id, {
        setResponse: (res) => setPatientDetail(res?.data || res),
      });
    }
  }, [getApiData?.data?.patientId?._id, url]);
  useEffect(() => {
    if (id) {
      intakeService.getInitialAssessment({ id, setResponse: setGetApiData });
    }
    employeeService.getProfile({ setResponse: setUserData });
  }, [id]);
  useEffect(() => {
    if (userData) {
      setPatientId(userData?.data?._id);
      setUser(`${userData?.data?.firstName} ${userData?.data?.lastName}`);
    }
  }, [userData, id]);
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
        .includes("iass");
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
  const {
    qualitiesOptions,
    handleKeyDownResidentStrength,
    handleSelectChange,
  } = useResidentStrengths({
    externalSetResidentStrengths: setResidentStrengths,
  });
  const bhrfCriteriaHandler = (value) => {
    setBhrfCriteria((prev) => {
      if (prev.includes(value)) return prev.filter((item) => item !== value);
      else return [...prev, value];
    });
  };
  const treatmentRecommendationsHandler = (value) => {
    setTreatmentRecommendations((prev) => {
      if (prev.includes(value)) return prev.filter((item) => item !== value);
      else return [...prev, value];
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = buildAssessmentPayload({
      ...mergeDynamicFormSnapshots({
        independentLiving: independentLiving.toSubmitSnapshot(),
        activeWithdrawal: activeWithdrawalForm.toSubmitSnapshot(),
        mentalStatusExam: mentalStatusExamForm.toSubmitSnapshot(),
        riskFactors: riskFactors.toSubmitSnapshot(),
        protectiveFactors: protectiveFactors.toSubmitSnapshot(),
        medicalConditions: medicalConditions.toSubmitSnapshot(),
        psychiatricDiagnoses: psychiatricDiagnosesForm.toSubmitSnapshot(),
        medicalDiagnoses: medicalDiagnosesForm.toSubmitSnapshot(),
        substanceAbuse: substanceAbuse.toSubmitSnapshot(),
      }),

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
      BipolarComment,
      BipolarYes,
      BonePain,
      CooperationOtherBoolean,
      CooperationOtherBooleanType,
      DepressionComment,
      DepressionYes,
      EyeContactOtherBoolean,
      EyeContactOtherBooleanType,
      GooseBumps,
      GroomingBoolean,
      GroomingOther,
      Headache,
      InfectionYes,
      InsomniaComment,
      InsomniaYes,
      LossofMuscleCoordination,
      LossofMuscleCoordinationOtherBoolean,
      LossofMuscleCoordinationOtherType,
      MannerismsOther,
      MannerismsOtherBoolen,
      Nausea,
      ObsessiveComment,
      ObsessiveYes,
      OtherConditionOther,
      OtherMedicalOption,
      OtherdescriptionMedicalDiagnoses,
      OthericdCodeMedicalDiagnoses,
      Paranoia,
      PersonalityComment,
      PersonalityYes,
      PhobiasComment,
      PhobiasYes,
      PostureOther,
      PostureOtherBoolen,
      PsychomotorActivityOther,
      PsychomotorActivityOtherBoolen,
      QuantityOtherBoolean,
      QuantityOtherBooleanOther,
      RateOtherBoolean,
      RateOtherBooleanOther,
      Runningnose,
      SchizophreniaComment,
      SchizophreniaYes,
      Seizures,
      SignificantFamilyMedicalPsychiatricHistory,
      SubstanceComment,
      SubstanceYes,
      SurgeriesComment,
      SurgeriesYes,
      Sweats,
      TactileDisturbances,
      Tearing,
      TertiaryDescription,
      TertiaryIcdCode,
      ToneOtherBoolean,
      ToneOtherBooleanOther,
      Tremors,
      VisualDisturbances,
      VisualDisturbancesOtherBoolean,
      VisualDisturbancesOtherType,
      Vomiting,
      WeightBoolean,
      WeightOther,
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
      behavioralInterventionsArray,
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
      commentLiver,
      commentLung,
      commentSeizures,
      commentbrain,
      companyName,
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
      gaitOther,
      gaitOtherBoolen,
      getApiData,
      goodInsight,
      goodJudgment,
      goodMemory,
      guardianship,
      guardianshipPoaPubFidName,
      hasNotified,
      healthConditionsYes,
      healthConditionsYesComment,
      heigthBoolean,
      heigthOther,
      highestEducation,
      hobbiesLeisureActivities,
      hostile,
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
      intervention,
      irritable,
      isNotEditableWithSigner,
      isSubmitEnabled,
      job,
      labile,
      loading,
      logicalCoherent,
      loud,
      maritalProblems,
      medicalDiagnosesArray,
      medicalSurgical,
      mentalHealthTreatmentHistoryDates,
      mentalHealthTreatmentHistoryDiagnosisReason,
      mentalHealthTreatmentHistoryTypeOfService,
      mentalHealthTreatmentHistoryWhere,
      militaryService,
      minimal,
      mumbled,
      mutism,
      neat,
      need,
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
      otherBoolean,
      otherConditionArray,
      otherConditionDiscription,
      otherConditionYesNO,
      otherSignificantRecentLosses,
      otherSignificantRecentLossesType,
      otherStressors,
      otherText,
      otherdescription,
      othericdCode,
      overweight,
      patientDetail,
      patientId,
      patient_Id,
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
      programLocation,
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
      residentName,
      residentRepresentative,
      residentStrengths,
      responseLatencyOtherBoolean,
      responseLatencyOtherBooleanOther,
      rigid,
      riskLevel,
      rocking,
      saveAsDrafIsNotEditable,
      saveAsDrafIsNotEditableWithoutSigner,
      secondaryDescription,
      secondaryicdCode,
      selectedValue,
      selectedValueMedical,
      selectedValueSpecialPrecautions,
      setNoAndYes,
      sex,
      sexualProblems,
      short,
      shortened,
      shuffling,
      signInModel7,
      signatures,
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
      substanceUseInHome,
      suicidalIdeation,
      suicidalIdeationSeverity,
      suicidalIdeationUrgency,
      suspicious,
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
      typeOfServiceArray,
      unintelligible,
      unkempt,
      unremarkableHallucinations,
      unremarkablethoughtContent,
      url,
      user,
      userData,
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
    });
    if (url === "/initial-assessment") {
      intakeService.initialAssessment.create({
        patientId: patient_Id,
        payload: data,
        setLoading,
        successMsg: "Success!",
        navigate,
      });
    } else {
      intakeService.initialAssessment.update(id, data, {
        setLoading,
        navigate,
      });
    }
  };

  useEffect(() => {
    if (patientDetail) {
      setDob(patientDetail?.dateOfBirth);
      setDateOfAssessment(patientDetail?.admitDate);
      setAhcccsId(patientDetail?.ahcccsId);
      setDiagnosis(patientDetail?.diagnosis);
      setSex(patientDetail?.gender);
      setPreferredLanguage(patientDetail?.preferredLanguage || "");
      setEthnicity(patientDetail?.ethnicity || "");
      setAdmissionStatus(patientDetail?.admissionStatus || []);
      setProgramLocation(patientDetail?.programLocation || "");
      setGuardianship(patientDetail?.guardianship || "");
      setGuardianshipPoaPubFidName(
        patientDetail?.guardianshipPoaPubFidName || "",
      );
      const presentingProbs =
        patientDetail?.patientId?.presentingProblems ||
        patientDetail?.presentingProblems;
      setReasonForAdmission(
        presentingProbs
          ? presentingProbs.map((s) => ({
              label: typeof s === "string" ? s : s?.label,
              value: typeof s === "string" ? s : s?.value,
            }))
          : [],
      );
      setResidentGoals(patientDetail?.residentGoals || "");
      setResidentStrengths(
        patientDetail?.residentStrengths
          ? patientDetail?.residentStrengths.map((s) => ({
              label: s,
              value: s,
            }))
          : [],
      );
      const fRisk = patientDetail?.fallRisk;
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
      setFallRiskExplanation(patientDetail?.fallRiskExplanation || "");
      setTriggers(patientDetail?.triggers || "");
      setHobbiesLeisureActivities(
        patientDetail?.hobbiesLeisureActivities || "",
      );
      setResidentLimitations(
        patientDetail?.barries || patientDetail?.residentLimitations || "",
      );
      setBarriers(patientDetail?.stepDownBarriers);

      const sbBoolean = patientDetail?.stepDownBarriers?.includes("Other");

      setBarriersBoolean(sbBoolean ? true : false);

      setBarriersOther(patientDetail?.stepDownBarriersOther || "");

      setBarriersText(patientDetail?.stepDownBarriersText || "");
      if (patientDetail?.medicalDiagnoses) {
        medicalDiagnosesForm.loadFromApi(patientDetail?.medicalDiagnoses);
      }
      if (patientDetail?.psychiatricDiagnoses) {
        psychiatricDiagnosesForm.loadFromApi(
          patientDetail?.psychiatricDiagnoses,
        );
      }

      if (patientDetail?.allergies && patientDetail.allergies.length > 0) {
        let isYes = undefined;
        let comments = "";

        const firstAllergy = patientDetail.allergies[0];

        if (typeof firstAllergy === "object" && firstAllergy !== null) {
          // It's an object, check for yes, comments, name
          if (firstAllergy.yes !== undefined && firstAllergy.yes !== null) {
            if (typeof firstAllergy.yes === "string") {
              isYes = firstAllergy.yes.toLowerCase() === "true";
            } else {
              isYes = Boolean(firstAllergy.yes);
            }
          }
          comments = firstAllergy.comments || firstAllergy.name || "";

          if (isYes === undefined && comments) {
            isYes = true;
          }
        } else if (typeof firstAllergy === "string") {
          // It's a string, likely meaning they have allergies
          comments = patientDetail.allergies.join(", ");
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
            patientDetail.allergies
              .map((a) =>
                typeof a === "object"
                  ? a.name || a.comments || JSON.stringify(a)
                  : a,
              )
              .join(", "),
          );
        }
      } else if (Object.keys(patientDetail || {}).length > 0) {
        setAllergiesYes(false);
        setAllergiesComment("");
      } else {
        setAllergiesYes(undefined);
        setAllergiesComment("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientDetail, getApiData?.data]);
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
      bhpSignature?.length > 0;
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
      isGuadianConditionValid ||
      hasAnyPenSig
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
    bhpSignature?.length,
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [bhpSignature, adminSignature, id, checkSign, hasAnyPenSig]);
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
      setBhpTime(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignatureTime(time);
    }
  };
  const handleMultiSuicidalIdeation = (value) => {
    if (suicidalIdeation?.includes(value))
      setSuicidalIdeation((pre) => pre?.replace(value, ""));
    else setSuicidalIdeation((pre) => pre + value);
  };
  const canDelete = deletePermission(profileInfo, "iass");
  const handleCheckboxAdmisionStatus = (value) => {
    const isValueChecked = admissionStatus?.includes(value);
    const updatedAdmissionStatus = isValueChecked
      ? admissionStatus.filter((item) => item !== value)
      : [...admissionStatus, value];
    setAdmissionStatus(updatedAdmissionStatus);
  };

  return {
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
    BipolarComment,
    BipolarYes,
    BonePain,
    CooperationOtherBoolean,
    CooperationOtherBooleanType,
    DepressionComment,
    DepressionYes,
    EyeContactOtherBoolean,
    EyeContactOtherBooleanType,
    GooseBumps,
    GroomingBoolean,
    GroomingOther,
    Headache,
    InfectionYes,
    InsomniaComment,
    InsomniaYes,
    LossofMuscleCoordination,
    LossofMuscleCoordinationOtherBoolean,
    LossofMuscleCoordinationOtherType,
    MannerismsOther,
    MannerismsOtherBoolen,
    Nausea,
    ObsessiveComment,
    ObsessiveYes,
    OtherConditionOther,
    OtherMedicalOption,
    OtherdescriptionMedicalDiagnoses,
    OthericdCodeMedicalDiagnoses,
    Paranoia,
    PersonalityComment,
    PersonalityYes,
    PhobiasComment,
    PhobiasYes,
    PostureOther,
    PostureOtherBoolen,
    Profile,
    PsychomotorActivityOther,
    PsychomotorActivityOtherBoolen,
    QuantityOtherBoolean,
    QuantityOtherBooleanOther,
    RateOtherBoolean,
    RateOtherBooleanOther,
    Runningnose,
    SchizophreniaComment,
    SchizophreniaYes,
    Seizures,
    SignificantFamilyMedicalPsychiatricHistory,
    SubstanceComment,
    SubstanceYes,
    SurgeriesComment,
    SurgeriesYes,
    Sweats,
    TactileDisturbances,
    Tearing,
    TertiaryDescription,
    TertiaryIcdCode,
    ToneOtherBoolean,
    ToneOtherBooleanOther,
    Tremors,
    VisualDisturbances,
    VisualDisturbancesOtherBoolean,
    VisualDisturbancesOtherType,
    Vomiting,
    WeightBoolean,
    WeightOther,
    acceptResident,
    accessToHealthCareServices,
    accidentInjury,
    activeDuty,
    activeWithdrawalForm,
    additionalNotes,
    adequateEyeContact,
    adequateGrooming,
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionStatus,
    agitated,
    ahcccsId,
    allPenSigsHaveNames,
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
    behavioralInterventionaArrayHandle,
    behavioralInterventionsArray,
    bhpCredentials,
    bhpDate,
    bhpName,
    bhpSignature,
    bhpTime,
    bhrfCriteria,
    bhrfCriteriaHandler,
    calm,
    canDelete,
    casual,
    checkSign,
    childRemovedFromHouse,
    chronicCommit,
    circumstances,
    circumstantial,
    clearAllTyped,
    clinicalSummary,
    commentCancer,
    commentDiabety,
    commentHeart,
    commentHigh,
    commentHistory,
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
    diagnosisSelect,
    dirty,
    disheveled,
    divorceSeparation,
    dob,
    editDateHandler,
    editSignHandler,
    editTimeHandler,
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
    familyMentalHealthSelect,
    familyProblems,
    fast,
    gaitOther,
    gaitOtherBoolen,
    getApiArrayData,
    getApiData,
    goodInsight,
    goodJudgment,
    goodMemory,
    guardTyped,
    guardianship,
    guardianshipPoaPubFidName,
    handleAddCondition,
    handleCheckboxAdmisionStatus,
    handleKeyDownResidentStrength,
    handleMedicalDiagnoses,
    handleMultiSuicidalIdeation,
    handlePrint2,
    handlePsychiatricDiagnoses,
    handleRemoveItem,
    handleSelectChange,
    handleSubmit,
    handleTypeOfArray,
    handleTypeOfService,
    hasAnyPenSig,
    hasNotified,
    hasTypedInForm,
    healthConditionsYes,
    healthConditionsYesComment,
    heigthBoolean,
    heigthOther,
    highestEducation,
    hobbiesLeisureActivities,
    hostile,
    hoursFormat,
    housingProblems,
    hyperactive,
    hypoactive,
    id,
    ifYesWhere,
    independentLiving,
    indifferent,
    infectionDiseases,
    injury,
    intactAbilityToConcentration,
    intactAbilityToConcentrationOtherBoolean,
    interactionWithLegalSystem,
    intervention,
    irritable,
    isNotEditableWithSigner,
    isSubmitEnabled,
    job,
    labile,
    loadSignaturesFromApi,
    loading,
    logicalCoherent,
    loud,
    maritalProblems,
    medicalConditions,
    medicalConditionsSelect,
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
    mumbled,
    mutism,
    navigate,
    neat,
    need,
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
    otherBoolean,
    otherConditionArray,
    otherConditionDiscription,
    otherConditionYesNO,
    otherPsychiatricOption,
    otherSignificantRecentLosses,
    otherSignificantRecentLossesType,
    otherStressors,
    otherText,
    otherdescription,
    othericdCode,
    overweight,
    patientDetail,
    patientId,
    patientInfoSelect,
    patient_Id,
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
    profileInfo,
    programLocation,
    protectiveFactors,
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
    qualitiesOptions,
    reasonForAdmission,
    relaxed,
    removeMedicalDiagnosesArray,
    removePsychiatricDiagnosesArray,
    removeTypeArray,
    removehandleAddCondition,
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
    riskFactors,
    riskFactorsSelect,
    riskLevel,
    rocking,
    saveAsDrafIsNotEditable,
    saveAsDrafIsNotEditableWithoutSigner,
    secondaryDescription,
    secondaryicdCode,
    selectedValue,
    selectedValueMedical,
    selectedValueSpecialPrecautions,
    setAcceptResident,
    setAccessToHealthCareServices,
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
    setCircumstances,
    setCircumstantial,
    setClinicalSummary,
    setCommentCancer,
    setCommentDeabetes,
    setCommentHeart,
    setCommentHigh,
    setCommentHistory,
    setCommentLiver,
    setCommentLung,
    setCommentSeizures,
    setCompanyName,
    setConcrete,
    setConsistent,
    setConstricted,
    setCooperationOtherBoolean,
    setCooperationOtherBooleanType,
    setCurrentBehavioralIssues,
    setCurrentStudent,
    setCurrentThoughtsOfHarmingOthers,
    setCurrentThoughtsOfHarmingSelf,
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
    setFamilyProblems,
    setFast,
    setGailOtherBoolen,
    setGetApiData,
    setGoodInsight,
    setGoodJudgment,
    setGoodMemory,
    setGooseBumps,
    setGroomingBoolean,
    setGroomingOther,
    setGuardianship,
    setGuardianshipPoaPubFidName,
    setHasNotified,
    setHeadache,
    setHealthConditionsYes,
    setHeigthBoolean,
    setHeigthOther,
    setHighestEducation,
    setHobbiesLeisureActivities,
    setHostile,
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
    setIntervention,
    setIrritable,
    setIsNotEditableWithSigner,
    setIsSubmitEnabled,
    setJob,
    setLabile,
    setLoading,
    setLogicalCoherent,
    setLossofMuscleCoordination,
    setLossofMuscleCoordinationBoolean,
    setLossofMuscleCoordinationType,
    setLoud,
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
    setMumbled,
    setMutism,
    setNausea,
    setNeat,
    setNeed,
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
    setOtherBoolean,
    setOtherConditionDiscription,
    setOtherConditionOther,
    setOtherConditionYesNo,
    setOtherDescription,
    setOtherDescriptionMedicalDiagnoses,
    setOtherIcdCode,
    setOtherIcdCodeMedicalDiagnoses,
    setOtherMedicalOption,
    setOtherPsychiatricOption,
    setOtherSignificantRecentLosses,
    setOtherSignificantRecentLossesType,
    setOtherStressors,
    setOtherText,
    setOverweight,
    setParanoia,
    setPatientDetail,
    setPatientId,
    setPatient_Id,
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
    setPressured,
    setPrimaryDescription,
    setPrimaryIcdCode,
    setPrimarySupportGroup,
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
    setRelaxed,
    setResidentGauardianSignature,
    setResidentGoals,
    setResidentGuardianDate,
    setResidentGuardianName,
    setResidentGuardianTime,
    setResidentLimitations,
    Barriers,
    setBarriers,
    barriersBoolean,
    setBarriersBoolean,
    barriersOther,
    setBarriersOther,
    barriersText,
    setBarriersText,
    setResidentName,
    setResidentRepresentative,
    setResidentStrengths,
    setRigid,
    setRiskLevel,
    setRocking,
    setRunningnose,
    setSaveAsDrafIsNotEditable,
    setSaveAsDrafIsNotEditableWithoutSigner,
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
    setShort,
    setShortened,
    setShuffling,
    setSigInModel7,
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
    setStaffDate,
    setStaffDateTime,
    setStaffName,
    setStaffSignature,
    setStaggering,
    setStuttered,
    setSubstanceComment,
    setSubstanceUseInHome,
    setSubstanceYes,
    setSuicidalIdeation,
    setSuicidalIdeationSeverity,
    setSuicidalIdeationUrgency,
    setSurgeriesComment,
    setSurgeriessYes,
    setSuspicious,
    setSweats,
    setTactileDisturbances,
    setTactileHallucinations,
    setTall,
    setTangential,
    setTattered,
    setTearing,
    setTense,
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
    setUser,
    setUserData,
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
    setbehavioralInterventionsArray,
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
    shuffling,
    signInModel7,
    signatures,
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
    substanceAbuse,
    substanceUseInHome,
    suicidalIdeation,
    suicidalIdeationSeverity,
    suicidalIdeationUrgency,
    suspicious,
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
    treatmentRecommendationsHandler,
    tremorsMannerisms,
    triggers,
    typeOfServiceArray,
    typedGuardDialog,
    unintelligible,
    unkempt,
    unremarkableHallucinations,
    unremarkablethoughtContent,
    updateSignature,
    url,
    user,
    userData,
    vague,
    verbose,
    violentActsAgainstPersonFamily,
    visualHallucinations,
    wellGroomed,
    withinNormalLimits,
    witnessIncomplete,
    workHistory,
    yesCancer,
    yesChronic,
    yesDiabetes,
    yesGrandiose,
    yesHeart,
    yesHigh,
    yesHistory,
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

/** @format */

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import { FIXED_SERVICES } from "@/features/shared/constants";
import {
  ACCOUNT_TYPES,
  ROLES,
  PRESENTING_PROBLEMS_OPTIONS,
} from "@/features/shared/constants/index";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import {
  patientService,
  treatmentPlanService,
} from "@/features/shared/services/index";
import { userProfile } from "@/store/authSlice";
import { downloadReport } from "@/utils/index";
import {
  deletePermission,
  formatDateToMMDDYYYY,
  stripHtmlList,
} from "@/utils/utils";

export function useTreatmentPlanForm() {
  const profileInfo = useSelector(userProfile);
  const hoursFormat = profileInfo?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [personalFinancesComment, setPersonalFinancesComment] = useState("");
  const [fallRiskComment, setFallRiskComment] = useState("");
  const [individualTherapy, setIndividualTherapy] = useState("");
  const navigate = useNavigate();
  const url = useLocation().pathname;
  const [signers, setSigners] = useState([]);
  const [signatureModel3, setSignatureModel3] = useState(false);
  const [user, setUser] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [getApiData, setGetApiData] = useState({});
  const [userId, setUserId] = useState({});
  const [initialUpdate, setInitialUpdate] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dob, setDob] = useState("");
  const [date, setDate] = useState(formatDateToMMDDYYYY(new Date()));
  const [admitDate, setAdminDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [physicalService, setPhysicalService] = useState("");
  const [behavior, setBehavior] = useState("");
  const [medicationAdministation, setMedicationAdministation] = useState("");
  const [medicationAssistance, setMedicationAssistence] = useState("");
  const [presentingPrice, setPresentingPrice] = useState([]);
  const [diagonsis, setDiagonsis] = useState("");
  const [mendelHealth, setMentelHealth] = useState("");
  const [mentelText, setMentelText] = useState("");
  const [mind, setMind] = useState("");
  const [mindText, setMindText] = useState("");
  const [adls, setAdls] = useState("");
  const [adlsText, setAldsText] = useState("");
  const [BHealth, setBHealth] = useState("");
  const [Btext, setBtext] = useState("");
  const [primaryCare, setPrimaryCare] = useState("");
  const [primaryCareProviderContact, setPrimaryCareProviderContact] =
    useState("");
  const [primaryCareProviderAddress, setPrimaryCareProviderAddress] =
    useState("");
  const [psychiatricProvider, setPsychiatricProvider] = useState("");
  const [psychiatricProviderContact, setPsychiatricProviderContact] =
    useState("");
  const [psychiatricProviderAddress, setPsychiatricProviderAddress] =
    useState("");
  const [residentGoal, setResidentGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [Triggers, setTriggers] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [Barriers, setBarriers] = useState([]);
  const [barriersBoolean, setBarriersBoolean] = useState(false);
  const [barriersOther, setBarriersOther] = useState("");
  const [barriersText, setBarriersText] = useState("");
  const [interventions, setInterventions] = useState("");
  const [behavioralSymptoms, setBehavioralSymptoms] = useState([]);
  const [behavioralSymptomsBoolean, setBehavioralSymptomsBoolean] =
    useState(false);
  const [behavioralSymptomsOther, setBehavioralSymptomsOther] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientDetail, setPatientDetail] = useState({});
  const [desiredMeasure, setDesiredMeasure] = useState("");
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
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [residentParticipationOtherText, setResidentParticipationOtherText] =
    useState([]);
  const [residentAttituteOtherText, setResidentAttituteOtherText] =
    useState("");
  const [residentProgressOtherText, setResidentProgressOtherText] =
    useState("");
  const [isRequiresAssistance, setIsRequiresAssistance] = useState(null);
  const [bhServicesLimitsFunctioning, setBhServicesLimitsFunctioning] =
    useState(null);
  const [isFallRisk, setIsFallRisk] = useState(null);
  useEffect(() => {
    const isOtherSelected = behavioralSymptoms?.some(
      (behavioral) => behavioral === "Other",
    );
    setBehavioralSymptomsBoolean(isOtherSelected);
    if (!isOtherSelected) {
      setBehavioralSymptomsOther("");
    }
    const isOtherSelectedBarriers = Barriers?.some(
      (behavioral) => behavioral === "Other",
    );
    setBarriersBoolean(isOtherSelectedBarriers);
    if (!isOtherSelectedBarriers) {
      setBarriersOther("");
    }
  }, [behavioralSymptoms, Barriers]);
  const [physicalSymptoms, setPhysicalSymptoms] = useState([]);
  const [physicalSymptomsBoolean, setPhysicalSymptomsBoolean] = useState(false);
  const [physicalSymptomsOther, setPhysicalSymptomsOther] = useState("");
  useEffect(() => {
    const isOtherSelected = physicalSymptoms?.some(
      (behavioral) => behavioral === "Other",
    );
    setPhysicalSymptomsBoolean(isOtherSelected);
    if (!isOtherSelected) {
      setPhysicalSymptomsOther("");
    }
  }, [physicalSymptoms]);
  const [consnotiveSymptoms, setConsnotiveSymptoms] = useState([]);
  const [consnotiveSymptomsBoolean, setConsnotiveSymptomsBoolean] =
    useState(false);
  const [consnotiveSymptomsOther, setConsnotiveSymptomsOther] = useState("");
  useEffect(() => {
    const isOtherSelected = consnotiveSymptoms?.some(
      (behavioral) => behavioral === "Other",
    );
    setConsnotiveSymptomsBoolean(isOtherSelected);
    if (!isOtherSelected) {
      setConsnotiveSymptomsOther("");
    }
  }, [consnotiveSymptoms]);
  const [psychosocialSymptoms, setPsychosocialSymptoms] = useState([]);
  const [psychosocialSymptomsBoolean, setPsychosocialSymptomsBoolean] =
    useState(false);
  const [psychosocialSymptomssOther, setPsychosocialSymptomsOther] =
    useState("");
  useEffect(() => {
    const isOtherSelected = psychosocialSymptoms?.some(
      (behavioral) => behavioral === "Other",
    );
    setPsychosocialSymptomsBoolean(isOtherSelected);
    if (!isOtherSelected) {
      setPsychosocialSymptomsOther("");
    }
  }, [psychosocialSymptoms]);
  const [interventionsImplemented, setInterventionsImplemented] = useState([]);
  const [interventionsImplementedBoolean, setInterventionsImplementedBoolean] =
    useState(false);
  const [interventionsImplementedOther, setInterventionsImplementedOther] =
    useState("");

  // useEffect(() => {
  //   const isOtherSelected = interventionsImplemented.some(
  //     (behavioral) => behavioral === "Other"
  //   );

  //   setInterventionsImplementedBoolean(isOtherSelected);

  //   if (!isOtherSelected) {
  //     setInterventionsImplementedOther("");
  //   }
  // }, [interventionsImplemented]);

  const [minimumHoure, setMinimumHoure] = useState("");
  const [counselingOptions, setCounselingOptions] = useState([]);
  const [counselingOptionsText, setCounselingOptionsOther] = useState("");
  const [counselingOptionsTextBoolean, setCounselingOptionsTextBoolean] =
    useState(false);
  const [option1, setOption1] = useState([]);
  const [option1Boolean, setOption1Boolean] = useState(false);
  const [option1Other, setoption1Other] = useState("");

  // useEffect(() => {
  //   const isOtherSelected = option1?.some(
  //     (barrier) => barrier.value === "Other"
  //   );

  //   setOption1Boolean(isOtherSelected);

  //   if (!isOtherSelected) {
  //     setoption1Other("");
  //   }
  // }, []);

  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  const [option4, setOption4] = useState([]);
  const [option5, setOption5] = useState([]);
  const [option6, setOption6] = useState([]);
  const [option7, setOption7] = useState([]);
  const [option8, setOption8] = useState([]);
  const [admissionMeasure1, setAdmissionMeasure1] = useState("");
  const [admissionMeasure1Error, setAdmissionMeasure1Error] = useState("");
  const [interventions1, setInterventions1] = useState("");
  const [previousMeasure1, setPreviousMeasure1] = useState("");
  const [currentMeasure1, setCurrentMeasure1] = useState("");
  const [currentMeasure1Error, setCurrentMeasure1Error] = useState("");
  const [estimatedDateOfCompletion1, setEstimatedDateOfCompletion1] =
    useState("");
  const [comments1, setComment1] = useState("");
  const [isMeasureMet1, setIsMeasureMet1] = useState(null);
  const [isMeasureMetOther, setIsMeasureMetOther] = useState(null);
  const [admissionMeasure2, setAdmissionMeasure2] = useState("");
  const [admissionMeasure2Error, setAdmissionMeasure2Error] = useState("");
  const [interventions2, setInterventions2] = useState("");
  const [previousMeasure2, setPreviousMeasure2] = useState("");
  const [currentMeasure2, setCurrentMeasure2] = useState("");
  const [currentMeasure2Error, setCurrentMeasure2Error] = useState("");
  const [estimatedDateOfCompletion2, setEstimatedDateOfCompletion2] =
    useState("");
  const [comments2, setComment2] = useState("");
  const [isMeasureMet2, setIsMeasureMet2] = useState(null);
  const [admissionMeasure3, setAdmissionMeasure3] = useState("");
  const [admissionMeasure3Error, setAdmissionMeasure3Error] = useState("");
  const [interventions3, setInterventions3] = useState("");
  const [previousMeasure3, setPreviousMeasure3] = useState("");
  const [currentMeasure3, setCurrentMeasure3] = useState("");
  const [currentMeasure3Error, setCurrentMeasure3Error] = useState("");
  const [estimatedDateOfCompletion3, setEstimatedDateOfCompletion3] =
    useState("");
  const [comments3, setComment3] = useState("");
  const [isMeasureMet3, setIsMeasureMet3] = useState(null);
  const [admissionMeasure4, setAdmissionMeasure4] = useState("");
  const [admissionMeasure4Error, setAdmissionMeasure4Error] = useState("");
  const [interventions4, setInterventions4] = useState("");
  const [previousMeasure4, setPreviousMeasure4] = useState("");
  const [currentMeasure4, setCurrentMeasure4] = useState("");
  const [currentMeasure4Error, setCurrentMeasure4Error] = useState("");
  const [estimatedDateOfCompletion4, setEstimatedDateOfCompletion4] =
    useState("");
  const [comments4, setComment4] = useState("");
  const [isMeasureMet4, setIsMeasureMet4] = useState(null);
  const [admissionMeasure5, setAdmissionMeasure5] = useState("");
  const [admissionMeasure5Error, setAdmissionMeasure5Error] = useState("");
  const [interventions5, setInterventions5] = useState("");
  const [previousMeasure5, setPreviousMeasure5] = useState("");
  const [currentMeasure5, setCurrentMeasure5] = useState("");
  const [currentMeasure5Error, setCurrentMeasure5Error] = useState("");
  const [estimatedDateOfCompletion5, setEstimatedDateOfCompletion5] =
    useState("");
  const [comments5, setComment5] = useState("");
  const [isMeasureMet5, setIsMeasureMet5] = useState(null);
  const [admissionMeasure6, setAdmissionMeasure6] = useState("");
  const [admissionMeasure6Error, setAdmissionMeasure6Error] = useState("");
  const [interventions6, setInterventions6] = useState("");
  const [previousMeasure6, setPreviousMeasure6] = useState("");
  const [currentMeasure6, setCurrentMeasure6] = useState("");
  const [currentMeasure6Error, setCurrentMeasure6Error] = useState("");
  const [estimatedDateOfCompletion6, setEstimatedDateOfCompletion6] =
    useState("");
  const [comments6, setComment6] = useState("");
  const [isMeasureMet6, setIsMeasureMet6] = useState(null);
  const [admissionMeasure7, setAdmissionMeasure7] = useState("");
  const [admissionMeasure7Error, setAdmissionMeasure7Error] = useState("");
  const [interventions7, setInterventions7] = useState("");
  const [previousMeasure7, setPreviousMeasure7] = useState("");
  const [currentMeasure7, setCurrentMeasure7] = useState("");
  const [currentMeasure7Error, setCurrentMeasure7Error] = useState("");
  const [estimatedDateOfCompletion7, setEstimatedDateOfCompletion7] =
    useState("");
  const [comments7, setComment7] = useState("");
  const [isMeasureMet7, setIsMeasureMet7] = useState(null);
  const [admissionMeasure8, setAdmissionMeasure8] = useState("");
  const [admissionMeasure8Error, setAdmissionMeasure8Error] = useState("");
  const [interventions8, setInterventions8] = useState("");
  const [previousMeasure8, setPreviousMeasure8] = useState("");
  const [currentMeasure8, setCurrentMeasure8] = useState("");
  const [currentMeasure8Error, setCurrentMeasure8Error] = useState("");
  const [estimatedDateOfCompletion8, setEstimatedDateOfCompletion8] =
    useState("");
  const [comments8, setComment8] = useState("");
  const [isMeasureMet8, setIsMeasureMet8] = useState(null);
  const [optionOther, setOptionOther] = useState("");
  const [objectiveOther, setObjectiveOther] = useState([]);
  const [admissionMeasureOther, setAdmissionMeasureOther] = useState("");
  const [currentMeasureOther, setCurrentMeasureOther] = useState("");
  const [estimatedDateOfCompletionOther, setEstimatedDateOfCompletionOther] =
    useState("");
  const [otherArray, setOtherArray] = useState([]);
  const [showOther, setShowOther] = useState(false);
  const [saveAsDrafIsNotEditable, setSaveAsDrafIsNotEditable] = useState(false);
  const [
    saveAsDrafIsNotEditableWithoutSigner,
    setSaveAsDrafIsNotEditableWithoutSigner,
  ] = useState(false);
  const [isNotEditableWithSigner, setIsNotEditableWithSigner] = useState(false);
  const [
    isAdditionalDischargePlanningChecked,
    setIsAdditionalDischargePlanningChecked,
  ] = useState(null);
  const handleAddButtonClick = () => {
    const newCard = {
      goalTitle: "Other",
      otherType: "",
      objectiveEdiorValue: "",
      intervention: "",
      admissionMeasure: "",
      currentMeasure: "",
      estimatedDateOfCompletion: "",
      comments: "",
      isMeasureMet: null,
      admissionMeasureError: "",
      currentMeasureError: "",
    };
    setOtherArray((prev) => [...prev, newCard]);
  };
  // const removeOtherArray = (index) => {
  //   setOtherArray((prev) => prev.filter((_, i) => i !== index));
  // };
  const handleChange = (index, key, value) => {
    setOtherArray((prev) => {
      const updated = [...prev];
      if (key === "isMeasureMet") {
        updated[index][key] = value;
      } else {
        updated[index][key] = value ?? "";
      }
      return updated;
    });
  };
  const handleDelete = (index) => {
    setOtherArray((prev) => prev.filter((_, i) => i !== index));
  };
  const [residentParticipation, setResidentParticipation] = useState("");
  const [residentAttitute, setResidentAttitute] = useState("");
  const [residentProgress, setResidentProgress] = useState("");
  const [supportSystemPhoneNumber, setSupportSystemPhoneNumber] = useState("");
  const [supportSystem, setSupportSystem] = useState([]);
  const [supportSystemOtherText, setSupportSystemOtherText] = useState("");
  const [supportSystemOtherTextBoolean, setSupportSystemOtherTextBoolean] =
    useState(false);
  const [currentMedications, setCurrentMedications] = useState("");
  const [religiousPreference, setreligiousPreference] = useState("");
  const [religiousPreferenceText, setReligiousPreferenceText] = useState("");
  const [nutritionAndWellnessPlanning, setNutritionAndWellnessPlanning] =
    useState("");
  const [
    recommendationToExtendResidentialTreatment,
    setRecommendationToExtendResidentialTreatment,
  ] = useState("");
  const [personalFinances, setPersonalFinances] = useState(false);
  const [dischargePlanning, setDischargePlanning] = useState([]);
  const [dischargePlanningOther, setDischargePlanningOther] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [
    recommendationsForFurtherPrograms,
    setRecommendationsForFurtherPrograms,
  ] = useState([]);
  const [
    recommendationsForFurtherProgramsBoolean,
    setrecommendationsForFurtherProgramsBoolean,
  ] = useState(false);
  const [
    recommendationsForFurtherProgramsOther,
    setRecommendationsForFurtherProgramsOther,
  ] = useState("");
  useEffect(() => {
    const isOtherSelected = recommendationsForFurtherPrograms.some(
      (barrier) => barrier === "Other",
    );
    setrecommendationsForFurtherProgramsBoolean(isOtherSelected);
    if (!isOtherSelected) {
      setRecommendationsForFurtherProgramsOther("");
    }
  }, [recommendationsForFurtherPrograms]);
  const [afterCareAndTransitionPlanning, setAfterCareAndTransitionPlanning] =
    useState([]);
  const [textData, setTextData] = useState("");
  const [clinicalSummary, setClinicalSummary] = useState([]);
  const [treatmentPlanReviewDate, setTreatmentPlanReviewDate] = useState("");
  const [dischargePlanDate, setDischargePlanDate] = useState("");
  const [resident, setResident] = useState("");
  const [guardian, setGuardian] = useState("");
  const [staff, setStaff] = useState("");
  const [bpn, setBph] = useState("");
  const [otherIndividual, setOtherIndividual] = useState("");
  const [commentIndividual, setCommentIndividual] = useState("");
  const [isReason, setIsReason] = useState(null);
  const [refusalReason, setrefusalReason] = useState("no");
  const [
    verbalConsentResidentRepresentative,
    setVerbalConsentResidentRepresentative,
  ] = useState("");
  const [nameResident, setNameResident] = useState("");
  const [credentialsResident, setCredentialsResident] = useState("");
  const [signatureResident, setsignatureResident] = useState("");
  const [dateResident, setDateResident] = useState("");
  const [timeResident, setTimeResident] = useState("");
  const [nameFacilityRep, setNameFacilityRep] = useState("");
  const [credentialsFacilityRep, setCredentialsFacilityRep] = useState("");
  const [signatureFacilityRep, setsignatureFacilityRep] = useState("");
  const [dateFacilityRep, setDateFacilityRep] = useState("");
  const [timeFacality, setTimeFacality] = useState("");
  const [nameBhp, setNameBhp] = useState("");
  const [credentialsBhp, setCredentialsBhp] = useState("");
  const [signatureBhp, setsignatureBhp] = useState("");
  const [dateBhp, setDateBhp] = useState("");
  const [timeBhp, setTimeBhp] = useState("");
  const hasTypedInForm = !!signatureBhp || !!adminSignature;
  const hasAnyPenSig = Object.values(signatures || {}).some(
    (s) => !!s?.rawSignatureImage,
  );
  const allPenSigsHaveNames = Object.values(signatures || {}).every(
    (s) => !s?.rawSignatureImage || !!s?.name?.trim(),
  );
  // Witness coupled-pair: block submit if signature exists without name OR
  // name exists without signature. Per client request 2026-04-26.
  const witnessNamePresent = !!(
    signatures?.witness?.name &&
    signatures.witness.name.trim() &&
    signatures.witness.name.trim() !== "undefined undefined"
  );
  const witnessSigPresent = !!signatures?.witness?.rawSignatureImage;
  const witnessIncomplete = witnessSigPresent && !witnessNamePresent;
  const clearAllTyped = () => {
    setsignatureBhp("");
    setDateBhp("");
    setTimeBhp("");
    setAdminSignature("");
    setAdminSignatureDate("");
    setAdminSignatureTime("");
  };
  const [clientCareCoordinationTeam, setClientCareCoordinationTeam] =
    useState("");
  const [readinessDischarge, setReadinessDischarge] = useState("");
  const [additionalDischargePlanning, setAdditionalDischargePlanning] =
    useState("");
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
        margin: 10mm !important;
      }    
      .card {
        page-break-inside: avoid;
      }
      .table-row-hide-print{
        display:none;
        }
        `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const FREQUENCY_DAILY = [
    {
      label: "Daily",
      value: "Daily",
    },
  ];
  const FREQUENCY_WEEKLY = [
    {
      label: "Weekly",
      value: "Weekly",
    },
  ];
  const FREQUENCY_MONTHLY = [
    {
      label: "Monthly",
      value: "Monthly",
    },
  ];
  const FREQUENCY_AS_NEEDED = [
    {
      label: "As Needed",
      value: "As Needed",
    },
    {
      label: "Not Needed",
      value: "Not Needed",
    },
  ];
  const initialServices =
    FIXED_SERVICES &&
    FIXED_SERVICES.map((service) => ({
      serviceProvided: service,
      daily: [],
      weekly: [],
      monthly: [],
      asNeeded: [],
      additionalNotes: "",
    }));
  const [editorValue, setEditorValue] = useState("");
  const [sobrietyEditorValue, setSobrietyEditorValue] = useState("");
  const [sobrietyObjectivesSelected, setSobrietyObjectivesSelected] = useState(
    [],
  );
  const [sobrietyObjectivesEditorValue, setSobrietyObjectivesEditorValue] =
    useState("");
  const [sobrietyInterventionsSelected, setSobrietyInterventionsSelected] =
    useState([]);
  const [
    sobrietyInterventionsEditorValue,
    setSobrietyInterventionsEditorValue,
  ] = useState("");
  const [interventions1Option, setInterventions1Option] = useState([]);
  const [independentEditorValue, setIndependentEditorValue] = useState("");
  const [independentObjectivesSelected, setIndependentObjectivesSelected] =
    useState([]);
  const [
    independentObjectivesEditorValue,
    setIndependentObjectivesEditorValue,
  ] = useState("");
  const [
    independentInterventionsSelected,
    setIndependentInterventionsSelected,
  ] = useState([]);
  const [
    independentInterventionsEditorValue,
    setIndependentInterventionsEditorValue,
  ] = useState("");
  const [interventions2Option, setInterventions2Option] = useState([]);
  const [employmentEditorValue, setEmploymentEditorValue] = useState("");
  const [employmentObjectivesSelected, setEmploymentObjectivesSelected] =
    useState([]);
  const [employmentObjectivesEditorValue, setEmploymentObjectivesEditorValue] =
    useState("");
  const [employmentInterventionsSelected, setEmploymentInterventionsSelected] =
    useState([]);
  const [
    employmentInterventionsEditorValue,
    setEmploymentInterventionsEditorValue,
  ] = useState("");
  const [interventions3Option, setInterventions3Option] = useState([]);
  const [adlsEditorValue, setAdlsEditorValue] = useState("");
  const [adlsObjectivesSelected, setAdlsObjectivesSelected] = useState([]);
  const [adlsObjectivesEditorValue, setAdlsObjectivesEditorValue] =
    useState("");
  const [adlsInterventionsSelected, setAdlsInterventionsSelected] = useState(
    [],
  );
  const [adlsInterventionsEditorValue, setAdlsInterventionsEditorValue] =
    useState("");
  const [interventions4Option, setInterventions4Option] = useState([]);
  const [safetyEditorValue, setSafetyEditorValue] = useState("");
  const [safetyObjectivesSelected, setSafetyObjectivesSelected] = useState([]);
  const [safetyObjectivesEditorValue, setSafetyObjectivesEditorValue] =
    useState("");
  const [safetyInterventionsSelected, setSafetyInterventionsSelected] =
    useState([]);
  const [safetyInterventionsEditorValue, setSafetyInterventionsEditorValue] =
    useState("");
  const [interventions5Option, setInterventions5Option] = useState([]);
  const [medicationEditorValue, setMedicationEditorValue] = useState("");
  const [medicationObjectivesSelected, setMedicationObjectivesSelected] =
    useState([]);
  const [medicationObjectivesEditorValue, setMedicationObjectivesEditorValue] =
    useState("");
  const [medicationInterventionsSelected, setMedicationInterventionsSelected] =
    useState([]);
  const [
    medicationEducationInterventionsEditorValue,
    setMedicationEducationInterventionsEditorValue,
  ] = useState("");
  const [interventions6Option, setInterventions6Option] = useState([]);
  const [mentalHealthEditorValue, setMentalHealthEditorValue] = useState("");
  const [mentalHealthObjectivesSelected, setMentalHealthObjectivesSelected] =
    useState([]);
  const [
    mentalHealthObjectivesEditorValue,
    setMentalHealthObjectivesEditorValue,
  ] = useState("");
  const [
    mentalHealthInterventionsSelected,
    setMentalHealthInterventionsSelected,
  ] = useState([]);
  const [
    mentalHealthInterventionsEditorValue,
    setMentalHealthInterventionsEditorValue,
  ] = useState("");
  const [interventions7Option, setInterventions7Option] = useState([]);
  const [legalEditorValue, setLegalEditorValue] = useState("");
  const [legalObjectivesSelected, setLegalObjectivesSelected] = useState([]);
  const [legalObjectivesEditorValue, setLegalObjectivesEditorValue] =
    useState("");
  const [
    legalHealthInterventionsSelected,
    setLegalHealthInterventionsSelected,
  ] = useState([]);
  const [legalInterventionsEditorValue, setLegalInterventionsEditorValue] =
    useState("");
  const [interventions8Option, setInterventions8Option] = useState([]);
  const [otherObjectives, setOtherObjectives] = useState("");
  const [option1Option, setOption1Option] = useState([]);
  const [option2Option, setOption2Option] = useState([]);
  const [option3Option, setOption3Option] = useState([]);
  const [option4Option, setOption4Option] = useState([]);
  const [option5Option, setOption5Option] = useState([]);
  const [option6Option, setOption6Option] = useState([]);
  const [option7Option, setOption7Option] = useState([]);
  const [option8Option, setOption8Option] = useState([]);
  const [objective1Option, setObjective1Option] = useState([]);
  const [objective2Option, setObjective2Option] = useState([]);
  const [objective3Option, setObjective3Option] = useState([]);
  const [objective4Option, setObjective4Option] = useState([]);
  const [objective5Option, setObjective5Option] = useState([]);
  const [objective6Option, setObjective6Option] = useState([]);
  const [objective7Option, setObjective7Option] = useState([]);
  const [objective8Option, setObjective8Option] = useState([]);
  const [services, setServices] = useState(initialServices);
  const [dynamicServices, setDynamicServices] = useState([]);
  const addNewService = () => {
    setDynamicServices([
      ...dynamicServices,
      {
        serviceProvided: "",
        daily: [],
        weekly: [],
        monthly: [],
        asNeeded: [],
        additionalNotes: "",
      },
    ]);
  };
  const removeDynamicService = (index) => {
    setDynamicServices(dynamicServices.filter((_, i) => i !== index));
  };
  const updateFixedService = (index, field, value) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    setServices(updatedServices);
  };
  const updateDynamicService = (index, field, value) => {
    const updatedServices = [...dynamicServices];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    setDynamicServices(updatedServices);
  };
  const setServiceData = (servicesData) => {
    const processedServices = servicesData
      ?.filter((data) => data.serviceProvided !== "")
      ?.map((service) => ({
        serviceProvided: service.serviceProvided,
        daily: service.daily.map((item) => ({
          label: item,
          value: item,
        })),
        monthly: service.monthly.map((item) => ({
          label: item,
          value: item,
        })),
        weekly: service.weekly.map((item) => ({
          label: item,
          value: item,
        })),
        asNeeded: service.asNeeded.map((item) => ({
          label: item,
          value: item,
        })),
        additionalNotes: service.additionalNotes,
      }));

    // Separate into `services` and `dynamicServices`
    const updatedServices = processedServices?.filter((s) =>
      FIXED_SERVICES.includes(s.serviceProvided),
    );
    const updatedDynamicServices = processedServices?.filter(
      (s) => !FIXED_SERVICES.includes(s.serviceProvided),
    );
    setServices(updatedServices);
    setDynamicServices(updatedDynamicServices);
  };
  useEffect(() => {
    if (getApiData) {
      let item;
      if (
        Array.isArray(getApiData?.data) &&
        getApiData?.data?.length > 0 &&
        url === "/treatment-plan"
      ) {
        item = getApiData?.data?.[0];
      } else {
        item = getApiData?.data;
      }
      setResidentProgressOtherText(item?.residentProgressOtherText || "");
      setResidentAttituteOtherText(item?.residentAttituteOtherText || "");
      setResidentParticipationOtherText(
        item?.residentParticipationOtherText || "",
      );
      if (
        item?.isRequiresAssistance !== null ||
        item?.isRequiresAssistance !== undefined
      ) {
        setIsRequiresAssistance(item?.isRequiresAssistance);
      }
      if (
        item?.bhServicesLimitsFunctioning !== null &&
        item?.bhServicesLimitsFunctioning !== undefined
      ) {
        setBhServicesLimitsFunctioning(item?.bhServicesLimitsFunctioning);
      }
      setPersonalFinancesComment(item?.personalFinancesComment || "");
      if (url !== "/treatment-plan") {
        // Fields moved to patientDetail sync
      }
      if (item?.religiousPreferenceText) {
        setReligiousPreferenceText(item?.religiousPreferenceText);
      }
      if (item?.supportSystemOtherText) {
        setSupportSystemOtherText(item?.supportSystemOtherText);
      }
      if (item?.individualTherapy) {
        setIndividualTherapy(item?.individualTherapy);
      }
      if (
        item?.recommendationsForFurtherProgramsOther ||
        item?.patientId?.recommendationsForFurtherProgramsOther
      ) {
        setRecommendationsForFurtherProgramsOther(
          item?.recommendationsForFurtherProgramsOther ||
            item?.patientId?.recommendationsForFurtherProgramsOther,
        );
      }
      if (item?.date) setDate(item?.date);
      if (url !== "/treatment-plan") {
        setInitialUpdate(item?.initialUpdate);
        setIsReason(item?.residentAgreementIsReason);
      } else {
        setInitialUpdate("");
      }
      setAdminDate(item?.patientId?.admitDate);
      setPhysicalService(item?.care ? item?.care?.[0] : "");
      setBehavior(item?.care ? item?.care?.[1] : "");
      setMedicationAdministation(
        item?.medicationService ? item?.medicationService?.[0] : "",
      );
      setMedicationAssistence(
        item?.medicationService ? item?.medicationService?.[1] : "",
      );
      if (url !== "/treatment-plan") {
        // Fields moved to patientDetail sync
      }
      setDiagonsis(item?.diagonsis);
      setMentelHealth(item?.mentalStatus);
      setMentelText(item?.mentalStatusOther);
      setMind(item?.moodLevel);
      setMindText(item?.moodLevelOther);
      setAdls(item?.adls);
      setAldsText(item?.adlsText);
      setBHealth(item?.behavioralHealthServices);
      setBtext(item?.behavioralHealthServicesOther);
      setAllergies(item?.allergies);
      if (url !== "/treatment-plan") {
        // Fields moved to patientDetail sync
      }
      // setBarriers(
      //   item?.
      //     item?.barriers?.map((item) => ({
      //       label: item,
      //       value: item,
      //     }))
      //     : []
      // );
      setBehavioralSymptoms(
        item?.riskAssessment?.behavioralSymptoms
          ? item?.riskAssessment?.behavioralSymptoms
          : [],
      );
      setBehavioralSymptomsOther(item?.riskAssessment?.behavioralSymptomsOther);
      setPhysicalSymptoms(
        item?.riskAssessment?.physicalSymptoms
          ? item?.riskAssessment?.physicalSymptoms
          : [],
      );
      setPhysicalSymptomsOther(item?.riskAssessment?.physicalSymptomsOther);
      setConsnotiveSymptoms(
        item?.riskAssessment?.cognitiveSymptoms
          ? item?.riskAssessment?.cognitiveSymptoms
          : [],
      );
      setConsnotiveSymptomsOther(item?.riskAssessment?.cognitiveSymptomsOther);
      setPsychosocialSymptoms(
        item?.riskAssessment?.psychosocialSymptoms
          ? item?.riskAssessment?.psychosocialSymptoms
          : [],
      );
      setPsychosocialSymptomsOther(
        item?.riskAssessment?.psychosocialSymptomsOther,
      );
      const interventionsImplementedValue = item?.interventions?.map((item) => {
        return {
          label: item,
          value: item,
        };
      });
      setInterventionsImplemented(interventionsImplementedValue);
      setInterventionsImplementedOther(item?.interventionsComment);
      setMinimumHoure(item?.counselingFrequencyMinimum);
      setDesiredMeasure(item?.desiredMeasure);
      setCounselingOptions(
        item?.counselingFrequency ? item?.counselingFrequency : [],
      );
      setCounselingOptionsOther(item?.counselingFrequencyComment);
      setOption1(
        item?.maintainSobrietyType
          ? item?.maintainSobrietyType.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption2(
        item?.independentLivingSkillsType
          ? item?.independentLivingSkillsType?.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption3(
        item?.employmentType
          ? item?.employmentType?.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption4(
        item?.adlsSecondType
          ? item?.adlsSecondType.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption5(
        item?.safetyType
          ? item?.safetyType.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption6(
        item?.medicationEducationType
          ? item.medicationEducationType.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption7(
        item?.managingMentalHealthType
          ? item.managingMentalHealthType.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setOption8(
        item?.legalType
          ? item.legalType.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setSobrietyInterventionsEditorValue(
        item?.sobrietyInterventionsEditorValue ?? "",
      );
      if (item?.sobrietyInterventionsEditorValue) {
        const options = stripHtmlList(item?.sobrietyInterventionsEditorValue);
        setSobrietyInterventionsSelected(options);
      }
      setAdmissionMeasure1(item?.maintainSobrietyAdmissionMeasure);
      setSobrietyEditorValue(item?.sobrietyEditorValue ?? "");
      setSobrietyObjectivesSelected(
        item?.maintainSobrietyObjective
          ? item?.maintainSobrietyObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setSobrietyObjectivesEditorValue(
        item?.sobrietyObjectivesEditorValue ?? "",
      );
      setCurrentMeasure1(item?.maintainSobrietyCurrentMeasure);
      setEstimatedDateOfCompletion1(
        item?.maintainSobrietyEstimatedDateOfCompletion,
      );
      setComment1(item?.maintainSobrietyComments);
      setIsMeasureMet1(item?.maintainSobrietyMeasureMet);
      setIndependentInterventionsEditorValue(
        item?.independentInterventionsEditorValue ?? "",
      );
      if (item?.independentInterventionsEditorValue) {
        const options = stripHtmlList(
          item?.independentInterventionsEditorValue,
        );
        setIndependentInterventionsSelected(options);
      }
      setAdmissionMeasure2(item?.independentLivingSkillsAdmissionMeasure);
      setIndependentEditorValue(item?.independentEditorValue ?? "");
      setIndependentObjectivesSelected(
        item?.independentLivingSkillsObjective
          ? item?.independentLivingSkillsObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setIndependentObjectivesEditorValue(
        item?.independentObjectivesEditorValue ?? "",
      );
      setPreviousMeasure2(item?.independentLivingSkillsPreviousMeasure);
      setCurrentMeasure2(item?.independentLivingSkillsCurrentMeasure);
      setEstimatedDateOfCompletion2(
        item?.independentLivingSkillsEstimatedDateOfCompletion,
      );
      setComment2(item?.independentLivingSkillsComments);
      setIsMeasureMet2(item?.independentMeasureMet);
      setEmploymentInterventionsEditorValue(
        item?.employmentInterventionsEditorValue ?? "",
      );
      if (item?.employmentInterventionsEditorValue) {
        const options = stripHtmlList(item?.employmentInterventionsEditorValue);
        setEmploymentInterventionsSelected(options);
      }
      setAdmissionMeasure3(item?.employmentAdmissionMeasure);
      setEmploymentEditorValue(item?.employmentEditorValue ?? "");
      setEmploymentObjectivesSelected(
        item?.employmentObjective
          ? item?.employmentObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setEmploymentObjectivesEditorValue(
        item?.employmentObjectivesEditorValue ?? "",
      );
      setCurrentMeasure3(item?.employmentCurrentMeasure);
      setEstimatedDateOfCompletion3(item?.employmentEstimatedDateOfCompletion);
      setComment3(item?.employmentComments);
      setIsMeasureMet3(item?.employmentMeasureMet);
      setAdlsInterventionsEditorValue(item?.adlsInterventionsEditorValue ?? "");
      if (item?.adlsInterventionsEditorValue) {
        const options = stripHtmlList(item?.adlsInterventionsEditorValue);
        setAdlsInterventionsSelected(options);
      }
      setAdmissionMeasure4(item?.adlsSecondAdmissionMeasure);
      setCurrentMeasure4(item?.adlsSecondCurrentMeasure);
      setAdlsEditorValue(item?.adlsEditorValue ?? "");
      setAdlsObjectivesSelected(
        item?.adlsSecondObjective
          ? item?.adlsSecondObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setAdlsObjectivesEditorValue(item?.adlsObjectivesEditorValue ?? "");
      setEstimatedDateOfCompletion4(item?.adlsSecondEstimatedDateOfCompletion);
      setComment4(item?.adlsSecondComments);
      setIsMeasureMet4(item?.adlsMeasureMet);
      setSafetyInterventionsEditorValue(
        item?.safetyInterventionsEditorValue ?? "",
      );
      if (item?.safetyInterventionsEditorValue) {
        const options = stripHtmlList(item?.safetyInterventionsEditorValue);
        setSafetyInterventionsSelected(options);
      }
      setAdmissionMeasure5(item?.safetyAdmissionMeasure);
      setSafetyEditorValue(item?.safetyEditorValue ?? "");
      setSafetyObjectivesSelected(
        item?.safetyObjective
          ? item?.safetyObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setSafetyObjectivesEditorValue(item?.safetyObjectivesEditorValue ?? "");
      setCurrentMeasure5(item?.safetyCurrentMeasure);
      setEstimatedDateOfCompletion5(item?.safetyEstimatedDateOfCompletion);
      setComment5(item?.safetyComments);
      setIsMeasureMet5(item?.safetyMeasureMet);
      setMedicationEducationInterventionsEditorValue(
        item?.medicationEducationInterventionsEditorValue ?? "",
      );
      if (item?.medicationEducationInterventionsEditorValue) {
        const options = stripHtmlList(
          item?.medicationEducationInterventionsEditorValue,
        );
        setMedicationInterventionsSelected(options);
      }
      setAdmissionMeasure6(item?.medicationEducationAdmissionMeasure);
      setCurrentMeasure6(item?.medicationEducationCurrentMeasure);
      setMedicationEditorValue(item?.medicationEditorValue ?? "");
      setMentalHealthObjectivesSelected(
        item?.medicationEducationObjective
          ? item?.medicationEducationObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setMedicationObjectivesEditorValue(
        item?.medicationObjectivesEditorValue ?? "",
      );
      setEstimatedDateOfCompletion6(
        item?.medicationEducationEstimatedDateOfCompletion,
      );
      setComment6(item?.medicationEducationComments);
      setIsMeasureMet6(item?.medicationEducationMeasureMet);
      setMentalHealthInterventionsEditorValue(
        item?.mentalHealthInterventionsEditorValue ?? "",
      );
      if (item?.mentalHealthInterventionsEditorValue) {
        const options = stripHtmlList(
          item?.mentalHealthInterventionsEditorValue,
        );
        setMentalHealthInterventionsSelected(options);
      }
      setAdmissionMeasure7(item?.managingMentalHealthAdmissionMeasure);
      setCurrentMeasure7(item?.managingMentalHealthCurrentMeasure);
      setMentalHealthEditorValue(item?.mentalHealthEditorValue ?? "");
      setMedicationObjectivesSelected(
        item?.managingMentalHealthObjective
          ? item?.managingMentalHealthObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setMentalHealthObjectivesEditorValue(
        item?.mentalHealthObjectivesEditorValue ?? "",
      );
      setEstimatedDateOfCompletion7(
        item?.managingMentalHealthEstimatedDateOfCompletion,
      );
      setLegalInterventionsEditorValue(
        item?.legalInterventionsEditorValue ?? "",
      );
      if (item?.legalInterventionsEditorValue) {
        const options = stripHtmlList(item?.legalInterventionsEditorValue);
        setLegalHealthInterventionsSelected(options);
      }
      setComment7(item?.managingMentalHealthComments);
      setIsMeasureMet7(item?.mentalHealthMeasureMet);
      setAdmissionMeasure8(item?.legalAdmissionMeasure);
      setLegalEditorValue(item?.legalEditorValue ?? "");
      setLegalObjectivesSelected(
        item?.legalObjective
          ? item?.legalObjective.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setLegalObjectivesEditorValue(item?.legalObjectivesEditorValue ?? "");
      setCurrentMeasure8(item?.legalCurrentMeasure);
      setEstimatedDateOfCompletion8(item?.legalEstimatedDateOfCompletion);
      setComment8(item?.legalComments);
      setIsMeasureMet8(item?.legalMeasureMet);
      setOtherArray(item?.other ? item?.other : []);
      setShowOther(false);
      setResidentParticipation(item?.residentParticipation);
      setResidentAttitute(item?.residentAttitude);
      setResidentProgress(item?.residentProgress);
      setSupportSystemPhoneNumber(item?.supportSystemPhoneNumber);
      setSupportSystem(item?.supportSystem ? item?.supportSystem : []);
      setCurrentMedications(item?.currentMedications);
      setreligiousPreference(item?.religiousPreference);
      setNutritionAndWellnessPlanning(
        item?.nutritionAndWellnessPlanning
          ? item?.nutritionAndWellnessPlanning
          : [],
      );
      setRecommendationToExtendResidentialTreatment(
        item?.recommendationToExtendResidentialTreatment,
      );
      setPersonalFinances(item?.personalFinances);
      setDischargePlanning(
        item?.dischargePlanning ||
          item?.patientId?.dischargePlanningAndAfterCarePlanning ||
          [],
      );
      setDischargePlanningOther(
        item?.dischargePlanningOther ||
          item?.patientId?.dischargePlanningAndAfterCarePlanningOther ||
          "",
      );
      setAdditionalComment(
        item?.additionalComment ||
          item?.patientId?.additionalDischargePlanningComment ||
          "",
      );
      setRecommendationsForFurtherPrograms(
        item?.recommendationsForFurtherPrograms
          ? item?.recommendationsForFurtherPrograms
          : item?.patientId?.recommendationsForFurtherPrograms || [],
      );
      setAfterCareAndTransitionPlanning(
        item?.afterCareAndTransitionPlanning
          ? item?.afterCareAndTransitionPlanning
          : item?.patientId?.afterCareAndTransitionPlanning || [],
      );
      setTextData(item?.clinicalSummaryBeforeDate);
      setClinicalSummary(
        item?.clinicalSummary
          ? item.clinicalSummary.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setTreatmentPlanReviewDate(item?.treatmentPlanReviewDate);
      setDischargePlanDate(item?.dischargePlanDate);
      setClientCareCoordinationTeam(item?.clientCareCoordinationTeam);
      setReadinessDischarge(
        item?.readinessDischarge || item?.patientId?.readinessDischarge || "",
      );
      setIsAdditionalDischargePlanningChecked(
        item?.isAdditionalDischargePlanningChecked ??
          item?.patientId?.isAdditionalDischargePlanningChecked ??
          null,
      );
      setResident(item?.individualsParticipatingInServicePlan?.resident);
      setGuardian(item?.individualsParticipatingInServicePlan?.guardian);
      setStaff(item?.individualsParticipatingInServicePlan?.staff);
      setBph(item?.individualsParticipatingInServicePlan?.bhp);
      setOtherIndividual(
        item?.individualsParticipatingInServicePlan?.otherIndividual,
      );
      setCommentIndividual(
        item?.individualsParticipatingInServicePlan?.comment,
      );
      setrefusalReason(item?.residentAgreementRefusalReason);
      setVerbalConsentResidentRepresentative(
        item?.verbalConsentResidentRepresentative ?? "",
      );
      setNameResident(item?.signaturesResident?.name);
      setCredentialsResident(item?.signaturesResident?.credentials);
      setsignatureResident(item?.signaturesResident?.signature);
      setDateResident(item?.signaturesResident?.date);
      setTimeResident(item?.signaturesResident?.time);
      setNameFacilityRep(item?.signaturesFacilityRep?.name);
      setCredentialsFacilityRep(item?.signaturesFacilityRep?.credentials);
      setsignatureFacilityRep(item?.signaturesFacilityRep?.signature);
      setDateFacilityRep(item?.signaturesFacilityRep?.date);
      setTimeFacality(item?.signaturesFacilityRep?.time);
      setNameBhp(item?.signaturesBhp?.name);
      if (item?.services?.length > 0) {
        setServiceData(item?.services);
      }
      if (url === "/treatment-plan") {
        setCredentialsBhp("");
        setsignatureBhp("");
        setDateBhp("");
        setTimeBhp("");
        setSigners([]);
      } else {
        setCredentialsBhp(item?.signaturesBhp?.credentials);
        setsignatureBhp(item?.signaturesBhp?.signature);
        setDateBhp(item?.signaturesBhp?.date);
        setTimeBhp(item?.signaturesBhp?.time);
        setAdminSignature(item?.adminSignature);
        setAdminSignatureDate(item?.adminSignatureDate);
        setAdminSignatureTime(item?.adminSignatureTime);
        setSigners(item?.signers);
      }
      // 2026-04-29: don't auto-populate inline signatures on the CREATE
      // path — when a Resident is selected, prior records are pulled in to
      // pre-fill demographic fields, but signatures must always start fresh
      // and be re-signed for each new Treatment Plan.
      if (item?.signatures && url !== "/treatment-plan") {
        loadSignaturesFromApi(item.signatures);
      }
    }
  }, [getApiData, url, loadSignaturesFromApi]);
  useEffect(() => {
    if (patientId && url === "/treatment-plan") {
      treatmentPlanService.getPatientTreatmentPlan(patientId, {
        setResponse: setGetApiData,
        setLoading,
      });
    }
    treatmentPlanService.getMeasureables({
      setResponse: (res) => {
        const mesurableData =
          res?.data
            ?.filter((item) => item.type === "MEASURABLES")
            ?.reduce((acc, curr) => {
              const existing = acc.find((obj) => obj.topic === curr.topic);
              const getListItems = (html) => {
                const match = html.match(/<li.*?<\/li>/g);
                return match ? match.map((li) => li.trim()) : [];
              };
              const currItems = getListItems(curr.value);
              if (existing) {
                const existingItems = getListItems(existing.value);
                const merged = Array.from(
                  new Set([...existingItems, ...currItems]),
                );
                existing.value = `<ul>${merged.join("")}</ul>`;
              } else {
                acc.push({
                  ...curr,
                });
              }
              return acc;
            }, []) || [];
        const objectiveData =
          res?.data
            ?.filter((item) => item.type === "OBJECTIVES")
            ?.reduce((acc, curr) => {
              const existing = acc.find((obj) => obj.topic === curr.topic);
              const getListItems = (html) => {
                const match = html.match(/<li.*?<\/li>/g);
                return match ? match.map((li) => li.trim()) : [];
              };
              const currItems = getListItems(curr.value);
              if (existing) {
                const existingItems = getListItems(existing.value);
                const merged = Array.from(
                  new Set([...existingItems, ...currItems]),
                );
                existing.value = `<ul>${merged.join("")}</ul>`;
              } else {
                acc.push({
                  ...curr,
                });
              }
              return acc;
            }, []) || [];
        const interventionsData =
          res?.data
            ?.filter((item) => item.type === "INTERVENTIONS")
            ?.reduce((acc, curr) => {
              const existing = acc.find((obj) => obj.topic === curr.topic);
              const getListItems = (html) => {
                const match = html.match(/<li.*?<\/li>/g);
                return match ? match.map((li) => li.trim()) : [];
              };
              const currItems = getListItems(curr.value);
              if (existing) {
                const existingItems = getListItems(existing.value);
                const merged = Array.from(
                  new Set([...existingItems, ...currItems]),
                );
                existing.value = `<ul>${merged.join("")}</ul>`;
              } else {
                acc.push({
                  ...curr,
                });
              }
              return acc;
            }, []) || [];
        mesurableData.forEach((element) => {
          const options = stripHtmlList(element.value);
          switch (element.topic) {
            case "Maintain sobriety":
              setOption1Option(options);
              break;
            case "Independent Living Skills":
              setOption2Option(options);
              break;
            case "Employment":
              setOption3Option(options);
              break;
            case "ADLS":
              setOption4Option(options);
              break;
            case "Safety":
              setOption5Option(options);
              break;
            case "Medication":
              setOption6Option(options);
              break;
            case "Managing Mental Health":
              setOption7Option(options);
              break;
            case "Legal":
              setOption8Option(options);
              break;
            default:
              break;
          }
        });
        objectiveData.forEach((element) => {
          const options = stripHtmlList(element.value);
          switch (element.topic) {
            case "Maintain sobriety":
              setObjective1Option(options);
              break;
            case "Independent Living Skills":
              setObjective2Option(options);
              break;
            case "Employment":
              setObjective3Option(options);
              break;
            case "ADLS":
              setObjective4Option(options);
              break;
            case "Safety":
              setObjective5Option(options);
              break;
            case "Medication":
              setObjective6Option(options);
              break;
            case "Managing Mental Health":
              setObjective7Option(options);
              break;
            case "Legal":
              setObjective8Option(options);
              break;
            default:
              break;
          }
        });
        interventionsData.forEach((element) => {
          const options = stripHtmlList(element.value);
          switch (element.topic) {
            case "Maintain sobriety":
              setInterventions1Option(options);
              break;
            case "Independent Living Skills":
              setInterventions2Option(options);
              break;
            case "Employment":
              setInterventions3Option(options);
              break;
            case "ADLS":
              setInterventions4Option(options);
              break;
            case "Safety":
              setInterventions5Option(options);
              break;
            case "Medication":
              setInterventions6Option(options);
              break;
            case "Managing Mental Health":
              setInterventions7Option(options);
              break;
            case "Legal":
              setInterventions8Option(options);
              break;
            default:
              break;
          }
        });
      },
    });
  }, [patientId, url]);
  useEffect(() => {
    if (id) {
      treatmentPlanService.getById(id, { setResponse: setGetApiData });
    }
  }, [id]);
  useEffect(() => {
    const pId = getApiData?.data?.patientId?._id || getApiData?.data?.patientId;
    if (pId) {
      patientService.getById(pId, {
        setResponse: (res) => {
          setUser(res);
          setPatientDetail(res?.data || res);
        },
      });
    }
  }, [getApiData?.data?.patientId]);
  useEffect(() => {
    if (user || getApiData) {
      setUserId(user?.data?._id || getApiData?.data?.patientId?._id);
      setDob(
        user?.data?.dateOfBirth || getApiData?.data?.patientId?.dateOfBirth,
      );
    }
  }, [user, getApiData]);
  useEffect(() => {
    if (patientDetail || user || getApiData) {
      if (url === "/treatment-plan") {
        setResidentName(
          `${patientDetail?.firstName || ""} ${patientDetail?.lastName || ""}`.trim(),
        );
      } else {
        setResidentName(
          `${getApiData?.data?.patientId?.firstName || ""} ${getApiData?.data?.patientId?.lastName || ""}`.trim() ||
            getApiData?.data?.residentName ||
            `${user?.data?.firstName || ""} ${user?.data?.lastName || ""}`.trim() ||
            getApiData?.data?.patientId?.residentName,
        );
      }
      if (patientDetail && Object.keys(patientDetail).length > 0) {
        setStrengths(
          patientDetail?.residentStrengths
            ? patientDetail?.residentStrengths.map((s) => ({
                label: s,
                value: s,
              }))
            : [],
        );
        setTriggers(patientDetail?.triggers || "");
        setResidentGoal(patientDetail?.residentGoals || "");
        if (
          patientDetail?.fallRisk !== null &&
          patientDetail?.fallRisk !== undefined
        ) {
          const fr = patientDetail?.fallRisk;
          setIsFallRisk(
            fr === "Yes" || fr === true
              ? true
              : fr === "No" || fr === false
                ? false
                : null,
          );
        } else {
          setIsFallRisk(null);
        }
        setFallRiskComment(patientDetail?.fallRiskExplanation || "");
        const presentingProbs =
          getApiData?.data?.presentingProblems?.length > 0
            ? getApiData.data.presentingProblems
            : patientDetail?.presentingProblems;

        setPresentingPrice(
          presentingProbs
            ? presentingProbs.map((s) => ({
                label: typeof s === "string" ? s : s?.label,
                value: typeof s === "string" ? s : s?.value,
              }))
            : [],
        );
        setBarriers(patientDetail?.stepDownBarriers || []);
        setBarriersBoolean(
          patientDetail?.stepDownBarriers?.includes("Other") || false,
        );
        setBarriersOther(patientDetail?.stepDownBarriersOther || "");
        setBarriersText(patientDetail?.stepDownBarriersText || "");

        setDischargePlanning(
          patientDetail?.dischargePlanningAndAfterCarePlanning || [],
        );
        setDischargePlanningOther(
          patientDetail?.dischargePlanningAndAfterCarePlanningOther || "",
        );
        setIsAdditionalDischargePlanningChecked(
          patientDetail?.isAdditionalDischargePlanningChecked ?? null,
        );
        setAdditionalComment(
          patientDetail?.additionalDischargePlanningComment || "",
        );
        setReadinessDischarge(patientDetail?.readinessDischarge || "");
        setRecommendationsForFurtherPrograms(
          patientDetail?.recommendationsForFurtherPrograms || [],
        );
        setRecommendationsForFurtherProgramsOther(
          patientDetail?.recommendationsForFurtherProgramsOther || "",
        );
        setAfterCareAndTransitionPlanning(
          patientDetail?.afterCareAndTransitionPlanning || [],
        );
      }
      if (patientDetail) {
        setPrimaryCare(patientDetail?.primaryCareProvider);
        setPrimaryCareProviderContact(
          patientDetail?.primaryCareProviderContact,
        );
        setPrimaryCareProviderAddress(
          patientDetail?.primaryCareProviderAddress,
        );

        setPsychiatricProvider(patientDetail?.psychiatricProvider);
        setPsychiatricProviderContact(
          patientDetail?.psychiatricProviderContact,
        );
        setPsychiatricProviderAddress(
          patientDetail?.psychiatricProviderAddress,
        );
      }
      // Moved resident name logic above
      setDob(
        patientDetail?.dateOfBirth
          ? patientDetail?.dateOfBirth
          : user?.data?.dateOfBirth || getApiData?.data?.patientId?.dateOfBirth,
      );
      setAdminDate(
        patientDetail?.admitDate
          ? patientDetail?.admitDate
          : user?.data?.admitDate || getApiData?.data?.patientId?.admitDate,
      );
      setAhcccsId(
        patientDetail?.ahcccsId
          ? patientDetail?.ahcccsId
          : user?.data?.ahcccsId || getApiData?.data?.patientId?.ahcccsId,
      );
      setDiagnosis(
        patientDetail?.diagnosis
          ? patientDetail?.diagnosis
          : user?.data?.diagnosis || getApiData?.data?.patientId?.diagnosis,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData, patientDetail, user]);
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
        .includes("tp");
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
  const handlePost = (e) => {
    e.preventDefault();
    let presentingPriceArray = [];
    presentingPrice.forEach((item) => {
      presentingPriceArray.push(item?.value);
    });
    let strengthsArray = [];
    strengths.forEach((item) => {
      strengthsArray.push(item?.value);
    });
    let BarriersArray = [];
    Barriers.forEach((item) => {
      BarriersArray.push(item?.value);
    });
    let option1Array = [];
    option1.forEach((item) => {
      option1Array.push(item?.value);
    });
    let option2Array = [];
    option2.forEach((item) => {
      option2Array.push(item?.value);
    });
    let option3Array = [];
    option3.forEach((item) => {
      option3Array.push(item?.value);
    });
    let option4Array = [];
    option4.forEach((item) => {
      option4Array.push(item?.value);
    });
    let option5Array = [];
    option5.forEach((item) => {
      option5Array.push(item?.value);
    });
    let option6Array = [];
    option6.forEach((item) => {
      option6Array.push(item?.value);
    });
    let option7Array = [];
    option7.forEach((item) => {
      option7Array.push(item?.value);
    });
    let option8Array = [];
    option8.forEach((item) => {
      option8Array.push(item?.value);
    });
    let clinicalSummaryArray = [];
    clinicalSummary.forEach((item) => {
      clinicalSummaryArray.push(item?.value);
    });
    const getServiceData = () => {
      return [...services, ...dynamicServices]
        .filter((data) => data.serviceProvided !== "")
        .map((service) => ({
          serviceProvided: service.serviceProvided,
          daily: service.daily.map((item) => item.value),
          monthly: service.monthly.map((item) => item.value),
          weekly: service.weekly?.map((item) => item.value),
          asNeeded: service.asNeeded.map((item) => item.value),
          additionalNotes: service.additionalNotes,
        }));
    };
    const data = {
      personalFinancesComment,
      individualTherapy,
      residentName,
      initialUpdate,
      dateOfBirth: dob,
      date: date || formatDateToMMDDYYYY(new Date()),
      admitDate: admitDate,
      care: [physicalService, behavior],
      medicationService: [medicationAdministation, medicationAssistance],
      presentingProblems: presentingPriceArray,
      diagonsis,
      mentalStatus: mendelHealth,
      mentalStatusOther: mentelText,
      moodLevel: mind,
      moodLevelOther: mindText,
      adls: adls,
      adlsText: adlsText,
      behavioralHealthServices: BHealth,
      behavioralHealthServicesOther: Btext,
      primaryCareProvider: primaryCare,
      primaryCareProviderContact,
      primaryCareProviderAddress,
      psychiatricProvider: psychiatricProvider,
      psychiatricProviderContact,
      psychiatricProviderAddress,
      residentGoals: residentGoal,
      allergies: allergies,
      triggers: Triggers,
      strengths: strengthsArray,
      stepDownBarriers: Barriers?.filter((val) => val !== null),
      stepDownBarriersOther: barriersOther,
      stepDownBarriersText: barriersText,
      barriers: Barriers?.filter((val) => val !== null),
      barriersOther: barriersOther,
      barriersText,
      riskAssessment: {
        behavioralSymptoms: behavioralSymptoms,
        behavioralSymptomsOther: behavioralSymptomsOther,
        physicalSymptoms: physicalSymptoms,
        physicalSymptomsOther: physicalSymptomsOther,
        cognitiveSymptoms: consnotiveSymptoms,
        cognitiveSymptomsOther: consnotiveSymptomsOther,
        psychosocialSymptoms: psychosocialSymptoms,
        psychosocialSymptomsOther: psychosocialSymptomssOther,
      },
      interventions: interventionsImplemented?.map((item) => item.value),
      interventionsComment: interventionsImplementedOther,
      counselingFrequency: counselingOptions,
      counselingFrequencyMinimum: minimumHoure,
      counselingFrequencyComment: counselingOptionsText,
      desiredMeasure: desiredMeasure,
      maintainSobrietyType: option1Array,
      sobrietyEditorValue,
      maintainSobrietyObjective: sobrietyObjectivesSelected?.map(
        (value) => value.value,
      ),
      sobrietyObjectivesEditorValue,
      // maintainSobrietyInterventions: interventions1,
      sobrietyInterventionsEditorValue,
      maintainSobrietyAdmissionMeasure: admissionMeasure1,
      maintainSobrietyCurrentMeasure: currentMeasure1,
      maintainSobrietyEstimatedDateOfCompletion:
        estimatedDateOfCompletion1 ?? "",
      maintainSobrietyComments: comments1,
      maintainSobrietyMeasureMet: isMeasureMet1,
      independentLivingSkillsType: option2Array,
      independentEditorValue,
      independentLivingSkillsObjective: independentObjectivesSelected?.map(
        (value) => value.value,
      ),
      independentObjectivesEditorValue,
      // independentInterventions: interventions2,
      independentInterventionsEditorValue,
      independentLivingSkillsAdmissionMeasure: admissionMeasure2,
      independentLivingSkillsCurrentMeasure: currentMeasure2,
      independentLivingSkillsEstimatedDateOfCompletion:
        estimatedDateOfCompletion2 ?? "",
      independentLivingSkillsComments: comments2,
      independentMeasureMet: isMeasureMet2,
      employmentType: option3Array,
      employmentEditorValue,
      employmentObjective: employmentObjectivesSelected?.map(
        (value) => value.value,
      ),
      employmentObjectivesEditorValue,
      // employmentInterventions: interventions3,
      employmentInterventionsEditorValue,
      employmentAdmissionMeasure: admissionMeasure3,
      employmentCurrentMeasure: currentMeasure3,
      employmentEstimatedDateOfCompletion: estimatedDateOfCompletion3 ?? "",
      employmentComments: comments3,
      employmentMeasureMet: isMeasureMet3,
      adlsSecondType: option4Array,
      adlsEditorValue,
      adlsSecondObjective: adlsObjectivesSelected?.map((value) => value.value),
      adlsObjectivesEditorValue,
      // adlsInterventions: interventions4,
      adlsInterventionsEditorValue,
      adlsSecondAdmissionMeasure: admissionMeasure4,
      adlsSecondCurrentMeasure: currentMeasure4,
      adlsSecondEstimatedDateOfCompletion: estimatedDateOfCompletion4 ?? "",
      adlsSecondComments: comments4,
      adlsMeasureMet: isMeasureMet4,
      safetyType: option5Array,
      safetyEditorValue,
      safetyObjective: safetyObjectivesSelected?.map((value) => value.value),
      safetyObjectivesEditorValue,
      // safetyInterventions: interventions5,
      safetyInterventionsEditorValue,
      safetyAdmissionMeasure: admissionMeasure5,
      safetyCurrentMeasure: currentMeasure5,
      safetyEstimatedDateOfCompletion: estimatedDateOfCompletion5 ?? "",
      safetyComments: comments5,
      safetyMeasureMet: isMeasureMet5,
      medicationEducationType: option6Array,
      medicationEditorValue,
      medicationEducationObjective: medicationObjectivesSelected?.map(
        (value) => value.value,
      ),
      medicationObjectivesEditorValue,
      // medicationEducationInterventions: interventions6,
      medicationEducationInterventionsEditorValue,
      medicationEducationAdmissionMeasure: admissionMeasure6,
      medicationEducationCurrentMeasure: currentMeasure6,
      medicationEducationEstimatedDateOfCompletion:
        estimatedDateOfCompletion6 ?? "",
      medicationEducationComments: comments6,
      medicationEducationMeasureMet: isMeasureMet6,
      managingMentalHealthType: option7Array,
      mentalHealthEditorValue,
      managingMentalHealthObjective: mentalHealthObjectivesSelected?.map(
        (value) => value.value,
      ),
      mentalHealthObjectivesEditorValue,
      // mentalHealthInterventions: interventions7,
      mentalHealthInterventionsEditorValue,
      managingMentalHealthAdmissionMeasure: admissionMeasure7,
      managingMentalHealthCurrentMeasure: currentMeasure7,
      managingMentalHealthEstimatedDateOfCompletion:
        estimatedDateOfCompletion7 ?? "",
      managingMentalHealthComments: comments7,
      mentalHealthMeasureMet: isMeasureMet7,
      legalType: option8Array,
      legalEditorValue,
      legalObjective: legalObjectivesSelected?.map((value) => value.value),
      legalObjectivesEditorValue,
      // legalInterventions: interventions8,
      legalInterventionsEditorValue,
      legalAdmissionMeasure: admissionMeasure8,
      legalCurrentMeasure: currentMeasure8,
      legalEstimatedDateOfCompletion: estimatedDateOfCompletion8 ?? "",
      legalComments: comments8,
      legalMeasureMet: isMeasureMet8,
      other: otherArray.map(
        ({ admissionMeasureError, currentMeasureError, ...rest }) => rest,
      ),
      residentParticipation,
      residentParticipationOtherText,
      residentAttitude: residentAttitute,
      residentAttituteOtherText,
      residentProgress,
      residentProgressOtherText,
      isRequiresAssistance,
      bhServicesLimitsFunctioning,
      isFallRisk,
      fallRiskComment,
      supportSystem,
      supportSystemOtherText,
      supportSystemPhoneNumber: supportSystemPhoneNumber,
      currentMedications,
      religiousPreference,
      religiousPreferenceText,
      nutritionAndWellnessPlanning,
      recommendationToExtendResidentialTreatment,
      personalFinances,
      dischargePlanning,
      dischargePlanningOther,
      additionalComment,
      recommendationsForFurtherPrograms,
      recommendationsForFurtherProgramsOther,
      afterCareAndTransitionPlanning,
      clinicalSummaryBeforeDate: textData,
      clinicalSummary: clinicalSummaryArray,
      treatmentPlanReviewDate,
      dischargePlanDate,
      clientCareCoordinationTeam,
      readinessDischarge,
      // additionalDischargePlanning,
      isAdditionalDischargePlanningChecked,
      individualsParticipatingInServicePlan: {
        resident: resident,
        guardian: guardian,
        staff: staff,
        bhp: bpn,
        otherIndividual,
        comment: commentIndividual,
      },
      residentAgreementIsReason: isReason,
      residentAgreementRefusalReason: refusalReason,
      verbalConsentResidentRepresentative,
      signaturesResident: {
        name: nameResident,
        credentials: credentialsResident,
        signature: signatureResident,
        date: dateResident,
        time: timeResident,
      },
      signaturesFacilityRep: {
        name: nameFacilityRep,
        credentials: credentialsFacilityRep,
        signature: signatureFacilityRep,
        date: dateFacilityRep,
        time: timeFacality,
      },
      signaturesBhp: {
        name: nameBhp,
        credentials: credentialsBhp,
        signature: signatureBhp,
        date: dateBhp,
        time: timeBhp,
      },
      services: getServiceData(),
      adminSignature,
      adminSignatureDate,
      adminSignatureTime,
      signatures,
      signers: id
        ? signers
        : (signers || []).map((signer) => ({
            signerId: signer.value,
            name: signer.label,
            signature: "",
            dateSigned: "",
            signedTime: "",
            type: signer.type,
          })),
    };
    if (url === "/treatment-plan") {
      treatmentPlanService.create({
        patientId,
        payload: data,
        setLoading,
        successMsg: "Success !",
        navigate,
      });
    } else {
      treatmentPlanService.update({
        id,
        payload: data,
        setLoading,
        navigate,
      });
    }
  };
  const handleCheckboxChangeMentalHealth = (value) => {
    setMentelHealth(value);
  };
  const handleCheckboxChangeMind = (value) => {
    setMind(value);
  };

  //set the answer handleCheckboxChangeBehavioral
  const handleCheckboxChangeBehavioral = (symptom) => {
    if (symptom === "Other") {
      setBehavioralSymptoms((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setBehavioralSymptoms((prevState) => {
        if (prevState.includes(symptom)) {
          return prevState.filter((item) => item !== symptom);
        } else {
          return [...prevState, symptom];
        }
      });
    }
  };
  const handleCheckboxChangeBarrier = (symptom) => {
    if (symptom === "Other") {
      setBarriers((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setBarriers((prevState) => {
        if (prevState.includes(symptom)) {
          return prevState.filter((item) => item !== symptom);
        } else {
          return [...prevState, symptom];
        }
      });
    }
  };
  const handleCheckboxChangePhysical = (symptom) => {
    if (symptom === "Other") {
      setPhysicalSymptoms((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setPhysicalSymptoms((prevSelectedSymptoms) => {
        if (prevSelectedSymptoms.includes(symptom)) {
          return prevSelectedSymptoms.filter(
            (selected) => selected !== symptom,
          );
        } else {
          return [...prevSelectedSymptoms, symptom];
        }
      });
    }
  };
  const handleCheckboxChangeCognitive = (symptom) => {
    if (symptom === "Other") {
      setConsnotiveSymptoms((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setConsnotiveSymptoms((prevSelectedSymptoms) => {
        if (prevSelectedSymptoms.includes(symptom)) {
          return prevSelectedSymptoms.filter(
            (selected) => selected !== symptom,
          );
        } else {
          return [...prevSelectedSymptoms, symptom];
        }
      });
    }
  };
  const handleCheckboxChangePsychosocial = (symptom) => {
    if (symptom === "Other") {
      setPsychosocialSymptoms((prevState) => {
        if (prevState?.includes("Other")) {
          return prevState?.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setPsychosocialSymptoms((prevSelectedSymptoms) => {
        if (prevSelectedSymptoms?.includes(symptom)) {
          return prevSelectedSymptoms?.filter(
            (selected) => selected !== symptom,
          );
        } else {
          return [...prevSelectedSymptoms, symptom];
        }
      });
    }
  };
  const handleCheckboxChange = (value) => {
    // Check if the value is already in the array
    const isValueChecked = interventionsImplemented.includes(value);

    // If it's checked, remove it; otherwise, add it to the array
    const updatedInterventions = isValueChecked
      ? interventionsImplemented.filter((item) => item !== value)
      : [...interventionsImplemented, value];
    setInterventionsImplemented(updatedInterventions);
  };
  const handleCheckboxChangeCounsiling = (value) => {
    // Check if the value is already in the array
    const isValueChecked = counselingOptions.includes(value);

    // If it's checked, remove it; otherwise, add it to the array
    const updatedCounselingOptions = isValueChecked
      ? counselingOptions.filter((item) => item !== value)
      : [...counselingOptions, value];
    setCounselingOptions(updatedCounselingOptions);
  };

  //suppost system handle
  const handleCheckboxChangeSupportSystem = (value) => {
    // Check if the value is already in the array
    const isValueChecked = supportSystem.includes(value);

    // If it's checked, remove it; otherwise, add it to the array
    const updatedSupportSystem = isValueChecked
      ? supportSystem.filter((item) => item !== value)
      : [...supportSystem, value];
    setSupportSystem(updatedSupportSystem);
  };
  const handleCheckboxChangerecommendationsForFurtherPrograms = (value) => {
    // Check if the value is already in the array
    const isValueChecked = recommendationsForFurtherPrograms.includes(value);

    // If it's checked, remove it; otherwise, add it to the array
    const updatedRecommendations = isValueChecked
      ? recommendationsForFurtherPrograms.filter((item) => item !== value)
      : [...recommendationsForFurtherPrograms, value];
    setRecommendationsForFurtherPrograms(updatedRecommendations);
  };
  const handleCheckboxChangeafterCareAndTransitionPlanning = (value) => {
    // Check if the value is already in the array
    const isValueChecked = afterCareAndTransitionPlanning.includes(value);

    // If it's checked, remove it; otherwise, add it to the array
    const updatedEmergencyContacts = isValueChecked
      ? afterCareAndTransitionPlanning.filter((item) => item !== value)
      : [...afterCareAndTransitionPlanning, value];
    setAfterCareAndTransitionPlanning(updatedEmergencyContacts);
  };
  const handleCheckboxChanges = (option) => {
    setDischargePlanning((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };
  useEffect(() => {
    for (let i = 0; i < counselingOptions?.length; i++) {
      if (counselingOptions[i] === "Other") {
        setCounselingOptionsTextBoolean(true);
        break;
      } else {
        setCounselingOptionsTextBoolean(false);
      }
    }
    for (let i = 0; i < supportSystem.length; i++) {
      if (supportSystem[i] === "Other") {
        setSupportSystemOtherTextBoolean(true);
        break;
      } else {
        setSupportSystemOtherTextBoolean(false);
      }
    }
  }, [counselingOptions, supportSystem]);
  const presentingPriceOption = PRESENTING_PROBLEMS_OPTIONS;
  const handleKeyPresentingPrice = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = presentingPriceOption.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...presentingPriceOption,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setPresentingPrice(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...presentingPrice,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setPresentingPrice(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const presentingPriceHandler = (optionValue) => {
    setPresentingPrice(optionValue);
  };
  const strengthsOption = [
    {
      label: "Self Motivated",
      value: "Self Motivated",
    },
    {
      label: "Loving",
      value: "Loving",
    },
    {
      label: "Honest",
      value: "Honest",
    },
    {
      label: "Helping Others",
      value: "Helping Others",
    },
    {
      label: "Communication",
      value: "Communication",
    },
    {
      label: "Creative",
      value: "Creative",
    },
    {
      label: "Patient",
      value: "Patient",
    },
    {
      label: "Dedication",
      value: "Dedication",
    },
    {
      label: "Coloring",
      value: "Coloring",
    },
    {
      label: "Decision Making",
      value: "Decision Making",
    },
    {
      label: "Team Work",
      value: "Team Work",
    },
  ];
  const handleKeyStrengths = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = strengthsOption.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...strengthsOption,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setStrengths(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...strengths,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setStrengths(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const strengthsHandler = (optionValue) => {
    setStrengths(optionValue);
  };
  const interventionsOption = [
    {
      label: "Psychiatric services",
      value: "Psychiatric services",
    },
    {
      label: "Communication Skills",
      value: "Communication Skills",
    },
    {
      label: "Verbal Prompt",
      value: "Verbal Prompt",
    },
    {
      label: "Interactive Feedback",
      value: "Interactive Feedback",
    },
    {
      label: "Encouragement",
      value: "Encouragement",
    },
    {
      label: "Role-Play",
      value: "Role-Play",
    },
    {
      label: "Sponsors, and support programs & people",
      value: "Sponsors, and support programs & people",
    },
    {
      label: "Review of Behavioral Health Treatment Plan",
      value: "Review of Behavioral Health Treatment Plan",
    },
    {
      label: "Relaxation techniques",
      value: "Relaxation techniques",
    },
    {
      label: "Reframing",
      value: "Reframing",
    },
    {
      label: "Conflict resolution",
      value: "Conflict resolution",
    },
    {
      label: "Rehearsal",
      value: "Rehearsal",
    },
    {
      label: "Spiritual exploration",
      value: "Spiritual exploration",
    },
    {
      label: "Values clarification",
      value: "Values clarification",
    },
    {
      label: "Psycho Education",
      value: "Psycho Education",
    },
    {
      label: "Exploring feelings",
      value: "Exploring feelings",
    },
  ];

  // const handleKeyInterventions = (event) => {
  //   if (event.key === "Enter" && event.target.value) {
  //     const inputValue = event.target.value.trim();

  //     // Check if the input value already exists in the options array
  //     const optionExists = interventionsOption.some(
  //       (option) => option.value === inputValue
  //     );

  //     // If the input value doesn't exist, add it to the array
  //     if (!optionExists) {
  //       const newOptions = [
  //         ...interventionsOption,
  //         { value: inputValue, label: inputValue },
  //       ];

  //       // Update the state with the new options
  //       setInterventions(newOptions);

  //       // Update the selected values to include the newly created option
  //       const newSelectedValues = [
  //         ...Barriers,
  //         { value: inputValue, label: inputValue },
  //       ];
  //       setInterventions(newSelectedValues);
  //     }

  //     // Clear the input value after adding the option
  //     event.target.value = "";
  //   }
  // };

  // const interventionsHandler = (optionValue) => {
  //   setInterventions(optionValue);
  // };

  // const option1Option = [
  //   {
  //     label: "Resident to maintain sobriety for the next 90 days",
  //     value: "Resident to maintain sobriety for the next 90 days",
  //   },
  //   {
  //     label:
  //       "Resident to learn and implement coping skills to support sobriety",
  //     value:
  //       "Resident to learn and implement coping skills to support sobriety",
  //   },
  //   {
  //     label: "Resident to learn relapse prevention skills",
  //     value: "Resident to learn relapse prevention skills",
  //   },

  //   {
  //     label: "Resident will maintain abstinence for at least the next 90 days",
  //     value: "Resident will maintain abstinence for at least the next 90 days",
  //   },

  //   {
  //     label: "Resident will report craving to staff on shift",
  //     value: "Resident will report craving to staff on shift",
  //   },
  //   {
  //     label: "Resident will know at least 3 triggers to substance use",
  //     value: "Resident will know at least 3 triggers to substance use",
  //   },
  //   {
  //     label:
  //       "Resident will learn and know the consequences associated with substance use",
  //     value:
  //       "Resident will learn and know the consequences associated with substance use",
  //   },
  //   {
  //     label:
  //       "Resident will participate with the clinical team for after planning",
  //     value:
  //       "Resident will participate with the clinical team for after planning",
  //   },
  //   {
  //     label:
  //       "Resident will involve family as a support system to help maintain sobriety",
  //     value:
  //       "Resident will involve family as a support system to help maintain sobriety",
  //   },
  //   {
  //     label: "Resident will attend self-help group (AA,NA,COA,)",
  //     value: "Resident will attend self-help group (AA,NA,COA,)",
  //   },
  //   {
  //     label: "Identify 4 positive friend that will support sobriety",
  //     value: "Identify 4 positive friend that will support sobriety",
  //   },
  //   {
  //     label: "Resident will refrain from drug seeking behaviors",
  //     value: "Resident will refrain from drug seeking behaviors",
  //   },
  // ];
  // const handleKeyOption1 = (event) => {
  //   if (event.key === "Enter" && event.target.value) {
  //     const inputValue = event.target.value.trim();

  //     // Check if the input value already exists in the options array
  //     const optionExists = option1Option.some(
  //       (option) => option.value === inputValue
  //     );

  //     // If the input value doesn't exist, add it to the array
  //     if (!optionExists) {
  //       const newOptions = [
  //         ...option1Option,
  //         { value: inputValue, label: inputValue },
  //       ];

  //       // Update the state with the new options
  //       setOption1(newOptions);

  //       // Update the selected values to include the newly created option
  //       const newSelectedValues = [
  //         ...option1,
  //         { value: inputValue, label: inputValue },
  //       ];
  //       setOption1(newSelectedValues);
  //     }

  //     // Clear the input value after adding the option
  //     event.target.value = "";
  //   }
  // };

  // const option1Handler = (optionValue) => {
  //   setOption1(optionValue);
  // };

  // option2
  // const option2Option = [
  //   {
  //     label: "Resident to learn coping skills to manage anxiety, depression",
  //     value: "Resident to learn coping skills to manage anxiety, depression",
  //   },
  //   {
  //     label: "Resident to learn skills to manage time",
  //     value: "Resident to learn skills to manage time",
  //   },
  //   {
  //     label: "Resident to learn how to open a bank account",
  //     value: "Resident to learn how to open a bank account",
  //   },
  //   {
  //     label: "Resident to learn how communicate assertively",
  //     value: "Resident to learn how communicate assertively",
  //   },
  //   {
  //     label:
  //       "Resident will learn how to identify triggers and address them accordingly",
  //     value:
  //       "Resident will learn how to identify triggers and address them accordingly",
  //   },
  //   {
  //     label:
  //       "Resident will be able to schedule own transportation to and from medical/psychiatric appointments or activities",
  //     value:
  //       "Resident will be able to schedule own transportation to and from medical/psychiatric appointments or activities",
  //   },
  //   {
  //     label: "Be able to manage and budget finances",
  //     value: "Be able to manage and budget finances",
  //   },
  //   {
  //     label: "Resident to attend 100% of scheduled appointments",
  //     value: "Resident to attend 100% of scheduled appointments",
  //   },
  //   {
  //     label: "Resident will develop coping skills on how to manage stress",
  //     value: "Resident will develop coping skills on how to manage stress",
  //   },
  //   {
  //     label: "Resident will learn how to make bed",
  //     value: "Resident will learn how to make bed",
  //   },
  //   {
  //     label: "Resident will obtain drivers license ",
  //     value: "Resident will obtain drivers license ",
  //   },
  //   {
  //     label:
  //       "Resident to recognize the difference between healthy and unhealthy boundaries",
  //     value:
  //       "Resident to recognize the difference between healthy and unhealthy boundaries",
  //   },
  // ];
  const handleKeyOption2 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option2Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option2Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption2(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option2,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption2(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option2Handler = (optionValue) => {
    setOption2(optionValue);
  };

  // option3
  // const option3Option = [
  //   { label: "Resident to Create resume", value: "Resident to Create resume" },
  //   {
  //     label: "Resident will Call, email, or contact agencies for employment",
  //     value: "Resident will Call, email, or contact agencies for employment",
  //   },
  //   {
  //     label: "Resident to learn mock interview",
  //     value: "Resident to learn mock interview",
  //   },
  // ];

  const handleKeyOption3 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option3Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option3Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption3(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option3,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption3(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option3Handler = (optionValue) => {
    setOption3(optionValue);
  };
  // option4
  // const option4Option = [
  //   {
  //     label: "Resident will shower at least every other day without prompt",
  //     value: "Resident will shower at least every other day without prompt",
  //   },
  //   {
  //     label: "Resident will learn how to prepare basic meal",
  //     value: "Resident will learn how to prepare basic meal",
  //   },
  //   {
  //     label:
  //       "Resident will brush teeth at least every other day without prompt",
  //     value:
  //       "Resident will brush teeth at least every other day without prompt",
  //   },
  //   {
  //     label:
  //       "Resident will develop skills to independently do laundry, sort, wash and dry clothing.",
  //     value:
  //       "Resident will develop skills to independently do laundry, sort, wash and dry clothing.",
  //   },
  // ];

  const handleKeyOption4 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option4Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option4Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption4(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option4,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption4(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option4Handler = (optionValue) => {
    setOption4(optionValue);
  };
  // option5
  // const option5Option = [
  //   {
  //     label: "Resident will create a safety plan",
  //     value: "Resident will create a safety plan",
  //   },
  //   {
  //     label: "Resident will contract for safety",
  //     value: "Resident will contract for safety",
  //   },
  //   {
  //     label: "Resident will not elope from the facility for the next 30 days",
  //     value: "Resident will not elope from the facility for the next 30 days",
  //   },
  //   {
  //     label: "Resident will learn not to touch hot items or spark objects",
  //     value: "Resident will learn not to touch hot items or spark objects",
  //   },
  //   {
  //     label: "Resident will be aware of surroundings when going on outing",
  //     value: "Resident will be aware of surroundings when going on outing",
  //   },
  //   {
  //     label:
  //       "Resident will identify dangers that involves wondering off from the facility",
  //     value:
  //       "Resident will identify dangers that involves wondering off from the facility",
  //   },
  // ];

  const handleKeyOption5 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option5Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option5Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption5(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option5,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption5(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option5Handler = (optionValue) => {
    setOption5(optionValue);
  };
  // const option6Option = [
  //   {
  //     label: "Resident to take all prescribed medications",
  //     value: "Resident to take all prescribed medications",
  //   },
  //   {
  //     label: "Resident will learn all names of her medications",
  //     value: "Resident will learn all names of her medications",
  //   },
  //   {
  //     label:
  //       "Resident will self-administer medications with supervision without errors",
  //     value:
  //       "Resident will self-administer medications with supervision without errors",
  //   },
  //   {
  //     label: "Resident will take medications in a timely manner",
  //     value: "Resident will take medications in a timely manner",
  //   },
  //   {
  //     label:
  //       "Resident will learn how to order medication refills from the pharmacy",
  //     value:
  //       "Resident will learn how to order medication refills from the pharmacy",
  //   },
  // ];

  const handleKeyOption6 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option6Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option6Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption6(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option6,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption6(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option6Handler = (optionValue) => {
    setOption6(optionValue);
  };
  // const option7Option = [
  //   {
  //     label:
  //       "Resident to learn how to utilize coping skills to manage mental health symptoms",
  //     value:
  //       "Resident to learn how to utilize coping skills to manage mental health symptoms",
  //   },
  //   {
  //     label: "Resident to learn how to utilize EMS appropriately",
  //     value: "Resident to learn how to utilize EMS appropriately",
  //   },
  //   {
  //     label:
  //       "Resident verbalizes an understanding of diagnoses, and their impact",
  //     value:
  //       "Resident verbalizes an understanding of diagnoses, and their impact",
  //   },
  //   {
  //     label:
  //       "Resident to reduce the frequency of maladaptive behaviors, thoughts and feelings that affects quality of daily life",
  //     value:
  //       "Resident to reduce the frequency of maladaptive behaviors, thoughts and feelings that affects quality of daily life",
  //   },
  // ];

  const handleKeyOption7 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option7Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option7Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption7(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option7,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption7(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option7Handler = (optionValue) => {
    setOption7(optionValue);
  };
  // const option8Option = [
  //   {
  //     label: "Resident will attend all court appointments",
  //     value: "Resident will attend all court appointments",
  //   },
  //   {
  //     label:
  //       "Resident will attend all scheduled appointment with probation/parole officer",
  //     value:
  //       "Resident will attend all scheduled appointment with probation/parole officer",
  //   },
  // ];

  const handleKeyOption8 = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = option8Option.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...option8Option,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setOption8(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...option8,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setOption8(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const option8Handler = (optionValue) => {
    setOption8(optionValue);
  };
  const clinicalSummaryOption = [
    {
      label: "Resident to continue to attend treatment with the facility",
      value: "Resident to continue to attend treatment with the facility",
    },
    {
      label:
        "Resident to continue to attend schedule appointments with Primary Care Physician, Psychiatric provider, and specialist",
      value:
        "Resident to continue to attend schedule appointments with Primary Care Physician, Psychiatric provider, and specialist",
    },
    {
      label: "Resident will contract for safety while in the program",
      value: "Resident will contract for safety while in the program",
    },
    {
      label:
        "The mirrors in the facility are SHATTERPROOF, and if they were standard mirrors it would not present as a current safety risk to this resident.",
      value:
        "The mirrors in the facility are SHATTERPROOF, and if they were standard mirrors it would not present as a current safety risk to this resident.",
    },
  ];
  const interventionsOptions = [
    {
      label: "Psychiatric services",
      value: "Psychiatric services",
    },
    {
      label: "Communication Skills",
      value: "Communication Skills",
    },
    {
      label: "Verbal Prompt",
      value: "Verbal Prompt",
    },
    {
      label: "Interactive Feedback",
      value: "Interactive Feedback",
    },
    {
      label: "Encouragement",
      value: "Encouragement",
    },
    {
      label: "Role-Play",
      value: "Role-Play",
    },
    {
      label: "Review of Behavioral Health Treatment Plan",
      value: "Review of Behavioral Health Treatment Plan",
    },
    {
      label: "Relaxation techniques",
      value: "Relaxation techniques",
    },
    {
      label: "Reframing",
      value: "Reframing",
    },
    {
      label: "Conflict resolution",
      value: "Conflict resolution",
    },
    {
      label: "Sponsors, and support programs & people",
      value: "Sponsors, and support programs & people",
    },
    {
      label: "Rehearsal",
      value: "Rehearsal",
    },
    {
      label: "Spiritual exploration",
      value: "Spiritual exploration",
    },
    {
      label: "Values clarification",
      value: "Values clarification",
    },
    {
      label: "Psycho-education",
      value: "Psycho-education",
    },
    {
      label: "Exploring feelings",
      value: "Exploring feelings",
    },
    {
      label: "Distraction",
      value: "Distraction",
    },
    {
      label: "Redirection",
      value: "Redirection",
    },
  ];
  const handleKeyClinicalSummary = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();

      // Check if the input value already exists in the options array
      const optionExists = clinicalSummaryOption.some(
        (option) => option.value === inputValue,
      );

      // If the input value doesn't exist, add it to the array
      if (!optionExists) {
        const newOptions = [
          ...clinicalSummaryOption,
          {
            value: inputValue,
            label: inputValue,
          },
        ];

        // Update the state with the new options
        setClinicalSummary(newOptions);

        // Update the selected values to include the newly created option
        const newSelectedValues = [
          ...clinicalSummary,
          {
            value: inputValue,
            label: inputValue,
          },
        ];
        setClinicalSummary(newSelectedValues);
      }

      // Clear the input value after adding the option
      event.target.value = "";
    }
  };
  const clinicalSummaryHandler = (optionValue) => {
    setClinicalSummary(optionValue);
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
      signatureBhp?.length > 0;
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
    signatureBhp?.length,
    hasAnyPenSig,
  ]);
  useEffect(() => {
    if (id) {
      checkSign();
    }
  }, [signatureBhp, adminSignature, id, checkSign, hasAnyPenSig]);
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
      setTimeBhp(time);
    } else if (profileInfo.userType === ROLES.ADMIN) {
      setAdminSignatureTime(time);
    }
  };
  const canDelete = deletePermission(profileInfo, "tp");
  const checkFormat = (inputString) => {
    if (inputString === "") {
      return {
        isValid: true,
        error: "",
      };
    }
    const pattern = /^(\d{1,4})\/(\d{1,4})$/;
    const match = inputString.match(pattern);
    if (!/^[0-9/]+$/.test(inputString)) {
      return {
        isValid: false,
        error: "Format must be like 1/10",
      };
    }
    if (!match) {
      return {
        isValid: false,
        error: "Format must be like 1/10",
      };
    }
    const left = Number(match[1]);
    const right = Number(match[2]);
    if (right === 0) {
      return {
        isValid: false,
        error: "Total cannot be 0",
      };
    }
    if (left > right) {
      return {
        isValid: false,
        error: "Rating cannot be greater than total",
      };
    }
    return {
      isValid: true,
      error: "",
    };
  };
  const handleRatingChange = (e, setvalue, setError) => {
    let value = e.target.value;
    const result = checkFormat(value);
    setvalue(value);
    setError(result.isValid ? "" : result.error);
  };
  return {
    additionalComment,
    additionalDischargePlanning,
    addNewService,
    adls,
    adlsEditorValue,
    adlsInterventionsEditorValue,
    adlsInterventionsSelected,
    adlsObjectivesEditorValue,
    adlsObjectivesSelected,
    adlsText,
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionMeasure1,
    admissionMeasure1Error,
    admissionMeasure2,
    admissionMeasure2Error,
    admissionMeasure3,
    admissionMeasure3Error,
    admissionMeasure4,
    admissionMeasure4Error,
    admissionMeasure5,
    admissionMeasure5Error,
    admissionMeasure6,
    admissionMeasure6Error,
    admissionMeasure7,
    admissionMeasure7Error,
    admissionMeasure8,
    admissionMeasure8Error,
    admissionMeasureOther,
    admitDate,
    afterCareAndTransitionPlanning,
    ahcccsId,
    allergies,
    allPenSigsHaveNames,
    Barriers,
    barriersBoolean,
    barriersOther,
    barriersText,
    behavior,
    behavioralSymptoms,
    behavioralSymptomsBoolean,
    behavioralSymptomsOther,
    BHealth,
    bpn,
    Btext,
    canDelete,
    checkFormat,
    checkSign,
    clearAllTyped,
    clientCareCoordinationTeam,
    clinicalSummary,
    clinicalSummaryHandler,
    clinicalSummaryOption,
    commentIndividual,
    comments1,
    comments2,
    comments3,
    comments4,
    comments5,
    comments6,
    comments7,
    comments8,
    componentRef,
    consnotiveSymptoms,
    consnotiveSymptomsBoolean,
    consnotiveSymptomsOther,
    counselingOptions,
    counselingOptionsText,
    counselingOptionsTextBoolean,
    credentialsBhp,
    credentialsFacilityRep,
    credentialsResident,
    currentMeasure1,
    currentMeasure1Error,
    currentMeasure2,
    currentMeasure2Error,
    currentMeasure3,
    currentMeasure3Error,
    currentMeasure4,
    currentMeasure4Error,
    currentMeasure5,
    currentMeasure5Error,
    currentMeasure6,
    currentMeasure6Error,
    currentMeasure7,
    currentMeasure7Error,
    currentMeasure8,
    currentMeasure8Error,
    currentMeasureOther,
    currentMedications,
    date,
    dateBhp,
    dateFacilityRep,
    dateResident,
    desiredMeasure,
    diagnosis,
    diagonsis,
    dischargePlanDate,
    dischargePlanning,
    dischargePlanningOther,
    dob,
    dynamicServices,
    editDateHandler,
    editorValue,
    editSignHandler,
    editTimeHandler,
    employmentEditorValue,
    employmentInterventionsEditorValue,
    employmentInterventionsSelected,
    employmentObjectivesEditorValue,
    employmentObjectivesSelected,
    estimatedDateOfCompletion1,
    estimatedDateOfCompletion2,
    estimatedDateOfCompletion3,
    estimatedDateOfCompletion4,
    estimatedDateOfCompletion5,
    estimatedDateOfCompletion6,
    estimatedDateOfCompletion7,
    estimatedDateOfCompletion8,
    estimatedDateOfCompletionOther,
    fallRiskComment,
    FREQUENCY_AS_NEEDED,
    FREQUENCY_DAILY,
    FREQUENCY_MONTHLY,
    FREQUENCY_WEEKLY,
    getApiData,
    guardian,
    guardTyped,
    handleAddButtonClick,
    handleChange,
    handleCheckboxChange,
    handleCheckboxChangeafterCareAndTransitionPlanning,
    handleCheckboxChangeBarrier,
    handleCheckboxChangeBehavioral,
    handleCheckboxChangeCognitive,
    handleCheckboxChangeCounsiling,
    handleCheckboxChangeMentalHealth,
    handleCheckboxChangeMind,
    handleCheckboxChangePhysical,
    handleCheckboxChangePsychosocial,
    handleCheckboxChangerecommendationsForFurtherPrograms,
    handleCheckboxChanges,
    handleCheckboxChangeSupportSystem,
    handleDelete,
    handleKeyClinicalSummary,
    handleKeyOption2,
    handleKeyOption3,
    handleKeyOption4,
    handleKeyOption5,
    handleKeyOption6,
    handleKeyOption7,
    handleKeyOption8,
    handleKeyPresentingPrice,
    handleKeyStrengths,
    handlePost,
    handlePrint,
    handlePrint2,
    handleRatingChange,
    hasAnyPenSig,
    hasTypedInForm,
    hoursFormat,
    id,
    independentEditorValue,
    independentInterventionsEditorValue,
    independentInterventionsSelected,
    independentObjectivesEditorValue,
    independentObjectivesSelected,
    individualTherapy,
    initialServices,
    initialUpdate,
    interventions,
    interventions1,
    interventions1Option,
    interventions2,
    interventions2Option,
    interventions3,
    interventions3Option,
    interventions4,
    interventions4Option,
    interventions5,
    interventions5Option,
    interventions6,
    interventions6Option,
    interventions7,
    interventions7Option,
    interventions8,
    interventions8Option,
    interventionsImplemented,
    interventionsImplementedBoolean,
    interventionsImplementedOther,
    interventionsOption,
    interventionsOptions,
    isAdditionalDischargePlanningChecked,
    isFallRisk,
    isMeasureMet1,
    isMeasureMet2,
    isMeasureMet3,
    isMeasureMet4,
    isMeasureMet5,
    isMeasureMet6,
    isMeasureMet7,
    isMeasureMet8,
    isMeasureMetOther,
    isNotEditableWithSigner,
    isReason,
    isRequiresAssistance,
    isSubmitEnabled,
    legalEditorValue,
    legalHealthInterventionsSelected,
    legalInterventionsEditorValue,
    legalObjectivesEditorValue,
    legalObjectivesSelected,
    loading,
    loadSignaturesFromApi,
    medicationAdministation,
    medicationAssistance,
    medicationEditorValue,
    medicationEducationInterventionsEditorValue,
    medicationInterventionsSelected,
    medicationObjectivesEditorValue,
    medicationObjectivesSelected,
    mendelHealth,
    mentalHealthEditorValue,
    mentalHealthInterventionsEditorValue,
    mentalHealthInterventionsSelected,
    mentalHealthObjectivesEditorValue,
    mentalHealthObjectivesSelected,
    mentelText,
    mind,
    mindText,
    minimumHoure,
    nameBhp,
    nameFacilityRep,
    nameResident,
    navigate,
    nutritionAndWellnessPlanning,
    objective1Option,
    objective2Option,
    objective3Option,
    objective4Option,
    objective5Option,
    objective6Option,
    objective7Option,
    objective8Option,
    objectiveOther,
    option1,
    option1Boolean,
    option1Option,
    option1Other,
    option2,
    option2Handler,
    option2Option,
    option3,
    option3Handler,
    option3Option,
    option4,
    option4Handler,
    option4Option,
    option5,
    option5Handler,
    option5Option,
    option6,
    option6Handler,
    option6Option,
    option7,
    option7Handler,
    option7Option,
    option8,
    option8Handler,
    option8Option,
    optionOther,
    otherArray,
    otherIndividual,
    otherObjectives,
    patientDetail,
    patientId,
    personalFinances,
    personalFinancesComment,
    physicalService,
    physicalSymptoms,
    physicalSymptomsBoolean,
    physicalSymptomsOther,
    presentingPrice,
    presentingPriceHandler,
    presentingPriceOption,
    previousMeasure1,
    previousMeasure2,
    previousMeasure3,
    previousMeasure4,
    previousMeasure5,
    previousMeasure6,
    previousMeasure7,
    previousMeasure8,
    primaryCare,
    primaryCareProviderContact,
    primaryCareProviderAddress,
    psychiatricProvider,
    psychiatricProviderContact,
    psychiatricProviderAddress,
    profileInfo,
    psychosocialSymptoms,
    psychosocialSymptomsBoolean,
    psychosocialSymptomssOther,
    readinessDischarge,
    recommendationsForFurtherPrograms,
    recommendationsForFurtherProgramsBoolean,
    recommendationsForFurtherProgramsOther,
    recommendationToExtendResidentialTreatment,
    refusalReason,
    religiousPreference,
    religiousPreferenceText,
    removeDynamicService,
    resident,
    residentAttitute,
    residentAttituteOtherText,
    residentGoal,
    residentName,
    residentParticipation,
    residentParticipationOtherText,
    residentProgress,
    residentProgressOtherText,
    safetyEditorValue,
    safetyInterventionsEditorValue,
    safetyInterventionsSelected,
    safetyObjectivesEditorValue,
    safetyObjectivesSelected,
    saveAsDrafIsNotEditable,
    saveAsDrafIsNotEditableWithoutSigner,
    services,
    setAdditionalComment,
    setAdditionalDischargePlanning,
    setAdls,
    setAdlsEditorValue,
    setAdlsInterventionsEditorValue,
    setAdlsInterventionsSelected,
    setAdlsObjectivesEditorValue,
    setAdlsObjectivesSelected,
    setAdminDate,
    setAdminSignature,
    setAdminSignatureDate,
    setAdminSignatureTime,
    setAdmissionMeasure1,
    setAdmissionMeasure1Error,
    setAdmissionMeasure2,
    setAdmissionMeasure2Error,
    setAdmissionMeasure3,
    setAdmissionMeasure3Error,
    setAdmissionMeasure4,
    setAdmissionMeasure4Error,
    setAdmissionMeasure5,
    setAdmissionMeasure5Error,
    setAdmissionMeasure6,
    setAdmissionMeasure6Error,
    setAdmissionMeasure7,
    setAdmissionMeasure7Error,
    setAdmissionMeasure8,
    setAdmissionMeasure8Error,
    setAdmissionMeasureOther,
    setAfterCareAndTransitionPlanning,
    setAhcccsId,
    setAldsText,
    setAllergies,
    setBarriers,
    setBarriersBoolean,
    setBarriersOther,
    setBarriersText,
    setBehavior,
    setBehavioralSymptoms,
    setBehavioralSymptomsBoolean,
    setBehavioralSymptomsOther,
    setBHealth,
    setBph,
    setBtext,
    setClientCareCoordinationTeam,
    setClinicalSummary,
    setComment1,
    setComment2,
    setComment3,
    setComment4,
    setComment5,
    setComment6,
    setComment7,
    setComment8,
    setCommentIndividual,
    setConsnotiveSymptoms,
    setConsnotiveSymptomsBoolean,
    setConsnotiveSymptomsOther,
    setCounselingOptions,
    setCounselingOptionsOther,
    setCounselingOptionsTextBoolean,
    setCredentialsBhp,
    setCredentialsFacilityRep,
    setCredentialsResident,
    setCurrentMeasure1,
    setCurrentMeasure1Error,
    setCurrentMeasure2,
    setCurrentMeasure2Error,
    setCurrentMeasure3,
    setCurrentMeasure3Error,
    setCurrentMeasure4,
    setCurrentMeasure4Error,
    setCurrentMeasure5,
    setCurrentMeasure5Error,
    setCurrentMeasure6,
    setCurrentMeasure6Error,
    setCurrentMeasure7,
    setCurrentMeasure7Error,
    setCurrentMeasure8,
    setCurrentMeasure8Error,
    setCurrentMeasureOther,
    setCurrentMedications,
    setDate,
    setDateBhp,
    setDateFacilityRep,
    setDateResident,
    setDesiredMeasure,
    setDiagnosis,
    setDiagonsis,
    setDischargePlanDate,
    setDischargePlanning,
    setDischargePlanningOther,
    setDob,
    setDynamicServices,
    setEditorValue,
    setEmploymentEditorValue,
    setEmploymentInterventionsEditorValue,
    setEmploymentInterventionsSelected,
    setEmploymentObjectivesEditorValue,
    setEmploymentObjectivesSelected,
    setEstimatedDateOfCompletion1,
    setEstimatedDateOfCompletion2,
    setEstimatedDateOfCompletion3,
    setEstimatedDateOfCompletion4,
    setEstimatedDateOfCompletion5,
    setEstimatedDateOfCompletion6,
    setEstimatedDateOfCompletion7,
    setEstimatedDateOfCompletion8,
    setEstimatedDateOfCompletionOther,
    setFallRiskComment,
    setGetApiData,
    setGuardian,
    setIndependentEditorValue,
    setIndependentInterventionsEditorValue,
    setIndependentInterventionsSelected,
    setIndependentObjectivesEditorValue,
    setIndependentObjectivesSelected,
    setIndividualTherapy,
    setInitialUpdate,
    setInterventions,
    setInterventions1,
    setInterventions1Option,
    setInterventions2,
    setInterventions2Option,
    setInterventions3,
    setInterventions3Option,
    setInterventions4,
    setInterventions4Option,
    setInterventions5,
    setInterventions5Option,
    setInterventions6,
    setInterventions6Option,
    setInterventions7,
    setInterventions7Option,
    setInterventions8,
    setInterventions8Option,
    setInterventionsImplemented,
    setInterventionsImplementedBoolean,
    setInterventionsImplementedOther,
    setIsAdditionalDischargePlanningChecked,
    setIsFallRisk,
    setIsMeasureMet1,
    setIsMeasureMet2,
    setIsMeasureMet3,
    setIsMeasureMet4,
    setIsMeasureMet5,
    setIsMeasureMet6,
    setIsMeasureMet7,
    setIsMeasureMet8,
    setIsMeasureMetOther,
    setIsNotEditableWithSigner,
    setIsReason,
    setIsRequiresAssistance,
    bhServicesLimitsFunctioning,
    setBhServicesLimitsFunctioning,
    setIsSubmitEnabled,
    setLegalEditorValue,
    setLegalHealthInterventionsSelected,
    setLegalInterventionsEditorValue,
    setLegalObjectivesEditorValue,
    setLegalObjectivesSelected,
    setLoading,
    setMedicationAdministation,
    setMedicationAssistence,
    setMedicationEditorValue,
    setMedicationEducationInterventionsEditorValue,
    setMedicationInterventionsSelected,
    setMedicationObjectivesEditorValue,
    setMedicationObjectivesSelected,
    setMentalHealthEditorValue,
    setMentalHealthInterventionsEditorValue,
    setMentalHealthInterventionsSelected,
    setMentalHealthObjectivesEditorValue,
    setMentalHealthObjectivesSelected,
    setMentelHealth,
    setMentelText,
    setMind,
    setMindText,
    setMinimumHoure,
    setNameBhp,
    setNameFacilityRep,
    setNameResident,
    setNutritionAndWellnessPlanning,
    setObjective1Option,
    setObjective2Option,
    setObjective3Option,
    setObjective4Option,
    setObjective5Option,
    setObjective6Option,
    setObjective7Option,
    setObjective8Option,
    setObjectiveOther,
    setOption1,
    setOption1Boolean,
    setOption1Option,
    setoption1Other,
    setOption2,
    setOption2Option,
    setOption3,
    setOption3Option,
    setOption4,
    setOption4Option,
    setOption5,
    setOption5Option,
    setOption6,
    setOption6Option,
    setOption7,
    setOption7Option,
    setOption8,
    setOption8Option,
    setOptionOther,
    setOtherArray,
    setOtherIndividual,
    setOtherObjectives,
    setPatientDetail,
    setPatientId,
    setPersonalFinances,
    setPersonalFinancesComment,
    setPhysicalService,
    setPhysicalSymptoms,
    setPhysicalSymptomsBoolean,
    setPhysicalSymptomsOther,
    setPresentingPrice,
    setPreviousMeasure1,
    setPreviousMeasure2,
    setPreviousMeasure3,
    setPreviousMeasure4,
    setPreviousMeasure5,
    setPreviousMeasure6,
    setPreviousMeasure7,
    setPreviousMeasure8,
    setPrimaryCare,
    setPrimaryCareProviderContact,
    setPrimaryCareProviderAddress,
    setPsychiatricProvider,
    setPsychiatricProviderContact,
    setPsychiatricProviderAddress,
    setPsychosocialSymptoms,
    setPsychosocialSymptomsBoolean,
    setPsychosocialSymptomsOther,
    setReadinessDischarge,
    setRecommendationsForFurtherPrograms,
    setrecommendationsForFurtherProgramsBoolean,
    setRecommendationsForFurtherProgramsOther,
    setRecommendationToExtendResidentialTreatment,
    setrefusalReason,
    setreligiousPreference,
    setReligiousPreferenceText,
    setResident,
    setResidentAttitute,
    setResidentAttituteOtherText,
    setResidentGoal,
    setResidentName,
    setResidentParticipation,
    setResidentParticipationOtherText,
    setResidentProgress,
    setResidentProgressOtherText,
    setSafetyEditorValue,
    setSafetyInterventionsEditorValue,
    setSafetyInterventionsSelected,
    setSafetyObjectivesEditorValue,
    setSafetyObjectivesSelected,
    setSaveAsDrafIsNotEditable,
    setSaveAsDrafIsNotEditableWithoutSigner,
    setServiceData,
    setServices,
    setShowOther,
    setsignatureBhp,
    setsignatureFacilityRep,
    setSignatureModel3,
    setsignatureResident,
    setSignerDate,
    setSigners,
    setSignerSignature,
    setSignerTime,
    setSobrietyEditorValue,
    setSobrietyInterventionsEditorValue,
    setSobrietyInterventionsSelected,
    setSobrietyObjectivesEditorValue,
    setSobrietyObjectivesSelected,
    setStaff,
    setStrengths,
    setSupportSystem,
    setSupportSystemOtherText,
    setSupportSystemOtherTextBoolean,
    setSupportSystemPhoneNumber,
    setTextData,
    setTimeBhp,
    setTimeFacality,
    setTimeResident,
    setTreatmentPlanReviewDate,
    setTriggers,
    setUser,
    setUserId,
    setVerbalConsentResidentRepresentative,
    showOther,
    signatureBhp,
    signatureFacilityRep,
    signatureModel3,
    signatureResident,
    signatures,
    signerIndex,
    signers,
    sobrietyEditorValue,
    sobrietyInterventionsEditorValue,
    sobrietyInterventionsSelected,
    sobrietyObjectivesEditorValue,
    sobrietyObjectivesSelected,
    staff,
    strengths,
    strengthsHandler,
    strengthsOption,
    supportSystem,
    supportSystemOtherText,
    supportSystemOtherTextBoolean,
    supportSystemPhoneNumber,
    textData,
    timeBhp,
    timeFacality,
    timeResident,
    treatmentPlanReviewDate,
    Triggers,
    typedGuardDialog,
    updateDynamicService,
    updateFixedService,
    updateSignature,
    url,
    user,
    userId,
    verbalConsentResidentRepresentative,
    witnessIncomplete,
    witnessNamePresent,
    witnessSigPresent,
  };
}

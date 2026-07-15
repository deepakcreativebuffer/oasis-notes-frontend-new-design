/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { residentService } from "@/features/shared/services/index";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
} from "react-bootstrap";
import {
  AddSignature,
  checkAnyValue,
  extractParagraphText,
  signatureFormat,
} from "@/utils/utils";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { intakeService } from "@/features/shared/services/index";
import { BorderlessInput } from "@/utils/Makers";
import { FIXED_SERVICES } from "@/features/shared/constants";
import ResidentPrintSignature from "@/features/shared/ui/ResidentPrintSignature/ResidentPrintSignature";
import ReactQuill from "react-quill";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
import SignatureNamesPanel from "@/features/shared/ui/SignaturePadModal/SignatureNamesPanel";
import useSignatures from "@/features/shared/ui/SignaturePadModal/useSignatures";
import useTypedGuard from "@/features/shared/ui/SignaturePadModal/useTypedGuard";
import SafeHtml from "@/features/shared/ui/common/SafeHtml";
import { ROLES } from "@/features/shared/constants/index";
import { EMPLOYEE_APIS } from "@/features/shared/services/index";

export function useTreatmentPlanUpdateForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showSignatureResident, setShowSignatureResident] = useState(false);
  const [signers, setSigners] = useState([]);
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const [desiredMeasure, setDesiredMeasure] = useState("");
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
  const [fallRiskComment, setFallRiskComment] = useState("");
  const [getApiData, setGetApiData] = useState("");
  const componentRef = React.useRef();

  // model data
  const [draftModel, setDraftModel] = useState(false);
  const [signatureModel3, setSignatureModel3] = useState(false);

  //user Detail
  const [user, setUser] = useState("");
  const [filedForm, setFiledForm] = useState("");
  const navigate = useNavigate();

  //from satart now ------------------------------->
  const [saveAsDraft, setSaveAsDraft] = useState(false);
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
  const [userId, setUserId] = useState("");
  const [initialUpdate, setInitialUpdate] = useState("");
  const [residentName, setResidentName] = useState("");
  const [dob, setDob] = useState("");
  const [date, setDate] = useState("");
  const [admitDate, setAdminDate] = useState("");
  const [ahcccsId, setAhcccsId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  // care services
  const [physicalService, setPhysicalService] = useState("");
  const [behavior, setBehavior] = useState("");
  //medication service
  const [medicationAdministation, setMedicationAdministation] = useState("");
  const [medicationAssistance, setMedicationAssistence] = useState("");
  const [presentingPrice, setPresentingPrice] = useState([]);

  // diagonsis
  const [diagonsis, setDiagonsis] = useState("");

  // Mental Status
  const [mendelHealth, setMentelHealth] = useState("");
  const [mentelText, setMentelText] = useState("");
  //Mood Level:
  const [mind, setMind] = useState("");
  const [mindText, setMindText] = useState("");
  //ADLS
  const [adls, setAdls] = useState("");
  const [adlsText, setAldsText] = useState("");
  //Behavioral Health Services:
  const [BHealth, setBHealth] = useState("");
  const [Btext, setBtext] = useState("");
  //Primary Care Provider:
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

  //Resident Goals
  const [residentGoal, setResidentGoal] = useState("");
  const [allergies, setAllergies] = useState("");
  const [Triggers, setTriggers] = useState("");
  const [strengths, setStrengths] = useState([]);
  const [Barriers, setBarriers] = useState([]);
  const [barriersOther, setBarriersOther] = useState([]);
  const [barriersBoolean, setBarriersBoolean] = useState(false);
  const [barriersText, setBarriersText] = useState("");
  // Risk Assessment / Warning Signs & Symptoms of Suicidal Ideations
  const [behavioralSymptoms, setBehavioralSymptoms] = useState([]);
  const [behavioralSymptomsBoolean, setBehavioralSymptomsBoolean] =
    useState(false);
  const [behavioralSymptomsOther, setBehavioralSymptomsOther] = useState("");
  const [physicalSymptoms, setPhysicalSymptoms] = useState([]);
  const [physicalSymptomsBoolean, setPhysicalSymptomsBoolean] = useState(false);
  const [physicalSymptomsOther, setPhysicalSymptomsOther] = useState("");
  const [consnotiveSymptoms, setConsnotiveSymptoms] = useState([]);
  const [consnotiveSymptomsBoolean, setConsnotiveSymptomsBoolean] =
    useState(false);
  const [consnotiveSymptomsOther, setConsnotiveSymptomsOther] = useState("");
  const [psychosocialSymptoms, setPsychosocialSymptoms] = useState([]);
  const [psychosocialSymptomsBoolean, setPsychosocialSymptomsBoolean] =
    useState(false);
  const [psychosocialSymptomssOther, setPsychosocialSymptomsOther] =
    useState("");
  const [interventionsImplemented, setInterventionsImplemented] = useState([]);
  const [interventionsImplementedBoolean, setInterventionsImplementedBoolean] =
    useState(false);
  const [interventionsImplementedOther, setInterventionsImplementedOther] =
    useState("");
  const [counselingOptions, setCounselingOptions] = useState([]);
  const [counselingOptionsText, setCounselingOptionsOther] = useState("");
  const [counselingOptionsTextBoolean, setCounselingOptionsTextBoolean] =
    useState(false);
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
  const [supportSystem, setSupportSystem] = useState([]);
  const [supportSystemOtherText, setSupportSystemOtherText] = useState("");
  const [supportSystemOtherTextBoolean, setSupportSystemOtherTextBoolean] =
    useState(false);
  useEffect(() => {
    const checkAndSet = (array, setBoolean, setOther) => {
      const hasOther = array?.includes("Other");
      setBoolean(hasOther);
      if (!hasOther) setOther("");
    };
    checkAndSet(
      behavioralSymptoms,
      setBehavioralSymptomsBoolean,
      setBehavioralSymptomsOther,
    );
    checkAndSet(
      physicalSymptoms,
      setPhysicalSymptomsBoolean,
      setPhysicalSymptomsOther,
    );
    checkAndSet(
      consnotiveSymptoms,
      setConsnotiveSymptomsBoolean,
      setConsnotiveSymptomsOther,
    );
    checkAndSet(
      psychosocialSymptoms,
      setPsychosocialSymptomsBoolean,
      setPsychosocialSymptomsOther,
    );
    // checkAndSet(interventionsImplemented, setInterventionsImplementedBoolean, setInterventionsImplementedOther);
    checkAndSet(
      recommendationsForFurtherPrograms,
      setrecommendationsForFurtherProgramsBoolean,
      setRecommendationsForFurtherProgramsOther,
    );
    setCounselingOptionsTextBoolean(counselingOptions.includes("Other"));
    setSupportSystemOtherTextBoolean(supportSystem.includes("Other"));
  }, [
    behavioralSymptoms,
    consnotiveSymptoms,
    counselingOptions,
    // interventionsImplemented,
    physicalSymptoms,
    psychosocialSymptoms,
    recommendationsForFurtherPrograms,
    supportSystem,
  ]);

  // Counseling and Frequency : Total of minimum Blank ___hours daily
  const [minimumHoure, setMinimumHoure] = useState("");
  const [IndividualComment, setIndividualComment] = useState("");

  //Goals for Changes in the Resident psychosocial  Interaction or Behaviour
  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  const [option4, setOption4] = useState([]);
  const [option5, setOption5] = useState([]);
  const [option6, setOption6] = useState([]);
  const [option7, setOption7] = useState([]);
  const [option8, setOption8] = useState([]);

  //option1
  const [sobrietyEditorValue, setSobrietyEditorValue] = useState("");
  const [sobrietyObjectivesEditorValue, setSobrietyObjectivesEditorValue] =
    useState("");
  const [
    sobrietyInterventionsEditorValue,
    setSobrietyInterventionsEditorValue,
  ] = useState("");
  const [admissionMeasure1, setAdmissionMeasure1] = useState("");
  const [currentMeasure1, setCurrentMeasure1] = useState("");
  const [estimatedDateOfCompletion1, setEstimatedDateOfCompletion1] =
    useState("");
  const [comments1, setComment1] = useState("");
  const [isMeasureMet1, setIsMeasureMet1] = useState(null);
  // option3
  const [independentEditorValue, setIndependentEditorValue] = useState("");
  const [
    independentObjectivesEditorValue,
    setIndependentObjectivesEditorValue,
  ] = useState("");
  const [
    independentInterventionsEditorValue,
    setIndependentInterventionsEditorValue,
  ] = useState("");
  const [admissionMeasure2, setAdmissionMeasure2] = useState("");
  const [currentMeasure2, setCurrentMeasure2] = useState("");
  const [estimatedDateOfCompletion2, setEstimatedDateOfCompletion2] =
    useState("");
  const [comments2, setComment2] = useState("");
  const [isMeasureMet2, setIsMeasureMet2] = useState(null);

  // option 42
  const [employmentEditorValue, setEmploymentEditorValue] = useState("");
  const [employmentObjectivesEditorValue, setEmploymentObjectivesEditorValue] =
    useState("");
  const [
    employmentInterventionsEditorValue,
    setEmploymentInterventionsEditorValue,
  ] = useState("");
  const [admissionMeasure3, setAdmissionMeasure3] = useState("");
  const [currentMeasure3, setCurrentMeasure3] = useState("");
  const [estimatedDateOfCompletion3, setEstimatedDateOfCompletion3] =
    useState("");
  const [comments3, setComment3] = useState("");
  const [isMeasureMet3, setIsMeasureMet3] = useState(null);

  //option4
  const [adlsEditorValue, setAdlsEditorValue] = useState("");
  const [adlsObjectivesEditorValue, setAdlsObjectivesEditorValue] =
    useState("");
  const [adlsInterventionsEditorValue, setAdlsInterventionsEditorValue] =
    useState("");
  const [admissionMeasure4, setAdmissionMeasure4] = useState("");
  const [currentMeasure4, setCurrentMeasure4] = useState("");
  const [estimatedDateOfCompletion4, setEstimatedDateOfCompletion4] =
    useState("");
  const [comments4, setComment4] = useState("");
  const [isMeasureMet4, setIsMeasureMet4] = useState(null);

  //option5
  const [safetyEditorValue, setSafetyEditorValue] = useState("");
  const [safetyObjectivesEditorValue, setSafetyObjectivesEditorValue] =
    useState("");
  const [safetyInterventionsEditorValue, setSafetyInterventionsEditorValue] =
    useState("");
  const [admissionMeasure5, setAdmissionMeasure5] = useState("");
  const [currentMeasure5, setCurrentMeasure5] = useState("");
  const [estimatedDateOfCompletion5, setEstimatedDateOfCompletion5] =
    useState("");
  const [comments5, setComment5] = useState("");
  const [isMeasureMet5, setIsMeasureMet5] = useState(null);

  //option 65
  const [medicationEditorValue, setMedicationEditorValue] = useState("");
  const [medicationObjectivesEditorValue, setMedicationObjectivesEditorValue] =
    useState("");
  const [
    medicationInterventionsEditorValue,
    setMedicationInterventionsEditorValue,
  ] = useState("");
  const [admissionMeasure6, setAdmissionMeasure6] = useState("");
  const [currentMeasure6, setCurrentMeasure6] = useState("");
  const [estimatedDateOfCompletion6, setEstimatedDateOfCompletion6] =
    useState("");
  const [comments6, setComment6] = useState("");
  const [isMeasureMet6, setIsMeasureMet6] = useState(null);

  //option7
  const [mentalHealthEditorValue, setMentalHealthEditorValue] = useState("");
  const [
    mentalHealthObjectivesEditorValue,
    setMentalHealthObjectivesEditorValue,
  ] = useState("");
  const [
    mentalHealthInterventionsEditorValue,
    setMentalHealthInterventionsEditorValue,
  ] = useState("");
  const [admissionMeasure7, setAdmissionMeasure7] = useState("");
  const [currentMeasure7, setCurrentMeasure7] = useState("");
  const [estimatedDateOfCompletion7, setEstimatedDateOfCompletion7] =
    useState("");
  const [comments7, setComment7] = useState("");
  const [isMeasureMet7, setIsMeasureMet7] = useState(null);

  //option 876
  const [legalEditorValue, setLegalEditorValue] = useState("");
  const [legalObjectivesEditorValue, setLegalObjectivesEditorValue] =
    useState("");
  const [
    legalHealthInterventionsEditorValue,
    setLegalHealthInterventionsEditorValue,
  ] = useState("");
  const [admissionMeasure8, setAdmissionMeasure8] = useState("");
  const [currentMeasure8, setCurrentMeasure8] = useState("");
  const [estimatedDateOfCompletion8, setEstimatedDateOfCompletion8] =
    useState("");
  const [comments8, setComment8] = useState("");
  const [isMeasureMet8, setIsMeasureMet8] = useState(null);

  //other array add add on array
  const [otherArray, setOtherArray] = useState([]);
  // Event handler for removing an item from the array

  //Resident overall participation in treatment: other statement is not add
  const [residentParticipation, setResidentParticipation] = useState("");
  const [residentAttitute, setResidentAttitute] = useState("");
  const [residentProgress, setResidentProgress] = useState("");
  const [supportSystemPhoneNumber, setSupportSystemPhoneNumber] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [religiousPreference, setreligiousPreference] = useState("");
  const [religiousPreferenceText, setReligiousPreferenceText] = useState("");
  const [nutritionAndWellnessPlanning, setNutritionAndWellnessPlanning] =
    useState([]);
  const [
    recommendationToExtendResidentialTreatment,
    setRecommendationToExtendResidentialTreatment,
  ] = useState("");
  const [personalFinances, setPersonalFinances] = useState(false);
  const [personalFinancesComment, setPersonalFinancesComment] = useState("");
  const [dischargePlanning, setDischargePlanning] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [maintainSobrietyObjective, setMaintainSobrietyObjective] = useState(
    [],
  );
  const [
    independentLivingSkillsObjective,
    setIndependentLivingSkillsObjective,
  ] = useState([]);
  const [employmentObjective, setEmploymentObjective] = useState([]);
  const [adlsSecondObjective, setAdlsSecondObjective] = useState([]);
  const [safetyObjective, setSafetyObjective] = useState([]);
  const [medicationEducationObjective, setMedicationEducationObjective] =
    useState([]);
  const [managingMentalHealthObjective, setManagingMentalHealthObjective] =
    useState([]);
  const [legalObjective, setLegalObjective] = useState([]);
  const [afterCareAndTransitionPlanning, setAfterCareAndTransitionPlanning] =
    useState([]);

  //theory input
  const [textData, setTextData] = useState("");

  //Clinical Summary/Recommendations/Intervention:
  const [clinicalSummary, setClinicalSummary] = useState([]);
  const [treatmentPlanReviewDate, setTreatmentPlanReviewDate] = useState("");
  const [dischargePlanDate, setDischargePlanDate] = useState("");
  //Individual Participating in Developing the Service Plan
  const [resident, setResident] = useState("");
  const [guardian, setGuardian] = useState("");
  const [staff, setStaff] = useState("");
  const [bpn, setBph] = useState("");
  const [otherIndividual, setOtherIndividual] = useState("");
  const [commentIndividual, setCommentIndividual] = useState("");
  //isReason
  const [isReason, setIsReason] = useState("");
  const [
    verbalConsentResidentRepresentative,
    setVerbalConsentResidentRepresentative,
  ] = useState("");
  const [refusalReason, setrefusalReason] = useState("");
  //signaturesResident
  const [nameResident, setNameResident] = useState("");
  const [credentialsResident, setCredentialsResident] = useState("");
  const [signatureResident, setsignatureResident] = useState("");
  const [dateResident, setDateResident] = useState("");
  const [timeResident, setTimeResident] = useState("");
  // "signaturesFacilityRep"
  const [nameFacilityRep, setNameFacilityRep] = useState("");
  const [credentialsFacilityRep, setCredentialsFacilityRep] = useState("");
  const [signatureFacilityRep, setsignatureFacilityRep] = useState("");
  const [dateFacilityRep, setDateFacilityRep] = useState("");
  const [timeFacality, setTimeFacality] = useState("");
  //signaturesBhp"
  const [nameBhp, setNameBhp] = useState("");
  const [credentialsBhp, setCredentialsBhp] = useState("");
  const [signatureBhp, setsignatureBhp] = useState("");
  const [dateBhp, setDateBhp] = useState("");
  const [timeBhp, setTimeBhp] = useState("");
  const hasTypedInForm = !!signatureBhp || !!adminSignature;
  const clearAllTyped = () => {
    setsignatureBhp("");
    setDateBhp("");
    setTimeBhp("");
    setAdminSignature("");
    setAdminSignatureDate("");
    setAdminSignatureTime("");
  };
  const [readinessDischarge, setReadinessDischarge] = useState("");
  const [
    isAdditionalDischargePlanningChecked,
    setIsAdditionalDischargePlanningChecked,
  ] = useState(null);
  const [clientCareCoordinationTeam, setClientCareCoordinationTeam] =
    useState("");
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
  const [services, setServices] = useState(initialServices);
  const setServiceData = (servicesData) => {
    const processedServices = servicesData
      ?.filter(
        (data) =>
          data.daily.length > 0 ||
          data.monthly.length > 0 ||
          data.weekly.length > 0 ||
          data.asNeeded.length > 0 ||
          data?.additionalNotes,
      )
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
    setServices(processedServices);
  };
  useEffect(() => {
    if (getApiData) {
      setInitialUpdate(getApiData?.initialUpdate);
      if (profile.userType === ROLES.EMPLOYEE) {
        setResidentName(
          `${getApiData?.patientId?.firstName} ${getApiData?.patientId?.lastName}`,
        );
      } else {
        setResidentName(`${profile?.firstName} ${profile?.lastName}`);
      }
      setResidentProgressOtherText(getApiData?.residentProgressOtherText || "");
      setResidentAttituteOtherText(getApiData?.residentAttituteOtherText || "");
      setResidentParticipationOtherText(
        getApiData?.residentParticipationOtherText || "",
      );
      setIsRequiresAssistance(getApiData?.isRequiresAssistance || null);
      setBhServicesLimitsFunctioning(
        getApiData?.bhServicesLimitsFunctioning || null,
      );
      setIsFallRisk(getApiData?.isFallRisk);
      setFallRiskComment(getApiData?.fallRiskComment || "");
      setDate(getApiData?.date ? getApiData?.date?.slice(0, 10) : "");
      setAdminDate(
        profile?.dateOfBirth ||
          user?.data?.dateOfBirth ||
          getApiData?.data?.patientId?.dateOfBirth ||
          getApiData?.patientId?.dateOfBirth,
      );
      setAdminDate(
        profile?.admitDate ||
          user?.data?.admitDate ||
          getApiData?.data?.patientId?.admitDate ||
          getApiData?.patientId?.admitDate,
      );
      setAhcccsId(
        profile?.ahcccsId ||
          user?.data?.ahcccsId ||
          getApiData?.data?.patientId?.ahcccsId ||
          getApiData?.patientId?.ahcccsId,
      );
      setDiagnosis(
        profile?.diagnosis ||
          user?.data?.diagnosis ||
          getApiData?.data?.patientId?.diagnosis ||
          getApiData?.patientId?.diagnosis,
      );
      setPhysicalService(getApiData?.care ? getApiData?.care?.[0] : "");
      setBehavior(getApiData?.care ? getApiData?.care?.[1] : "");

      // Resetting medication service state variables
      setMedicationAdministation(
        getApiData?.medicationService ? getApiData?.medicationService?.[0] : "",
      );
      setMedicationAssistence(
        getApiData?.medicationService ? getApiData?.medicationService?.[1] : "",
      );
      setPresentingPrice(
        getApiData?.patientId?.presentingProblems?.map((item) => ({
          label: item,
          value: item,
        })) || [],
      );
      setPersonalFinancesComment(getApiData?.personalFinancesComment || "");

      // Resetting mental status state variables
      setMentelHealth(getApiData?.mentalStatus);
      setMentelText(getApiData?.mentalStatusOther);

      // Resetting mood level state variables
      setMind(getApiData?.moodLevel);
      setMindText(getApiData?.moodLevelOther);

      // Resetting ADLS state variables
      setAdls(getApiData?.adls);
      setAldsText(getApiData?.adlsText);

      // Resetting behavioral health services state variables
      setBHealth(getApiData?.behavioralHealthServices);
      setBtext(getApiData?.behavioralHealthServicesOther);

      // Resetting primary care provider state variables
      setPrimaryCare(getApiData?.primaryCareProvider);
      setPrimaryCareProviderContact(getApiData?.primaryCareProviderContact);
      setPrimaryCareProviderAddress(getApiData?.primaryCareProviderAddress);

      setPsychiatricProvider(getApiData?.psychiatricProvider);
      setPsychiatricProviderContact(getApiData?.psychiatricProviderContact);
      setPsychiatricProviderAddress(getApiData?.psychiatricProviderAddress);

      // Resetting resident goals state variables
      setResidentGoal(getApiData?.residentGoals);
      setAllergies(getApiData?.allergies);
      setTriggers(getApiData?.triggers);
      setStrengths(
        getApiData?.strengths
          ? getApiData.strengths.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );

      // Resetting barriers state variables
      // setBarriers(
      //   getApiData?.barriers
      //     ? getApiData.barriers.map((item) => ({
      //       label: item,
      //       value: item,
      //     }))
      //     : []
      // );
      setBarriers(getApiData?.patientId?.stepDownBarriers || []);
      setBarriersBoolean(
        getApiData?.patientId?.stepDownBarriers?.includes("Other") || false,
      );
      setBarriersOther(getApiData?.patientId?.stepDownBarriersOther || "");
      setBarriersText(getApiData?.patientId?.stepDownBarriersText || "");
      // Resetting risk assessment state variables
      setBehavioralSymptoms(
        getApiData?.riskAssessment?.behavioralSymptoms
          ? getApiData?.riskAssessment?.behavioralSymptoms
          : [],
      );
      setBehavioralSymptomsBoolean(
        getApiData?.riskAssessment?.behavioralSymptomsOther ? true : false,
      );
      setBehavioralSymptomsOther(
        getApiData?.riskAssessment?.behavioralSymptomsOther,
      );

      // Resetting physical symptoms state variables
      setPhysicalSymptoms(
        getApiData?.riskAssessment?.physicalSymptoms
          ? getApiData?.riskAssessment?.physicalSymptoms
          : [],
      );
      setPhysicalSymptomsBoolean(
        getApiData?.riskAssessment?.physicalSymptoms ? true : false,
      );
      setPhysicalSymptomsOther(
        getApiData?.riskAssessment?.physicalSymptomsOther,
      );

      // Resetting cognitive symptoms state variables
      setConsnotiveSymptoms(
        getApiData?.riskAssessment?.cognitiveSymptoms
          ? getApiData?.riskAssessment?.cognitiveSymptoms
          : [],
      );
      setConsnotiveSymptomsBoolean(
        getApiData?.riskAssessment?.cognitiveSymptoms ? true : false,
      );
      setConsnotiveSymptomsOther(
        getApiData?.riskAssessment?.cognitiveSymptomsOther,
      );

      // Resetting psychosocial symptoms state variables
      setPsychosocialSymptoms(
        getApiData?.riskAssessment?.psychosocialSymptoms
          ? getApiData?.riskAssessment?.psychosocialSymptoms
          : [],
      );
      setPsychosocialSymptomsBoolean(
        getApiData?.riskAssessment?.psychosocialSymptoms ? true : false,
      );
      setPsychosocialSymptomsOther(
        getApiData?.riskAssessment?.psychosocialSymptomsOther,
      );

      // Resetting interventions implemented state variables
      const interventionsImplementedValue = getApiData?.interventions?.map(
        (item) => {
          return {
            label: item,
            value: item,
          };
        },
      );
      setInterventionsImplemented(interventionsImplementedValue);

      // setInterventionsImplementedBoolean(
      //   getApiData?.interventionsComment ? true : false
      // );

      setInterventionsImplementedOther(getApiData?.interventionsComment);

      // Resetting counseling and frequency state variables
      setMinimumHoure(getApiData?.counselingFrequencyMinimum);
      setIndividualComment(getApiData?.IndividualComment);
      setCounselingOptions(
        getApiData?.counselingFrequency ? getApiData?.counselingFrequency : [],
      );
      setCounselingOptionsOther(getApiData?.counselingFrequencyComment);
      setCounselingOptionsTextBoolean(
        getApiData?.counselingFrequencyComment ? true : false,
      );
      setDesiredMeasure(getApiData?.desiredMeasure);
      // Resetting admissionMeasure1 state variables
      if (getApiData) {
        setOption1(
          getApiData?.maintainSobrietyType
            ? getApiData.maintainSobrietyType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setMaintainSobrietyObjective(
          Array.isArray(getApiData?.maintainSobrietyObjective)
            ? getApiData?.maintainSobrietyObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setSobrietyEditorValue(getApiData?.sobrietyEditorValue || "");
        setSobrietyObjectivesEditorValue(
          getApiData?.sobrietyObjectivesEditorValue || "",
        );
        setSobrietyInterventionsEditorValue(
          getApiData?.sobrietyInterventionsEditorValue,
        );
        setAdmissionMeasure1(getApiData?.maintainSobrietyAdmissionMeasure);
        setCurrentMeasure1(getApiData?.maintainSobrietyCurrentMeasure);
        setEstimatedDateOfCompletion1(
          getApiData?.maintainSobrietyEstimatedDateOfCompletion
            ? getApiData?.maintainSobrietyEstimatedDateOfCompletion?.slice(
                0,
                10,
              )
            : "",
        );
        setComment1(getApiData?.maintainSobrietyComments);
        setIsMeasureMet1(getApiData?.maintainSobrietyMeasureMet);
      } else {
        setOption1([]);
        setSobrietyInterventionsEditorValue("");
        setAdmissionMeasure1("");
        setCurrentMeasure1("");
        setEstimatedDateOfCompletion1("");
        setComment1("");
        setIsMeasureMet1(null);
      }

      // Resetting admissionMeasure2 state variables
      if (getApiData) {
        setOption2(
          getApiData?.independentLivingSkillsType
            ? getApiData.independentLivingSkillsType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setIndependentLivingSkillsObjective(
          Array.isArray(getApiData?.maintainSobrietyObjective)
            ? getApiData?.maintainSobrietyObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setIndependentInterventionsEditorValue(
          getApiData?.independentInterventionsEditorValue,
        );
        setAdmissionMeasure2(
          getApiData?.independentLivingSkillsAdmissionMeasure,
        );
        setIndependentEditorValue(getApiData?.independentEditorValue || "");
        setIndependentObjectivesEditorValue(
          getApiData?.independentObjectivesEditorValue || "",
        );
        setCurrentMeasure2(getApiData?.independentLivingSkillsCurrentMeasure);
        setEstimatedDateOfCompletion2(
          getApiData?.independentLivingSkillsEstimatedDateOfCompletion
            ? getApiData?.independentLivingSkillsEstimatedDateOfCompletion?.slice(
                0,
                10,
              )
            : "",
        );
        setComment2(getApiData?.independentLivingSkillsComments);
        setIsMeasureMet2(getApiData?.independentMeasureMet);
      } else {
        setOption2([]);
        setIndependentInterventionsEditorValue("");
        setAdmissionMeasure2("");
        setCurrentMeasure2("");
        setEstimatedDateOfCompletion2("");
        setComment2("");
        setIsMeasureMet2(null);
      }

      // Resetting admissionMeasure3 state variables
      if (getApiData) {
        setOption3(
          getApiData?.employmentType
            ? getApiData.employmentType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setEmploymentObjective(
          Array.isArray(getApiData?.employmentObjective)
            ? getApiData?.employmentObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setEmploymentEditorValue(getApiData?.employmentEditorValue || "");
        setEmploymentObjectivesEditorValue(
          getApiData?.employmentObjectivesEditorValue || "",
        );
        setEmploymentInterventionsEditorValue(
          getApiData?.employmentInterventionsEditorValue,
        );
        setAdmissionMeasure3(getApiData?.employmentAdmissionMeasure);
        setCurrentMeasure3(getApiData?.employmentCurrentMeasure);
        setEstimatedDateOfCompletion3(
          getApiData?.employmentEstimatedDateOfCompletion
            ? getApiData?.employmentEstimatedDateOfCompletion?.slice(0, 10)
            : "",
        );
        setComment3(getApiData?.employmentComments);
        setIsMeasureMet3(getApiData?.employmentMeasureMet);
      } else {
        setOption3([]);
        setEmploymentInterventionsEditorValue("");
        setAdmissionMeasure3("");
        setCurrentMeasure3("");
        setEstimatedDateOfCompletion3("");
        setComment3("");
        setIsMeasureMet3(null);
      }

      // Resetting admissionMeasure4 state variables
      if (getApiData) {
        setOption4(
          getApiData?.adlsSecondType
            ? getApiData.adlsSecondType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setAdlsSecondObjective(
          Array.isArray(getApiData?.adlsSecondObjective)
            ? getApiData?.adlsSecondObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setAdlsEditorValue(getApiData?.adlsEditorValue || "");
        setAdlsObjectivesEditorValue(
          getApiData?.adlsObjectivesEditorValue || "",
        );
        setAdlsInterventionsEditorValue(
          getApiData?.adlsInterventionsEditorValue,
        );
        setAdmissionMeasure4(getApiData?.adlsSecondAdmissionMeasure);
        setCurrentMeasure4(getApiData?.adlsSecondCurrentMeasure);
        setEstimatedDateOfCompletion4(
          getApiData?.adlsSecondEstimatedDateOfCompletion
            ? getApiData?.adlsSecondEstimatedDateOfCompletion?.slice(0, 10)
            : "",
        );
        setComment4(getApiData?.adlsSecondComments);
        setIsMeasureMet4(getApiData?.adlsMeasureMet);
      } else {
        setOption4([]);
        setAdlsInterventionsEditorValue("");
        setAdmissionMeasure4("");
        setCurrentMeasure4("");
        setEstimatedDateOfCompletion4("");
        setComment4("");
        setIsMeasureMet4(null);
      }

      // Resetting admissionMeasure5 state variables
      if (getApiData) {
        setOption5(
          getApiData?.safetyType
            ? getApiData.safetyType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setSafetyObjective(
          Array.isArray(getApiData?.safetyObjective)
            ? getApiData?.safetyObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setSafetyEditorValue(getApiData?.safetyEditorValue || "");
        setSafetyObjectivesEditorValue(
          getApiData?.safetyObjectivesEditorValue || "",
        );
        setSafetyInterventionsEditorValue(
          getApiData?.safetyInterventionsEditorValue,
        );
        setAdmissionMeasure5(getApiData?.safetyAdmissionMeasure);
        setCurrentMeasure5(getApiData?.safetyCurrentMeasure);
        setEstimatedDateOfCompletion5(
          getApiData?.safetyEstimatedDateOfCompletion
            ? getApiData?.safetyEstimatedDateOfCompletion?.slice(0, 10)
            : "",
        );
        setComment5(getApiData?.safetyComments);
        setIsMeasureMet5(getApiData?.safetyMeasureMet);
      } else {
        setOption5([]);
        setSafetyInterventionsEditorValue("");
        setAdmissionMeasure5("");
        setCurrentMeasure5("");
        setEstimatedDateOfCompletion5("");
        setComment5("");
        setIsMeasureMet5(null);
      }

      // Resetting admissionMeasure6 state variables
      if (getApiData) {
        setOption6(
          getApiData?.medicationEducationType
            ? getApiData.medicationEducationType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setMedicationEducationObjective(
          Array.isArray(getApiData?.medicationEducationObjective)
            ? getApiData?.medicationEducationObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setMedicationEditorValue(getApiData?.medicationEditorValue || "");
        setMedicationInterventionsEditorValue(
          getApiData?.medicationEducationInterventionsEditorValue,
        );
        setMedicationObjectivesEditorValue(
          getApiData?.medicationObjectivesEditorValue || "",
        );
        setAdmissionMeasure6(getApiData?.medicationEducationAdmissionMeasure);
        setCurrentMeasure6(getApiData?.medicationEducationCurrentMeasure);
        setEstimatedDateOfCompletion6(
          getApiData?.medicationEducationEstimatedDateOfCompletion
            ? getApiData?.medicationEducationEstimatedDateOfCompletion?.slice(
                0,
                10,
              )
            : "",
        );
        setComment6(getApiData?.medicationEducationComments);
        setIsMeasureMet6(getApiData?.medicationEducationMeasureMet);
      } else {
        setOption6([]);
        setMedicationInterventionsEditorValue("");
        setAdmissionMeasure6("");
        setCurrentMeasure6("");
        setEstimatedDateOfCompletion6("");
        setComment6("");
        setIsMeasureMet6(null);
      }

      // Resetting admissionMeasure7 state variables
      if (getApiData) {
        setOption7(
          getApiData?.managingMentalHealthType
            ? getApiData.managingMentalHealthType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setManagingMentalHealthObjective(
          Array.isArray(getApiData?.managingMentalHealthObjective)
            ? getApiData?.managingMentalHealthObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setMentalHealthEditorValue(getApiData?.mentalHealthEditorValue || "");
        setMentalHealthObjectivesEditorValue(
          getApiData?.mentalHealthObjectivesEditorValue || "",
        );
        setMentalHealthInterventionsEditorValue(
          getApiData?.mentalHealthInterventionsEditorValue,
        );
        setAdmissionMeasure7(getApiData?.managingMentalHealthAdmissionMeasure);
        setCurrentMeasure7(getApiData?.managingMentalHealthCurrentMeasure);
        setEstimatedDateOfCompletion7(
          getApiData?.managingMentalHealthEstimatedDateOfCompletion
            ? getApiData?.managingMentalHealthEstimatedDateOfCompletion?.slice(
                0,
                10,
              )
            : "",
        );
        setComment7(getApiData?.managingMentalHealthComments);
        setIsMeasureMet7(getApiData?.mentalHealthMeasureMet);
      } else {
        setOption7([]);
        setMentalHealthInterventionsEditorValue("");
        setAdmissionMeasure7("");
        setCurrentMeasure7("");
        setEstimatedDateOfCompletion7("");
        setComment7("");
        setIsMeasureMet7(null);
      }

      // Resetting admissionMeasure8 state variables
      if (getApiData) {
        setOption8(
          getApiData?.legalType
            ? getApiData.legalType.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setLegalObjective(
          Array.isArray(getApiData?.legalObjective)
            ? getApiData?.legalObjective?.map((item) => ({
                label: item,
                value: item,
              }))
            : [],
        );
        setLegalEditorValue(getApiData?.legalEditorValue || "");
        setLegalObjectivesEditorValue(
          getApiData?.legalObjectivesEditorValue || "",
        );
        setLegalHealthInterventionsEditorValue(
          getApiData?.legalHealthInterventionsEditorValue,
        );
        setAdmissionMeasure8(getApiData?.legalAdmissionMeasure);
        setCurrentMeasure8(getApiData?.legalCurrentMeasure);
        setEstimatedDateOfCompletion8(
          getApiData?.legalEstimatedDateOfCompletion
            ? getApiData?.legalEstimatedDateOfCompletion?.slice(0, 10)
            : "",
        );
        setComment8(getApiData?.legalComments);
        setIsMeasureMet8(getApiData?.legalMeasureMet);
      } else {
        setOption8([]);
        setLegalHealthInterventionsEditorValue("");
        setAdmissionMeasure8("");
        setCurrentMeasure8("");
        setEstimatedDateOfCompletion8("");
        setComment8("");
        setIsMeasureMet8(null);
      }

      // Resetting otherArray state variables
      setOtherArray(getApiData?.other ? getApiData?.other : []);

      // Resetting resident overall participation state variables
      setResidentParticipation(getApiData?.residentParticipation);
      setResidentAttitute(getApiData?.residentAttitude);
      setResidentProgress(getApiData?.residentProgress);
      setSupportSystemPhoneNumber(getApiData?.supportSystemPhoneNumber);
      setSupportSystem(
        getApiData?.supportSystem ? getApiData?.supportSystem : [],
      );
      setSupportSystemOtherText(getApiData?.supportSystemOtherText);
      setSupportSystemOtherTextBoolean(false);
      setCurrentMedications(getApiData?.currentMedications);
      setreligiousPreference(getApiData?.religiousPreference);
      if (getApiData?.religiousPreference) {
        setReligiousPreferenceText(getApiData?.religiousPreferenceText);
      }
      if (getApiData?.individualTherapy) {
        setIndividualComment(getApiData?.individualTherapy);
      }
      if (getApiData?.nutritionAndWellnessPlanning) {
        setNutritionOptions((prevOptions) => [
          ...getApiData.nutritionAndWellnessPlanning,
        ]);
        setNutritionAndWellnessPlanning(
          getApiData.nutritionAndWellnessPlanning,
        );
      } else {
        setNutritionAndWellnessPlanning("");
      }
      setRecommendationToExtendResidentialTreatment(
        getApiData?.recommendationToExtendResidentialTreatment,
      );
      setPersonalFinances(getApiData?.personalFinances);
      setDischargePlanning(
        getApiData?.dischargePlanning ||
          getApiData?.patientId?.dischargePlanningAndAfterCarePlanning ||
          [],
      );
      setAdditionalComment(
        getApiData?.additionalComment ||
          getApiData?.patientId?.additionalDischargePlanningComment ||
          "",
      );
      setRecommendationsForFurtherPrograms(
        getApiData?.recommendationsForFurtherPrograms
          ? getApiData?.recommendationsForFurtherPrograms
          : getApiData?.patientId?.recommendationsForFurtherPrograms || [],
      );
      setrecommendationsForFurtherProgramsBoolean(
        getApiData?.recommendationsForFurtherPrograms?.length > 0
          ? true
          : false,
      );
      setRecommendationsForFurtherProgramsOther(
        getApiData?.recommendationsForFurtherProgramsOther ||
          getApiData?.patientId?.recommendationsForFurtherProgramsOther ||
          "",
      );
      setAfterCareAndTransitionPlanning(
        getApiData?.patientId?.afterCareAndTransitionPlanning || [],
      );
      setTextData(
        getApiData?.clinicalSummaryBeforeDate
          ? getApiData?.clinicalSummaryBeforeDate?.slice(0, 10)
          : "",
      );

      // Resetting clinicalSummary state variables
      setClinicalSummary(
        getApiData?.clinicalSummary
          ? getApiData.clinicalSummary.map((item) => ({
              label: item,
              value: item,
            }))
          : [],
      );
      setTreatmentPlanReviewDate(
        getApiData?.treatmentPlanReviewDate
          ? getApiData?.treatmentPlanReviewDate.slice(0, 10)
          : "",
      );
      setDischargePlanDate(
        getApiData?.dischargePlanDate
          ? getApiData?.dischargePlanDate.slice(0, 10)
          : "",
      );
      setReadinessDischarge(
        getApiData?.readinessDischarge ||
          getApiData?.patientId?.readinessDischarge ||
          "",
      );
      setIsAdditionalDischargePlanningChecked(
        getApiData?.isAdditionalDischargePlanningChecked ??
          getApiData?.patientId?.isAdditionalDischargePlanningChecked ??
          null,
      );
      setClientCareCoordinationTeam(
        getApiData?.clientCareCoordinationTeam || "",
      );
      // Resetting individual participating state variables
      setResident(getApiData?.individualsParticipatingInServicePlan?.resident);
      setGuardian(getApiData?.individualsParticipatingInServicePlan?.guardian);
      setStaff(getApiData?.individualsParticipatingInServicePlan?.staff);
      setBph(getApiData?.individualsParticipatingInServicePlan?.bhp);
      setOtherIndividual(
        getApiData?.individualsParticipatingInServicePlan?.otherIndividual,
      );
      setCommentIndividual(
        getApiData?.individualsParticipatingInServicePlan?.comment,
      );

      // Resetting isReason state variable
      setIsReason(getApiData?.residentAgreementIsReason);
      setrefusalReason(getApiData?.residentAgreementRefusalReason);
      setVerbalConsentResidentRepresentative(
        getApiData?.verbalConsentResidentRepresentative ?? "",
      );

      // Resetting signaturesResident state variables
      setNameResident(getApiData?.signaturesResident?.name);
      setCredentialsResident(getApiData?.signaturesResident?.credentials);
      setsignatureResident(getApiData?.signaturesResident?.signature);
      setDateResident(
        getApiData?.signaturesResident?.date
          ? getApiData?.signaturesResident?.date
          : "",
      );
      setTimeResident(getApiData?.signaturesResident?.time);

      // Resetting signaturesFacilityRep state variables
      setNameFacilityRep(getApiData?.signaturesFacilityRep?.name);
      setCredentialsFacilityRep(getApiData?.signaturesFacilityRep?.credentials);
      setsignatureFacilityRep(getApiData?.signaturesFacilityRep?.signature);
      setDateFacilityRep(
        getApiData?.signaturesFacilityRep?.date
          ? getApiData?.signaturesFacilityRep?.date
          : "",
      );
      setTimeFacality(getApiData?.signaturesFacilityRep?.time);

      // Resetting signaturesBhp state variables
      setNameBhp(getApiData?.signaturesBhp?.name);
      setCredentialsBhp(getApiData?.signaturesBhp?.credentials);
      setsignatureBhp(getApiData?.signaturesBhp?.signature);
      setDateBhp(
        getApiData?.signaturesBhp?.date ? getApiData?.signaturesBhp?.date : "",
      );
      if (getApiData?.services?.length > 0) {
        setServiceData(getApiData?.services);
      }
      setTimeBhp(getApiData?.signaturesBhp?.time);
      setAdminSignature(getApiData?.adminSignature);
      setAdminSignatureDate(getApiData?.adminSignatureDate);
      setAdminSignatureTime(getApiData?.adminSignatureTime);
      if (getApiData?.signatures) {
        loadSignaturesFromApi(getApiData.signatures);
      }
      setSigners(getApiData.signers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApiData]);
  useEffect(() => {
    if (id) {
      residentService.getApiResident({
        url: EMPLOYEE_APIS.EMPLOYEE_GETTREATMENTPLANBYID(id),
        setResponse: setGetApiData,
        isIntake: true,
      });
    }
    setFiledForm(user?.treatmentPlan);
    setUserId(user?._id);
    if (profile) {
      setUser(profile);
    }
  }, [id, profile, user?._id, user?.treatmentPlan]);
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
    const data = {
      personalFinances,
      saveAsDraft,
      residentName,
      dateOfBirth: dob,
      patientId: userId,
      name: initialUpdate,
      date: date,
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
      IndividualComment,
      maintainSobrietyType: option1?.map((val) => val.value),
      maintainSobrietyAdmissionMeasure: admissionMeasure1,
      maintainSobrietyCurrentMeasure: currentMeasure1,
      maintainSobrietyEstimatedDateOfCompletion: estimatedDateOfCompletion1,
      maintainSobrietyComments: comments1,
      maintainSobrietyPreviousMeasure: tableshow1,
      independentLivingSkillsType: option2?.map((val) => val.value),
      independentLivingSkillsAdmissionMeasure: admissionMeasure2,
      independentLivingSkillsCurrentMeasure: currentMeasure2,
      independentLivingSkillsEstimatedDateOfCompletion:
        estimatedDateOfCompletion2,
      independentLivingSkillsComments: comments2,
      independentLivingSkillsPreviousMeasure: tableshow2,
      employmentType: option3?.map((val) => val.value),
      employmentAdmissionMeasure: admissionMeasure3,
      employmentCurrentMeasure: currentMeasure3,
      employmentEstimatedDateOfCompletion: estimatedDateOfCompletion3,
      employmentComments: comments3,
      employmentPreviousMeasure: tableshow3,
      adlsSecondType: option4?.map((val) => val.value),
      adlsSecondAdmissionMeasure: admissionMeasure4,
      adlsSecondCurrentMeasure: currentMeasure4,
      adlsSecondEstimatedDateOfCompletion: estimatedDateOfCompletion4,
      adlsSecondComments: comments4,
      adlsSecondPreviousMeasure: tableshow4,
      safetyType: option5?.map((val) => val.value),
      safetyAdmissionMeasure: admissionMeasure5,
      safetyCurrentMeasure: currentMeasure5,
      safetyEstimatedDateOfCompletion: estimatedDateOfCompletion5,
      safetyComments: comments5,
      safetyPreviousMeasure: tableshow5,
      medicationEducationType: option6?.map((val) => val.value),
      medicationEducationAdmissionMeasure: admissionMeasure6,
      medicationEducationCurrentMeasure: currentMeasure6,
      medicationEducationEstimatedDateOfCompletion: estimatedDateOfCompletion6,
      medicationEducationComments: comments6,
      medicationEducationPreviousMeasure: tableshow6,
      managingMentalHealthType: option7?.map((val) => val.value),
      managingMentalHealthAdmissionMeasure: admissionMeasure7,
      managingMentalHealthCurrentMeasure: currentMeasure7,
      managingMentalHealthEstimatedDateOfCompletion: estimatedDateOfCompletion7,
      managingMentalHealthComments: comments7,
      managingMentalHealthPreviousMeasure: tableshow7,
      legalType: option8?.map((val) => val.value),
      legalAdmissionMeasure: admissionMeasure8,
      legalCurrentMeasure: currentMeasure8,
      legalEstimatedDateOfCompletion: estimatedDateOfCompletion8,
      legalComments: comments8,
      legalPreviousMeasure: tableshow8,
      other: otherArray,
      residentParticipation,
      residentAttitude: residentAttitute,
      residentProgress,
      isRequiresAssistance,
      bhServicesLimitsFunctioning,
      isFallRisk,
      fallRiskComment,
      supportSystem,
      supportSystemPhoneNumber: supportSystemPhoneNumber,
      currentMedications,
      religiousPreference,
      nutritionAndWellnessPlanning,
      recommendationToExtendResidentialTreatment,
      dischargePlanning,
      additionalComment,
      isAdditionalDischargePlanningChecked,
      recommendationsForFurtherPrograms,
      recommendationsForFurtherProgramsOther,
      afterCareAndTransitionPlanning,
      clinicalSummaryBeforeDate: textData,
      clinicalSummary: clinicalSummaryArray,
      treatmentPlanReviewDate,
      dischargePlanDate,
      clientCareCoordinationTeam,
      individualsParticipatingInServicePlan: {
        resident: resident,
        guardian: guardian,
        staff: staff,
        bhp: bpn,
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
      signatures,
      signers,
    };
    intakeService.treatmentPlan.update(id, data, { setLoading, navigate });
  };

  //handle check box
  const handleCheckboxChangeMentalHealth = (value) => {
    setMentelHealth(value);
  };
  const handleCheckboxChangeMind = (value) => {
    setMind(value);
  };

  //set the answer handleCheckboxChangeBehavioral
  const handleCheckboxChangeBehavioral = (symptom) => {
    if (symptom === "Other") {
      // Toggle "Other" symptom
      setBehavioralSymptoms((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      // Toggle other symptoms
      setBehavioralSymptoms((prevState) => {
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
      // Toggle "Other" symptom
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
      // Toggle "Other" symptom
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
      // Toggle "Other" symptom
      setPsychosocialSymptoms((prevState) => {
        if (prevState.includes("Other")) {
          return prevState.filter((item) => item !== "Other");
        } else {
          return [...prevState, "Other"];
        }
      });
    } else {
      setPsychosocialSymptoms((prevSelectedSymptoms) => {
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
  const [nutritionOptions, setNutritionOptions] = useState([
    {
      value: "eating a balanced diet",
      label: "Eating a balanced diet",
    },
    {
      value: "drinking adequate fluid",
      label: "Drinking adequate fluid",
    },
    {
      value: "ongoing health maintenance",
      label: "Ongoing health maintenance",
    },
  ]);
  const [tableshow1] = useState(true);
  const [tableshow2] = useState(true);
  const [tableshow3] = useState(true);
  const [tableshow4] = useState(true);
  const [tableshow5] = useState(true);
  const [tableshow6] = useState(true);
  const [tableshow7] = useState(true);
  const [tableshow8] = useState(true);
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
    additionalComment,
    adls,
    adlsEditorValue,
    adlsInterventionsEditorValue,
    adlsObjectivesEditorValue,
    adlsSecondObjective,
    adlsText,
    adminSignature,
    adminSignatureDate,
    adminSignatureTime,
    admissionMeasure1,
    admissionMeasure2,
    admissionMeasure3,
    admissionMeasure4,
    admissionMeasure5,
    admissionMeasure6,
    admissionMeasure7,
    admissionMeasure8,
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
    clearAllTyped,
    clientCareCoordinationTeam,
    clinicalSummary,
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
    currentMeasure2,
    currentMeasure3,
    currentMeasure4,
    currentMeasure5,
    currentMeasure6,
    currentMeasure7,
    currentMeasure8,
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
    dob,
    draftModel,
    employmentEditorValue,
    employmentInterventionsEditorValue,
    employmentObjective,
    employmentObjectivesEditorValue,
    estimatedDateOfCompletion1,
    estimatedDateOfCompletion2,
    estimatedDateOfCompletion3,
    estimatedDateOfCompletion4,
    estimatedDateOfCompletion5,
    estimatedDateOfCompletion6,
    estimatedDateOfCompletion7,
    estimatedDateOfCompletion8,
    fallRiskComment,
    filedForm,
    getApiData,
    guardian,
    guardTyped,
    handleCheckboxChange,
    handleCheckboxChangeafterCareAndTransitionPlanning,
    handleCheckboxChangeBehavioral,
    handleCheckboxChangeCognitive,
    handleCheckboxChangeCounsiling,
    handleCheckboxChangeMentalHealth,
    handleCheckboxChangeMind,
    handleCheckboxChangePhysical,
    handleCheckboxChangePsychosocial,
    handleCheckboxChangerecommendationsForFurtherPrograms,
    handleCheckboxChangeSupportSystem,
    handlePost,
    hasTypedInForm,
    hoursFormat,
    id,
    independentEditorValue,
    independentInterventionsEditorValue,
    independentLivingSkillsObjective,
    independentObjectivesEditorValue,
    IndividualComment,
    initialServices,
    initialUpdate,
    interventionsImplemented,
    interventionsImplementedBoolean,
    interventionsImplementedOther,
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
    isReason,
    isRequiresAssistance,
    bhServicesLimitsFunctioning,
    legalEditorValue,
    legalHealthInterventionsEditorValue,
    legalObjective,
    legalObjectivesEditorValue,
    loading,
    loadSignaturesFromApi,
    maintainSobrietyObjective,
    managingMentalHealthObjective,
    medicationAdministation,
    medicationAssistance,
    medicationEditorValue,
    medicationEducationObjective,
    medicationInterventionsEditorValue,
    medicationObjectivesEditorValue,
    mendelHealth,
    mentalHealthEditorValue,
    mentalHealthInterventionsEditorValue,
    mentalHealthObjectivesEditorValue,
    mentelText,
    mind,
    mindText,
    minimumHoure,
    nameBhp,
    nameFacilityRep,
    nameResident,
    navigate,
    nutritionAndWellnessPlanning,
    nutritionOptions,
    option1,
    option2,
    option3,
    option4,
    option5,
    option6,
    option7,
    option8,
    otherArray,
    otherIndividual,
    personalFinances,
    personalFinancesComment,
    physicalService,
    physicalSymptoms,
    physicalSymptomsBoolean,
    physicalSymptomsOther,
    presentingPrice,
    primaryCare,
    primaryCareProviderContact,
    primaryCareProviderAddress,
    profile,
    profileInfo,
    psychiatricProvider,
    psychiatricProviderContact,
    psychiatricProviderAddress,
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
    safetyObjective,
    safetyObjectivesEditorValue,
    saveAsDraft,
    services,
    setAdditionalComment,
    setAdls,
    setAdlsEditorValue,
    setAdlsInterventionsEditorValue,
    setAdlsObjectivesEditorValue,
    setAdlsSecondObjective,
    setAdminDate,
    setAdminSignature,
    setAdminSignatureDate,
    setAdminSignatureTime,
    setAdmissionMeasure1,
    setAdmissionMeasure2,
    setAdmissionMeasure3,
    setAdmissionMeasure4,
    setAdmissionMeasure5,
    setAdmissionMeasure6,
    setAdmissionMeasure7,
    setAdmissionMeasure8,
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
    setCurrentMeasure2,
    setCurrentMeasure3,
    setCurrentMeasure4,
    setCurrentMeasure5,
    setCurrentMeasure6,
    setCurrentMeasure7,
    setCurrentMeasure8,
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
    setDob,
    setDraftModel,
    setEmploymentEditorValue,
    setEmploymentInterventionsEditorValue,
    setEmploymentObjective,
    setEmploymentObjectivesEditorValue,
    setEstimatedDateOfCompletion1,
    setEstimatedDateOfCompletion2,
    setEstimatedDateOfCompletion3,
    setEstimatedDateOfCompletion4,
    setEstimatedDateOfCompletion5,
    setEstimatedDateOfCompletion6,
    setEstimatedDateOfCompletion7,
    setEstimatedDateOfCompletion8,
    setFallRiskComment,
    setFiledForm,
    setGetApiData,
    setGuardian,
    setIndependentEditorValue,
    setIndependentInterventionsEditorValue,
    setIndependentLivingSkillsObjective,
    setIndependentObjectivesEditorValue,
    setIndividualComment,
    setInitialUpdate,
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
    setIsReason,
    setIsRequiresAssistance,
    setLegalEditorValue,
    setLegalHealthInterventionsEditorValue,
    setLegalObjective,
    setLegalObjectivesEditorValue,
    setLoading,
    setMaintainSobrietyObjective,
    setManagingMentalHealthObjective,
    setMedicationAdministation,
    setMedicationAssistence,
    setMedicationEditorValue,
    setMedicationEducationObjective,
    setMedicationInterventionsEditorValue,
    setMedicationObjectivesEditorValue,
    setMentalHealthEditorValue,
    setMentalHealthInterventionsEditorValue,
    setMentalHealthObjectivesEditorValue,
    setMentelHealth,
    setMentelText,
    setMind,
    setMindText,
    setMinimumHoure,
    setNameBhp,
    setNameFacilityRep,
    setNameResident,
    setNutritionAndWellnessPlanning,
    setNutritionOptions,
    setOption1,
    setOption2,
    setOption3,
    setOption4,
    setOption5,
    setOption6,
    setOption7,
    setOption8,
    setOtherArray,
    setOtherIndividual,
    setPersonalFinances,
    setPersonalFinancesComment,
    setPhysicalService,
    setPhysicalSymptoms,
    setPhysicalSymptomsBoolean,
    setPhysicalSymptomsOther,
    setPresentingPrice,
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
    setSafetyObjective,
    setSafetyObjectivesEditorValue,
    setSaveAsDraft,
    setServiceData,
    setServices,
    setShowSignatureResident,
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
    setSobrietyObjectivesEditorValue,
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
    showSignatureResident,
    signatureBhp,
    signatureFacilityRep,
    signatureModel3,
    signatureResident,
    signatures,
    signerIndex,
    signers,
    sobrietyEditorValue,
    sobrietyInterventionsEditorValue,
    sobrietyObjectivesEditorValue,
    staff,
    strengths,
    supportSystem,
    supportSystemOtherText,
    supportSystemOtherTextBoolean,
    supportSystemPhoneNumber,
    tableshow1,
    tableshow2,
    tableshow3,
    tableshow4,
    tableshow5,
    tableshow6,
    tableshow7,
    tableshow8,
    textData,
    timeBhp,
    timeFacality,
    timeResident,
    treatmentPlanReviewDate,
    Triggers,
    typedGuardDialog,
    updateSignature,
    user,
    userId,
    verbalConsentResidentRepresentative,
    witnessIncomplete,
    witnessNamePresent,
    witnessSigPresent,
  };
}

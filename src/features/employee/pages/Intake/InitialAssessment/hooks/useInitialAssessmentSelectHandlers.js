/** @format */

import { useMemo } from "react";
import {
  ADMISSION_STATUS_OPTIONS,
  FAMILY_MENTAL_HEALTH_RELATION_OPTIONS,
  INFECTION_DISEASES_OPTIONS,
  LEGAL_SYSTEM_INTERACTION_OPTIONS,
  MEDICAL_EQUIPMENT_OPTIONS,
  MENTAL_HEALTH_TREATMENT_DIAGNOSIS_REASON_OPTIONS,
  MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS,
  RISK_FACTORS_BEHAVIOR_OPTIONS,
  RISK_FACTORS_SYMPTOMS_OPTIONS,
  SPECIAL_PRECAUTIONS_OPTIONS,
  THYROID_DISORDER_OPTIONS,
} from "../config/initialAssessmentSelectOptions";
import { PRESENTING_PROBLEMS_OPTIONS } from "@/features/shared/constants";
import {
  createMultiSelectChangeHandler,
  createMultiSelectEnterHandler,
  createSingleMultiChangeHandler,
} from "../utils/creatableSelectHandlers";

export function usePatientInformationSelectHandlers({
  admissionStatus,
  setAdmissionStatus,
  reasonForAdmission,
  setReasonForAdmission,
}) {
  return useMemo(
    () => ({
      option_value_Admission: ADMISSION_STATUS_OPTIONS,
      handleKeyDownAdmissionStatus: createMultiSelectEnterHandler(
        ADMISSION_STATUS_OPTIONS,
        admissionStatus,
        setAdmissionStatus,
      ),
      handleSelectChangeAdmission:
        createMultiSelectChangeHandler(setAdmissionStatus),
      option_value_ReasonForAdmission: PRESENTING_PROBLEMS_OPTIONS,
      handleKeyDownReasionForAdmission: createMultiSelectEnterHandler(
        PRESENTING_PROBLEMS_OPTIONS,
        reasonForAdmission,
        setReasonForAdmission,
      ),
      handleSelectChangeAdmissionReasonForAdmission:
        createSingleMultiChangeHandler(setReasonForAdmission),
    }),
    [
      admissionStatus,
      setAdmissionStatus,
      reasonForAdmission,
      setReasonForAdmission,
    ],
  );
}

export function useMedicalConditionsSelectHandlers({
  thyroidDisorder,
  setThyroidDisorder,
  infectionDiseases,
  setInfectionDiseases,
}) {
  return useMemo(
    () => ({
      thyroidOptions: THYROID_DISORDER_OPTIONS,
      handleKeyThyroidDisorder: createMultiSelectEnterHandler(
        THYROID_DISORDER_OPTIONS,
        thyroidDisorder,
        setThyroidDisorder,
      ),
      thyroiddisorderhnadler:
        createMultiSelectChangeHandler(setThyroidDisorder),
      infectionDiseasesOptions: INFECTION_DISEASES_OPTIONS,
      handleKeyInfectionDiseases: createMultiSelectEnterHandler(
        INFECTION_DISEASES_OPTIONS,
        infectionDiseases,
        setInfectionDiseases,
      ),
      infectionDiseasesHandler:
        createMultiSelectChangeHandler(setInfectionDiseases),
    }),
    [
      thyroidDisorder,
      setThyroidDisorder,
      infectionDiseases,
      setInfectionDiseases,
    ],
  );
}

export function useFamilyMentalHealthSelectHandlers({
  SignificantFamilyMedicalPsychiatricHistory,
  setSignificantFamilyMedicalPsychiatricHistory,
  mentalHealthTreatmentHistoryTypeOfService,
  setMentalHealthTreatmentHistoryTypeOfService,
  mentalHealthTreatmentHistoryDiagnosisReason,
  setMentalHealthTreatmentHistoryDiagnosisReason,
}) {
  return useMemo(
    () => ({
      SignificantFamilyMedicalPsychiatricHistoryOptions:
        FAMILY_MENTAL_HEALTH_RELATION_OPTIONS,
      handleKeySignificantFamilyMedicalPsychiatricHistory:
        createMultiSelectEnterHandler(
          FAMILY_MENTAL_HEALTH_RELATION_OPTIONS,
          SignificantFamilyMedicalPsychiatricHistory,
          setSignificantFamilyMedicalPsychiatricHistory,
        ),
      SignificantFamilyMedicalPsychiatricHistoryHandler:
        createMultiSelectChangeHandler(
          setSignificantFamilyMedicalPsychiatricHistory,
        ),
      mentalHealthTreatmentHistoryTypeOfServiceOption:
        MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS,
      handleKeyMentalHealthTreatmentHistoryTypeOfService:
        createMultiSelectEnterHandler(
          MENTAL_HEALTH_TREATMENT_TYPE_OF_SERVICE_OPTIONS,
          mentalHealthTreatmentHistoryTypeOfService,
          setMentalHealthTreatmentHistoryTypeOfService,
        ),
      mentalHealthTreatmentHistoryTypeOfServiceHandler:
        createMultiSelectChangeHandler(
          setMentalHealthTreatmentHistoryTypeOfService,
        ),
      mentalHealthTreatmentHistoryDiagnosisReasonOption:
        MENTAL_HEALTH_TREATMENT_DIAGNOSIS_REASON_OPTIONS,
      handleKeyDownMentalHealthTreatmentHistoryDiagnosisReason:
        createMultiSelectEnterHandler(
          MENTAL_HEALTH_TREATMENT_DIAGNOSIS_REASON_OPTIONS,
          mentalHealthTreatmentHistoryDiagnosisReason,
          setMentalHealthTreatmentHistoryDiagnosisReason,
        ),
      mentalHealthTreatmentHistoryDiagnosisReasonHandler:
        createMultiSelectChangeHandler(
          setMentalHealthTreatmentHistoryDiagnosisReason,
        ),
    }),
    [
      SignificantFamilyMedicalPsychiatricHistory,
      setSignificantFamilyMedicalPsychiatricHistory,
      mentalHealthTreatmentHistoryTypeOfService,
      setMentalHealthTreatmentHistoryTypeOfService,
      mentalHealthTreatmentHistoryDiagnosisReason,
      setMentalHealthTreatmentHistoryDiagnosisReason,
    ],
  );
}

export function useDiagnosisSelectHandlers({
  selectedValue,
  setSelectedValue,
  selectedValueMedical,
  setSelectedValueMedical,
  selectedValueSpecialPrecautions,
  setSelectedValueSpecialPrecautions,
}) {
  return useMemo(
    () => ({
      selectedValueOption: LEGAL_SYSTEM_INTERACTION_OPTIONS,
      handleKeyDownSelectedValue: createMultiSelectEnterHandler(
        LEGAL_SYSTEM_INTERACTION_OPTIONS,
        selectedValue,
        setSelectedValue,
      ),
      selectedValueHandler: createMultiSelectChangeHandler(setSelectedValue),
      selectedValueMedicalOption: MEDICAL_EQUIPMENT_OPTIONS,
      handleKeySelectedValueMedical: createMultiSelectEnterHandler(
        MEDICAL_EQUIPMENT_OPTIONS,
        selectedValueMedical,
        setSelectedValueMedical,
      ),
      selectedValueMedicalHandler: createMultiSelectChangeHandler(
        setSelectedValueMedical,
      ),
      selectedValueSpecialPrecautionsOption: SPECIAL_PRECAUTIONS_OPTIONS,
      handleKeySelectedValueSpecialPrecautions: createMultiSelectEnterHandler(
        SPECIAL_PRECAUTIONS_OPTIONS,
        selectedValueSpecialPrecautions,
        setSelectedValueSpecialPrecautions,
      ),
      selectedValueSpecialPrecautionsHandler: createMultiSelectChangeHandler(
        setSelectedValueSpecialPrecautions,
      ),
    }),
    [
      selectedValue,
      setSelectedValue,
      selectedValueMedical,
      setSelectedValueMedical,
      selectedValueSpecialPrecautions,
      setSelectedValueSpecialPrecautions,
    ],
  );
}

export function useRiskFactorsSelectHandlers({ riskFactors }) {
  return useMemo(
    () => ({
      selectedValueRiskFactorsOption1: RISK_FACTORS_BEHAVIOR_OPTIONS,
      handleKeySelectedValueRiskFactorsBehavior: createMultiSelectEnterHandler(
        RISK_FACTORS_BEHAVIOR_OPTIONS,
        riskFactors.fixedRows[6]?.comments,
        (next) => riskFactors.updateFixedRow(6, "comments", next),
      ),
      selectedValueRiskFactorsOption2: RISK_FACTORS_SYMPTOMS_OPTIONS,
      handleKeySelectedValueRiskFactorsSymptoms: createMultiSelectEnterHandler(
        RISK_FACTORS_SYMPTOMS_OPTIONS,
        riskFactors.fixedRows[7]?.comments,
        (next) => riskFactors.updateFixedRow(7, "comments", next),
      ),
    }),
    [riskFactors],
  );
}

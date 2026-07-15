/** @format */

import { useIndependentLivingSkills } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useIndependentLivingSkills";
import { useActiveWithdrawalSymptoms } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useActiveWithdrawalSymptoms";
import { useMentalStatusExam } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useMentalStatusExam";
import { useRiskFactors } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useRiskFactors";
import { useProtectiveFactors } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useProtectiveFactors";
import { useMedicalConditions } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useMedicalConditions";
import { useDiagnosisSlots } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useDiagnosisSlots";
import { useSubstanceAbuseHistory } from "@/features/employee/pages/Intake/InitialAssessment/hooks/useSubstanceAbuseHistory";
import {
  PSYCHIATRIC_DIAGNOSIS_SLOTS,
  MEDICAL_DIAGNOSIS_SLOTS,
} from "@/features/employee/pages/Intake/InitialAssessment/config/diagnosisSlotsConfig";
import { mergeDynamicFormSnapshots } from "@/features/employee/pages/Intake/InitialAssessment/utils/formSnapshotBridge";

/**
 * Shared dynamic form hooks for resident Initial Assessment.
 * Keeps legacy flat field names for existing JSX and payloadMapper.
 */
export function useResidentInitialAssessmentDynamicForms() {
  const medicalConditions = useMedicalConditions();
  const substanceAbuse = useSubstanceAbuseHistory();
  const activeWithdrawalForm = useActiveWithdrawalSymptoms();
  const mentalStatusExamForm = useMentalStatusExam();
  const independentLiving = useIndependentLivingSkills();
  const riskFactors = useRiskFactors();
  const protectiveFactors = useProtectiveFactors();
  const psychiatricDiagnosesForm = useDiagnosisSlots(
    PSYCHIATRIC_DIAGNOSIS_SLOTS,
    { extraArrayKey: "psychiatricDiagnosesArray" },
  );
  const medicalDiagnosesForm = useDiagnosisSlots(MEDICAL_DIAGNOSIS_SLOTS, {
    extraArrayKey: "medicalDiagnosesArray",
  });

  const legacy = {
    ...medicalConditions.legacy,
    ...substanceAbuse.legacy,
    ...activeWithdrawalForm.legacy,
    ...mentalStatusExamForm.legacy,
    ...independentLiving.legacy,
    ...riskFactors.legacy,
    ...protectiveFactors.legacy,
    ...psychiatricDiagnosesForm.legacy,
    ...medicalDiagnosesForm.legacy,
    setHandleRiskFactorActivityArray: independentLiving.setExtraRows,
  };

  const loadFromApi = (getApiData) => {
    medicalConditions.loadFromApi(getApiData?.medicalConditions);
    substanceAbuse.loadFromApi(getApiData);
    activeWithdrawalForm.loadFromApi(getApiData?.ActiveWithdrawalSymptoms);
    mentalStatusExamForm.loadFromApi(getApiData?.mentalStatusExam);
    independentLiving.loadFromApi(getApiData?.independentLivingSkills);
    riskFactors.loadFromApi(getApiData?.riskFactors);
    protectiveFactors.loadFromApi(getApiData?.protectiveFactors);

    const patientDataObj =
      getApiData?.patientId || getApiData?.data?.patientId || {};

    const psychDiagnoses =
      patientDataObj?.psychiatricDiagnoses?.length > 0
        ? patientDataObj?.psychiatricDiagnoses
        : getApiData?.psychiatricDiagnoses || [];

    const medDiagnoses =
      patientDataObj?.medicalDiagnoses?.length > 0
        ? patientDataObj?.medicalDiagnoses
        : getApiData?.medicalDiagnoses || [];

    psychiatricDiagnosesForm.loadFromApi(psychDiagnoses);
    medicalDiagnosesForm.loadFromApi(medDiagnoses);
  };

  const toSubmitSnapshots = () =>
    mergeDynamicFormSnapshots({
      independentLiving: independentLiving.toSubmitSnapshot(),
      activeWithdrawal: activeWithdrawalForm.toSubmitSnapshot(),
      mentalStatusExam: mentalStatusExamForm.toSubmitSnapshot(),
      riskFactors: riskFactors.toSubmitSnapshot(),
      protectiveFactors: protectiveFactors.toSubmitSnapshot(),
      medicalConditions: medicalConditions.toSubmitSnapshot(),
      psychiatricDiagnoses: psychiatricDiagnosesForm.toSubmitSnapshot(),
      medicalDiagnoses: medicalDiagnosesForm.toSubmitSnapshot(),
      substanceAbuse: substanceAbuse.toSubmitSnapshot(),
    });

  return {
    medicalConditions,
    substanceAbuse,
    activeWithdrawalForm,
    mentalStatusExamForm,
    independentLiving,
    riskFactors,
    protectiveFactors,
    psychiatricDiagnosesForm,
    medicalDiagnosesForm,
    legacy,
    loadFromApi,
    toSubmitSnapshots,
  };
}

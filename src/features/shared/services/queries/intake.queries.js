/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { intakeService } from "../services/intake";

// ─── Queries ──────────────────────────────────────────────────────────

export function useResidentIntake(id, patientId, options = {}) {
  return useServiceQuery(
    queryKeys.intake.detail(id || patientId),
    () => intakeService.getResidentIntake({ id, patientId }),
    { enabled: Boolean(id || patientId), ...options },
  );
}

export function useFaceSheet(id, patientId, options = {}) {
  return useServiceQuery(
    queryKeys.intake.detail(`faceSheet-${id || patientId}`),
    () => intakeService.getFaceSheet({ id, patientId }),
    { enabled: Boolean(id || patientId), ...options },
  );
}

export function useInitialAssessment(id, patientId, options = {}) {
  return useServiceQuery(
    queryKeys.intake.detail(`initialAssessment-${id || patientId}`),
    () => intakeService.getInitialAssessment({ id, patientId }),
    { enabled: Boolean(id || patientId), ...options },
  );
}

export function useNursingAssessment(id, patientId, options = {}) {
  return useServiceQuery(
    queryKeys.intake.detail(`nursingAssessment-${id || patientId}`),
    () => intakeService.getNursingAssessment({ id, patientId }),
    { enabled: Boolean(id || patientId), ...options },
  );
}

export function useSafetyPlan(id, patientId, options = {}) {
  return useServiceQuery(
    queryKeys.intake.detail(`safetyPlan-${id || patientId}`),
    () => intakeService.getSafetyPlan({ id, patientId }),
    { enabled: Boolean(id || patientId), ...options },
  );
}

export function useTreatmentPlan(id, options = {}) {
  return useServiceQuery(
    queryKeys.intake.detail(`treatmentPlan-${id}`),
    () => intakeService.treatmentPlan.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useInitialAssessmentList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.intake.list("initialAssessment", filters),
    () => intakeService.initialAssessment.list(filters),
    options,
  );
}

export function useFaceSheetList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.intake.list("faceSheet", filters),
    () => intakeService.faceSheet.list(filters),
    options,
  );
}

export function useNursingAssessmentList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.intake.list("nursingAssessment", filters),
    () => intakeService.nursingAssessment.list(filters),
    options,
  );
}

export function useResidentIntakeList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.intake.list("residentIntake", filters),
    () => intakeService.residentIntake.list(filters),
    options,
  );
}

export function useSafetyPlanList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.intake.list("safetyPlan", filters),
    () => intakeService.safetyPlan.list(filters),
    options,
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateResidentIntake({ navigate } = {}) {
  return useServiceMutation(
    (payload) => intakeService.residentIntake.create(payload),
    {
      invalidateKeys: [queryKeys.intake.all()],
      successMsg: "Resident Intake created!",
      navigate,
    },
  );
}

export function useUpdateResidentIntake({ id, navigate } = {}) {
  return useServiceMutation(
    (payload) => intakeService.residentIntake.update(id, payload),
    {
      invalidateKeys: [queryKeys.intake.all()],
      successMsg: "Resident Intake updated!",
      navigate,
    },
  );
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import {
  useServiceMutation,
  useServiceDeleteMutation,
} from "@/lib/useServiceMutation";
import { medicationService } from "../services/medication";

// ─── Opioid Count ─────────────────────────────────────────────────────

export function useOpioidCounts(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.opioid.list(filters),
    () => medicationService.getOpioidCounts(filters),
    options,
  );
}

export function useOpioidCountDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.medication.opioid.detail(id),
    () => medicationService.getOpioidCountById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useCreateOpioidCount({ navigate } = {}) {
  return useServiceMutation(
    (payload) => medicationService.createOpioidCount(payload),
    {
      invalidateKeys: [queryKeys.medication.opioid.list()],
      successMsg: "Opioid count created!",
      navigate,
    },
  );
}

export function useDeleteOpioidCount(options = {}) {
  return useServiceDeleteMutation(
    (id) => medicationService.deleteOpioidCount(id),
    {
      invalidateKeys: [queryKeys.medication.opioid.list()],
      ...options,
    },
  );
}

// ─── MARS ─────────────────────────────────────────────────────────────

export function useMarsByPatient(patientId, options = {}) {
  return useServiceQuery(
    queryKeys.medication.mars.byPatient(patientId),
    () => medicationService.mars.getByPatient(patientId),
    { enabled: Boolean(patientId), ...options },
  );
}

export function useMarsActiveEmployees(options = {}) {
  return useServiceQuery(
    queryKeys.medication.mars.activeEmployees(),
    () => medicationService.mars.getActiveEmployees(),
    options,
  );
}

export function useUpdateMarsStatus({ patientId } = {}) {
  return useServiceMutation(
    ({ marsId, payload }) =>
      medicationService.mars.updateStatus(marsId, payload),
    {
      invalidateKeys: patientId
        ? [queryKeys.medication.mars.byPatient(patientId)]
        : [],
      successMsg: "MARS status updated!",
    },
  );
}

// ─── Informed Consent ─────────────────────────────────────────────────

export function useInformedConsentList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.informedConsent.list(filters),
    () => medicationService.informedConsent.list(filters),
    options,
  );
}

export function useCreateInformedConsent({ isAdmin, navigate } = {}) {
  return useServiceMutation(
    (payload) => medicationService.createInformedConsent(payload, { isAdmin }),
    {
      invalidateKeys: [queryKeys.medication.informedConsent.list()],
      navigate,
    },
  );
}

// ─── Medication Employee ──────────────────────────────────────────────

export function useMedicationEmployeeList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.employee.list(filters),
    () => medicationService.medicationEmployee.list(filters),
    options,
  );
}

// ─── Mental Status ────────────────────────────────────────────────────

export function useMentalStatusList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.list("mentalStatus", filters),
    () => medicationService.mentalStatus.list(filters),
    options,
  );
}

// ─── Refusal ──────────────────────────────────────────────────────────

export function useRefusalList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.list("refusal", filters),
    () => medicationService.refusal.list(filters),
    options,
  );
}

// ─── Tracking Log ─────────────────────────────────────────────────────

export function useTrackingLogList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.list("trackingLog", filters),
    () => medicationService.trackingLog.list(filters),
    options,
  );
}

// ─── Reconciliation ───────────────────────────────────────────────────

export function useReconciliationList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.list("reconciliation", filters),
    () => medicationService.reconciliation.list(filters),
    options,
  );
}

// ─── PRN Log ──────────────────────────────────────────────────────────

export function usePrnLogList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.medication.list("prnLog", filters),
    () => medicationService.prnLog.list(filters),
    options,
  );
}

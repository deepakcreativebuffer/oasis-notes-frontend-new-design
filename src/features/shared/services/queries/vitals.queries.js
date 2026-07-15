/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { vitalsService } from "../services/vitals";

// ─── Queries ──────────────────────────────────────────────────────────

/**
 * Fetch vitals list patients.
 */
export function useVitalsPatients(options = {}) {
  return useServiceQuery(
    queryKeys.vitals.listPatients(),
    () => vitalsService.listPatients(),
    options,
  );
}

/**
 * Fetch vitals by patient (with optional date/filter).
 * Replaces: vitalsService.getByPatient({ patientId, forFilter, date, isAdmin, setResponse, setLoading })
 */
export function useVitalsByPatient(
  { patientId, forFilter, date, isAdmin } = {},
  options = {},
) {
  return useServiceQuery(
    queryKeys.vitals.byPatient(patientId, { forFilter, date }),
    () => vitalsService.getByPatient({ patientId, forFilter, date, isAdmin }),
    { enabled: Boolean(patientId), ...options },
  );
}

/**
 * Fetch a single vital record by ID.
 */
export function useVitalDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.vitals.detail(id),
    () => vitalsService.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

/**
 * Fetch vitals by patient ID (alternate endpoint).
 */
export function useVitalsByPatientId(patientId, options = {}) {
  return useServiceQuery(
    queryKeys.vitals.byPatientId(patientId),
    () => vitalsService.getByPatientId(patientId),
    { enabled: Boolean(patientId), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

/**
 * Create a new vital record.
 * Replaces: vitalsService.create(payload, { isAdmin, successMsg, setLoading, navigate })
 */
export function useCreateVital({ patientId, isAdmin, navigate } = {}) {
  return useServiceMutation(
    (payload) => vitalsService.create(payload, { isAdmin }),
    {
      invalidateKeys: [
        queryKeys.vitals.all(),
        ...(patientId ? [queryKeys.vitals.byPatient(patientId)] : []),
      ],
      successMsg: "Vital created!",
      navigate,
    },
  );
}

/**
 * Update an existing vital record.
 * Replaces: vitalsService.update(id, payload, { isAdmin, successMsg, setLoading, navigate })
 */
export function useUpdateVital({ id, patientId, isAdmin, navigate } = {}) {
  return useServiceMutation(
    (payload) => vitalsService.update(id, payload, { isAdmin }),
    {
      invalidateKeys: [
        queryKeys.vitals.all(),
        ...(id ? [queryKeys.vitals.detail(id)] : []),
        ...(patientId ? [queryKeys.vitals.byPatient(patientId)] : []),
      ],
      successMsg: "Vital updated!",
      navigate,
    },
  );
}

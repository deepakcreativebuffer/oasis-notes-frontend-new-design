/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { patientService } from "../services/patient";

// ─── Queries ──────────────────────────────────────────────────────────

/**
 * Fetch a single patient by ID.
 * Replaces: patientService.getById(id, { setResponse, setLoading })
 */
export function usePatientDetail(patientId, options = {}) {
  return useServiceQuery(
    queryKeys.patient.detail(patientId),
    () => patientService.getById(patientId),
    { enabled: Boolean(patientId), ...options },
  );
}

/**
 * Fetch assigned residents with pagination/search.
 * Replaces: patientService.listAssignedResidents({ search, limit, page, setResponse, setLoading })
 */
export function useAssignedResidents(filters = {}, options = {}) {
  const { search, limit, page, debouncedQuery, mars, queryString } = filters;
  return useServiceQuery(
    queryKeys.patient.assignedResidents(filters),
    () =>
      patientService.listAssignedResidents({
        search,
        limit,
        page,
        debouncedQuery,
        mars,
        queryString,
      }),
    { enabled: options.enabled ?? true, ...options },
  );
}

/**
 * Fetch patient tracking data.
 */
export function usePatientTracking(patientId, options = {}) {
  return useServiceQuery(
    queryKeys.patient.tracking(patientId),
    () => patientService.getPatientTracking(patientId),
    { enabled: Boolean(patientId), ...options },
  );
}

/**
 * Search patients.
 */
export function usePatientSearch(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patient.search(filters),
    () => patientService.listForSearch(filters),
    { enabled: Boolean(filters.search), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

/**
 * Create an appointment for a patient.
 */
export function useCreateAppointment(options = {}) {
  return useServiceMutation(
    (payload) => patientService.createAppointment(payload),
    {
      invalidateKeys: [queryKeys.patient.all()],
      successMsg: "Appointment created!",
      ...options,
    },
  );
}

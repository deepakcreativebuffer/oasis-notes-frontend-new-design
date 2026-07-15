/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { searchService } from "../services/search";

// ─── Queries ──────────────────────────────────────────────────────────

export function useSearchList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.search.list(filters),
    () =>
      searchService.list ? searchService.list(filters) : Promise.resolve([]),
    options,
  );
}

export function useSearchDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.search.detail(id),
    () =>
      searchService.getById ? searchService.getById(id) : Promise.resolve(null),
    { enabled: Boolean(id), ...options },
  );
}

export function useSearchPatient(id, options = {}) {
  return useServiceQuery(
    queryKeys.search.patient(id),
    () => searchService.getPatientById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useSearchDocuments(id, filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.search.documents(id, filters),
    () => searchService.getPatientDocuments(id, filters),
    { enabled: Boolean(id), ...options },
  );
}

export function useSearchVitals(id, filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.search.vitals(id, filters),
    () => searchService.getPatientVitals(id, filters),
    { enabled: Boolean(id), ...options },
  );
}

export function useSearchMedications(id, filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.search.medications(id, filters),
    () => searchService.getPatientMedications(id, filters),
    { enabled: Boolean(id), ...options },
  );
}

export function useSearchIntake(id, filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.search.intake(id, filters),
    () => searchService.getPatientIntake(id, filters),
    { enabled: Boolean(id), ...options },
  );
}

export function useSearchAppointments(id, filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.search.appointments(id, filters),
    () => searchService.getPatientAppointments(id, filters),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateSearch(options = {}) {
  return useServiceMutation(
    (payload) =>
      searchService.create
        ? searchService.create(payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.search.all()],
      successMsg: "Created successfully!",
      ...options,
    },
  );
}

export function useUpdateSearch(options = {}) {
  return useServiceMutation(
    ({ id, payload }) =>
      searchService.update
        ? searchService.update(id, payload)
        : Promise.resolve({ success: true }),
    {
      invalidateKeys: [queryKeys.search.all()],
      successMsg: "Updated successfully!",
      ...options,
    },
  );
}

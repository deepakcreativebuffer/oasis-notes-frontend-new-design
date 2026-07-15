/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { residentService } from "@/features/resident/services/resident";

// ─── Queries ──────────────────────────────────────────────────────────

export function useUpcomingAppointments(options = {}) {
  return useServiceQuery(
    queryKeys.resident.list("upcomingAppointments"),
    () => residentService.getUpcomingAppointments(),
    options,
  );
}

export function usePastAppointments(options = {}) {
  return useServiceQuery(
    queryKeys.resident.list("pastAppointments"),
    () => residentService.getPastAppointments(),
    options,
  );
}

export function useTodayMedications(options = {}) {
  return useServiceQuery(
    queryKeys.resident.list("todayMedications"),
    () => residentService.getTodayMedications(),
    options,
  );
}

export function useResidentPatientDetails(id, options = {}) {
  return useServiceQuery(
    queryKeys.resident.detail(id),
    () => residentService.getPatientDetails(id),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useBookAppointment(options = {}) {
  return useServiceMutation(
    (payload) => residentService.bookAppointment(payload),
    {
      invalidateKeys: [queryKeys.resident.list("upcomingAppointments")],
      ...options,
    },
  );
}

export function useCancelAppointment(options = {}) {
  return useServiceMutation((id) => residentService.cancelAppointment(id), {
    invalidateKeys: [
      queryKeys.resident.list("upcomingAppointments"),
      queryKeys.resident.list("pastAppointments"),
    ],
    ...options,
  });
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { therapyNotesService } from "../services/therapyNotes";

export function useTherapyNotesList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.therapyNotes.list(filters),
    () => therapyNotesService.list(filters),
    options,
  );
}

export function useTherapySessionList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.therapyNotes.list("session", filters),
    () => therapyNotesService.therapySession.list(filters),
    options,
  );
}

export function useMileageLogList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.therapyNotes.list("mileageLog", filters),
    () => therapyNotesService.mileageLog.list(filters),
    options,
  );
}

export function useTherapyNoteDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.therapyNotes.detail(id),
    () => therapyNotesService.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useCreateTherapyNote({ navigate } = {}) {
  return useServiceMutation((payload) => therapyNotesService.create(payload), {
    invalidateKeys: [queryKeys.therapyNotes.all()],
    navigate,
  });
}

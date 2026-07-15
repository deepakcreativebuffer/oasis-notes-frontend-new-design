/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { specialNotesService } from "../services/specialNotes";

export function useSpecialNotesList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.specialNotes.list(filters),
    () => specialNotesService.list(filters),
    options,
  );
}

// Example mutation
export function useCreateFirstAidChecklist({ isAdmin, navigate } = {}) {
  return useServiceMutation(
    (payload) =>
      specialNotesService.createFirstAidChecklist(payload, { isAdmin }),
    {
      invalidateKeys: [queryKeys.specialNotes.all()],
      navigate,
    },
  );
}

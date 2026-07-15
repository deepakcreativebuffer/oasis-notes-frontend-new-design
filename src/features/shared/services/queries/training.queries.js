/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import {
  useServiceMutation,
  useServiceDeleteMutation,
} from "@/lib/useServiceMutation";
import { trainingService } from "../services/training";

// ─── Queries ──────────────────────────────────────────────────────────

export function useInfectionControlList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.training.list(filters),
    () => trainingService.getInfectionControlList(filters),
    options,
  );
}

export function useInfectionControlDetail(id, employeeId, options = {}) {
  return useServiceQuery(
    queryKeys.training.detail(id || employeeId),
    () => trainingService.getInfectionControlById(id, { employeeId }),
    { enabled: Boolean(id || employeeId), ...options },
  );
}

export function useOnSiteList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.onSite.list(filters),
    () => trainingService.onsiteFacility.list(filters),
    options,
  );
}

export function useSkillsList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.skills.list(filters),
    () => trainingService.skillAndKnowledge.list(filters),
    options,
  );
}

export function useFallPreventionList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.fallPrevention.list(filters),
    () => trainingService.fallPrevention.list(filters),
    options,
  );
}

export function useTuberculosisList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.tuberculosis.list(filters),
    () => trainingService.tuberculosis.list(filters),
    options,
  );
}
// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateInfectionControl({ navigate } = {}) {
  return useServiceMutation(
    (payload) => trainingService.createInfectionControl(payload),
    {
      invalidateKeys: [queryKeys.training.all()],
      navigate,
    },
  );
}

export function useUpdateInfectionControl({ id, employeeId, navigate } = {}) {
  return useServiceMutation(
    (payload) =>
      trainingService.updateInfectionControl({ id, employeeId, payload }),
    {
      invalidateKeys: [queryKeys.training.all()],
      navigate,
    },
  );
}

export function useDeleteInfectionControl(options = {}) {
  return useServiceDeleteMutation(
    (id) => trainingService.deleteInfectionControl(id),
    {
      invalidateKeys: [queryKeys.training.all()],
      ...options,
    },
  );
}

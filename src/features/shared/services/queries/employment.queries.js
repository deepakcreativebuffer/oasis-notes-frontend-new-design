/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { employmentService } from "../services/employment";
import { adminDashboardService } from "@/features/admin/services/adminDashboard";

export function useEmploymentDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.employment.detail(id),
    () => employmentService.employment.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function usePersonalInfoList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.personalInfo.list(filters),
    () => employmentService.personalInfo.list(filters),
    options,
  );
}

export function useAppendixList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.appendix.list(filters),
    () => employmentService.appendix.list(filters),
    options,
  );
}

export function useForms2023List(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.forms2023.list(filters),
    () => employmentService.forms2023.list(filters),
    options,
  );
}

export function useLrc1031List(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.lrc1031.list(filters),
    () => employmentService.lrc1031.list(filters),
    options,
  );
}

export function useOfferLetterList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.offerLetter.list(filters),
    () => adminDashboardService.offerLetter.list(filters),
    options,
  );
}

export function useFw4List(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.fw4.list(filters),
    () => employmentService.fw4.list(filters),
    options,
  );
}

export function useApsList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.aps.list(filters),
    () => employmentService.aps.list(filters),
    options,
  );
}

export function useFw9List(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.fw9.list(filters),
    () => employmentService.fw9.list(filters),
    options,
  );
}

export function useI9List(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.i9.list(filters),
    () => employmentService.i9.list(filters),
    options,
  );
}

export function useReferenceCheckList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.referenceCheck.list(filters),
    () => employmentService.referenceCheck.list(filters),
    options,
  );
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { patientChartService } from "../services/patientChart";

// ─── Queries ──────────────────────────────────────────────────────────

export function useAsamAssessmentList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("asam", filters),
    () => patientChartService.asam.list(filters),
    options,
  );
}

export function useAsamAssessmentDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.detail("asam", id),
    () => patientChartService.asam.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useBhpProgressList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("bhpProgress", filters),
    () => patientChartService.bhpProgress.list(filters),
    options,
  );
}

export function useBhpProgressDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.detail("bhpProgress", id),
    () => patientChartService.bhpProgress.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useProgressNoteList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("progressNote", filters),
    () => patientChartService.progressNote.list(filters),
    options,
  );
}

export function useProgressNoteDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.detail("progressNote", id),
    () => patientChartService.progressNote.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

export function useDischargeSummaryList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("dischargeSummary", filters),
    () => patientChartService.dischargeSummary.list(filters),
    options,
  );
}

export function useAdlTrackingList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("adlTracking", filters),
    () => patientChartService.adlTracking.list(filters),
    options,
  );
}

export function useFinancialRecordList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("financialRecord", filters),
    () => patientChartService.financialRecord.list(filters),
    options,
  );
}

export function useStaffingNoteList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("staffingNote", filters),
    () => patientChartService.staffingNote.list(filters),
    options,
  );
}

export function useAuthorizationList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("authorization", filters),
    () => patientChartService.authorization.list(filters),
    options,
  );
}

export function useIncidentReportList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("incidentReport", filters),
    () => patientChartService.incidentReport.list(filters),
    options,
  );
}

export function useContactNoteList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("contactNote", filters),
    () => patientChartService.contactNote.list(filters),
    options,
  );
}

export function useDischargePlanningList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("dischargePlanning", filters),
    () => patientChartService.dischargePlanning.list(filters),
    options,
  );
}

export function useRecertificationOfNeedList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("recertificationOfNeed", filters),
    () => patientChartService.recertificationOfNeed.list(filters),
    { throwOnError: false, ...options },
  );
}

export function useReassessmentList(filters = {}, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.list("reassessment", filters),
    () => patientChartService.reassessment.list(filters),
    options,
  );
}

export function useReassessmentDetail(id, options = {}) {
  return useServiceQuery(
    queryKeys.patientChart.detail("reassessment", id),
    () => patientChartService.reassessment.getById(id),
    { enabled: Boolean(id), ...options },
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useCreateProgressNote({ isAdmin, navigate } = {}) {
  return useServiceMutation(
    (payload) => patientChartService.progressNote.create({ payload, isAdmin }),
    {
      invalidateKeys: [queryKeys.patientChart.all()],
      successMsg: "Progress Note created!",
      navigate,
    },
  );
}

export function useUpdateProgressNote({ id, navigate } = {}) {
  return useServiceMutation(
    (payload) => patientChartService.progressNote.update(id, payload),
    {
      invalidateKeys: [queryKeys.patientChart.all()],
      successMsg: "Progress Note updated!",
      navigate,
    },
  );
}

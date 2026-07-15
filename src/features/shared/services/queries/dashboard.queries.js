/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { dashboardService } from "../services/dashboard";

export function useEmployeeDashboard(options = {}) {
  return useServiceQuery(
    queryKeys.dashboard.all(),
    () => dashboardService.getEmployeeDashboard(),
    options,
  );
}

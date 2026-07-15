/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { facilityService } from "../services/facility";

export function useFacilityList(options = {}) {
  return useServiceQuery(
    queryKeys.facility.list(),
    () => facilityService.getFacility(),
    options,
  );
}

export function useCreateFacility({ navigate } = {}) {
  return useServiceMutation(
    (payload) => facilityService.createFacility(payload),
    {
      invalidateKeys: [queryKeys.facility.all()],
      navigate,
    },
  );
}

/** @format */

import { queryKeys } from "@/lib/queryKeys";
import { useServiceQuery } from "@/lib/useServiceQuery";
import { useServiceMutation } from "@/lib/useServiceMutation";
import { profileService } from "../services/profile";

// ─── Queries ──────────────────────────────────────────────────────────

export function useSubscriptionDetails(options = {}) {
  return useServiceQuery(
    queryKeys.profile.current(), // Or a more specific key if needed
    () => profileService.getSubscriptionDetails(),
    options,
  );
}

export function usePricingPlans(options = {}) {
  return useServiceQuery(
    ["profile", "pricingPlans"],
    () => profileService.getPricingPlans(),
    options,
  );
}

// ─── Mutations ────────────────────────────────────────────────────────

export function useRequestPlanChange(options = {}) {
  return useServiceMutation(
    (selectedPlan) => profileService.requestPlanChange(selectedPlan),
    options,
  );
}

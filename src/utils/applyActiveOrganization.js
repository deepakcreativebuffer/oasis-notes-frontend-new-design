/** @format */

import { setCurrentOrgId } from "../store/organizationSlice";
import { UpdateUserProfile } from "../store/authSlice";
import { queryClient } from "@/lib/queryClient";

/** Sync Redux org + profile.activeOrganizationId after switch or refresh. */
export function applyActiveOrganization(
  dispatch,
  profile,
  activeOrganizationId,
) {
  if (!activeOrganizationId) return;

  dispatch(setCurrentOrgId(activeOrganizationId));
  sessionStorage.setItem("activeOrgId", activeOrganizationId);

  if (profile && typeof profile === "object") {
    dispatch(
      UpdateUserProfile({
        ...profile,
        activeOrganizationId,
      }),
    );
  }

  // Wipe the React Query cache clean and force all active components
  // to instantly refetch with the new organization context,
  // preventing data leaks and avoiding the need for a hard refresh.
  queryClient.resetQueries();
}

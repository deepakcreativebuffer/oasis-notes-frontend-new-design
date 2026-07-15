/** @format */

/**
 * Resolve which organization is active for API calls.
 * Prefer server-provided preference (survives tab close); validate against enrolled orgs.
 */
export function pickActiveOrganizationId(profile) {
  const organizations = profile?.organizations;
  if (!organizations?.length) return null;

  const isMember = (id) => id && organizations.some((org) => org._id === id);

  if (isMember(profile.activeOrganizationId))
    return profile.activeOrganizationId;

  return organizations[0]._id;
}

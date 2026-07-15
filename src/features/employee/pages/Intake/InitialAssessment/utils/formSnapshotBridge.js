/** @format */

/**
 * Merges dynamic form group snapshots into the flat object passed to buildAssessmentPayload.
 * Extend as more sections migrate off individual useState hooks.
 */
export function mergeDynamicFormSnapshots(snapshots = {}) {
  return Object.values(snapshots).reduce(
    (merged, snapshot) => ({ ...merged, ...snapshot }),
    {},
  );
}

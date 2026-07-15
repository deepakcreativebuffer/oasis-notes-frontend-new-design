/** @format */

/**
 * Thin feature wrapper — delegates to global intakeService (no duplicate API layer).
 */
import { intakeService } from "@/features/shared/services/index";

export const assessmentService = {
  list: (options) => intakeService.initialAssessment.list(options),
  getById: (options) => intakeService.getInitialAssessment(options),
  create: (options) => intakeService.initialAssessment.create(options),
  update: (id, payload, options) =>
    intakeService.initialAssessment.update(id, payload, options),
  remove: (id, options) => intakeService.initialAssessment.remove(id, options),
};

export { intakeService };

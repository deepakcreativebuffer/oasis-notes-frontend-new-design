/** @format */

import { isResidentPortalUser } from "../permissions/portalRoles";

/**
 * Book appointment routes (employee books for patient; resident/guardian self-book).
 */
export function getBookAppointmentPath(userType, patientId) {
  if (isResidentPortalUser(userType)) {
    if (patientId) {
      return `/bookNewAppointment/${patientId}`;
    }
    return "/booknewappointment";
  }
  if (patientId) {
    return `/book-appointment/${patientId}`;
  }
  return "/book-appointment";
}

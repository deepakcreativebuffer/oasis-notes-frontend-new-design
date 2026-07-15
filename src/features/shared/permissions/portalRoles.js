/** @format */

import { ROLES } from "../constants";

/** Resident portal users (Patient + Guardian share resident routes/components). */
export const isResidentPortalUser = (userType) =>
  userType === ROLES.PATIENT || userType === ROLES.GUARDIAN;

export const isGuardian = (userType) => userType === ROLES.GUARDIAN;

export const isPatient = (userType) => userType === ROLES.PATIENT;

export const isAdmin = (userType) => userType === ROLES.ADMIN;

export const isEmployee = (userType) => userType === ROLES.EMPLOYEE;

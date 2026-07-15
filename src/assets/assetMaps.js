/** @format */
import {
  adminDashboardContactsUser,
  adminDashboardContactsFilter,
  adminDashboardContactsStaff,
  adminDashboardContactsNote,
  adminDashboardContactsHome,
  adminDashboardContactsValues,
  adminDashboardContect,
  adminDashboardTracking,
  adminDashboardLogs,
  adminDashboardSpecial,
  adminDashboardUser,
  adminDashboardAdmin,
  adminDashboardMessage,
  adminDashboardCall,
  adminDashboardUser1,
  adminDashboardHome,
  adminDashboardClock,
  adminDashboardTrackingWarning,
  adminDashboardTrackingOk,
  adminNavBarEditProfile,
  adminNavBarTerms,
  adminNavBarPreference,
  adminNotifiation,
  adminConnectonFormBackground,
  adminConnectonFormLinkSent,
  adminChangePassword,
} from "./adminAssets";
import {
  residentBody1,
  residentBody2,
  residentBody3,
  residentBody4,
  residentBody5,
  residentBody6,
  residentBody7,
  residentBody8,
  residentIntake1,
  residentIntake2,
  residentInatke3,
  residentInatke4,
  residentInatke5,
  residentIntake6,
  residentNurse1,
  residentImage105,
  residentFormupload,
  residentSend,
} from "./residentAssets";
import {
  vitalsClock,
  vitalsHand,
  vitalsHeart,
  vitalsHeight,
  vitalsLast,
  vitalsLungs,
  vitalsO2,
  vitalsThermometer,
} from "./vitalsAssets";
import { backgroundIssa, issaLogoLogin } from "./formAssets";

export const ADMIN_ASSET_PATHS = {
  "/Dashboard/contacts/user.png": adminDashboardContactsUser,
  "/Dashboard/contacts/filter.png": adminDashboardContactsFilter,
  "/Dashboard/contacts/staff.png": adminDashboardContactsStaff,
  "/Dashboard/contacts/note.png": adminDashboardContactsNote,
  "/Dashboard/contacts/Home.png": adminDashboardContactsHome,
  "/Dashboard/contacts/values.png": adminDashboardContactsValues,
  "/Dashboard/contect.png": adminDashboardContect,
  "/Dashboard/tracking.png": adminDashboardTracking,
  "/Dashboard/logs.png": adminDashboardLogs,
  "/Dashboard/special.png": adminDashboardSpecial,
  "/Dashboard/user.png": adminDashboardUser,
  "/Dashboard/admin.png": adminDashboardAdmin,
  "/Dashboard/message.png": adminDashboardMessage,
  "/Dashboard/call.png": adminDashboardCall,
  "/Dashboard/user1.png": adminDashboardUser1,
  "/Dashboard/home.png": adminDashboardHome,
  "/Dashboard/clock.png": adminDashboardClock,
  "/Dashboard/Tracking/warning.png": adminDashboardTrackingWarning,
  "/Dashboard/Tracking/ok.png": adminDashboardTrackingOk,
  "/NavBar/editProfile.png": adminNavBarEditProfile,
  "/NavBar/terms.png": adminNavBarTerms,
  "/NavBar/preference.png": adminNavBarPreference,
  "/notifiation.png": adminNotifiation,
  "/ConnectonForm/background.png": adminConnectonFormBackground,
  "/ConnectonForm/LinkSent.png": adminConnectonFormLinkSent,
  "/public/Dashboard/contacts/user.png": adminDashboardContactsUser,
  "/public/Dashboard/user.png": adminDashboardUser,
  "/public/Dashboard/admin.png": adminDashboardAdmin,
  "/public/Dashboard/message.png": adminDashboardMessage,
  "/public/Dashboard/call.png": adminDashboardCall,
  "/public/Dashboard/user1.png": adminDashboardUser1,
  "/public/Dashboard/home.png": adminDashboardHome,
};

export const RESIDENT_ASSETS = {
  "/resident/body1.png": residentBody1,
  "/resident/body2.png": residentBody2,
  "/resident/body3.png": residentBody3,
  "/resident/body4.png": residentBody4,
  "/resident/body5.png": residentBody5,
  "/resident/body6.png": residentBody6,
  "/resident/body7.png": residentBody7,
  "/resident/body8.png": residentBody8,
  body1: residentBody1,
  body2: residentBody2,
  body3: residentBody3,
  body4: residentBody4,
  body5: residentBody5,
  body6: residentBody6,
  body7: residentBody7,
  body8: residentBody8,
  intake1: residentIntake1,
  intake2: residentIntake2,
  intake3: residentInatke3,
  intake4: residentInatke4,
  intake5: residentInatke5,
  intake6: residentIntake6,
  nurse1: residentNurse1,
  ibutton: residentImage105,
  formupload: residentFormupload,
  sendSvg: residentSend,
  changePasswordImg: adminChangePassword,
};

export const VITAL_ASSET_PATHS = {
  "/Dashboard2/Vitals/thermameter.png": vitalsThermometer,
  "/Dashboard2/Vitals/heart.png": vitalsHeart,
  "/Dashboard2/Vitals/lungs.png": vitalsLungs,
  "/Dashboard2/Vitals/hand.png": vitalsHand,
  "/Dashboard2/Vitals/o2.png": vitalsO2,
  "/Dashboard2/Vitals/clock.png": vitalsClock,
  "/Dashboard2/Vitals/last.png": vitalsLast,
  "/Dashboard2/Vitals/hieght.png": vitalsHeight,
};

export const FORM_ASSET_PATHS = {
  "/form/background_issa.jpg": backgroundIssa,
  "./background_issa.jpg": backgroundIssa,
  "background_issa.jpg": backgroundIssa,
  "/form/issa_logo_login.jpg": issaLogoLogin,
  "./issa_logo_login.jpg": issaLogoLogin,
  "issa_logo_login.jpg": issaLogoLogin,
};

/** Resolve legacy absolute/public-style admin image paths to bundled URLs. */
export const resolveAdminAssetPath = (assetPath) =>
  ADMIN_ASSET_PATHS[assetPath] || assetPath;

/** Resolve legacy vitals dashboard image paths to bundled URLs. */
export const resolveVitalAssetPath = (assetPath) =>
  VITAL_ASSET_PATHS[assetPath] || assetPath;

/** Resolve legacy resident form image paths to bundled URLs. */
export const resolveFormAssetPath = (assetPath) =>
  FORM_ASSET_PATHS[assetPath] || assetPath;

export { backgroundIssa, issaLogoLogin };

export const pto = adminDashboardContactsValues;
export const emP = adminDashboardContactsUser;
export const staff = adminDashboardContactsStaff;
export const notePng = adminDashboardContactsNote;
export const HomePng = adminDashboardContactsHome;
export const contectPng = adminDashboardContect;
export const trackingPng = adminDashboardTracking;
export const logsPng = adminDashboardLogs;
export const specialPng = adminDashboardSpecial;

export const body1 = residentBody1;
export const body2 = residentBody2;
export const body3 = residentBody3;
export const body4 = residentBody4;
export const body5 = residentBody5;
export const body6 = residentBody6;
export const body7 = residentBody7;
export const body8 = residentBody8;
export const intake1 = residentIntake1;
export const intake2 = residentIntake2;
export const intake3 = residentInatke3;
export const intake4 = residentInatke4;
export const intake5 = residentInatke5;
export const intake6 = residentIntake6;
export const nurse1 = residentNurse1;
export const ibutton = residentImage105;
export const formupload = residentFormupload;
export const sendSvg = residentSend;
export const changePasswordImg = adminChangePassword;

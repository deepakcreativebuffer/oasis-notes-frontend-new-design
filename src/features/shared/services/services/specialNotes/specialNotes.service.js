/** @format */

import { ADMIN_APIS, COMMON_APIS, EMPLOYEE_APIS } from "../../Apis";
import { getApi, updateApi, createApi } from "../../common/common.api";
import { createForRole } from "../../core/roleAware";
import { pickUiOptions } from "../../core/uiOptions";

const createUpdateMethod =
  (context, urlFn) =>
  (id, payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return updateApi({
      url: urlFn(id),
      payload,
      context,
      ...ui,
    });
  };

const createRoleAwareMethod =
  (context, adminUrl, employeeUrl) =>
  (payload, options = {}) => {
    const { params, ui } = pickUiOptions({ payload, ...options });
    return createForRole(
      params.isAdmin,
      adminUrl,
      employeeUrl,
      params.payload ?? payload,
      { context, ...ui },
    );
  };

const createStaticMethod =
  (context, url) =>
  (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url,
      payload,
      context,
      ...ui,
    });
  };

export const specialNotesService = {
  list: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_NOTES(
        params.page,
        params.limit,
        params.debouncedQuery,
      ),
      context: "Special Notes: List",
      ...ui,
    });
  },

  getAdminUsers: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.GET_USER,
      context: "Special Notes: Admin Users",
      ...ui,
    });
  },

  createFirstAidChecklist: createRoleAwareMethod(
    "Special Notes: First Aid Checklist Create",
    ADMIN_APIS.ADMIN_ADD_FIRST_AID_CHECKLIST,
    EMPLOYEE_APIS.EMPLOYEE_ADD_FIRST_AID_CHECKLIST,
  ),

  updateFirstAidChecklist: createUpdateMethod(
    "Special Notes: First Aid Checklist Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITFIRSTAIDCHECKLIST,
  ),

  createRefrigeratorMonitoring: createRoleAwareMethod(
    "Special Notes: Refrigerator Monitoring Create",
    ADMIN_APIS.ADMIN_ADD_REFRIGERATOR_MONITORING,
    EMPLOYEE_APIS.EMPLOYEE_ADD_REFRIGERATOR_MONITORING,
  ),

  updateRefrigeratorMonitoring: createUpdateMethod(
    "Special Notes: Refrigerator Monitoring Update",
    EMPLOYEE_APIS.EMPLOYEE_UPDATEREFREGIRATORTEMPARATUREMONITORING,
  ),

  createTemperatureLog: createStaticMethod(
    "Special Notes: Temperature Log Create",
    COMMON_APIS.GET_TEMPERATURE_LOG(),
  ),

  updateTemperatureLog: createUpdateMethod(
    "Special Notes: Temperature Log Update",
    COMMON_APIS.GET_TEMPERATURE_LOG_1,
  ),

  createEvacuationAndFireDrill: createRoleAwareMethod(
    "Special Notes: Evacuation And Fire Drill Create",
    ADMIN_APIS.ADMIN_ADD_EVACUATION_AND_FIRE_DRILL,
    EMPLOYEE_APIS.EMPLOYEE_ADD_EVACUATION_AND_FIRE_DRILL,
  ),

  updateEvacuationAndFireDrill: createUpdateMethod(
    "Special Notes: Evacuation And Fire Drill Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITEVACUATIONANDFIREDRILL,
  ),

  createDisasterDrill: createRoleAwareMethod(
    "Special Notes: Disaster Drill Create",
    ADMIN_APIS.ADMIN_ADD_DISASTER_DRILL,
    EMPLOYEE_APIS.EMPLOYEE_ADD_DISASTER_DRILL,
  ),

  updateDisasterDrill: createUpdateMethod(
    "Special Notes: Disaster Drill Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITDISASTERDRILL,
  ),

  createFireEquipmentMonitoring: createRoleAwareMethod(
    "Special Notes: Fire Equipment Monitoring Create",
    ADMIN_APIS.ADMIN_ADD_FIRE_EQUIPMENT_MONITORING,
    EMPLOYEE_APIS.EMPLOYEE_ADD_FIRE_EQUIPMENT_MONITORING,
  ),

  updateFireEquipmentMonitoring: createUpdateMethod(
    "Special Notes: Fire Equipment Monitoring Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITFIREEQUIPEMENTMONITORING,
  ),

  createWeeklyVehicleInspection: createStaticMethod(
    "Special Notes: Weekly Vehicle Inspection Create",
    EMPLOYEE_APIS.EMPLOYEE_ADDWEEKLYVEHICLEINSPECTIONCHECKLIST(),
  ),

  updateWeeklyVehicleInspection: createUpdateMethod(
    "Special Notes: Weekly Vehicle Inspection Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITWEEKLYVEHICLEINSPECTIONCHECKLIST,
  ),

  createVanEmergencyInformation: createRoleAwareMethod(
    "Special Notes: Van Emergency Information Create",
    ADMIN_APIS.ADMIN_ADD_VAN_EMERGENCY,
    EMPLOYEE_APIS.EMPLOYEE_ADD_VAN_EMERGENCY,
  ),

  updateVanEmergencyInformation: createUpdateMethod(
    "Special Notes: Van Emergency Information Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITVANEMERGENCYINFORMATIONFORM,
  ),

  createInfectiousData: createRoleAwareMethod(
    "Special Notes: Infectious Data Create",
    ADMIN_APIS.ADMIN_ADD_INFECTIOUS_DATA,
    EMPLOYEE_APIS.EMPLOYEE_ADD_INFECTIOUS_DATA,
  ),

  updateInfectiousData: createUpdateMethod(
    "Special Notes: Infectious Data Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITINFECTIOUSDATA,
  ),

  createDisasterPlanReview: createRoleAwareMethod(
    "Special Notes: Disaster Plan Review Create",
    ADMIN_APIS.ADMIN_ADD_DISASTER_PLAN_REVIEW,
    EMPLOYEE_APIS.EMPLOYEE_ADD_DISASTER_PLAN_REVIEW,
  ),

  updateDisasterPlanReview: createUpdateMethod(
    "Special Notes: Disaster Plan Review Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITDISASTERPLANREVIEW,
  ),

  createQualityManagement: createRoleAwareMethod(
    "Special Notes: Quality Management Create",
    ADMIN_APIS.ADMIN_ADD_QUALITY_MANAGEMENT,
    EMPLOYEE_APIS.EMPLOYEE_ADD_QUALITY_MANAGEMENT,
  ),

  updateQualityManagement: createUpdateMethod(
    "Special Notes: Quality Management Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITQUALITYMANAGEMENT,
  ),

  createMonthlyVehicleInspection: createRoleAwareMethod(
    "Special Notes: Monthly Vehicle Inspection Create",
    ADMIN_APIS.ADMIN_ADD_MONTHLY_VEHICLE_INSPECTION,
    EMPLOYEE_APIS.EMPLOYEE_ADD_MONTHLY_VEHICLE_INSPECTION,
  ),

  updateMonthlyVehicleInspection: createUpdateMethod(
    "Special Notes: Monthly Vehicle Inspection Update",
    EMPLOYEE_APIS.EMPLOYEE_EDITMONTHLYVEHICLEINSPECTION,
  ),
};

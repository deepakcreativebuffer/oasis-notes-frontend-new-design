/** @format */

import { ADMIN_APIS, COMMON_APIS, RESIDENT_APIS } from "../../Apis";
import { getApi, createApi } from "../../common/common.api";
import { pickUiOptions } from "../../core/uiOptions";

export const profileService = {
  getSubscriptionDetails: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: ADMIN_APIS.ADMIN_GET_SUBSCRIPTION_DETAILS(),
      context: "Profile: Subscription",
      ...ui,
    });
  },

  getPatientAllergies: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: RESIDENT_APIS.PATIENT_GETPROFILE(),
      context: "Profile: Patient Allergies",
      ...ui,
    });
  },

  getPricingPlans: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.PRICING_GETPRICING(),
      context: "Profile: Pricing",
      ...ui,
    });
  },

  requestSubscriptionStatusChange: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_STRIPE_SUBSCRIPTION_CHANGE_STATUS_REQUEST(),
      context: "Profile: Subscription Status Change",
      ...ui,
    });
  },

  requestPlanChange: (selectedPlan, options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_STRIPE_SUBSCRIPTION_CHANGE_PLAN_REQUEST(
        selectedPlan,
      ),
      context: "Profile: Plan Change",
      ...ui,
    });
  },

  openStripeInvoice: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_STRIPE_INVOICE(),
      context: "Profile: Stripe Invoice",
      ...ui,
    });
  },

  openStripePaymentMethod: (options = {}) => {
    const { ui } = pickUiOptions(options);
    return getApi({
      url: COMMON_APIS.GET_STRIPE_PAYMENT_METHOD(),
      context: "Profile: Stripe Payment Method",
      ...ui,
    });
  },

  confirmSubscriptionStatus: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: COMMON_APIS.GET_STRIPE_SUBSCRIPTION_CONFIRM_STATUS(),
      payload,
      context: "Profile: Confirm Subscription Status",
      ...ui,
    });
  },

  confirmPlanChange: (payload, options = {}) => {
    const { ui } = pickUiOptions(options);
    return createApi({
      url: COMMON_APIS.GET_STRIPE_SUBSCRIPTION_CONFIRM_PLAN(),
      payload,
      context: "Profile: Confirm Plan Change",
      ...ui,
    });
  },
};

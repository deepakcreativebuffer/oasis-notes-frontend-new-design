/** @format */

import api from "../baseApi";
import { handleApiRequest } from "../core/errorHandler";
import { EMPLOYEE_APIS } from "../Apis";
import { showNotification } from "@/utils";

/**
 * Fetch data by URL and optionally set component state.
 * Replaces legacy components/api/Api.js getData.
 */
const normalizeGetDataState = (payload) => {
  if (payload == null) return {};
  if (Array.isArray(payload)) return { data: payload };
  if (typeof payload !== "object") return { data: payload };
  if (payload.data !== undefined) return payload;
  // Legacy APIs return { status: 200, date, ... } without a nested `data` key
  if (payload.status === 200) {
    const { status, message, ...record } = payload;
    return {
      status,
      ...(message != null && { message }),
      data: record,
    };
  }
  return { data: payload };
};

export const getData = async (setData, url) => {
  const result = await handleApiRequest(() => api.get(url), `GET Data: ${url}`);

  if (result.success) {
    const normalized = normalizeGetDataState(result.data);
    if (setData) setData(normalized);
    return normalized;
  }

  if (setData) setData({});
  return result;
};

/**
 * Fetch MARs data by month and year for a patient.
 * Replaces legacy components/api/Api.js getMarsDataByMonthAndYear.
 */
export const getMarsDataByMonthAndYear = async (
  setData,
  patientId,
  body,
  setIsMarsLoading,
) => {
  if (setIsMarsLoading) setIsMarsLoading(true);

  const result = await handleApiRequest(
    () => api.post(EMPLOYEE_APIS.EMPLOYEE_GETMARSBYMONTH(patientId), body),
    "Fetch Mars Data",
  );

  if (result.success) {
    const updatedData = {
      ...result.data,
      data: {
        ...(result.data?.data || result.data),
      },
    };
    if (setData) setData(updatedData);
  } else {
    showNotification(result);
  }

  if (setIsMarsLoading) setIsMarsLoading(false);
  return result;
};

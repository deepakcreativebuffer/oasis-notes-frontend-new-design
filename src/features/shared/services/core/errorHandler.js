import { normalizeNetworkError } from "./networkErrorHandler";

/**
 * Returns a user-friendly error message from any API error.
 */
export const getUserFriendlyMessage = (error) => {
  const normalized = normalizeNetworkError(error);
  return normalized.message;
};

/**
 * Normalizes all API errors to a consistent format.
 */
export const normalizeApiError = (error, context = "API Request") => {
  return normalizeNetworkError(error, context);
};

const isPaginatedDocsPayload = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Array.isArray(value.docs);

/**
 * Extracts the business payload from an axios response.
 * Detail endpoints often return `{ patientId, balance, data: { docs, totalPages } }`
 * where `data` is pagination — not the full record.
 */
export const extractApiPayload = (response) => {
  const body = response?.data;
  if (body == null || typeof body !== "object" || Array.isArray(body)) {
    return body ?? null;
  }

  const inner = body.data;
  if (!isPaginatedDocsPayload(inner)) {
    if (Array.isArray(inner) && body.meta) {
      return { docs: inner, totalPages: body.meta.totalPages || 1 };
    }
    if (body.data !== undefined) {
      if (
        typeof body.data === "object" &&
        body.data !== null &&
        !Array.isArray(body.data)
      ) {
        if (body.patientDetail !== undefined) {
          body.data.patientDetail = body.patientDetail;
        }
      }
      return body.data;
    }
    return body;
  }

  const hasRecordFields =
    body.patientId != null ||
    body.employeeId != null ||
    body.signers != null ||
    body.balance != null ||
    body.saveAsDraft != null;

  if (!hasRecordFields) {
    return inner;
  }

  const { data: paginated, ...record } = body;
  const paginatedKey =
    body.skillsAndKnowledge != null || record.employeeId != null
      ? "skillsAndKnowledge"
      : "transactions";

  return { ...record, [paginatedKey]: paginated };
};

/**
 * Executes an API request promise safely, normalizes the response/error, and logs if needed.
 */
export const handleApiRequest = async (apiCall, context = "API Request") => {
  try {
    const response = await apiCall();

    // Standardizing success response
    return {
      success: true,
      data: extractApiPayload(response),
      patientDetail: response?.data?.patientDetail,
      message: response?.data?.message || "Success",
      status: response?.status,
    };
  } catch (error) {
    return normalizeApiError(error, context);
  }
};

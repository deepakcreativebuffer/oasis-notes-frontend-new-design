/** @format */

import api from "../baseApi";
import { COMMON_APIS } from "../Apis";
import { handleApiRequest } from "../core/errorHandler";

export const startPdfJob = (payload) =>
  handleApiRequest(
    () => api.post(COMMON_APIS.START_PDF_JOB, payload),
    "Start PDF Job",
  );

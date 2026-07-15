/** @format */

import { EMPLOYEE_APIS } from "../../Apis";
import { getApi } from "../../common/common.api";
import { buildQueryString } from "../../core/queryBuilder";
import { pickUiOptions } from "../../core/uiOptions";

export const receiptsService = {
  list: (options = {}) => {
    const { params, ui } = pickUiOptions(options);
    const { page, limit, debouncedQuery, fromDate, toDate } = params;
    const query = buildQueryString({
      page,
      limit,
      searchQuery: debouncedQuery,
      ...(fromDate ? { fromDate: new Date(fromDate) } : {}),
      ...(toDate ? { toDate: new Date(toDate) } : {}),
    }).replace("?", "");

    return getApi({
      url: EMPLOYEE_APIS.EMPLOYEE_GETALLRECEIPT(query),
      context: "Receipts: List",
      ...ui,
    });
  },
};

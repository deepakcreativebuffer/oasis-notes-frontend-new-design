/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Import AFTER mocks are registered.
import {
  employeeService,
  employeeShiftsService,
  getActivitySchedule,
  deleteActivityShiftById,
  addEmployeeActivitySchedule,
} from "./index";

// ─── Hoisted mock handles ───────────────────────────────────────────────
// Every variable referenced inside a vi.mock factory must come from vi.hoisted.
const h = vi.hoisted(() => {
  const mk = (val) => vi.fn(() => Promise.resolve(val));
  return {
    getApi: mk({ success: true, data: "get" }),
    createApi: mk({ success: true, data: "create" }),
    apiGet: mk({ data: "raw-get" }),
    apiPost: mk({ data: "raw-post" }),
    apiPut: mk({ data: "raw-put" }),
    apiDelete: mk({ data: "raw-delete" }),
    // handleApiRequest just runs the request fn and returns a normalized result.
    handleApiRequest: vi.fn(async (fn, _ctx) => {
      const data = await fn();
      return { success: true, data };
    }),
    showNotification: vi.fn(),
  };
});

// Mock the common HTTP helpers used directly by employee.service.js.
vi.mock("@/features/shared/services/common/common.api", () => ({
  getApi: h.getApi,
  createApi: h.createApi,
}));

// Endpoint constants imported by employee.service.js. Keep them real-ish so we
// can assert the service forwards the right URL strings.
vi.mock("@/features/shared/services/Apis", () => ({
  EMPLOYEE_APIS: {
    EMPLOYEE_GETEMPLOYEE: () => "employee/getEmployee",
    EMPLOYEE_GETEMPLOYEE_2: () => "employee/getActive",
    EMPLOYEE_GETPROFILE: () => "employee/getProfile",
    GET_USER: "employee/getUser",
    EMPLOYEE_GET_ACTIVE_EMPLOYEES: "employee/active",
    EMPLOYEE_GETPATIENT: (q) => `employee/getPatient?q=${q}`,
    GET_EMPLOYEE_ALLNOTIFICATION: () => "employee/notifications",
    EMPLOYEE_CREATEUPLOADDOCUMENTFOREMPLOYEE: () => "employee/uploadDoc",
  },
  ADMIN_APIS: {
    ADMIN_GET_EMPLOYEE_ACTIVE: "admin/active",
    ADMIN_LISTEMPLOYEES: (limit, page, query) =>
      `admin/list?limit=${limit}&page=${page}&query=${query}`,
    ADMIN_LISTEMPLOYEES_1: (limit, search) =>
      `admin/search?limit=${limit}&search=${search}`,
    ADMIN_ALL_NOTIFICATION: "admin/notifications",
  },
  COMMON_APIS: {
    GET_USERS: (qs) => `common/users?${qs}`,
    SHIFT_DELETE: (id) => `Shift/delete/${id}`,
  },
}));

// shifts.service.js pulls api / EMPLOYEE_APIS / COMMON_APIS / handleApiRequest
// from the big shared-services barrel. Mock the whole barrel to stay offline.
vi.mock("@/features/shared/services", () => ({
  api: {
    get: h.apiGet,
    post: h.apiPost,
    put: h.apiPut,
    delete: h.apiDelete,
  },
  handleApiRequest: h.handleApiRequest,
  EMPLOYEE_APIS: {
    GET_ACTIVITY_SCHEDULE: "employee/getActivitySchedule",
    EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE: "employee/activitySchedule",
    EMPLOYEE_ADDACTIVITYSCHEDULE: "employee/addActivitySchedule",
    EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE_1: (m, y, f) =>
      `employee/activitySchedule/${m}/${y}/${f}`,
  },
  COMMON_APIS: {
    SHIFT_DELETE: (id) => `Shift/delete/${id}`,
  },
}));

vi.mock("@/utils", () => ({
  showNotification: h.showNotification,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("employee services barrel (index.js)", () => {
  it("re-exports employeeService as an object of functions", () => {
    expect(employeeService).toBeTruthy();
    expect(typeof employeeService.getEmployee).toBe("function");
    expect(typeof employeeService.uploadDocumentForEmployee).toBe("function");
  });

  it("re-exports employeeShiftsService and its named members", () => {
    expect(employeeShiftsService).toBeTruthy();
    expect(typeof employeeShiftsService.getActivitySchedule).toBe("function");
    // `export *` and the explicit named export both resolve.
    expect(typeof getActivitySchedule).toBe("function");
    expect(typeof deleteActivityShiftById).toBe("function");
    expect(typeof addEmployeeActivitySchedule).toBe("function");
  });

  it("named shift exports reference the same impls on the service object", () => {
    expect(getActivitySchedule).toBe(employeeShiftsService.getActivitySchedule);
  });
});

describe("employeeService — URL/payload forwarding", () => {
  it("getEmployee forwards the employee endpoint and context to getApi", async () => {
    const res = await employeeService.getEmployee();
    expect(h.getApi).toHaveBeenCalledTimes(1);
    const arg = h.getApi.mock.calls[0][0];
    expect(arg.url).toBe("employee/getEmployee");
    expect(arg.context).toBe("Employee: Get");
    expect(res).toEqual({ success: true, data: "get" });
  });

  it("listActive resolves the ADMIN endpoint when params.isAdmin is true", async () => {
    await employeeService.listActive({ isAdmin: true });
    // WHY: resolveRoleEndpoint must pick the admin URL for admins.
    expect(h.getApi.mock.calls[0][0].url).toBe("admin/active");
  });

  it("listActive resolves the EMPLOYEE endpoint when not admin", async () => {
    await employeeService.listActive({ isAdmin: false });
    expect(h.getApi.mock.calls[0][0].url).toBe("employee/active");
  });

  it("listPaginated injects limit/page/query into the admin list URL", async () => {
    await employeeService.listPaginated({ limit: 10, page: 2, query: "abc" });
    expect(h.getApi.mock.calls[0][0].url).toBe(
      "admin/list?limit=10&page=2&query=abc",
    );
  });

  it("searchPatients encodes the query argument into the URL", async () => {
    await employeeService.searchPatients("john");
    expect(h.getApi.mock.calls[0][0].url).toBe("employee/getPatient?q=john");
  });

  it("getNotifications uses admin notifications endpoint for admins", async () => {
    await employeeService.getNotifications({ isAdmin: true });
    expect(h.getApi.mock.calls[0][0].url).toBe("admin/notifications");
  });

  it("listUsers passes the queryString param through COMMON_APIS.GET_USERS", async () => {
    await employeeService.listUsers({ queryString: "role=nurse" });
    expect(h.getApi.mock.calls[0][0].url).toBe("common/users?role=nurse");
  });

  it("separates UI callbacks (signal) from business params via pickUiOptions", async () => {
    const signal = "abort-signal";
    await employeeService.getProfile({ signal });
    // signal is a recognized UI option and is spread onto the getApi arg.
    expect(h.getApi.mock.calls[0][0].signal).toBe(signal);
  });

  it("uploadDocumentForEmployee forwards payload to createApi", async () => {
    const payload = { fileName: "fake.pdf" };
    const res = await employeeService.uploadDocumentForEmployee(payload);
    expect(h.createApi).toHaveBeenCalledTimes(1);
    const arg = h.createApi.mock.calls[0][0];
    expect(arg.url).toBe("employee/uploadDoc");
    expect(arg.payload).toEqual(payload);
    expect(res).toEqual({ success: true, data: "create" });
  });
});

describe("employeeShiftsService — request wiring", () => {
  it("getActivitySchedule issues a GET via handleApiRequest", async () => {
    const res = await employeeShiftsService.getActivitySchedule();
    expect(h.handleApiRequest).toHaveBeenCalledTimes(1);
    // The wrapped request fn calls api.get with the schedule endpoint.
    expect(h.apiGet).toHaveBeenCalledWith("employee/getActivitySchedule");
    expect(res.success).toBe(true);
  });

  it("addEmployeeActivitySchedule POSTs the payload", async () => {
    const payload = { day: "Mon" };
    await employeeShiftsService.addEmployeeActivitySchedule(payload);
    expect(h.apiPost).toHaveBeenCalledWith(
      "employee/addActivitySchedule",
      payload,
    );
  });

  it("deleteActivityShiftById DELETEs the SHIFT_DELETE url", async () => {
    await employeeShiftsService.deleteActivityShiftById("sh-1");
    expect(h.apiDelete).toHaveBeenCalledWith("Shift/delete/sh-1");
  });

  it("getActivityScheduleForEmployee passes params as a GET query object", async () => {
    const params = { month: "06" };
    await employeeShiftsService.getActivityScheduleForEmployee(params);
    expect(h.apiGet).toHaveBeenCalledWith("employee/activitySchedule", {
      params,
    });
  });

  it("getActivityScheduleDetails builds the month/year/facility URL", async () => {
    await employeeShiftsService.getActivityScheduleDetails(
      "06",
      "2026",
      "fac1",
    );
    expect(h.apiGet).toHaveBeenCalledWith(
      "employee/activitySchedule/06/2026/fac1",
    );
  });

  it("uploadEmployeeTracking toggles setLoading and navigates back on success", async () => {
    const setLoading = vi.fn();
    const navigate = vi.fn();
    const result = await employeeShiftsService.uploadEmployeeTracking({
      url: "track/upload",
      formData: { a: 1 },
      setLoading,
      navigate,
    });
    expect(h.apiPost).toHaveBeenCalledWith(
      "track/upload",
      { a: 1 },
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenLastCalledWith(false);
    expect(navigate).toHaveBeenCalledWith(-1);
    expect(result.success).toBe(true);
  });

  it("uploadEmployeeTracking shows a notification (no navigate) on failure", async () => {
    // Force a failing result for this one call.
    h.handleApiRequest.mockResolvedValueOnce({
      success: false,
      message: "boom",
    });
    const navigate = vi.fn();
    const result = await employeeShiftsService.uploadEmployeeTracking({
      url: "track/upload",
      formData: {},
      navigate,
    });
    expect(result.success).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
    expect(h.showNotification).toHaveBeenCalledWith({
      success: false,
      message: "boom",
    });
  });

  it("updateEmployeeTracking PUTs and navigates back on success", async () => {
    const navigate = vi.fn();
    await employeeShiftsService.updateEmployeeTracking({
      url: "track/update",
      formData: { b: 2 },
      navigate,
    });
    expect(h.apiPut).toHaveBeenCalledWith(
      "track/update",
      { b: 2 },
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});

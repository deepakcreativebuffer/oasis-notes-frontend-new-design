/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  employeeShiftsService,
  getActivitySchedule,
  UploadEmployeeTracking,
  updateEmployeeTracking,
  getActivityScheduleForEmployee,
  addEmployeeActivitySchedule,
  getActivityScheduleDetails,
  deleteActivityShiftById,
} from "./shifts.service";

// Mock the shared services barrel that the service imports from. We control
// `api`, `handleApiRequest`, and the endpoint constants so we can assert the
// service forwards the right url/payload/options. Hoisted because the mock
// factory below references these spies.
const { mockApi, mockHandleApiRequest, EMPLOYEE_APIS, COMMON_APIS } =
  vi.hoisted(() => ({
    mockApi: {
      get: vi.fn(() => Promise.resolve({ data: "GET_RAW" })),
      post: vi.fn(() => Promise.resolve({ data: "POST_RAW" })),
      put: vi.fn(() => Promise.resolve({ data: "PUT_RAW" })),
      delete: vi.fn(() => Promise.resolve({ data: "DELETE_RAW" })),
    },
    // handleApiRequest just invokes the passed thunk and returns a result
    // envelope. We let tests override the return value per-call.
    mockHandleApiRequest: vi.fn(async (fn) => {
      await fn();
      return { success: true, message: "ok", data: "result" };
    }),
    EMPLOYEE_APIS: {
      GET_ACTIVITY_SCHEDULE: "employee/getActivitySchedule",
      EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE:
        "employee/getActivityScheduleForEmployee",
      EMPLOYEE_ADDACTIVITYSCHEDULE: "employee/addActivitySchedule",
      EMPLOYEE_GETACTIVITYSCHEDULEFOREMPLOYEE_1: (month, year, facilityId) =>
        `employee/activitySchedule/${month}/${year}/${facilityId}`,
    },
    COMMON_APIS: {
      SHIFT_DELETE: (id) => `Shift/delete/${id}`,
    },
  }));

vi.mock("@/features/shared/services", () => ({
  api: mockApi,
  handleApiRequest: mockHandleApiRequest,
  EMPLOYEE_APIS,
  COMMON_APIS,
}));

const { mockShowNotification } = vi.hoisted(() => ({
  mockShowNotification: vi.fn(),
}));

vi.mock("@/utils", () => ({
  showNotification: mockShowNotification,
}));

beforeEach(() => vi.clearAllMocks());

describe("employeeShiftsService", () => {
  it("exposes the expected method surface", () => {
    expect(typeof employeeShiftsService.getActivitySchedule).toBe("function");
    expect(typeof employeeShiftsService.uploadEmployeeTracking).toBe(
      "function",
    );
    expect(typeof employeeShiftsService.updateEmployeeTracking).toBe(
      "function",
    );
    expect(typeof employeeShiftsService.getActivityScheduleForEmployee).toBe(
      "function",
    );
    expect(typeof employeeShiftsService.addEmployeeActivitySchedule).toBe(
      "function",
    );
    expect(typeof employeeShiftsService.getActivityScheduleDetails).toBe(
      "function",
    );
    expect(typeof employeeShiftsService.deleteActivityShiftById).toBe(
      "function",
    );
  });

  it("re-exports the destructured named bindings (uploadEmployeeTracking aliased to UploadEmployeeTracking)", () => {
    expect(getActivitySchedule).toBe(employeeShiftsService.getActivitySchedule);
    expect(UploadEmployeeTracking).toBe(
      employeeShiftsService.uploadEmployeeTracking,
    );
    expect(updateEmployeeTracking).toBe(
      employeeShiftsService.updateEmployeeTracking,
    );
    expect(getActivityScheduleForEmployee).toBe(
      employeeShiftsService.getActivityScheduleForEmployee,
    );
    expect(addEmployeeActivitySchedule).toBe(
      employeeShiftsService.addEmployeeActivitySchedule,
    );
    expect(getActivityScheduleDetails).toBe(
      employeeShiftsService.getActivityScheduleDetails,
    );
    expect(deleteActivityShiftById).toBe(
      employeeShiftsService.deleteActivityShiftById,
    );
  });

  describe("getActivitySchedule", () => {
    it("GETs the activity schedule endpoint and returns the handled result", async () => {
      const result = await employeeShiftsService.getActivitySchedule();

      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Fetch Activity Schedule",
      );
      expect(mockApi.get).toHaveBeenCalledWith("employee/getActivitySchedule");
      expect(result).toEqual({ success: true, message: "ok", data: "result" });
    });
  });

  describe("getActivityScheduleForEmployee", () => {
    it("GETs with the params option object", async () => {
      const params = { facilityId: "fac-test-1", month: "06" };
      await employeeShiftsService.getActivityScheduleForEmployee(params);

      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Fetch Activity Schedule For Employee",
      );
      expect(mockApi.get).toHaveBeenCalledWith(
        "employee/getActivityScheduleForEmployee",
        { params },
      );
    });
  });

  describe("addEmployeeActivitySchedule", () => {
    it("POSTs the payload to the add endpoint", async () => {
      const payload = { shift: "Morning", employee: "emp-test-1" };
      await employeeShiftsService.addEmployeeActivitySchedule(payload);

      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Add Activity Schedule",
      );
      expect(mockApi.post).toHaveBeenCalledWith(
        "employee/addActivitySchedule",
        payload,
      );
    });
  });

  describe("getActivityScheduleDetails", () => {
    it("builds the url from month/year/facilityId via the function endpoint", async () => {
      await employeeShiftsService.getActivityScheduleDetails(
        "June",
        2026,
        "fac-test-1",
      );

      // WHY: the endpoint is a builder fn; positional args must flow through.
      expect(mockApi.get).toHaveBeenCalledWith(
        "employee/activitySchedule/June/2026/fac-test-1",
      );
      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Fetch Activity Schedule Details",
      );
    });
  });

  describe("deleteActivityShiftById", () => {
    it("DELETEs the shift-by-id url built from COMMON_APIS.SHIFT_DELETE", async () => {
      await employeeShiftsService.deleteActivityShiftById("shift-test-1");

      expect(mockApi.delete).toHaveBeenCalledWith("Shift/delete/shift-test-1");
      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Delete Activity Shift",
      );
    });
  });

  describe("uploadEmployeeTracking", () => {
    const baseArgs = () => ({
      url: "employee/tracking/upload",
      formData: { file: "fake" },
      setLoading: vi.fn(),
      navigate: vi.fn(),
    });

    it("POSTs the formData and toggles loading on then off", async () => {
      const args = baseArgs();
      await employeeShiftsService.uploadEmployeeTracking(args);

      expect(mockApi.post).toHaveBeenCalledWith(args.url, args.formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Upload Employee Tracking",
      );
      expect(args.setLoading).toHaveBeenNthCalledWith(1, true);
      expect(args.setLoading).toHaveBeenLastCalledWith(false);
    });

    it("navigates back on success and does not notify", async () => {
      const args = baseArgs();
      await employeeShiftsService.uploadEmployeeTracking(args);

      expect(args.navigate).toHaveBeenCalledWith(-1);
      expect(mockShowNotification).not.toHaveBeenCalled();
    });

    it("shows a notification and skips navigation on failure", async () => {
      const failure = { success: false, message: "boom" };
      mockHandleApiRequest.mockResolvedValueOnce(failure);
      const args = baseArgs();

      const result = await employeeShiftsService.uploadEmployeeTracking(args);

      expect(args.navigate).not.toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith(failure);
      expect(result).toBe(failure);
      // loading still resets to false even on failure
      expect(args.setLoading).toHaveBeenLastCalledWith(false);
    });

    it("does not crash when optional setLoading/navigate are omitted", async () => {
      await expect(
        employeeShiftsService.uploadEmployeeTracking({
          url: "u",
          formData: {},
        }),
      ).resolves.toMatchObject({ success: true });
    });
  });

  describe("updateEmployeeTracking", () => {
    const baseArgs = () => ({
      url: "employee/tracking/update",
      formData: { file: "fake2" },
      setLoading: vi.fn(),
      navigate: vi.fn(),
    });

    it("PUTs the formData and navigates back on success", async () => {
      const args = baseArgs();
      await employeeShiftsService.updateEmployeeTracking(args);

      expect(mockApi.put).toHaveBeenCalledWith(args.url, args.formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      expect(mockHandleApiRequest).toHaveBeenCalledWith(
        expect.any(Function),
        "Update Employee Tracking",
      );
      expect(args.navigate).toHaveBeenCalledWith(-1);
      expect(mockShowNotification).not.toHaveBeenCalled();
      expect(args.setLoading).toHaveBeenLastCalledWith(false);
    });

    it("notifies and does not navigate on failure", async () => {
      const failure = { success: false, message: "nope" };
      mockHandleApiRequest.mockResolvedValueOnce(failure);
      const args = baseArgs();

      const result = await employeeShiftsService.updateEmployeeTracking(args);

      expect(args.navigate).not.toHaveBeenCalled();
      expect(mockShowNotification).toHaveBeenCalledWith(failure);
      expect(result).toBe(failure);
    });
  });
});

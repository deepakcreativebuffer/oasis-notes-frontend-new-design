/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";

import { employeeService } from "./employee.service";

// Mock ONLY the shared http helpers the service forwards to. The Apis
// constants, pickUiOptions and resolveRoleEndpoint are pure and run for real
// so we verify the service builds the correct url/payload/options.
const mocks = vi.hoisted(() => ({
  getApi: vi.fn(),
  createApi: vi.fn(),
}));

vi.mock("@/features/shared/services/common/common.api", () => ({
  getApi: mocks.getApi,
  createApi: mocks.createApi,
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Default each helper to resolve a representative success result so the
  // service can return it through.
  mocks.getApi.mockResolvedValue({ success: true, data: [] });
  mocks.createApi.mockResolvedValue({ success: true, data: {} });
});

describe("employeeService", () => {
  describe("getApi-backed reads forward the right url + context", () => {
    it("getEmployee", async () => {
      await employeeService.getEmployee();
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/getEmployee",
          context: "Employee: Get",
        }),
      );
    });

    it("getActiveEmployees", async () => {
      await employeeService.getActiveEmployees();
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/getEmployee?isActive=true",
          context: "Employee: Active List",
        }),
      );
    });

    it("getProfile", async () => {
      await employeeService.getProfile();
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/getProfile",
          context: "Employee: Profile",
        }),
      );
    });

    it("getUsers", async () => {
      await employeeService.getUsers();
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/getUser",
          context: "Employee: Users",
        }),
      );
    });
  });

  describe("paginated / search builders interpolate params into the url", () => {
    it("listPaginated builds the admin list url from limit/page/query", async () => {
      await employeeService.listPaginated({ limit: 10, page: 2, query: "joe" });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "admin/listEmployees?isActive=true&limit=10&page=2&searchQuery=joe",
          context: "Employee: List Paginated",
        }),
      );
    });

    it("search builds the admin search url from limit/search", async () => {
      await employeeService.search({ limit: 5, search: "smith" });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "admin/listEmployees?limit=5&searchQuery=smith",
          context: "Employee: Search",
        }),
      );
    });

    it("searchPatients takes the query as its first positional arg", async () => {
      await employeeService.searchPatients("anna");
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/getPatient?limit=100&page=1&searchQuery=anna",
          context: "Employee: Search Patients",
        }),
      );
    });

    it("listUsers forwards the queryString param", async () => {
      await employeeService.listUsers({ queryString: "userType=Employee" });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "users?userType=Employee",
          context: "Employee: List Users",
        }),
      );
    });
  });

  describe("role-aware endpoints resolve admin vs employee", () => {
    it("listActive uses the admin endpoint when isAdmin is true", async () => {
      await employeeService.listActive({ isAdmin: true });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "admin/get-employee?isActive=true",
          context: "Employee: List Active",
        }),
      );
    });

    it("listActive falls back to the employee endpoint when not admin", async () => {
      await employeeService.listActive({ isAdmin: false });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/getEmployee?isActive=true",
          context: "Employee: List Active",
        }),
      );
    });

    it("getNotifications uses the admin notification endpoint for admins", async () => {
      await employeeService.getNotifications({ isAdmin: true });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "admin/allNotification",
          context: "Employee: Notifications",
        }),
      );
    });

    it("getNotifications uses the employee notification endpoint otherwise", async () => {
      await employeeService.getNotifications({ isAdmin: false });
      expect(mocks.getApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/allNotification",
          context: "Employee: Notifications",
        }),
      );
    });
  });

  describe("UI option splitting", () => {
    it("forwards recognized UI callbacks but not business params", async () => {
      const setLoading = vi.fn();
      // limit/page/query are business params; setLoading is a UI option.
      await employeeService.listPaginated({
        limit: 1,
        page: 1,
        query: "x",
        setLoading,
      });
      const arg = mocks.getApi.mock.calls[0][0];
      // WHY: pickUiOptions routes setLoading into the spread ui options.
      expect(arg.setLoading).toBe(setLoading);
      // Business params must NOT leak onto the getApi argument.
      expect(arg).not.toHaveProperty("limit");
      expect(arg).not.toHaveProperty("query");
    });
  });

  describe("createApi-backed writes forward url + payload", () => {
    it("uploadDocumentForEmployee posts the payload to the upload endpoint", async () => {
      const payload = { fileName: "fake-doc.pdf", employeeId: "emp-test-001" };
      await employeeService.uploadDocumentForEmployee(payload);
      expect(mocks.createApi).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "employee/createUploadDocumentForEmployee",
          payload,
          context: "Employee: Upload Document",
        }),
      );
    });
  });

  describe("return value pass-through", () => {
    it("returns whatever the underlying helper resolves", async () => {
      const result = { success: true, data: [{ _id: "emp-1" }] };
      mocks.getApi.mockResolvedValueOnce(result);
      await expect(employeeService.getEmployee()).resolves.toBe(result);
    });
  });
});

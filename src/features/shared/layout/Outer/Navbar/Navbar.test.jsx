/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import Navbar from "./Navbar";

// CSS import is a no-op under jsdom but keep the module resolvable.
vi.mock("./Navbar.css", () => ({}));

// Light stubs for child components — we only need to confirm Navbar renders
// them and forwards the props it owns, not exercise their internals.
vi.mock("@/features/shared/ui/Mod/Modal", () => ({
  OuterSidebar: ({ show }) => (
    <div data-testid="outer-sidebar" data-show={String(!!show)} />
  ),
}));
vi.mock("@/features/shared/ui/Canvas/Canvases", () => ({
  NotificationToast: ({ show }) => (
    <div data-testid="notification-toast" data-show={String(!!show)} />
  ),
}));

// Stub every asset import (Navbar pulls in several images) with a Proxy so any
// named export resolves to a placeholder string.
vi.mock(
  "@/assets",
  () =>
    new Proxy(
      { __esModule: true },
      {
        get: (target, prop) =>
          prop in target ? target[prop] : `asset-stub:${String(prop)}`,
        has: () => true,
      },
    ),
);

// Mock every service/IO module — never real HTTP/sockets in tests.
const authService = { logout: vi.fn() };
const employeeService = { searchPatients: vi.fn(), getNotifications: vi.fn() };
const getObjectUrlFromDownloadUrl = vi.fn((u) => `objurl:${u}`);
const LogOutHandler = vi.fn(() => ({ type: "auth/LOGOUT_THUNK" }));
const setActiveOrganization = vi.fn();
const getAllNotifications = vi.fn();

vi.mock("@/features/shared/services/index", () => ({
  authService: { logout: (...a) => authService.logout(...a) },
  employeeService: {
    searchPatients: (...a) => employeeService.searchPatients(...a),
    getNotifications: (...a) => employeeService.getNotifications(...a),
  },
  getObjectUrlFromDownloadUrl: (...a) => getObjectUrlFromDownloadUrl(...a),
  LogOutHandler: (...a) => LogOutHandler(...a),
  setActiveOrganization: (...a) => setActiveOrganization(...a),
  getAllNotifications: (...a) => getAllNotifications(...a),
}));

const applyActiveOrganization = vi.fn();
vi.mock("@/utils/applyActiveOrganization", () => ({
  applyActiveOrganization: (...a) => applyActiveOrganization(...a),
}));

const showNotification = vi.fn();
vi.mock("@/utils", () => ({
  showNotification: (...a) => showNotification(...a),
  logger: { debug: vi.fn(), error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

// Socket is captured so we can assert subscribe/unsubscribe wiring.
// vi.hoisted so the socket stub exists when the hoisted vi.mock factory runs.
const { mockSocket } = vi.hoisted(() => ({
  mockSocket: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
}));
vi.mock("@/socket", () => ({ getSocket: () => mockSocket }));

const profile = (overrides = {}) => ({
  _id: "emp-test-001",
  firstName: "Test",
  lastName: "Patient",
  email: "test@example.com",
  userType: "Employee",
  ...overrides,
});

const stateForProfile = (userProfile, extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
    ...extra,
  },
});

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActiveOrganization.mockResolvedValue({
      success: true,
      activeOrganizationId: "org-2",
    });
    authService.logout.mockResolvedValue(undefined);
    getAllNotifications.mockResolvedValue({ data: { data: [] } });
  });

  describe("rendering", () => {
    it("should render the banner with the brand home link and child surfaces", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile()),
      });

      // WHY: the navbar is the EHR's global chrome; banner + home escape hatch
      // and the sidebar/toast surfaces must always mount.
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /oasis notes home/i }),
      ).toHaveAttribute("href", "/Home");
      expect(screen.getByTestId("outer-sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("notification-toast")).toBeInTheDocument();
    });

    it("should show the authenticated user's name", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(
          profile({ firstName: "Test", lastName: "Patient" }),
        ),
      });

      // Name appears in toggle + dropdown menu item.
      expect(screen.getAllByText(/Test/).length).toBeGreaterThan(0);
    });

    it("should fall back to the default logo when the profile has none", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile({ logo: null })),
      });

      expect(screen.getByAltText(/oasis notes logo/i)).toHaveAttribute(
        "src",
        "/logo.png",
      );
    });

    it("should resolve the company logo through the download-url helper", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile({ logo: "logo-key-123" })),
      });

      // WHY: stored logos are object keys that must be turned into signed URLs.
      expect(getObjectUrlFromDownloadUrl).toHaveBeenCalledWith("logo-key-123");
      expect(screen.getByAltText(/company logo/i)).toHaveAttribute(
        "src",
        "objurl:logo-key-123",
      );
    });
  });

  describe("notification loading by role", () => {
    it("should load admin notifications via getAllNotifications for Admins", async () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile({ userType: "Admin" })),
      });

      // WHY: Admins see org-wide notifications from a dedicated endpoint.
      await waitFor(() => expect(getAllNotifications).toHaveBeenCalled());
      expect(employeeService.getNotifications).not.toHaveBeenCalled();
    });

    it("should load scoped notifications via employeeService for non-Admins", async () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile({ userType: "Employee" })),
      });

      // WHY: employees/patients only get their own notifications, not admin feed.
      await waitFor(() =>
        expect(employeeService.getNotifications).toHaveBeenCalledWith(
          expect.objectContaining({ isAdmin: false }),
        ),
      );
      expect(getAllNotifications).not.toHaveBeenCalled();
    });
  });

  describe("socket wiring", () => {
    it("should subscribe to message/notification events on mount and clean up on unmount", () => {
      const { unmount } = renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile()),
      });

      expect(mockSocket.on).toHaveBeenCalledWith(
        "new-notification",
        expect.any(Function),
      );
      expect(mockSocket.on).toHaveBeenCalledWith(
        "new-message",
        expect.any(Function),
      );

      unmount();

      // WHY: leaking socket listeners across navbar remounts would double-count
      // unread badges.
      expect(mockSocket.off).toHaveBeenCalledWith("new-notification");
      expect(mockSocket.off).toHaveBeenCalledWith("new-message");
    });
  });

  describe("chat link visibility", () => {
    it("should show the Messages link only when chat permission is enabled for an Employee", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(
          profile({
            userType: "Employee",
            adminId: { permissionChat: true },
          }),
        ),
      });

      expect(screen.getByRole("link", { name: /messages/i })).toHaveAttribute(
        "href",
        "/chat",
      );
    });

    it("should route Patients to the patient chat surface", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(
          profile({
            userType: "Patient",
            adminId: { permissionChat: true },
          }),
        ),
      });

      expect(screen.getByRole("link", { name: /messages/i })).toHaveAttribute(
        "href",
        "/chatPatient",
      );
    });

    it("should hide the Messages link when chat permission is off", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(
          profile({ userType: "Employee", adminId: { permissionChat: false } }),
        ),
      });

      // WHY: chat is gated behind an org permission; staff without it must not
      // see an entry point into PHI conversations.
      expect(
        screen.queryByRole("link", { name: /messages/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("logout", () => {
    it("should call the logout service and dispatch the logout handler", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile()),
      });

      await user.click(
        screen.getByRole("button", { name: /user profile menu/i }),
      );
      await user.click(screen.getByText(/logout/i));

      // WHY: logging out must both invalidate the server session and clear
      // client auth state to avoid stale PHI access.
      await waitFor(() => expect(authService.logout).toHaveBeenCalled());
      expect(LogOutHandler).toHaveBeenCalled();
    });
  });

  describe("patient search", () => {
    it("should not search before the user types a query", () => {
      renderWithProviders(<Navbar />, {
        preloadedState: stateForProfile(profile()),
      });

      expect(employeeService.searchPatients).not.toHaveBeenCalled();
    });
  });
});

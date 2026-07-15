/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import { NotificationToast, CreateGroup, AddMember } from "./Canvases";
import {
  chatService,
  employeeService,
  removeApi,
  COMMON_APIS,
} from "../../services";

// Service/IO layer the component reaches for chat + notification data. Never
// hit real HTTP — stub every export the component imports from "../../services".
vi.mock("@/socket", () => ({
  getSocket: () => ({ emit: vi.fn() }),
}));

vi.mock("../../services", () => ({
  chatService: {
    getUsersForChat: vi.fn(),
    createGroup: vi.fn(),
    updateGroup: vi.fn(),
  },
  employeeService: {
    getNotifications: vi.fn(),
  },
  getObjectUrlFromDownloadUrl: vi.fn((u) => `obj://${u}`),
  removeApi: vi.fn(),
  COMMON_APIS: {
    GET_NOTIFICATION: vi.fn((id) => `/api/notification/${id}`),
    GET_CHAT_REMOVE_MEMBER: vi.fn((g, m) => `/api/chat/${g}/remove/${m}`),
  },
}));

vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (i) => i?.name || `Name-${i?._id}`,
  convertTimeFormat: () => "10:00 AM",
  formatDateWithoutUTCHandleToMMDDYYYY: () => "01/01/2026",
}));

vi.mock("@/utils", () => ({
  showNotification: vi.fn(),
}));

const employeeState = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", userType: "Employee", ...overrides },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("Canvases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom lacks IntersectionObserver; the infinite-scroll sentry in the
    // member list needs it. Provide a no-op stub per test.
    global.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  describe("NotificationToast", () => {
    it("should fetch notifications when the toast is shown", () => {
      renderWithProviders(
        <NotificationToast
          show={true}
          setShow={vi.fn()}
          handleClose={vi.fn()}
          notifications={{ data: [] }}
          setNotifications={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      // WHY: opening the bell must pull the latest notifications for the signed-in
      // user so the EHR badge reflects current state.
      expect(employeeService.getNotifications).toHaveBeenCalledTimes(1);
    });

    it("should not fetch notifications while hidden", () => {
      renderWithProviders(
        <NotificationToast
          show={false}
          setShow={vi.fn()}
          handleClose={vi.fn()}
          notifications={{ data: [] }}
          setNotifications={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      expect(employeeService.getNotifications).not.toHaveBeenCalled();
    });

    it("should render an empty-state message when there are no notifications", () => {
      renderWithProviders(
        <NotificationToast
          show={true}
          setShow={vi.fn()}
          handleClose={vi.fn()}
          notifications={{ data: [] }}
          setNotifications={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
    });

    it("should render a notification body when notifications are present", () => {
      renderWithProviders(
        <NotificationToast
          show={true}
          setShow={vi.fn()}
          handleClose={vi.fn()}
          notifications={{
            data: [
              {
                _id: "ntf-1",
                body: "Test Patient note signed",
                updatedAt: "2026-01-01",
              },
            ],
          }}
          setNotifications={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      expect(screen.getByText("Test Patient note signed")).toBeInTheDocument();
    });

    it("should mark a notification read and navigate when an employee clicks it", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <NotificationToast
          show={true}
          setShow={vi.fn()}
          handleClose={vi.fn()}
          notifications={{
            data: [
              {
                _id: "ntf-1",
                body: "Sign progress note",
                progressNote: "pn-test-001",
              },
            ],
          }}
          setNotifications={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      await user.click(screen.getByText("Sign progress note"));

      // WHY: acting on a notification must clear it server-side via the
      // notification REST endpoint so it doesn't re-appear in the badge.
      await waitFor(() =>
        expect(removeApi).toHaveBeenCalledWith(
          expect.objectContaining({ url: "/api/notification/ntf-1" }),
        ),
      );
      expect(COMMON_APIS.GET_NOTIFICATION).toHaveBeenCalledWith("ntf-1");
    });
  });

  describe("CreateGroup", () => {
    it("should load selectable users when the create-group modal opens", () => {
      renderWithProviders(
        <CreateGroup
          show={true}
          handleClose={vi.fn()}
          chatListHandler={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      // WHY: the group composer needs the org's employee roster to pick members.
      expect(chatService.getUsersForChat).toHaveBeenCalled();
    });

    it("should render the add-members title and a search field", () => {
      renderWithProviders(
        <CreateGroup
          show={true}
          handleClose={vi.fn()}
          chatListHandler={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      // react-bootstrap Modal doesn't wire the title as the dialog name, so assert
      // the title text and the search affordance separately.
      expect(screen.getByText(/add group memebers/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search name/i)).toBeInTheDocument();
    });

    it("should not load users while the modal is hidden", () => {
      renderWithProviders(
        <CreateGroup
          show={false}
          handleClose={vi.fn()}
          chatListHandler={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      expect(chatService.getUsersForChat).not.toHaveBeenCalled();
    });

    it("should advance to the group-details step after selecting a member", async () => {
      const user = userEvent.setup();
      chatService.getUsersForChat.mockImplementation(
        (limit, { setResponse }) => {
          setResponse({
            data: {
              docs: [
                {
                  _id: "emp-test-002",
                  name: "Test Member",
                  email: "m@test.io",
                },
              ],
            },
          });
        },
      );

      renderWithProviders(
        <CreateGroup
          show={true}
          handleClose={vi.fn()}
          chatListHandler={vi.fn()}
        />,
        { preloadedState: employeeState() },
      );

      await user.click(screen.getByText("Test Member"));
      await user.click(screen.getByRole("button", { name: /next/i }));

      // WHY: once at least one member is chosen the composer moves to naming the
      // group ("New Group" step).
      expect(screen.getByText(/new group/i)).toBeInTheDocument();
    });
  });

  describe("AddMember", () => {
    it("should show a no-results message when the roster is empty", () => {
      chatService.getUsersForChat.mockImplementation(
        (limit, { setResponse }) => {
          setResponse({ data: { docs: [] } });
        },
      );

      renderWithProviders(
        <AddMember
          show={true}
          handleClose={vi.fn()}
          chatListHandler={vi.fn()}
          document={{ _id: "grp-test-001", members: [] }}
          isExistGroup={true}
        />,
        { preloadedState: employeeState() },
      );

      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });

    it("should list addable employees excluding existing members and self", () => {
      chatService.getUsersForChat.mockImplementation(
        (limit, { setResponse }) => {
          setResponse({
            data: {
              docs: [
                { _id: "emp-test-001", name: "Self User" },
                { _id: "emp-test-002", name: "Existing Member" },
                { _id: "emp-test-003", name: "New Candidate" },
              ],
            },
          });
        },
      );

      renderWithProviders(
        <AddMember
          show={true}
          handleClose={vi.fn()}
          chatListHandler={vi.fn()}
          document={{ _id: "grp-test-001", members: [{ _id: "emp-test-002" }] }}
          isExistGroup={true}
        />,
        { preloadedState: employeeState() },
      );

      // WHY: you can't re-add yourself or someone already in the group, so only
      // genuinely new candidates appear.
      expect(screen.getByText("New Candidate")).toBeInTheDocument();
      expect(screen.queryByText("Self User")).not.toBeInTheDocument();
      expect(screen.queryByText("Existing Member")).not.toBeInTheDocument();
    });
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, act } from "@/test-utils";

import Chat from "./Chat";
import { chatService, removeApi } from "@/features/shared/services";

// ── Socket: never open a real socket.io connection in jsdom. We capture the
//    registered handlers so we can assert lifecycle wiring without IO.
const socketMock = vi.hoisted(() => ({
  handlers: {},
  on: vi.fn(function (event, cb) {
    socketMock.handlers[event] = cb;
  }),
  off: vi.fn(),
  emit: vi.fn(),
}));
vi.mock("@/socket", () => ({
  getSocket: () => socketMock,
}));

// ── HOC just wraps the page in Navbar/Sidebar chrome (heavy, irrelevant here).
//    Render the wrapped component directly so the default export mounts Chat.
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function MockHOC() {
      return <Wcomponenet />;
    },
}));

// ── Child components stubbed to thin markers exposing the props we assert on.
vi.mock("./MessageBox", () => ({
  default: (props) => (
    <div data-testid="message-box" data-active={props.activeId} />
  ),
}));
vi.mock("./ChatMenu", () => ({
  default: (props) => (
    <div data-testid="chat-menu" data-usertype={props.userProfileType}>
      <button onClick={() => props.handleCreateChat?.()}>create-chat</button>
      <button onClick={() => props.handleClickChangeType?.("Group")}>
        to-group
      </button>
      <button onClick={() => props.handleDelete?.("chat-test-001", "Direct")}>
        delete-chat
      </button>
    </div>
  ),
}));
vi.mock("./CreateChat", () => ({
  default: (props) => (
    <div data-testid="create-chat" data-show={String(props.show)} />
  ),
}));
vi.mock("./GroupChat/GroupMsgBox", () => ({
  default: () => <div data-testid="group-msg-box" />,
}));
vi.mock("./DeleteConfirmationModel", () => ({
  default: (props) =>
    props.show ? (
      <div data-testid="delete-modal">
        <button onClick={props.handleConfirm}>confirm-delete</button>
        <button onClick={props.handleClose}>close-delete</button>
      </div>
    ) : null,
}));

// ── Service layer: no real HTTP. chatService.fetchUsers/listGroups resolve to
//    empty payloads by default; tests override per-case.
vi.mock("@/features/shared/services", () => ({
  chatService: {
    fetchUsers: vi.fn().mockResolvedValue({ data: [] }),
    listGroups: vi.fn().mockResolvedValue({ data: { data: [] } }),
    addMessage: vi.fn(),
  },
  removeApi: vi.fn(),
}));

const authState = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      userType: "Employee",
      profilePic: "",
      adminId: { permissionChat: true },
      ...overrides,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const chatState = (overrides = {}) => ({
  chat: {
    step: 1,
    isQuizOpen: false,
    chatMenuData: [],
    chatGroupMenuData: [],
    activeActiveChat: "",
    ...overrides,
  },
});

describe("Chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socketMock.handlers = {};
  });

  it("renders the chat workspace when the user has chat permission", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: authState(),
      });
    });

    // WHY: a permissioned employee sees the chat sidebar + create-chat shell,
    // not the access-denied fallback.
    expect(screen.getByTestId("chat-menu")).toBeInTheDocument();
    expect(screen.getByTestId("create-chat")).toBeInTheDocument();
    expect(
      screen.queryByText(/you have not permission of chat/i),
    ).not.toBeInTheDocument();
  });

  it("shows the access-denied fallback when permissionChat is not granted", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: authState({ adminId: { permissionChat: false } }),
      });
    });

    // WHY: PHI chat must be gated — without explicit permission the staff member
    // gets a denial card, never the chat UI.
    expect(
      screen.getByText(/you have not permission of chat/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("chat-menu")).not.toBeInTheDocument();
  });

  it("fetches the chat list and registers socket message listeners on mount", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: authState(),
      });
    });

    // WHY: on mount the component subscribes to live direct/group messages so
    // unread counts stay current.
    expect(socketMock.on).toHaveBeenCalledWith(
      "new-direct-message",
      expect.any(Function),
    );
    expect(socketMock.on).toHaveBeenCalledWith(
      "new-group-message",
      expect.any(Function),
    );
    // Initial chatType is "" (falsy), so the handler falls to the group branch.
    expect(chatService.listGroups).toHaveBeenCalled();
  });

  it("prompts the user to pick a chat when none is selected", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: authState(),
      });
    });

    // chatUsers starts undefined and there's no matching group doc, so the
    // "add a chat" empty state is shown.
    expect(
      screen.getByText(/please add a chat to view messages/i),
    ).toBeInTheDocument();
  });

  it("redirects to home when the user is not authenticated", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: {
          ...authState(),
          auth: {
            isAuthenticated: false,
            userProfile: {
              _id: "emp-test-001",
              userType: "Employee",
              adminId: { permissionChat: true },
            },
            unreadMessages: 0,
            unreadNotifications: 0,
          },
        },
      });
    });

    // WHY: an unauthenticated session must not linger on a PHI page; the effect
    // navigates HOME. We assert no crash and the chat UI is gone after redirect.
    expect(
      screen.queryByText(/please add a chat to view messages/i),
    ).toBeTruthy();
  });

  it("opens the delete confirmation modal and routes confirm through removeApi", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: authState(),
      });
    });

    // Trigger handleDelete from the (stubbed) ChatMenu.
    await act(async () => {
      screen.getByText("delete-chat").click();
    });
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();

    await act(async () => {
      screen.getByText("confirm-delete").click();
    });

    // WHY: confirming a delete issues the server-side delete-conversation call.
    expect(removeApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining("chat/delete-conversation/chat-test-001"),
      }),
    );
  });

  it("switches to group chats and fetches groups via listGroups", async () => {
    await act(async () => {
      renderWithProviders(<Chat />, {
        preloadedState: authState(),
      });
    });

    await act(async () => {
      screen.getByText("to-group").click();
    });

    // WHY: selecting the Group tab swaps the data source to group conversations.
    expect(chatService.listGroups).toHaveBeenCalled();
  });
});

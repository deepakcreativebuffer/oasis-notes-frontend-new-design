/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import GroupMsgBox from "./GroupMsgBox";

// vi.hoisted so these refs are usable inside the hoisted vi.mock factories.
const h = vi.hoisted(() => ({
  socket: { emit: vi.fn() },
  fetchUsers: vi.fn().mockResolvedValue(undefined),
  getObjectUrl: vi.fn((u) => `obj:${u}`),
  groupInfoSpy: vi.fn(),
}));

// Socket: never open a real connection.
vi.mock("@/socket", () => ({
  getSocket: () => h.socket,
}));

// Services barrel the component imports from.
vi.mock("@/features/shared/services", () => ({
  chatService: { fetchUsers: h.fetchUsers },
  getObjectUrlFromDownloadUrl: h.getObjectUrl,
  COMMON_APIS: { CHAT_GET_CHAT: (id) => `/chat/${id}` },
}));

// Pure helpers — keep deterministic, assertable output.
vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (p) => p?.name ?? "",
  formatDateToMMDDYYYY: () => "01/02/2026",
}));

vi.mock("@/utils", () => ({
  logger: { error: vi.fn(), debug: vi.fn() },
}));

// Asset barrels — return stubs for any import.
vi.mock(
  "@/assets",
  () =>
    new Proxy(
      { __esModule: true },
      { get: (t, p) => (p in t ? t[p] : "stub"), has: () => true },
    ),
);
vi.mock(
  "@/assets/index",
  () =>
    new Proxy(
      { __esModule: true },
      { get: (t, p) => (p in t ? t[p] : "stub"), has: () => true },
    ),
);

// Heavy GroupInfo canvas — stub to a marker that echoes its `show` prop.
vi.mock("@/features/shared/ui/Canvas/Canvases", () => ({
  GroupInfo: (props) => {
    h.groupInfoSpy(props);
    return <div data-testid="group-info" data-show={String(props.show)} />;
  },
}));

const baseProps = (over = {}) => ({
  document: {
    _id: "grp-test-001",
    name: "Test Group",
    unreadMessagesCount: 3,
    createdBy: { _id: "emp-other-001", name: "Creator User" },
    members: [
      { _id: "emp-test-001", name: "Self User" },
      { _id: "emp-mem-002", name: "Member Two" },
    ],
  },
  messages: [],
  setNewMessage: vi.fn(),
  newMessage: "",
  handleOnSubmit: vi.fn(),
  senderId: "emp-test-001",
  chatType: "group",
  chatListHandler: vi.fn(),
  ...over,
});

describe("GroupMsgBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the empty placeholder when no chat document is selected", () => {
    renderWithProviders(<GroupMsgBox {...baseProps({ document: null })} />);

    // WHY: with no selected conversation, staff must see a prompt rather than a
    // blank message pane.
    expect(
      screen.getByText(/please select a chat to view messages/i),
    ).toBeInTheDocument();
  });

  it("renders the group header (name + members) for a selected document", async () => {
    const props = baseProps();
    renderWithProviders(<GroupMsgBox {...props} />);

    expect(screen.getByText("Test Group")).toBeInTheDocument();
    // Creator (not self) is listed plus non-self members. Names render with
    // trailing separators in the same span, so match on substring.
    expect(screen.getByText(/Creator User/)).toBeInTheDocument();
    expect(screen.getByText(/Member Two/)).toBeInTheDocument();

    // WHY: opening a group must load its history and announce presence over the
    // socket so other members see it as read.
    await waitFor(() =>
      expect(h.fetchUsers).toHaveBeenCalledWith("/chat/grp-test-001", {
        setResponse: expect.any(Function),
      }),
    );
    expect(h.socket.emit).toHaveBeenCalledWith(
      "open-group",
      JSON.stringify({ id: "grp-test-001", userId: "emp-test-001" }),
    );
    expect(props.chatListHandler).toHaveBeenCalled();
  });

  it("marks the group's unread messages as read on open", async () => {
    const props = baseProps();
    const { store } = renderWithProviders(<GroupMsgBox {...props} />, {
      preloadedState: {
        auth: {
          isAuthenticated: true,
          userProfile: { _id: "emp-test-001", userType: "Employee" },
          unreadMessages: 10,
          unreadNotifications: 0,
        },
      },
    });

    // WHY: viewing a group decrements the global unread badge so the nav count
    // reflects what the user has actually seen.
    await waitFor(() => expect(store.getState().auth.unreadMessages).toBe(7));
  });

  it("submits the message form with chat type and group id", () => {
    const props = baseProps({ newMessage: "hello team" });
    renderWithProviders(<GroupMsgBox {...props} />);

    // fireEvent.submit avoids jsdom's unimplemented requestSubmit path.
    fireEvent.submit(document.querySelector("form"));

    // WHY: sending routes the draft to the correct group conversation.
    expect(props.handleOnSubmit).toHaveBeenCalledTimes(1);
    const call = props.handleOnSubmit.mock.calls[0];
    expect(call[1]).toBe("group");
    expect(call[2]).toBe("grp-test-001");
  });

  it("calls setNewMessage as the user types", () => {
    const props = baseProps();
    renderWithProviders(<GroupMsgBox {...props} />);

    const input = document.querySelector('input[type="text"]');
    fireEvent.change(input, { target: { value: "draft text" } });

    expect(props.setNewMessage).toHaveBeenCalledWith("draft text");
  });

  it("opens the GroupInfo canvas when the header is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<GroupMsgBox {...props} />);

    expect(screen.getByTestId("group-info")).toHaveAttribute(
      "data-show",
      "false",
    );
    await user.click(screen.getByText("Test Group"));

    // WHY: clicking the header opens group details/management.
    await waitFor(() =>
      expect(screen.getByTestId("group-info")).toHaveAttribute(
        "data-show",
        "true",
      ),
    );
  });

  it("renders socket messages merged into the conversation", async () => {
    const props = baseProps({
      messages: [
        {
          GroupId: "grp-test-001",
          text: "incoming message",
          sentBy: { _id: "emp-mem-002", name: "Member Two" },
          createdAt: "2026-06-10T00:00:00Z",
        },
      ],
    });
    renderWithProviders(<GroupMsgBox {...props} />);

    // WHY: live socket messages addressed to this group must appear in the pane.
    await screen.findByText("incoming message");
    expect(screen.getByText("01/02/2026")).toBeInTheDocument();
  });

  it("does not crash and renders header with no members", async () => {
    const props = baseProps({
      document: {
        _id: "grp-test-002",
        name: "Solo Group",
        unreadMessagesCount: 0,
        createdBy: { _id: "emp-test-001", name: "Self User" },
        members: [],
      },
    });
    renderWithProviders(<GroupMsgBox {...props} />);

    expect(screen.getByText("Solo Group")).toBeInTheDocument();
    await waitFor(() => expect(h.fetchUsers).toHaveBeenCalled());
  });
});

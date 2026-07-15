/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import MessageBox from "./MessageBox";

// Hoisted mock handles so vi.mock factories (hoisted above imports) can
// reference them without "Cannot access before initialization".
const h = vi.hoisted(() => ({
  fetchUsers: vi.fn().mockResolvedValue(undefined),
  emit: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@/socket", () => ({
  getSocket: () => ({ emit: h.emit }),
}));

vi.mock("@/features/shared/services", () => ({
  chatService: { fetchUsers: h.fetchUsers },
  // WHY: the component turns a stored download path into a displayable URL;
  // we echo a deterministic value so we can assert the <img src>.
  getObjectUrlFromDownloadUrl: (p) => (p ? `url:${p}` : ""),
  COMMON_APIS: { CHAT_GET_CHAT_1: (id) => `/chat/${id}` },
}));

vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: () => "01/02/2026",
}));

vi.mock("@/utils", () => ({
  logger: { error: h.loggerError },
}));

// Asset barrels export many svgs; a Proxy keeps every named import truthy.
vi.mock(
  "@/assets",
  () =>
    new Proxy(
      { __esModule: true },
      {
        get: (t, p) => (p in t ? t[p] : "stub.svg"),
        has: () => true,
      },
    ),
);
vi.mock(
  "@/assets/index",
  () =>
    new Proxy(
      { __esModule: true },
      {
        get: (t, p) => (p in t ? t[p] : "stub.svg"),
        has: () => true,
      },
    ),
);

const SENDER = "emp-test-001";

const baseProps = (over = {}) => ({
  document: undefined,
  messages: [],
  setNewMessage: vi.fn(),
  newMessage: "",
  handleOnSubmit: vi.fn(),
  senderId: SENDER,
  chatType: "direct",
  activeId: "conv-test-001",
  chatListHandler: vi.fn(),
  ...over,
});

const makeDoc = (over = {}) => ({
  _id: "conv-test-001",
  unreadMessagesCount: 3,
  memberOne: {
    _id: "other-test-001",
    firstName: "Test",
    lastName: "Patient",
    profilePic: "pic-one",
  },
  memberTwo: {
    _id: SENDER,
    fullName: "Me Employee",
    profilePic: "pic-two",
  },
  ...over,
});

describe("MessageBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the empty placeholder when no chat is selected", () => {
    renderWithProviders(<MessageBox {...baseProps({ document: undefined })} />);

    // WHY: with no conversation selected staff should see guidance, not a blank box.
    expect(
      screen.getByText(/please select a chat to view messages/i),
    ).toBeInTheDocument();
  });

  it("renders the header with the OTHER member's name when a chat is selected", () => {
    renderWithProviders(<MessageBox {...baseProps({ document: makeDoc() })} />);

    // WHY: header shows the counterpart (memberOne here, since memberTwo is me),
    // never the current user's own name.
    expect(screen.getByText(/Test Patient/i)).toBeInTheDocument();
  });

  it("fetches chat history and emits open-chat when a document is provided", async () => {
    renderWithProviders(<MessageBox {...baseProps({ document: makeDoc() })} />);

    await waitFor(() =>
      expect(h.fetchUsers).toHaveBeenCalledWith(
        "/chat/conv-test-001",
        expect.objectContaining({ setResponse: expect.any(Function) }),
      ),
    );

    // WHY: opening a chat signals the socket so the peer sees read state.
    expect(h.emit).toHaveBeenCalledWith(
      "open-chat",
      JSON.stringify({ id: "conv-test-001", userId: SENDER }),
    );
  });

  it("dispatches updateUnreadMessageCount to clear the badge on open", async () => {
    const { store } = renderWithProviders(
      <MessageBox {...baseProps({ document: makeDoc() })} />,
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            userProfile: { _id: SENDER, userType: "Employee" },
            unreadMessages: 5,
            unreadNotifications: 0,
          },
        },
      },
    );

    // WHY: opening a conversation marks its messages read, decrementing the
    // global unread badge so staff aren't nagged about messages they've seen.
    await waitFor(() =>
      expect(store.getState().auth.unreadMessages).toBe(5 - 3),
    );
  });

  it("invokes chatListHandler after loading the chat", async () => {
    const props = baseProps({ document: makeDoc() });
    renderWithProviders(<MessageBox {...props} />);

    await waitFor(() => expect(props.chatListHandler).toHaveBeenCalled());
  });

  it("renders socket messages, marking the sender's own as 'sent'", () => {
    const messages = [
      {
        senderId: SENDER,
        message: "Hello from me",
        ConversationId: "conv-test-001",
      },
      {
        senderId: "other-test-001",
        message: "Reply to me",
        ConversationId: "conv-test-001",
      },
    ];
    const { container } = renderWithProviders(
      <MessageBox {...baseProps({ document: makeDoc(), messages })} />,
    );

    expect(screen.getByText("Hello from me")).toBeInTheDocument();
    expect(screen.getByText("Reply to me")).toBeInTheDocument();
    // WHY: outgoing vs incoming styling distinguishes who said what.
    expect(container.querySelector(".message.sent")).toBeTruthy();
    expect(container.querySelector(".message.received")).toBeTruthy();
  });

  it("forwards typed input to setNewMessage", async () => {
    const user = userEvent.setup();
    const props = baseProps({ document: makeDoc() });
    renderWithProviders(<MessageBox {...props} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "x");

    expect(props.setNewMessage).toHaveBeenCalledWith("x");
  });

  it("submits the form with chatType and the conversation id", () => {
    const props = baseProps({ document: makeDoc() });
    const { container } = renderWithProviders(<MessageBox {...props} />);

    const form = container.querySelector("form");
    fireEvent.submit(form);

    // WHY: send must be scoped to the active conversation so the message
    // doesn't leak into another patient's thread.
    expect(props.handleOnSubmit).toHaveBeenCalledWith(
      expect.anything(),
      "direct",
      "conv-test-001",
    );
  });

  it("logs an error and does not crash when fetching chat history fails", async () => {
    h.fetchUsers.mockRejectedValueOnce(new Error("boom"));
    const props = baseProps({ document: makeDoc() });

    renderWithProviders(<MessageBox {...props} />);

    // WHY: a failed history load must degrade gracefully (logged), and the
    // chat list refresh still runs in the finally-style flow.
    await waitFor(() => expect(h.loggerError).toHaveBeenCalled());
    await waitFor(() => expect(props.chatListHandler).toHaveBeenCalled());
  });

  it("does not fetch when the selected document has no id", () => {
    renderWithProviders(
      <MessageBox {...baseProps({ document: { foo: "bar" } })} />,
    );

    // WHY: a malformed/placeholder document shouldn't trigger a chat fetch.
    expect(h.fetchUsers).not.toHaveBeenCalled();
  });
});

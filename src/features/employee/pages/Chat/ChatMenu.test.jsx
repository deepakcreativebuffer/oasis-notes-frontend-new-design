/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ChatMenu from "./ChatMenu";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { fetchPaitentName } from "@/utils/utils";

// Mock CSS import (jsdom can't parse it and it's irrelevant to behaviour).
vi.mock("./Chat.css", () => ({}));

// Asset barrel: return a Proxy so any named import (defaultUserImg, etc.)
// resolves to a stub string instead of an undefined export.
vi.mock("@/assets/index", () => ({
  __esModule: true,
  defaultUserImg: "default-user.png",
}));

// Media URL resolver — keep it identity-ish so we can assert the src passthrough.
vi.mock("@/features/shared/services", () => ({
  getObjectUrlFromDownloadUrl: vi.fn((url) => `resolved:${url}`),
}));

// Name formatter used for member labels.
vi.mock("@/utils/utils", () => ({
  fetchPaitentName: vi.fn((member) => member?.name ?? "Unknown"),
}));

const baseProps = (overrides = {}) => ({
  profilePic: "",
  userId: "emp-test-001",
  chatUsers: [],
  groupLists: [],
  collections: [],
  handleClickChangeType: vi.fn(),
  handleCreateChat: vi.fn(),
  userType: undefined,
  userProfileType: "Employee",
  handleDelete: vi.fn(),
  chatId: "",
  ...overrides,
});

const chatUser = (over = {}) => ({
  _id: "chat-1",
  updatedAt: "2026-06-01T00:00:00.000Z",
  unreadMessagesCount: 0,
  memberOne: { _id: "emp-test-001", name: "Self", profilePic: "self.png" },
  memberTwo: {
    _id: "emp-test-002",
    name: "Test Patient",
    profilePic: "other.png",
  },
  ...over,
});

const group = (over = {}) => ({
  _id: "group-1",
  id: "group-1",
  updatedAt: "2026-06-01T00:00:00.000Z",
  name: "Test Group",
  logo: "",
  unreadMessagesCount: 0,
  createdBy: { _id: "emp-test-001" },
  ...over,
});

describe("ChatMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the Employee tab set for an Employee profile", () => {
      renderWithProviders(<ChatMenu {...baseProps()} />);

      // WHY: employees can message Group, Employee and Resident populations.
      expect(screen.getByText("Group")).toBeInTheDocument();
      expect(screen.getByText("Employee")).toBeInTheDocument();
      expect(screen.getByText("Resident")).toBeInTheDocument();
    });

    it("should render only the Employee tab for a Patient profile", () => {
      renderWithProviders(
        <ChatMenu {...baseProps({ userProfileType: "Patient" })} />,
      );

      // WHY: a patient can only chat with employees — no Group/Resident tabs.
      expect(screen.getByText("Employee")).toBeInTheDocument();
      expect(screen.queryByText("Group")).not.toBeInTheDocument();
      expect(screen.queryByText("Resident")).not.toBeInTheDocument();
    });

    it("should fall back to the default avatar when no profilePic is provided", () => {
      const { container } = renderWithProviders(<ChatMenu {...baseProps()} />);
      const avatar = container.querySelector(".active-chat-avatar img");
      // WHY: missing profile media must degrade to the placeholder, not a broken img.
      expect(avatar).toHaveAttribute("src", "default-user.png");
    });

    it("should resolve a provided profilePic through the media URL service", () => {
      const { container } = renderWithProviders(
        <ChatMenu {...baseProps({ profilePic: "avatar.png" })} />,
      );
      const avatar = container.querySelector(".active-chat-avatar img");
      expect(getObjectUrlFromDownloadUrl).toHaveBeenCalledWith("avatar.png");
      expect(avatar).toHaveAttribute("src", "resolved:avatar.png");
    });

    it("should show 'No Chat Found' when the active tab has no conversations", () => {
      renderWithProviders(<ChatMenu {...baseProps({ chatUsers: [] })} />);
      // WHY: the default active tab is Employee; empty list shows the empty state.
      expect(screen.getByText("No Chat Found")).toBeInTheDocument();
    });
  });

  describe("Patient-profile auto-select effect", () => {
    it("should switch to the Patient type on mount for a Patient profile", () => {
      const handleClickChangeType = vi.fn();
      renderWithProviders(
        <ChatMenu
          {...baseProps({ userProfileType: "Patient", handleClickChangeType })}
        />,
      );
      // WHY: patients land directly on their employee conversation list.
      expect(handleClickChangeType).toHaveBeenCalledWith("Patient");
    });
  });

  describe("userType prop effect", () => {
    it("should drive the active tab from the userType prop", () => {
      const handleClickChangeType = vi.fn();
      renderWithProviders(
        <ChatMenu
          {...baseProps({ userType: "Group", handleClickChangeType })}
        />,
      );
      // WHY: a parent-controlled userType forces the menu onto that population.
      expect(handleClickChangeType).toHaveBeenCalledWith("Group");
    });
  });

  describe("conversation list", () => {
    it("should render the other member's name in an Employee conversation", () => {
      renderWithProviders(
        <ChatMenu {...baseProps({ chatUsers: [chatUser()] })} />,
      );
      // WHY: the list must label the *other* participant, not the signed-in user.
      expect(fetchPaitentName).toHaveBeenCalledWith(
        expect.objectContaining({ _id: "emp-test-002" }),
      );
      expect(screen.getByText("Test Patient")).toBeInTheDocument();
    });

    it("should show the unread badge count when messages are unread", () => {
      renderWithProviders(
        <ChatMenu
          {...baseProps({ chatUsers: [chatUser({ unreadMessagesCount: 3 })] })}
        />,
      );
      // WHY: unread counts are critical for staff not to miss patient messages.
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should set chat + document ids in redux when a conversation is clicked", async () => {
      const user = userEvent.setup();
      const { store, container } = renderWithProviders(
        <ChatMenu {...baseProps({ chatUsers: [chatUser()] })} />,
      );

      await user.click(container.querySelector(".chat-group-list"));

      // WHY: selecting a chat must persist the active chat/document id so the
      // message pane loads the right thread.
      const state = store.getState().chat;
      expect(state.activeActiveChat).toBe("chat-1");
      expect(state.id).toBe("emp-test-002");
    });

    it("should call handleDelete with the chat id and 'chat' type from the trash icon", () => {
      const handleDelete = vi.fn();
      const { container } = renderWithProviders(
        <ChatMenu {...baseProps({ chatUsers: [chatUser()], handleDelete })} />,
      );

      fireEvent.click(container.querySelector(".chat-messagesline-delete svg"));

      expect(handleDelete).toHaveBeenCalledWith("chat-1", "chat");
    });

    it("should sort conversations by most-recently-updated first", () => {
      const older = chatUser({
        _id: "chat-old",
        updatedAt: "2026-01-01T00:00:00.000Z",
        memberTwo: { _id: "emp-test-009", name: "Older Chat", profilePic: "" },
      });
      const newer = chatUser({
        _id: "chat-new",
        updatedAt: "2026-06-09T00:00:00.000Z",
        memberTwo: { _id: "emp-test-010", name: "Newer Chat", profilePic: "" },
      });
      const { container } = renderWithProviders(
        <ChatMenu {...baseProps({ chatUsers: [older, newer] })} />,
      );

      const names = [...container.querySelectorAll(".sendername")].map((n) =>
        n.textContent.trim(),
      );
      // WHY: most recent conversations surface at the top of the chat list.
      expect(names[0]).toContain("Newer Chat");
    });
  });

  describe("group list", () => {
    it("should render groups and switch to the Group tab via userType", () => {
      renderWithProviders(
        <ChatMenu
          {...baseProps({ userType: "Group", groupLists: [group()] })}
        />,
      );
      expect(screen.getByText("Test Group")).toBeInTheDocument();
    });

    it("should set the group id in redux when a group is clicked", async () => {
      const user = userEvent.setup();
      const { store, container } = renderWithProviders(
        <ChatMenu
          {...baseProps({ userType: "Group", groupLists: [group()] })}
        />,
      );

      await user.click(container.querySelector(".chat-group-list"));

      const state = store.getState().chat;
      // WHY: group chats use a single id for both chat + document context.
      expect(state.activeActiveChat).toBe("group-1");
      expect(state.id).toBe("group-1");
    });

    it("should only show the delete control to the group creator", () => {
      const { container, rerender } = renderWithProviders(
        <ChatMenu
          {...baseProps({
            userType: "Group",
            groupLists: [group({ createdBy: { _id: "emp-test-001" } })],
          })}
        />,
      );
      expect(
        container.querySelector(".chat-messagesline-delete"),
      ).toBeInTheDocument();

      rerender(
        <ChatMenu
          {...baseProps({
            userType: "Group",
            groupLists: [group({ createdBy: { _id: "someone-else" } })],
          })}
        />,
      );
      // WHY: only the group owner may delete the group; members cannot.
      expect(
        container.querySelector(".chat-messagesline-delete"),
      ).not.toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("should invoke handleCreateChat when the add-group button is clicked", async () => {
      const user = userEvent.setup();
      const handleCreateChat = vi.fn();
      const { container } = renderWithProviders(
        <ChatMenu {...baseProps({ handleCreateChat })} />,
      );

      await user.click(container.querySelector(".add-chat-group"));

      expect(handleCreateChat).toHaveBeenCalledTimes(1);
    });

    it("should change the active type when a tab badge is clicked", async () => {
      const user = userEvent.setup();
      const handleClickChangeType = vi.fn();
      renderWithProviders(
        <ChatMenu {...baseProps({ handleClickChangeType })} />,
      );

      await user.click(screen.getByText("Group"));

      // WHY: switching tabs re-filters the conversation list by population.
      expect(handleClickChangeType).toHaveBeenCalledWith("Group");
    });
  });

  describe("edge cases", () => {
    it("should not crash when chatUsers and groupLists are missing", () => {
      expect(() =>
        renderWithProviders(
          <ChatMenu
            {...baseProps({ chatUsers: undefined, groupLists: undefined })}
          />,
        ),
      ).not.toThrow();
    });
  });
});

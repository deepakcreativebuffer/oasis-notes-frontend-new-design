/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import CreateChat from "./CreateChat";

// --- hoisted mock fns (vi.mock factories are hoisted above imports) ---
const mocks = vi.hoisted(() => ({
  getEmployeesForGroup: vi.fn(),
  getPatientsForGroup: vi.fn(),
  getGuardiansForGroup: vi.fn(),
  addConversation: vi.fn(),
  getObjectUrlFromDownloadUrl: vi.fn((u) => `obj:${u}`),
  socketEmit: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@/features/shared/services", () => ({
  chatService: {
    getEmployeesForGroup: mocks.getEmployeesForGroup,
    getPatientsForGroup: mocks.getPatientsForGroup,
    getGuardiansForGroup: mocks.getGuardiansForGroup,
    addConversation: mocks.addConversation,
  },
  getObjectUrlFromDownloadUrl: mocks.getObjectUrlFromDownloadUrl,
}));

vi.mock("@/socket", () => ({
  getSocket: () => ({ emit: mocks.socketEmit }),
}));

vi.mock("@/utils", () => ({
  logger: { error: mocks.loggerError },
}));

vi.mock("@/utils/utils", () => ({
  fetchPaitentName: (i) =>
    i?.firstName || i?.lastName
      ? `${i?.firstName} ${i?.lastName}`
      : i?.fullName,
}));

// Asset barrel — many exports; return a Proxy so any named import resolves.
vi.mock("@/assets", () => {
  const target = { __esModule: true, defaultUserImg: "default-user.png" };
  return new Proxy(target, {
    get: (t, p) => (p in t ? t[p] : "stub"),
    has: () => true,
  });
});

// react-infinite-scroll-hook returns [ref] — give it a no-op ref.
vi.mock("react-infinite-scroll-hook", () => ({
  __esModule: true,
  default: () => [vi.fn()],
}));

// CreateGroup canvas is heavy/unrelated — stub to a probe element.
vi.mock("@/features/shared/ui/Canvas/Canvases", () => ({
  CreateGroup: ({ show }) => (
    <div data-testid="create-group" data-show={String(!!show)} />
  ),
}));

const authState = (userType = "Employee") => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", name: "Test User", userType },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

// A service fetch helper resolves by invoking the provided setResponse callback.
const respondWith =
  (payload) =>
  (limit, { setResponse }) => {
    setResponse(payload);
  };

const baseProps = () => ({
  handleClose: vi.fn(),
  show: true,
  setUserType: vi.fn(),
  chatType: "Employee",
  chatListHandler: vi.fn(),
});

const employeeDoc = {
  _id: "emp-other-001",
  firstName: "Test",
  lastName: "Patient",
  mobileNumber: "555-0100",
  email: "test.patient@example.com",
  profilePic: "pic.png",
};

describe("CreateChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // default: empty result sets unless a test overrides
    mocks.getEmployeesForGroup.mockImplementation(
      respondWith({ data: { totalDocs: 0, docs: [] } }),
    );
    mocks.getPatientsForGroup.mockImplementation(
      respondWith({ data: { totalDocs: 0, docs: [] } }),
    );
    mocks.getGuardiansForGroup.mockImplementation(
      respondWith({ data: { totalDocs: 0, docs: [] } }),
    );
  });

  it("renders the Create New Chat modal title when shown", () => {
    renderWithProviders(<CreateChat {...baseProps()} />, {
      preloadedState: authState(),
    });
    // WHY: react-bootstrap modal must surface the chat-creation entry point.
    expect(screen.getByText("Create New Chat")).toBeInTheDocument();
  });

  it("fetches employees, patients and guardians on mount when show is true", () => {
    renderWithProviders(<CreateChat {...baseProps()} />, {
      preloadedState: authState(),
    });
    // WHY: opening the dialog must populate all three recipient lists.
    expect(mocks.getEmployeesForGroup).toHaveBeenCalled();
    expect(mocks.getPatientsForGroup).toHaveBeenCalled();
    expect(mocks.getGuardiansForGroup).toHaveBeenCalled();
  });

  it("does not fetch when show is false", () => {
    renderWithProviders(<CreateChat {...baseProps()} show={false} />, {
      preloadedState: authState(),
    });
    // WHY: a closed dialog should not trigger network work.
    expect(mocks.getEmployeesForGroup).not.toHaveBeenCalled();
    expect(mocks.getPatientsForGroup).not.toHaveBeenCalled();
    expect(mocks.getGuardiansForGroup).not.toHaveBeenCalled();
  });

  it("lists fetched employees (excluding the current user) for Employee chatType", () => {
    mocks.getEmployeesForGroup.mockImplementation(
      respondWith({
        data: {
          totalDocs: 2,
          // includes the logged-in user (emp-test-001) which must be filtered out
          docs: [employeeDoc, { _id: "emp-test-001", fullName: "Me" }],
        },
      }),
    );
    renderWithProviders(<CreateChat {...baseProps()} />, {
      preloadedState: authState(),
    });

    // WHY: header count reflects only other employees, never yourself.
    expect(screen.getByText("Employees (1)")).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("test.patient@example.com")).toBeInTheDocument();
  });

  it("resolves the profile image through getObjectUrlFromDownloadUrl", () => {
    mocks.getEmployeesForGroup.mockImplementation(
      respondWith({ data: { totalDocs: 1, docs: [employeeDoc] } }),
    );
    renderWithProviders(<CreateChat {...baseProps()} />, {
      preloadedState: authState(),
    });
    // WHY: stored S3 keys must be converted to signed object urls before display.
    expect(mocks.getObjectUrlFromDownloadUrl).toHaveBeenCalledWith("pic.png");
  });

  it("creates a conversation and joins the socket room when an employee is clicked", async () => {
    const user = userEvent.setup();
    mocks.getEmployeesForGroup.mockImplementation(
      respondWith({ data: { totalDocs: 1, docs: [employeeDoc] } }),
    );
    mocks.addConversation.mockResolvedValue({
      data: { conversation: { _id: "conv-test-001" } },
    });
    const props = baseProps();
    renderWithProviders(<CreateChat {...props} />, {
      preloadedState: authState(),
    });

    await user.click(screen.getByText("Test Patient"));

    // WHY: clicking a recipient opens (creates) the conversation server-side.
    expect(mocks.addConversation).toHaveBeenCalledWith(
      "emp-other-001",
      expect.any(Object),
      expect.any(Object),
    );
    await waitFor(() => {
      // WHY: real-time delivery requires joining the new conversation's room.
      expect(mocks.socketEmit).toHaveBeenCalledWith(
        "join-room",
        JSON.stringify({ type: "CONVERSATION", id: "conv-test-001" }),
      );
    });
    expect(props.handleClose).toHaveBeenCalled();
    expect(props.chatListHandler).toHaveBeenCalled();
  });

  it("logs an error and still closes when conversation creation fails", async () => {
    const user = userEvent.setup();
    mocks.getEmployeesForGroup.mockImplementation(
      respondWith({ data: { totalDocs: 1, docs: [employeeDoc] } }),
    );
    mocks.addConversation.mockRejectedValue(new Error("boom"));
    const props = baseProps();
    renderWithProviders(<CreateChat {...props} />, {
      preloadedState: authState(),
    });

    await user.click(screen.getByText("Test Patient"));

    // WHY: a failed create must not leave the modal stuck open.
    await waitFor(() => expect(mocks.loggerError).toHaveBeenCalled());
    expect(props.handleClose).toHaveBeenCalled();
  });

  it("renders the Create New Group button and opens group creation for Group chatType", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<CreateChat {...props} chatType="Group" />, {
      preloadedState: authState(),
    });

    const btn = screen.getByRole("button", { name: /create new group/i });
    await user.click(btn);

    // WHY: the group flow closes this dialog and flips parent userType to Group.
    expect(props.handleClose).toHaveBeenCalled();
    expect(props.setUserType).toHaveBeenCalledWith("Group");
  });

  it("lists residents for Patient chatType", () => {
    mocks.getPatientsForGroup.mockImplementation(
      respondWith({
        data: {
          totalDocs: 1,
          docs: [{ ...employeeDoc, _id: "res-test-001" }],
        },
      }),
    );
    renderWithProviders(<CreateChat {...baseProps()} chatType="Patient" />, {
      preloadedState: authState(),
    });
    // WHY: patient chat surfaces residents, labelled distinctly from employees.
    expect(screen.getByText("Residents (1)")).toBeInTheDocument();
  });

  it("lists guardians for Guardian chatType", () => {
    mocks.getGuardiansForGroup.mockImplementation(
      respondWith({
        data: {
          totalDocs: 1,
          docs: [{ ...employeeDoc, _id: "guard-test-001" }],
        },
      }),
    );
    renderWithProviders(<CreateChat {...baseProps()} chatType="Guardian" />, {
      preloadedState: authState(),
    });
    expect(screen.getByText("Guardian (1)")).toBeInTheDocument();
  });

  it("renders without crashing when service responses are empty", () => {
    renderWithProviders(<CreateChat {...baseProps()} />, {
      preloadedState: authState(),
    });
    // WHY: no recipients should not error out — just show no list rows.
    expect(screen.queryByText(/Employees \(/)).not.toBeInTheDocument();
    expect(screen.getByText("Create New Chat")).toBeInTheDocument();
  });
});

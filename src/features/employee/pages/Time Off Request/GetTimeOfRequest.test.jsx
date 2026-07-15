/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import GetTimeOfRequest from "./GetTimeOfRequest.jsx";

// ─── Hoisted mock handles ───────────────────────────────────────────────
const h = vi.hoisted(() => ({
  useTimeOffList: vi.fn(),
  invalidateQueries: vi.fn(),
  removeRequest: vi.fn(),
  formatDateToMMDDYYYY: vi.fn((d) => `fmt:${d}`),
  getSignature: vi.fn(() => "SIG"),
}));

// HOC: render the wrapped component directly so we test GetTimeOfRequest, not
// the sidebar/navbar layout chrome.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default: ({ Wcomponenet }) =>
    function HOCWrapped() {
      return <Wcomponenet />;
    },
}));

// CreateNav: light stub exposing the props we assert.
vi.mock("@/utils/CreateNav", () => ({
  default: ({ title, link, isAuthorizedToCreate }) => (
    <div
      data-testid="create-nav"
      data-title={title}
      data-link={link}
      data-can-create={String(isAuthorizedToCreate)}
    />
  ),
}));

// DeleteDocModal: stub that surfaces `show` and lets us trigger onDelete.
vi.mock("@/features/shared/ui/DeleteDocModal/DeleteDocModal.jsx", () => ({
  default: ({ show, handleClose, fetchHandler, onDelete }) => (
    <div data-testid="delete-modal" data-show={String(show)}>
      <button onClick={handleClose}>close-modal</button>
      <button onClick={fetchHandler}>fetch-modal</button>
      <button onClick={() => onDelete({ additionalFunctions: ["x"] })}>
        confirm-delete
      </button>
    </div>
  ),
}));

// Pagination: stub rendering current page so we can assert presence/absence.
vi.mock("@/features/shared/ui/Pagination/PaginationsPage.jsx", () => ({
  default: ({ page, totalPages, setPage }) => (
    <div data-testid="pagination" data-page={page} data-total={totalPages}>
      <button onClick={() => setPage(page + 1)}>next-page</button>
    </div>
  ),
}));

// HelpingComponents barrel: render rows/cells so we can assert the data table.
vi.mock("@/features/shared/ui/HelpingComponents", () => ({
  TableLayout: ({ thead, tbody, loading }) => (
    <div data-testid="table" data-loading={String(loading)}>
      <div data-testid="thead">{(thead || []).join("|")}</div>
      {(tbody || []).map((row, ri) => (
        <div key={ri} data-testid="row">
          {row.map((cell, ci) => (
            <span key={ci} data-testid="cell">
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
  InDraft: ({ link }) => (
    <a data-testid="in-draft" href={link}>
      draft
    </a>
  ),
  DropList: ({
    viewLink,
    editLink,
    deleteLink,
    showDelete,
    canEdit,
    canDelete,
  }) => (
    <div
      data-testid="droplist"
      data-view={viewLink}
      data-edit={editLink}
      data-show-delete={String(!!showDelete)}
      data-can-edit={String(!!canEdit)}
      data-can-delete={String(!!canDelete)}
    >
      <button onClick={deleteLink}>row-delete</button>
    </div>
  ),
}));

// timeOffService: only requests.remove is invoked by onDelete.
vi.mock("@/features/shared/services", () => ({
  timeOffService: { requests: { remove: h.removeRequest } },
}));

// Query hook under indirection — mock the data source, no real HTTP.
vi.mock("@/features/shared/services/queries", () => ({
  useTimeOffList: h.useTimeOffList,
}));

// react-query: keep keepPreviousData symbol, stub queryClient invalidation.
vi.mock("@tanstack/react-query", async (orig) => {
  const actual = await orig();
  return {
    ...actual,
    keepPreviousData: "KEEP_PREV",
    useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
  };
});

// utils: deterministic formatters.
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: h.formatDateToMMDDYYYY,
  getSignature: h.getSignature,
}));

// ─── Helpers ────────────────────────────────────────────────────────────
const profile = (over = {}) => ({
  _id: "emp-1",
  userType: "Employee",
  accountType: "regular",
  userPermissions: { edit: "tr", delete: "tr" },
  hoursFormat: "12",
  ...over,
});

const renderPage = (over = {}, profileOver = {}) => {
  h.useTimeOffList.mockReturnValue({
    data: over.data,
    isLoading: over.isLoading ?? false,
  });
  return renderWithProviders(<GetTimeOfRequest />, {
    preloadedState: { auth: { userProfile: profile(profileOver) } },
    route: "/time-off-request",
  });
};

const sampleDocs = [
  {
    _id: "doc-1",
    requestType: "Vacation",
    beginDate: "2026-06-01",
    endDate: "2026-06-05",
    status: "Pending",
    signatureSaveAsDraft: false,
    signers: [],
  },
];

describe("GetTimeOfRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create-nav with the time-off title and create link", () => {
    renderPage({ data: { docs: [], totalPages: 1 } });
    const nav = screen.getByTestId("create-nav");
    expect(nav).toHaveAttribute("data-title", "Time off Request");
    expect(nav).toHaveAttribute("data-link", "/create-time-of-request");
  });

  it("renders the table headers", () => {
    renderPage({ data: { docs: [], totalPages: 1 } });
    const thead = screen.getByTestId("thead").textContent;
    expect(thead).toContain("Request Type");
    expect(thead).toContain("Status");
    expect(thead).toContain("Action");
  });

  it("maps a request into a table row with formatted dates and signature", () => {
    renderPage({ data: { docs: sampleDocs, totalPages: 2 } });
    // WHY: dates run through the mocked formatter; signature cell via getSignature.
    expect(h.formatDateToMMDDYYYY).toHaveBeenCalledWith("2026-06-01");
    expect(h.formatDateToMMDDYYYY).toHaveBeenCalledWith("2026-06-05");
    expect(h.getSignature).toHaveBeenCalled();
    expect(screen.getByText("Vacation")).toBeInTheDocument();
    expect(screen.getByText("fmt:2026-06-01")).toBeInTheDocument();
    expect(screen.getByTestId("droplist")).toBeInTheDocument();
  });

  it("renders an InDraft link instead of a DropList for draft rows", () => {
    renderPage({
      data: {
        docs: [{ ...sampleDocs[0], signatureSaveAsDraft: true }],
        totalPages: 1,
      },
    });
    const draft = screen.getByTestId("in-draft");
    expect(draft).toHaveAttribute("href", "/edit-time-off-request/doc-1");
    expect(screen.queryByTestId("droplist")).not.toBeInTheDocument();
  });

  it("shows pagination when there are rows", () => {
    renderPage({ data: { docs: sampleDocs, totalPages: 3 } });
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-total", "3");
  });

  it("hides pagination when there are no rows", () => {
    renderPage({ data: { docs: [], totalPages: 1 } });
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("passes loading state to the table", () => {
    renderPage({ data: undefined, isLoading: true });
    expect(screen.getByTestId("table")).toHaveAttribute("data-loading", "true");
  });

  it("forwards filters to useTimeOffList with keepPreviousData", () => {
    renderPage({ data: { docs: [], totalPages: 1 } });
    expect(h.useTimeOffList).toHaveBeenCalledWith(
      { page: 1, limit: expect.any(Number) },
      { placeholderData: "KEEP_PREV" },
    );
  });

  it("opens the delete modal and invalidates queries via fetchHandler", async () => {
    const user = userEvent.setup();
    renderPage({ data: { docs: sampleDocs, totalPages: 1 } });

    await user.click(screen.getByText("row-delete"));
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "true",
    );

    // fetchHandler -> getAllData -> queryClient.invalidateQueries
    await user.click(screen.getByText("fetch-modal"));
    expect(h.invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: expect.any(Array) }),
    );
  });

  it("delegates the actual delete to timeOffService.requests.remove", async () => {
    const user = userEvent.setup();
    renderPage({ data: { docs: sampleDocs, totalPages: 1 } });

    await user.click(screen.getByText("row-delete")); // sets deleteId = doc-1
    await user.click(screen.getByText("confirm-delete"));

    expect(h.removeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "doc-1",
        additionalFunctions: ["x"],
      }),
    );
  });

  it("blocks create for Admin users", () => {
    renderPage({ data: { docs: [], totalPages: 1 } }, { userType: "Admin" });
    expect(screen.getByTestId("create-nav")).toHaveAttribute(
      "data-can-create",
      "false",
    );
  });

  it("is resilient when the response has no docs field", () => {
    renderPage({ data: {} });
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("grants delete permission to administrator account type", () => {
    renderPage(
      { data: { docs: sampleDocs, totalPages: 1 } },
      { accountType: "adminstrator", userPermissions: {} },
    );
    expect(screen.getByTestId("droplist")).toHaveAttribute(
      "data-show-delete",
      "true",
    );
  });
});

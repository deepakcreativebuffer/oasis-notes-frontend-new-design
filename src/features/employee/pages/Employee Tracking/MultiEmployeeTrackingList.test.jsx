/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import MultiEmployeeTrackingList from "./MultiEmployeeTrackingList";

// --- hoisted mock handles (vitest hoists vi.mock above imports) -------------
const h = vi.hoisted(() => ({
  useEmployeeTrackingList: vi.fn(),
  invalidateQueries: vi.fn(),
  deleteSvc: vi.fn(),
  getObjectUrlFromDownloadUrl: vi.fn((d) => `obj-url:${d}`),
}));

// HOC just wraps the page in chrome (sidebar/navbar). Render the inner page
// directly so this test isolates the list logic, not the layout shell.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  // HOC is a factory: HOC({ Wcomponenet }) returns the composed component.
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

vi.mock("@/features/shared/services/queries", () => ({
  useEmployeeTrackingList: h.useEmployeeTrackingList,
}));

vi.mock("@/features/shared/services", () => ({
  employeeTrackingService: { delete: h.deleteSvc },
  getObjectUrlFromDownloadUrl: h.getObjectUrlFromDownloadUrl,
}));

// Keep the real query-key factory but spy invalidateQueries via useQueryClient.
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
  };
});

// CreateNav renders a header + create link; stub to assert its props.
vi.mock("@/utils/CreateNav", () => ({
  default: ({ title, link }) => (
    <div data-testid="create-nav" data-link={link}>
      {title}
    </div>
  ),
}));

// DeleteDocModal exposes its open state + the onDelete callback so we can drive
// the server-delete branch without rendering the real modal internals.
vi.mock("@/features/shared/ui/DeleteDocModal/DeleteDocModal", () => ({
  default: ({ show, onDelete, fetchHandler, handleClose }) => (
    <div data-testid="delete-modal" data-show={String(show)}>
      <button onClick={() => onDelete({ additionalFunctions: () => "addl" })}>
        confirm-delete
      </button>
      <button onClick={fetchHandler}>fetch</button>
      <button onClick={handleClose}>close-modal</button>
    </div>
  ),
}));

// TableLayout: render the body cells (and loading flag) so we can assert rows.
// DropList: surface its action props (download/edit/delete + permission flags).
vi.mock("@/features/shared/ui/HelpingComponents", () => ({
  TableLayout: ({ thead, tbody, loading }) => (
    <table data-testid="table" data-loading={String(loading)}>
      <thead>
        <tr>
          {thead.map((h2) => (
            <th key={h2}>{h2}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tbody.map((row, i) => (
          <tr key={i} data-testid="row">
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  DropList: ({ download, canEdit, canDelete, editLink, deleteLink }) => (
    <div
      data-testid="droplist"
      data-download={download}
      data-can-edit={String(canEdit)}
      data-can-delete={String(canDelete)}
      data-edit-link={editLink}
    >
      <button onClick={deleteLink}>row-delete</button>
    </div>
  ),
}));

vi.mock("@/features/shared/ui/Pagination/PaginationsPage", () => ({
  default: ({ page, totalPages }) => (
    <div data-testid="pagination" data-page={page} data-total={totalPages} />
  ),
}));

const stateForRole = (userType, extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-test-001", name: "Test User", userType, ...extra },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const sampleDocs = [
  {
    _id: "res-test-001",
    type: "License",
    dueDate: "2026-01-15T00:00:00.000Z",
    document: "doc-1",
  },
];

const mockList = (data, isLoading = false) =>
  h.useEmployeeTrackingList.mockReturnValue({ data, isLoading });

describe("MultiEmployeeTrackingList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.getObjectUrlFromDownloadUrl.mockImplementation((d) => `obj-url:${d}`);
  });

  it("should render the create nav and table headers", () => {
    mockList({ docs: [], totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });

    expect(screen.getByTestId("create-nav")).toHaveTextContent(
      "Employee Tracking",
    );
    // WHY: create link must point at the upload route so staff can add records.
    expect(screen.getByTestId("create-nav")).toHaveAttribute(
      "data-link",
      "/upload-employee-tracking",
    );
    ["Name", "DueDate", "Action"].forEach((col) =>
      expect(screen.getByText(col)).toBeInTheDocument(),
    );
  });

  it("should request the admin-scoped list when the user is an Admin", () => {
    mockList({ docs: [], totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });

    // WHY: admins see the org-wide tracking list (isAdmin=true) vs an employee's
    // own scope; the flag is derived from the role.
    expect(h.useEmployeeTrackingList).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, isAdmin: true }),
      expect.anything(),
    );
  });

  it("should request the non-admin scope for an Employee", () => {
    mockList({ docs: [], totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Employee"),
    });

    expect(h.useEmployeeTrackingList).toHaveBeenCalledWith(
      expect.objectContaining({ isAdmin: false }),
      expect.anything(),
    );
  });

  it("should render a data row with formatted due date and a download url", () => {
    mockList({ docs: sampleDocs, totalPages: 2 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });

    expect(screen.getByText("License")).toBeInTheDocument();
    // WHY: due date is normalised to MM/DD/YYYY for clinical staff readability.
    expect(screen.getByText("01/15/2026")).toBeInTheDocument();
    // WHY: the download link is resolved from the stored document via the
    // object-url helper, not the raw path.
    expect(h.getObjectUrlFromDownloadUrl).toHaveBeenCalledWith("doc-1");
    expect(screen.getByTestId("droplist")).toHaveAttribute(
      "data-download",
      "obj-url:doc-1",
    );
    expect(screen.getByTestId("droplist")).toHaveAttribute(
      "data-edit-link",
      "/upload-employee-tracking/res-test-001",
    );
  });

  it("should show pagination only when there are rows", () => {
    mockList({ docs: sampleDocs, totalPages: 3 });
    const { rerender } = renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-total", "3");

    mockList({ docs: [], totalPages: 1 });
    rerender(<MultiEmployeeTrackingList />);
    // WHY: an empty list should not render paging controls.
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("should pass the loading flag through to the table", () => {
    mockList(undefined, true);
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });
    expect(screen.getByTestId("table")).toHaveAttribute("data-loading", "true");
  });

  it("should grant edit/delete to an Admin", () => {
    mockList({ docs: sampleDocs, totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });
    const drop = screen.getByTestId("droplist");
    expect(drop).toHaveAttribute("data-can-edit", "true");
    expect(drop).toHaveAttribute("data-can-delete", "true");
  });

  it("should gate edit/delete behind permissions for a regular Employee", () => {
    mockList({ docs: sampleDocs, totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Employee", {
        accountType: "regular",
        userPermissions: { edit: "etracking:other", delete: "other" },
      }),
    });
    const drop = screen.getByTestId("droplist");
    // WHY: a regular employee may edit only with the etracking permission, and
    // here lacks the delete permission entirely.
    expect(drop).toHaveAttribute("data-can-edit", "true");
    expect(drop).toHaveAttribute("data-can-delete", "false");
  });

  it("should open the delete modal when a row delete is triggered", () => {
    mockList({ docs: sampleDocs, totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });

    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "false",
    );
    fireEvent.click(screen.getByRole("button", { name: "row-delete" }));
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "true",
    );
  });

  it("should call the tracking delete service with the selected id on confirm", () => {
    mockList({ docs: sampleDocs, totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });

    fireEvent.click(screen.getByRole("button", { name: "row-delete" }));
    fireEvent.click(screen.getByRole("button", { name: "confirm-delete" }));

    // WHY: the modal's onDelete must delegate to the service with the row id and
    // the admin scope so the correct record is removed server-side.
    expect(h.deleteSvc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "res-test-001", isAdmin: true }),
    );
  });

  it("should invalidate the tracking cache via fetchHandler", () => {
    mockList({ docs: sampleDocs, totalPages: 1 });
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });

    fireEvent.click(screen.getByRole("button", { name: "fetch" }));
    // WHY: after a delete the list must be refetched by invalidating the shared
    // employeeTracking query key.
    expect(h.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["employeeTracking"],
    });
  });

  it("should render without crashing when the response is undefined", () => {
    mockList(undefined, false);
    renderWithProviders(<MultiEmployeeTrackingList />, {
      preloadedState: stateForRole("Admin"),
    });
    // WHY: before data arrives the page must still mount with an empty table.
    expect(screen.getByTestId("table")).toBeInTheDocument();
    expect(screen.queryByTestId("row")).not.toBeInTheDocument();
  });
});

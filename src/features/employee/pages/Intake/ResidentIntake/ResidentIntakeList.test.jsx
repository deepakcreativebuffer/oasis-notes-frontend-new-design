/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ResidentIntakeList from "./ResidentIntakeList";

// ── Hoisted mock fns referenced inside vi.mock factories ──────────────────
const h = vi.hoisted(() => ({
  useResidentIntakeList: vi.fn(),
  invalidateQueries: vi.fn(),
  intakeRemove: vi.fn(),
}));

// HOC wraps the page in the full Sidebar/Navbar shell (heavy, pulls assets).
// Stub it to render the inner component directly.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) =>
    function Stubbed() {
      return <Wcomponenet />;
    },
}));

// CreateNav: surface the title and the create-authorization flag we assert on.
vi.mock("@/utils/CreateNav", () => ({
  __esModule: true,
  default: ({ title, link, isAuthorizedToCreate }) => (
    <div
      data-testid="create-nav"
      data-link={link}
      data-can-create={String(isAuthorizedToCreate)}
    >
      {title}
    </div>
  ),
}));

// DeleteDocModal: expose show state + a trigger to fire onDelete/fetchHandler.
vi.mock("@/features/shared/ui/DeleteDocModal/DeleteDocModal", () => ({
  __esModule: true,
  default: ({ show, handleClose, fetchHandler, onDelete }) => (
    <div data-testid="delete-modal" data-show={String(show)}>
      <button type="button" onClick={handleClose}>
        modal-close
      </button>
      <button type="button" onClick={fetchHandler}>
        modal-fetch
      </button>
      <button
        type="button"
        onClick={() => onDelete({ additionalFunctions: vi.fn() })}
      >
        modal-delete
      </button>
    </div>
  ),
}));

// PaginationsPage: only renders when there are rows; expose totalPages.
vi.mock("@/features/shared/ui/Pagination/PaginationsPage", () => ({
  __esModule: true,
  default: ({ page, totalPages }) => (
    <div data-testid="pagination" data-page={page} data-total={totalPages} />
  ),
}));

// HelpingComponents.TableLayout / DropList — render headers + body cells so we
// can assert mapped data; DropList exposes canEdit/canDelete + delete trigger.
vi.mock("@/features/shared/ui/HelpingComponents", () => ({
  __esModule: true,
  TableLayout: ({ thead, tbody, loading }) => (
    <div data-testid="table" data-loading={String(loading)}>
      <div data-testid="thead">
        {(thead || []).map((h2, i) => (
          <span key={i} className="th-cell">
            {h2}
          </span>
        ))}
      </div>
      <div data-testid="tbody" data-rows={(tbody || []).length}>
        {(tbody || []).map((row, ri) => (
          <div key={ri} className="t-row">
            {row.map((cell, ci) => (
              <span key={ci} className="t-cell">
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  ),
  DropList: ({ viewLink, editLink, deleteLink, canEdit, canDelete }) => (
    <span
      data-testid="droplist"
      data-view={viewLink}
      data-edit={editLink}
      data-can-edit={String(canEdit)}
      data-can-delete={String(canDelete)}
    >
      <button type="button" data-testid="droplist-delete" onClick={deleteLink}>
        del
      </button>
    </span>
  ),
}));

// intakeService.residentIntake.remove is the server delete the modal invokes.
vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  intakeService: {
    residentIntake: { remove: h.intakeRemove },
  },
}));

// Date + signature presence helpers — deterministic stubs.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  formatDateWithoutUTCHandleToMMDDYYYY: (d) => `FMT-${d}`,
  isGuardianSignaturePresentOnAllPages: vi.fn(() => false),
  isSignerPresentOnAllPages: vi.fn(() => false),
}));

// The list query hook (TanStack). Controlled per-test via h.useResidentIntakeList.
vi.mock("@/features/shared/services/queries", () => ({
  __esModule: true,
  useResidentIntakeList: h.useResidentIntakeList,
}));

// Replace useQueryClient so we can assert invalidateQueries on fetchHandler.
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
  };
});

const ADMIN_DOC = {
  _id: "ri-test-001",
  patientId: {
    firstName: "Test",
    lastName: "Patient",
    diagnosis: "MRN-TEST-001 dx",
  },
  createdAt: "2026-06-01",
  signatures: [],
};

const renderList = (profileOverrides = {}) =>
  renderWithProviders(<ResidentIntakeList />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        userProfile: {
          _id: "emp-test-001",
          userType: "Admin",
          accountType: "adminstrator",
          userPermissions: { edit: "ri", delete: "ri" },
          guardians: [],
          ...profileOverrides,
        },
        unreadMessages: 0,
        unreadNotifications: 0,
      },
    },
  });

describe("ResidentIntakeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: one resident-intake doc, loaded, single page.
    h.useResidentIntakeList.mockReturnValue({
      data: { docs: [ADMIN_DOC], totalPages: 1 },
      isLoading: false,
    });
  });

  it("renders the CreateNav with the Resident Intake title and create link", () => {
    renderList();
    const nav = screen.getByTestId("create-nav");
    expect(nav).toHaveTextContent("Resident Intake");
    expect(nav).toHaveAttribute("data-link", "/resident-intake");
  });

  it("renders the table headers for the intake list", () => {
    renderList();
    const cells = screen
      .getAllByText(/Resident|Created On|Diagnosis|Action/)
      .map((e) => e.textContent);
    // WHY: all four configured columns must be present for the clinician table.
    expect(cells.some((c) => /Created On/.test(c))).toBe(true);
    expect(cells.some((c) => /Diagnosis/.test(c))).toBe(true);
    expect(cells.some((c) => /Action/.test(c))).toBe(true);
  });

  it("maps each doc into a row with patient name and formatted date", () => {
    renderList();
    expect(screen.getByTestId("tbody")).toHaveAttribute("data-rows", "1");
    // Name is composed firstName + lastName.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    // Date routed through the formatter stub.
    expect(screen.getByText("FMT-2026-06-01")).toBeInTheDocument();
    expect(screen.getByText("MRN-TEST-001 dx")).toBeInTheDocument();
  });

  it("queries the hook with the initial page/limit", () => {
    renderList();
    expect(h.useResidentIntakeList).toHaveBeenCalledWith(
      { page: 1, limit: 10 },
      expect.objectContaining({ placeholderData: expect.anything() }),
    );
  });

  it("passes employee view/edit links into the DropList for an Admin", () => {
    renderList();
    const drop = screen.getByTestId("droplist");
    // WHY: Admin is not a resident-portal user -> employee route prefix.
    expect(drop).toHaveAttribute(
      "data-view",
      "/view-resident-intake/ri-test-001",
    );
    expect(drop).toHaveAttribute(
      "data-edit",
      "/edit-resident-intake/ri-test-001",
    );
  });

  it("grants edit + delete to an Admin with ri permissions", () => {
    renderList();
    const drop = screen.getByTestId("droplist");
    expect(drop).toHaveAttribute("data-can-edit", "true");
    expect(drop).toHaveAttribute("data-can-delete", "true");
  });

  it("denies delete when the user lacks the ri delete permission", () => {
    renderList({ userPermissions: { edit: "ri", delete: "other" } });
    expect(screen.getByTestId("droplist")).toHaveAttribute(
      "data-can-delete",
      "false",
    );
  });

  it("uses resident-portal links for a Patient user", () => {
    renderList({ userType: "Patient" });
    expect(screen.getByTestId("droplist")).toHaveAttribute(
      "data-view",
      "/view-resident-intake-resident/ri-test-001",
    );
  });

  it("does not authorize a Patient to create a new intake", () => {
    renderList({ userType: "Patient" });
    // canCreateIntakeDocument(Patient) === false
    expect(screen.getByTestId("create-nav")).toHaveAttribute(
      "data-can-create",
      "false",
    );
  });

  it("authorizes a Guardian to create a new intake", () => {
    renderList({ userType: "Guardian" });
    expect(screen.getByTestId("create-nav")).toHaveAttribute(
      "data-can-create",
      "true",
    );
  });

  it("renders pagination with the response totalPages when rows exist", () => {
    h.useResidentIntakeList.mockReturnValue({
      data: { docs: [ADMIN_DOC], totalPages: 4 },
      isLoading: false,
    });
    renderList();
    expect(screen.getByTestId("pagination")).toHaveAttribute("data-total", "4");
  });

  it("hides pagination when there are no rows", () => {
    h.useResidentIntakeList.mockReturnValue({
      data: { docs: [], totalPages: 1 },
      isLoading: false,
    });
    renderList();
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    expect(screen.getByTestId("tbody")).toHaveAttribute("data-rows", "0");
  });

  it("forwards the loading flag to the table", () => {
    h.useResidentIntakeList.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    renderList();
    expect(screen.getByTestId("table")).toHaveAttribute("data-loading", "true");
  });

  it("renders without crashing when a doc is missing patient fields", () => {
    h.useResidentIntakeList.mockReturnValue({
      data: { docs: [{ _id: "ri-test-002" }], totalPages: 1 },
      isLoading: false,
    });
    expect(() => renderList()).not.toThrow();
    expect(screen.getByTestId("tbody")).toHaveAttribute("data-rows", "1");
  });

  it("opens the delete modal and invalidates the query on fetchHandler", async () => {
    const user = userEvent.setup();
    renderList();

    // Initially hidden.
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "false",
    );

    // Clicking the row delete affordance opens the modal.
    await user.click(screen.getByTestId("droplist-delete"));
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "true",
    );

    // fetchHandler invalidates the residentIntake list cache.
    fireEvent.click(screen.getByText("modal-fetch"));
    expect(h.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["intake", "residentIntake", "list"],
    });
  });

  it("wires onDelete to the residentIntake remove service with the selected id", async () => {
    const user = userEvent.setup();
    renderList();

    await user.click(screen.getByTestId("droplist-delete"));
    fireEvent.click(screen.getByText("modal-delete"));

    expect(h.intakeRemove).toHaveBeenCalledWith(
      expect.objectContaining({ id: "ri-test-001" }),
    );
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import NursingAssessmentList from "./NursingAssessmentList";

// ── Hoisted mock handles referenced inside vi.mock factories ──────────────
const mocks = vi.hoisted(() => ({
  useNursingAssessmentList: vi.fn(),
  invalidateQueries: vi.fn(),
  removeNursingAssessment: vi.fn(),
}));

// HOC is called at module load with { Wcomponenet }; it must RETURN a
// component (not a JSX element), so wrap it in a passthrough function.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default:
    ({ Wcomponenet }) =>
    (props) => <Wcomponenet {...props} />,
}));

// CreateNav: light stub exposing the props we assert (title + auth flag).
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

// Helping components — render minimal markup surfacing key props.
vi.mock("@/features/shared/ui/HelpingComponents", () => ({
  __esModule: true,
  InDraft: ({ link }) => (
    <span data-testid="in-draft" data-link={link}>
      In Draft
    </span>
  ),
  DropList: ({ viewLink, editLink, deleteLink, canEdit, canDelete }) => (
    <div
      data-testid="drop-list"
      data-view={viewLink}
      data-edit={editLink}
      data-can-edit={String(Boolean(canEdit))}
      data-can-delete={String(Boolean(canDelete))}
    >
      <button data-testid="drop-delete" onClick={() => deleteLink?.()}>
        delete
      </button>
    </div>
  ),
  TableLayout: ({ thead, tbody, loading }) => (
    <table data-testid="table-layout" data-loading={String(loading)}>
      <thead>
        <tr>
          {(thead || []).map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(tbody || []).map((row, ri) => (
          <tr key={ri} data-testid="table-row">
            {row.map((cell, ci) => (
              <td key={ci}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

// Pagination: surface page/totalPages so we can assert it mounts when rows exist.
vi.mock("@/features/shared/ui/Pagination/PaginationsPage", () => ({
  __esModule: true,
  default: ({ page, totalPages }) => (
    <div data-testid="pagination" data-page={page} data-total={totalPages} />
  ),
}));

// DeleteDocModal: surface `show` and wire onDelete so we can assert the
// intakeService.nursingAssessment.remove call is composed with the delete id.
vi.mock("@/features/shared/ui/DeleteDocModal/DeleteDocModal", () => ({
  __esModule: true,
  default: ({ show, onDelete, fetchHandler, handleClose }) => (
    <div data-testid="delete-modal" data-show={String(show)}>
      <button
        data-testid="modal-confirm"
        onClick={() => onDelete?.({ additionalFunctions: "fn" })}
      >
        confirm
      </button>
      <button data-testid="modal-fetch" onClick={() => fetchHandler?.()}>
        fetch
      </button>
      <button data-testid="modal-close" onClick={() => handleClose?.()}>
        close
      </button>
    </div>
  ),
}));

vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  intakeService: {
    nursingAssessment: { remove: mocks.removeNursingAssessment },
  },
}));

vi.mock("@/features/shared/services/queries", () => ({
  __esModule: true,
  useNursingAssessmentList: mocks.useNursingAssessmentList,
}));

// Keep the real useQueryClient harness but spy on invalidateQueries.
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: mocks.invalidateQueries }),
  };
});

const makeDoc = (overrides = {}) => ({
  _id: "doc-test-001",
  patientId: {
    firstName: "Test",
    lastName: "Patient",
    diagnosis: "Anxiety (new)",
  },
  createdAt: "2026-01-15T00:00:00.000Z",
  saveAsDraft: false,
  signers: [],
  ...overrides,
});

const employeeProfile = {
  _id: "emp-test-001",
  userType: "Employee",
  accountType: "adminstrator",
  userPermissions: { edit: "nass", delete: "nass" },
};

const renderList = ({
  data,
  loading = false,
  profile = employeeProfile,
} = {}) => {
  mocks.useNursingAssessmentList.mockReturnValue({
    data,
    isLoading: loading,
  });
  return renderWithProviders(<NursingAssessmentList />, {
    preloadedState: { auth: { userProfile: profile } },
  });
};

describe("NursingAssessmentList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create nav with the nursing assessment title and create link", () => {
    renderList({ data: { docs: [], totalPages: 1 } });
    const nav = screen.getByTestId("create-nav");
    expect(nav).toHaveTextContent("Nursing Assessment");
    expect(nav).toHaveAttribute("data-link", "/nursing-assessment");
    // Employee is not a Patient -> authorized to create.
    expect(nav).toHaveAttribute("data-can-create", "true");
  });

  it("renders the table headers", () => {
    renderList({ data: { docs: [], totalPages: 1 } });
    expect(screen.getByText("Created On")).toBeInTheDocument();
    expect(
      screen.getByText("Diagnosis (specify if new or continuing)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders nothing in the table body and hides pagination when there are no docs", () => {
    renderList({ data: { docs: [], totalPages: 1 } });
    expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });

  it("renders a row with the resident name, diagnosis, and a DropList for a non-draft doc", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 3 } });
    // Patient full name is composed from first + last name.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Anxiety (new)")).toBeInTheDocument();
    expect(screen.getByTestId("drop-list")).toBeInTheDocument();
    // Non-draft does not render the InDraft badge.
    expect(screen.queryByTestId("in-draft")).not.toBeInTheDocument();
  });

  it("renders an InDraft badge instead of a DropList for a draft doc", () => {
    renderList({
      data: { docs: [makeDoc({ saveAsDraft: true })], totalPages: 1 },
    });
    const draft = screen.getByTestId("in-draft");
    expect(draft).toBeInTheDocument();
    // Draft edit link points at the employee nursing-assessment edit route.
    expect(draft).toHaveAttribute(
      "data-link",
      "/edit-nursing-assessment/doc-test-001",
    );
    expect(screen.queryByTestId("drop-list")).not.toBeInTheDocument();
  });

  it("passes employee edit/view links to the DropList", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 1 } });
    const drop = screen.getByTestId("drop-list");
    expect(drop).toHaveAttribute(
      "data-view",
      "/view-nursing-assessment/doc-test-001",
    );
    expect(drop).toHaveAttribute(
      "data-edit",
      "/edit-nursing-assessment/doc-test-001",
    );
  });

  it("grants edit/delete to an administrator with nass permissions", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 1 } });
    const drop = screen.getByTestId("drop-list");
    // accountType === administrator => canEdit true.
    expect(drop).toHaveAttribute("data-can-edit", "true");
    // delete permission string includes "nass".
    expect(drop).toHaveAttribute("data-can-delete", "true");
  });

  it("denies edit/delete to a regular employee without nass permissions", () => {
    renderList({
      data: { docs: [makeDoc()], totalPages: 1 },
      profile: {
        _id: "emp-test-002",
        userType: "Employee",
        accountType: "regular",
        userPermissions: { edit: "other", delete: "other" },
      },
    });
    const drop = screen.getByTestId("drop-list");
    expect(drop).toHaveAttribute("data-can-edit", "false");
    expect(drop).toHaveAttribute("data-can-delete", "false");
  });

  it("grants edit when the current user is an unsigned signer", () => {
    renderList({
      data: {
        docs: [
          makeDoc({
            signers: [{ signerId: "emp-test-003", signature: [] }],
          }),
        ],
        totalPages: 1,
      },
      profile: {
        _id: "emp-test-003",
        userType: "Employee",
        accountType: "regular",
        userPermissions: { edit: "other", delete: "other" },
      },
    });
    expect(screen.getByTestId("drop-list")).toHaveAttribute(
      "data-can-edit",
      "true",
    );
  });

  it("shows pagination with the response totalPages when docs exist", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 7 } });
    const pager = screen.getByTestId("pagination");
    expect(pager).toBeInTheDocument();
    expect(pager).toHaveAttribute("data-total", "7");
    expect(pager).toHaveAttribute("data-page", "1");
  });

  it("passes the loading flag through to the TableLayout", () => {
    renderList({ data: undefined, loading: true });
    expect(screen.getByTestId("table-layout")).toHaveAttribute(
      "data-loading",
      "true",
    );
  });

  it("renders without crashing and shows no rows when response is undefined", () => {
    renderList({ data: undefined });
    expect(screen.getByTestId("table-layout")).toBeInTheDocument();
    expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
  });

  it("opens the delete modal and triggers intakeService.remove with the doc id on confirm", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 1 } });
    // Trigger delete from the row's DropList to set the delete id + show modal.
    fireEvent.click(screen.getByTestId("drop-delete"));
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "true",
    );
    // Confirm in the modal -> onDelete composes the remove call with delete id.
    fireEvent.click(screen.getByTestId("modal-confirm"));
    expect(mocks.removeNursingAssessment).toHaveBeenCalledWith({
      id: "doc-test-001",
      additionalFunctions: "fn",
    });
  });

  it("invalidates the nursing assessment list query via the modal fetch handler", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 1 } });
    fireEvent.click(screen.getByTestId("modal-fetch"));
    expect(mocks.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ["intake", "nursingAssessment", "list"],
    });
  });

  it("closes the delete modal via the modal close handler", () => {
    renderList({ data: { docs: [makeDoc()], totalPages: 1 } });
    fireEvent.click(screen.getByTestId("drop-delete"));
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "true",
    );
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "false",
    );
  });

  it("disallows create for a Patient user", () => {
    renderList({
      data: { docs: [], totalPages: 1 },
      profile: { _id: "pat-test-001", userType: "Patient" },
    });
    expect(screen.getByTestId("create-nav")).toHaveAttribute(
      "data-can-create",
      "false",
    );
  });
});

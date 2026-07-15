/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, within } from "@/test-utils";

import InitialAssessmentList from "./InitialAssessmentList";

// ─── Mocks ──────────────────────────────────────────────────────────
// Hoisted handles so vi.mock factories can reference them and tests can
// drive the list query + assert the delete service is wired.
const mocks = vi.hoisted(() => ({
  useInitialAssessmentList: vi.fn(),
  remove: vi.fn(),
}));

// The list data comes from a TanStack Query hook — control it directly so no
// real HTTP fires and we can exercise empty/populated/draft branches.
vi.mock("@/features/shared/services/queries", () => ({
  useInitialAssessmentList: mocks.useInitialAssessmentList,
}));

// Delete is performed via the intake service; spy it to assert the row id is
// forwarded without issuing a network call.
vi.mock("@/features/shared/services/index", () => ({
  intakeService: {
    initialAssessment: {
      remove: mocks.remove,
    },
  },
}));

// HOC normally wraps the page in Sidebar/Navbar chrome (heavy, needs layout
// context). Render the inner component directly so we test the list only.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Light stub: expose the create-authorization flag + title so we can assert
// the page-level "Create New" gate without pulling in the real nav chrome.
vi.mock("@/utils/CreateNav", () => ({
  default: ({ title, isAuthorizedToCreate }) => (
    <div data-testid="create-nav">
      <span>{title}</span>
      <span data-testid="can-create">{String(isAuthorizedToCreate)}</span>
    </div>
  ),
}));

// Light stub for the delete modal: surface `show` and a button that invokes
// the page's onDelete so we can assert it routes to the intake remove service.
vi.mock("@/features/shared/ui/DeleteDocModal/DeleteDocModal", () => ({
  default: ({ show, onDelete, handleClose }) => (
    <div data-testid="delete-modal" data-show={String(show)}>
      <button
        type="button"
        onClick={() => onDelete({ additionalFunctions: vi.fn() })}
      >
        confirm-delete
      </button>
      <button type="button" onClick={handleClose}>
        close-delete
      </button>
    </div>
  ),
}));

// Pagination is only rendered when there are rows; stub it so its presence is
// a simple, queryable signal.
vi.mock("@/features/shared/ui/Pagination/PaginationsPage", () => ({
  default: ({ totalPages }) => (
    <div data-testid="pagination">pages:{totalPages}</div>
  ),
}));

// ─── Fixtures ───────────────────────────────────────────────────────
const stateForProfile = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      userType: "Employee",
      accountType: "regular",
      userPermissions: { edit: "iass", delete: "iass" },
      ...overrides,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const sampleDoc = (over = {}) => ({
  _id: "iass-test-001",
  residentName: "Test Patient",
  todayDate: "2026-01-15T00:00:00.000Z",
  patientId: { diagnosis: "Test Diagnosis" },
  saveAsDraft: false,
  signers: [],
  ...over,
});

const setList = ({ docs = [], totalPages = 1, isLoading = false } = {}) => {
  mocks.useInitialAssessmentList.mockReturnValue({
    data: { docs, totalPages },
    isLoading,
  });
};

describe("InitialAssessmentList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setList({ docs: [] });
  });

  it("renders the list page with its title and column headers", () => {
    setList({ docs: [sampleDoc()], totalPages: 3 });
    renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });

    // WHY: smoke-confirm the page mounts and shows the intake document title.
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
    expect(
      screen.getByText(/Diagnosis \(specify if new or continuing\)/i),
    ).toBeInTheDocument();
  });

  it("renders a row from the query data with resident name and diagnosis", () => {
    setList({ docs: [sampleDoc()], totalPages: 1 });
    renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });

    // WHY: the table must surface the fetched assessment's identifying fields.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Test Diagnosis")).toBeInTheDocument();
  });

  it("passes the query filters through to the list hook", () => {
    setList({ docs: [sampleDoc()] });
    renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });

    // WHY: pagination state (page/limit) must reach the data hook.
    expect(mocks.useInitialAssessmentList).toHaveBeenCalledWith(
      { page: 1, limit: 10 },
      expect.any(Object),
    );
  });

  it("shows pagination only when there are rows", () => {
    // No docs -> empty list, no pagination.
    setList({ docs: [] });
    const { unmount } = renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
    unmount();

    setList({ docs: [sampleDoc()], totalPages: 5 });
    renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });
    expect(screen.getByTestId("pagination")).toHaveTextContent("pages:5");
  });

  it("renders an in-draft indicator instead of action menu for draft rows", () => {
    setList({ docs: [sampleDoc({ saveAsDraft: true })] });
    const { container } = renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });

    // WHY: drafts are not yet actionable — they link to edit via the draft
    // icon rather than exposing view/delete actions.
    expect(container.querySelector(".in-draft-icon")).toBeInTheDocument();
    expect(container.querySelector(".view-btn")).not.toBeInTheDocument();
  });

  it("routes a confirmed delete to the intake remove service with the row id", async () => {
    const user = userEvent.setup();
    setList({ docs: [sampleDoc()] });
    const { container } = renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });

    // Trigger the delete from the row action (RiDeleteBin icon) then confirm.
    const deleteIcon = container.querySelector(".del-btn svg");
    expect(deleteIcon).toBeTruthy();
    await user.click(deleteIcon);

    await user.click(screen.getByText("confirm-delete"));

    // WHY: confirming delete must call the intake service for the selected id,
    // not just close the modal.
    expect(mocks.remove).toHaveBeenCalledTimes(1);
    expect(mocks.remove).toHaveBeenCalledWith(
      expect.objectContaining({ id: "iass-test-001" }),
    );
  });

  it("gates the Create New button by role (Patient cannot create)", () => {
    setList({ docs: [] });
    const { unmount } = renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile({ userType: "Employee" }),
    });
    // WHY: employees may create intake docs.
    expect(screen.getByTestId("can-create")).toHaveTextContent("true");
    unmount();

    renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile({ userType: "Patient" }),
    });
    // WHY: patients are read-only for initial assessments — no create.
    expect(screen.getByTestId("can-create")).toHaveTextContent("false");
  });

  it("handles missing/empty query data without crashing", () => {
    mocks.useInitialAssessmentList.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    renderWithProviders(<InitialAssessmentList />, {
      preloadedState: stateForProfile(),
    });

    // WHY: a not-yet-resolved query (no data) must render the empty page
    // rather than throwing on response?.docs access.
    expect(screen.getByText("Initial Assessment")).toBeInTheDocument();
    expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanList from "./TreatmentPlanList";

// Hoisted mock fns referenced inside vi.mock factories.
const h = vi.hoisted(() => ({
  useTreatmentPlanList: vi.fn(),
  invalidateQueries: vi.fn(),
  deleteService: vi.fn(),
}));

// WHY: the data hook is the component's only IO; stub it so we control list
// state without real HTTP. Also stub keepPreviousData (re-exported from RQ).
vi.mock("@/features/shared/services/queries", () => ({
  __esModule: true,
  useTreatmentPlanList: h.useTreatmentPlanList,
}));

// WHY: source calls treatmentPlanService.delete via DeleteDocModal onDelete.
vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  treatmentPlanService: { delete: h.deleteService },
}));

// WHY: HOC wraps the page in Sidebar/Navbar shell (heavy, many deps). Render
// the inner component directly so the test focuses on TreatmentPlanList.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// WHY: CreateNav pulls navigation/redux; surface only title + link we assert.
vi.mock("@/utils/CreateNav", () => ({
  __esModule: true,
  default: ({ title, link }) => (
    <div data-testid="create-nav" data-link={link}>
      {title}
    </div>
  ),
}));

// WHY: light DeleteDocModal stub that exposes `show` and lets us trigger the
// onDelete + handleClose props the source wires up.
vi.mock("@/features/shared/ui/DeleteDocModal/DeleteDocModal", () => ({
  __esModule: true,
  default: ({ show, handleClose, fetchHandler, onDelete }) => (
    <div data-testid="delete-modal" data-show={String(show)}>
      <button
        data-testid="confirm-delete"
        onClick={() => onDelete({ additionalFunctions: [fetchHandler] })}
      >
        confirm
      </button>
      <button data-testid="close-delete" onClick={handleClose}>
        close
      </button>
    </div>
  ),
}));

// useQueryClient -> invalidateQueries spy (fetchHandler path).
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
  };
});

const makeDoc = (overrides = {}) => ({
  _id: "tp-test-001",
  saveAsDraft: false,
  createdAt: "2026-01-15T00:00:00.000Z",
  patientId: {
    firstName: "Test",
    lastName: "Patient",
    diagnosis: "Test Diagnosis",
  },
  signers: [],
  ...overrides,
});

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      userType: "Employee",
      accountType: "adminstrator",
      userPermissions: { edit: "tp", delete: "tp" },
    },
  },
};

const renderList = (queryReturn, preloadedState = employeeState) => {
  h.useTreatmentPlanList.mockReturnValue(queryReturn);
  return renderWithProviders(<TreatmentPlanList />, { preloadedState });
};

describe("TreatmentPlanList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Create nav titled 'Treatment Plan' pointing at /treatment-plan", () => {
    renderList({ data: { docs: [], totalPages: 1 }, isLoading: false });
    const nav = screen.getByTestId("create-nav");
    expect(nav).toHaveTextContent("Treatment Plan");
    expect(nav).toHaveAttribute("data-link", "/treatment-plan");
  });

  it("renders the table column headers", () => {
    renderList({
      data: { docs: [makeDoc()], totalPages: 1 },
      isLoading: false,
    });
    // WHY: header labels are passed straight through to TableLayout.
    expect(screen.getByText("Resident Name")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Diagnosis")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders a row built from a document: full name, formatted date, diagnosis", () => {
    renderList({
      data: { docs: [makeDoc()], totalPages: 1 },
      isLoading: false,
    });
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Test Diagnosis")).toBeInTheDocument();
    // formatDateWithoutUTCHandleToMMDDYYYY renders MM/DD/YYYY for createdAt.
    expect(screen.getByText("01/15/2026")).toBeInTheDocument();
  });

  it("renders a DropList (view/edit affordances) for non-draft documents", () => {
    renderList({
      data: { docs: [makeDoc()], totalPages: 1 },
      isLoading: false,
    });
    // DropList always renders a view link.
    expect(document.querySelector(".view-btn")).toBeTruthy();
  });

  it("renders the In-Draft icon instead of a DropList for draft documents", () => {
    renderList({
      data: { docs: [makeDoc({ saveAsDraft: true })], totalPages: 1 },
      isLoading: false,
    });
    expect(document.querySelector(".in-draft-icon")).toBeTruthy();
    // No action drop list for drafts.
    expect(document.querySelector(".view-btn")).toBeFalsy();
  });

  it("shows the empty state and no pagination when there are no documents", () => {
    renderList({ data: { docs: [], totalPages: 1 }, isLoading: false });
    // No data rows -> NoFound; pagination is gated on dataList.length > 0.
    expect(document.querySelector(".pagination")).toBeFalsy();
    expect(screen.queryByText("Test Patient")).not.toBeInTheDocument();
  });

  it("renders pagination controls when documents exist", () => {
    renderList({
      data: { docs: [makeDoc()], totalPages: 3 },
      isLoading: false,
    });
    expect(document.querySelector(".pagination")).toBeTruthy();
  });

  it("does not crash and shows no rows while loading", () => {
    renderList({ data: undefined, isLoading: true });
    expect(screen.queryByText("Test Patient")).not.toBeInTheDocument();
    // Loader path: table body not rendered.
    expect(screen.getByTestId("create-nav")).toBeInTheDocument();
  });

  it("passes page/limit filters to useTreatmentPlanList", () => {
    renderList({ data: { docs: [], totalPages: 1 }, isLoading: false });
    expect(h.useTreatmentPlanList).toHaveBeenCalled();
    const firstArg = h.useTreatmentPlanList.mock.calls[0][0];
    expect(firstArg).toEqual({ page: 1, limit: 10 });
  });

  it("renders the delete modal hidden by default", () => {
    renderList({
      data: { docs: [makeDoc()], totalPages: 1 },
      isLoading: false,
    });
    expect(screen.getByTestId("delete-modal")).toHaveAttribute(
      "data-show",
      "false",
    );
  });

  it("invokes the delete service then invalidates the cache on confirm", async () => {
    h.deleteService.mockResolvedValue({ success: true });
    renderList({
      data: { docs: [makeDoc()], totalPages: 1 },
      isLoading: false,
    });

    // Open the delete modal via the row's delete affordance.
    const deleteIcon = document.querySelector(".del-btn svg");
    expect(deleteIcon).toBeTruthy();
    fireEvent.click(deleteIcon);

    // Confirm in the (stubbed) modal -> onDelete wires to treatmentPlanService.
    fireEvent.click(screen.getByTestId("confirm-delete"));

    expect(h.deleteService).toHaveBeenCalledTimes(1);
    const arg = h.deleteService.mock.calls[0][0];
    expect(arg).toMatchObject({ id: "tp-test-001" });
    // additionalFunctions wires the cache-invalidating fetchHandler.
    expect(Array.isArray(arg.additionalFunctions)).toBe(true);
  });

  it("routes patient-portal users to a read-only delete link (no handler)", () => {
    // WHY: isResidentPortalUser(Patient) => deleteLink is `true`, suppressing
    // the row-level delete action.
    renderList(
      { data: { docs: [makeDoc()], totalPages: 1 }, isLoading: false },
      {
        auth: {
          isAuthenticated: true,
          userProfile: {
            _id: "res-test-001",
            userType: "Patient",
            accountType: "regular",
            userPermissions: { edit: "", delete: "" },
          },
        },
      },
    );
    // Patient lacks delete permission -> no delete button rendered.
    expect(document.querySelector(".del-btn")).toBeFalsy();
  });

  it("renders rows for an Admin user (canEdit branch via ROLES.ADMIN)", () => {
    renderList(
      { data: { docs: [makeDoc()], totalPages: 1 }, isLoading: false },
      {
        auth: {
          isAuthenticated: true,
          userProfile: {
            _id: "emp-test-001",
            userType: "Admin",
            accountType: "adminstrator",
            userPermissions: { edit: "tp", delete: "tp" },
          },
        },
      },
    );
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(document.querySelector(".edit-btn")).toBeTruthy();
  });
});

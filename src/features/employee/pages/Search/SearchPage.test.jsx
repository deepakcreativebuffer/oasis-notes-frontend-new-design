/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SearchPage from "./SearchPage";
import { EMPLOYEE_APIS } from "@/features/shared/services";

// ── Hoisted shared mocks ──────────────────────────────────────────────
const h = vi.hoisted(() => ({
  openDeleteModal: vi.fn(),
  invalidateQueries: vi.fn(),
  usePrint: vi.fn(() => vi.fn()),
  downloadReport: vi.fn(),
  // Per-query mocks so each tab's enabled flag can be asserted.
  useSearchPatient: vi.fn(),
  useSearchDocuments: vi.fn(),
  useSearchVitals: vi.fn(),
  useSearchMedications: vi.fn(),
  useSearchIntake: vi.fn(),
  useSearchAppointments: vi.fn(),
  useSearchPageDocumentData: vi.fn(),
  lastDocDataArgs: { current: null },
}));

// Mock the heavy presentational child: render a light harness that surfaces
// only the props the SearchPage logic must compute.
vi.mock("./SearchPage/SearchPageContent", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="content">
      <span data-testid="id">{String(props.id)}</span>
      <span data-testid="type">{props.type}</span>
      <span data-testid="loading">{String(props.loading)}</span>
      <span data-testid="tab-count">{props.tabs?.length ?? 0}</span>
      <span data-testid="options-len">
        {props.optionsToDisplay?.length ?? 0}
      </span>
      <span data-testid="hours-format">{props.hoursFormat}</span>
      {props.tabs?.map((t) => (
        <button
          key={t.type}
          data-testid={`tab-${t.type}`}
          onClick={() => props.typeSelector({ type: t.type, func: t.func })}
        >
          {t.title}
        </button>
      ))}
      <button
        data-testid="del-vital"
        onClick={() => props.deleteVitals("vit-1")}
      >
        del
      </button>
      <button data-testid="show-if-present">
        {props.showIfPresent({ label: "L", value: "V" }) ? "has" : "none"}
      </button>
    </div>
  ),
}));

// React Query search hooks the page wires up directly.
vi.mock("@/features/shared/services/queries", () => ({
  useSearchPatient: (...a) => h.useSearchPatient(...a),
  useSearchDocuments: (...a) => h.useSearchDocuments(...a),
  useSearchVitals: (...a) => h.useSearchVitals(...a),
  useSearchMedications: (...a) => h.useSearchMedications(...a),
  useSearchIntake: (...a) => h.useSearchIntake(...a),
  useSearchAppointments: (...a) => h.useSearchAppointments(...a),
}));

vi.mock("./SearchPage/useSearchPageDocumentData", () => ({
  useSearchPageDocumentData: (args) => {
    h.lastDocDataArgs.current = args;
    return h.useSearchPageDocumentData(args);
  },
}));

vi.mock("@/features/shared/contexts/ModalContext", () => ({
  useModal: () => ({ openDeleteModal: h.openDeleteModal }),
}));

vi.mock("@shared/hooks", () => ({
  usePrint: (...a) => h.usePrint(...a),
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));

vi.mock("@/utils", () => ({
  downloadReport: (...a) => h.downloadReport(...a),
}));

vi.mock("@/features/shared/services", () => ({
  EMPLOYEE_APIS: {
    EMPLOYEE_DELETEPATIENTVITALS: vi.fn((id) => `/employee/vitals/${id}`),
  },
  searchService: {},
}));

// useQueryClient -> stable client exposing invalidateQueries spy.
vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQueryClient: () => ({ invalidateQueries: h.invalidateQueries }),
  };
});

const idleQuery = (data = null) => ({ data, isLoading: false });

const preloaded = (userType = "Employee", extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "user-1", userType, hoursFormat: "12", ...extra },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const setupHappyPath = () => {
  h.useSearchPatient.mockReturnValue(
    idleQuery({ _id: "pat-1", firstName: "Jane" }),
  );
  h.useSearchDocuments.mockReturnValue(idleQuery());
  h.useSearchVitals.mockReturnValue(idleQuery([]));
  h.useSearchMedications.mockReturnValue(idleQuery());
  h.useSearchIntake.mockReturnValue(idleQuery());
  h.useSearchAppointments.mockReturnValue(idleQuery({ docs: [] }));
  h.useSearchPageDocumentData.mockReturnValue({
    renderRows: [],
    renderMedRows: [],
    renderIntakeRows: [],
    totalDocumentPages: 1,
    totalMedPages: 1,
    totalIntakesPages: 1,
    selectedFormType: [],
  });
};

const renderPage = (route = "/search/pat-1", state = preloaded()) =>
  renderWithProviders(<SearchPage />, { route, preloadedState: state });

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupHappyPath();
  });

  it("renders the content child", () => {
    renderPage("/search/pat-1");
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("defaults to the Info tab and provides all six tabs", () => {
    renderPage();
    expect(screen.getByTestId("type")).toHaveTextContent("Info");
    expect(screen.getByTestId("tab-count")).toHaveTextContent("6");
  });

  it("derives loading=false when no underlying query is loading", () => {
    renderPage();
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("reports loading=true when a query is loading", () => {
    h.useSearchVitals.mockReturnValue({ data: [], isLoading: true });
    renderPage();
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("switches the active type when a tab is selected", () => {
    renderPage();
    fireEvent.click(screen.getByTestId("tab-Vitals"));
    expect(screen.getByTestId("type")).toHaveTextContent("Vitals");
  });

  it("invalidates the documents query when the Documents tab func runs", () => {
    renderPage();
    fireEvent.click(screen.getByTestId("tab-Documents"));
    // WHY: typeSelector invokes the tab's func, which invalidates that section
    // via the documents query key (the leading segments are stable).
    expect(h.invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(["search", "documents"]),
      }),
    );
  });

  it("opens the delete modal with the composed vitals delete url", () => {
    renderPage();
    fireEvent.click(screen.getByTestId("del-vital"));
    expect(EMPLOYEE_APIS.EMPLOYEE_DELETEPATIENTVITALS).toHaveBeenCalledWith(
      "vit-1",
    );
    expect(h.openDeleteModal).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/employee/vitals/vit-1" }),
    );
  });

  it("derives 12-hour format from the profile hoursFormat", () => {
    renderPage();
    expect(screen.getByTestId("hours-format")).toHaveTextContent("h:mm A");
  });

  it("derives 24-hour format when the profile prefers it", () => {
    renderPage("/search/pat-1", preloaded("Employee", { hoursFormat: "24" }));
    expect(screen.getByTestId("hours-format")).toHaveTextContent("HH:mm");
  });

  it("gives guardians the restricted document option set", () => {
    renderPage("/search/pat-1", preloaded("Guardian"));
    // WHY: getDocumentOptionsForUser branches on the Guardian role to a
    // shorter option list than the full Admin/Employee one.
    const guardianLen = Number(screen.getByTestId("options-len").textContent);

    renderPage("/search/pat-1", preloaded("Employee"));
    const employeeLen = Number(
      screen.getAllByTestId("options-len").pop().textContent,
    );
    expect(guardianLen).toBeLessThan(employeeLen);
  });

  it("renders showIfPresent content when a value is provided", () => {
    renderPage();
    expect(screen.getByTestId("show-if-present")).toHaveTextContent("has");
  });

  it("passes profile/currentUser context into the document-data hook", () => {
    renderPage();
    const args = h.lastDocDataArgs.current;
    expect(args.currentUserId).toBe("user-1");
    expect(args.profileUser?.userType).toBe("Employee");
  });
});

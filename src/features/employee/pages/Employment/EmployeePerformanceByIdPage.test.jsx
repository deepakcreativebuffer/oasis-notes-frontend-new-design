/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import EmployeePerformanceByIdPage from "./EmployeePerformanceByIdPage";

// Hoisted mock handles so the vi.mock factories below can reference them.
const mocks = vi.hoisted(() => ({
  getData: vi.fn(),
  updateEmployeePerformanceReview: vi.fn(),
  downloadReport: vi.fn(),
  useReactToPrint: vi.fn(() => vi.fn()),
}));

// HOC normally wraps the page in sidebars/navbar (heavy router/redux tree).
// Render the inner component directly so the test focuses on the page itself.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  // HOC is a factory: HOC({ Wcomponenet }) returns a component. Return a
  // wrapper component that renders the inner page directly.
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// All server IO is mocked — never real HTTP.
vi.mock("@/features/shared/services/index", () => ({
  getData: mocks.getData,
  adminDashboardService: {
    updateEmployeePerformanceReview: mocks.updateEmployeePerformanceReview,
  },
}));

// NavWrapper renders a router-bound header; stub to a simple title element.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// AddSignature is a controlled stub exposing its callbacks via buttons so we
// can drive the signing flow deterministically.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show, setValue, setDate }) => (
    <div data-testid="add-signature" data-show={String(!!show)}>
      <button
        type="button"
        onClick={() => {
          setValue?.("Signed Name");
          setDate?.("2026-06-10");
        }}
      >
        mock-sign
      </button>
    </div>
  ),
  fetchPaitentName: vi.fn(() => "Test Patient"),
  formatDateToMMDDYYYY: vi.fn((d) => `formatted:${d}`),
  signatureFormat: vi.fn(({ sign }) => (sign ? `sig:${sign}` : null)),
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: mocks.useReactToPrint,
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));

vi.mock("@/utils/index", () => ({
  downloadReport: mocks.downloadReport,
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader">loading...</span>,
}));

const PROFILE = {
  _id: "emp-test-001",
  name: "Test User",
  userType: "Employee",
  hoursFormat: "12",
  position: "Nurse",
};

const stateForProfile = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: { ...PROFILE, ...overrides },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const REVIEW = {
  employeeId: "emp-test-001",
  employeeDate: "2026-01-01",
  employeeJobTitle: "Caregiver",
  employeeManager: "Manager One",
  typeOfReview: "Annual",
  employeeHireDate: "2025-01-01",
  reviewPeriod: "2025",
  ratingsPerformanceAndQualityOfWork: "5",
  ratingsCommunication: "4",
  ratingsProfessionalism: "5",
  ratingsAttendanceAndPunctuality: "3",
  ratingsTimeManagement: "4",
  ratingsReliabilityDependability: "5",
  overallRating: "4",
  evaluation: "Great work",
  additionalComments: "Keep it up",
  administratorName: "Admin Person",
  administratorSignature: "ADMIN-SIG",
  administratorDate: "2026-02-01",
  administratorTime: "10:00",
  signers: [],
  employeeSignature: "",
  employeeSignDate: "",
};

// getData(setter, url) — emulate the service resolving a review payload.
const wireGetData = (review = REVIEW) => {
  mocks.getData.mockImplementation((setDetails) => {
    setDetails({ performanceReview: review });
  });
};

const renderPage = (preloadedState = stateForProfile()) =>
  renderWithProviders(<EmployeePerformanceByIdPage />, {
    route: "/employee/performance/perf-1/emp-test-001",
    preloadedState,
  });

describe("EmployeePerformanceByIdPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useReactToPrint.mockReturnValue(vi.fn());
  });

  it("should mount and request the review on load", async () => {
    wireGetData();
    renderPage();

    // WHY: the page is keyed by route param id; it must fetch the review once.
    await waitFor(() => expect(mocks.getData).toHaveBeenCalled());
    expect(mocks.getData.mock.calls[0][1]).toContain(
      "employee/getEmployeePerformanceReviewById/",
    );
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Employee Performance",
    );
  });

  it("should render fetched review details into the form", async () => {
    wireGetData();
    renderPage();

    // WHY: the effect copies the fetched payload into local state and renders
    // it read-only — confirm representative fields surface.
    await screen.findByText("Caregiver");
    expect(screen.getByText("Manager One")).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
    expect(screen.getByText("Great work")).toBeInTheDocument();
    expect(screen.getByText("Admin Person")).toBeInTheDocument();
    // employeeName comes from fetchPaitentName mock.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should render without crashing when the review payload is missing", async () => {
    mocks.getData.mockImplementation((setDetails) => setDetails(undefined));
    renderPage();

    // WHY: a not-yet-loaded / empty fetch must not throw; the shell still mounts.
    await waitFor(() => expect(mocks.getData).toHaveBeenCalled());
    expect(screen.getByTestId("nav-wrapper")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("should submit signature data via the update service", async () => {
    const user = userEvent.setup();
    wireGetData();
    renderPage();

    await screen.findByText("Caregiver");
    mocks.getData.mockClear();

    await user.click(screen.getByRole("button", { name: /submit/i }));

    // WHY: submitting persists the employee signature/signers back to the API.
    // (route param id is undefined here since no matching <Route> is mounted.)
    expect(mocks.updateEmployeePerformanceReview).toHaveBeenCalledTimes(1);
    const [, payload] = mocks.updateEmployeePerformanceReview.mock.calls[0];
    expect(payload).toHaveProperty("employeeSignature");
    expect(payload).toHaveProperty("signers");
  });

  it("should open the signature capture when SAVED AND SIGNED is clicked", async () => {
    const user = userEvent.setup();
    wireGetData();
    renderPage();

    await screen.findByText("Caregiver");
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "false",
    );

    await user.click(screen.getByRole("button", { name: /saved and signed/i }));

    // WHY: the button toggles the AddSignature modal's `show` prop on.
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "true",
    );
  });

  it("should download the report through the print helper", async () => {
    // The component wires handlePrint to downloadReport(handlePrint); exercise
    // the print callback indirectly by asserting useReactToPrint was set up.
    wireGetData();
    renderPage();

    await waitFor(() => expect(mocks.getData).toHaveBeenCalled());
    // WHY: print setup must be initialized so the document export path works.
    expect(mocks.useReactToPrint).toHaveBeenCalled();
  });
});

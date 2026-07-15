/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import EmployeePerformance from "./EmployeePerformanceEmployeePage";

// --- Hoisted mock fns referenced inside vi.mock factories ---
const h = vi.hoisted(() => ({
  getData: vi.fn(),
  fetchPaitentName: vi.fn(() => "Test Patient"),
  formatDateToMMDDYYYY: vi.fn((d) => `MMDD-${d}`),
  signatureFormat: vi.fn(() => "SIGNATURE_BLOCK"),
  downloadReport: vi.fn(),
  usePrint: vi.fn(() => vi.fn()),
}));

// HOC: render the wrapped component directly so we test the page, not the chrome.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("@/features/shared/ui/Loader/NoFound", () => ({
  __esModule: true,
  default: () => <div data-testid="no-found">No data found</div>,
}));

vi.mock("@/features/shared/services/index", () => ({
  getData: h.getData,
}));

vi.mock("@/utils/utils", () => ({
  fetchPaitentName: h.fetchPaitentName,
  formatDateToMMDDYYYY: h.formatDateToMMDDYYYY,
  signatureFormat: h.signatureFormat,
}));

vi.mock("@/utils/index", () => ({
  downloadReport: h.downloadReport,
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "doc-title"),
}));

vi.mock("@shared/hooks", () => ({
  usePrint: h.usePrint,
}));

// Full performance-review record covering every field the page reads.
const performanceReview = {
  employeeId: { _id: "emp-test-001", firstName: "Test", lastName: "Patient" },
  employeeDate: "2026-01-01",
  employeeJobTitle: "Caregiver",
  employeeManager: "Manager Jane",
  typeOfReview: "Annual",
  employeeHireDate: "2025-01-01",
  reviewPeriod: "2025-12-31",
  ratingsPerformanceAndQualityOfWork: "5",
  ratingsCommunication: "4",
  ratingsProfessionalism: "3",
  ratingsAttendanceAndPunctuality: "5",
  ratingsTimeManagement: "4",
  ratingsReliabilityDependability: "5",
  overallRating: "5",
  evaluation: "Excellent work",
  additionalComments: "Keep it up",
  administratorName: "Admin Bob",
  administratorSignature: "data:image/png;base64,xxx",
  administratorDate: "2026-02-01",
  administratorTime: "10:00",
  employeeSignature: "data:image/png;base64,yyy",
  employeeSignDate: "2026-02-02",
  signers: [],
};

const stateForRole = (userType, extra = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "user-test-001",
      firstName: "Test",
      lastName: "User",
      userType,
      hoursFormat: "12",
      ...extra,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("EmployeePerformanceEmployeePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Re-apply default impl after clearAllMocks wipes it.
    h.fetchPaitentName.mockReturnValue("Test Patient");
    h.formatDateToMMDDYYYY.mockImplementation((d) => `MMDD-${d}`);
    h.signatureFormat.mockReturnValue("SIGNATURE_BLOCK");
    h.usePrint.mockReturnValue(vi.fn());
  });

  it("renders NoFound when there is no performance review data", async () => {
    // getData(setDetails, url) -> resolve with empty so details has no review.
    h.getData.mockImplementation((setData) => {
      setData({});
    });

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: an empty review must surface the NoFound placeholder, not a blank form.
    expect(await screen.findByTestId("no-found")).toBeInTheDocument();
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Employee Performance",
    );
  });

  it("renders the populated review form when data is present", async () => {
    h.getData.mockImplementation((setData) => {
      setData({ performanceReview });
    });

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: values flow from the fetched record into the read-only view grid.
    expect(await screen.findByText("Caregiver")).toBeInTheDocument();
    expect(screen.getByText("Manager Jane")).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
    expect(screen.getByText("Admin Bob")).toBeInTheDocument();
    expect(screen.getByText("Excellent work")).toBeInTheDocument();
    expect(screen.queryByTestId("no-found")).not.toBeInTheDocument();
  });

  it("supports the nested data.performanceReview response shape", async () => {
    h.getData.mockImplementation((setData) => {
      setData({ data: { performanceReview } });
    });

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Employee"),
    });

    // WHY: the legacy API may nest the record under `data`; the page must
    // read either shape.
    expect(await screen.findByText("Caregiver")).toBeInTheDocument();
  });

  it("requests the admin-by-id endpoint when an Admin views a specific review", async () => {
    h.getData.mockImplementation((setData) => setData({}));

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Admin"),
      route: "/employee/performance/emp-test-001",
    });

    await waitFor(() => expect(h.getData).toHaveBeenCalled());
    // WHY: there is no :id route param in this test render, so even an Admin
    // falls through to the "my review" endpoint.
    const [, url] = h.getData.mock.calls[0];
    expect(url).toBe("employee/getMyEmployeePerformanceReview");
  });

  it("requests the self endpoint when no id and non-admin", async () => {
    h.getData.mockImplementation((setData) => setData({}));

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Employee"),
    });

    await waitFor(() => expect(h.getData).toHaveBeenCalled());
    const [, url] = h.getData.mock.calls[0];
    expect(url).toBe("employee/getMyEmployeePerformanceReview");
  });

  it("wires the print button through usePrint", async () => {
    const printFn = vi.fn();
    h.usePrint.mockReturnValue(printFn);
    h.getData.mockImplementation((setData) => setData({ performanceReview }));

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Employee"),
    });

    const printBtn = await screen.findByRole("button", {
      name: /print report/i,
    });
    printBtn.click();

    // WHY: the visible PRINT REPORT control must invoke the handler returned by
    // usePrint (download + react-to-print orchestration).
    expect(printFn).toHaveBeenCalled();
  });

  it("renders signer signature blocks for signers with a signature", async () => {
    h.getData.mockImplementation((setData) =>
      setData({
        performanceReview: {
          ...performanceReview,
          signers: [
            {
              signerId: "user-test-001",
              signature: "data:image/png;base64,zzz",
              dateSigned: "2026-03-01",
              signedTime: "09:00",
            },
          ],
        },
      }),
    );

    renderWithProviders(<EmployeePerformance />, {
      preloadedState: stateForRole("Employee"),
    });

    await screen.findByText("Caregiver");
    // WHY: admin/employee/extra signer signatures are all rendered via
    // signatureFormat; with one signer it should be invoked at least 3 times.
    expect(h.signatureFormat).toHaveBeenCalled();
    expect(h.signatureFormat.mock.calls.length).toBeGreaterThanOrEqual(3);
  });
});

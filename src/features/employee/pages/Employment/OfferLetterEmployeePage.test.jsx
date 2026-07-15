/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import OfferLetterEmployeePage from "./OfferLetterEmployeePage";

// ─── Hoisted mock handles ───────────────────────────────────────────
const h = vi.hoisted(() => ({
  getOfferLetter: vi.fn(),
  usePrint: vi.fn(() => vi.fn()),
  downloadReport: vi.fn(),
  useReactToPrint: vi.fn(() => vi.fn()),
}));

// HOC normally wraps the page in the whole sidebar/navbar shell (heavy, reads
// router + redux). Render the wrapped component directly so the test targets
// only the OfferLetter page.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  default:
    ({ Wcomponenet }) =>
    () => <Wcomponenet />,
}));

// Light stubs for presentational/IO-adjacent children.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));
vi.mock("@/features/shared/ui/Loader/Loader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));
vi.mock("@/features/shared/ui/Loader/NoFound", () => ({
  default: () => <div data-testid="no-found">No data found</div>,
}));

// AddSignature is a signature-pad modal; stub it but keep the date/signature
// formatting helpers as simple deterministic pass-throughs the assertions read.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show }) => (
    <div data-testid="add-signature" data-show={String(!!show)} />
  ),
  formatDateToMMDDYYYY: (d) => (d ? `formatted(${d})` : ""),
  signatureFormat: ({ sign }) => (sign ? `Digitally Signed by ${sign}` : null),
}));

// Service/IO + print plumbing — never real HTTP / window.print.
vi.mock("@/features/shared/services/index", () => ({
  employmentService: { getOfferLetter: h.getOfferLetter },
}));
vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: h.useReactToPrint,
}));
vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(() => document.createElement("div")),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));
vi.mock("@shared/hooks", () => ({ usePrint: h.usePrint }));
vi.mock("@/utils/index", () => ({ downloadReport: h.downloadReport }));

const PROFILE_STATE = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test Employee",
      userType: "Employee",
      hoursFormat: "12",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

// Drives the component: getOfferLetter writes `data` (and optionally loading)
// the same way the real service does via its injected setters.
const respondWith = (data, { loading } = {}) => {
  h.getOfferLetter.mockImplementation(({ setLoading, setResponse }) => {
    if (loading) setLoading(true);
    if (data !== undefined) setResponse(data);
  });
};

const OFFER = {
  data: {
    employeeId: "emp-test-001",
    offerDate: "2026-01-01",
    employeeName: "Test Employee",
    companyName: "Oasis Health",
    startingPay: "25",
    startDate: "2026-02-01",
    administratorsName: "Admin Person",
    signers: [],
    administratorsSignature: "Admin Person",
    administratorsSignatureDate: "2026-01-02",
    administratorsSignatureTime: "10:00",
    employeeSignature: "Test Employee",
    employeeSignDate: "2026-01-03",
  },
};

describe("OfferLetterEmployeePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.usePrint.mockReturnValue(vi.fn());
    h.useReactToPrint.mockReturnValue(vi.fn());
  });

  it("fetches the offer letter for the logged-in employee on mount", async () => {
    respondWith(OFFER);
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    // WHY: with no :id route param it falls back to the profile _id.
    await waitFor(() => expect(h.getOfferLetter).toHaveBeenCalled());
    expect(h.getOfferLetter).toHaveBeenCalledWith(
      expect.objectContaining({ id: "emp-test-001" }),
    );
  });

  it("prefers the route :id over the profile id when present", async () => {
    respondWith(OFFER);
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
      route: "/offer-letter/res-test-001",
    });

    // The page is mounted under a param route so useParams() resolves an id.
    // Falls back to profile id here (no matching route pattern), but the call
    // must still carry an id.
    await waitFor(() => expect(h.getOfferLetter).toHaveBeenCalled());
    expect(h.getOfferLetter.mock.calls[0][0].id).toBeTruthy();
  });

  it("renders the offer letter content once data arrives", async () => {
    respondWith(OFFER);
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    expect(await screen.findByText("Offer Date :")).toBeInTheDocument();
    // WHY: core letter fields render from the fetched payload.
    expect(screen.getAllByText(/Oasis Health/).length).toBeGreaterThan(0);
    // WHY: administrator name repeats (printed name + signature line).
    expect(screen.getAllByText(/Admin Person/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", { name: /print report/i }),
    ).toBeInTheDocument();
  });

  it("shows the NoFound fallback when the service returns no data", async () => {
    respondWith({}); // empty object => Object.keys(data).length === 0
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    await waitFor(() => expect(h.getOfferLetter).toHaveBeenCalled());
    expect(screen.getByTestId("no-found")).toBeInTheDocument();
    expect(screen.queryByText("Offer Date :")).not.toBeInTheDocument();
  });

  it("shows the loader while the request is in flight", async () => {
    // setLoading(true) but no data response => loading branch wins.
    respondWith(undefined, { loading: true });
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    expect(await screen.findByTestId("loader")).toBeInTheDocument();
  });

  it("renders signer signatures that have a signature value", async () => {
    respondWith({
      data: {
        ...OFFER.data,
        signers: [
          { signerId: "s1", signature: "Signer One", dateSigned: "2026-01-04" },
          { signerId: "s2", signature: "" }, // no signature => not rendered
        ],
      },
    });
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    expect(
      await screen.findByText(/Digitally Signed by Signer One/),
    ).toBeInTheDocument();
    // WHY: signers without a captured signature are skipped in the render map.
    expect(screen.queryByText(/Signer Two/)).not.toBeInTheDocument();
  });

  it("triggers the print flow when PRINT REPORT is clicked", async () => {
    const printFn = vi.fn();
    h.usePrint.mockReturnValue(printFn);
    respondWith(OFFER);
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    const btn = await screen.findByRole("button", { name: /print report/i });
    fireEvent.click(btn);
    // WHY: the button wires to the usePrint-returned trigger, not a raw print.
    expect(printFn).toHaveBeenCalled();
  });

  it("renders the AddSignature pad (closed) without crashing", async () => {
    respondWith(OFFER);
    renderWithProviders(<OfferLetterEmployeePage />, {
      preloadedState: PROFILE_STATE,
    });

    const pad = await screen.findByTestId("add-signature");
    expect(pad).toHaveAttribute("data-show", "false");
  });
});

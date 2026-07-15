/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import ResidentIntakeContent from "./ResidentIntakeContent";

// ─── Hoisted spies ──────────────────────────────────────────────────
// The component reads its entire prop surface from this context hook; we
// drive every render branch by swapping what the hook returns.
const mocks = vi.hoisted(() => ({
  ctxValue: {},
}));

// Stub the form context hook — the real one throws outside a Provider and
// pulls in the heavy intake state machine. We feed render-time values here.
vi.mock("../context/ResidentIntakeFormContext", () => ({
  useResidentIntakeFormContext: () => mocks.ctxValue,
}));

// utils barrel exposes AddSignatureForTable (a portal-ish signature modal)
// and fetchPaitentName (formats a patient record into a display name).
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  AddSignatureForTable: ({ show, setValue, setDate, setShow }) => (
    <div data-testid="sign-modal" data-show={String(show)}>
      <button type="button" onClick={() => setValue("typed-sign")}>
        set-sign
      </button>
      <button type="button" onClick={() => setDate("2026-06-10")}>
        set-date
      </button>
      <button type="button" onClick={() => setShow(false)}>
        close
      </button>
    </div>
  ),
  fetchPaitentName: (p) => (p ? `Name:${p.firstName || "X"}` : "no-name"),
}));

// NavWrapper renders the page title + back-arrow chrome; stub to surface title.
vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// PatientComponent is a search widget hitting services; stub to a marker
// that lets us assert the create-mode (no id) branch.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: () => <div data-testid="patient-search">patient-search</div>,
}));

// The two heavy form-body parts — stub so render is cheap and isolated.
vi.mock("./ResidentIntakeContentPart1", () => ({
  __esModule: true,
  default: () => <div data-testid="part-1">part-1</div>,
}));
vi.mock("./ResidentIntakeContentPart2", () => ({
  __esModule: true,
  default: () => <div data-testid="part-2">part-2</div>,
}));

// Proxy yields a no-op for any handler key not explicitly provided so the
// component never crashes on an unmocked setter/handler.
const makeCtx = (overrides = {}) =>
  new Proxy(
    {
      signaturePairs: [],
      typedGuardDialog: null,
      Cpage: { page: 1 },
      page: 1,
      id: null,
      getApiData: { data: { patientId: { firstName: "Test" } } },
      isNotEditableWithSigner: false,
      editSignHandler: vi.fn(),
      editDateHandler: vi.fn(),
      editSignHandlerAllPages: vi.fn(),
      editDateHandlerAllPages: vi.fn(),
      setPage: vi.fn(),
      setPatientId: vi.fn(),
      setResidentName: vi.fn(),
      setPatientDetail: vi.fn(),
      submitHandler: vi.fn((e) => e?.preventDefault?.()),
      ...overrides,
    },
    {
      get: (t, p) => (p in t ? t[p] : () => {}),
      has: () => true,
    },
  );

describe("ResidentIntakeContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.ctxValue = makeCtx();
  });

  it("mounts and renders both form-body parts inside the form", () => {
    renderWithProviders(<ResidentIntakeContent />);
    expect(screen.getByTestId("part-1")).toBeInTheDocument();
    expect(screen.getByTestId("part-2")).toBeInTheDocument();
  });

  it("renders the PatientComponent search widget when there is no id (create mode)", () => {
    mocks.ctxValue = makeCtx({ id: null });
    renderWithProviders(<ResidentIntakeContent />);
    // WHY: create mode lets the user pick a patient; edit mode shows the name.
    expect(screen.getByTestId("patient-search")).toBeInTheDocument();
    expect(screen.queryByText(/Resident Name :/)).not.toBeInTheDocument();
  });

  it("renders the resident name (no search widget) when an id is present (edit mode)", () => {
    mocks.ctxValue = makeCtx({
      id: "res-test-001",
      getApiData: { data: { patientId: { firstName: "Test" } } },
    });
    renderWithProviders(<ResidentIntakeContent />);
    expect(screen.queryByTestId("patient-search")).not.toBeInTheDocument();
    expect(screen.getByText(/Resident Name :/)).toBeInTheDocument();
    // fetchPaitentName stub formats the record -> "Name:Test".
    expect(screen.getByText("Name:Test")).toBeInTheDocument();
  });

  it("derives the NavWrapper title from the current page number", () => {
    mocks.ctxValue = makeCtx({ page: 3 });
    renderWithProviders(<ResidentIntakeContent />);
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "R9-10-711. Resident Rights",
    );
  });

  it("falls back to the default consent title for an out-of-range page", () => {
    mocks.ctxValue = makeCtx({ page: 99 });
    renderWithProviders(<ResidentIntakeContent />);
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "General consent for treatment",
    );
  });

  it("renders a signature modal per signaturePairs entry and wires per-page handlers", () => {
    const editSignHandler = vi.fn();
    const editDateHandler = vi.fn();
    mocks.ctxValue = makeCtx({
      signaturePairs: [{ show: true, page: 5, onHide: vi.fn() }],
      editSignHandler,
      editDateHandler,
    });
    renderWithProviders(<ResidentIntakeContent />);

    const modal = screen.getByTestId("sign-modal");
    expect(modal).toHaveAttribute("data-show", "true");

    fireEvent.click(screen.getByText("set-sign"));
    fireEvent.click(screen.getByText("set-date"));
    // WHY: page !== 11 routes to the per-page handlers, not the all-pages ones.
    expect(editSignHandler).toHaveBeenCalledWith("typed-sign", 5);
    expect(editDateHandler).toHaveBeenCalledWith("2026-06-10", 5);
  });

  it("routes page-11 signature edits to the all-pages handlers (INSURANCE INFORMATION)", () => {
    const editSignHandlerAllPages = vi.fn();
    const editDateHandlerAllPages = vi.fn();
    mocks.ctxValue = makeCtx({
      page: 11,
      signaturePairs: [{ show: false, page: 11, onHide: vi.fn() }],
      editSignHandlerAllPages,
      editDateHandlerAllPages,
    });
    renderWithProviders(<ResidentIntakeContent />);

    fireEvent.click(screen.getByText("set-sign"));
    fireEvent.click(screen.getByText("set-date"));
    expect(editSignHandlerAllPages).toHaveBeenCalledWith("typed-sign");
    expect(editDateHandlerAllPages).toHaveBeenCalledWith("2026-06-10");
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "INSURANCE INFORMATION",
    );
  });

  it("renders the typedGuardDialog node when provided", () => {
    mocks.ctxValue = makeCtx({
      typedGuardDialog: <div data-testid="guard-dialog">guard</div>,
    });
    renderWithProviders(<ResidentIntakeContent />);
    expect(screen.getByTestId("guard-dialog")).toBeInTheDocument();
  });

  it("invokes submitHandler when the form is submitted", () => {
    const submitHandler = vi.fn((e) => e.preventDefault());
    mocks.ctxValue = makeCtx({ submitHandler });
    const { container } = renderWithProviders(<ResidentIntakeContent />);

    const form = container.querySelector("form");
    fireEvent.submit(form);
    expect(submitHandler).toHaveBeenCalledTimes(1);
  });

  it("applies the pe-none lock class when isNotEditableWithSigner is true", () => {
    mocks.ctxValue = makeCtx({ isNotEditableWithSigner: true });
    const { container } = renderWithProviders(<ResidentIntakeContent />);
    // WHY: a signed doc is read-only; the form disables pointer events.
    expect(container.querySelector("form.pe-none")).toBeTruthy();
  });

  it("renders without crashing when signaturePairs is empty and data is missing", () => {
    mocks.ctxValue = makeCtx({ signaturePairs: [], getApiData: undefined });
    expect(() => renderWithProviders(<ResidentIntakeContent />)).not.toThrow();
    expect(screen.queryByTestId("sign-modal")).not.toBeInTheDocument();
  });
});

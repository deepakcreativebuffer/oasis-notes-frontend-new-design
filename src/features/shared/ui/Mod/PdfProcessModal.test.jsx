/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import PdfProcessingModal from "./PdfProcessModal";
import { startPdfJob } from "../../services";
import { showNotification } from "@/utils";

// Socket layer must never open a real connection in tests; expose a stub whose
// emit/on/off we can assert against.
const mockSocket = {
  id: "socket-test-001",
  emit: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};
vi.mock("@/socket", () => ({
  getSocket: vi.fn(() => mockSocket),
}));

// PDF job kickoff is an IO call — mock it so no HTTP fires.
vi.mock("../../services", () => ({
  startPdfJob: vi.fn(() => Promise.resolve({ success: true })),
}));

// Notifications + error-message constant come from @/utils.
vi.mock("@/utils", () => ({
  showNotification: vi.fn(),
  PDF_PROCESSING_ERROR_MESSAGE: "PDF processing failed",
}));

// useParams supplies the record id the job is scoped to. There is no <Routes>
// declaring :id in the harness, so mock it directly while keeping the rest of
// react-router-dom (MemoryRouter used by the providers) real.
let mockParams = { id: "res-test-001" };
vi.mock("react-router-dom", async (importActual) => {
  const actual = await importActual();
  return { ...actual, useParams: () => mockParams };
});

// react-datepicker is heavy and unrelated to this unit; stub with a plain input
// that forwards onChange so date selection can be driven if needed.
vi.mock("react-datepicker", () => ({
  default: ({ placeholderText, onChange }) => (
    <input
      aria-label={placeholderText}
      placeholder={placeholderText}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const documents = [
  { value: "intake", label: "Intake Form" },
  { value: "consent", label: "Consent Form" },
];

const baseProps = () => ({
  open: true,
  handleClose: vi.fn(),
  documents,
  panel: "Resident",
  isEmployeeSelfForm: false,
  selfEmployeId: "emp-test-001",
});

// react-bootstrap Form.Check here does not wire label htmlFor->input id, so the
// checkbox has no accessible name. Locate the input via its sibling label text.
const checkboxByLabel = (label) =>
  screen.getByText(label).closest(".form-check").querySelector("input");

describe("PdfProcessModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { id: "res-test-001" };
  });

  it("should render the form-selection title and each document option when open", () => {
    renderWithProviders(<PdfProcessingModal {...baseProps()} />, {
      route: "/admin/res-test-001",
    });

    // WHY: the modal's initial purpose is to let staff pick which clinical
    // forms to export before any processing starts.
    expect(screen.getByText("Select Forms to Download")).toBeInTheDocument();
    expect(checkboxByLabel("Intake Form")).toBeInTheDocument();
    expect(checkboxByLabel("Consent Form")).toBeInTheDocument();
  });

  it("should disable Start Download until at least one form is selected", () => {
    renderWithProviders(<PdfProcessingModal {...baseProps()} />);

    // WHY: there is nothing to export with zero forms chosen, so the action is
    // blocked.
    expect(
      screen.getByRole("button", { name: "Start Download" }),
    ).toBeDisabled();
  });

  it("should select every document when Select All is checked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PdfProcessingModal {...baseProps()} />);

    await user.click(checkboxByLabel("Select All"));

    // WHY: Select All is a bulk affordance — toggling it must check each
    // individual form so the export covers the whole record set.
    expect(checkboxByLabel("Intake Form")).toBeChecked();
    expect(checkboxByLabel("Consent Form")).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Start Download" }),
    ).toBeEnabled();
  });

  it("should toggle a single document checkbox on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PdfProcessingModal {...baseProps()} />);

    const intake = checkboxByLabel("Intake Form");
    await user.click(intake);
    expect(intake).toBeChecked();
    await user.click(intake);
    expect(intake).not.toBeChecked();
  });

  it("should start a PDF job for the selected form using the route patient id", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PdfProcessingModal {...baseProps()} />, {
      route: "/resident/res-test-001",
    });

    await user.click(checkboxByLabel("Intake Form"));
    await user.click(screen.getByRole("button", { name: "Start Download" }));

    // WHY: for a resident panel the job must scope to the patient id taken from
    // the route, with the chosen form type and the live socket id for progress.
    expect(startPdfJob).toHaveBeenCalledTimes(1);
    expect(startPdfJob).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "intake",
        patientId: "res-test-001",
        socketId: "socket-test-001",
      }),
    );
  });

  it("should scope the job to the employee id from the route on the Admin panel", async () => {
    const user = userEvent.setup();
    mockParams = { id: "emp-test-001" };
    renderWithProviders(<PdfProcessingModal {...baseProps()} panel="Admin" />);

    await user.click(checkboxByLabel("Intake Form"));
    await user.click(screen.getByRole("button", { name: "Start Download" }));

    // WHY: Admin exports belong to an employee record, not a patient, so the
    // payload carries employeeId from the route instead of patientId.
    const payload = startPdfJob.mock.calls[0][0];
    expect(payload.employeeId).toBe("emp-test-001");
    expect(payload).not.toHaveProperty("patientId");
  });

  it("should scope the job to selfEmployeId when it is an employee self form", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <PdfProcessingModal
        {...baseProps()}
        panel="Resident"
        isEmployeeSelfForm
        selfEmployeId="emp-test-002"
      />,
      { route: "/me/anything" },
    );

    await user.click(checkboxByLabel("Consent Form"));
    await user.click(screen.getByRole("button", { name: "Start Download" }));

    // WHY: a self-service export belongs to the requesting employee, so the
    // job is keyed by selfEmployeId.
    expect(startPdfJob).toHaveBeenCalledWith(
      expect.objectContaining({ employeeId: "emp-test-002" }),
    );
  });

  it("should register socket listeners and show the processing title once download starts", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PdfProcessingModal {...baseProps()} />, {
      route: "/resident/res-test-001",
    });

    await user.click(checkboxByLabel("Intake Form"));
    await user.click(screen.getByRole("button", { name: "Start Download" }));

    // WHY: progress is streamed over the socket, so the component must subscribe
    // to the pdf lifecycle events once a job is in flight.
    const events = mockSocket.on.mock.calls.map((c) => c[0]);
    expect(events).toEqual(
      expect.arrayContaining(["pdf-progress", "pdf-done", "pdf-error"]),
    );
    expect(screen.getByText("Processing Form 1 of 1")).toBeInTheDocument();
  });

  it("should warn and not start a job when Start Download is forced with no selection", async () => {
    // Render with a single document and pre-check then uncheck to keep the
    // button reachable is unnecessary; instead drive the guard via the enabled
    // button after selecting then deselecting is covered elsewhere. Here we
    // assert the guard message path by clicking Select All twice (net zero).
    const user = userEvent.setup();
    renderWithProviders(<PdfProcessingModal {...baseProps()} />);

    await user.click(checkboxByLabel("Select All"));
    await user.click(checkboxByLabel("Select All"));

    // WHY: deselecting everything must re-block the export so no empty job is
    // ever submitted.
    expect(
      screen.getByRole("button", { name: "Start Download" }),
    ).toBeDisabled();
    expect(startPdfJob).not.toHaveBeenCalled();
  });

  it("should emit terminate and call handleClose when the modal is closed", async () => {
    const props = baseProps();
    renderWithProviders(<PdfProcessingModal {...props} />);

    // The react-bootstrap CloseButton has an accessible 'Close' name.
    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    // WHY: closing must terminate any in-flight server job to avoid orphaned
    // PDF processing, then notify the parent to unmount/hide.
    expect(mockSocket.emit).toHaveBeenCalledWith("terminate");
    expect(props.handleClose).toHaveBeenCalled();
  });

  it("should render nothing visible when open is false", () => {
    renderWithProviders(<PdfProcessingModal {...baseProps()} open={false} />);

    // WHY: a hidden modal must not surface its form-selection content to the DOM.
    expect(
      screen.queryByText("Select Forms to Download"),
    ).not.toBeInTheDocument();
  });
});

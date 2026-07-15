/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import {
  SignatureModal,
  DocumentUploader,
  DocumentUploaderEmployee,
} from "./Modal";
import { uploadDocument, employeeService } from "../../services";
import { showNotification } from "@/utils";

// Controllable file-upload hook so we can simulate "no file selected" vs a
// chosen file without touching the real FileReader/IO path.
let mockFileUpload;
vi.mock("@shared/hooks", () => ({
  useFileUpload: () => mockFileUpload,
}));

// Mock every IO/service the component imports — never real HTTP here.
vi.mock("../../services", () => ({
  authService: { logout: vi.fn() },
  employeeService: { uploadDocumentForEmployee: vi.fn() },
  getObjectUrlFromDownloadUrl: (u) => `obj://${u}`,
  LogOutHandler: vi.fn(() => ({ type: "auth/logout" })),
  uploadDocument: vi.fn(),
  downloadBlobByUrl: vi.fn(),
}));

vi.mock("../../constants", () => ({
  AdminSidebar: [],
  FilesNames: ["Consent", "Insurance"],
  Innernav: [],
  ResidentSidebar: [],
  employeeSidebarNav: [],
  ROLES: { ADMIN: "Admin", EMPLOYEE: "Employee", PATIENT: "Patient" },
}));

vi.mock("@/utils", () => ({ showNotification: vi.fn() }));
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: () => "01/01/2026",
}));

// CreateChat pulls in chat/socket machinery irrelevant to these modals.
vi.mock("@/features/employee/pages/Chat/CreateChat", () => ({
  default: () => null,
}));

// CustomSelect is exercised in its own suite; stub it to a button that emits
// a value so we can assert the parent wires onChange.
vi.mock("../selectors/CustomSelect", () => ({
  default: ({ options, onChange }) => (
    <button type="button" onClick={() => onChange(options?.[0])}>
      select-file-type
    </button>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  // Default: nothing selected. Individual tests override `.file`.
  mockFileUpload = {
    file: null,
    onSelectFile: vi.fn(),
  };
});

describe("SignatureModal", () => {
  it("should show who the document is digitally signed by", () => {
    renderWithProviders(
      <SignatureModal
        show
        onHide={vi.fn()}
        value="Test Patient"
        setValue={vi.fn()}
        setTime={vi.fn()}
        setDate={vi.fn()}
      />,
    );
    // WHY: an e-signature must visibly attribute the signature to the signer.
    expect(
      screen.getByText(/digitally signed by test patient/i),
    ).toBeInTheDocument();
  });

  it("should commit the typed name, date and time then close on Submit", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    const setTime = vi.fn();
    const setDate = vi.fn();
    const onHide = vi.fn();
    renderWithProviders(
      <SignatureModal
        show
        onHide={onHide}
        value="Test Patient"
        setValue={setValue}
        setTime={setTime}
        setDate={setDate}
      />,
    );

    const input = screen.getByLabelText("Signature Name");
    await user.clear(input);
    await user.type(input, "Test Signer");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // WHY: submitting the signature pad must persist the final name and a date
    // stamp, then dismiss the modal so the parent form can record the signature.
    expect(setValue).toHaveBeenCalledWith("Test Signer");
    expect(setDate).toHaveBeenCalled();
    expect(setTime).toHaveBeenCalled();
    expect(onHide).toHaveBeenCalled();
  });
});

describe("DocumentUploader", () => {
  it("should render the file upload dialog", () => {
    renderWithProviders(
      <DocumentUploader
        show
        onHide={vi.fn()}
        patitentId="res-test-001"
        fetchDocument={vi.fn()}
      />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // WHY: react-bootstrap doesn't always wire the heading as the dialog's
    // accessible name, so assert the title text directly.
    expect(screen.getByText("File Upload")).toBeInTheDocument();
  });

  it("should warn and skip upload when no file is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DocumentUploader
        show
        onHide={vi.fn()}
        patitentId="res-test-001"
        fetchDocument={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /upload file/i }));

    // WHY: blocking an empty upload prevents creating an empty document record
    // against a resident chart.
    expect(showNotification).toHaveBeenCalledWith({
      message: "Please select a file",
      type: "danger",
    });
    expect(uploadDocument).not.toHaveBeenCalled();
  });

  it("should upload the selected file against the patient and refresh the list", async () => {
    const user = userEvent.setup();
    mockFileUpload = {
      file: new File(["x"], "consent.pdf", { type: "application/pdf" }),
      onSelectFile: vi.fn(),
    };
    const fetchDocument = vi.fn();
    renderWithProviders(
      <DocumentUploader
        show
        onHide={vi.fn()}
        patitentId="res-test-001"
        fetchDocument={fetchDocument}
      />,
    );

    await user.click(screen.getByRole("button", { name: /upload file/i }));

    // WHY: a valid upload must target the correct resident and re-fetch so the
    // chart reflects the new document immediately.
    expect(uploadDocument).toHaveBeenCalledWith(
      expect.objectContaining({ patitentId: "res-test-001" }),
    );
    expect(fetchDocument).toHaveBeenCalled();
  });

  it("should close the modal when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onHide = vi.fn();
    renderWithProviders(
      <DocumentUploader
        show
        onHide={onHide}
        patitentId="res-test-001"
        fetchDocument={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /close modal/i }));
    expect(onHide).toHaveBeenCalled();
  });
});

describe("DocumentUploaderEmployee", () => {
  it("should render the employee file upload dialog", () => {
    renderWithProviders(<DocumentUploaderEmployee show onHide={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("File Upload")).toBeInTheDocument();
  });

  it("should warn when adding files with nothing selected", () => {
    renderWithProviders(<DocumentUploaderEmployee show onHide={vi.fn()} />);

    // The "Add Additional files" submit drives the validation branch.
    fireEvent.click(
      screen.getByRole("button", { name: /add additional files/i }),
    );

    // WHY: same guard as the resident uploader — no empty employee document.
    expect(showNotification).toHaveBeenCalledWith({
      message: "Please select a file",
      type: "danger",
    });
    expect(uploadDocument).not.toHaveBeenCalled();
  });

  it("should submit the staged documents for the employee", async () => {
    const user = userEvent.setup();
    const onHide = vi.fn();
    renderWithProviders(<DocumentUploaderEmployee show onHide={onHide} />);

    await user.click(screen.getByRole("button", { name: /^upload files$/i }));

    // WHY: the final "Upload Files" action persists the staged list through the
    // employee document service.
    expect(employeeService.uploadDocumentForEmployee).toHaveBeenCalled();
  });
});

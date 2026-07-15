/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import SearchPageContent from "./SearchPageContent";

// Heavy / IO-pulling local UI modules — replace with light prop-asserting stubs.
vi.mock("@/features/shared/ui/Mod/Modal", () => ({
  // Renders close affordance so the onHide wiring is observable.
  DocumentUploader: ({ show, onHide }) =>
    show ? (
      <div data-testid="document-uploader">
        <button type="button" onClick={onHide}>
          uploader-close
        </button>
      </div>
    ) : null,
}));

vi.mock("@/features/shared/ui/Mod/PdfProcessModal", () => ({
  default: ({ open, documents, panel }) =>
    open ? (
      <div data-testid="pdf-modal" data-panel={panel}>
        pdf-modal:{(documents || []).length}
      </div>
    ) : null,
}));

vi.mock("@/features/shared/ui/Loader/Loader", () => ({
  default: () => <div data-testid="loader">loading</div>,
}));

vi.mock("@/features/shared/ui/Loader/NoFound", () => ({
  default: () => <div data-testid="no-found">no-data</div>,
}));

vi.mock("@/features/shared/ui/Pagination/PaginationsPage", () => ({
  default: ({ page }) => <div data-testid="pagination">page-{page}</div>,
}));

vi.mock("@/utils/FilterByDate", () => ({
  FilterByDate: () => <div data-testid="filter-by-date">filter</div>,
}));

vi.mock("@/utils/SearchAndSelect", () => ({
  SearchAndSelect: ({ text }) => (
    <div data-testid="search-and-select">{text}</div>
  ),
}));

vi.mock("@/utils/utils", () => ({
  convertTimeFormat: (t) => `time(${t})`,
  fetchPaitentName: (d) => d?.name || "John Doe",
  formatDateToMMDDYYYY: (d) => `date(${d})`,
  getFormattedDateTime: (d) => `dt(${d})`,
}));

// Minimal props covering every required callback/value so the component never
// throws on access. Individual tests override the slice they exercise.
const baseProps = (overrides = {}) => ({
  printRef: { current: null },
  componentRef: { current: null },
  id: "res-001",
  show: false,
  setShow: vi.fn(),
  fetchDocument: vi.fn(),
  type: "Info",
  info: { data: { name: "Jane Resident", email: "jane@example.com" } },
  navigate: vi.fn(),
  tabs: [
    { type: "Info", func: vi.fn(), title: "Info" },
    { type: "Vitals", func: vi.fn(), title: "Vitals" },
  ],
  typeSelector: vi.fn(),
  loading: false,
  profileUser: { userType: "Admin", accountType: "adminstrator" },
  optionsToDisplay: [],
  documentsFilterStartDate: "",
  documentsFilterEndDate: "",
  setDocumentsFilterStartDate: vi.fn(),
  setDocumentsFilterEndDate: vi.fn(),
  hideFilter: vi.fn(),
  documentTypes: [],
  setDocumentTypes: vi.fn(),
  setPage: vi.fn(),
  downloadAllHandler: vi.fn(),
  renderRows: (
    <tr data-testid="doc-row">
      <td>doc</td>
    </tr>
  ),
  totalDocumentPages: 3,
  page: 1,
  limit: 10,
  setLimit: vi.fn(),
  vitals: { data: [], pagination: { totalPages: 1 } },
  vitalsFilterStartDate: "",
  vitalsFilterEndDate: "",
  setVitalsFilterStartDate: vi.fn(),
  setVitalsFilterEndDate: vi.fn(),
  hoursFormat: "12",
  deleteVitals: vi.fn(),
  medicationFilterStartDate: "",
  medicationFilterEndDate: "",
  setMedicationFilterStartDate: vi.fn(),
  setMedicationFilterEndDate: vi.fn(),
  searchMedication: "All",
  setSearchMedication: vi.fn(),
  MEDICATION_OPTION: [],
  renderMedRows: (
    <tr data-testid="med-row">
      <td>med</td>
    </tr>
  ),
  totalMedPages: 2,
  schedule: {
    data: {
      docs: [],
      pastAppointmentsCount: 0,
      upcomingAppointmentsCount: 0,
      totalPages: 1,
    },
  },
  scheduleFilterDate: { pastStartDate: "", pastEndDate: "" },
  setScheduleFilterDate: vi.fn(),
  schedulePage: 1,
  setSchedulePage: vi.fn(),
  scheduleLimit: 10,
  setScheduleLimit: vi.fn(),
  intakeFilterStartDate: "",
  intakeFilterEndDate: "",
  setIntakeFilterStartDate: vi.fn(),
  setIntakeFilterEndDate: vi.fn(),
  searchIntake: "All",
  setSearchIntake: vi.fn(),
  INTAKE_OPTION: [],
  renderIntakeRows: (
    <tr data-testid="intake-row">
      <td>intake</td>
    </tr>
  ),
  totalIntakesPages: 4,
  vitalPage: 1,
  setVitalPage: vi.fn(),
  vitalLimit: 10,
  setVitalLimit: vi.fn(),
  print: vi.fn(),
  downloading: false,
  setDownloading: vi.fn(),
  showIfPresent: ({ label, value }) =>
    value ? (
      <div>
        {label}: {value}
      </div>
    ) : null,
  ...overrides,
});

describe("SearchPageContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the resident header name and tabs", () => {
    const props = baseProps();
    renderWithProviders(<SearchPageContent {...props} />);
    // fetchPaitentName mock returns data.name
    expect(screen.getAllByText(/Jane Resident/).length).toBeGreaterThan(0);
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Vitals")).toBeInTheDocument();
  });

  it("invokes typeSelector when a tab is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<SearchPageContent {...props} />);
    await user.click(screen.getByText("Vitals"));
    expect(props.typeSelector).toHaveBeenCalledWith({
      type: "Vitals",
      func: expect.any(Function),
    });
  });

  it("navigates back when the back arrow is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    const { container } = renderWithProviders(<SearchPageContent {...props} />);
    const arrow = container.querySelector("img.arrow");
    await user.click(arrow);
    expect(props.navigate).toHaveBeenCalledWith(-1);
  });

  it("renders Info fields via showIfPresent", () => {
    const props = baseProps({ type: "Info" });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByText(/Legal Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
  });

  it("shows the Loader for Documents while loading", () => {
    const props = baseProps({ type: "Documents", loading: true });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders the Documents table with rows and upload button for an Admin", () => {
    const props = baseProps({ type: "Documents", loading: false });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByTestId("doc-row")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Upload Resident File/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("opens the uploader when Upload Resident File is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps({ type: "Documents" });
    renderWithProviders(<SearchPageContent {...props} />);
    await user.click(
      screen.getByRole("button", { name: /Upload Resident File/i }),
    );
    expect(props.setShow).toHaveBeenCalledWith(true);
  });

  it("hides the upload button for a restricted regular employee without uf permission", () => {
    const props = baseProps({
      type: "Documents",
      profileUser: {
        userType: "Employee",
        accountType: "regular",
        userPermissions: { view: "abc" },
      },
    });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(
      screen.queryByRole("button", { name: /Upload Resident File/i }),
    ).not.toBeInTheDocument();
  });

  it("triggers downloadAllHandler from the Download All button", async () => {
    const user = userEvent.setup();
    const props = baseProps({ type: "Documents" });
    renderWithProviders(<SearchPageContent {...props} />);
    await user.click(screen.getByRole("button", { name: /Download All/i }));
    expect(props.downloadAllHandler).toHaveBeenCalled();
  });

  it("renders NoFound when Vitals has no data", () => {
    const props = baseProps({ type: "Vitals", vitals: { data: [] } });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByTestId("no-found")).toBeInTheDocument();
  });

  it("renders a Vitals row and calls deleteVitals on delete click", async () => {
    const user = userEvent.setup();
    const vitals = {
      data: [
        {
          _id: "v1",
          date: "2026-01-01",
          time: "10:00",
          bodyTemperature: 98,
          pulseRate: 70,
          bhpSignature: "BHP",
          bhpSignatureDate: "2026-01-01",
        },
      ],
      pagination: { totalPages: 1 },
    };
    const props = baseProps({ type: "Vitals", vitals });
    const { container } = renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByText(/98 °F/)).toBeInTheDocument();
    const delIcon = container.querySelector(".del-btn svg");
    await user.click(delIcon);
    expect(props.deleteVitals).toHaveBeenCalledWith("v1");
  });

  it("renders the Medications table rows", () => {
    const props = baseProps({ type: "Medications" });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByTestId("med-row")).toBeInTheDocument();
  });

  it("renders the Intake table rows", () => {
    const props = baseProps({ type: "Intake" });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByTestId("intake-row")).toBeInTheDocument();
  });

  it("renders past appointments for Schedule type", () => {
    const schedule = {
      data: {
        docs: [
          {
            type: "Past",
            name: "Dr. Smith",
            reasonForVisit: "Checkup",
            time: "09:00",
            date: "2026-01-02",
            contactNumber: "555-0000",
          },
        ],
        pastAppointmentsCount: 1,
        upcomingAppointmentsCount: 0,
        totalPages: 1,
      },
    };
    const props = baseProps({ type: "Schedule", schedule });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByText(/Dr\. Smith/)).toBeInTheDocument();
    expect(screen.getByText(/Past Appointments/)).toBeInTheDocument();
  });

  it("shows the PRINT REPORT button for Info and calls print", async () => {
    const user = userEvent.setup();
    const props = baseProps({ type: "Info" });
    renderWithProviders(<SearchPageContent {...props} />);
    const btn = screen.getByRole("button", { name: /PRINT REPORT/i });
    await user.click(btn);
    expect(props.print).toHaveBeenCalled();
  });

  it("renders the DocumentUploader when show is true", () => {
    const props = baseProps({ show: true });
    renderWithProviders(<SearchPageContent {...props} />);
    expect(screen.getByTestId("document-uploader")).toBeInTheDocument();
  });

  it("renders the PDF modal while downloading", () => {
    const props = baseProps({ type: "Documents", downloading: true });
    renderWithProviders(<SearchPageContent {...props} />);
    const modal = screen.getByTestId("pdf-modal");
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute("data-panel", "Employee");
  });
});

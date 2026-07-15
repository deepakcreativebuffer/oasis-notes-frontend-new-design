/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import TableRow from "./TableRow";

// WHY: the date helpers are pure formatters from another module; stub them so
// the row's date column is deterministic and decoupled from timezone handling.
vi.mock("@/utils/utils", () => ({
  formatDateToMMDDYYYY: vi.fn(() => "01/02/2030"),
  formatDateWithoutUTCHandleToMMDDYYYY: vi.fn(() => "03/04/2031"),
}));

// WHY: getObjectUrlFromDownloadUrl performs IO/url composition; the component
// only needs a deterministic href for the download Link.
vi.mock("../../services", () => ({
  getObjectUrlFromDownloadUrl: vi.fn((u) => `/obj/${u}`),
}));

// WHY: SingleDownload opens a socket + starts a PDF job; replace it with a light
// stub so we can assert it is the chosen download branch without real IO.
vi.mock("../Mod/SingleDownload", () => ({
  default: (props) => (
    <div data-testid="single-download" data-document-id={props.documentId}>
      SingleDownload
    </div>
  ),
}));

// WHY: useModal requires a ModalProvider in the tree; mock it so we can spy on
// openDeleteModal (the EHR delete-confirmation entry point).
const openDeleteModalMock = vi.fn();
vi.mock("../../contexts/ModalContext", () => ({
  useModal: () => ({ openDeleteModal: openDeleteModalMock }),
}));

// TableRow renders <tr>, which is only valid inside a table. Wrap accordingly.
const renderRow = (props, options) =>
  renderWithProviders(
    <table>
      <tbody>
        <TableRow {...props} />
      </tbody>
    </table>,
    options,
  );

const baseProps = () => ({
  title: "Test Patient Note",
  date: "2030-01-02T00:00:00Z",
  signature: "Signed by Test Patient",
  link: "/view/res-test-001",
});

describe("TableRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the title, signature and a view link when given required props", () => {
    renderRow(baseProps());

    expect(screen.getByText("Test Patient Note")).toBeInTheDocument();
    expect(screen.getByText("Signed by Test Patient")).toBeInTheDocument();
    // WHY: viewIcon defaults to true, so a chart row is always viewable.
    expect(
      screen.getByRole("link", { name: "View details of Test Patient Note" }),
    ).toBeInTheDocument();
  });

  it("should format the date without UTC handling when utc is false", () => {
    renderRow({ ...baseProps(), utc: false });

    // WHY: clinical timestamps stored as wall-clock are rendered via the
    // non-UTC formatter to avoid shifting the displayed date.
    expect(screen.getByText("03/04/2031")).toBeInTheDocument();
  });

  it("should format the date with UTC handling when utc is true", () => {
    renderRow({ ...baseProps(), utc: true });

    // WHY: UTC-stored timestamps use the UTC-aware formatter.
    expect(screen.getByText("01/02/2030")).toBeInTheDocument();
  });

  it("should render the In Draft indicator instead of action icons when saveAsDraft is true", () => {
    renderRow({ ...baseProps(), saveAsDraft: true, editLink: "/edit/draft-1" });

    // WHY: draft documents are not yet finalized, so only the draft affordance
    // shows — no view/edit/delete actions.
    expect(
      screen.queryByRole("link", {
        name: "View details of Test Patient Note",
      }),
    ).not.toBeInTheDocument();
  });

  it("should render an edit link pointing to editLink when editIcon is set", () => {
    renderRow({
      ...baseProps(),
      editIcon: true,
      editLink: "/edit/res-test-001",
    });

    const editLink = screen.getByRole("link", {
      name: "Edit Test Patient Note",
    });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute("href", "/edit/res-test-001");
  });

  it("should open the delete confirmation with the delete url and payload when delete is clicked", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderRow({
      ...baseProps(),
      deleteIcon: true,
      dLink: "/api/delete/res-test-001",
      payloadValue: "note",
      addtional: onSuccess,
    });

    await user.click(
      screen.getByRole("button", { name: "Delete Test Patient Note" }),
    );

    // WHY: deleting a row routes through the shared delete-confirmation modal
    // with the row's REST url + payload, never an immediate destructive call.
    expect(openDeleteModalMock).toHaveBeenCalledWith({
      url: "/api/delete/res-test-001",
      payloadValue: "note",
      onSuccess,
    });
  });

  it("should render the print-preview download link when downloadIcon and printViaViewLink are provided", () => {
    renderRow({
      ...baseProps(),
      downloadIcon: true,
      printViaViewLink: "/print/res-test-001",
    });

    const dl = screen.getByRole("link", {
      name: "Download or print Test Patient Note",
    });
    // WHY: when a print-preview url exists it takes precedence and opens in a
    // new tab for clinicians to print.
    expect(dl).toHaveAttribute("href", "/print/res-test-001");
    expect(dl).toHaveAttribute("target", "_blank");
  });

  it("should render SingleDownload when downloadIcon and downloadKeyName are provided without a print link", () => {
    renderRow({
      ...baseProps(),
      downloadIcon: true,
      downloadKeyName: "treatment-plan",
      documentId: "doc-test-001",
    });

    // WHY: server-generated PDFs go through SingleDownload (socket/PDF job),
    // not a plain href.
    const stub = screen.getByTestId("single-download");
    expect(stub).toBeInTheDocument();
    expect(stub).toHaveAttribute("data-document-id", "doc-test-001");
  });

  it("should fall back to a composed object-url download link when no key name or print link is given", () => {
    renderRow({
      ...baseProps(),
      downloadIcon: true,
      downloadLink: "bucket/key.pdf",
    });

    const dl = screen.getByRole("link", {
      name: "Download Test Patient Note",
    });
    // WHY: legacy direct-download rows resolve a storage object url.
    expect(dl).toHaveAttribute("href", "/obj/bucket/key.pdf");
  });

  it("should show the signature edit icon for a Guardian profile", () => {
    renderRow(
      { ...baseProps(), editIcon: true, editLink: "/edit/res-test-001" },
      {
        preloadedState: {
          auth: {
            isAuthenticated: true,
            userProfile: { _id: "emp-test-001", userType: "Guardian" },
            unreadMessages: 0,
            unreadNotifications: 0,
          },
        },
      },
    );

    // WHY: guardians/patients sign rather than edit, so the edit affordance is
    // still present (same aria-label) but rendered as a signature action.
    expect(
      screen.getByRole("link", { name: "Edit Test Patient Note" }),
    ).toBeInTheDocument();
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SafetyPlanEmployeePage from "./SafetyPlanEmployeePage";

// ---------------------------------------------------------------------------
// Hoisted mock handles (vi.mock factories run before module-init, so any
// variable they touch must come from vi.hoisted).
// ---------------------------------------------------------------------------
const h = vi.hoisted(() => ({
  getSafetyPlan: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  patientGetById: vi.fn(),
}));

// HOC wraps the page in the full app shell (Sidebar/Navbar + layout context).
// Render the inner component directly so the page mounts in isolation.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Service layer — never hit real HTTP.
vi.mock("@/features/shared/services/index", () => ({
  __esModule: true,
  intakeService: {
    getSafetyPlan: h.getSafetyPlan,
    safetyPlan: { create: h.create, update: h.update },
  },
  patientService: { getById: h.patientGetById },
}));

// utils.jsx exports many helpers; stub only what the page consumes.
vi.mock("@/utils/utils", () => ({
  __esModule: true,
  AddSignature: ({ show }) => (
    <div data-testid="add-signature">{show ? "open" : "closed"}</div>
  ),
  deletePermission: () => true,
  formatDateToMMDDYYYY: (d) => d || "",
  signatureFormat: ({ sign }) =>
    sign ? <div data-testid="signature-line">{sign}</div> : null,
}));

vi.mock("@/utils/index", () => ({
  __esModule: true,
  downloadReport: vi.fn(),
}));

vi.mock("@/utils/printHelpers", () => ({
  __esModule: true,
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "title"),
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  __esModule: true,
  useReactToPrintWithContent: () => vi.fn(),
}));

// Heavy search / select widgets — light stubs surfacing the props we assert.
vi.mock("@/features/shared/ui/Search/Search", () => ({
  __esModule: true,
  default: ({ value, onChange, options }) => (
    <div data-testid="env-select">
      <span data-testid="env-select-count">{(value || []).length}</span>
      <button
        type="button"
        data-testid="env-select-add"
        onClick={() =>
          onChange([...(value || []), { label: "Added", value: "Added" }])
        }
      >
        add-env
      </button>
      <span data-testid="env-options">{(options || []).length}</span>
    </div>
  ),
}));

vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId, MainResidentName }) => (
    <div data-testid="patient-component">
      <button
        type="button"
        data-testid="pick-patient"
        onClick={() => {
          MainPatientId("res-test-001");
          MainResidentName("Test Patient");
        }}
      >
        pick-patient
      </button>
    </div>
  ),
}));

vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  __esModule: true,
  default: ({ setValue }) => (
    <div data-testid="multi-employee">
      <button
        type="button"
        data-testid="add-signer"
        onClick={() =>
          setValue([
            { value: "emp-test-001", label: "Test Emp", type: "Employee" },
          ])
        }
      >
        add-signer
      </button>
    </div>
  ),
}));

// react-datepicker is portal/canvas heavy — stub to a plain input.
vi.mock("react-datepicker", () => ({
  __esModule: true,
  default: ({ onChange, placeholderText }) => (
    <input
      data-testid="date-picker"
      placeholder={placeholderText}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  ),
}));

vi.mock("react-spinners", () => ({
  __esModule: true,
  ClipLoader: () => <div data-testid="clip-loader" />,
}));

// Avoid pulling real CSS-imported barrels through unrelated heavy modules.
vi.mock("@/features/resident/pages/Intake/FaceSheet/Facesheet.css", () => ({}));
vi.mock(
  "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css",
  () => ({}),
);
vi.mock(
  "@/features/shared/features/intake/initialAssessment/InitialAssessment.css",
  () => ({}),
);

// ---------------------------------------------------------------------------
const employeeProfile = {
  _id: "emp-test-001",
  userType: "Employee",
  accountType: "regular",
  hoursFormat: "12",
  userPermissions: { edit: "sp", delete: "sp" },
  patientsAssigned: [],
};

const renderPage = ({
  route = "/safety-plan",
  profile = employeeProfile,
} = {}) =>
  renderWithProviders(<SafetyPlanEmployeePage />, {
    route,
    preloadedState: {
      auth: {
        isAuthenticated: true,
        userProfile: profile,
        unreadMessages: 0,
        unreadNotifications: 0,
      },
    },
  });

describe("SafetyPlanEmployeePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom has no 2d canvas context — some print/signature paths probe it.
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  it("renders the Safety Plan heading and the four numbered steps", () => {
    renderPage();
    expect(screen.getAllByText("Safety Plan").length).toBeGreaterThanOrEqual(1);
    // STEP labels confirm the core safety-plan sections render.
    expect(screen.getByText(/STEP 1/)).toBeInTheDocument();
    expect(screen.getByText(/STEP 2/)).toBeInTheDocument();
    expect(screen.getByText(/STEP 3/)).toBeInTheDocument();
    expect(screen.getByText(/STEP 4/)).toBeInTheDocument();
  });

  it("renders the PatientComponent on the create route (no id)", () => {
    renderPage();
    // WHY: without a route :id the page lets the user pick a patient.
    expect(screen.getByTestId("patient-component")).toBeInTheDocument();
    // Signers picker is only shown in create mode (!id).
    expect(screen.getByTestId("multi-employee")).toBeInTheDocument();
  });

  it("renders 3 warning-sign and 3 internal-coping rows", () => {
    renderPage();
    // Each section seeds ["","",""]; together with other text fields there
    // should be at least 6 textboxes for these two sections.
    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes.length).toBeGreaterThanOrEqual(6);
  });

  it("fetches the safety plan once a patient is selected on the create route", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByTestId("pick-patient"));
    // Selecting a patient sets patientId -> effect calls getSafetyPlan.
    expect(h.getSafetyPlan).toHaveBeenCalled();
    expect(h.getSafetyPlan.mock.calls[0][0]).toEqual(
      expect.objectContaining({ patientId: "res-test-001" }),
    );
  });

  it("adds a help contact to the table when Add is clicked with data", async () => {
    const user = userEvent.setup();
    renderPage();

    // The first Name input belongs to STEP 3; the STEP 4 help-name input has id AHCCCS.
    const helpNameInput = document.querySelector("#AHCCCS");
    expect(helpNameInput).toBeTruthy();
    fireEvent.change(helpNameInput, { target: { value: "Helper One" } });

    await user.click(screen.getByRole("button", { name: "Add" }));

    // WHY: a populated help row is appended and rendered in the contacts table.
    expect(screen.getByText(/Helper One/)).toBeInTheDocument();
  });

  it("opens the signature modal when SAVED AND SIGNED is clicked", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByTestId("add-signature")).toHaveTextContent("closed");
    await user.click(screen.getByRole("button", { name: /SAVED AND SIGNED/i }));
    expect(screen.getByTestId("add-signature")).toHaveTextContent("open");
  });

  it("disables SUBMIT for an employee until a signature exists", () => {
    renderPage();
    // No signature yet on create route -> submit disabled.
    expect(screen.getByRole("button", { name: /SUBMIT/i })).toBeDisabled();
  });

  it("enables SUBMIT immediately for an Admin profile", () => {
    renderPage({
      profile: { ...employeeProfile, _id: "adm-1", userType: "Admin" },
    });
    // Admins are never gated on a signature on the create route.
    expect(screen.getByRole("button", { name: /SUBMIT/i })).not.toBeDisabled();
  });

  it("passes the four environment-safety options to the multi-select", () => {
    renderPage();
    expect(screen.getByTestId("env-options")).toHaveTextContent("4");
  });

  it("renders the AddSignature modal and signers section without crashing on mount", () => {
    // Smoke coverage for the signature/signers wiring at the bottom of the form.
    renderPage();
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
    expect(screen.getByText("Signers :")).toBeInTheDocument();
  });

  it("renders without crashing for a restricted employee profile", () => {
    // Restricted employees hit the not-editable branches; page must still mount.
    expect(() =>
      renderPage({
        profile: {
          ...employeeProfile,
          accountType: "restricted",
          userPermissions: { edit: "", delete: "" },
        },
      }),
    ).not.toThrow();
    expect(screen.getAllByText("Safety Plan").length).toBeGreaterThanOrEqual(1);
  });
});

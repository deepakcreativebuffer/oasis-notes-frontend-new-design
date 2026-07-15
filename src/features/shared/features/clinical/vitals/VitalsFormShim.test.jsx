/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import VitalsFormShim from "./VitalsFormShim";
import { vitalsService } from "@/features/shared/services/index";

// VitalsFormShim simply re-exports the default from VitalsFormPage, so the
// shim is exercised by rendering the underlying form. We mock every IO and
// heavy child so the test drives the form logic in isolation.

// Vitals data service: the form fetches existing readings and submits
// create/update. No real HTTP allowed.
vi.mock("@/features/shared/services/index", () => ({
  vitalsService: {
    getById: vi.fn(),
    getByPatient: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

// useParams drives create vs edit mode. renderWithProviders mounts a bare
// MemoryRouter (no <Route>), so we control the :id param directly while
// keeping the real router for everything else.
let mockParamId;
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({ id: mockParamId }),
    useNavigate: () => vi.fn(),
  };
});

// HOC normally wraps the page in Sidebar/Navbar chrome (heavy, store/router
// bound). Render just the inner component.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Page chrome banner — stub to expose only its title.
vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// Patient search picker: expose a button that selects a fake resident id so
// the "create" flow can be driven without the real autocomplete.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  default: ({ MainPatientId }) => (
    <button type="button" onClick={() => MainPatientId("res-test-001")}>
      pick-patient
    </button>
  ),
}));

// Multi-employee signer selector — light stub exposing a select-trigger.
vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  default: ({ setValue }) => (
    <button
      type="button"
      onClick={() =>
        setValue([{ value: "emp-test-001", label: "Test Employee" }])
      }
    >
      add-signer
    </button>
  ),
}));

// Time picker depends on antd/dayjs internals; stub to a plain input.
vi.mock("@/features/shared/ui/TimePicker/CustomTimePicker", () => ({
  default: ({ onChange }) => (
    <input
      aria-label="time-picker"
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// react-datepicker is heavy and not under test.
vi.mock("react-datepicker", () => ({
  default: ({ onChange, placeholderText }) => (
    <input
      aria-label="date-picker"
      placeholder={placeholderText}
      onChange={(e) => onChange(new Date(e.target.value))}
    />
  ),
}));

// Spinner -> trivial element.
vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

// Signature modal + formatting helpers from utils. AddSignature exposes a
// button that fires setValue/setDate so we can satisfy the "must be signed"
// gate on the submit button.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show, setValue, setDate, setTime }) => (
    <button
      type="button"
      data-show={String(show)}
      onClick={() => {
        setValue("data:image/png;base64,SIG");
        setDate("Mon Jun 01 2026");
        if (setTime) setTime("10:00 AM");
      }}
    >
      apply-signature
    </button>
  ),
  fetchPaitentName: (p) => p?.firstName || "Test Patient",
  formatDateToMMDDYYYY: (d) => (d ? new Date(d) : null),
  parseTimeStringToDate: () => new Date(),
  signatureFormat: ({ sign }) =>
    sign ? <span data-testid="signature-block">signed</span> : null,
}));

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      userType: "Employee",
      hoursFormat: "12",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("VitalsFormShim", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParamId = undefined; // default: create mode
  });

  it("should render the vitals form with all reading fields in create mode", () => {
    renderWithProviders(<VitalsFormShim />, {
      route: "/vitals/new",
      preloadedState: employeeState,
    });

    // WHY: the shim must surface the underlying Resident Vitals form, including
    // the core clinical reading inputs clinicians chart.
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Resident Vitals",
    );
    expect(screen.getByText("Body Temperature")).toBeInTheDocument();
    expect(screen.getByText("Pulse Rate")).toBeInTheDocument();
    expect(screen.getByText("Respiration Rate")).toBeInTheDocument();
    expect(
      screen.getByText("Blood Pressure Systolic/Diastolic"),
    ).toBeInTheDocument();
    expect(screen.getByText("Blood oxygen")).toBeInTheDocument();
  });

  it("should show the patient picker (not a fixed name) in create mode", () => {
    renderWithProviders(<VitalsFormShim />, {
      route: "/vitals/new",
      preloadedState: employeeState,
    });

    // WHY: a brand-new vitals entry must let staff choose the resident; the
    // read-only "Resident Name" label only appears when editing.
    expect(
      screen.getByRole("button", { name: "pick-patient" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Resident Name/i)).not.toBeInTheDocument();
  });

  it("should keep SUBMIT disabled until a signature is applied in create mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalsFormShim />, {
      route: "/vitals/new",
      preloadedState: employeeState,
    });

    const submit = screen.getByRole("button", { name: /SUBMIT/i });
    // WHY: new vitals cannot be saved unsigned — the legal record requires a
    // staff signature before submission.
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "apply-signature" }));

    await waitFor(() => expect(submit).toBeEnabled());
  });

  it("should fetch this week's vitals for the chosen patient in create mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalsFormShim />, {
      route: "/vitals/new",
      preloadedState: employeeState,
    });

    await user.click(screen.getByRole("button", { name: "pick-patient" }));

    // WHY: selecting a resident pulls their recent readings so staff see
    // existing values before charting a new set.
    await waitFor(() =>
      expect(vitalsService.getByPatient).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: "res-test-001",
          forFilter: "week",
        }),
      ),
    );
  });

  it("should call create with the resident id and signature when submitted", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VitalsFormShim />, {
      route: "/vitals/new",
      preloadedState: employeeState,
    });

    await user.click(screen.getByRole("button", { name: "pick-patient" }));
    await user.click(screen.getByRole("button", { name: "apply-signature" }));
    await user.click(screen.getByRole("button", { name: /SUBMIT/i }));

    // WHY: a create submission posts the patient + signed payload via the
    // vitals service (never the update path).
    await waitFor(() => expect(vitalsService.create).toHaveBeenCalled());
    expect(vitalsService.update).not.toHaveBeenCalled();
    const payload = vitalsService.create.mock.calls[0][0];
    expect(payload.patientId).toBe("res-test-001");
    expect(payload.bhpSignature).toBe("data:image/png;base64,SIG");
  });

  it("should load the existing record and update (not create) in edit mode", async () => {
    const user = userEvent.setup();
    mockParamId = "vital-test-001";
    // Edit fetch resolves an existing record so the form hydrates.
    vitalsService.getById.mockImplementation((id, { setResponse }) => {
      setResponse({
        data: {
          _id: "vital-test-001",
          patientId: { _id: "res-test-001", firstName: "Test Patient" },
          employeeId: "emp-test-001",
          bodyTemperature: "98.6",
          signers: [],
        },
      });
    });
    renderWithProviders(<VitalsFormShim />, {
      preloadedState: employeeState,
    });

    // WHY: editing an existing vitals record fetches it by id on mount.
    await waitFor(() =>
      expect(vitalsService.getById).toHaveBeenCalledWith(
        "vital-test-001",
        expect.any(Object),
      ),
    );

    // WHY: in edit mode the resident is fixed, so the picker is replaced by a
    // read-only resident-name label.
    expect(screen.getByText(/Resident Name/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "pick-patient" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /SUBMIT/i }));
    await waitFor(() => expect(vitalsService.update).toHaveBeenCalled());
    expect(vitalsService.create).not.toHaveBeenCalled();
  });
});

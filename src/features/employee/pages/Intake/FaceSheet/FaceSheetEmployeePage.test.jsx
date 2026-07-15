/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent, waitFor } from "@/test-utils";

import FaceSheet from "./FaceSheetEmployeePage";

// ─── Hoisted mock handles ───────────────────────────────────────────
// VITEST HOISTING: anything referenced inside a vi.mock factory must be
// created via vi.hoisted so it exists before the hoisted mock runs.
const mocks = vi.hoisted(() => ({
  getFaceSheet: vi.fn(),
  faceSheetCreate: vi.fn(),
  faceSheetUpdate: vi.fn(),
  patientGetById: vi.fn(),
  navigate: vi.fn(),
  useParams: vi.fn(() => ({})),
  useLocation: vi.fn(() => ({ pathname: "/faceSheet" })),
}));

// HOC wraps the inner FaceSheet in the sidebar/navbar shell. Stub it to a
// pass-through so we exercise the FaceSheet form, not the layout chrome.
vi.mock("@/features/shared/layout/Inner/HOC", () => ({
  default: (config) => {
    return function HocStub() {
      const Inner = config.Wcomponenet;
      return <Inner />;
    };
  },
}));

// Router: drive useParams/useLocation/useNavigate via controllable mocks.
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useParams: () => mocks.useParams(),
    useLocation: () => mocks.useLocation(),
  };
});

// Services — NEVER real HTTP.
vi.mock("@/features/shared/services/index", () => ({
  intakeService: {
    getFaceSheet: (...args) => mocks.getFaceSheet(...args),
    faceSheet: {
      create: (...args) => mocks.faceSheetCreate(...args),
      update: (...args) => mocks.faceSheetUpdate(...args),
    },
  },
  patientService: {
    getById: (...args) => mocks.patientGetById(...args),
  },
}));

// Utils: AddSignature is a heavy modal; stub it to expose the setters under
// test so we can drive signature capture from the test.
vi.mock("@/utils/utils", () => ({
  AddSignature: ({ show, setValue, setDate, setTime }) => (
    <div data-testid="add-signature" data-show={show ? "true" : "false"}>
      <button type="button" onClick={() => setValue("data:sign")}>
        capture-sign
      </button>
      <button type="button" onClick={() => setDate("01/01/2026")}>
        capture-date
      </button>
      <button type="button" onClick={() => setTime("10:00 AM")}>
        capture-time
      </button>
    </div>
  ),
  deletePermission: vi.fn(() => true),
  formatDateToMMDDYYYY: vi.fn(() => null),
  signatureFormat: vi.fn(() => ""),
}));

vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "Face Sheet"),
}));

vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));

vi.mock("@/utils/index", () => ({
  downloadReport: vi.fn(),
}));

// Heavy third-party / search widgets — light stubs exposing the props we drive.
vi.mock("react-datepicker", () => ({
  default: ({ onChange, disabled }) => (
    <input
      type="text"
      data-testid="date-picker"
      disabled={disabled}
      onChange={(e) => onChange?.(new Date("2026-01-01"))}
    />
  ),
}));

vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  default: ({ MainPatientId, MainResidentName, setWholeData }) => (
    <button
      type="button"
      data-testid="patient-component"
      onClick={() => {
        MainPatientId?.("res-test-001");
        MainResidentName?.("Test Patient");
        setWholeData?.({ ahcccsId: "MRN-TEST-001" });
      }}
    >
      pick-patient
    </button>
  ),
}));

vi.mock("@/features/shared/ui/Search/MultiEmployee", () => ({
  default: ({ setValue }) => (
    <button
      type="button"
      data-testid="multi-employee"
      onClick={() =>
        setValue?.([
          { value: "emp-test-001", label: "Test Signer", type: "Employee" },
        ])
      }
    >
      pick-signers
    </button>
  ),
}));

// CSS side-effect imports — stub to avoid jsdom CSS parsing noise.
vi.mock(
  "@/features/shared/features/intake/faceSheet/Facesheet.css",
  () => ({}),
);
vi.mock(
  "@/features/resident/pages/Intake/PatientPanel/FormsUpperbar.css",
  () => ({}),
);
vi.mock(
  "@/features/shared/features/intake/initialAssessment/InitialAssessment.css",
  () => ({}),
);

// Seed an authenticated employee so useSelector(userProfile) resolves.
const employeeState = (overrides = {}) => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test User",
      userType: "Employee",
      accountType: "regular",
      hoursFormat: "12",
      userPermissions: { edit: "fs", delete: "fs" },
      patientsAssigned: [],
      ...overrides,
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

describe("FaceSheetEmployeePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useParams.mockReturnValue({});
    mocks.useLocation.mockReturnValue({ pathname: "/faceSheet" });
    // jsdom has no canvas 2d context; some print/signature paths touch it.
    HTMLCanvasElement.prototype.getContext = vi.fn();
  });

  it("renders the Face Sheet form heading and the signature modal stub", () => {
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet",
    });

    // WHY: confirms the inner FaceSheet (not just the HOC shell) actually mounts.
    expect(screen.getAllByText(/Face Sheet/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
  });

  it("renders the patient picker (no id) instead of an editable resident name", () => {
    mocks.useParams.mockReturnValue({});
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet",
    });

    // WHY: on the create route the resident is chosen via PatientComponent;
    // the free-text resident-name field only appears in edit mode (id present).
    expect(screen.getByTestId("patient-component")).toBeInTheDocument();
    expect(screen.queryByText("Resident Name:")).not.toBeInTheDocument();
  });

  it("shows the editable resident name field and fetches the face sheet by id (edit mode)", async () => {
    mocks.useParams.mockReturnValue({ id: "res-test-001" });
    mocks.useLocation.mockReturnValue({ pathname: "/faceSheet/res-test-001" });

    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet/res-test-001",
    });

    // WHY: with an id, the page hydrates an existing record via getFaceSheet.
    await waitFor(() => expect(mocks.getFaceSheet).toHaveBeenCalled());
    expect(mocks.getFaceSheet).toHaveBeenCalledWith(
      expect.objectContaining({ id: "res-test-001" }),
    );
    expect(screen.getByText("Resident Name:")).toBeInTheDocument();
  });

  it("fetches the face sheet by patientId once a patient is selected on the create route", async () => {
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet",
    });

    fireEvent.click(screen.getByTestId("patient-component"));

    // WHY: selecting a resident sets patientId, which triggers the create-route
    // getFaceSheet effect keyed on patientId + url === "/faceSheet".
    await waitFor(() =>
      expect(mocks.getFaceSheet).toHaveBeenCalledWith(
        expect.objectContaining({ patientId: "res-test-001" }),
      ),
    );
  });

  it("submits a create payload when an employee signs and submits on the create route", async () => {
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet",
    });

    // Capture a signature so the submit button is enabled (signature.length > 0).
    fireEvent.click(screen.getByText("capture-sign"));

    const submit = screen.getByRole("button", { name: /SUBMIT/i });
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);

    // WHY: the create route persists via intakeService.faceSheet.create.
    await waitFor(() => expect(mocks.faceSheetCreate).toHaveBeenCalledTimes(1));
    expect(mocks.faceSheetCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        successMsg: "Face sheet updated !",
        payload: expect.objectContaining({ bhpSignature: "data:sign" }),
      }),
    );
    expect(mocks.faceSheetUpdate).not.toHaveBeenCalled();
  });

  it("keeps SUBMIT disabled for a non-admin employee before any signature on the create route", () => {
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet",
    });

    // WHY: an unsigned face sheet must not be submittable by regular staff.
    expect(screen.getByRole("button", { name: /SUBMIT/i })).toBeDisabled();
  });

  it("enables SUBMIT for an Admin even without a signature", () => {
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState({ userType: "Admin" }),
      route: "/faceSheet",
    });

    // WHY: admins can submit without signing (role branch in the disabled prop).
    expect(screen.getByRole("button", { name: /SUBMIT/i })).not.toBeDisabled();
  });

  it("lets the user type into editable facility fields", () => {
    renderWithProviders(<FaceSheet />, {
      preloadedState: employeeState(),
      route: "/faceSheet",
    });

    const address = document.getElementById("facility-address");
    expect(address).toBeInTheDocument();
    fireEvent.change(address, { target: { value: "123 Test St" } });
    expect(address).toHaveValue("123 Test St");
  });
});

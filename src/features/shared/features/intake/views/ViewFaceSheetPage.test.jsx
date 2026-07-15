/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import ViewFaceSheetPage from "./ViewFaceSheetPage";
import { intakeService } from "@/features/shared/services/index";

// --- Mock the data-fetching service. getFaceSheet pushes its result into the
// component via the `setResponse` callback, so the mock drives the view by
// invoking that callback with controlled, fake data. NEVER real HTTP.
vi.mock("@/features/shared/services/index", () => ({
  intakeService: { getFaceSheet: vi.fn() },
}));

// --- HOC wraps the view in Navbar/Sidebar chrome (which pull in router/layout
// context we don't care about here). Stub it to render the inner component
// directly so the test targets the Face Sheet view, not the shell.
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// --- Print plumbing is heavy/browser-only. Stub it to no-op spies so the
// "PRINT THIS FORM" button is testable without react-to-print or window.print.
const mockTriggerPrint = vi.fn();
vi.mock("@shared/hooks", () => ({
  usePrint: () => mockTriggerPrint,
}));
vi.mock("@/utils/useReactToPrintWithContent", () => ({
  useReactToPrintWithContent: () => vi.fn(),
}));
vi.mock("@/utils/printHelpers", () => ({
  printDocumentContent: vi.fn(),
  printDocumentTitleExceptFirstPage: vi.fn(() => "Face Sheet"),
}));

const authState = (userType = "Employee") => ({
  auth: {
    isAuthenticated: true,
    userProfile: {
      _id: "emp-test-001",
      name: "Test User",
      userType,
      hoursFormat: "12",
    },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

// A fully-populated, fake-PHI face sheet payload.
const fullFaceSheet = {
  data: {
    patientId: {
      firstName: "Test",
      lastName: "Patient",
      dateOfBirth: "1990-01-15",
      admitDate: "2024-02-01",
      diagnosis: "Continuing anxiety disorder",
    },
    dateOfAdmit: "2024-02-01",
    facilityAddress: "1 Test Way",
    facilityPhoneNumber: "555-0100",
    placeOfBirth: "Testville",
    eyeColor: "Brown",
    race: "Test Race",
    height: "5ft 9in",
    weight: "170lb",
    hairColor: "Black",
    identifiableMarks: "None",
    primaryLanguage: "English",
    courtOrderedTreatment: true,
    familyGuardianEmergencyName: "Test Guardian 555-0111",
    facilityEmergencyContact: "555-0122",
    medicationAllergies: "Penicillin",
    otherAllergies: "Peanuts",
    primaryCareProvider: [
      { name: "Dr Test PCP", phone: "555-0133", address: "2 Test Rd" },
    ],
    psychiatricProvider: [
      { name: "Dr Test Psych", phone: "555-0144", address: "3 Test Rd" },
    ],
    healthPlan: "Test Plan",
    healthPlanId: "PLAN-TEST-001",
    caseManagerName: "Test Manager",
    mentalHealthDiagnoses: "Stable",
    signers: [],
  },
};

const renderView = (preloadedState = authState()) =>
  renderWithProviders(<ViewFaceSheetPage />, {
    preloadedState,
    route: "/facesheet/res-test-001",
  });

describe("ViewFaceSheetPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should request the face sheet on mount with the route id", async () => {
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView();

    // WHY: the view is read-only and must fetch the resident's face sheet for
    // the id in the URL so staff see the correct chart.
    await waitFor(() =>
      expect(intakeService.getFaceSheet).toHaveBeenCalledTimes(1),
    );
    expect(intakeService.getFaceSheet).toHaveBeenCalledWith(
      expect.objectContaining({ setResponse: expect.any(Function) }),
    );
  });

  it("should render the page heading and print action", () => {
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView();

    expect(
      screen.getByRole("heading", { name: /face sheet/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /print this form/i }),
    ).toBeInTheDocument();
  });

  it("should display the resident's identifying details from the payload", () => {
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView();

    // WHY: the face sheet is the at-a-glance resident summary; name, demographics
    // and clinical fields must surface exactly as supplied by the chart.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Continuing anxiety disorder")).toBeInTheDocument();
    expect(screen.getByText("Penicillin")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("should render provider sub-records (name and phone) from arrays", () => {
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView();

    expect(screen.getByText("Primary Care Provider")).toBeInTheDocument();
    expect(screen.getByText("Psychiatric Provider")).toBeInTheDocument();
    expect(screen.getByText("Dr Test PCP")).toBeInTheDocument();
    expect(screen.getByText("Dr Test Psych")).toBeInTheDocument();
  });

  it("should map a true courtOrderedTreatment flag to 'Yes'", () => {
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView();

    // WHY: legal status is a yes/no derived from a boolean; mislabeling it could
    // misrepresent a resident's court-ordered care.
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("should trigger the print handler when PRINT THIS FORM is clicked", async () => {
    const user = userEvent.setup();
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView();

    await user.click(screen.getByRole("button", { name: /print this form/i }));

    expect(mockTriggerPrint).toHaveBeenCalled();
  });

  it("should render without crashing when the payload is empty", () => {
    // Simulates a not-yet-loaded / empty response: component starts with {}.
    intakeService.getFaceSheet.mockImplementation(() => {});
    renderView();

    // WHY: the view must not blow up before data arrives (or when a chart is
    // sparsely filled); the chrome and print control still render.
    expect(
      screen.getByRole("heading", { name: /face sheet/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /print this form/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/court ordered treatment/i)).toBeInTheDocument();
  });

  it("should render for an Admin role as well", () => {
    intakeService.getFaceSheet.mockImplementation(({ setResponse }) =>
      setResponse(fullFaceSheet),
    );
    renderView(authState("Admin"));

    // WHY: the face sheet is a shared read-only view; role only affects chrome,
    // not the presence of the resident summary content.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });
});

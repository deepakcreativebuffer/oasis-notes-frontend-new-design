/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import Vital from "./VitalResidentPanel";
import { residentService } from "@/features/shared/services/index";

// Mock the service the panel uses to load vitals. vitalData is a callback-style
// fetcher: residentService.vitalData(patientId, setVitalData) — so we drive the
// component by invoking the provided setter with controlled data.
vi.mock("@/features/shared/services/index", () => ({
  residentService: {
    vitalData: vi.fn(),
  },
}));

// Seed auth.userProfile so the userProfile selector returns a truthy patient,
// which triggers the vitals fetch effect.
const patientState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "res-test-001", userType: "Patient" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("VitalResidentPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all eight vitals cards with their labels", () => {
    renderWithProviders(<Vital />, { preloadedState: patientState });

    // WHY: the resident vitals dashboard must surface every monitored measure
    // so a clinician can review the patient's full snapshot at a glance.
    expect(screen.getByText("Pulse Rate")).toBeInTheDocument();
    expect(
      screen.getByText("Blood Pressure Systolic/Diastolic"),
    ).toBeInTheDocument();
    expect(screen.getByText("Blood Glucose Level")).toBeInTheDocument();
    expect(screen.getByText("Body Temperature")).toBeInTheDocument();
    expect(screen.getByText("Respiration Rate")).toBeInTheDocument();
    expect(screen.getByText("Blood Oxygen")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
  });

  it("should render the Vitals section heading", () => {
    renderWithProviders(<Vital />, { preloadedState: patientState });
    expect(
      screen.getByRole("heading", { name: "Vitals", level: 5 }),
    ).toBeInTheDocument();
  });

  it("should fetch vitals once a patient profile is present", async () => {
    renderWithProviders(<Vital />, { preloadedState: patientState });

    // WHY: vitals are patient-scoped PHI; the panel must request data for the
    // logged-in patient profile, not eagerly fetch with no identity.
    await waitFor(() => {
      expect(residentService.vitalData).toHaveBeenCalledTimes(1);
    });
    expect(residentService.vitalData).toHaveBeenCalledWith(
      patientState.auth.userProfile,
      expect.any(Function),
    );
  });

  it("should not fetch vitals when there is no patient profile", () => {
    // Empty userProfile {} is falsy-effect: setPatientId only runs for truthy
    // profile, so no patient-scoped request should fire.
    renderWithProviders(<Vital />, {
      preloadedState: {
        auth: {
          isAuthenticated: false,
          userProfile: null,
          unreadMessages: 0,
          unreadNotifications: 0,
        },
      },
    });

    expect(residentService.vitalData).not.toHaveBeenCalled();
  });

  it("should display the fetched vital values once the service resolves", async () => {
    // Drive the callback-style fetcher: invoke the setter the component passes
    // with a controlled vitals record (fake PHI only).
    residentService.vitalData.mockImplementation((_patientId, setVitalData) => {
      setVitalData([
        {
          pulseRate: 72,
          bloodPressure: "120/80",
          bloodGlucoseLevel: 95,
          bodyTemperature: 98,
          respirationRate: 16,
          bloodOxygen: 99,
          weight: 150,
          height: "5/8",
        },
      ]);
    });

    renderWithProviders(<Vital />, { preloadedState: patientState });

    // WHY: the latest reading (index 0) must be rendered so clinicians see the
    // current measurement, not a stale/empty cell.
    await waitFor(() => {
      expect(screen.getByText("72")).toBeInTheDocument();
    });
    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("95")).toBeInTheDocument();
    expect(screen.getByText("99")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("should render the unit labels for each vital", () => {
    renderWithProviders(<Vital />, { preloadedState: patientState });

    // WHY: numeric vitals are clinically meaningless without their units; the
    // panel must always show them even before data loads.
    expect(screen.getAllByText("bpm")).toHaveLength(2); // pulse + respiration
    expect(screen.getByText("mmHg")).toBeInTheDocument();
    expect(screen.getByText("mm/dl")).toBeInTheDocument();
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("lbs")).toBeInTheDocument();
    expect(screen.getByText("ft/inch")).toBeInTheDocument();
  });

  it("should render without crashing when the service returns empty data", () => {
    residentService.vitalData.mockImplementation((_patientId, setVitalData) => {
      setVitalData([]);
    });

    renderWithProviders(<Vital />, { preloadedState: patientState });

    // WHY: a patient with no recorded vitals must still render the dashboard
    // shell (labels/units) rather than blanking out or erroring.
    expect(screen.getByText("Pulse Rate")).toBeInTheDocument();
  });
});

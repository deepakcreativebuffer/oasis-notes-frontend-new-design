/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import Vitals from "./Vitals";

// --- Hoisted mock handles (vi.mock factories are hoisted above imports) ---
const mocks = vi.hoisted(() => ({
  getByPatientId: vi.fn(),
}));

// Source pulls vitalsService from the shared services barrel. Stub the IO so no
// real HTTP fires; expose the spy via hoisted handle for assertions.
vi.mock("@/features/shared/services", () => ({
  __esModule: true,
  vitalsService: {
    getByPatientId: mocks.getByPatientId,
  },
}));

// Asset path resolver returns a string url; stub to a deterministic value.
vi.mock("@/assets", () => ({
  __esModule: true,
  resolveVitalAssetPath: (p) => p,
}));

// react-bootstrap Offcanvas pulls useBreakpoint -> window.matchMedia which
// jsdom lacks; stub to light pass-through components so render never crashes.
vi.mock("react-bootstrap", () => {
  const Offcanvas = ({ children }) => (
    <div data-testid="offcanvas">{children}</div>
  );
  Offcanvas.Header = ({ children }) => <div>{children}</div>;
  Offcanvas.Body = ({ children }) => <div>{children}</div>;
  return { __esModule: true, Offcanvas };
});

describe("Vitals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the VITALS heading and all vital labels", () => {
    renderWithProviders(<Vitals />);

    // WHY: the heading text is exactly "VITALS" once normalized; sidebar items
    // like "Patient Vitals" would also match a loose /vitals/i regex, so match
    // the normalized content exactly to target only the heading.
    expect(
      screen.getByText((content) => content.trim() === "VITALS"),
    ).toBeInTheDocument();
    // each card label is a static section header always present.
    expect(screen.getByText("Body Temp.")).toBeInTheDocument();
    expect(screen.getByText("Pulse Rate")).toBeInTheDocument();
    expect(screen.getByText("Respiration Rate")).toBeInTheDocument();
    expect(
      screen.getByText("Blood Pressure Systolic/Diastolic"),
    ).toBeInTheDocument();
    expect(screen.getByText("Blood Oxygen")).toBeInTheDocument();
    expect(screen.getByText("Weight")).toBeInTheDocument();
    expect(screen.getByText("Blood Glucose Level")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
  });

  it("should fetch patient vitals on mount", () => {
    renderWithProviders(<Vitals />);

    // WHY: getPatitentData() runs in a mount effect, driving the service call.
    expect(mocks.getByPatientId).toHaveBeenCalled();
  });

  it("should render values from the fetched patient data", async () => {
    // The service uses a setResponse callback; invoke it with fake vitals.
    mocks.getByPatientId.mockImplementation((id, options) => {
      options?.setResponse?.({
        data: [
          {
            respirationRate: "18",
            bloodPressure: "120/80",
            bloodOxygen: "98",
            weight: "70kg",
            bloodGlucoseLevel: "90",
          },
        ],
      });
    });

    renderWithProviders(<Vitals />);

    await waitFor(() => {
      // WHY: fetched values flow into the cards via patientData state.
      expect(screen.getByText("18")).toBeInTheDocument();
    });
    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("98")).toBeInTheDocument();
    expect(screen.getByText("70kg")).toBeInTheDocument();
  });

  it("should render resiliently when the service returns no data", () => {
    mocks.getByPatientId.mockImplementation((id, options) => {
      options?.setResponse?.({ data: [] });
    });

    renderWithProviders(<Vitals />);

    // Static labels still render even with an empty patientData fallback.
    expect(screen.getByText("Body Temp.")).toBeInTheDocument();
  });
});

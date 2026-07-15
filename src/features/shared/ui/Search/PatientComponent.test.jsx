/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";

import PatientComponent from "./PatientComponent";
import { patientService } from "../../services";

const PATIENT = {
  _id: "res-test-001",
  firstName: "Test",
  lastName: "Patient",
};

// Stub the dropdown child to fire a selection; mock the patient service so the
// "load full record" call is observable without HTTP.
vi.mock("./SearchPatients", () => ({
  default: ({ clickHandler }) => (
    <button onClick={() => clickHandler(PATIENT)}>pick patient</button>
  ),
}));
vi.mock("../../services", () => ({
  patientService: {
    getById: vi.fn((id, { setResponse }) =>
      setResponse({ data: { ...PATIENT, admitDate: "2020-01-01" } }),
    ),
  },
}));

describe("PatientComponent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should prompt to select a resident initially", () => {
    render(<PatientComponent />);
    expect(screen.getByText(/select resident/i)).toBeInTheDocument();
  });

  it("should propagate id/name and load the full record on selection", async () => {
    const user = userEvent.setup();
    const MainPatientId = vi.fn();
    const MainResidentName = vi.fn();
    const setWholeData = vi.fn();

    render(
      <PatientComponent
        MainPatientId={MainPatientId}
        MainResidentName={MainResidentName}
        setWholeData={setWholeData}
      />,
    );

    await user.click(screen.getByRole("button", { name: /pick patient/i }));

    expect(MainPatientId).toHaveBeenCalledWith("res-test-001");
    expect(MainResidentName).toHaveBeenCalledWith("Test Patient");
    // WHY: search results are partial; the full record is fetched so admit date
    // and other chart-header fields populate.
    expect(patientService.getById).toHaveBeenCalledWith(
      "res-test-001",
      expect.any(Object),
    );
    expect(setWholeData).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "res-test-001", admitDate: "2020-01-01" }),
    );
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });
});

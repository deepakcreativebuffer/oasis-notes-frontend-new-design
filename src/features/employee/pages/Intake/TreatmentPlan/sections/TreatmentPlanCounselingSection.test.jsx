/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import TreatmentPlanCounselingSection from "./TreatmentPlanCounselingSection";

// WHY: the section reads every field/setter from TreatmentPlanFormContext.
// Mock the hook so we can drive controlled values and assert setter calls
// without standing up the whole TreatmentPlan form provider.
const ctx = vi.hoisted(() => ({ value: null }));

vi.mock("../context/TreatmentPlanFormContext", () => ({
  __esModule: true,
  useTreatmentPlanFormContext: () => ctx.value,
}));

// Build a context value: real setter spies for the fields we assert, plus a
// controllable counselingOptions array and the conditional flags.
const makeCtx = (overrides = {}) => ({
  minimumHoure: "",
  setMinimumHoure: vi.fn(),
  counselingOptions: [],
  handleCheckboxChangeCounsiling: vi.fn(),
  counselingOptionsTextBoolean: false,
  counselingOptionsText: "",
  setCounselingOptionsOther: vi.fn(),
  individualTherapy: "",
  setIndividualTherapy: vi.fn(),
  ...overrides,
});

describe("TreatmentPlanCounselingSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    ctx.value = makeCtx();
  });

  it("should render the counseling heading and all base checkbox labels", () => {
    renderWithProviders(<TreatmentPlanCounselingSection />);

    expect(
      screen.getByText("Counseling Frequency and Duration"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total of minimum")).toBeInTheDocument();
    expect(screen.getByLabelText("Group")).toBeInTheDocument();
    expect(screen.getByLabelText("Family Counseling")).toBeInTheDocument();
    expect(screen.getByLabelText("AA")).toBeInTheDocument();
    expect(screen.getByLabelText("NA")).toBeInTheDocument();
  });

  it("should reflect the minimumHoure value and route edits through setMinimumHoure", () => {
    ctx.value = makeCtx({ minimumHoure: "5" });
    renderWithProviders(<TreatmentPlanCounselingSection />);

    const input = screen.getByDisplayValue("5");
    fireEvent.change(input, { target: { value: "12" } });
    expect(ctx.value.setMinimumHoure).toHaveBeenCalledWith("12");
  });

  it("should reflect checked counseling options from context", () => {
    ctx.value = makeCtx({ counselingOptions: ["Group", "AA"] });
    renderWithProviders(<TreatmentPlanCounselingSection />);

    // WHY: checked state is derived from counselingOptions.includes(...).
    expect(screen.getByLabelText("Group")).toBeChecked();
    expect(screen.getByLabelText("AA")).toBeChecked();
    expect(screen.getByLabelText("NA")).not.toBeChecked();
  });

  it("should call handleCheckboxChangeCounsiling with the option key on toggle", () => {
    renderWithProviders(<TreatmentPlanCounselingSection />);

    fireEvent.click(screen.getByLabelText("Group"));
    expect(ctx.value.handleCheckboxChangeCounsiling).toHaveBeenCalledWith(
      "Group",
    );

    fireEvent.click(screen.getByLabelText("Family Counseling"));
    expect(ctx.value.handleCheckboxChangeCounsiling).toHaveBeenCalledWith(
      "Family Counseling",
    );
  });

  it("should NOT render the 'Other' free-text input when counselingOptionsTextBoolean is false", () => {
    renderWithProviders(<TreatmentPlanCounselingSection />);

    // The Other text input uses placeholder=" " (single space).
    expect(screen.queryByPlaceholderText(" ")).not.toBeInTheDocument();
  });

  it("should render the 'Other' free-text input when counselingOptionsTextBoolean is true and route edits", () => {
    ctx.value = makeCtx({
      counselingOptionsTextBoolean: true,
      counselingOptionsText: "extra notes",
    });
    renderWithProviders(<TreatmentPlanCounselingSection />);

    const otherInput = screen.getByDisplayValue("extra notes");
    fireEvent.change(otherInput, { target: { value: "changed" } });
    expect(ctx.value.setCounselingOptionsOther).toHaveBeenCalledWith("changed");
  });

  it("should render the individual-therapy specify input only when that option is selected", () => {
    // Not selected: input absent.
    renderWithProviders(<TreatmentPlanCounselingSection />);
    expect(screen.queryByDisplayValue("CBT plan")).not.toBeInTheDocument();

    // Selected: input present and wired to setIndividualTherapy.
    ctx.value = makeCtx({
      counselingOptions: ["Individual Therapy: Please Specify"],
      individualTherapy: "CBT plan",
    });
    const { rerender } = renderWithProviders(
      <TreatmentPlanCounselingSection />,
    );
    rerender(<TreatmentPlanCounselingSection />);

    const therapyInput = screen.getByDisplayValue("CBT plan");
    fireEvent.change(therapyInput, { target: { value: "DBT plan" } });
    expect(ctx.value.setIndividualTherapy).toHaveBeenCalledWith("DBT plan");
  });

  it("should render all the long-form counseling checkboxes", () => {
    renderWithProviders(<TreatmentPlanCounselingSection />);

    expect(
      screen.getByLabelText("Individual Therapy: As needed"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Monthly ART Meeting/Staffing"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Weekly ART Meeting/Staffing"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Individual Therapy: Please Specify"),
    ).toBeInTheDocument();
  });

  it("should render without crashing when counselingOptions is empty", () => {
    ctx.value = makeCtx({ counselingOptions: [] });
    expect(() =>
      renderWithProviders(<TreatmentPlanCounselingSection />),
    ).not.toThrow();
  });
});

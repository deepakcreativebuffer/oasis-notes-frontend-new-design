/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";

import SubstanceAbuseSection from "./SubstanceAbuseSection";

// The section is a read-only "View*" presentational component. Everything it
// renders comes from the form context hook, so we mock the context module and
// drive the component with a controlled return value. This avoids needing the
// real provider/data-fetching wiring while still exercising the render logic.
const mockForm = vi.fn();
vi.mock("../formContext", () => ({
  useViewInitialAssessmentForm: () => mockForm(),
}));

// A minimal-but-complete form value. The substance table reads several `.label`
// fields WITHOUT optional chaining (Marijuana, Methamphetamine, Methadone,
// MDMA, PCP, Prescription) and would throw on `undefined.label`. So those keys
// must default to objects exposing a `label`. Everything else defaults to the
// falsy/empty state so the table is hidden unless a test opts in.
function makeForm(overrides = {}) {
  // Two default shapes:
  // - `labelObj` (undefined): the real empty state. Used for fields read with
  //   optional chaining (`?.label`) and for the OR-guard membership.
  // - `safeLabel` ({label:""}): used ONLY for the fields the component reads as
  //   `.label` WITHOUT optional chaining (Marijuana, Methamphetamine, Methadone,
  //   MDMA, PCP, Prescription). These rows always render once the table appears,
  //   so they must never be undefined or the access throws. Empty `label` keeps
  //   them visually blank without contributing a value to assert against.
  const labelObj = undefined;
  const safeLabel = { label: "" };
  return {
    // Top-row checkboxes.
    substanceAbuseHistory: false,
    substanceAbuseDenies: false,
    setSubstanceAbuseHistory: vi.fn(),
    setSubstanceAbuseDenies: vi.fn(),

    // Alcohol.
    substanceAbuseHistoryDataAgeOfFirstUseAlcohol: "",
    substanceAbuseHistoryDataLastUseAlcohol: labelObj,
    substanceAbuseHistoryDataFrequencyAlcohol: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyAlcohol: labelObj,

    // Benzodiazepines.
    substanceAbuseHistoryDataAgeOfFirstUseBenzodiazepines: "",
    substanceAbuseHistoryDataLastUseBenzodiazepines: labelObj,
    substanceAbuseHistoryDataFrequencyBenzodiazepines: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyBenzodiazepines: labelObj,

    // Crack.
    substanceAbuseHistoryDataAgeOfFirstUseCrack: "",
    substanceAbuseHistoryDataLastUseCrack: labelObj,
    substanceAbuseHistoryDataFrequencyCrack: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyCrack: labelObj,

    // Heroin.
    substanceAbuseHistoryDataAgeOfFirstUseHeroin: "",
    substanceAbuseHistoryDataLastUseHeroin: labelObj,
    substanceAbuseHistoryDataFrequencyHeroin: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyHeroin: labelObj,

    // Inhalants.
    substanceAbuseHistoryDataAgeOfFirstUseInhalants: "",
    substanceAbuseHistoryDataLastUseInhalants: labelObj,
    substanceAbuseHistoryDataFrequencyInhalants: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyInhalants: labelObj,

    // Marijuana (reads .label without optional chaining).
    substanceAbuseHistoryDataAgeOfFirstUseMarijuana: "",
    substanceAbuseHistoryDataLastUseMarijuana: safeLabel,
    substanceAbuseHistoryDataFrequencyMarijuana: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyMarijuana: safeLabel,

    // Methamphetamine (reads .label without optional chaining).
    substanceAbuseHistoryDataAgeOfFirstUseMethamphetamine: "",
    substanceAbuseHistoryDataLastUseMethamphetamine: safeLabel,
    substanceAbuseHistoryDataFrequencyMethamphetamine: safeLabel,
    substanceAbuseHistoryDataLengthOfSobrietyMethamphetamine: safeLabel,

    // Methadone (reads .label without optional chaining).
    substanceAbuseHistoryDataAgeOfFirstUseMethadone: "",
    substanceAbuseHistoryDataLastUseMethadone: safeLabel,
    substanceAbuseHistoryDataFrequencyMethadone: safeLabel,
    substanceAbuseHistoryDataLengthOfSobrietyMethadone: safeLabel,

    // MDMA (reads .label without optional chaining).
    substanceAbuseHistoryDataAgeOfFirstUseMDMA: "",
    substanceAbuseHistoryDataLastUseMDMA: safeLabel,
    substanceAbuseHistoryDataFrequencyMDMA: safeLabel,
    substanceAbuseHistoryDataLengthOfSobrietyMDMA: safeLabel,

    // PCP (reads .label without optional chaining).
    substanceAbuseHistoryDataAgeOfFirstUsePCP: "",
    substanceAbuseHistoryDataLastUsePCP: safeLabel,
    substanceAbuseHistoryDataFrequencyPCP: safeLabel,
    substanceAbuseHistoryDataLengthOfSobrietyPCP: safeLabel,

    // Prescription (reads .label without optional chaining).
    substanceAbuseHistoryDataAgeOfFirstUsePrescription: "",
    substanceAbuseHistoryDataLastUsePrescription: safeLabel,
    substanceAbuseHistoryDataFrequencyPrescription: safeLabel,
    substanceAbuseHistoryDataLengthOfSobrietyPrescription: safeLabel,

    // OTC.
    substanceAbuseHistoryDataAgeOfFirstUseOTC: "",
    substanceAbuseHistoryDataLastUseOTC: labelObj,
    substanceAbuseHistoryDataFrequencyOTC: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyOTC: labelObj,

    // Cocaine.
    substanceAbuseHistoryDataAgeOfFirstUseCocaine: "",
    substanceAbuseHistoryDataLastUseCocaine: labelObj,
    substanceAbuseHistoryDataFrequencyCocaine: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyCocaine: labelObj,

    // Hallucinogens.
    substanceAbuseHistoryDataAgeOfFirstUseHallucinogens: "",
    substanceAbuseHistoryDataLastUseHallucinogens: labelObj,
    substanceAbuseHistoryDataFrequencyHallucinogens: labelObj,
    substanceAbuseHistoryDataLengthOfSobrietyHallucinogens: labelObj,

    // Other / free entry.
    otherTypeOther: "",
    otherAgeOfFirstUse: "",
    otherLastUse: "",

    // Dynamic custom-substance rows.
    typeArray: [],

    ...overrides,
  };
}

describe("SubstanceAbuseSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the substance-abuse history and denies checkboxes with empty data", () => {
    mockForm.mockReturnValue(makeForm());
    render(<SubstanceAbuseSection />);

    // WHY: the two screening checkboxes are always present so a reviewer can see
    // whether substance abuse was disclosed or denied, even with no answers.
    expect(screen.getByText("Substance Abuse history")).toBeInTheDocument();
    expect(screen.getByText("Denies")).toBeInTheDocument();
    expect(
      document.getElementById("substanceAbuseHistory"),
    ).toBeInTheDocument();
    expect(document.getElementById("substanceAbuseDenies")).toBeInTheDocument();
  });

  it("should render the empty section without crashing on missing answers", () => {
    mockForm.mockReturnValue(makeForm());
    const { container } = render(<SubstanceAbuseSection />);

    // WHY: an intake that recorded no substance details must still render the
    // screening view safely — the fixed substance rows (e.g. Alcohol) appear as
    // blank-celled rows but the component must not throw on missing data.
    expect(screen.getByText("Alcohol")).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  it("should check the disclosed boxes for affirmative screening answers", () => {
    mockForm.mockReturnValue(
      makeForm({ substanceAbuseHistory: true, substanceAbuseDenies: false }),
    );
    render(<SubstanceAbuseSection />);

    // WHY: a true history flag must drive the checkbox checked so the printout
    // reflects that the patient disclosed a substance-abuse history.
    expect(document.getElementById("substanceAbuseHistory")).toBeChecked();
    expect(document.getElementById("substanceAbuseDenies")).not.toBeChecked();
  });

  it("should render the detail table with headers and a captured substance row", () => {
    mockForm.mockReturnValue(
      makeForm({
        substanceAbuseHistory: true,
        substanceAbuseHistoryDataAgeOfFirstUseAlcohol: "21",
        substanceAbuseHistoryDataLastUseAlcohol: { label: "2 weeks ago" },
        substanceAbuseHistoryDataFrequencyAlcohol: { label: "Daily" },
        substanceAbuseHistoryDataLengthOfSobrietyAlcohol: { label: "30 days" },
      }),
    );
    render(<SubstanceAbuseSection />);

    // WHY: once any use detail is recorded the matrix must surface with its
    // column headers so the alcohol-use answers are interpretable to clinicians.
    expect(screen.getByText("Age of First use")).toBeInTheDocument();
    expect(screen.getByText("Last Use")).toBeInTheDocument();
    expect(screen.getByText("Length of Sobriety")).toBeInTheDocument();
    expect(screen.getByText("Alcohol")).toBeInTheDocument();
    expect(screen.getByText("21")).toBeInTheDocument();
    expect(screen.getByText("2 weeks ago")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("30 days")).toBeInTheDocument();
  });

  it("should render dynamic custom substance rows from typeArray", () => {
    mockForm.mockReturnValue(
      makeForm({
        substanceAbuseHistory: true,
        // otherTypeOther satisfies the table's render condition.
        otherTypeOther: "Kratom",
        typeArray: [
          {
            types: "Kratom",
            ageOfFirstUse: "25",
            lastUse: "1 month ago",
            frequency: "Weekly",
            lengthOfSobriety: "10 days",
          },
        ],
      }),
    );
    render(<SubstanceAbuseSection />);

    // WHY: assessors can record substances beyond the fixed list; those custom
    // rows must appear in the matrix so the full use history is reviewable.
    expect(screen.getAllByText("Kratom").length).toBeGreaterThan(0);
    expect(screen.getByText("1 month ago")).toBeInTheDocument();
    expect(screen.getByText("Weekly")).toBeInTheDocument();
    expect(screen.getByText("10 days")).toBeInTheDocument();
  });
});

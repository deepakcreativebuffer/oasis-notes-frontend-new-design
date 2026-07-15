/** @format */

import React from "react";
import { render, screen } from "@/test-utils";
import ViewNursingAssessmentContentPart1 from "./ViewNursingAssessmentContentPart1";

// This is a read-only presentational "View*" section: it renders nursing
// assessment data passed via props. It has no service/IO imports, so no module
// mocks are needed. handlereviewOfSystemsCardiovascular is invoked during
// render (used in a className expression), so it must be a function.
const baseProps = {
  admissionDate: "",
  admissionDiagnoses: "",
  age: "",
  ahcccsId: "",
  allergies: "",
  careProvidedPhysicalServices: [],
  careProvidedPhysicalServicesHandler: () => {},
  codeStatus: [],
  dateOfBirth: "",
  handleCodeStatusChange: () => {},
  handlereviewOfSystemsCardiovascular: () => false,
  lastTBScreeningDate: "",
  residentName: "",
  reviewOfSystemsCardiovascular: [],
  reviewOfSystemsConstitutional: [],
  reviewOfSystemsEndocrine: [],
  reviewOfSystemsEndocrineOther: "",
  reviewOfSystemsGastrointestinal: [],
  reviewOfSystemsGenitourinary: [],
  reviewOfSystemsHeadNeckThroat: [],
  reviewOfSystemsIntegumentary: [],
  reviewOfSystemsMusculoskeletal: [],
  sex: "",
  tbScreeningResults: "",
  todayDate: "",
  vitalsBloodPressure: "",
  vitalsHeightFeet: "",
  vitalsOxygenLevel: "",
  vitalsPulse: "",
  vitalsRespiratoryRate: "",
  vitalsTemperature: "",
  vitalsWeight: "",
  setSex: () => {},
  setTbScreeningResults: () => {},
  reviewOfSystemsConstitutionalOther: "",
  reviewOfSystemsCardiovascularOther: "",
  reviewOfSystemsGastrointestinalOther: "",
  reviewOfSystemsGenitourinaryOther: "",
  reviewOfSystemsHematologyOncology: [],
  reviewOfSystemsHematologyOncologyOther: "",
  reviewOfSystemsHeadNeckThroatOther: "",
  reviewOfSystemsIntegumentaryOther: "",
  reviewOfSystemsMusculoskeletalOther: "",
};

const renderPart1 = (overrides = {}) =>
  render(<ViewNursingAssessmentContentPart1 {...baseProps} {...overrides} />);

describe("ViewNursingAssessmentContentPart1", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the static section labels with empty data", () => {
    renderPart1();
    // WHY: the assessment form always shows the fixed labels/sections even when
    // no answers are recorded yet, so the nurse knows what to fill in.
    expect(screen.getByText("Resident Name :")).toBeInTheDocument();
    expect(screen.getByText("Vitals")).toBeInTheDocument();
    expect(screen.getByText("Review Of Systems")).toBeInTheDocument();
    expect(screen.getByText("Constitutional :")).toBeInTheDocument();
  });

  it("should render the provided resident demographic and vitals data", () => {
    renderPart1({
      residentName: "Test Patient",
      ahcccsId: "MRN-TEST-001",
      age: "42",
      admissionDiagnoses: "Hypertension (continuing)",
      vitalsBloodPressure: "120/80",
      vitalsPulse: "72",
      allergies: "Penicillin",
    });
    // WHY: the view must surface the captured chart values so reviewers see the
    // actual recorded assessment, not just labels.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("MRN-TEST-001")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Hypertension (continuing)")).toBeInTheDocument();
    expect(screen.getByText("120/80")).toBeInTheDocument();
    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("Penicillin")).toBeInTheDocument();
  });

  it("should format date props to MM/DD/YYYY", () => {
    renderPart1({
      todayDate: "2026-06-10",
      admissionDate: "2026-01-15",
      dateOfBirth: "1984-03-22",
    });
    // WHY: dates are stored as ISO strings but the chart presents them in the
    // US MM/DD/YYYY format clinicians expect.
    expect(screen.getByText("06/10/2026")).toBeInTheDocument();
    expect(screen.getByText("01/15/2026")).toBeInTheDocument();
    expect(screen.getByText("03/22/1984")).toBeInTheDocument();
  });

  it("should reflect selected gender as a checked checkbox", () => {
    renderPart1({ sex: "Female" });
    // WHY: gender is rendered as read-only checkboxes; only the recorded value
    // should appear selected. react-bootstrap does not wire the label to the
    // input here, so locate the input via its sibling label text.
    const female = screen.getByText("Female").previousSibling;
    const male = screen.getByText("Male").previousSibling;
    expect(female).toBeChecked();
    expect(male).not.toBeChecked();
  });

  it("should reflect selected code status and TB results", () => {
    renderPart1({ codeStatus: ["DNR"], tbScreeningResults: "Positive" });
    // WHY: code status and TB screening results are clinically significant; the
    // view must show exactly what was recorded.
    expect(screen.getByText("DNR").previousSibling).toBeChecked();
    expect(screen.getByText("Full Code").previousSibling).not.toBeChecked();
    expect(screen.getByText("Positive").previousSibling).toBeChecked();
  });

  it("should render conditional review-of-systems sections only when data exists", () => {
    // WHY: optional ROS sections (Cardiovascular, Endocrine, etc.) are hidden
    // unless the assessment captured findings for them.
    renderPart1();
    expect(screen.queryByText("Cardiovascular :")).not.toBeInTheDocument();
    expect(screen.queryByText("Endocrine :")).not.toBeInTheDocument();
    expect(screen.queryByText("Musculoskeletal :")).not.toBeInTheDocument();
  });

  it("should render a review-of-systems section when its data is present", () => {
    renderPart1({
      reviewOfSystemsCardiovascular: ["Chest pain"],
      reviewOfSystemsCardiovascularOther: "Intermittent",
    });
    // WHY: when cardiovascular findings exist the section becomes visible and
    // shows the captured comment.
    expect(screen.getByText("Cardiovascular :")).toBeInTheDocument();
    expect(screen.getByText("Chest pain").previousSibling).toBeChecked();
    expect(screen.getByText("Intermittent")).toBeInTheDocument();
  });

  it("should render without crashing when array/string props are missing", () => {
    // WHY: server data may arrive partially; the read-only view must not crash
    // on undefined optional fields (uses optional chaining throughout).
    expect(() =>
      render(
        <ViewNursingAssessmentContentPart1
          codeStatus={[]}
          careProvidedPhysicalServices={[]}
          handlereviewOfSystemsCardiovascular={() => false}
        />,
      ),
    ).not.toThrow();
    expect(screen.getByText("Vitals")).toBeInTheDocument();
  });
});

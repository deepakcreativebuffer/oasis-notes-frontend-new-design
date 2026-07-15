/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import AssessmentForm from "./AssessmentForm";
import { buildPatientInformationProps } from "./PatientInformation/patientInformationProps";
import { buildMedicalConditionsProps } from "./MedicalHistory/medicalConditionsProps";
import { buildFamilyMentalHealthProps } from "./MedicalHistory/familyMentalHealthProps";
import { buildSubstanceAbuseProps } from "./MedicalHistory/substanceAbuseProps";

// AssessmentForm is a thin composition shell: it renders a NotificationCard and
// four extracted sections, feeding each the props derived from `scope` by a
// matching build*Props helper, then renders any children. We mock the child
// sections (to capture the props they actually receive) and the props builders
// (to control/observe what each section is fed) so the test asserts the wiring
// without depending on the heavy section internals or a real form context.

const h = vi.hoisted(() => ({
  // Each section records the props it was rendered with.
  notificationProps: [],
  patientProps: [],
  medicalProps: [],
  familyProps: [],
  substanceProps: [],
}));

vi.mock("./common/NotificationCard", () => ({
  default: (props) => {
    h.notificationProps.push(props);
    return <div data-testid="notification-card">notification</div>;
  },
}));
vi.mock("./PatientInformation/PatientInformationSection", () => ({
  default: (props) => {
    h.patientProps.push(props);
    return <div data-testid="patient-information">patient</div>;
  },
}));
vi.mock("./MedicalHistory/MedicalConditionsSection", () => ({
  default: (props) => {
    h.medicalProps.push(props);
    return <div data-testid="medical-conditions">medical</div>;
  },
}));
vi.mock("./MedicalHistory/FamilyMentalHealthSection", () => ({
  default: (props) => {
    h.familyProps.push(props);
    return <div data-testid="family-mental-health">family</div>;
  },
}));
vi.mock("./MedicalHistory/SubstanceAbuseSection", () => ({
  default: (props) => {
    h.substanceProps.push(props);
    return <div data-testid="substance-abuse">substance</div>;
  },
}));

// The build*Props helpers each pluck a subset of `scope` into the section props.
// We stub them to deterministic objects keyed off the received scope so we can
// assert (a) they are called with `scope`, and (b) their output reaches the
// matching section.
vi.mock("./PatientInformation/patientInformationProps", () => ({
  buildPatientInformationProps: vi.fn((scope) => ({ from: "patient", scope })),
}));
vi.mock("./MedicalHistory/medicalConditionsProps", () => ({
  buildMedicalConditionsProps: vi.fn((scope) => ({ from: "medical", scope })),
}));
vi.mock("./MedicalHistory/familyMentalHealthProps", () => ({
  buildFamilyMentalHealthProps: vi.fn((scope) => ({ from: "family", scope })),
}));
vi.mock("./MedicalHistory/substanceAbuseProps", () => ({
  buildSubstanceAbuseProps: vi.fn((scope) => ({ from: "substance", scope })),
}));

const baseScope = () => ({
  residentName: "Test Patient",
  residentId: "res-test-001",
  employeeId: "emp-test-001",
});

describe("AssessmentForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.notificationProps.length = 0;
    h.patientProps.length = 0;
    h.medicalProps.length = 0;
    h.familyProps.length = 0;
    h.substanceProps.length = 0;
  });

  it("should render the notification card and all four assessment sections", () => {
    renderWithProviders(
      <AssessmentForm scope={baseScope()} notificationProps={{}} />,
    );

    // WHY: the shell's contract is to compose exactly these pieces; missing any
    // one would drop a required part of the Initial Assessment.
    expect(screen.getByTestId("notification-card")).toBeInTheDocument();
    expect(screen.getByTestId("patient-information")).toBeInTheDocument();
    expect(screen.getByTestId("medical-conditions")).toBeInTheDocument();
    expect(screen.getByTestId("family-mental-health")).toBeInTheDocument();
    expect(screen.getByTestId("substance-abuse")).toBeInTheDocument();
  });

  it("should forward notificationProps verbatim to NotificationCard", () => {
    const notificationProps = {
      companyName: "Test Co",
      residentName: "Test Patient",
      hasNotified: true,
    };
    renderWithProviders(
      <AssessmentForm
        scope={baseScope()}
        notificationProps={notificationProps}
      />,
    );

    // WHY: AssessmentForm spreads notificationProps directly; the card must
    // receive them unchanged.
    expect(h.notificationProps[0]).toMatchObject(notificationProps);
  });

  it("should call each build*Props helper with the same scope and pass output to its section", () => {
    const scope = baseScope();
    renderWithProviders(
      <AssessmentForm scope={scope} notificationProps={{}} />,
    );

    // Each builder receives the shared scope object.
    expect(buildPatientInformationProps).toHaveBeenCalledWith(scope);
    expect(buildMedicalConditionsProps).toHaveBeenCalledWith(scope);
    expect(buildFamilyMentalHealthProps).toHaveBeenCalledWith(scope);
    expect(buildSubstanceAbuseProps).toHaveBeenCalledWith(scope);

    // And the built props are spread onto the matching section.
    expect(h.patientProps[0]).toMatchObject({ from: "patient", scope });
    expect(h.medicalProps[0]).toMatchObject({ from: "medical", scope });
    expect(h.familyProps[0]).toMatchObject({ from: "family", scope });
    expect(h.substanceProps[0]).toMatchObject({ from: "substance", scope });
  });

  it("should render children after the composed sections", () => {
    renderWithProviders(
      <AssessmentForm scope={baseScope()} notificationProps={{}}>
        <div data-testid="extra-child">remaining inline section</div>
      </AssessmentForm>,
    );

    // WHY: not-yet-extracted sections are still passed as children and must
    // continue to render.
    expect(screen.getByTestId("extra-child")).toBeInTheDocument();
  });

  it("should mount without children or notification fields without crashing", () => {
    // WHY: defensive — early/partial render passes empty notificationProps and
    // no children; the shell must not throw.
    expect(() =>
      renderWithProviders(
        <AssessmentForm scope={baseScope()} notificationProps={{}} />,
      ),
    ).not.toThrow();
    expect(screen.getByTestId("notification-card")).toBeInTheDocument();
  });
});

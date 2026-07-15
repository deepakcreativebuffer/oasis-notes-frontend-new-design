/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import NursingAssessmentFormContent from "./NursingAssessmentFormContent";

// WHY: AddSignature pulls Redux/date logic and renders null; stub so we can
// assert it received the show flag and exercise its setValue/setDate/setTime
// branching callbacks without the real implementation.
const utilsMock = vi.hoisted(() => ({
  lastAddSignatureProps: { current: null },
}));

vi.mock("@/utils/utils", () => ({
  __esModule: true,
  AddSignature: (props) => {
    utilsMock.lastAddSignatureProps.current = props;
    return <div data-testid="add-signature" data-show={String(!!props.show)} />;
  },
}));

// WHY: PatientComponent wraps a portal-based patient search; stub to a marker
// that surfaces the three setter props the parent wires through.
vi.mock("@/features/shared/ui/Search/PatientComponent", () => ({
  __esModule: true,
  default: ({ MainPatientId, MainResidentName, setWholeData }) => (
    <div data-testid="patient-component">
      <button
        type="button"
        data-testid="patient-pick"
        onClick={() => {
          MainPatientId?.("res-test-001");
          MainResidentName?.("Test Patient");
          setWholeData?.({ mrn: "MRN-TEST-001" });
        }}
      >
        pick
      </button>
    </div>
  ),
}));

// WHY: the two Part components are large form sections under their own tests;
// stub them to markers that echo a couple of forwarded props so we can verify
// the parent spreads {...props} into both.
vi.mock("./NursingAssessmentFormContentPart1", () => ({
  __esModule: true,
  default: (props) => <div data-testid="part1" data-name={props.name ?? ""} />,
}));
vi.mock("./NursingAssessmentFormContentPart2", () => ({
  __esModule: true,
  default: (props) => <div data-testid="part2" data-id={props.id ?? ""} />,
}));

const baseProps = (overrides = {}) => ({
  showSingInTwo: false,
  getApiData: { data: { employeeId: "emp-test-001" } },
  profileInfo: { _id: "emp-test-001", userType: "Employee" },
  url: "/nursing-assessment",
  setRnSignature: vi.fn(),
  editSignHandler: vi.fn(),
  setrnDate: vi.fn(),
  editDateHandler: vi.fn(),
  setRnTime: vi.fn(),
  editTimeHandler: vi.fn(),
  componentRef: { current: null },
  handlePost: vi.fn((e) => e?.preventDefault?.()),
  saveAsDrafIsNotEditable: false,
  saveAsDrafIsNotEditableWithoutSigner: false,
  isNotEditableWithSigner: false,
  id: null,
  setName: vi.fn(),
  name: "",
  setPatientId: vi.fn(),
  setResidentName: vi.fn(),
  setPatientDetail: vi.fn(),
  navigate: vi.fn(),
  ...overrides,
});

describe("NursingAssessmentFormContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    utilsMock.lastAddSignatureProps.current = null;
  });

  it("should render the title bar, AddSignature, and both form parts", () => {
    renderWithProviders(<NursingAssessmentFormContent {...baseProps()} />);

    expect(
      screen.getAllByText("Nursing Assessment").length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId("add-signature")).toBeInTheDocument();
    expect(screen.getByTestId("part1")).toBeInTheDocument();
    expect(screen.getByTestId("part2")).toBeInTheDocument();
  });

  it("should render PatientComponent (not the resident-name input) when no id is present", () => {
    renderWithProviders(
      <NursingAssessmentFormContent {...baseProps({ id: null })} />,
    );

    expect(screen.getByTestId("patient-component")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Enter name")).not.toBeInTheDocument();
  });

  it("should render the resident-name input (not PatientComponent) when an id is present", () => {
    renderWithProviders(
      <NursingAssessmentFormContent
        {...baseProps({ id: "res-test-001", name: "Test Patient" })}
      />,
    );

    const input = screen.getByPlaceholderText("Enter name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Test Patient");
    expect(screen.queryByTestId("patient-component")).not.toBeInTheDocument();
  });

  it("should forward patient selections from PatientComponent to the parent setters", () => {
    const props = baseProps({ id: null });
    renderWithProviders(<NursingAssessmentFormContent {...props} />);

    fireEvent.click(screen.getByTestId("patient-pick"));

    expect(props.setPatientId).toHaveBeenCalledWith("res-test-001");
    expect(props.setResidentName).toHaveBeenCalledWith("Test Patient");
    expect(props.setPatientDetail).toHaveBeenCalledWith({
      mrn: "MRN-TEST-001",
    });
  });

  it("should call setName when typing in the resident-name input", () => {
    const props = baseProps({ id: "res-test-001", name: "" });
    renderWithProviders(<NursingAssessmentFormContent {...props} />);

    fireEvent.change(screen.getByPlaceholderText("Enter name"), {
      target: { value: "New Name" },
    });
    expect(props.setName).toHaveBeenCalledWith("New Name");
  });

  it("should navigate back when the back button image is clicked", () => {
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContent {...props} />);

    const backImg = document.querySelector("img.arrow");
    expect(backImg).toBeTruthy();
    fireEvent.click(backImg);
    expect(props.navigate).toHaveBeenCalledWith(-1);
  });

  it("should call handlePost when the form is submitted", () => {
    const props = baseProps();
    const { container } = renderWithProviders(
      <NursingAssessmentFormContent {...props} />,
    );

    const form = container.querySelector("form");
    fireEvent.submit(form);
    expect(props.handlePost).toHaveBeenCalled();
  });

  it("should add the pe-none class when a not-editable flag is set", () => {
    const { container } = renderWithProviders(
      <NursingAssessmentFormContent
        {...baseProps({ isNotEditableWithSigner: true })}
      />,
    );
    expect(container.querySelector("form.pe-none")).toBeTruthy();
  });

  it("should not add the pe-none class when the form is editable", () => {
    const { container } = renderWithProviders(
      <NursingAssessmentFormContent {...baseProps()} />,
    );
    expect(container.querySelector("form.pe-none")).toBeNull();
  });

  it("should forward showSingInTwo to AddSignature", () => {
    renderWithProviders(
      <NursingAssessmentFormContent {...baseProps({ showSingInTwo: true })} />,
    );
    expect(screen.getByTestId("add-signature")).toHaveAttribute(
      "data-show",
      "true",
    );
  });

  it("should route signature setters to the RN setters when the current employee owns the record", () => {
    // getApiData.data.employeeId === profileInfo._id => RN-owner branch.
    const props = baseProps();
    renderWithProviders(<NursingAssessmentFormContent {...props} />);

    const { setValue, setDate, setTime } =
      utilsMock.lastAddSignatureProps.current;
    setValue("sig");
    setDate("2026-06-10");
    setTime("10:00");

    expect(props.setRnSignature).toHaveBeenCalledWith("sig");
    expect(props.setrnDate).toHaveBeenCalledWith("2026-06-10");
    expect(props.setRnTime).toHaveBeenCalledWith("10:00");
    expect(props.editSignHandler).not.toHaveBeenCalled();
  });

  it("should route signature setters to the edit handlers when a different employee owns the record", () => {
    // employeeId differs from profile and url branch fails => edit-handler branch.
    const props = baseProps({
      getApiData: { data: { employeeId: "emp-other-999" } },
      profileInfo: { _id: "emp-test-001", userType: "Employee" },
    });
    renderWithProviders(<NursingAssessmentFormContent {...props} />);

    const { setValue, setDate, setTime } =
      utilsMock.lastAddSignatureProps.current;
    setValue("sig");
    setDate("2026-06-10");
    setTime("10:00");

    expect(props.editSignHandler).toHaveBeenCalledWith("sig");
    expect(props.editDateHandler).toHaveBeenCalledWith("2026-06-10");
    expect(props.editTimeHandler).toHaveBeenCalledWith("10:00");
    expect(props.setRnSignature).not.toHaveBeenCalled();
  });

  it("should pass forwarded props through to both Part sections", () => {
    renderWithProviders(
      <NursingAssessmentFormContent
        {...baseProps({ id: "res-test-001", name: "Test Patient" })}
      />,
    );
    expect(screen.getByTestId("part1")).toHaveAttribute(
      "data-name",
      "Test Patient",
    );
    expect(screen.getByTestId("part2")).toHaveAttribute(
      "data-id",
      "res-test-001",
    );
  });
});

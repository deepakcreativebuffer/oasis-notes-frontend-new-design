/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import ViewNursingAssessmentContent from "./ViewNursingAssessmentContent";

// This is a read-only "View*" composition component: it lays out a print
// container and delegates the actual answer rendering to Part1/Part2. We mock
// the heavy children and IO-ish helpers so the test isolates THIS component's
// own composition + prop forwarding + the draft-modal branch.

vi.mock("@/utils/utils", () => ({
  // AddSignature does redux/date work; stub to a marker that echoes `show`.
  AddSignature: ({ show }) => (
    <div data-testid="add-signature">{show ? "sig-shown" : "sig-hidden"}</div>
  ),
}));

vi.mock("@/utils/NavWrapper", () => ({
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

vi.mock("@/features/resident/components/Modal/Draftinmodel", () => ({
  default: ({ onClose }) => (
    <button type="button" data-testid="draft-modal" onClick={onClose}>
      draft-modal
    </button>
  ),
}));

// The two part components receive the full props bag; we only need to assert
// they mount and that a representative forwarded prop reaches them.
vi.mock("./ViewNursingAssessmentContentPart1", () => ({
  default: (props) => (
    <div data-testid="part1">part1:{props.residentName ?? ""}</div>
  ),
}));

vi.mock("./ViewNursingAssessmentContentPart2", () => ({
  default: (props) => (
    <div data-testid="part2">part2:{props.codeStatus ?? ""}</div>
  ),
}));

const baseProps = (overrides = {}) => ({
  printRef: { current: null },
  componentRef: { current: null },
  showSignatureResident: false,
  setSignerSignature: vi.fn(),
  setSignerDate: vi.fn(),
  setSignerTime: vi.fn(),
  draftModel: false,
  setDraftModel: vi.fn(),
  residentName: "Test Patient",
  codeStatus: "Full Code",
  ...overrides,
});

describe("ViewNursingAssessmentContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the nursing-assessment title and both content parts", () => {
    renderWithProviders(<ViewNursingAssessmentContent {...baseProps()} />);

    // WHY: the header must identify this read-only clinical record so staff
    // know which assessment they are viewing.
    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Nursing Assessment",
    );
    // WHY: there is a hidden print-only heading rendered for the PDF export.
    expect(
      screen.getByText("Nursing Assessment", { selector: "h1" }),
    ).toBeInTheDocument();

    // Both answer sections compose into the view.
    expect(screen.getByTestId("part1")).toBeInTheDocument();
    expect(screen.getByTestId("part2")).toBeInTheDocument();
  });

  it("should forward props down to both part sections", () => {
    renderWithProviders(<ViewNursingAssessmentContent {...baseProps()} />);

    // WHY: this component spreads {...props} to each part; if forwarding
    // breaks, the answers would render blank for the patient.
    expect(screen.getByTestId("part1")).toHaveTextContent("part1:Test Patient");
    expect(screen.getByTestId("part2")).toHaveTextContent("part2:Full Code");
  });

  it("should render without crashing when answer props are missing/empty", () => {
    // Hydration race / new assessment: most fields undefined.
    renderWithProviders(
      <ViewNursingAssessmentContent
        printRef={{ current: null }}
        componentRef={{ current: null }}
        setSignerSignature={vi.fn()}
        setSignerDate={vi.fn()}
        setSignerTime={vi.fn()}
        setDraftModel={vi.fn()}
      />,
    );

    expect(screen.getByTestId("part1")).toBeInTheDocument();
    expect(screen.getByTestId("part2")).toBeInTheDocument();
  });

  it("should reflect the resident signature-capture visibility flag", () => {
    const { rerender } = renderWithProviders(
      <ViewNursingAssessmentContent
        {...baseProps({ showSignatureResident: false })}
      />,
    );
    expect(screen.getByTestId("add-signature")).toHaveTextContent("sig-hidden");

    rerender(
      <ViewNursingAssessmentContent
        {...baseProps({ showSignatureResident: true })}
      />,
    );
    // WHY: AddSignature only captures the signer when shown; the flag gates
    // when a resident signature prompt is active.
    expect(screen.getByTestId("add-signature")).toHaveTextContent("sig-shown");
  });

  it("should not render the draft modal by default", () => {
    renderWithProviders(<ViewNursingAssessmentContent {...baseProps()} />);

    expect(screen.queryByTestId("draft-modal")).not.toBeInTheDocument();
  });

  it("should render the draft modal and close it via setDraftModel(false)", async () => {
    const user = userEvent.setup();
    const setDraftModel = vi.fn();
    renderWithProviders(
      <ViewNursingAssessmentContent
        {...baseProps({ draftModel: true, setDraftModel })}
      />,
    );

    const modal = screen.getByTestId("draft-modal");
    expect(modal).toBeInTheDocument();

    await user.click(modal);
    // WHY: closing the "saved as draft" confirmation must clear the flag so it
    // does not persistently block the view.
    expect(setDraftModel).toHaveBeenCalledWith(false);
  });
});

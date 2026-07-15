/** @format */

import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import SignatureConflictDialog from "./SignatureConflictDialog";

const baseProps = () => ({
  show: true,
  onHide: vi.fn(),
  onConfirm: vi.fn(),
  existingMethod: "pen",
  roleLabel: "Admin Signature",
});

describe("SignatureConflictDialog", () => {
  it("should render nothing when not shown", () => {
    const { container } = render(
      <SignatureConflictDialog {...baseProps()} show={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the conflict message with the role label", () => {
    render(<SignatureConflictDialog {...baseProps()} />);
    expect(
      screen.getByText(/only one signature method allowed/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Admin Signature")).toBeInTheDocument();
  });

  it("should call onConfirm when Clear & Continue is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    render(<SignatureConflictDialog {...props} />);
    await user.click(screen.getByRole("button", { name: /clear & continue/i }));
    // WHY: confirming clears the existing signature so the user can switch
    // methods — a deliberate, explicit action.
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onHide from Cancel and the close button", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    render(<SignatureConflictDialog {...props} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(props.onHide).toHaveBeenCalledTimes(2);
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import DeleteConfirmationModal from "./DeleteConfirmationModel";

const baseProps = () => ({
  show: true,
  handleClose: vi.fn(),
  handleConfirm: vi.fn(),
  type: "message",
});

describe("DeleteConfirmationModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the confirmation dialog with title and danger action when shown", () => {
    renderWithProviders(<DeleteConfirmationModal {...baseProps()} />);

    // WHY: clinicians must see an explicit confirm-delete prompt before any chat
    // content is removed.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should interpolate the entity type into the confirmation message", () => {
    renderWithProviders(
      <DeleteConfirmationModal {...baseProps()} type="conversation" />,
    );

    // WHY: the prompt must name what is being deleted so the user knows the scope
    // (a single message vs an entire conversation).
    expect(
      screen.getByText("Are you sure you want to delete this conversation?"),
    ).toBeInTheDocument();
  });

  it("should not render the dialog content when show is false", () => {
    renderWithProviders(
      <DeleteConfirmationModal {...baseProps()} show={false} />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Confirm Delete")).not.toBeInTheDocument();
  });

  it("should invoke handleConfirm when Delete is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<DeleteConfirmationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    // WHY: confirming should trigger the destructive action exactly once.
    expect(props.handleConfirm).toHaveBeenCalledTimes(1);
    expect(props.handleClose).not.toHaveBeenCalled();
  });

  it("should invoke handleClose when Cancel is clicked without confirming", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<DeleteConfirmationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    // WHY: cancelling must dismiss the modal and never delete.
    expect(props.handleClose).toHaveBeenCalledTimes(1);
    expect(props.handleConfirm).not.toHaveBeenCalled();
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import Draftinmodel from "./Draftinmodel";

describe("Draftinmodel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the draft-saved message", () => {
    renderWithProviders(<Draftinmodel onClose={vi.fn()} />);
    expect(screen.getByText(/saved and edit later on/i)).toBeInTheDocument();
  });

  it("should call onClose when the overlay is clicked", () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <Draftinmodel onClose={onClose} />,
    );

    fireEvent.click(container.querySelector(".modal-overlay-sing"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when the inner content is clicked", () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <Draftinmodel onClose={onClose} />,
    );

    // WHY: inner content stops propagation so clicks inside the modal don't close it.
    fireEvent.click(container.querySelector(".modal-content-sing"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should call onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <Draftinmodel onClose={onClose} />,
    );

    await user.click(container.querySelector(".close-btn-sing"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

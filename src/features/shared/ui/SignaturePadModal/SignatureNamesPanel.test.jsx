/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";
import SignatureNamesPanel from "./SignatureNamesPanel";

const employeeState = {
  auth: {
    isAuthenticated: true,
    userProfile: { _id: "emp-1", userType: "Employee" },
    unreadMessages: 0,
    unreadNotifications: 0,
  },
};

describe("SignatureNamesPanel", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render nothing without signatures or an update handler", () => {
    const { container } = renderWithProviders(
      <SignatureNamesPanel signatures={null} onUpdate={vi.fn()} />,
      { preloadedState: employeeState },
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the Witness print-name input", () => {
    renderWithProviders(
      <SignatureNamesPanel signatures={{ witness: {} }} onUpdate={vi.fn()} />,
      { preloadedState: employeeState },
    );
    expect(screen.getByText(/witness name/i)).toBeInTheDocument();
  });

  it("should show the existing typed name from signatures", () => {
    renderWithProviders(
      <SignatureNamesPanel
        signatures={{ witness: { name: "Test Witness" } }}
        onUpdate={vi.fn()}
      />,
      { preloadedState: employeeState },
    );
    expect(screen.getByRole("textbox")).toHaveValue("Test Witness");
  });

  it("should call onUpdate with the role and typed name on change", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    renderWithProviders(
      <SignatureNamesPanel signatures={{ witness: {} }} onUpdate={onUpdate} />,
      { preloadedState: employeeState },
    );

    await user.type(screen.getByRole("textbox"), "T");
    // WHY: panel print-name edits propagate up keyed by signer role so the
    // attestation record stays in sync.
    expect(onUpdate).toHaveBeenCalledWith("witness", { name: "T" });
  });
});

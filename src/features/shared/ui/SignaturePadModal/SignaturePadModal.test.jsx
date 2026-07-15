/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import SignaturePadModal from "./SignaturePadModal";

// react-signature-canvas draws on a real <canvas>; jsdom has no 2d context and
// no drawing surface. Stub it with a forwardRef component that exposes the same
// imperative API the modal calls (clear / isEmpty / getCanvas().toDataURL) and a
// test-only button to drive onEnd so we can flip the "empty" gate.
let mockIsEmpty = true;
const toDataURL = vi.fn(() => "data:image/png;base64,TESTSIG");
const clearSpy = vi.fn(() => {
  mockIsEmpty = true;
});

vi.mock("react-signature-canvas", () => ({
  default: React.forwardRef(({ onEnd }, ref) => {
    React.useImperativeHandle(ref, () => ({
      clear: clearSpy,
      isEmpty: () => mockIsEmpty,
      getCanvas: () => ({ toDataURL }),
    }));
    return (
      <button
        type="button"
        aria-label="draw-signature"
        onClick={() => {
          // Simulate the user drawing a stroke, then notifying the parent.
          mockIsEmpty = false;
          onEnd && onEnd();
        }}
      />
    );
  }),
}));

const ADMIN_PROFILE = {
  firstName: "Test",
  lastName: "Admin",
  position: "Nurse",
  userType: "Admin",
  hoursFormat: "12",
};

const stateWith = (userProfile) => ({
  auth: {
    isAuthenticated: true,
    userProfile,
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

const baseProps = () => ({
  show: true,
  onHide: vi.fn(),
  setValue: vi.fn(),
  setDate: vi.fn(),
  setTime: vi.fn(),
  setRawSignatureImage: vi.fn(),
});

describe("SignaturePadModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsEmpty = true;
  });

  it("should render nothing when show is false", () => {
    const { container } = renderWithProviders(
      <SignaturePadModal {...baseProps()} show={false} />,
      { preloadedState: stateWith(ADMIN_PROFILE) },
    );
    // WHY: a hidden signature pad must not capture or display PHI signer info.
    expect(container).toBeEmptyDOMElement();
  });

  it("should render the pad title and action buttons when shown", () => {
    renderWithProviders(<SignaturePadModal {...baseProps()} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });
    expect(screen.getByText("Sign with Pen")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign Form" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("should display the logged-in admin signer line when no override is given", () => {
    renderWithProviders(<SignaturePadModal {...baseProps()} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });
    // WHY: admins sign as "<name> Admin" so the audit trail shows the signer's
    // authority, not their job title.
    expect(screen.getByText("Test Admin Admin")).toBeInTheDocument();
  });

  it("should display the non-admin signer line using their position", () => {
    renderWithProviders(<SignaturePadModal {...baseProps()} />, {
      preloadedState: stateWith({
        firstName: "Test",
        lastName: "Patient",
        position: "Aide",
        userType: "Employee",
        hoursFormat: "12",
      }),
    });
    expect(screen.getByText("Test Patient Aide")).toBeInTheDocument();
  });

  it("should prefer an explicit signerNameOverride for the displayed name", () => {
    renderWithProviders(
      <SignaturePadModal {...baseProps()} signerNameOverride="Test Patient" />,
      { preloadedState: stateWith(ADMIN_PROFILE) },
    );
    // WHY: resident/guardian signatures must show the resident's name, not the
    // logged-in employee operating the device.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.queryByText("Test Admin Admin")).not.toBeInTheDocument();
  });

  it("should fall back to the logged-in user when the override is the 'undefined undefined' garbage string", () => {
    renderWithProviders(
      <SignaturePadModal
        {...baseProps()}
        signerNameOverride="undefined undefined"
      />,
      { preloadedState: stateWith(ADMIN_PROFILE) },
    );
    // WHY: a malformed/unloaded resident name must never render literally as
    // "undefined undefined" on a signed clinical form.
    expect(screen.getByText("Test Admin Admin")).toBeInTheDocument();
  });

  it("should disable Sign Form until a stroke is drawn", () => {
    renderWithProviders(<SignaturePadModal {...baseProps()} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });
    // WHY: an empty canvas must not produce a legally-binding signature.
    expect(screen.getByRole("button", { name: "Sign Form" })).toBeDisabled();
  });

  it("should enable Sign Form after the user draws on the canvas", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignaturePadModal {...baseProps()} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });

    await user.click(screen.getByLabelText("draw-signature"));

    expect(
      screen.getByRole("button", { name: "Sign Form" }),
    ).not.toBeDisabled();
  });

  it("should clear the canvas and re-disable Sign Form when Clear is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignaturePadModal {...baseProps()} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });

    await user.click(screen.getByLabelText("draw-signature"));
    await user.click(screen.getByRole("button", { name: "Clear" }));

    // WHY: clearing must reset the pad so a stale stroke can't be submitted.
    expect(clearSpy).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Sign Form" })).toBeDisabled();
  });

  it("should commit the signature image, name, date and time then close on Sign Form", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<SignaturePadModal {...props} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });

    await user.click(screen.getByLabelText("draw-signature"));
    await user.click(screen.getByRole("button", { name: "Sign Form" }));

    // WHY: signing must persist the captured PNG plus the signer identity and
    // timestamp so the form record is auditable.
    expect(props.setRawSignatureImage).toHaveBeenCalledWith(
      "data:image/png;base64,TESTSIG",
    );
    expect(props.setValue).toHaveBeenCalledWith("Test Admin Admin");
    expect(props.setDate).toHaveBeenCalledWith(expect.any(Date));
    expect(props.setTime).toHaveBeenCalledWith(expect.any(String));
    expect(props.onHide).toHaveBeenCalled();
  });

  it("should save the literal override name when one is provided", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(
      <SignaturePadModal {...props} signerNameOverride="Test Patient" />,
      { preloadedState: stateWith(ADMIN_PROFILE) },
    );

    await user.click(screen.getByLabelText("draw-signature"));
    await user.click(screen.getByRole("button", { name: "Sign Form" }));

    // WHY: the saved name must come from the form's Print Name field, not the
    // logged-in employee, so resident/witness signatures attribute correctly.
    expect(props.setValue).toHaveBeenCalledWith("Test Patient");
  });

  it("should save an empty name (not the logged-in user) when the override is the garbage string", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(
      <SignaturePadModal {...props} signerNameOverride="undefined undefined" />,
      { preloadedState: stateWith(ADMIN_PROFILE) },
    );

    await user.click(screen.getByLabelText("draw-signature"));
    await user.click(screen.getByRole("button", { name: "Sign Form" }));

    // WHY: per client request, a missing Print Name must save empty so submit
    // gates can detect it — it must NOT auto-populate from the logged-in user.
    expect(props.setValue).toHaveBeenCalledWith("");
  });

  it("should not commit a signature when Sign Form is triggered on an empty pad", () => {
    const props = baseProps();
    renderWithProviders(<SignaturePadModal {...props} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });

    // Force-click despite the disabled attribute to exercise the guard clause.
    fireEvent.click(screen.getByRole("button", { name: "Sign Form" }));

    // WHY: the handler must bail on an empty canvas so no blank signature is
    // saved even if the disabled gate is bypassed.
    expect(props.setRawSignatureImage).not.toHaveBeenCalled();
    expect(props.onHide).not.toHaveBeenCalled();
  });

  it("should close without saving when the Close button is clicked", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<SignaturePadModal {...props} />, {
      preloadedState: stateWith(ADMIN_PROFILE),
    });

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(props.onHide).toHaveBeenCalled();
    expect(props.setValue).not.toHaveBeenCalled();
  });

  it("should close when the backdrop overlay itself is clicked", () => {
    const props = baseProps();
    const { container } = renderWithProviders(
      <SignaturePadModal {...props} />,
      { preloadedState: stateWith(ADMIN_PROFILE) },
    );

    fireEvent.click(container.querySelector(".sig-pad-overlay"));

    // WHY: clicking the dimmed backdrop is a dismiss gesture, mirroring native
    // modal behaviour, and must not save a signature.
    expect(props.onHide).toHaveBeenCalled();
    expect(props.setValue).not.toHaveBeenCalled();
  });
});

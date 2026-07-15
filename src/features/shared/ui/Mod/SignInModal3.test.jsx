/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";
import { selectSecondarySignatureDraft } from "@/store/signatureDraftSlice";

import SignInModal3 from "./SignInModal3";

const baseProps = () => ({
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onHide: vi.fn(),
  singin: "",
});

describe("SignInModal3", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the unsigned prompt and a sign-here input when no signature is provided", () => {
    renderWithProviders(<SignInModal3 {...baseProps()} />);

    // WHY: with no existing signature the clinician sees the generic
    // "Digitally Signed By" prompt inviting them to sign.
    expect(screen.getByText("Digitally Signed By")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sign Here...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("should pre-fill and echo an existing signature passed via singin prop", () => {
    renderWithProviders(<SignInModal3 {...baseProps()} singin="Test_Nurse" />);

    // WHY: when re-opening on a previously-signed entry, the existing signer
    // name is shown back to confirm who signed.
    expect(
      screen.getByText("Digitally Signed by Test_Nurse"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sign Here...")).toHaveValue(
      "Test_Nurse",
    );
  });

  it("should replace whitespace in typed input with underscores", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignInModal3 {...baseProps()} />);

    const input = screen.getByPlaceholderText("Sign Here...");
    await user.type(input, "Test Patient");

    // WHY: signature strings must be whitespace-free so they serialize safely
    // into the staffLabel/signedData fields downstream.
    expect(input).toHaveValue("Test_Patient");
  });

  it("should persist the secondary signature draft and hide the modal on Submit", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    const { store } = renderWithProviders(
      <SignInModal3 {...props} singin="Test_Nurse" />,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));

    // WHY: submitting commits the signer + timestamp into the secondary
    // signature slot so the parent form can attach the co-signature.
    const draft = selectSecondarySignatureDraft(store.getState());
    expect(draft.signedData).toBe("Test_Nurse");
    expect(draft.staffLabel).toContain("Test_Nurse");
    // WHY: the date stamp (MM-DD-YYYY) is captured into signedDate so the
    // co-signature carries the legally-required signing date.
    expect(draft.signedDate).toMatch(/\d{2}-\d{2}-\d{4}/);

    // WHY: the modal must close itself via onHide after capturing the signature.
    expect(props.onHide).toHaveBeenCalledTimes(1);
  });

  it("should hide its own root element after a successful submit", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    const { container } = renderWithProviders(
      <SignInModal3 {...props} singin="Test_Nurse" />,
    );

    const root = container.firstChild;
    expect(root).toHaveClass("block");

    await user.click(screen.getByRole("button", { name: "Submit" }));

    // WHY: closeModal flips the wrapper to hidden so a stale signature pad does
    // not linger over the chart after signing.
    expect(root).toHaveClass("hidden");
  });
});

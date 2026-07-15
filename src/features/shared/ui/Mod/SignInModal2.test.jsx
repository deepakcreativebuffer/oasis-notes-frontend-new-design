/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor, fireEvent } from "@/test-utils";

import SingInUpdateModel2 from "./SignInModal2";
import { getAdminProfile } from "../../services";
import { logger } from "@/utils";

// MOCK the services barrel the component imports from "../../services" so no
// real HTTP fires when the profile prefill effect runs.
vi.mock("../../services", () => ({
  getAdminProfile: vi.fn(),
}));
// MOCK the logger so the catch branch does not write to console under test.
vi.mock("@/utils", () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

const baseProps = () => ({
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onHide: vi.fn(),
  singin: "",
});

describe("SignInModal2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no profile resolved, so the field starts from the `singin` prop.
    getAdminProfile.mockResolvedValue({ success: false });
  });

  it("should render the sign-in field and default unsigned label when no signature is present", async () => {
    renderWithProviders(<SingInUpdateModel2 {...baseProps()} />);

    // WHY: without an existing signature the clinician sees the empty
    // "Digitally Signed By" prompt before they attest.
    expect(screen.getByText("Digitally Signed By")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sign Here...")).toBeInTheDocument();
  });

  it("should prefill the signature field from the singin prop", async () => {
    renderWithProviders(
      <SingInUpdateModel2 {...baseProps()} singin="Test Patient" />,
    );

    // WHY: an existing attestation must be shown so the signer reviews who the
    // chart was already signed by.
    expect(
      screen.getByText(/Digitally Signed by Test Patient/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sign Here...")).toHaveValue(
      "Test Patient",
    );
  });

  it("should fetch the admin profile to prefill the signer on mount", async () => {
    getAdminProfile.mockResolvedValue({
      success: true,
      data: { position: "RN", firstName: "Test", lastName: "Signer" },
    });

    renderWithProviders(<SingInUpdateModel2 {...baseProps()} />);

    // WHY: the modal looks up the logged-in clinician's profile on open so the
    // attestation can be auto-attributed to the signing staff member.
    await waitFor(() => expect(getAdminProfile).toHaveBeenCalledTimes(1));
  });

  it("should log an error and keep the field empty when getAdminProfile fails", async () => {
    getAdminProfile.mockResolvedValue({ success: false });

    renderWithProviders(<SingInUpdateModel2 {...baseProps()} />);

    // WHY: a failed profile lookup must not crash the attestation modal — it
    // logs and lets the user type their signature manually.
    await waitFor(() => expect(logger.error).toHaveBeenCalled());
    expect(screen.getByPlaceholderText("Sign Here...")).toHaveValue("");
  });

  it("should replace whitespace with underscores as the user types", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SingInUpdateModel2 {...baseProps()} />);

    const input = screen.getByPlaceholderText("Sign Here...");
    await user.type(input, "Test Signer");

    // WHY: signatures are stored as a single underscore-joined token, so spaces
    // are normalized to underscores on entry.
    expect(input).toHaveValue("Test_Signer");
  });

  it("should persist the signature draft to the store and call onHide on Submit", async () => {
    const props = baseProps();
    const { store } = renderWithProviders(
      <SingInUpdateModel2 {...props} singin="Test_Signer" />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    // WHY: submitting writes the primary signature draft (signer + date/time)
    // into redux so downstream forms can attach the attestation.
    const draft = store.getState().signatureDraft.primary;
    expect(draft.signedData).toBe("Test_Signer");
    expect(draft.signedDate).toMatch(/^\d{2}-\d{2}-\d{4}$/);
    expect(draft.staffLabel).toContain("Test_Signer");
    expect(props.onHide).toHaveBeenCalledTimes(1);
  });

  it("should render the current date in MM-DD-YYYY format", () => {
    renderWithProviders(<SingInUpdateModel2 {...baseProps()} />);

    // WHY: the attestation timestamp must show the date the signature is applied.
    expect(screen.getByText(/Date:\s*\d{2}-\d{2}-\d{4}/)).toBeInTheDocument();
  });
});

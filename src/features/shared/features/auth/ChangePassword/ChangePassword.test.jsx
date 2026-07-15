/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import ChangePassword from "./ChangePassword";
import { setPassword } from "@/features/shared/services/index";
import { showNotification } from "@/utils";

// Mock the auth service so no real password-reset HTTP is issued.
vi.mock("@/features/shared/services/index", () => ({
  setPassword: vi.fn(),
}));
// Mock the notification utility used for inline validation + result feedback.
vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

const VALID_PASSWORD = "Aa1@test!";

const typeBoth = async (user, newPw, confirmPw) => {
  const newInput = document.getElementById("newPassword");
  const confirmInput = document.getElementById("confirmPassword");
  if (newPw) await user.type(newInput, newPw);
  if (confirmPw) await user.type(confirmInput, confirmPw);
  return { newInput, confirmInput };
};

describe("ChangePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default URL has no token; individual tests override window.location.search.
    window.history.pushState({}, "", "/");
  });

  it("should render the change-password form heading and submit button", () => {
    renderWithProviders(<ChangePassword />);
    expect(
      screen.getByRole("heading", { name: /change password/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change password/i }),
    ).toBeInTheDocument();
  });

  it("should render both password fields masked by default", () => {
    renderWithProviders(<ChangePassword />);
    const newInput = document.getElementById("newPassword");
    const confirmInput = document.getElementById("confirmPassword");
    // WHY: credentials must be masked on load so a shoulder-surfer cannot read a
    // new password being set on a clinician/patient account.
    expect(newInput).toHaveAttribute("type", "password");
    expect(confirmInput).toHaveAttribute("type", "password");
  });

  it("should toggle the new-password field visibility when the eye icon is clicked", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<ChangePassword />);
    const newInput = document.getElementById("newPassword");
    // The visibility toggle is the clickable div immediately following the input.
    const toggle = container.querySelector(
      ".form-group-change-password .cursor-pointer",
    );
    await user.click(toggle);
    expect(newInput).toHaveAttribute("type", "text");
    await user.click(toggle);
    expect(newInput).toHaveAttribute("type", "password");
  });

  it("should not call setPassword when fields are empty (required-field guard)", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePassword />);
    await user.click(screen.getByRole("button", { name: /change password/i }));

    // WHY: both inputs are `required`, so an empty submit is blocked by native
    // validation before any reset API call can be made.
    expect(setPassword).not.toHaveBeenCalled();
  });

  it("should warn when fields contain only whitespace", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePassword />);
    // Whitespace satisfies the native `required` check (non-empty value) but the
    // handler trims and treats it as empty.
    await typeBoth(user, "   ", "   ");
    await user.click(screen.getByRole("button", { name: /change password/i }));

    expect(setPassword).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      message: "Password fields cannot be empty",
      type: "danger",
    });
  });

  it("should warn when the two passwords do not match", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePassword />);
    await typeBoth(user, VALID_PASSWORD, "Different1@");
    await user.click(screen.getByRole("button", { name: /change password/i }));

    // WHY: mismatched confirmation must block the reset to avoid locking a user
    // out with a password they did not intend.
    expect(setPassword).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      message: "Confirm password does not match the password",
      type: "danger",
    });
  });

  it("should warn on a weak password that fails the complexity policy", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePassword />);
    // Matching but too weak (no uppercase/number/special, too short).
    await typeBoth(user, "weak", "weak");
    await user.click(screen.getByRole("button", { name: /change password/i }));

    // WHY: complexity policy must be enforced client-side before submitting.
    expect(setPassword).not.toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalled();
  });

  it("should call setPassword with the URL token and notify on success", async () => {
    setPassword.mockResolvedValue({
      success: true,
      message: "Password updated",
    });
    window.history.pushState({}, "", "/?token=tok-test-001");

    const user = userEvent.setup();
    renderWithProviders(<ChangePassword />, { route: "/?token=tok-test-001" });
    await typeBoth(user, VALID_PASSWORD, VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => expect(setPassword).toHaveBeenCalledTimes(1));
    // WHY: the reset token from the email link must be forwarded with the new
    // password so the backend can authorize the change.
    expect(setPassword).toHaveBeenCalledWith({
      token: "tok-test-001",
      password: VALID_PASSWORD,
      confirm_password: VALID_PASSWORD,
    });
    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith({
        message: "Password updated",
        type: "success",
      }),
    );
  });

  it("should surface a danger notification when the reset request fails", async () => {
    setPassword.mockResolvedValue({ success: false, message: "Token expired" });
    window.history.pushState({}, "", "/?token=tok-test-001");

    const user = userEvent.setup();
    renderWithProviders(<ChangePassword />, { route: "/?token=tok-test-001" });
    await typeBoth(user, VALID_PASSWORD, VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: /change password/i }));

    await waitFor(() => expect(setPassword).toHaveBeenCalledTimes(1));
    // WHY: a rejected/expired token must be reported, not silently swallowed.
    await waitFor(() =>
      expect(showNotification).toHaveBeenCalledWith({
        message: "Token expired",
        type: "danger",
      }),
    );
  });
});

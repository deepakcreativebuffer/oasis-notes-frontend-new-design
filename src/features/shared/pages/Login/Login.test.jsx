/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";

import Login from "./Login";
import { GenerateOtp } from "../../services";
import { showNotification } from "@/utils";
import { ROUTES } from "../../constants";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (orig) => ({
  ...(await orig()),
  useNavigate: () => mockNavigate,
}));
vi.mock("../../services", () => ({
  GenerateOtp: vi.fn(),
  LoginUser: vi.fn(),
  requestPasswordReset: vi.fn(),
  verifyForgotPasswordOtp: vi.fn(),
}));
vi.mock("@/utils", () => ({ showNotification: vi.fn() }));
vi.mock("./Carousel", () => ({ default: () => <div>carousel</div> }));

describe("Login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the email, password, and login controls", () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("should reject an empty submission with a validation toast", () => {
    const { container } = renderWithProviders(<Login />);
    // Submit directly to bypass jsdom's HTML5 required-field gating.
    fireEvent.submit(container.querySelector("form"));

    // WHY: missing credentials must surface a clear error rather than firing a
    // bogus auth request.
    expect(showNotification).toHaveBeenCalledWith({
      message: "Username and Passwords fields cannot be empty",
      type: "danger",
    });
    expect(GenerateOtp).not.toHaveBeenCalled();
  });

  it("should request an OTP with the normalized credentials on submit", async () => {
    const user = userEvent.setup();
    GenerateOtp.mockResolvedValue({ success: true, message: "OTP sent" });
    const { container } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText("Enter email"), "TEST@x.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret1");
    fireEvent.submit(container.querySelector("form"));

    // WHY: email is lowercased/trimmed before auth so logins are case-insensitive.
    expect(GenerateOtp).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          email: "test@x.com",
          password: "secret1",
        }),
      }),
    );
  });

  it("should route an admin to the dashboard on a successful login", async () => {
    const user = userEvent.setup();
    GenerateOtp.mockResolvedValue({
      success: true,
      message: "Login successful.",
      data: { userType: "Admin" },
    });
    const { container } = renderWithProviders(<Login />);

    await user.type(screen.getByPlaceholderText("Enter email"), "admin@x.com");
    await user.type(screen.getByPlaceholderText("Password"), "secret1");
    fireEvent.submit(container.querySelector("form"));

    await vi.waitFor(() =>
      // WHY: role determines the landing surface — admins go to the admin dashboard.
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.DASHBOARD),
    );
  });

  it("should switch to the forgot-password form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    await user.click(screen.getByText(/forgot your password/i));
    expect(
      screen.getByText(/email you a link to reset your password/i),
    ).toBeInTheDocument();
  });
});

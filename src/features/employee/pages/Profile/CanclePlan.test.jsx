/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import CanclePlan from "./CanclePlan";

const mocks = vi.hoisted(() => ({
  requestSubscriptionStatusChange: vi.fn(),
  confirmSubscriptionStatus: vi.fn(),
  showNotification: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@/features/shared/services", () => ({
  profileService: {
    requestSubscriptionStatusChange: mocks.requestSubscriptionStatusChange,
    confirmSubscriptionStatus: mocks.confirmSubscriptionStatus,
  },
}));

vi.mock("@/utils", () => ({
  showNotification: mocks.showNotification,
  logger: { error: mocks.loggerError },
}));

const baseProps = (overrides = {}) => ({
  show: true,
  onHide: vi.fn(),
  ...overrides,
});

describe("CanclePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requests an OTP / status change when shown", () => {
    renderWithProviders(<CanclePlan {...baseProps()} />);
    // WHY: opening the modal kicks off the OTP request on mount.
    expect(mocks.requestSubscriptionStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ showAlert: true }),
    );
  });

  it("renders the cancel-plan heading and button by default", () => {
    renderWithProviders(<CanclePlan {...baseProps()} />);
    expect(screen.getByText(/Confirm To Cancel Plan/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirm Cancel Plan/i }),
    ).toBeInTheDocument();
  });

  it("renders the resume-plan copy when planCheck is true", () => {
    renderWithProviders(<CanclePlan {...baseProps({ planCheck: true })} />);
    expect(screen.getByText(/Confirm To Resume Plan/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirm Resume Plan/i }),
    ).toBeInTheDocument();
  });

  it("only accepts numeric OTP input", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CanclePlan {...baseProps()} />);
    const input = screen.getByPlaceholderText("Enter OTP");

    await user.type(input, "12a3");
    // WHY: the onChange guard rejects any value that is not all digits.
    expect(input).toHaveValue("123");
  });

  it("warns and skips submit when OTP is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CanclePlan {...baseProps()} />);

    await user.click(
      screen.getByRole("button", { name: /Confirm Cancel Plan/i }),
    );

    expect(mocks.showNotification).toHaveBeenCalledWith({
      message: "Please enter the OTP.",
      type: "danger",
    });
    expect(mocks.confirmSubscriptionStatus).not.toHaveBeenCalled();
  });

  it("confirms the status and hides on a successful submit", async () => {
    const user = userEvent.setup();
    mocks.confirmSubscriptionStatus.mockResolvedValue({ success: true });
    const props = baseProps();
    renderWithProviders(<CanclePlan {...props} />);

    await user.type(screen.getByPlaceholderText("Enter OTP"), "1234");
    await user.click(
      screen.getByRole("button", { name: /Confirm Cancel Plan/i }),
    );

    await waitFor(() =>
      expect(mocks.confirmSubscriptionStatus).toHaveBeenCalledWith(
        { otp: "1234" },
        expect.objectContaining({
          successMsg: "The plan you subscribed has been canceled",
        }),
      ),
    );
    await waitFor(() => expect(props.onHide).toHaveBeenCalled());
  });

  it("notifies and logs when confirm fails", async () => {
    const user = userEvent.setup();
    mocks.confirmSubscriptionStatus.mockRejectedValue({
      response: { data: { message: "Bad OTP" } },
    });
    renderWithProviders(<CanclePlan {...baseProps()} />);

    await user.type(screen.getByPlaceholderText("Enter OTP"), "9999");
    await user.click(
      screen.getByRole("button", { name: /Confirm Cancel Plan/i }),
    );

    await waitFor(() =>
      expect(mocks.showNotification).toHaveBeenCalledWith({
        message: "Bad OTP",
        type: "danger",
      }),
    );
    expect(mocks.loggerError).toHaveBeenCalled();
  });

  it("resends the OTP and notifies on success", async () => {
    const user = userEvent.setup();
    mocks.requestSubscriptionStatusChange.mockResolvedValue(undefined);
    renderWithProviders(<CanclePlan {...baseProps()} />);

    await user.click(screen.getByRole("button", { name: /Resend OTP/i }));

    await waitFor(() =>
      expect(mocks.showNotification).toHaveBeenCalledWith({
        message: "OTP resent successfully.",
        type: "success",
      }),
    );
  });
});

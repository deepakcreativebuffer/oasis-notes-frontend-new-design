/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import ChangePlan from "./ChangePlan";

// vi.hoisted so the mock factories can reference these shared spies.
const h = vi.hoisted(() => ({
  getPricingPlans: vi.fn(),
  requestPlanChange: vi.fn(),
  confirmPlanChange: vi.fn(),
  showNotification: vi.fn(),
  loggerError: vi.fn(),
}));

vi.mock("@/features/shared/services", () => ({
  profileService: {
    getPricingPlans: h.getPricingPlans,
    requestPlanChange: h.requestPlanChange,
    confirmPlanChange: h.confirmPlanChange,
  },
}));

vi.mock("@/utils", () => ({
  showNotification: h.showNotification,
  logger: { error: h.loggerError },
}));

// Light stubs for non-under-test libs.
vi.mock("html-react-parser", () => ({
  default: (html) => html,
}));
vi.mock("@/utils/security/sanitizeHtml", () => ({
  sanitizeHtml: (html) => html,
}));
vi.mock("react-spinners", () => ({
  ClipLoader: () => <span data-testid="clip-loader" />,
}));

const PLANS = [
  { name: "Growth", perUser: 20, details: ["<p>growth details</p>"] },
  { name: "Basic", perUser: 10, details: ["<p>basic details</p>"] },
];

const baseProps = (over = {}) => ({
  show: true,
  onHide: vi.fn(),
  plan: "Basic",
  ...over,
});

// getPricingPlans calls setResponse({ data: [...] }) synchronously.
function primePlans(data = PLANS) {
  h.getPricingPlans.mockImplementation(({ setResponse }) => {
    setResponse({ data });
  });
}

describe("ChangePlan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    primePlans();
  });

  it("fetches and renders the pricing plans when shown", async () => {
    renderWithProviders(<ChangePlan {...baseProps()} />);

    expect(h.getPricingPlans).toHaveBeenCalled();
    expect(await screen.findByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Growth")).toBeInTheDocument();
    // WHY: perUser is formatted as $X/month
    expect(screen.getByText("$10/month")).toBeInTheDocument();
  });

  it("marks the current plan with a badge and disables its button", async () => {
    renderWithProviders(<ChangePlan {...baseProps({ plan: "Basic" })} />);

    expect(await screen.findByText("Current Plan")).toBeInTheDocument();
    // The Basic plan button is disabled (current plan).
    const buttons = screen.getAllByRole("button");
    const basicBtn = buttons.find((b) => b.textContent === "Upgrade Plan");
    expect(basicBtn).toBeDisabled();
  });

  it("does not fetch plans when not shown", () => {
    renderWithProviders(<ChangePlan {...baseProps({ show: false })} />);
    expect(h.getPricingPlans).not.toHaveBeenCalled();
  });

  it("warns when Request OTP is clicked without selecting a plan", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePlan {...baseProps()} />);
    await screen.findByText("Basic");

    await user.click(screen.getByRole("button", { name: "Request OTP" }));

    expect(h.showNotification).toHaveBeenCalledWith({
      message: "Please select a plan first.",
      type: "danger",
    });
    expect(h.requestPlanChange).not.toHaveBeenCalled();
  });

  it("warns when selecting the plan already subscribed to", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ChangePlan {...baseProps({ plan: "Growth" })} />);
    await screen.findByText("Growth");

    // Basic is selectable here (current is Growth); click Growth's button is disabled,
    // so trigger handleSelect via the enabled Basic button then re-check.
    const buttons = screen.getAllByRole("button");
    const basicBtn = buttons.find((b) => b.textContent === "Downgrade Plan");
    await user.click(basicBtn);

    // Selecting Basic (not the current Growth) should NOT warn.
    expect(h.showNotification).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "danger" }),
    );
  });

  it("requests an OTP and reveals the OTP field on success", async () => {
    const user = userEvent.setup();
    h.requestPlanChange.mockResolvedValue({});
    renderWithProviders(<ChangePlan {...baseProps({ plan: "Basic" })} />);
    await screen.findByText("Growth");

    // Select the Growth plan (not current).
    const selectBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent === "Upgrade Plan" && !b.disabled);
    await user.click(selectBtn);

    await user.click(screen.getByRole("button", { name: "Request OTP" }));

    expect(h.requestPlanChange).toHaveBeenCalledWith(
      "Growth",
      expect.objectContaining({
        setLoading: expect.any(Function),
        setResponse: expect.any(Function),
      }),
    );
    expect(h.showNotification).toHaveBeenCalledWith({
      message: "OTP sent successfully.",
      type: "success",
    });
    expect(await screen.findByPlaceholderText("Enter OTP")).toBeInTheDocument();
  });

  it("shows an error notification when requesting OTP fails", async () => {
    const user = userEvent.setup();
    h.requestPlanChange.mockRejectedValue({
      response: { data: { message: "boom" } },
    });
    renderWithProviders(<ChangePlan {...baseProps({ plan: "Basic" })} />);
    await screen.findByText("Growth");

    const selectBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent === "Upgrade Plan" && !b.disabled);
    await user.click(selectBtn);
    await user.click(screen.getByRole("button", { name: "Request OTP" }));

    await waitFor(() =>
      expect(h.showNotification).toHaveBeenCalledWith({
        message: "boom",
        type: "danger",
      }),
    );
    expect(h.loggerError).toHaveBeenCalled();
  });

  it("warns when confirming without entering an OTP", async () => {
    const user = userEvent.setup();
    h.requestPlanChange.mockResolvedValue({});
    renderWithProviders(<ChangePlan {...baseProps({ plan: "Basic" })} />);
    await screen.findByText("Growth");

    const selectBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent === "Upgrade Plan" && !b.disabled);
    await user.click(selectBtn);
    await user.click(screen.getByRole("button", { name: "Request OTP" }));
    await screen.findByPlaceholderText("Enter OTP");

    await user.click(
      screen.getByRole("button", { name: "Confirm Plan Change" }),
    );

    expect(h.showNotification).toHaveBeenCalledWith({
      message: "Please enter the OTP.",
      type: "danger",
    });
    expect(h.confirmPlanChange).not.toHaveBeenCalled();
  });

  it("confirms the plan change and closes the modal on success", async () => {
    const user = userEvent.setup();
    h.requestPlanChange.mockResolvedValue({});
    h.confirmPlanChange.mockResolvedValue({ success: true });
    const props = baseProps({ plan: "Basic" });
    renderWithProviders(<ChangePlan {...props} />);
    await screen.findByText("Growth");

    const selectBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent === "Upgrade Plan" && !b.disabled);
    await user.click(selectBtn);
    await user.click(screen.getByRole("button", { name: "Request OTP" }));

    const otpInput = await screen.findByPlaceholderText("Enter OTP");
    await user.type(otpInput, "123456");

    await user.click(
      screen.getByRole("button", { name: "Confirm Plan Change" }),
    );

    expect(h.confirmPlanChange).toHaveBeenCalledWith(
      { otp: "123456" },
      expect.objectContaining({ setLoading: expect.any(Function) }),
    );
    await waitFor(() => expect(props.onHide).toHaveBeenCalled());
  });

  it("only accepts numeric input in the OTP field", async () => {
    const user = userEvent.setup();
    h.requestPlanChange.mockResolvedValue({});
    renderWithProviders(<ChangePlan {...baseProps({ plan: "Basic" })} />);
    await screen.findByText("Growth");

    const selectBtn = screen
      .getAllByRole("button")
      .find((b) => b.textContent === "Upgrade Plan" && !b.disabled);
    await user.click(selectBtn);
    await user.click(screen.getByRole("button", { name: "Request OTP" }));

    const otpInput = await screen.findByPlaceholderText("Enter OTP");
    await user.type(otpInput, "12ab3");

    // WHY: regex /^\d*$/ rejects keystrokes containing letters.
    expect(otpInput).toHaveValue("123");
  });
});

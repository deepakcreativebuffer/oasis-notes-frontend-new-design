/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import NotificationCard from "./NotificationCard";

const baseProps = () => ({
  companyName: "Test Company",
  residentName: "Test Patient",
  getApiData: { data: { residentName: "Api Patient" } },
  assessmentOn: "",
  setAssessmentOn: vi.fn(),
  hasNotified: true,
});

describe("NotificationCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // WHY: jsdom has no real canvas 2d context; AutoSize calls getContext to
    // measure text width, so stub it to avoid a crash on render.
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      font: "",
      measureText: () => ({ width: 50 }),
    }));
  });

  it("should render the company name and the notification sentence", () => {
    renderWithProviders(<NotificationCard {...baseProps()} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("has notified")).toBeInTheDocument();
    // WHY: the static body text confirms the assessment notification copy.
    expect(
      screen.getByText(/Service Behavioral Health Treatment/i),
    ).toBeInTheDocument();
  });

  it("should prefer the explicit residentName prop over the API value", () => {
    renderWithProviders(<NotificationCard {...baseProps()} />);

    // WHY: residentName prop takes priority over getApiData.data.residentName.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.queryByText("Api Patient")).not.toBeInTheDocument();
  });

  it("should fall back to the API residentName when the prop is empty", () => {
    const props = { ...baseProps(), residentName: "" };
    renderWithProviders(<NotificationCard {...props} />);

    expect(screen.getByText("Api Patient")).toBeInTheDocument();
  });

  it("should render the placeholder underscores when no resident name is available", () => {
    const props = { ...baseProps(), residentName: "", getApiData: undefined };
    renderWithProviders(<NotificationCard {...props} />);

    expect(screen.getByText("__________")).toBeInTheDocument();
  });

  it("should call setAssessmentOn when the assessment date input changes", async () => {
    const user = userEvent.setup();
    const props = baseProps();
    renderWithProviders(<NotificationCard {...props} />);

    const input = screen.getByPlaceholderText("_______________");
    await user.type(input, "X");

    // WHY: the AutoSize input is wired to setAssessmentOn via its onChange.
    expect(props.setAssessmentOn).toHaveBeenCalled();
  });

  it("should render without crashing when optional props are missing", () => {
    expect(() =>
      renderWithProviders(
        <NotificationCard
          companyName="Test Company"
          setAssessmentOn={vi.fn()}
        />,
      ),
    ).not.toThrow();
    expect(screen.getByText("Test Company")).toBeInTheDocument();
  });
});

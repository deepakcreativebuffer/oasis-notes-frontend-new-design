/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import ProgressChartResident from "./ProgressChartResident";

// Asset barrels resolve to stub strings so <img src> never tries a real import.
const { assetProxy } = vi.hoisted(() => ({
  assetProxy: new Proxy(
    { __esModule: true },
    { get: (t, p) => (p in t ? t[p] : "stub"), has: () => true },
  ),
}));
vi.mock("@/assets", () => assetProxy);
vi.mock("@/assets/index", () => assetProxy);

// HOC wraps the page in Navbar/Sidebar/layout — render the inner component only.
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

const renderChart = (userProfile = {}) =>
  renderWithProviders(<ProgressChartResident />, {
    preloadedState: {
      auth: {
        isAuthenticated: true,
        userProfile: {
          _id: "res-test-001",
          userType: "Patient",
          ...userProfile,
        },
        unreadMessages: 0,
        unreadNotifications: 0,
      },
    },
  });

describe("ProgressChartResident", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the Progress Chart heading", () => {
    renderChart();
    expect(screen.getByText("Progress Chart")).toBeInTheDocument();
  });

  it("should render all twelve chart entries as links", () => {
    renderChart();
    // WHY: the static patient_chart array drives 12 fixed sections.
    expect(screen.getAllByRole("link")).toHaveLength(12);
    expect(screen.getByText("Discharge")).toBeInTheDocument();
    expect(
      screen.getByText("Medication Administration Record"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Re-Certification of Need (RON)"),
    ).toBeInTheDocument();
  });

  it("should point each entry at its resident route", () => {
    renderChart();
    const marsLink = screen
      .getByText("Medication Administration Record")
      .closest("a");
    expect(marsLink).toHaveAttribute("href", "/mars-resident");
  });

  it("should disable every entry when the profile has no view permissions", () => {
    renderChart({ userPermissions: { view: "" } });
    const links = screen.getAllByRole("link");
    // WHY: missing permission strings make isDisabled true for all sections.
    expect(links.every((l) => l.getAttribute("aria-disabled") === "true")).toBe(
      true,
    );
    expect(links.every((l) => l.className.includes("disabled-link"))).toBe(
      true,
    );
  });

  it("should enable an entry whose permission token is granted", () => {
    renderChart({ userPermissions: { view: "pmars:psn" } });
    const marsLink = screen
      .getByText("Medication Administration Record")
      .closest("a");
    // WHY: "pmars" present in the colon-delimited view string un-disables MARS.
    expect(marsLink).toHaveAttribute("aria-disabled", "false");
    expect(marsLink.className).not.toContain("disabled-link");

    const dischargeLink = screen.getByText("Discharge").closest("a");
    expect(dischargeLink).toHaveAttribute("aria-disabled", "true");
  });
});

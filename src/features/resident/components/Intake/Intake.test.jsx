/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import Intake from "./Intake";

// HOC pulls in Navbar/Sidebar (heavy layout). Render the wrapped component directly.
vi.mock("@/features/shared/layout/Outer/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// Asset barrel -> harmless string stubs so <img src> resolves.
vi.mock("@/assets", () => ({
  __esModule: true,
  intake1: "intake1.png",
  intake2: "intake2.png",
  intake3: "intake3.png",
  intake4: "intake4.png",
  intake5: "intake5.png",
  intake6: "intake6.png",
}));

const seedProfile = (userPermissions) => ({
  preloadedState: {
    auth: {
      isAuthenticated: true,
      userProfile: {
        _id: "res-test-001",
        userType: "Patient",
        userPermissions,
      },
      unreadMessages: 0,
      unreadNotifications: 0,
    },
  },
});

const ALL_LABELS = [
  "Initial Assessment",
  "Nursing Assessment",
  "Behavioral Health Treatment Plan",
  "Face Sheet",
  "Safety Plan",
  "Resident Intakes",
];

describe("Intake", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the Intake heading and all six intake cards", () => {
    renderWithProviders(<Intake />, seedProfile({ view: "" }));

    expect(screen.getByText("Intake")).toBeInTheDocument();
    ALL_LABELS.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("should point each card at its corresponding route", () => {
    renderWithProviders(<Intake />, seedProfile({ view: "" }));

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        "/initial-Assessment-resident-list",
        "/nursing-assessment-resident-list",
        "/treatment-plan-resident-list",
        "/faceSheet-resident-list",
        "/safety-plan-resident-list",
        "/resident-intake-resident-list",
      ]),
    );
  });

  it("should disable every card when the user has no view permissions", () => {
    renderWithProviders(<Intake />, seedProfile({ view: "" }));

    const links = screen.getAllByRole("link");
    // WHY: no permission tokens -> isDisabled true for all -> aria-disabled + disabled-link
    links.forEach((link) => {
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link.className).toContain("disabled-link");
      expect(link).toHaveAttribute("tabindex", "-1");
    });
  });

  it("should enable a card whose permission token is present in the view string", () => {
    // "pia" enables Initial Assessment; the rest stay disabled.
    renderWithProviders(<Intake />, seedProfile({ view: "pia:pna" }));

    const initialLink = screen.getByText("Initial Assessment").closest("a");
    const faceSheetLink = screen.getByText("Face Sheet").closest("a");

    // WHY: pia present -> enabled (no disabled-link, focusable)
    expect(initialLink).toHaveAttribute("aria-disabled", "false");
    expect(initialLink.className).not.toContain("disabled-link");
    expect(initialLink).toHaveAttribute("tabindex", "0");

    // WHY: pfs absent -> Face Sheet remains disabled
    expect(faceSheetLink).toHaveAttribute("aria-disabled", "true");
    expect(faceSheetLink.className).toContain("disabled-link");
  });

  it("should not crash when userPermissions is missing (optional chaining)", () => {
    renderWithProviders(<Intake />, seedProfile(undefined));

    // All cards still render, all disabled since view is undefined.
    expect(screen.getByText("Intake")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(6);
    links.forEach((link) =>
      expect(link).toHaveAttribute("aria-disabled", "true"),
    );
  });
});

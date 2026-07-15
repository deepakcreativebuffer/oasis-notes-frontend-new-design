/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import ScheduleGroup from "./ScheduleGroup";

// Mock the layout HOC: it pulls in sidebars/navbar we don't want to render.
// Render the wrapped component directly so we test ScheduleGroup in isolation.
vi.mock("@/features/shared/layout/EmployeeBar/HOC", () => ({
  __esModule: true,
  default: ({ Wcomponenet }) => Wcomponenet,
}));

// NavWrapper renders InnerSidebars + bootstrap chrome; stub to a marker.
vi.mock("@/utils/NavWrapper", () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="nav-wrapper">{title}</div>,
}));

// Asset barrel is imported broadly (incl. constants/imageConstants); return a
// Proxy so any named asset resolves to a stub string.
vi.mock(
  "@/assets/index",
  () =>
    new Proxy(
      { __esModule: true },
      { get: (t, p) => (p in t ? t[p] : `${String(p)}-stub`), has: () => true },
    ),
);

const renderWithProfile = (userProfile) =>
  renderWithProviders(<ScheduleGroup />, {
    preloadedState: { auth: { userProfile } },
  });

describe("ScheduleGroup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the NavWrapper title and both chart links", () => {
    renderWithProfile({ userType: "Admin", accountType: "adminstrator" });

    expect(screen.getByTestId("nav-wrapper")).toHaveTextContent(
      "Time Sheet / Staff Schedule",
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    // WHY: "Staff Schedule"/"Time Sheet" appear both in the nav title and link
    // labels, so assert at least one match each.
    expect(screen.getAllByText(/Staff Schedule/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Time Sheet/).length).toBeGreaterThan(0);
  });

  it("points links at the schedule and time-sheet routes", () => {
    renderWithProfile({ userType: "Admin", accountType: "adminstrator" });

    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/schedule");
    expect(hrefs).toContain("/time-sheet");
  });

  it("enables both links for an Admin regardless of permissions", () => {
    renderWithProfile({ userType: "Admin", accountType: "regular" });

    // WHY: isAdmin short-circuits the permission check, so neither link is disabled.
    const links = screen.getAllByRole("link");
    links.forEach((l) => expect(l).not.toHaveClass("disabled-link"));
  });

  it("disables links for a regular employee lacking the permission key", () => {
    renderWithProfile({
      userType: "Employee",
      accountType: "regular",
      userPermissions: { view: "somethingelse:other" },
    });

    // WHY: regular employee without staffsch/timesheet in view perms -> disabled.
    const links = screen.getAllByRole("link");
    links.forEach((l) => expect(l).toHaveClass("disabled-link"));
  });

  it("enables only the permitted link for a regular employee", () => {
    renderWithProfile({
      userType: "Employee",
      accountType: "regular",
      userPermissions: { view: "staffsch:other" },
    });

    const scheduleLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/schedule");
    const timeSheetLink = screen
      .getAllByRole("link")
      .find((l) => l.getAttribute("href") === "/time-sheet");

    expect(scheduleLink).not.toHaveClass("disabled-link");
    expect(timeSheetLink).toHaveClass("disabled-link");
  });

  it("enables both links for an administrator employee", () => {
    renderWithProfile({
      userType: "Employee",
      accountType: "adminstrator",
    });

    // WHY: isAdministratorEmployee enables all links irrespective of view perms.
    const links = screen.getAllByRole("link");
    links.forEach((l) => expect(l).not.toHaveClass("disabled-link"));
  });

  it("renders resiliently when the user profile is empty", () => {
    renderWithProfile({});

    // No userType/accountType/permissions -> links present but disabled.
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((l) => expect(l).toHaveClass("disabled-link"));
  });
});

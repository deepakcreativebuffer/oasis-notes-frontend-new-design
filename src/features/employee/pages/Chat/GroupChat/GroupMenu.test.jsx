/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderWithProviders, screen, fireEvent } from "@/test-utils";
import GroupMenu from "./GroupMenu";

// Mock the shared services barrel — GroupMenu uses getObjectUrlFromDownloadUrl
// to resolve a chat avatar download URL into a viewable object URL. We stub it
// so no real network/storage lookup happens and we can assert it's used.
const mocks = vi.hoisted(() => ({
  getObjectUrlFromDownloadUrl: vi.fn((url) => `resolved:${url}`),
}));

vi.mock("@/features/shared/services", () => ({
  getObjectUrlFromDownloadUrl: mocks.getObjectUrlFromDownloadUrl,
}));

// @/assets/index is an asset barrel with many exports; return a Proxy so any
// referenced export (defaultUserImg, etc.) resolves to a harmless stub string.
vi.mock(
  "@/assets/index",
  () =>
    new Proxy(
      { __esModule: true },
      {
        get: (t, p) => (p in t ? t[p] : "default-user-stub.png"),
        has: () => true,
      },
    ),
);

const colors = [
  { bg: "blue", color: "white" },
  { bg: "green", color: "black" },
];

// Fake PHI only.
const collections = [
  { id: "grp-test-001", data: { title: "Test Group A", image: "dl-url-a" } },
  { id: "grp-test-002", data: { title: "Test Group B" } },
];

describe("GroupMenu", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders a clickable entry per group collection", () => {
    renderWithProviders(
      <GroupMenu collections={collections} colors={colors} />,
    );

    // WHY: each chat group must surface in the nav so staff can switch
    // between resident/care-team conversations.
    expect(screen.getByText("Test Group A")).toBeInTheDocument();
    expect(screen.getByText("Test Group B")).toBeInTheDocument();
  });

  it("resolves a download URL into an object URL when a group has an image", () => {
    const { container } = renderWithProviders(
      <GroupMenu collections={collections} colors={colors} />,
    );

    // WHY: avatars are stored as download URLs and must be converted before
    // rendering, otherwise the <img> would point at a non-viewable URL.
    // (alt="" makes the imgs presentational, so query by tag, not role.)
    expect(mocks.getObjectUrlFromDownloadUrl).toHaveBeenCalledWith("dl-url-a");
    const imgs = Array.from(container.querySelectorAll("img"));
    expect(
      imgs.some((img) => img.getAttribute("src") === "resolved:dl-url-a"),
    ).toBe(true);
  });

  it("falls back to a default avatar when a group has no image", () => {
    const { container } = renderWithProviders(
      <GroupMenu collections={collections} colors={colors} />,
    );

    // Group B has no data.image, so it must not call the resolver and instead
    // use the default user image stub.
    expect(mocks.getObjectUrlFromDownloadUrl).not.toHaveBeenCalledWith(
      undefined,
    );
    const imgs = Array.from(container.querySelectorAll("img"));
    // Two groups => two avatar images.
    expect(imgs).toHaveLength(2);
    expect(
      imgs.some((img) => img.getAttribute("src") === "default-user-stub.png"),
    ).toBe(true);
  });

  it("dispatches setDocumentID with the group id when an entry is clicked", () => {
    const { store } = renderWithProviders(
      <GroupMenu collections={collections} colors={colors} />,
    );

    fireEvent.click(screen.getByText("Test Group A"));

    // WHY: selecting a group sets the active document id in chat state, which
    // drives which conversation thread the rest of the UI loads.
    expect(store.getState().chat.id).toBe("grp-test-001");
  });

  it("applies per-index color classes cycling through the colors array", () => {
    renderWithProviders(
      <GroupMenu collections={collections} colors={colors} />,
    );

    const first = screen.getByText("Test Group A").closest("span");
    const second = screen.getByText("Test Group B").closest("span");
    expect(first.className).toContain("bg-blue");
    expect(first.className).toContain("text-white");
    expect(second.className).toContain("bg-green");
    expect(second.className).toContain("text-black");
  });

  it("renders nothing for the nav when collections is undefined (no crash)", () => {
    const { container } = renderWithProviders(
      <GroupMenu collections={undefined} colors={colors} />,
    );

    // WHY: chat menus may mount before group data has loaded; optional chaining
    // must keep the menu from throwing on a null/undefined collection.
    expect(container.querySelector("nav.menu-list")).toBeInTheDocument();
    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});

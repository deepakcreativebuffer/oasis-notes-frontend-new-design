/** @format */

import { describe, it, expect, vi } from "vitest";

import * as notificationsApi from "./notifications.api";

vi.mock("../../baseApi", () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe("notifications.api exports", () => {
  it("exposes its notification helpers as functions", () => {
    expect(notificationsApi.getNotifications).toBeTypeOf("function");
    expect(notificationsApi.markNotificationRead).toBeTypeOf("function");
  });
});

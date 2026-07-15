/** @format */

import { describe, it, expect } from "vitest";
import { adminNotificationsService } from "./notifications.service";

describe("adminNotificationsService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminNotificationsService).toBeTypeOf("object");
    expect(adminNotificationsService).not.toBeNull();
    const values = Object.values(adminNotificationsService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

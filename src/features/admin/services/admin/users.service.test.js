/** @format */

import { describe, it, expect } from "vitest";
import { adminUsersService } from "./users.service";

describe("adminUsersService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminUsersService).toBeTypeOf("object");
    expect(adminUsersService).not.toBeNull();
    const values = Object.values(adminUsersService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

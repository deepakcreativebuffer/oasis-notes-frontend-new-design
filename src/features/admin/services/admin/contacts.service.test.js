/** @format */

import { describe, it, expect } from "vitest";
import { adminContactsService } from "./contacts.service";

describe("adminContactsService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(adminContactsService).toBeTypeOf("object");
    expect(adminContactsService).not.toBeNull();
    const values = Object.values(adminContactsService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

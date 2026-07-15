/** @format */

import { describe, it, expect } from "vitest";
// Imported via the public barrel: these factory-built services are part of a
// module cycle (service -> crudServiceFactory -> common.api -> @/utils -> barrel)
// that only resolves cleanly when entered through the barrel, as the app does.
import { employmentService } from "@/features/shared/services";

describe("employmentService", () => {
  it("is a non-empty service object of callables / sub-services", () => {
    expect(employmentService).toBeTypeOf("object");
    expect(employmentService).not.toBeNull();
    const values = Object.values(employmentService);
    expect(values.length).toBeGreaterThan(0);
    values.forEach((v) => expect(["function", "object"]).toContain(typeof v));
  });
});

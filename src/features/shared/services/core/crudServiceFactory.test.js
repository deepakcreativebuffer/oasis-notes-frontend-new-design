/** @format */

import { describe, it, expect } from "vitest";
// Via the barrel: the factory is part of the services module cycle.
import { createDomainService } from "@/features/shared/services";

describe("createDomainService", () => {
  it("is a factory function", () => {
    expect(createDomainService).toBeTypeOf("function");
  });

  it("builds a service exposing the standard CRUD methods", () => {
    const svc = createDomainService("Widget", {
      list: () => "/widgets",
      getById: (id) => `/widgets/${id}`,
    });
    for (const m of ["list", "getById", "create", "update", "remove"]) {
      expect(svc[m], m).toBeTypeOf("function");
    }
  });
});

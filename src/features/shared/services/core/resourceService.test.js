/** @format */

import { describe, it, expect } from "vitest";
// Via the barrel: the factory is part of the services module cycle.
import { defineResourceService } from "@/features/shared/services";

describe("defineResourceService", () => {
  it("is a factory function", () => {
    expect(defineResourceService).toBeTypeOf("function");
  });

  it("only defines methods for the endpoints provided", () => {
    const svc = defineResourceService("Thing", {
      list: () => "/things",
    });
    expect(svc.list).toBeTypeOf("function");
    expect(svc.create).toBeUndefined();
  });
});

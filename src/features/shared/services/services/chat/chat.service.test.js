/** @format */

import { describe, it, expect } from "vitest";
import { chatService } from "./chat.service";

describe("chatService", () => {
  it("exposes its chat operations as functions", () => {
    expect(chatService).toBeTypeOf("object");
    expect(Object.keys(chatService).length).toBeGreaterThan(0);
    Object.values(chatService).forEach((fn) =>
      expect(fn).toBeTypeOf("function"),
    );
  });
});

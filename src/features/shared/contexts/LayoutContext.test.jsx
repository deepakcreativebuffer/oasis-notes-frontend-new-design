/** @format */

import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook } from "@/test-utils";
import { LayoutProvider, useHasParentLayout } from "./LayoutContext";

describe("LayoutContext", () => {
  it("should default to false when no AppLayout shell is present", () => {
    const { result } = renderHook(() => useHasParentLayout());
    // WHY: standalone pages must render their own sidebar/navbar when there's
    // no persistent shell above them.
    expect(result.current).toBe(false);
  });

  it("should report true inside a LayoutProvider", () => {
    const { result } = renderHook(() => useHasParentLayout(), {
      wrapper: ({ children }) => <LayoutProvider>{children}</LayoutProvider>,
    });
    // WHY: when AppLayout already renders the shell, page HOCs skip their own to
    // avoid a doubled sidebar/navbar.
    expect(result.current).toBe(true);
  });
});

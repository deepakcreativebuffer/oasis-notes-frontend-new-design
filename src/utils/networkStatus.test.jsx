/** @format */

import { describe, it, expect, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useNetworkStatus, getGlobalOfflineStatus } from "./networkStatus";

function setOnline(value) {
  Object.defineProperty(navigator, "onLine", {
    value,
    configurable: true,
    writable: true,
  });
}

describe("networkStatus", () => {
  afterEach(() => {
    // Restore the default online state and notify the module's listeners.
    setOnline(true);
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
  });

  it("should expose a boolean global offline status", () => {
    expect(typeof getGlobalOfflineStatus()).toBe("boolean");
  });

  it("should report online by default", () => {
    setOnline(true);
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOffline).toBe(false);
    expect(result.current.onLine).toBe(true);
  });

  it("should flip to offline when the browser fires an offline event", () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      setOnline(false);
      window.dispatchEvent(new Event("offline"));
    });

    // WHY: offline detection gates network writes so staff get a clear "you're
    // offline" state instead of silent save failures.
    expect(result.current.isOffline).toBe(true);
    expect(result.current.onLine).toBe(false);
  });
});

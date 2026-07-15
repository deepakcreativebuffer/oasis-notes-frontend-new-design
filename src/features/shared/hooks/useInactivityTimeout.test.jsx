/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { setupStore } from "@/test-utils";
import useInactivityTimeout from "./useInactivityTimeout";

const authState = (isAuthenticated) => ({
  auth: {
    isAuthenticated,
    userProfile: {},
    unreadMessages: 0,
    unreadNotifications: 0,
  },
});

function makeWrapper(store) {
  return function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  };
}

const replaceMock = vi.fn();

describe("useInactivityTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // window.location.replace is called on logout; stub it so jsdom doesn't
    // attempt a real navigation.
    Object.defineProperty(window, "location", {
      value: { replace: replaceMock, hostname: "localhost", pathname: "/" },
      writable: true,
      configurable: true,
    });
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("should log the user out after the inactivity window elapses", () => {
    const store = setupStore(authState(true));
    renderHook(() => useInactivityTimeout(1000), {
      wrapper: makeWrapper(store),
    });

    expect(store.getState().auth.isAuthenticated).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // WHY: HIPAA requires auto-logout after inactivity so an unattended EHR
    // session can't expose PHI.
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(replaceMock).toHaveBeenCalledWith("/");
  });

  it("should reset the inactivity timer on user interaction", () => {
    const store = setupStore(authState(true));
    renderHook(() => useInactivityTimeout(1000), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      vi.advanceTimersByTime(600);
    });
    // Activity before the window expires restarts the countdown.
    act(() => {
      window.dispatchEvent(new MouseEvent("mousedown"));
    });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(store.getState().auth.isAuthenticated).toBe(true);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it("should not arm the timeout when the user is not authenticated", () => {
    const store = setupStore(authState(false));
    renderHook(() => useInactivityTimeout(1000), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(replaceMock).not.toHaveBeenCalled();
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});

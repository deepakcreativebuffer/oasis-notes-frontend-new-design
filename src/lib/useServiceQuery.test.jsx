/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { makeQueryClient } from "@/test-utils";
import { useServiceQuery, useServiceQueryWithSelect } from "./useServiceQuery";

// Each test gets its own QueryClient (retry: false) so error states settle fast
// and caches never bleed across tests.
function makeWrapper() {
  const queryClient = makeQueryClient();
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

// Fake clinical payload — never real PHI.
const PATIENT = {
  _id: "patient-test-001",
  name: "Test Patient",
  mrn: "MRN-TEST-001",
};

describe("useServiceQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loading + success", () => {
    it("should start in a loading state and then resolve with the service data payload", async () => {
      const serviceFn = vi
        .fn()
        .mockResolvedValue({ success: true, data: PATIENT });

      const { result } = renderHook(
        () => useServiceQuery(["patient", "detail", "1"], serviceFn),
        { wrapper: makeWrapper() },
      );

      // WHY: the UI shows a spinner/skeleton while the chart loads — the hook
      // must report loading before the service resolves.
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // WHY: the service envelope is { success, data, message }; consumers get
      // the unwrapped `data`, not the whole envelope.
      expect(result.current.data).toEqual(PATIENT);
      expect(serviceFn).toHaveBeenCalledTimes(1);
    });

    it("should return the raw result when the service response has no nested data field", async () => {
      const raw = { items: [1, 2, 3] };
      const serviceFn = vi.fn().mockResolvedValue(raw);

      const { result } = renderHook(
        () => useServiceQuery(["list"], serviceFn),
        { wrapper: makeWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      // Falls back to the whole result (result?.data ?? result).
      expect(result.current.data).toEqual(raw);
    });
  });

  describe("error handling", () => {
    it("should surface an error when the service reports success: false", async () => {
      const serviceFn = vi.fn().mockResolvedValue({
        success: false,
        message: "Patient not found",
        status: 404,
      });

      const { result } = renderHook(
        () => useServiceQuery(["patient", "missing"], serviceFn),
        { wrapper: makeWrapper() },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));

      // WHY: a failed clinical fetch must throw so error UI renders instead of
      // caching an empty/successful-looking result.
      expect(result.current.error.message).toBe("Patient not found");
      expect(result.current.error.status).toBe(404);
      expect(result.current.error.serviceResult).toMatchObject({
        success: false,
        status: 404,
      });
      expect(result.current.data).toBeUndefined();
    });

    it("should default the error message when the service omits one", async () => {
      const serviceFn = vi.fn().mockResolvedValue({ success: false });

      const { result } = renderHook(() => useServiceQuery(["x"], serviceFn), {
        wrapper: makeWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error.message).toBe("Request failed");
    });

    it("should surface an error when the service function rejects", async () => {
      const serviceFn = vi.fn().mockRejectedValue(new Error("Network down"));

      const { result } = renderHook(() => useServiceQuery(["x"], serviceFn), {
        wrapper: makeWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error.message).toBe("Network down");
    });
  });

  describe("options pass-through", () => {
    it("should not run the query when enabled is false", async () => {
      const serviceFn = vi
        .fn()
        .mockResolvedValue({ success: true, data: PATIENT });

      const { result } = renderHook(
        () => useServiceQuery(["patient"], serviceFn, { enabled: false }),
        { wrapper: makeWrapper() },
      );

      // WHY: dependent queries (e.g. needs a patientId first) must stay idle and
      // not fire a request until enabled — avoids a spurious 400/404 on mount.
      expect(result.current.fetchStatus).toBe("idle");
      expect(serviceFn).not.toHaveBeenCalled();
    });
  });

  describe("useServiceQueryWithSelect", () => {
    it("should apply the select transform to the resolved data", async () => {
      const serviceFn = vi.fn().mockResolvedValue({
        success: true,
        data: { docs: [PATIENT], total: 1 },
      });

      const { result } = renderHook(
        () =>
          useServiceQueryWithSelect(
            ["patients", "page", 1],
            serviceFn,
            (data) => data.docs,
          ),
        { wrapper: makeWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      // select extracts the nested list so the component skips .data.docs plumbing.
      expect(result.current.data).toEqual([PATIENT]);
    });
  });
});

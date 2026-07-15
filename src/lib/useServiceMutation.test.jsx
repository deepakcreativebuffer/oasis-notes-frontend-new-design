/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useServiceMutation } from "./useServiceMutation";
import { showNotification } from "@/utils";

vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  });
  const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
}

describe("useServiceMutation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should notify, invalidate the configured keys, navigate back, and call onSuccess", async () => {
      const { wrapper, invalidateSpy } = setup();
      const mutationFn = vi
        .fn()
        .mockResolvedValue({ success: true, data: { _id: "v1" } });
      const navigate = vi.fn();
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () =>
          useServiceMutation(mutationFn, {
            invalidateKeys: [["vitals", "byPatient", "p1"]],
            successMsg: "Vital created!",
            navigate,
            onSuccess,
          }),
        { wrapper },
      );

      act(() => {
        result.current.mutate({ value: 120 });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mutationFn).toHaveBeenCalledWith({ value: 120 });
      expect(showNotification).toHaveBeenCalledWith({
        message: "Vital created!",
        type: "success",
      });
      // WHY: after a write, related lists/details must refetch so the chart
      // reflects the new clinical record.
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["vitals", "byPatient", "p1"],
      });
      expect(navigate).toHaveBeenCalledWith(-1);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("should surface a danger notification and call onError when the service reports failure", async () => {
      const { wrapper } = setup();
      const mutationFn = vi.fn().mockResolvedValue({
        success: false,
        message: "Save failed",
        status: 422,
      });
      const onError = vi.fn();

      const { result } = renderHook(
        () => useServiceMutation(mutationFn, { onError }),
        { wrapper },
      );

      act(() => {
        result.current.mutate({ value: 0 });
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(showNotification).toHaveBeenCalledWith({
        message: "Save failed",
        type: "danger",
      });
      expect(onError).toHaveBeenCalled();
      expect(result.current.error.status).toBe(422);
    });
  });
});

/** @format */

import { QueryClient } from "@tanstack/react-query";

/**
 * HIPAA-safe QueryClient for OasisNotes EHR.
 *
 * Design decisions:
 * - staleTime 5min: prevents aggressive background refetching of PHI
 * - gcTime 10min: evicts PHI from memory after clinician navigates away
 * - retry 1: one retry on network glitch, no retry storms
 * - refetchOnWindowFocus false: no surprise PHI refetch on alt-tab
 * - refetchOnReconnect 'always': ensure current data after network recovery
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: "always",
      refetchOnMount: true,
      // Let errors propagate to ErrorBoundary
      throwOnError: (error) => {
        // Don't throw on 4xx client errors (handled in UI)
        const status = error?.status || error?.response?.status;
        return !status || status >= 500;
      },
    },
    mutations: {
      retry: 0, // Never retry mutations (double-submit risk with PHI)
    },
  },
});

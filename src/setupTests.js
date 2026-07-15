/** @format */

// Extends Vitest's `expect` with DOM matchers (toBeInTheDocument, toHaveValue,
// toBeDisabled, etc.) used by component tests. Auto-loaded via
// `test.setupFiles` in vite.config.js — no per-file import needed.
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Globally neutralize socket.io so getSocket()/io() never opens a real
// connection. A real socket schedules reconnection timers that fire
// asynchronously across test-file boundaries, throwing stray errors that get
// misattributed to unrelated files. A per-file vi.mock("@/socket", ...) still
// overrides this stub where a test needs to assert on socket wiring.
vi.mock("socket.io-client", () => {
  const makeSocket = () => ({
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
    id: "test-socket",
  });
  const io = vi.fn(() => makeSocket());
  return { io, default: io, Manager: vi.fn(), Socket: vi.fn() };
});

// Also bypass the app's socket singleton (src/socket.js). It keeps a module
// -level `connecting` flag that never resets under the inert socket, so later
// getSocket() calls would hit its logger.debug path with a leaked partial
// mock. Returning an inert socket straight from getSocket avoids that entirely.
// A per-file vi.mock("@/socket", ...) still overrides this where needed.
vi.mock("@/socket", () => ({
  getSocket: () => ({
    on: vi.fn(),
    off: vi.fn(),
    once: vi.fn(),
    emit: vi.fn(),
    connected: false,
    id: "test-socket",
  }),
}));

// Belt-and-suspenders: Vitest globals already auto-cleanup, but we unmount
// explicitly so portal-based AntD components (Modal/Drawer/Select) never leak
// DOM between tests.
afterEach(() => {
  cleanup();
});

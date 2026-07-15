/** @format */

// ─── Base API Instance ──────────────────────────────────────────────
export { default as api, injectStore } from "./baseApi";

// ─── Centralized Endpoint URLs (for services only — not components) ─
export * from "./Apis";

// ─── Domain Services (components import from here) ────────────────
export * from "./services";

// ─── Shared HTTP helpers ───────────────────────────────────────────
export * from "./common";

export * from "./core";

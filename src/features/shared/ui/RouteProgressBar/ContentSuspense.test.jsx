/** @format */

import React, { lazy } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import ContentSuspense from "./ContentSuspense";

describe("ContentSuspense", () => {
  it("should render synchronous children directly", () => {
    render(
      <ContentSuspense>
        <div>Chart content</div>
      </ContentSuspense>,
    );
    expect(screen.getByText("Chart content")).toBeInTheDocument();
  });

  it("should show the fallback then render lazy route content once it resolves", async () => {
    const LazyRoute = lazy(() =>
      Promise.resolve({ default: () => <div>Lazy patient chart</div> }),
    );

    render(
      <ContentSuspense>
        <LazyRoute />
      </ContentSuspense>,
    );

    // WHY: route content is code-split; the Suspense boundary must keep the UI
    // responsive (spinner) instead of crashing while the chunk loads.
    expect(screen.queryByText("Lazy patient chart")).not.toBeInTheDocument();
    expect(await screen.findByText("Lazy patient chart")).toBeInTheDocument();
  });
});

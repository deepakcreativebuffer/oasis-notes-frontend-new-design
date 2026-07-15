/** @format */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import RouteProgressBar from "./RouteProgressBar";

describe("RouteProgressBar", () => {
  it("should render an accessible progressbar labelled for page loading", () => {
    render(<RouteProgressBar />);
    const bar = screen.getByRole("progressbar", { name: /loading page/i });
    expect(bar).toBeInTheDocument();
  });
});

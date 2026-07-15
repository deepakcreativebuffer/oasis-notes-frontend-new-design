/** @format */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import NoFound from "./NoFound";

describe("NoFound", () => {
  it("should render the default empty-state message", () => {
    render(<NoFound />);
    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });

  it("should render a custom message when provided", () => {
    render(<NoFound msg="No residents match this filter" />);
    expect(
      screen.getByText("No residents match this filter"),
    ).toBeInTheDocument();
  });
});

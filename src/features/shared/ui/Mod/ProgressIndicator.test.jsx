/** @format */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import ProgressIndicator from "./ProgressIndicator";

describe("ProgressIndicator", () => {
  it("should render the step count and rounded percentage", () => {
    render(<ProgressIndicator currentStep={1} totalSteps={4} />);

    expect(screen.getByText(/pdf 1 of 4/i)).toBeInTheDocument();
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "25",
    );
  });

  it("should round non-integer percentages for display", () => {
    render(<ProgressIndicator currentStep={1} totalSteps={3} />);
    // WHY: a 33.33% raw value must read as a clean "33%" to the user.
    expect(screen.getByText("33%")).toBeInTheDocument();
  });

  it("should fall back to its defaults when no props are provided", () => {
    render(<ProgressIndicator />);
    // Defaults are currentStep 10 / totalSteps 25 => 40%.
    expect(screen.getByText(/pdf 10 of 25/i)).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});

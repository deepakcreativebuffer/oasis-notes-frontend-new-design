/** @format */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import StatusMessage from "./StatusMessage";

// Progress is currentStep/totalSteps; the component maps it to a status line.
describe("StatusMessage", () => {
  it("should show the analyzing message under 33% progress", () => {
    render(
      <StatusMessage currentStep={1} totalSteps={10} documentName="Intake" />,
    );
    expect(
      screen.getByText(/analyzing document structure/i),
    ).toBeInTheDocument();
  });

  it("should show the extracting message between 33% and 66% progress", () => {
    render(
      <StatusMessage currentStep={5} totalSteps={10} documentName="Intake" />,
    );
    // WHY: staff need feedback that the system is reading clinical data, not stalled.
    expect(
      screen.getByText(/extracting clinical information/i),
    ).toBeInTheDocument();
  });

  it("should show the finalizing message with the document name between 66% and 100%", () => {
    render(
      <StatusMessage
        currentStep={8}
        totalSteps={10}
        documentName="Nursing Assessment"
      />,
    );
    expect(
      screen.getByText(/finalizing nursing assessment/i),
    ).toBeInTheDocument();
  });

  it("should show the completion message at 100% progress", () => {
    render(
      <StatusMessage currentStep={10} totalSteps={10} documentName="Intake" />,
    );
    expect(screen.getByText(/processing complete/i)).toBeInTheDocument();
  });
});

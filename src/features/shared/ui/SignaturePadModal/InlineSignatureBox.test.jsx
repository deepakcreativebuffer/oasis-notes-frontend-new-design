/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";

import InlineSignatureBox from "./InlineSignatureBox";

// 1x1 transparent PNG — stands in for a base64 pen drawing.
const FAKE_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

describe("InlineSignatureBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render label and placeholders when unsigned in view mode", () => {
    render(<InlineSignatureBox label="BHT Signature" />);

    expect(screen.getByText("BHT Signature")).toBeInTheDocument();
    // WHY: an unsigned box must visually prompt the clinician — default "xSign"
    // signature placeholder, "Date Signed", and "Full Name" all appear.
    expect(screen.getByText("xSign")).toBeInTheDocument();
    expect(screen.getByText("Date Signed")).toBeInTheDocument();
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("should honor a custom placeholder for the signature box", () => {
    render(<InlineSignatureBox label="Witness" placeholder="Sign here" />);

    expect(screen.getByText("Sign here")).toBeInTheDocument();
    // WHY: when a custom placeholder is supplied the default "xSign" must not leak.
    expect(screen.queryByText("xSign")).not.toBeInTheDocument();
  });

  it("should render the signature image with an accessible alt when imgSrc is set", () => {
    render(<InlineSignatureBox label="BHP Signature" imgSrc={FAKE_IMG} />);

    const img = screen.getByRole("img", { name: "BHP Signature signature" });
    // WHY: a captured signature is rendered as an <img>, and the placeholder
    // prompt must disappear once a drawing exists.
    expect(img).toHaveAttribute("src", FAKE_IMG);
    expect(screen.queryByText("xSign")).not.toBeInTheDocument();
  });

  it("should render the formatted date and printed name when provided", () => {
    render(
      <InlineSignatureBox
        label="Resident Signature"
        dateValue="2026-06-10"
        printName="Test Patient"
      />,
    );

    // WHY: signature dates are normalized to MM/dd/yyyy for the legal record.
    expect(screen.getByText("06/10/2026")).toBeInTheDocument();
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    // WHY: with real values present, the empty-state prompts must not show.
    expect(screen.queryByText("Date Signed")).not.toBeInTheDocument();
    expect(screen.queryByText("Full Name")).not.toBeInTheDocument();
  });

  it("should show the Date Signed placeholder when dateValue is empty", () => {
    render(<InlineSignatureBox label="Admin Signature" dateValue="" />);

    // WHY: a missing date must still prompt the user, never render a blank box.
    expect(screen.getByText("Date Signed")).toBeInTheDocument();
  });

  it("should expose a clickable button role only in edit mode with an onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InlineSignatureBox
        label="BHT Signature"
        mode="edit"
        onClick={onClick}
      />,
    );

    const box = screen.getByRole("button");
    // WHY: the clickable box advertises its action via a tooltip title.
    expect(box).toHaveAttribute("title", "Click for signature");
    await user.click(box);

    // WHY: in edit mode the box opens the signature pad; clicking must fire onClick.
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should invoke onClick when Enter or Space is pressed on the box", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InlineSignatureBox
        label="BHT Signature"
        mode="edit"
        onClick={onClick}
      />,
    );

    const box = screen.getByRole("button");
    box.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    // WHY: keyboard activation must work for accessibility/clinical workflows.
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("should NOT be a button in view mode even when onClick is passed", () => {
    const onClick = vi.fn();
    render(
      <InlineSignatureBox
        label="BHT Signature"
        mode="view"
        onClick={onClick}
      />,
    );

    // WHY: view mode is read-only — the box must not be focusable/clickable.
    expect(
      screen.queryByRole("button", { name: /Click for signature/i }),
    ).not.toBeInTheDocument();
  });

  it("should NOT be a button in edit mode when no onClick handler is provided", () => {
    render(<InlineSignatureBox label="BHT Signature" mode="edit" />);

    // WHY: without a handler there is nothing to do, so no actionable role is exposed.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@/test-utils";
import Loader from "./Loader";

describe("Loader", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the spinner wrapper when mounted", () => {
    const { container } = render(<Loader />);
    // WHY: the busy-wait spinner is shown while EHR data (residents, charts)
    // loads; assert the wrapper element is present so users get a loading cue.
    const wrapper = container.querySelector(".spinner");
    expect(wrapper).toBeInTheDocument();
  });

  it("should render the ClipLoader animation element inside the wrapper", () => {
    const { container } = render(<Loader />);
    // WHY: react-spinners' ClipLoader renders a <span> with inline animation
    // styles; presence confirms the actual loading indicator (not just an empty
    // wrapper) so clinicians know the app is working, not frozen.
    const wrapper = container.querySelector(".spinner");
    const spinner = wrapper.querySelector("span");
    expect(spinner).toBeInTheDocument();
  });

  it("should render without crashing and produce non-empty markup", () => {
    const { container } = render(<Loader />);
    // WHY: smoke guarantee that the loading state renders deterministically in
    // jsdom with no provider/service dependencies required.
    expect(container.firstChild).not.toBeNull();
  });
});

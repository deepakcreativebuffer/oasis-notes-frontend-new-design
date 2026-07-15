/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import MarsDateList from "./MarsDateList";

// framer-motion's <motion.div> renders fine in jsdom, but stub it to a plain
// div so the animation props don't leak onto the DOM and clutter assertions.
vi.mock("framer-motion", () => ({
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children, initial, animate, transition, exit, ...rest }) => (
          <div {...rest}>{children}</div>
        ),
    },
  ),
}));

// react-infinite-scroll-hook attaches an IntersectionObserver (absent in jsdom).
// Stub it to return a ref array so the component can attach its sentinel ref.
vi.mock("react-infinite-scroll-hook", () => ({
  default: () => [vi.fn()],
}));

const sampleDates = [
  { _id: "mar-test-001", month: "01", year: "2026" },
  { _id: "mar-test-002", month: "02", year: "2026" },
];

describe("MarsDateList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the search input when given a date list", () => {
    render(
      <MarsDateList
        isOpen
        dateList={sampleDates}
        clickHandler={vi.fn()}
        setIsOpen={vi.fn()}
      />,
    );
    // WHY: clinicians filter MAR (Medication Administration Record) periods by
    // searching, so the search field must always be present.
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("should render a list item per administration period", () => {
    render(
      <MarsDateList
        isOpen
        dateList={sampleDates}
        clickHandler={vi.fn()}
        setIsOpen={vi.fn()}
      />,
    );
    // WHY: each MAR month/year period must be individually selectable so staff
    // can open the correct medication record window.
    expect(screen.getByText(/01\/ 2026/)).toBeInTheDocument();
    expect(screen.getByText(/02\/ 2026/)).toBeInTheDocument();
  });

  it("should call clickHandler with the selected period when an item is clicked", () => {
    const clickHandler = vi.fn();
    render(
      <MarsDateList
        isOpen
        dateList={sampleDates}
        clickHandler={clickHandler}
        setIsOpen={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText(/01\/ 2026/));
    // WHY: selecting a period must pass that exact MAR record up so the right
    // month's medications are loaded.
    expect(clickHandler).toHaveBeenCalledWith(sampleDates[0]);
  });

  it("should render a no-results message when the date list is empty", () => {
    render(
      <MarsDateList
        isOpen
        dateList={[]}
        clickHandler={vi.fn()}
        setIsOpen={vi.fn()}
      />,
    );
    // WHY: when no MAR periods exist for a resident, staff must see an explicit
    // empty state rather than a blank panel.
    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });

  it("should call setIsOpen(false) when the close icon is clicked", () => {
    const setIsOpen = vi.fn();
    const { container } = render(
      <MarsDateList
        isOpen
        dateList={sampleDates}
        clickHandler={vi.fn()}
        setIsOpen={setIsOpen}
      />,
    );
    // WHY: the close affordance is an <i> icon (no accessible role), so query by
    // class is the only available hook; clicking it must collapse the dropdown.
    const closeIcon = container.querySelector(".fa-circle-xmark");
    fireEvent.click(closeIcon);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("should not throw when dateList is undefined", () => {
    // WHY: the panel can render before MAR data has loaded; optional chaining
    // must keep it from crashing and fall back to the empty state.
    expect(() =>
      render(
        <MarsDateList isOpen clickHandler={vi.fn()} setIsOpen={vi.fn()} />,
      ),
    ).not.toThrow();
    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });
});

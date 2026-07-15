/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";

import Search from "./Search";

// Stub react-select with a light component that surfaces the props the wrapper
// drives: `menuIsOpen` (so we can assert the open/closed state) and the
// forwarded options/placeholder/onChange. The real react-select is not the
// unit under test here.
vi.mock("react-select", () => ({
  default: ({ menuIsOpen, placeholder, options, onChange }) => (
    <div>
      <span data-testid="menu-state">{menuIsOpen ? "open" : "closed"}</span>
      {placeholder ? <span>{placeholder}</span> : null}
      <button onClick={() => onChange?.(options?.[0])}>pick first</button>
      {menuIsOpen
        ? options?.map((o) => <span key={o.value}>{o.label}</span>)
        : null}
    </div>
  ),
}));

const OPTIONS = [
  { value: "res-test-001", label: "Test Patient" },
  { value: "res-test-002", label: "Second Patient" },
];

describe("Search", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the underlying select with the menu closed initially", () => {
    render(<Search options={OPTIONS} placeholder="Search residents" />);

    // WHY: the search dropdown must stay collapsed until the clinician opens it,
    // so the patient list isn't exposed by default.
    expect(screen.getByTestId("menu-state")).toHaveTextContent("closed");
    expect(screen.getByText("Search residents")).toBeInTheDocument();
  });

  it("should forward arbitrary props through to react-select", () => {
    render(<Search options={OPTIONS} placeholder="Find a chart" />);

    // WHY: Search is a thin wrapper, so caller-supplied props (placeholder,
    // options) must reach the real select unchanged.
    expect(screen.getByText("Find a chart")).toBeInTheDocument();
  });

  it("should open the menu when the container is clicked", () => {
    const { container } = render(<Search options={OPTIONS} />);

    fireEvent.click(container.firstChild);

    // WHY: clicking the search field opens the option menu so the clinician can
    // browse/select a patient.
    expect(screen.getByTestId("menu-state")).toHaveTextContent("open");
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should toggle the menu closed on a second container click", () => {
    const { container } = render(<Search options={OPTIONS} />);

    fireEvent.click(container.firstChild); // open
    expect(screen.getByTestId("menu-state")).toHaveTextContent("open");

    fireEvent.click(container.firstChild); // close
    // WHY: a second click on the field collapses the dropdown again (toggle).
    expect(screen.getByTestId("menu-state")).toHaveTextContent("closed");
  });

  it("should close the menu on an outside mousedown when open", () => {
    const { container } = render(<Search options={OPTIONS} />);

    fireEvent.click(container.firstChild); // open
    expect(screen.getByTestId("menu-state")).toHaveTextContent("open");

    fireEvent.mouseDown(document.body);

    // WHY: clicking outside the search field dismisses the dropdown, matching
    // expected click-away UX so the menu doesn't linger over patient data.
    expect(screen.getByTestId("menu-state")).toHaveTextContent("closed");
  });

  it("should open the menu on a touch end (mobile)", () => {
    const { container } = render(<Search options={OPTIONS} />);

    fireEvent.touchEnd(container.firstChild);

    // WHY: on touch devices the field opens the menu via touchEnd so mobile
    // clinicians can select a patient.
    expect(screen.getByTestId("menu-state")).toHaveTextContent("open");
  });

  it("should forward a selection to the caller's onChange", () => {
    const onChange = vi.fn();
    render(<Search options={OPTIONS} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /pick first/i }));

    // WHY: selecting a result must bubble the chosen option up to the caller so
    // the parent can navigate to / load that patient.
    expect(onChange).toHaveBeenCalledWith(OPTIONS[0]);
  });
});

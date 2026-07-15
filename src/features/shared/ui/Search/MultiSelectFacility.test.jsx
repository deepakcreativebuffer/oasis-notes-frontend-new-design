/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";

import MultiSelectFacility from "./MultiSelectFacility";

// Stub the heavy third-party multi-select; we only test the wrapper's option
// mapping and onChange wiring, not the library's dropdown internals.
vi.mock("react-multi-select-component", () => ({
  MultiSelect: ({ options, onChange }) => (
    <div>
      <span data-testid="opt-count">{options.length}</span>
      {options.map((o) => (
        <span key={o.value}>{o.label}</span>
      ))}
      <button
        onClick={() => onChange([{ value: "fac-1", label: "Facility One" }])}
      >
        select
      </button>
    </div>
  ),
}));

const DATA = [
  { _id: "fac-1", name: "Facility One" },
  { _id: "fac-2", name: "Facility Two" },
];

describe("MultiSelectFacility", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should map facility records to value/label options", () => {
    render(<MultiSelectFacility data={DATA} value={[]} setValue={vi.fn()} />);
    expect(screen.getByTestId("opt-count")).toHaveTextContent("2");
    expect(screen.getByText("Facility One")).toBeInTheDocument();
    expect(screen.getByText("Facility Two")).toBeInTheDocument();
  });

  it("should render no options when data is missing", () => {
    render(
      <MultiSelectFacility data={undefined} value={[]} setValue={vi.fn()} />,
    );
    expect(screen.getByTestId("opt-count")).toHaveTextContent("0");
  });

  it("should forward the selection to setValue", async () => {
    const user = userEvent.setup();
    const setValue = vi.fn();
    render(<MultiSelectFacility data={DATA} value={[]} setValue={setValue} />);

    await user.click(screen.getByRole("button", { name: "select" }));
    expect(setValue).toHaveBeenCalledWith([
      { value: "fac-1", label: "Facility One" },
    ]);
  });
});

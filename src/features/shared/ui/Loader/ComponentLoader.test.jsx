/** @format */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import ComponentLoader from "./ComponentLoader";

const Wrapped = () => <div>Loaded panel</div>;

describe("ComponentLoader", () => {
  it("should render the spinner while loading", () => {
    const { container } = render(
      <ComponentLoader Wcomponenet={Wrapped} loading={true} />,
    );
    // WHY: clinical panels show a spinner while their data resolves rather than
    // flashing an empty/partial component.
    expect(container.querySelector(".spinner")).not.toBeNull();
    expect(screen.queryByText("Loaded panel")).not.toBeInTheDocument();
  });

  it("should render the wrapped component once loading is complete", () => {
    const { container } = render(
      <ComponentLoader Wcomponenet={Wrapped} loading={false} />,
    );
    expect(screen.getByText("Loaded panel")).toBeInTheDocument();
    expect(container.querySelector(".spinner")).toBeNull();
  });
});

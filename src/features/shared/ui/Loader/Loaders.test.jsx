/** @format */

import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { PageLoader, SectionLoader, TableLoader, ModalLoader } from "./Loaders";

describe("Loaders", () => {
  it("should render the page loader spinner", () => {
    const { container } = render(<PageLoader />);
    expect(container.querySelector(".spinner")).not.toBeNull();
  });

  it("should render the section loader with its label", () => {
    render(<SectionLoader />);
    expect(screen.getByText(/loading section/i)).toBeInTheDocument();
  });

  it("should render the modal loader with its label", () => {
    render(<ModalLoader />);
    expect(screen.getByText(/updating form content/i)).toBeInTheDocument();
  });

  describe("TableLoader", () => {
    it("should render a skeleton grid sized to rows x cols", () => {
      const { container } = render(<TableLoader rowsCount={3} colsCount={2} />);
      // 2 header cells + (3 rows * 2 cols) body cells = 8 skeleton items.
      expect(container.querySelectorAll(".skeleton-item")).toHaveLength(8);
    });

    it("should fall back to default dimensions (5x4) when no props are given", () => {
      const { container } = render(<TableLoader />);
      // 4 header + 5*4 body = 24.
      expect(container.querySelectorAll(".skeleton-item")).toHaveLength(24);
    });
  });
});

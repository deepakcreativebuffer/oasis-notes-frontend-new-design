/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import PaginationsPage from "./PaginationsPage";

const setup = (overrides = {}) => {
  const props = {
    page: 1,
    setPage: vi.fn(),
    totalPages: 3,
    limit: 10,
    setLimit: vi.fn(),
    ...overrides,
  };
  const { container } = render(<PaginationsPage {...props} />);
  return { props, container };
};

describe("PaginationsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render one button per page when the count is small", () => {
    setup({ totalPages: 3 });
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("should disable Prev on the first page and Next on the last page", () => {
    const { container } = setup({ page: 1, totalPages: 3 });
    expect(container.querySelector(".prevBtn")).toBeDisabled();

    const { container: c2 } = render(
      <PaginationsPage
        page={3}
        setPage={vi.fn()}
        totalPages={3}
        limit={10}
        setLimit={vi.fn()}
      />,
    );
    expect(c2.querySelector(".nextBtn")).toBeDisabled();
  });

  it("should advance the page when Next is clicked", async () => {
    const user = userEvent.setup();
    const { props, container } = setup({ page: 1, totalPages: 3 });
    await user.click(container.querySelector(".nextBtn"));
    expect(props.setPage).toHaveBeenCalledWith(2);
  });

  it("should jump to a specific page when its number is clicked", async () => {
    const user = userEvent.setup();
    const { props } = setup({ page: 1, totalPages: 3 });
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(props.setPage).toHaveBeenCalledWith(3);
  });

  describe("windowing with many pages", () => {
    it("should show the head window with an ellipsis near the start", () => {
      setup({ page: 1, totalPages: 10 });
      // WHY: large result sets stay navigable by collapsing the middle into "…".
      expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "7" }),
      ).not.toBeInTheDocument();
    });

    it("should show a centered window around the current page", () => {
      setup({ page: 5, totalPages: 10 });
      expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "6" })).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "2" }),
      ).not.toBeInTheDocument();
    });
  });

  it("should change the page size and reset to page 1", async () => {
    const user = userEvent.setup();
    const { props } = setup({ page: 4, totalPages: 10, limit: 10 });
    await user.selectOptions(screen.getByRole("combobox"), "20");
    expect(props.setLimit).toHaveBeenCalledWith(20);
    expect(props.setPage).toHaveBeenCalledWith(1);
  });

  it("should offer medication-specific page sizes when enabled", () => {
    setup({ medication: true });
    expect(
      screen.getByRole("option", { name: "3 per page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "5 per page" }),
    ).toBeInTheDocument();
  });
});

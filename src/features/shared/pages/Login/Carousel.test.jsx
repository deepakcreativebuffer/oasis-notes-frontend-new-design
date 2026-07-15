/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@/test-utils";
import LoginCarouselSlide from "./Carousel";

describe("LoginCarouselSlide", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should render the login marketing carousel without crashing", () => {
    render(<LoginCarouselSlide />);

    // WHY: the login page carousel introduces Oasis Notes to staff before they
    // authenticate; the first slide headline must be present on mount.
    expect(
      screen.getByRole("heading", { name: /oasis notes/i }),
    ).toBeInTheDocument();
  });

  it("should render every marketing slide's headline", () => {
    render(<LoginCarouselSlide />);

    // WHY: each Carousel.Item heading is rendered in the DOM (react-bootstrap
    // keeps inactive slides mounted), so all four product pillars are present.
    expect(
      screen.getByRole("heading", { name: /^oasis notes$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /client records/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^employees$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /practice management/i }),
    ).toBeInTheDocument();
  });

  it("should describe core EHR capabilities in the slide copy", () => {
    render(<LoginCarouselSlide />);

    // WHY: copy assures prospective behavioral-health facilities of compliance
    // and record-keeping features central to the product's value.
    expect(
      screen.getByText(/access medical records from\s+anywhere/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/medication administration records/i),
    ).toBeInTheDocument();
  });
});

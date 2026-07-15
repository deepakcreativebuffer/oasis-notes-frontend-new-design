/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderWithProviders, screen } from "@/test-utils";

import AppointmentsCard from "./AppointmentsCard";

const baseProps = () => ({
  imageUrl: "https://example.test/avatar.png",
  date: "2026-06-15",
  slot: "10:00 AM - 10:30 AM",
  location: "123 Test Street, Test City",
});

describe("AppointmentsCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the static medical appointment heading", () => {
    renderWithProviders(<AppointmentsCard {...baseProps()} />);
    expect(screen.getByText("Medical Appointment")).toBeInTheDocument();
  });

  it("should render the provided date, slot, and location", () => {
    const props = baseProps();
    renderWithProviders(<AppointmentsCard {...props} />);

    // WHY: date/slot/location are the only dynamic data this card surfaces.
    expect(screen.getByText(props.date)).toBeInTheDocument();
    expect(screen.getByText(props.slot)).toBeInTheDocument();
    expect(screen.getByText(props.location)).toBeInTheDocument();
    expect(screen.getByText("Address:")).toBeInTheDocument();
  });

  it("should render resiliently when data props are missing", () => {
    // WHY: card is fed by upstream data that may be absent; it must not crash.
    expect(() => renderWithProviders(<AppointmentsCard />)).not.toThrow();
    expect(screen.getByText("Medical Appointment")).toBeInTheDocument();
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@/test-utils";

import NetworkStatus from "./NetworkStatus";
import { useNetworkStatus } from "@/utils/networkStatus";

vi.mock("@/utils/networkStatus", () => ({ useNetworkStatus: vi.fn() }));

describe("NetworkStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the offline banner while offline", () => {
    vi.mocked(useNetworkStatus).mockReturnValue({ isOffline: true });
    render(<NetworkStatus />);
    // WHY: a persistent offline banner warns staff their EHR writes won't save.
    expect(screen.getByText(/you are currently offline/i)).toBeInTheDocument();
  });

  it("should render nothing when online and never previously offline", () => {
    vi.mocked(useNetworkStatus).mockReturnValue({ isOffline: false });
    const { container } = render(<NetworkStatus />);
    expect(container).toBeEmptyDOMElement();
  });

  describe("reconnect banner", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("should show a restored banner after offline→online, then auto-dismiss", () => {
      vi.mocked(useNetworkStatus).mockReturnValue({ isOffline: true });
      const { rerender } = render(<NetworkStatus />);

      vi.mocked(useNetworkStatus).mockReturnValue({ isOffline: false });
      rerender(<NetworkStatus />);
      expect(
        screen.getByText(/internet connection was restored/i),
      ).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(
        screen.queryByText(/internet connection was restored/i),
      ).not.toBeInTheDocument();
    });
  });
});

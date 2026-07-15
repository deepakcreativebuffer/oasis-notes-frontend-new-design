/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/test-utils";

import SearchPatients from "./SearchPatients";
import { patientService } from "../../services";

// Mock the patient service the component imports via "../../services" (resolves
// to src/features/shared/services). NEVER hit real HTTP for patient lookups.
vi.mock("../../services", () => ({
  patientService: {
    listForSearch: vi.fn(({ setResponse, setLoading }) => {
      // Default: resolve to no loading + empty docs so NoFound renders.
      setLoading?.(false);
      setResponse?.({ data: { docs: [], totalDocs: 0, hasNextPage: false } });
    }),
  },
}));

// react-infinite-scroll-hook attaches IntersectionObserver-driven refs that are
// noisy in jsdom; stub it to a plain ref so the sentinel <div> just mounts.
vi.mock("react-infinite-scroll-hook", () => ({
  default: () => [vi.fn()],
}));

describe("SearchPatients", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should request the patient list on mount with the given mars flag", () => {
    render(<SearchPatients isOpen mars />);

    // WHY: opening the search box must immediately query patients for the MAR
    // context so the clinician sees results without typing.
    expect(patientService.listForSearch).toHaveBeenCalledTimes(1);
    expect(patientService.listForSearch).toHaveBeenCalledWith(
      expect.objectContaining({ search: "", limit: 100, mars: true }),
    );
  });

  it("should render the search input with the resident placeholder", () => {
    render(<SearchPatients isOpen />);
    expect(
      screen.getByPlaceholderText("Search Resident..."),
    ).toBeInTheDocument();
  });

  it("should show a no-results message when the service returns no patients", () => {
    render(<SearchPatients isOpen />);
    // WHY: an empty roster must surface "No Results Found" rather than a blank
    // list so staff know the search ran and found nothing.
    expect(screen.getByText("No Results Found")).toBeInTheDocument();
  });

  it("should render returned patients by full name and call clickHandler on selection", async () => {
    patientService.listForSearch.mockImplementation(
      ({ setResponse, setLoading }) => {
        setLoading?.(false);
        setResponse?.({
          data: {
            docs: [
              { _id: "res-test-001", firstName: "Test", lastName: "Patient" },
            ],
            totalDocs: 1,
            hasNextPage: false,
          },
        });
      },
    );
    const clickHandler = vi.fn();
    const user = userEvent.setup();
    render(<SearchPatients isOpen clickHandler={clickHandler} />);

    const item = screen.getByText("Test Patient");
    expect(item).toBeInTheDocument();

    await user.click(item);
    // WHY: clicking a patient row must hand the full record back to the parent
    // so the chart/MAR can load that resident.
    expect(clickHandler).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "res-test-001" }),
    );
  });

  it("should fall back to fullName when first/last name are missing", () => {
    patientService.listForSearch.mockImplementation(
      ({ setResponse, setLoading }) => {
        setLoading?.(false);
        setResponse?.({
          data: {
            docs: [{ _id: "res-test-002", fullName: "Test Patient Full" }],
            totalDocs: 1,
            hasNextPage: false,
          },
        });
      },
    );
    render(<SearchPatients isOpen />);
    // WHY: records vary in shape; the list must still show a readable name.
    expect(screen.getByText("Test Patient Full")).toBeInTheDocument();
  });

  it("should highlight the currently selected residentName", () => {
    render(<SearchPatients isOpen residentName="Test Patient" />);
    // WHY: the active resident is pinned at the top so staff keep context.
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
  });

  it("should show a loader and hide the list while loading", () => {
    patientService.listForSearch.mockImplementation(({ setLoading }) => {
      setLoading?.(true);
    });
    render(<SearchPatients isOpen />);
    // WHY: while the query is in flight no stale roster should be shown.
    expect(screen.queryByText("No Results Found")).not.toBeInTheDocument();
  });

  it("should close the panel when the close icon is clicked", async () => {
    const setIsOpen = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <SearchPatients isOpen setIsOpen={setIsOpen} />,
    );
    const closeIcon = container.querySelector(".close_btn i");
    await user.click(closeIcon);
    // WHY: dismissing the search overlay must signal the parent to close it.
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it("should re-query patients when the search term changes", async () => {
    const user = userEvent.setup();
    render(<SearchPatients isOpen />);
    patientService.listForSearch.mockClear();

    await user.type(screen.getByPlaceholderText("Search Resident..."), "Test");

    // WHY: typing a name must trigger a fresh server search (debounced 300ms)
    // so the roster narrows to matching residents.
    await waitFor(
      () =>
        expect(patientService.listForSearch).toHaveBeenCalledWith(
          expect.objectContaining({ search: "Test" }),
        ),
      { timeout: 2000 },
    );
  });
});

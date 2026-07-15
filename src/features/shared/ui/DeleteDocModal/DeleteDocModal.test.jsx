/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "@/test-utils";

import DeleteDocModal from "./DeleteDocModal";
import { removeApi, removeApiForPdf, COMMON_APIS } from "../../services";

// Mock the service layer so no real DELETE request is made. The component
// imports these from "../../services"; the same relative specifier here
// resolves to the identical module, so the mock intercepts it.
vi.mock("../../services", () => ({
  removeApi: vi.fn(),
  removeApiForPdf: vi.fn(),
  COMMON_APIS: {
    // Echo the url back prefixed so we can assert what got passed through.
    GET_BASE_API: vi.fn((url) => `/api/${url}`),
  },
}));

const baseProps = {
  show: true,
  handleClose: vi.fn(),
  fetchHandler: vi.fn(),
  deleteUrl: "documents/doc-test-001",
};

describe("DeleteDocModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render the confirmation dialog with prompt and action buttons when show is true", () => {
      renderWithProviders(<DeleteDocModal {...baseProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
      expect(
        screen.getByText(/are you sure you want to delete/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Delete" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
    });

    it("should not render the confirmation prompt when show is false", () => {
      renderWithProviders(<DeleteDocModal {...baseProps} show={false} />);

      // WHY: a delete-confirm dialog must stay fully unmounted until invoked —
      // never accidentally one click away from destroying a clinical record.
      expect(
        screen.queryByText(/are you sure you want to delete/i),
      ).not.toBeInTheDocument();
    });
  });

  describe("cancel", () => {
    it("should close without calling any delete service when Cancel is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<DeleteDocModal {...baseProps} />);

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(baseProps.handleClose).toHaveBeenCalledTimes(1);
      expect(removeApi).not.toHaveBeenCalled();
      expect(removeApiForPdf).not.toHaveBeenCalled();
    });
  });

  describe("submit — onDelete (preferred domain handler)", () => {
    it("should call onDelete with the fetchHandler and then close, bypassing the legacy URL services", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn().mockResolvedValue(undefined);
      const fetchHandler = vi.fn();
      const handleClose = vi.fn();

      renderWithProviders(
        <DeleteDocModal
          show
          handleClose={handleClose}
          fetchHandler={fetchHandler}
          onDelete={onDelete}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      // WHY: when a domain onDelete is supplied it is the single source of
      // truth — the legacy URL-based fallbacks must not also fire.
      await waitFor(() =>
        expect(onDelete).toHaveBeenCalledWith({
          additionalFunctions: [fetchHandler],
        }),
      );
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(removeApi).not.toHaveBeenCalled();
      expect(removeApiForPdf).not.toHaveBeenCalled();
    });
  });

  describe("submit — removeApi (default URL path)", () => {
    it("should call removeApi with the resolved url, success message, and fetch handler", async () => {
      const user = userEvent.setup();
      renderWithProviders(<DeleteDocModal {...baseProps} />);

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(COMMON_APIS.GET_BASE_API).toHaveBeenCalledWith(
        "documents/doc-test-001",
      );
      expect(removeApi).toHaveBeenCalledWith({
        url: "/api/documents/doc-test-001",
        successMsg: "Deleted Successfully !",
        additionalFunctions: [baseProps.fetchHandler],
      });
      expect(removeApiForPdf).not.toHaveBeenCalled();
      expect(baseProps.handleClose).toHaveBeenCalledTimes(1);
    });

    it("should pass an empty additionalFunctions list when no fetchHandler is provided", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <DeleteDocModal
          show
          handleClose={vi.fn()}
          deleteUrl="documents/doc-test-002"
        />,
      );

      await user.click(screen.getByRole("button", { name: "Delete" }));

      // Edge case: undefined fetchHandler is filtered out, never passed as a
      // hole in the callbacks array.
      expect(removeApi).toHaveBeenCalledWith(
        expect.objectContaining({ additionalFunctions: [] }),
      );
    });
  });

  describe("submit — removeApiForPdf (payload path)", () => {
    it("should call removeApiForPdf with a typed payload when payloadValue is set", async () => {
      const user = userEvent.setup();
      renderWithProviders(<DeleteDocModal {...baseProps} payloadValue="MAR" />);

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(removeApiForPdf).toHaveBeenCalledWith({
        url: "/api/documents/doc-test-001",
        successMsg: "Deleted Successfully !",
        payload: { type: "MAR" },
        additionalFunctions: [baseProps.fetchHandler],
      });
      expect(removeApi).not.toHaveBeenCalled();
    });
  });
});

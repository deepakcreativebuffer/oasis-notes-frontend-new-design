/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "@/test-utils";

import DeleteModal from "./DeleteModal";
import { removeApi, COMMON_APIS } from "@/features/shared/services/index";
import { showNotification } from "@/utils";

vi.mock("@/features/shared/services/index", () => ({
  removeApi: vi.fn(),
  COMMON_APIS: {
    GET_BASE_API_1: vi.fn((u, id, rowId) => `/api/${u}/${id}/${rowId}`),
  },
}));
vi.mock("@/utils", () => ({ showNotification: vi.fn() }));

const baseProps = () => ({
  show: true,
  onHide: vi.fn(),
  setBalance: vi.fn(),
  setOverAllBalance: vi.fn(),
  arr: [],
  url: "receipts",
  id: "res-test-001",
  fetchHandler: vi.fn(),
});

describe("DeleteModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the permanent-delete confirmation", () => {
    renderWithProviders(
      <DeleteModal {...baseProps()} row={{ _id: "row-1" }} />,
    );
    expect(
      screen.getByText(/permanently delete the table row/i),
    ).toBeInTheDocument();
  });

  it("should call removeApi with the composed url for a persisted row", async () => {
    const user = userEvent.setup();
    const props = {
      ...baseProps(),
      row: { _id: "row-1" },
      arr: [{ _id: "row-1" }],
    };
    renderWithProviders(<DeleteModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    // WHY: a saved row is deleted server-side via the composed REST url, not
    // just dropped from local state.
    expect(COMMON_APIS.GET_BASE_API_1).toHaveBeenCalledWith(
      "receipts",
      "res-test-001",
      "row-1",
    );
    expect(removeApi).toHaveBeenCalledWith(
      expect.objectContaining({ url: "/api/receipts/res-test-001/row-1" }),
    );
    expect(props.onHide).toHaveBeenCalled();
  });

  it("should remove an unsaved row locally without hitting the API", async () => {
    const user = userEvent.setup();
    const tablepayload = vi.fn();
    const responsetable = vi.fn();
    const props = {
      ...baseProps(),
      row: { tempData: true },
      tablepayload,
      responsetable,
    };
    renderWithProviders(<DeleteModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    // WHY: rows that were never persisted (no _id) are just dropped from the
    // table state — no server delete to issue.
    expect(removeApi).not.toHaveBeenCalled();
    expect(tablepayload).toHaveBeenCalled();
    expect(responsetable).toHaveBeenCalled();
    expect(showNotification).toHaveBeenCalledWith({
      message: "Removed",
      type: "success",
    });
  });

  it("should close without deleting when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const props = { ...baseProps(), row: { _id: "row-1" } };
    renderWithProviders(<DeleteModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(removeApi).not.toHaveBeenCalled();
    expect(props.onHide).toHaveBeenCalled();
  });
});

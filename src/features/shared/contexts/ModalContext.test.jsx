/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, renderHook } from "@/test-utils";

import { ModalProvider, useModal } from "./ModalContext";
import { removeApi, removeApiForPdf } from "../services";

vi.mock("../services", () => ({
  removeApi: vi.fn(),
  removeApiForPdf: vi.fn(),
}));

// Consumer that exposes the context's open action via a button.
function Consumer({ openArgs }) {
  const { openDeleteModal } = useModal();
  return <button onClick={() => openDeleteModal(openArgs)}>open delete</button>;
}

function renderWithProvider(openArgs) {
  return render(
    <ModalProvider>
      <Consumer openArgs={openArgs} />
    </ModalProvider>,
  );
}

describe("ModalContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw when useModal is used outside a ModalProvider", () => {
    // WHY: a missing provider is a wiring bug; failing loudly beats a silent
    // no-op delete button.
    expect(() => renderHook(() => useModal())).toThrow(
      /useModal must be used within a ModalProvider/i,
    );
  });

  it("should keep the delete modal hidden until openDeleteModal is called", () => {
    renderWithProvider({ url: "/docs/doc-test-001" });
    expect(
      screen.queryByText(/are you sure you want to delete/i),
    ).not.toBeInTheDocument();
  });

  it("should open the confirm modal when openDeleteModal is invoked", async () => {
    const user = userEvent.setup();
    renderWithProvider({ url: "/docs/doc-test-001" });

    await user.click(screen.getByRole("button", { name: /open delete/i }));

    expect(
      screen.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();
  });

  it("should call removeApi with the url and wrapped onSuccess when confirmed", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    renderWithProvider({ url: "/docs/doc-test-001", onSuccess });

    await user.click(screen.getByRole("button", { name: /open delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm deletion/i }));

    expect(removeApi).toHaveBeenCalledWith({
      url: "/docs/doc-test-001",
      successMsg: "Deleted Successfully !",
      additionalFunctions: [onSuccess],
    });
    expect(removeApiForPdf).not.toHaveBeenCalled();
  });

  it("should call removeApiForPdf with a typed payload when payloadValue is set", async () => {
    const user = userEvent.setup();
    renderWithProvider({ url: "/docs/doc-test-001", payloadValue: "MAR" });

    await user.click(screen.getByRole("button", { name: /open delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm deletion/i }));

    expect(removeApiForPdf).toHaveBeenCalledWith({
      url: "/docs/doc-test-001",
      successMsg: "Deleted Successfully !",
      payload: { type: "MAR" },
      additionalFunctions: [],
    });
  });

  it("should hide the modal again when cancelled", async () => {
    const user = userEvent.setup();
    renderWithProvider({ url: "/docs/doc-test-001" });

    await user.click(screen.getByRole("button", { name: /open delete/i }));
    await user.click(screen.getByRole("button", { name: /cancel deletion/i }));

    expect(
      screen.queryByText(/are you sure you want to delete/i),
    ).not.toBeInTheDocument();
  });
});

/** @format */

import { describe, it, expect, vi, beforeEach } from "vitest";

import { showNotification } from "./notifications";

const addNotification = vi.fn();
vi.mock("react-notifications-component", () => ({
  Store: { addNotification: (...args) => addNotification(...args) },
}));

const lastCall = () => addNotification.mock.calls.at(-1)[0];

describe("showNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should treat a bare string as a success message", () => {
    showNotification("Saved");
    expect(lastCall()).toMatchObject({
      message: "Saved",
      type: "success",
      title: "Success",
    });
  });

  it("should render an explicit danger type with an Error title", () => {
    showNotification({ message: "Bad input", type: "danger" });
    expect(lastCall()).toMatchObject({
      message: "Bad input",
      type: "danger",
      title: "Error",
    });
  });

  it("should coerce an API result with success:false to a danger toast", () => {
    // WHY: service envelopes ({ success:false }) flow straight into the toast
    // helper; failures must always show as errors, not success.
    showNotification({ success: false, message: "Request failed" });
    expect(lastCall()).toMatchObject({
      type: "danger",
      message: "Request failed",
    });
  });

  it("should normalize an 'error' type to 'danger'", () => {
    showNotification({ message: "x", type: "error" });
    expect(lastCall().type).toBe("danger");
  });

  it("should default an unknown type to success", () => {
    showNotification({ message: "x", type: "bogus" });
    expect(lastCall().type).toBe("success");
  });
});

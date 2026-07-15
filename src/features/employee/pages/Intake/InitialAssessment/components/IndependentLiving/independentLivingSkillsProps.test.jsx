/** @format */

import { describe, it, expect, vi } from "vitest";
import { buildIndependentLivingSkillsProps } from "./independentLivingSkillsProps";

// buildIndependentLivingSkillsProps is a pure adapter: it pulls a fixed set of
// fields/handlers off the independentLiving state object and merges in the
// caller-supplied `canDelete` flag. These tests pin that mapping contract so a
// renamed/dropped field surfaces here rather than silently breaking the section.
describe("buildIndependentLivingSkillsProps", () => {
  const makeIndependentLiving = () => ({
    fixedRows: [{ id: "row-1", label: "Bathing" }],
    extraRows: [{ id: "extra-1", label: "Custom" }],
    otherDraft: "draft text",
    showTakingMedications: true,
    updateFixedRow: vi.fn(),
    updateOtherDraft: vi.fn(),
    appendOtherDraft: vi.fn(),
    removeExtraRow: vi.fn(),
    // Extra field that should NOT be forwarded.
    internalOnly: "should-be-ignored",
  });

  it("should map every expected field from independentLiving onto the result", () => {
    const il = makeIndependentLiving();

    const props = buildIndependentLivingSkillsProps(il, { canDelete: true });

    expect(props.fixedRows).toBe(il.fixedRows);
    expect(props.extraRows).toBe(il.extraRows);
    expect(props.otherDraft).toBe(il.otherDraft);
    expect(props.showTakingMedications).toBe(il.showTakingMedications);
    // WHY: handlers must be passed by reference so the section drives the source state.
    expect(props.updateFixedRow).toBe(il.updateFixedRow);
    expect(props.updateOtherDraft).toBe(il.updateOtherDraft);
    expect(props.appendOtherDraft).toBe(il.appendOtherDraft);
    expect(props.removeExtraRow).toBe(il.removeExtraRow);
  });

  it("should forward the canDelete flag from the options argument", () => {
    const il = makeIndependentLiving();

    expect(
      buildIndependentLivingSkillsProps(il, { canDelete: true }).canDelete,
    ).toBe(true);
    expect(
      buildIndependentLivingSkillsProps(il, { canDelete: false }).canDelete,
    ).toBe(false);
  });

  it("should expose exactly the documented prop keys and nothing else", () => {
    const il = makeIndependentLiving();

    const props = buildIndependentLivingSkillsProps(il, { canDelete: true });

    // WHY: locks the prop surface so unrelated fields (e.g. internalOnly) never leak through.
    expect(Object.keys(props).sort()).toEqual(
      [
        "appendOtherDraft",
        "canDelete",
        "extraRows",
        "fixedRows",
        "otherDraft",
        "removeExtraRow",
        "showTakingMedications",
        "updateFixedRow",
        "updateOtherDraft",
      ].sort(),
    );
    expect(props).not.toHaveProperty("internalOnly");
  });

  it("should carry through falsy/empty values without coercion", () => {
    const il = {
      fixedRows: [],
      extraRows: [],
      otherDraft: "",
      showTakingMedications: false,
      updateFixedRow: vi.fn(),
      updateOtherDraft: vi.fn(),
      appendOtherDraft: vi.fn(),
      removeExtraRow: vi.fn(),
    };

    const props = buildIndependentLivingSkillsProps(il, { canDelete: false });

    expect(props.fixedRows).toEqual([]);
    expect(props.extraRows).toEqual([]);
    expect(props.otherDraft).toBe("");
    expect(props.showTakingMedications).toBe(false);
    expect(props.canDelete).toBe(false);
  });
});

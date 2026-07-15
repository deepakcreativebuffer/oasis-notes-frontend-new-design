/** @format */

import {
  createDefaultMedicalConditions,
  loadMedicalConditionsFromApi,
  medicalConditionsToLegacyFlat,
  isMedicalConditionsTableHidden,
} from "./medicalConditionsState";
import { MEDICAL_CONDITIONS_FIXED_ROWS } from "../config/medicalConditionsConfig";

const FIXED_COUNT = MEDICAL_CONDITIONS_FIXED_ROWS.length;
// Indices of the two multiselect rows (Thyroid disorder, Infection or Diseases).
const MULTISELECT_INDICES = MEDICAL_CONDITIONS_FIXED_ROWS.reduce(
  (acc, cfg, i) => (cfg.fieldType === "multiselect" ? [...acc, i] : acc),
  [],
);

beforeEach(() => vi.clearAllMocks());

describe("createDefaultMedicalConditions", () => {
  it("returns one row per fixed config entry", () => {
    const rows = createDefaultMedicalConditions();
    expect(rows).toHaveLength(FIXED_COUNT);
  });

  it("seeds each row with its condition and an undefined yes", () => {
    const rows = createDefaultMedicalConditions();
    rows.forEach((row, i) => {
      expect(row.condition).toBe(MEDICAL_CONDITIONS_FIXED_ROWS[i].condition);
      expect(row.yes).toBeUndefined();
    });
  });

  it("uses an empty array comment for multiselect rows and empty string otherwise", () => {
    const rows = createDefaultMedicalConditions();
    rows.forEach((row, i) => {
      if (MEDICAL_CONDITIONS_FIXED_ROWS[i].fieldType === "multiselect") {
        expect(row.comment).toEqual([]);
      } else {
        expect(row.comment).toBe("");
      }
    });
    // sanity: at least one multiselect row exists
    expect(MULTISELECT_INDICES.length).toBeGreaterThan(0);
  });
});

describe("loadMedicalConditionsFromApi", () => {
  it("returns empty fixed comments and no extras for nullish input", () => {
    const { fixed, extras } = loadMedicalConditionsFromApi(undefined);
    expect(fixed).toHaveLength(FIXED_COUNT);
    expect(extras).toEqual([]);
    fixed.forEach((row, i) => {
      expect(row.condition).toBe(MEDICAL_CONDITIONS_FIXED_ROWS[i].condition);
      expect(row.yes).toBeUndefined();
      if (MEDICAL_CONDITIONS_FIXED_ROWS[i].fieldType === "multiselect") {
        expect(row.comment).toEqual([]);
      } else {
        expect(row.comment).toBe("");
      }
    });
  });

  it("maps text-field yes and comment from the API row", () => {
    const apiArray = new Array(FIXED_COUNT).fill(null);
    // index 0 is the diabetes text-field row
    apiArray[0] = { yes: true, comment: "Type 2" };
    const { fixed } = loadMedicalConditionsFromApi(apiArray);
    expect(fixed[0].yes).toBe(true);
    expect(fixed[0].comment).toBe("Type 2");
  });

  it("prefers the plural `comments` key over `comment` for text fields", () => {
    const apiArray = new Array(FIXED_COUNT).fill(null);
    apiArray[0] = { yes: false, comment: "ignored", comments: "preferred" };
    const { fixed } = loadMedicalConditionsFromApi(apiArray);
    // WHY: mapApiCommentField for non-multiselect reads apiRow.comments first
    expect(fixed[0].comment).toBe("preferred");
  });

  it("maps multiselect comments into {label,value} option objects", () => {
    const mIdx = MULTISELECT_INDICES[0];
    const apiArray = new Array(FIXED_COUNT).fill(null);
    apiArray[mIdx] = { yes: true, comment: ["Hashimoto", "Graves"] };
    const { fixed } = loadMedicalConditionsFromApi(apiArray);
    expect(fixed[mIdx].comment).toEqual([
      { label: "Hashimoto", value: "Hashimoto" },
      { label: "Graves", value: "Graves" },
    ]);
  });

  it("falls back to the `comments` key for multiselect rows", () => {
    const mIdx = MULTISELECT_INDICES[0];
    const apiArray = new Array(FIXED_COUNT).fill(null);
    apiArray[mIdx] = { comments: ["Flu"] };
    const { fixed } = loadMedicalConditionsFromApi(apiArray);
    expect(fixed[mIdx].comment).toEqual([{ label: "Flu", value: "Flu" }]);
  });

  it("yields an empty array for a multiselect row with non-array comment", () => {
    const mIdx = MULTISELECT_INDICES[0];
    const apiArray = new Array(FIXED_COUNT).fill(null);
    apiArray[mIdx] = { comment: "not-an-array" };
    const { fixed } = loadMedicalConditionsFromApi(apiArray);
    expect(fixed[mIdx].comment).toEqual([]);
  });

  it("collects entries beyond the fixed range as extras", () => {
    const extraA = { condition: "custom-a", yes: true, comment: "x" };
    const extraB = { condition: "custom-b", yes: false, comment: "y" };
    const apiArray = [...new Array(FIXED_COUNT).fill(null), extraA, extraB];
    const { fixed, extras } = loadMedicalConditionsFromApi(apiArray);
    expect(fixed).toHaveLength(FIXED_COUNT);
    expect(extras).toEqual([extraA, extraB]);
  });

  it("returns no extras when the API array only covers the fixed rows", () => {
    const apiArray = new Array(FIXED_COUNT).fill({ yes: false });
    const { extras } = loadMedicalConditionsFromApi(apiArray);
    expect(extras).toEqual([]);
  });
});

describe("medicalConditionsToLegacyFlat", () => {
  it("maps yesNo and text comment legacy keys for a populated row", () => {
    const cfg = MEDICAL_CONDITIONS_FIXED_ROWS[0]; // diabetes
    const rows = createDefaultMedicalConditions();
    rows[0] = { condition: cfg.condition, yes: true, comment: "Type 1" };
    const flat = medicalConditionsToLegacyFlat(rows);
    expect(flat[cfg.legacyKeys.yesNo]).toBe(true);
    expect(flat[cfg.legacyKeys.comment]).toBe("Type 1");
  });

  it("maps multiselect rows to their `comments` legacy key as an array", () => {
    const mIdx = MULTISELECT_INDICES[0];
    const cfg = MEDICAL_CONDITIONS_FIXED_ROWS[mIdx];
    const rows = createDefaultMedicalConditions();
    const options = [{ label: "A", value: "A" }];
    rows[mIdx] = { condition: cfg.condition, yes: true, comment: options };
    const flat = medicalConditionsToLegacyFlat(rows);
    expect(flat[cfg.legacyKeys.comments]).toEqual(options);
    expect(flat[cfg.legacyKeys.yesNo]).toBe(true);
  });

  it("defaults missing comment to empty string / empty array per field type", () => {
    // empty rows array -> every row is treated as {}
    const flat = medicalConditionsToLegacyFlat([]);
    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((cfg) => {
      if (cfg.fieldType === "multiselect" && cfg.legacyKeys.comments) {
        expect(flat[cfg.legacyKeys.comments]).toEqual([]);
      } else if (cfg.legacyKeys.comment) {
        expect(flat[cfg.legacyKeys.comment]).toBe("");
      }
      expect(flat[cfg.legacyKeys.yesNo]).toBeUndefined();
    });
  });

  it("produces a key for every configured legacy yesNo name", () => {
    const flat = medicalConditionsToLegacyFlat(
      createDefaultMedicalConditions(),
    );
    MEDICAL_CONDITIONS_FIXED_ROWS.forEach((cfg) => {
      expect(
        Object.prototype.hasOwnProperty.call(flat, cfg.legacyKeys.yesNo),
      ).toBe(true);
    });
  });
});

describe("isMedicalConditionsTableHidden", () => {
  it("hides the table when all rows have undefined yes and no other label", () => {
    const rows = createDefaultMedicalConditions();
    expect(isMedicalConditionsTableHidden(rows, "")).toBe(true);
  });

  it("shows the table when an other-condition label is present", () => {
    const rows = createDefaultMedicalConditions();
    expect(isMedicalConditionsTableHidden(rows, "Custom condition")).toBe(
      false,
    );
  });

  it("shows the table when any row has a defined yes value", () => {
    const rows = createDefaultMedicalConditions();
    rows[0].yes = false; // defined (false) still counts as answered
    expect(isMedicalConditionsTableHidden(rows, "")).toBe(false);
  });
});

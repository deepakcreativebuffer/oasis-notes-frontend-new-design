/** @format */

import { describe, it, expect } from "vitest";

import {
  parseSignatureDate,
  formatSignatureDateOnly,
  getFormattedDateTime,
  fetchPaitentName,
  ronSignerLineFromProfile,
  getClassName,
  formatDateToMMDDYYYY,
  toDatePickerValue,
  formatDateWithoutTimezoneInfluenceMMDDYYYY,
  formatDateTimeSheet,
  convertTimeFormat,
  updateArrayOrder,
  splitAddress,
  handleMeal,
  deletePermission,
  otherHandler,
  checkAnyValue,
  extractParagraphText,
  isSignerPresentOnAllPages,
  isSignaturePresentOnAllPages,
  isGuardianSignaturePresentOnAllPages,
  extractSignFromSigner,
  getSignature,
  stripHtmlList,
} from "./utils";

describe("parseSignatureDate", () => {
  it("should return null for empty/falsy input", () => {
    expect(parseSignatureDate(null)).toBeNull();
    expect(parseSignatureDate(undefined)).toBeNull();
    expect(parseSignatureDate("")).toBeNull();
  });

  it("should return the same Date instance for a valid Date", () => {
    const d = new Date("2024-01-15T10:00:00Z");
    expect(parseSignatureDate(d)).toBe(d);
  });

  it("should unwrap a Firestore-style {toDate()} timestamp", () => {
    // WHY: signature timestamps sometimes arrive as Firestore Timestamps,
    // which expose toDate() rather than being plain Date objects.
    const d = new Date("2024-02-02T00:00:00Z");
    expect(parseSignatureDate({ toDate: () => d })).toBe(d);
  });

  it("should parse a date string into a Date", () => {
    const parsed = parseSignatureDate("2024-03-04T05:06:07Z");
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed.getUTCFullYear()).toBe(2024);
  });

  it("should return null for an unparseable string", () => {
    expect(parseSignatureDate("not-a-date")).toBeNull();
  });
});

describe("formatSignatureDateOnly", () => {
  it("should format a valid date as MM/dd/yyyy", () => {
    expect(formatSignatureDateOnly(new Date(2024, 0, 5))).toBe("01/05/2024");
  });

  it("should return an empty string for invalid input", () => {
    expect(formatSignatureDateOnly(null)).toBe("");
    expect(formatSignatureDateOnly("garbage")).toBe("");
  });
});

describe("getFormattedDateTime", () => {
  it("should combine date and 24h time", () => {
    const d = new Date(2024, 5, 7, 14, 30);
    expect(getFormattedDateTime(d, "HH:mm")).toBe("06/07/2024 14:30");
  });

  it("should translate the 'h:mm A' alias to a 12h am/pm clock", () => {
    // WHY: callers pass the display alias "h:mm A", which date-fns cannot
    // consume directly; the helper must rewrite it to "h:mm a".
    const d = new Date(2024, 5, 7, 14, 30);
    expect(getFormattedDateTime(d, "h:mm A")).toBe("06/07/2024 2:30 PM");
  });

  it("should return an empty string when the date is missing", () => {
    expect(getFormattedDateTime(null, "HH:mm")).toBe("");
  });
});

describe("fetchPaitentName", () => {
  it("should join first and last name when present", () => {
    expect(fetchPaitentName({ firstName: "Ada", lastName: "Lovelace" })).toBe(
      "Ada Lovelace",
    );
  });

  it("should fall back to fullName when no first/last name", () => {
    expect(fetchPaitentName({ fullName: "Grace Hopper" })).toBe("Grace Hopper");
  });

  it("should still build a name when only one part is present", () => {
    expect(fetchPaitentName({ firstName: "Solo" })).toBe("Solo undefined");
  });
});

describe("ronSignerLineFromProfile", () => {
  it("should return empty string for a falsy profile", () => {
    expect(ronSignerLineFromProfile(null)).toBe("");
  });

  it("should append 'Admin' for admin users", () => {
    expect(
      ronSignerLineFromProfile({
        firstName: "Al",
        lastName: "Bert",
        userType: "Admin",
      }),
    ).toBe("Al Bert Admin");
  });

  it("should use the position for non-admins", () => {
    expect(
      ronSignerLineFromProfile({
        firstName: "Em",
        lastName: "Ploy",
        userType: "Employee",
        position: "RN",
      }),
    ).toBe("Em Ploy RN");
  });

  it("should default a missing position to 'BHP'", () => {
    expect(ronSignerLineFromProfile({ firstName: "No", lastName: "Pos" })).toBe(
      "No Pos BHP",
    );
  });
});

describe("getClassName", () => {
  it("should return 'active' when key matches value", () => {
    expect(getClassName("tab1", "tab1")).toBe("active");
  });

  it("should return an empty string when they differ", () => {
    expect(getClassName("tab1", "tab2")).toBe("");
  });
});

describe("formatDateToMMDDYYYY", () => {
  it("should return empty string for falsy input", () => {
    expect(formatDateToMMDDYYYY("")).toBe("");
    expect(formatDateToMMDDYYYY(null)).toBe("");
  });

  it("should format an ISO date string without timezone drift", () => {
    // WHY: the helper splits on 'T' and rebuilds a local date so a UTC
    // midnight timestamp never rolls back to the previous calendar day.
    expect(formatDateToMMDDYYYY("2024-12-25T00:00:00Z")).toBe("12/25/2024");
  });

  it("should format a plain YYYY-MM-DD string", () => {
    expect(formatDateToMMDDYYYY("2024-01-09")).toBe("01/09/2024");
  });

  it("should format a Date object", () => {
    expect(formatDateToMMDDYYYY(new Date(2023, 10, 3))).toBe("11/03/2023");
  });

  it("should return empty string for unparseable strings", () => {
    expect(formatDateToMMDDYYYY("nope")).toBe("");
  });
});

describe("toDatePickerValue", () => {
  it("should return null for falsy input", () => {
    expect(toDatePickerValue(null)).toBeNull();
  });

  it("should normalize a Date to midnight local of the same day", () => {
    const out = toDatePickerValue(new Date(2024, 4, 6, 23, 59));
    expect(out.getFullYear()).toBe(2024);
    expect(out.getMonth()).toBe(4);
    expect(out.getDate()).toBe(6);
    expect(out.getHours()).toBe(0);
  });

  it("should convert an ISO string to a local Date", () => {
    const out = toDatePickerValue("2024-07-04T00:00:00Z");
    expect(out.getMonth()).toBe(6);
    expect(out.getDate()).toBe(4);
  });

  it("should return null for unparseable strings", () => {
    expect(toDatePickerValue("bad")).toBeNull();
  });
});

describe("formatDateWithoutTimezoneInfluenceMMDDYYYY", () => {
  it("should format an ISO string by its calendar day", () => {
    expect(
      formatDateWithoutTimezoneInfluenceMMDDYYYY("2024-08-09T23:00:00Z"),
    ).toBe("08/09/2024");
  });

  it("should return empty string for falsy input", () => {
    expect(formatDateWithoutTimezoneInfluenceMMDDYYYY("")).toBe("");
  });
});

describe("formatDateTimeSheet", () => {
  it("should format a YYYY-MM-DD string as UTC MM/DD/YYYY", () => {
    expect(formatDateTimeSheet("2024-02-29")).toBe("02/29/2024");
  });

  it("should return empty string for falsy or invalid input", () => {
    expect(formatDateTimeSheet("")).toBe("");
    expect(formatDateTimeSheet("not-a-date")).toBe("");
  });
});

describe("convertTimeFormat", () => {
  it("should return empty string for empty input", () => {
    expect(convertTimeFormat("", "HH:mm")).toBe("");
    expect(convertTimeFormat(null, "HH:mm")).toBe("");
  });

  it("should convert 24h to 12h using the display alias", () => {
    expect(convertTimeFormat("14:30", "h:mm A")).toBe("2:30 PM");
  });

  it("should convert a 12h am/pm string to 24h", () => {
    expect(convertTimeFormat("2:30 PM", "HH:mm")).toBe("14:30");
  });

  it("should pass an HH:mm:ss string through to the target format", () => {
    expect(convertTimeFormat("09:05:00", "HH:mm")).toBe("09:05");
  });

  it("should return the original input on a parse failure", () => {
    // WHY: convertTimeFormat is used inline in rendering; on bad data it
    // returns the raw value rather than throwing and blanking the cell.
    expect(convertTimeFormat("???", "HH:mm")).toBe("???");
  });
});

describe("updateArrayOrder", () => {
  it("should move 'Other' to the end of the array", () => {
    expect(updateArrayOrder(["Other", "A", "B"])).toEqual(["A", "B", "Other"]);
  });
});

describe("splitAddress", () => {
  it("should return empty string for falsy input", () => {
    expect(splitAddress("")).toBe("");
  });

  it("should split into two halves joined by a <br>", () => {
    expect(splitAddress("123 Main St City")).toBe("123 Main<br>St City");
  });
});

describe("handleMeal", () => {
  it("should extract the known meal tokens present in the string", () => {
    expect(handleMeal("Breakfast eaten and Lunch eaten")).toBe(
      "Breakfast eaten, Lunch eaten",
    );
  });

  it("should return empty string when no meal tokens match", () => {
    expect(handleMeal("nothing here")).toBe("");
  });
});

describe("deletePermission", () => {
  it("should allow admins", () => {
    expect(deletePermission({ userType: "Admin" }, "notes")).toBe(true);
  });

  it("should allow administrator account type", () => {
    expect(
      deletePermission({ accountType: "adminstrator" }, "notes"),
    ).toBeTruthy();
  });

  it("should allow a regular employee with the matching permission key", () => {
    expect(
      deletePermission(
        {
          accountType: "regular",
          userType: "Employee",
          userPermissions: { delete: "notes:charts" },
        },
        "charts",
      ),
    ).toBe(true);
  });

  it("should deny a regular employee lacking the key", () => {
    expect(
      deletePermission(
        {
          accountType: "regular",
          userType: "Employee",
          userPermissions: { delete: "notes" },
        },
        "charts",
      ),
    ).toBe(false);
  });
});

describe("otherHandler", () => {
  it("should append the Other value when the key is present", () => {
    expect(otherHandler(["A", "Other", "B"], "Other", "details")).toBe(
      "A, B, Other: details",
    );
  });

  it("should join normally when the Other key is absent", () => {
    expect(otherHandler(["A", "B"], "Other", "details")).toBe("A, B");
  });
});

describe("checkAnyValue", () => {
  it("should return true when a non-empty string is present", () => {
    expect(checkAnyValue("", "real text")).toBe(true);
  });

  it("should treat empty HTML placeholders as empty", () => {
    expect(checkAnyValue("<p><br></p>", "<ul></ul>")).toBe(false);
  });

  it("should treat a boolean as a present value", () => {
    expect(checkAnyValue(false)).toBe(true);
  });

  it("should ignore null and undefined", () => {
    expect(checkAnyValue(null, undefined)).toBe(false);
  });
});

describe("extractParagraphText", () => {
  it("should pull the inner text from a <p> tag", () => {
    expect(extractParagraphText("<p>Hello world</p>")).toBe("Hello world");
  });

  it("should return the input unchanged when there is no <p>", () => {
    expect(extractParagraphText("plain")).toBe("plain");
  });

  it("should return empty string for non-string input", () => {
    expect(extractParagraphText(42)).toBe("");
  });
});

describe("signature presence checks", () => {
  const pages = [
    { sign: [{ signerId: "u1", signature: "sig" }] },
    { sign: [{ signerId: "u1", signature: "sig" }, { signerId: "u2" }] },
  ];

  it("isSignerPresentOnAllPages should be true when the signer signs every page", () => {
    expect(isSignerPresentOnAllPages(pages, "u1")).toBe(true);
  });

  it("isSignerPresentOnAllPages should be false when a page is missing the signer", () => {
    expect(isSignerPresentOnAllPages(pages, "u2")).toBe(false);
  });

  it("isSignaturePresentOnAllPages should match any of the given ids per page", () => {
    expect(isSignaturePresentOnAllPages(pages, ["u1", "u2"])).toBe(true);
  });

  it("isGuardianSignaturePresentOnAllPages should require a non-empty signature", () => {
    const guardianPages = [
      { sign: [{ signerId: "g1", signature: "x" }] },
      { sign: [{ signerId: "g1", signature: "" }] },
    ];
    expect(isGuardianSignaturePresentOnAllPages(guardianPages, ["g1"])).toBe(
      false,
    );
  });
});

describe("extractSignFromSigner", () => {
  const signers = [
    { signerId: "u1", signature: "John", dateSigned: "2024-01-02" },
  ];

  it("should return false when the signer has no signature", () => {
    expect(extractSignFromSigner(signers, "missing", "HH:mm")).toBe(false);
  });

  it("should return true when only training completion is requested", () => {
    expect(extractSignFromSigner(signers, "u1", "HH:mm", false, true)).toBe(
      true,
    );
  });

  it("should return the formatted signed date when wantDate is set", () => {
    expect(extractSignFromSigner(signers, "u1", "HH:mm", true)).toBe(
      "01/02/2024",
    );
  });
});

describe("getSignature", () => {
  it("should return the oldest signature across admin/employee keys", () => {
    const row = {
      adminSign: "Admin A",
      adminDate: "2024-05-01",
      empSign: "Emp E",
      empDate: "2024-03-01",
    };
    const out = getSignature(
      row,
      "HH:mm",
      "adminSign",
      "adminDate",
      "empSign",
      "empDate",
    );
    expect(out).toContain("Emp E");
    expect(out).toContain("03/01/2024");
  });

  it("should return a dash when no signatures exist", () => {
    expect(getSignature({}, "HH:mm", "a", "ad", "e", "ed")).toBe("-");
  });
});

describe("stripHtmlList", () => {
  it("should extract list items as label/value option objects", () => {
    const out = stripHtmlList("<ul><li>One</li><li>Two</li></ul>");
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ label: "One", value: "One" });
    expect(out[1]).toMatchObject({ label: "Two", value: "Two" });
    expect(typeof out[0].id).toBe("string");
  });

  it("should return an empty array when there are no list items", () => {
    expect(stripHtmlList("<p>no list</p>")).toEqual([]);
  });
});

/** @format */

import { describe, it, expect } from "vitest";
import {
  PDF_DOC,
  displayDocType,
  getPrintViaViewLink,
  PDF_MED,
  PDF_INTAKE,
  MEDICATION_OPTION,
  INTAKE_OPTION,
  ALL_DOCUMENT_OPTIONS,
  GUARDIAN_DOCUMENT_OPTIONS,
  TYPE_MAP,
  getDocumentOptionsForUser,
  SEARCH_PRINT_PAGE_STYLE,
  INITIAL_FILTER_STATE,
  INITIAL_PAGINATION_STATE,
  createFieldUpdater,
} from "./searchPageConstants";

// Pure constants/config module: assert export shapes, values, and the small
// helper functions against representative inputs. No IO, no rendering.
describe("searchPageConstants", () => {
  describe("option lists", () => {
    it("should expose well-formed value/label option arrays", () => {
      // Every option list entry must carry both a value and a label so the
      // react-select dropdowns render and submit correctly.
      const lists = [
        PDF_DOC,
        PDF_MED,
        PDF_INTAKE,
        MEDICATION_OPTION,
        INTAKE_OPTION,
        ALL_DOCUMENT_OPTIONS,
        GUARDIAN_DOCUMENT_OPTIONS,
      ];
      lists.forEach((list) => {
        expect(Array.isArray(list)).toBe(true);
        expect(list.length).toBeGreaterThan(0);
        list.forEach((opt) => {
          expect(typeof opt.value).toBe("string");
          expect(typeof opt.label).toBe("string");
        });
      });
    });

    it("should keep the legacy staffing-note value but render the ART Meeting label", () => {
      // WHY: backend matching depends on the legacy value; only the label moved.
      const staffing = PDF_DOC.find((o) => o.value === "staffing-note");
      expect(staffing).toBeTruthy();
      expect(staffing.label).toBe("ART Meeting");
    });

    it("should give PDF_MED and PDF_INTAKE a backend match key on every entry", () => {
      [...PDF_MED, ...PDF_INTAKE].forEach((opt) => {
        expect(typeof opt.match).toBe("string");
        expect(opt.match.length).toBeGreaterThan(0);
      });
    });

    it("should start the All-document and guardian lists with an All option", () => {
      expect(ALL_DOCUMENT_OPTIONS[0]).toEqual({ value: "All", label: "All" });
      expect(GUARDIAN_DOCUMENT_OPTIONS[0]).toEqual({
        value: "All",
        label: "All",
      });
    });

    it("should restrict the guardian list to a subset of document types", () => {
      // Guardians see fewer document types than full staff.
      expect(GUARDIAN_DOCUMENT_OPTIONS.length).toBeLessThan(
        ALL_DOCUMENT_OPTIONS.length,
      );
    });
  });

  describe("displayDocType", () => {
    it("should translate the legacy Staffing note key to ART Meeting", () => {
      expect(displayDocType("Staffing note")).toBe("ART Meeting");
    });

    it("should pass through unknown docType strings unchanged", () => {
      expect(displayDocType("Discharge Summary")).toBe("Discharge Summary");
      expect(displayDocType(undefined)).toBe(undefined);
    });
  });

  describe("getPrintViaViewLink", () => {
    it("should return null when viewLink or _id is missing", () => {
      expect(getPrintViaViewLink(null)).toBeNull();
      expect(getPrintViaViewLink({})).toBeNull();
      expect(
        getPrintViaViewLink({ viewLink: "/view", docType: "x" }),
      ).toBeNull();
      expect(getPrintViaViewLink({ _id: "1", docType: "x" })).toBeNull();
    });

    it("should build an autoPrint link for whitelisted docTypes", () => {
      expect(
        getPrintViaViewLink({
          viewLink: "/view",
          _id: "doc-1",
          docType: "Discharge Summary",
        }),
      ).toBeNull();
    });

    it("should return null for non-whitelisted docTypes even with links", () => {
      expect(
        getPrintViaViewLink({
          viewLink: "/view",
          _id: "doc-1",
          docType: "Contact Note",
        }),
      ).toBeNull();
    });
  });

  describe("TYPE_MAP", () => {
    it("should map the three section keys to their source option arrays", () => {
      expect(TYPE_MAP.Documents).toBe(PDF_DOC);
      expect(TYPE_MAP.Medications).toBe(PDF_MED);
      expect(TYPE_MAP.Intake).toBe(PDF_INTAKE);
    });
  });

  describe("getDocumentOptionsForUser", () => {
    const ROLES = { GUARDIAN: "Guardian" };

    it("should return the guardian list for guardian users", () => {
      expect(getDocumentOptionsForUser("Guardian", ROLES)).toBe(
        GUARDIAN_DOCUMENT_OPTIONS,
      );
    });

    it("should return the full list for any non-guardian user", () => {
      expect(getDocumentOptionsForUser("Employee", ROLES)).toBe(
        ALL_DOCUMENT_OPTIONS,
      );
      expect(getDocumentOptionsForUser(undefined, ROLES)).toBe(
        ALL_DOCUMENT_OPTIONS,
      );
    });
  });

  describe("print page style", () => {
    it("should declare landscape orientation for printed search results", () => {
      expect(typeof SEARCH_PRINT_PAGE_STYLE).toBe("string");
      expect(SEARCH_PRINT_PAGE_STYLE).toContain("landscape");
      expect(SEARCH_PRINT_PAGE_STYLE).toContain("@page");
    });
  });

  describe("initial state objects", () => {
    it("should default search filters to All and empty date ranges", () => {
      expect(INITIAL_FILTER_STATE.searchMedication).toBe("All");
      expect(INITIAL_FILTER_STATE.searchIntake).toBe("All");
      expect(INITIAL_FILTER_STATE.scheduleFilterDate).toEqual({
        pastStartDate: "",
        pastEndDate: "",
        upcomingStartDate: "",
        upcomingEndDate: "",
      });
    });

    it("should default pagination to page 1 with sensible limits", () => {
      expect(INITIAL_PAGINATION_STATE).toMatchObject({
        vitalLimit: 10,
        vitalPage: 1,
        scheduleLimit: 10,
        schedulePage: 1,
        limit: null,
        page: 1,
      });
    });
  });

  describe("createFieldUpdater", () => {
    it("should call the setter with an updater that merges one field", () => {
      let received;
      const setter = (fn) => {
        received = fn({ a: 1, b: 2 });
      };
      const update = createFieldUpdater(setter);
      update("b", 99);
      // WHY: updater must preserve other fields and overwrite only the target.
      expect(received).toEqual({ a: 1, b: 99 });
    });

    it("should add new fields not present in the previous state", () => {
      let received;
      const setter = (fn) => {
        received = fn({ a: 1 });
      };
      createFieldUpdater(setter)("c", 3);
      expect(received).toEqual({ a: 1, c: 3 });
    });
  });
});

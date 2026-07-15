/** @format */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

import { useSearchPageDocumentData } from "./useSearchPageDocumentData";
import { getObjectUrlFromDownloadUrl } from "@/features/shared/services";
import { getSignature } from "@/utils/utils";

// Mock the constants barrel: the real one re-exports @/assets/index (heavy
// image bundle). We only need ROLES + ACCOUNT_TYPES, which panelBoundaries /
// portalRoles also read via the same resolved module path.
vi.mock("@/features/shared/constants", () => ({
  ROLES: {
    ADMIN: "Admin",
    EMPLOYEE: "Employee",
    PATIENT: "Patient",
    GUARDIAN: "Guardian",
  },
  ACCOUNT_TYPES: {
    ADMINISTRATOR: "adminstrator",
    REGULAR: "regular",
    RESTRICTED: "restricted",
  },
}));

// Stub TableRow so the rows are inspectable plain elements with the props the
// hook computed, without dragging in the real component's heavy dependencies.
vi.mock("@/features/shared/ui/Table/TableRow", () => ({
  __esModule: true,
  default: (props) =>
    React.createElement("div", { "data-testid": "table-row" }),
}));

// No real network: the only service the hook calls turns a download URL into
// an object URL.
vi.mock("@/features/shared/services", () => ({
  getObjectUrlFromDownloadUrl: vi.fn((url) => `obj:${url}`),
}));

// Signature / date helpers are pure formatters elsewhere; stub deterministically.
vi.mock("@/utils/utils", () => ({
  getSignature: vi.fn(() => "SIGNATURE-STUB"),
  getFormattedDateTime: vi.fn((d) => `FMT(${d})`),
  isSignaturePresentOnAllPages: vi.fn(() => false),
  isSignerPresentOnAllPages: vi.fn(() => false),
}));

// Sensible defaults for the (large) argument bag; individual tests override.
const baseArgs = {
  documents: { data: {} },
  medication: { data: {} },
  intake: { data: {} },
  documentsFilterStartDate: "",
  documentsFilterEndDate: "",
  documentTypes: "All",
  medicationFilterStartDate: "",
  medicationFilterEndDate: "",
  searchMedication: "All",
  intakeFilterStartDate: "",
  intakeFilterEndDate: "",
  searchIntake: "All",
  page: 1,
  limit: 10,
  profileUser: { userType: "Admin", accountType: "adminstrator" },
  currentUserId: "emp-test-001",
  hoursFormat: "12",
  downloadingId: null,
  setDownloadingId: vi.fn(),
  fetchDocument: vi.fn(),
  fetchIntake: vi.fn(),
};

const renderData = (overrides = {}) =>
  renderHook(() => useSearchPageDocumentData({ ...baseArgs, ...overrides }));

describe("useSearchPageDocumentData", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the expected shape with empty data sets", () => {
    const { result } = renderData();
    // WHY: with no documents the hub must still expose all render buckets +
    // page counts so the Search page renders without crashing.
    expect(result.current.renderRows).toEqual([]);
    expect(result.current.renderMedRows).toEqual([]);
    expect(result.current.renderIntakeRows).toEqual([]);
    expect(result.current.totalDocumentPages).toBe(0);
    expect(result.current.totalMedPages).toBe(0);
    expect(result.current.totalIntakesPages).toBe(0);
    expect(Array.isArray(result.current.selectedFormType)).toBe(true);
  });

  it("maps a contact note into a row and computes total pages", () => {
    const { result } = renderData({
      documents: {
        data: {
          contactNote: [
            { _id: "doc-test-001", createdAt: "2026-01-01T00:00:00Z" },
          ],
        },
      },
    });
    expect(result.current.renderRows).toHaveLength(1);
    // WHY: docType drives the displayed title; Contact Note has no override.
    expect(result.current.renderRows[0].props.title).toBe("Contact Note");
    // WHY: one doc with limit 10 => single page.
    expect(result.current.totalDocumentPages).toBe(1);
    // WHY: signature cell is derived through getSignature.
    expect(result.current.renderRows[0].props.signature).toBe("SIGNATURE-STUB");
    expect(getSignature).toHaveBeenCalled();
  });

  it("renames the staffing-note docType to 'ART Meeting' in the row title", () => {
    const { result } = renderData({
      documents: {
        data: {
          staffingNote: [
            { _id: "doc-test-002", createdAt: "2026-02-01T00:00:00Z" },
          ],
        },
      },
    });
    // WHY: display override swaps the legacy "Staffing note" key for "ART Meeting".
    expect(result.current.renderRows[0].props.title).toBe("ART Meeting");
  });

  it("renders uploaded user documents through the object-URL service", () => {
    const { result } = renderData({
      documents: {
        data: {
          userDocuments: [
            {
              _id: "doc-test-003",
              type: "PDF",
              document: "https://example.test/file.pdf",
              createdAt: "2026-03-01T00:00:00Z",
            },
          ],
        },
      },
    });
    expect(getObjectUrlFromDownloadUrl).toHaveBeenCalledWith(
      "https://example.test/file.pdf",
    );
    // WHY: uploaded docs render with the "(Document)" suffix title.
    expect(result.current.renderRows[0].props.title).toBe("PDF (Document)");
    expect(result.current.renderRows[0].props.link).toBe(
      "obj:https://example.test/file.pdf",
    );
  });

  it("filters documents by docType when a specific type is selected", () => {
    const { result } = renderData({
      documentTypes: "Contact Note",
      documents: {
        data: {
          contactNote: [
            { _id: "doc-test-004", createdAt: "2026-01-01T00:00:00Z" },
          ],
          progressNote: [
            { _id: "doc-test-005", createdAt: "2026-01-02T00:00:00Z" },
          ],
        },
      },
    });
    // WHY: only the matching docType survives the filter.
    expect(result.current.renderRows).toHaveLength(1);
    expect(result.current.renderRows[0].props.title).toBe("Contact Note");
  });

  it("sorts documents newest-first by createdAt", () => {
    const { result } = renderData({
      documents: {
        data: {
          contactNote: [
            { _id: "old", createdAt: "2026-01-01T00:00:00Z" },
            { _id: "new", createdAt: "2026-05-01T00:00:00Z" },
          ],
        },
      },
    });
    // WHY: rows are sorted descending so the most recent note appears first.
    expect(result.current.renderRows[0].key).toContain("new");
    expect(result.current.renderRows[1].key).toContain("old");
  });

  it("paginates documents using page + limit", () => {
    const docs = Array.from({ length: 3 }, (_, i) => ({
      _id: `doc-${i}`,
      createdAt: `2026-01-0${i + 1}T00:00:00Z`,
    }));
    const { result } = renderData({
      limit: 2,
      page: 2,
      documents: { data: { contactNote: docs } },
    });
    // WHY: 3 docs / limit 2 => 2 pages; page 2 holds the single remaining row.
    expect(result.current.totalDocumentPages).toBe(2);
    expect(result.current.renderRows).toHaveLength(1);
  });

  it("maps a MARS medication row with its fixed title", () => {
    const { result } = renderData({
      medication: {
        data: {
          mars: [
            {
              _id: "med-test-001",
              patientId: "res-test-001",
              updatedAt: "2026-04-01T00:00:00Z",
            },
          ],
        },
      },
    });
    expect(result.current.renderMedRows).toHaveLength(1);
    // WHY: MARS rows always render the full record title and link to /mars/:id.
    expect(result.current.renderMedRows[0].props.title).toBe(
      "Medication Administration Record",
    );
    expect(result.current.renderMedRows[0].props.link).toBe(
      "/mars/res-test-001",
    );
  });

  it("filters medications by docType via searchMedication", () => {
    const { result } = renderData({
      searchMedication: "mars",
      medication: {
        data: {
          mars: [{ _id: "m1", updatedAt: "2026-04-01T00:00:00Z" }],
          mentalStatusReport: [
            { _id: "m2", createdAt: "2026-04-02T00:00:00Z" },
          ],
        },
      },
    });
    // WHY: only mars survives when searchMedication targets that key.
    expect(result.current.renderMedRows).toHaveLength(1);
    expect(result.current.totalMedPages).toBe(1);
  });

  it("maps a Resident Intake row using its signature branch", () => {
    const { result } = renderData({
      intake: {
        data: {
          residentIntake: [
            {
              _id: "int-test-001",
              createdAt: "2026-05-01T00:00:00Z",
              signatures: [
                {
                  sign: [
                    { signature: "Nurse", dateSigned: "2026-05-01T00:00:00Z" },
                  ],
                },
              ],
            },
          ],
        },
      },
    });
    expect(result.current.renderIntakeRows).toHaveLength(1);
    // WHY: Resident Intake builds its signature label inline (signature + date).
    expect(result.current.renderIntakeRows[0].props.title).toBe(
      "Resident Intake",
    );
    expect(result.current.renderIntakeRows[0].props.signature).toContain(
      "Nurse",
    );
  });

  it("maps a non-intake intake doc (treatment plan) through getSignature", () => {
    const { result } = renderData({
      intake: {
        data: {
          treatmentPlan: [
            {
              _id: "int-test-002",
              createdAt: "2026-05-02T00:00:00Z",
              signaturesBhp: { signature: "Dr", date: "2026-05-02T00:00:00Z" },
            },
          ],
        },
      },
    });
    expect(result.current.renderIntakeRows[0].props.title).toBe(
      "Behavioral Health Treatment Plan",
    );
    // WHY: non-intake intake rows reuse the shared getSignature formatter.
    expect(result.current.renderIntakeRows[0].props.signature).toBe(
      "SIGNATURE-STUB",
    );
    expect(result.current.totalIntakesPages).toBe(1);
  });

  it("hides edit/delete icons for a Guardian without permissions", () => {
    const { result } = renderData({
      profileUser: { userType: "Guardian", accountType: "regular" },
      documents: {
        data: {
          dischargeSummary: [
            { _id: "doc-test-006", createdAt: "2026-01-01T00:00:00Z" },
          ],
        },
      },
    });
    const row = result.current.renderRows[0];
    // WHY: a guardian is not Admin/Administrator and has no edit/delete codes,
    // so the action icons must be falsy.
    expect(row.props.deleteIcon).toBeFalsy();
    // WHY: guardians use the resident view path, not the employee one.
    expect(row.props.link).toBe(
      "/view-discharge-summary-resident/doc-test-006",
    );
  });

  it("does not crash and returns empty buckets when data fields are undefined", () => {
    const { result } = renderData({
      documents: undefined,
      medication: undefined,
      intake: undefined,
    });
    // WHY: the Search page may mount before any query resolves.
    expect(result.current.renderRows).toEqual([]);
    expect(result.current.renderMedRows).toEqual([]);
    expect(result.current.renderIntakeRows).toEqual([]);
  });
});

/** @format */

import { describe, it, expect, vi } from "vitest";
import {
  hasPatientRecord,
  normalizePatientRecord,
  getPatientDisplayName,
  resolveAdmitDate,
  resolveProgressNoteAdmit,
  applyResidentHeaderFields,
} from "./patientPopulate";

// Fake patient records only — never realistic PHI.
const PATIENT = { _id: "res-test-001", firstName: "Test", lastName: "Patient" };

describe("patientPopulate", () => {
  describe("hasPatientRecord", () => {
    it("should be true only for a non-array object with an _id", () => {
      expect(hasPatientRecord(PATIENT)).toBe(true);
    });

    it.each([
      ["null", null],
      ["an array", [PATIENT]],
      ["an object without _id", { firstName: "Test" }],
    ])("should be false for %s", (_label, value) => {
      expect(hasPatientRecord(value)).toBe(false);
    });
  });

  describe("normalizePatientRecord", () => {
    it("should unwrap a record nested under data", () => {
      expect(normalizePatientRecord({ data: PATIENT })).toEqual(PATIENT);
    });

    it("should return a bare patient object directly", () => {
      expect(normalizePatientRecord(PATIENT)).toEqual(PATIENT);
    });

    it("should unwrap a record nested under patient", () => {
      expect(normalizePatientRecord({ patient: PATIENT })).toEqual(PATIENT);
    });

    it("should use the fallback when nothing valid is found", () => {
      expect(normalizePatientRecord({ nope: true }, PATIENT)).toEqual(PATIENT);
    });

    it("should return null when nothing resolves", () => {
      expect(normalizePatientRecord({ nope: true })).toBeNull();
    });
  });

  describe("getPatientDisplayName", () => {
    it("should combine first and last name", () => {
      expect(getPatientDisplayName(PATIENT)).toBe("Test Patient");
    });

    it("should fall back to fullName when no first/last name", () => {
      expect(getPatientDisplayName({ fullName: "Test Patient" })).toBe(
        "Test Patient",
      );
    });

    it("should return an empty string for no patient", () => {
      expect(getPatientDisplayName(null)).toBe("");
    });
  });

  describe("resolveAdmitDate", () => {
    it("should prefer admitDate, then aliases", () => {
      expect(resolveAdmitDate({ admitDate: "2020-01-01" })).toBe("2020-01-01");
      expect(resolveAdmitDate({ dateOfAdmit: "2020-02-02" })).toBe(
        "2020-02-02",
      );
      expect(resolveAdmitDate({ admissionDate: "2020-03-03" })).toBe(
        "2020-03-03",
      );
    });

    it("should read a nested patientId admit date", () => {
      expect(resolveAdmitDate({ patientId: { admitDate: "2020-04-04" } })).toBe(
        "2020-04-04",
      );
    });

    it("should return an empty string when none present", () => {
      expect(resolveAdmitDate({})).toBe("");
    });
  });

  describe("resolveProgressNoteAdmit", () => {
    it("should resolve the admit date off a progress note's nested patient", () => {
      expect(
        resolveProgressNoteAdmit({ patientId: { admitDate: "2021-05-05" } }),
      ).toBe("2021-05-05");
    });
  });

  describe("applyResidentHeaderFields", () => {
    it("should call the provided setters with the patient's header values", () => {
      const setResidentName = vi.fn();
      const setDateOfBirth = vi.fn();
      const setDiagnosis = vi.fn();

      applyResidentHeaderFields(
        { ...PATIENT, dateOfBirth: "1990-01-01", diagnosis: "Test Dx" },
        { setResidentName, setDateOfBirth, setDiagnosis },
      );

      expect(setResidentName).toHaveBeenCalledWith("Test Patient");
      expect(setDateOfBirth).toHaveBeenCalledWith("1990-01-01");
      expect(setDiagnosis).toHaveBeenCalledWith("Test Dx");
    });

    it("should do nothing when the record is not a valid patient", () => {
      const setResidentName = vi.fn();
      applyResidentHeaderFields(null, { setResidentName });
      expect(setResidentName).not.toHaveBeenCalled();
    });
  });
});

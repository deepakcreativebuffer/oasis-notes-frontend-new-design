/** @format */

import { describe, it, expect, beforeEach, vi } from "vitest";

import { buildPatientInformationProps } from "./patientInformationProps";
import { PATIENT_INFORMATION_SECTION_PROP_KEYS } from "./PatientInformationSection";

// WHY: PatientInformationSection.jsx pulls in heavy deps (react-datepicker,
// PatientComponent, etc.). buildPatientInformationProps only needs the
// PROP_KEYS list, so we mock the sibling to a controlled key list to keep this
// a fast, pure-module test with deterministic keys.
const mocks = vi.hoisted(() => ({
  PROP_KEYS: ["residentName", "dob", "sex", "setResidentName", "getApiData"],
}));

vi.mock("./PatientInformationSection", () => ({
  __esModule: true,
  default: () => null,
  PATIENT_INFORMATION_SECTION_PROP_KEYS: mocks.PROP_KEYS,
}));

describe("buildPatientInformationProps", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should export buildPatientInformationProps as a function", () => {
    expect(typeof buildPatientInformationProps).toBe("function");
  });

  it("should pick exactly the keys listed in PATIENT_INFORMATION_SECTION_PROP_KEYS", () => {
    const scope = {
      residentName: "Test Patient",
      dob: "1990-01-01",
      sex: "Female",
      setResidentName: () => {},
      getApiData: () => {},
      // WHY: extra keys not in the prop list must be excluded from output.
      extraNoise: "should-not-appear",
      mrn: "MRN-TEST-001",
    };

    const props = buildPatientInformationProps(scope);

    expect(Object.keys(props).sort()).toEqual(
      [...PATIENT_INFORMATION_SECTION_PROP_KEYS].sort(),
    );
    expect(props).not.toHaveProperty("extraNoise");
    expect(props).not.toHaveProperty("mrn");
  });

  it("should copy values by reference for each requested key", () => {
    const setter = () => {};
    const apiFn = () => {};
    const scope = {
      residentName: "Test Patient",
      dob: "1990-01-01",
      sex: "Male",
      setResidentName: setter,
      getApiData: apiFn,
    };

    const props = buildPatientInformationProps(scope);

    expect(props.residentName).toBe("Test Patient");
    expect(props.dob).toBe("1990-01-01");
    expect(props.sex).toBe("Male");
    // WHY: function handlers must be passed through untouched (same reference).
    expect(props.setResidentName).toBe(setter);
    expect(props.getApiData).toBe(apiFn);
  });

  it("should assign undefined for keys missing from scope rather than dropping them", () => {
    // WHY: the loop reads scope[key] for every key, so absent keys yield
    // undefined values but the key still exists on the result object.
    const props = buildPatientInformationProps({
      residentName: "Test Patient",
    });

    expect(props).toHaveProperty("dob");
    expect(props.dob).toBeUndefined();
    expect(props.residentName).toBe("Test Patient");
    expect(Object.keys(props)).toHaveLength(
      PATIENT_INFORMATION_SECTION_PROP_KEYS.length,
    );
  });

  it("should return an empty-ish object shape even for an empty scope", () => {
    const props = buildPatientInformationProps({});

    expect(Object.keys(props)).toEqual(PATIENT_INFORMATION_SECTION_PROP_KEYS);
    Object.values(props).forEach((v) => expect(v).toBeUndefined());
  });
});

/** @format */

import { DateFormatter } from "./Makers";

export const hasPatientRecord = (patient) =>
  Boolean(
    patient &&
    typeof patient === "object" &&
    !Array.isArray(patient) &&
    patient._id,
  );

/** Unwrap getApi / search payloads to a single patient object */
export const normalizePatientRecord = (responseOrPatient, fallback) => {
  const unwrap = (value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return null;
    }
    if (hasPatientRecord(value)) return value;
    if (hasPatientRecord(value.data)) return value.data;
    if (hasPatientRecord(value.patient)) return value.patient;
    if (hasPatientRecord(value.patientId)) return value.patientId;
    return null;
  };

  return (
    unwrap(responseOrPatient?.data) ??
    unwrap(responseOrPatient) ??
    (hasPatientRecord(fallback) ? fallback : null)
  );
};

export const getPatientDisplayName = (patient) => {
  if (!patient) return "";
  if (patient.firstName || patient.lastName) {
    return `${patient.firstName || ""} ${patient.lastName || ""}`.trim();
  }
  return patient.fullName || "";
};

export const resolveAdmitDate = (patient) => {
  if (!patient) return "";
  const nested =
    typeof patient.patientId === "object" ? patient.patientId : null;
  return (
    patient.admitDate ??
    patient.dateOfAdmit ??
    patient.admissionDate ??
    nested?.admitDate ??
    ""
  );
};

export const formatAdmitForForm = (admit) => {
  if (!admit) return "";
  const d = new Date(admit);
  if (Number.isNaN(d.getTime())) {
    return typeof admit === "string" ? admit : "";
  }
  return DateFormatter(admit) || "";
};

/** Admit date saved on the progress note or nested patient */
export const resolveProgressNoteAdmit = (progressNote) => {
  if (!progressNote) return "";
  const patient =
    typeof progressNote.patientId === "object" ? progressNote.patientId : null;
  return resolveAdmitDate({
    ...progressNote,
    patientId: patient,
  });
};

/** Populate common resident header fields used on create forms */
export const applyResidentHeaderFields = (patient, setters = {}) => {
  const record = normalizePatientRecord(patient);
  if (!hasPatientRecord(record)) return;

  const {
    setDateOfBirth,
    setAdmitDate,
    setAhcccsId,
    setDiagnosis,
    setResidentName,
    formatAdmitWithDateFormatter = true,
  } = setters;

  if (setDateOfBirth) setDateOfBirth(record.dateOfBirth ?? "");
  if (setAdmitDate) {
    const admit = resolveAdmitDate(record);
    setAdmitDate(
      formatAdmitWithDateFormatter ? formatAdmitForForm(admit) : admit,
    );
  }
  if (setAhcccsId) {
    const nested =
      typeof record.patientId === "object" ? record.patientId : null;
    setAhcccsId(record.ahcccsId ?? nested?.ahcccsId ?? "");
  }
  if (setDiagnosis) setDiagnosis(record.diagnosis ?? "");
  if (setResidentName) setResidentName(getPatientDisplayName(record));
};

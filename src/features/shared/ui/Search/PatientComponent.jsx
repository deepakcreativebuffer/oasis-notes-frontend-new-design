/** @format */

import React, { useState } from "react";
import SearchPatients from "./SearchPatients";
import Form from "react-bootstrap/Form";
import { patientService } from "../../services";
import {
  getPatientDisplayName,
  normalizePatientRecord,
} from "@/utils/patientPopulate";

const PatientComponent = ({
  className,
  MainPatientId,
  MainResidentName,
  setWholeData,
  mars,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [residentName, setResidentName] = useState("");

  const applyName = (patient) => {
    const name = getPatientDisplayName(patient);
    if (!name) return;
    setResidentName(name);
    if (MainResidentName) {
      MainResidentName(name);
    }
  };

  const patientHandler = (patient) => {
    if (!patient?._id) return;

    if (MainPatientId) {
      MainPatientId(patient._id);
    }
    applyName(patient);
    setIsOpen(false);

    const deliverPatient = (record) => {
      const resolved = normalizePatientRecord(record, patient);
      if (setWholeData && resolved) {
        setWholeData(resolved);
      }
    };

    // Search list is partial — load full patient so admit date and other fields populate
    patientService.getById(patient._id, {
      setResponse: (res) => deliverPatient(res),
      setErrorMessage: () => deliverPatient(patient),
    });
  };

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className={`${className} absolute-container view-details-grid-inline resident-name-print`}
    >
      <Form.Label className="fw-bold">Resident Name : </Form.Label>
      <Form.Label
        className="cursor-pointer mx-2"
        onClick={() => setIsOpen(true)}
      >
        {residentName ? residentName : " Select Resident"}
      </Form.Label>
      <SearchPatients
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        clickHandler={patientHandler}
        residentName={residentName}
        mars={mars}
      />
    </div>
  );
};

export default PatientComponent;

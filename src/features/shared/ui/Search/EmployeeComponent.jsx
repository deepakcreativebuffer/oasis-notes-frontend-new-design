/** @format */

import React, { useState } from "react";
import SearchEmployees from "./SearchEmployees";

const EmployeeComponent = ({
  className,
  MainPatientId,
  MainResidentName,
  setWholeData,
  mars,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [residentName, setResidentName] = useState("");

  const patientHandler = (e) => {
    if (MainPatientId) {
      MainPatientId(e._id);
    }
    if (e?.firstName || e?.lastName) {
      setResidentName(`${e?.firstName} ${e?.lastName}`);
      if (MainResidentName) {
        MainResidentName(`${e?.firstName} ${e?.lastName}`);
      }
    } else {
      setResidentName(e?.fullName);
      if (MainResidentName) {
        MainResidentName(`${e?.fullName}`);
      }
    }
    if (setWholeData) {
      setWholeData(e);
    }
    setIsOpen(false);
  };

  return (
    <div
      onMouseLeave={() => setIsOpen(false)}
      className={`${className} absolute-container d-flex`}
    >
      <label className="increse-size fw-bold">Employee Name : </label>
      <label
        className="cursor-pointer mx-2 increse-size"
        onClick={() => setIsOpen(true)}
      >
        {residentName ? residentName : " Select Employee"}
      </label>
      <SearchEmployees
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        clickHandler={patientHandler}
        residentName={residentName}
        mars={mars}
      />
    </div>
  );
};

export default EmployeeComponent;

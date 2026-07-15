/** @format */
import React from "react";

function SelectTrueFalse({ value, onChange }) {
  return (
    <>
      <span className="show-print-inline hidden">{value ? "Yes" : "No"}</span>
      <select className="hidePrint" value={value} onChange={onChange}>
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>
    </>
  );
}

export default SelectTrueFalse;

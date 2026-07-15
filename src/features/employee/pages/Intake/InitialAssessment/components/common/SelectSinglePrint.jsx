/** @format */

import React from "react";
import Select from "@/features/shared/ui/Search/Search";
import "./SelectSinglePrint.css";

/** Matches default react-select focus (reference dropdown appearance). */
const FOCUS_BORDER = "#2684FF";
const DEFAULT_BORDER = "#ced4da";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "38px",
    borderRadius: "4px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: state.isFocused ? FOCUS_BORDER : DEFAULT_BORDER,
    boxShadow: "none",
    backgroundColor: "#fff",
    outline: "none",
    cursor: "text",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "2px 8px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6c757d",
  }),
  input: (base) => ({
    ...base,
    border: "none",
    borderWidth: 0,
    boxShadow: "none",
    outline: "none",
    margin: 0,
    padding: 0,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    paddingRight: "4px",
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "4px",
    border: `1px solid ${DEFAULT_BORDER}`,
    boxShadow: "0 4px 11px rgba(0, 0, 0, 0.1)",
    zIndex: 5,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#DEEBFF" : "#fff",
    color: "#212529",
    cursor: "pointer",
  }),
};

/** Print-friendly single select (shows label when printing). */
export default function SelectSinglePrint({
  value,
  onChange,
  options,
  isCreatable,
  onKeyDown,
}) {
  const optionsWithSelect = [
    { label: "Select", value: "" },
    ...(options || []),
  ];

  return (
    <>
      <span className="show-print-inline hidden">{value?.label}</span>
      <div className="hidePrint">
        <Select
          className="w-100"
          classNamePrefix="ia-select-single"
          value={value}
          onChange={onChange}
          options={optionsWithSelect}
          isCreatable={isCreatable}
          placeholder="Select..."
          onKeyDown={onKeyDown || onChange}
          styles={selectStyles}
        />
      </div>
    </>
  );
}

import React from "react";
import CustomMultiSelectInput from "@/features/shared/ui/selectors/CustomMultiSelectInput";
import ReactQuill from "react-quill";

export function DateInput({ value, onChange, id }) {
  return (
    <>
      <input className="show-print-inline hidden" type="text" value={value} />
      <input
        type="date"
        id={id}
        className="hidePrint"
        value={value}
        placeholder="DD/MM/YYYY"
        onChange={onChange}
      />
    </>
  );
}
export function SelectMultiPrint({
  value,
  onChange,
  options,
  isCreatable,
  onKeyDown,
  isDisabled,
}) {
  return (
    <>
      <span className="show-print-inline hidden">
        {Array.isArray(value)
          ? value?.map((val) => val?.label)?.join(", ")
          : value?.label}
      </span>
      <div className="hidePrint">
        <CustomMultiSelectInput
          multiselect={true}
          value={value}
          onChange={(value) => onChange(value)}
          options={options}
          className="custom-select"
          maxHeightProp={200}
          isDisabled={isDisabled}
        />
      </div>
    </>
  );
}
export function TextAreaPrint({
  className,
  rows,
  value,
  placeholder,
  onChange,
  onKeyDown,
}) {
  return (
    <>
      <span className="show-print-inline hidden">{value}</span>
      <div className="hidePrint">
        <textarea
          className={className + "w-100"}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </>
  );
}
export function renderComment(value) {
  if (!value) return <span>-</span>;

  // Check if value contains any HTML tags
  const isHTML = /<\/?[a-z][\s\S]*>/i.test(value);
  if (isHTML) {
    return <ReactQuill theme="bubble" value={value} readOnly={true} />;
  } else {
    return <span>{value}</span>;
  }
}

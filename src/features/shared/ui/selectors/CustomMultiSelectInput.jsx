/** @format */

import React, { useEffect, useRef, useState } from "react";
import CreatableSelect from "react-select/creatable";

const CustomMultiSelectInput = ({
  multiselect = true,
  value,
  onChange,
  options = [],
  onKeyDown,
  className,
  isDisabled,
  maxHeightProp,
  showValue = true,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [currentOptions, setCurrentOptions] = useState(options || []);
  const containerRef = useRef(null);

  useEffect(() => {
    setCurrentOptions(options);
  }, [options]);

  const handleKeyDown = (event) => {
    if (onKeyDown) {
      onKeyDown(event);
    }
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      const newOption = createOption(inputValue);
      setCurrentOptions((prev) => [...prev, newOption]);
      setInputValue("");
      const newValue = Array.isArray(value)
        ? [...value, newOption]
        : [newOption];
      onChange(newValue);
      event.preventDefault();
    }
  };

  const createOption = (label) => ({
    label,
    value: label,
  });

  const componentsProp = showValue ? {} : { MultiValue: () => null };

  return (
    <div ref={containerRef}>
      <CreatableSelect
        inputValue={inputValue}
        classNamePrefix="custom-select"
        isClearable
        isMulti={multiselect}
        onChange={onChange}
        onInputChange={setInputValue}
        onKeyDown={handleKeyDown}
        placeholder="Type and select..."
        value={value}
        options={currentOptions}
        className={className}
        isDisabled={isDisabled}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          container: (base) => ({
            ...base,
            maxWidth: "100%",
          }),
          control: (base) => ({
            ...base,
            whiteSpace: "normal",
            touchAction: "manipulation",
          }),
          valueContainer: (base) => ({
            ...base,
            maxHeight: maxHeightProp ? `${maxHeightProp}px` : "none",
            overflowY: maxHeightProp ? "auto" : "visible",
            flexWrap: "wrap",
          }),
        }}
        components={componentsProp}
        noOptionsMessage={() =>
          !currentOptions || currentOptions.length === 0
            ? "Type to Create..."
            : "No options found"
        }
      />
    </div>
  );
};

export default CustomMultiSelectInput;

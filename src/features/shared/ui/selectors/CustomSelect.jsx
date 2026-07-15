/** @format */

import { useState, useEffect, useRef, useMemo } from "react";

const normalizeOption = (option) => {
  if (option == null) return null;
  if (typeof option === "string") {
    return { label: option, value: option };
  }
  return {
    label: option.label ?? option.value ?? String(option),
    value: option.value ?? option.label ?? option,
  };
};

/**
 * Searchable select — supports string[] or { label, value }[] (Employee + Resident + Guardian).
 */
const CustomSelect = ({
  options = [],
  onChange,
  styleOpt,
  value,
  required: isRequired = false,
  /** When true, filters options as user types (resident appointment / tracking flows). */
  filterOnType = false,
  placeholder = "Type to search or select",
}) => {
  const normalizedOptions = useMemo(
    () => (options || []).map(normalizeOption).filter(Boolean),
    [options],
  );

  const [inputValue, setInputValue] = useState("");
  const [displayFallback, setDisplayFallback] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(normalizedOptions);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(normalizedOptions);
  }, [normalizedOptions]);

  useEffect(() => {
    if (value == null || value === "") return;

    if (filterOnType) {
      const display =
        typeof value === "string"
          ? value
          : Array.isArray(value)
            ? value.join(",")
            : (value?.label ?? String(value));
      setInputValue(display);
      return;
    }

    if (!inputValue) {
      const display = Array.isArray(value)
        ? value.join(",")
        : typeof value === "object" && value !== null
          ? (value.label ?? value.value)
          : String(value);
      setDisplayFallback(display ?? "");
    }
  }, [value, filterOnType, inputValue]);

  const handleInputChange = (e) => {
    const next = e.target.value;
    setInputValue(next);
    setIsOpen(true);
    onChange?.(next);

    if (filterOnType) {
      setFilteredOptions(
        normalizedOptions.filter((option) =>
          option.label.toLowerCase().includes(next.toLowerCase()),
        ),
      );
    }
  };

  const handleOptionClick = (option) => {
    setInputValue(option.label);
    setDisplayFallback(option.label);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayValue = inputValue || displayFallback;

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onClick={() => setIsOpen(true)}
        placeholder={placeholder}
        className="custom-select-input"
        required={isRequired}
        style={styleOpt}
      />
      {isOpen && (
        <div className="custom-options-container">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                className="custom-option"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="custom-no-options">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

/** @format */

import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Custommultiselect.css";
import { showNotification } from "@/utils";

const notifyMaxSelection = (max) => {
  showNotification({
    message: `You can only select up to ${max} options.`,
    type: "info",
  });
};

/**
 * Multi-select dropdown (Admin + Employee + Resident).
 * @param {boolean} allowCustomOptions - enables AddCustomMultiSelect behavior (Enter to add custom values)
 */
const CustomMultiSelect = ({
  options = [],
  selected = [],
  onChange,
  max,
  allowCustomOptions = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [customOptions, setCustomOptions] = useState([]);
  const dropdownRef = useRef(null);
  const dropdownIconRef = useRef(null);

  const allOptions = allowCustomOptions
    ? [
        ...new Map(
          [...options, ...customOptions].map((item) => [item?.value, item]),
        ).values(),
      ]
    : options;

  const isAllSelected = selected?.length === allOptions?.length;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    if (!option) return;
    if (allowCustomOptions && (!option?.label || !option?.value)) return;

    if (selected?.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else if (max != null && (selected?.length || 0) >= max) {
      notifyMaxSelection(max);
    } else {
      onChange([...(selected || []), option]);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(allowCustomOptions ? [...options, ...customOptions] : options);
    }
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !dropdownIconRef.current?.contains(event.target)
    ) {
      setIsOpen(false);
      setSearch("");
      if (allowCustomOptions) setInputValue("");
    }
  };

  const handleAddCustomOption = (event) => {
    if (event.key === "Enter" && inputValue.trim()) {
      const newOption = { label: inputValue.trim(), value: inputValue.trim() };
      setCustomOptions((prev) => [...prev, newOption]);
      setInputValue("");
      handleSelect(newOption);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable outside-click listener
  }, []);

  useEffect(() => {
    if (!allowCustomOptions) return;
    const newCustomOptions = (selected || []).filter(
      (item) => !options.find((option) => option?.value === item?.value),
    );
    if (newCustomOptions?.length > 0) {
      setCustomOptions((prev) => {
        const merged = [...prev];
        newCustomOptions.forEach((item) => {
          if (!merged.find((c) => c?.value === item?.value)) {
            merged.push(item);
          }
        });
        return merged;
      });
    }
  }, [selected, options, allowCustomOptions]);

  const filteredOptions = (allowCustomOptions ? allOptions : options)?.filter(
    (option) => option?.label?.toLowerCase()?.includes(search?.toLowerCase()),
  );

  return (
    <div className="cus-multi-select">
      <div className="cus-select-box">
        <div className="all-list-data">
          {(selected &&
            selected.map((item, index) => (
              <span key={index}>{item?.label}</span>
            ))) ||
            "Select items..."}
        </div>
        <span
          className="cus-arrow"
          ref={dropdownIconRef}
          onClick={toggleDropdown}
        >
          {isOpen ? "▲" : "▼"}
        </span>
      </div>
      {isOpen && (
        <div className="cus-dropdown" ref={dropdownRef}>
          {allowCustomOptions ? (
            <input
              type="text"
              className="px-1 py-1 w-[90%] mx-1 my-1 border border-gray-300 focus:border-gray-300 focus:ring-0 outline-none"
              placeholder="Type to add..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddCustomOption}
            />
          ) : (
            <input
              type="text"
              className="px-1 py-1 w-[90%] mx-1 my-1 border border-gray-300 focus:border-gray-300 focus:ring-0 outline-none"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
          {!max && (
            <div className="cus-dropdown-item" onClick={handleSelectAll}>
              {isAllSelected ? "Deselect All" : "Select All"}
            </div>
          )}
          {filteredOptions?.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className="cus-dropdown-item"
                onClick={() => handleSelect(option)}
              >
                <input
                  type="checkbox"
                  checked={selected?.includes(option)}
                  readOnly
                />
                {option.label}
              </div>
            ))
          ) : (
            <div className="cus-dropdown-item text-muted">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomMultiSelect;

CustomMultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  selected: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  max: PropTypes.number,
  allowCustomOptions: PropTypes.bool,
};

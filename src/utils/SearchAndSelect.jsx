import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

const SearchAndSelect = ({
  options,
  selectedValue,
  setSelectedValue,
  text,
  isOtherState = false,
  otherType = "",
  otherState,
  setPage,
}) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [searchText, setSearchText] = useState(""); // Track search input

  const handleSearch = (inputValue) => {
    setSearchText(inputValue); // Update search text
    if (!inputValue) {
      setFilteredOptions(options);
      return;
    }

    const matchedOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
    setFilteredOptions(matchedOptions);
  };

  const handleChange = (value) => {
    setSelectedValue(value);
    setSearchText("");
    if (setPage) {
      setPage(1);
    }
    setFilteredOptions(options);
    if (isOtherState) {
      otherState(otherType, value);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">{text}</span>
      <Select
        showSearch
        value={selectedValue}
        placeholder="Select or Serach"
        onSearch={handleSearch}
        onChange={handleChange}
        filterOption={false}
        searchValue={searchText}
        style={{ minWidth: "250px" }}
      >
        {filteredOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export { SearchAndSelect };

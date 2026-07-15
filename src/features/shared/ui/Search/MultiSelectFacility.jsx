/** @format */

import { MultiSelect } from "react-multi-select-component";

const MultiSelectFacility = ({ setValue, value = [], data }) => {
  let options = [];

  options = (data || [])?.map((i) => ({
    value: i._id,
    label: i.name,
  }));

  const handleChange = (selected) => {
    setValue(selected);
  };

  return (
    <>
      {options && (
        <MultiSelect
          options={options}
          value={value}
          onChange={handleChange}
          hasSelectAll={false}
          overrideStrings={{
            selectSomeItems: "Select...",
            allItemsAreSelected: value?.map((item) => item?.label).join(", "),
          }}
          labelledBy="Select facility"
        />
      )}
    </>
  );
};

export default MultiSelectFacility;

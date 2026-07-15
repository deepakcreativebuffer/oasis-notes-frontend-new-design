/** @format */

import { useEffect, useState } from "react";
import { fetchPaitentName } from "@/utils/utils";
import { MultiSelect } from "react-multi-select-component";
import { employeeService } from "../../services";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";

import { ROLES, ACCOUNT_TYPES } from "../../constants";

const MultiEmployee = ({
  setValue,
  value = [],
  onlyAdministrator,
  alsoResident = false,
  onlyResident = false,
}) => {
  const [data, setData] = useState({});
  const currentUser = useSelector(userProfile);

  useEffect(() => {
    employeeService.listActive({
      isAdmin: currentUser?.userType === ROLES.ADMIN,
      setResponse: setData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredOptions = !onlyAdministrator
    ? data?.data
    : data?.data?.filter((i) => i.accountType === ACCOUNT_TYPES.ADMINISTRATOR);
  let options = filteredOptions;

  if (!alsoResident)
    options = (filteredOptions || []).filter(
      (i) => i.userType === ROLES.EMPLOYEE,
    );

  if (onlyResident)
    options = (filteredOptions || []).filter(
      (i) => i.userType === ROLES.PATIENT,
    );

  options = (options || [])
    ?.map((i) => ({
      value: i._id,
      label: fetchPaitentName(i),
      type: i.userType,
    }))
    .filter((i) => i.value !== currentUser._id);

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
          labelledBy="Select Employees"
        />
      )}
    </>
  );
};

export default MultiEmployee;

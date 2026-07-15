/** @format */

import { useEffect, useState } from "react";
import { fetchPaitentName } from "@/utils/utils";
import Select from "./Search";
import { employeeService } from "../../services";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
const SignerEmployee = ({ setValue, value = [], options: singerOptions }) => {
  const [data, setData] = useState({});
  const currentUser = useSelector(userProfile);
  useEffect(() => {
    if (singerOptions) {
      setData(singerOptions);
    } else {
      employeeService.getEmployee({
        setResponse: setData,
      });
    }
  }, [singerOptions]);
  const options = data?.data
    ?.map((i) => ({
      value: i._id,
      label: fetchPaitentName(i),
    }))
    .filter((i) => i.value !== currentUser._id);
  const handleChange = (selected) => {
    setValue(selected);
  };
  return (
    <>
      {options && (
        <Select
          options={options}
          value={value}
          onChange={handleChange}
          labelledBy="Select Employees"
        />
      )}
    </>
  );
};
export default SignerEmployee;

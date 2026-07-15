/** @format */
import React from "react";

export const ColourOption = ({ innerRef, innerProps, data }) => (
  <div
    ref={innerRef}
    {...innerProps}
    className=" flex items-center p-2 cursor-pointer"
  >
    <span
      className={`w-5 h-5 inline-block mr-2`}
      style={{
        backgroundColor: data.value,
      }}
    />
    {data.label}
  </div>
);
export const ColourSingleValue = ({ data }) => (
  <div className="flex items-center">
    <span
      className={`w-5 h-5 block mr-2`}
      style={{
        backgroundColor: data.value,
      }}
    />
    {data.label}
  </div>
);

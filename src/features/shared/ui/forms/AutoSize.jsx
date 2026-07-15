/** @format */

import { useRef, useEffect } from "react";

/**
 * Auto-growing single-line input (intake forms — Employee + Resident + Guardian).
 */
export function AutoSize({
  type: type1,
  value,
  setValue,
  placeholder,
  disabled,
  fontFamily = "14px Quicksand, Arial, sans-serif",
  widthPadding = 10,
}) {
  const inputRef = useRef(null);

  const calculateWidth = (text = "") => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = fontFamily;
    return context.measureText(text).width + widthPadding;
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${calculateWidth(value || "")}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- matches legacy AutoSize behavior
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const textWidth = value?.length ? calculateWidth(value) : 40;

  const inputStyle = {
    borderRadius: "4px",
    padding: "5px",
    fontSize: "14px",
    width: `${textWidth}px`,
    minWidth: "25px",
    maxWidth: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <style>{`
        .hide-spinners::-webkit-inner-spin-button,
        .hide-spinners::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-spinners {
          -moz-appearance: textfield;
        }
      `}</style>
      <input
        ref={inputRef}
        className="hide-spinners"
        {...(type1 ? { type: type1 } : { type: "text" })}
        style={inputStyle}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
      />
    </>
  );
}

export default AutoSize;

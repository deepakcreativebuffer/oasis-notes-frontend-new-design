/** @format */

import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import CreatableSelect from "react-select/creatable";

export const InputMaker = ({ label, setState, placeholder, type, value }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setState(e.target.value)}
      />
    </Form.Group>
  );
};

export const RadioMaker = ({
  name,
  setValue,
  value,
  id,
  label,
  checked,
  disabled,
  disableRadio,
}) => {
  return (
    <Form.Check inline type={"radio"}>
      <Form.Check.Input
        type={"radio"}
        name={name}
        value={value}
        onChange={() => (disableRadio ? "" : setValue(value))}
        id={id}
        checked={value === checked}
        className="form-check-input"
        disabled={disabled}
      />
      <Form.Check.Label className="form-check-label" htmlFor={id}>
        {" "}
        {label}{" "}
      </Form.Check.Label>
    </Form.Check>
  );
};

export const CheckBoxMaker = ({
  setValue,
  value,
  label,
  checked,
  id,
  className,
}) => {
  return (
    <Form.Check
      inline
      type={"checkbox"}
      onChange={() => setValue(value)}
      label={label}
      checked={checked}
      id={id}
      className={className}
    />
  );
};

export const SelectMaker = ({ setValue, options, label, value }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold">{label}</Form.Label>
      <Form.Select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">Select</option>
        {options?.map((i, index) => (
          <option value={i.value} key={index}>
            {" "}
            {i.label}{" "}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export const MultiSelect = ({
  options,
  setValue,
  value,
  inputValue,
  disabled,
  setTemp,
  isMulti = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.removeEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen((is) => !is)}
      onTouchEnd={() => setIsOpen(true)}
    >
      <CreatableSelect
        isMulti={isMulti}
        isDisabled={disabled}
        menuIsOpen={isOpen}
        value={value}
        options={options}
        onChange={(e) => {
          setValue(e);
          if (typeof setTemp === "function") {
            setTemp(true);
          }
        }}
        onInputChange={(input) => {
          if (inputValue) {
            inputValue(input);
          }
        }}
      />
    </div>
  );
};

export const ReactSelectNormal = ({ options, setValue, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} onClick={() => setIsOpen((is) => !is)}>
      <CreatableSelect
        value={value}
        options={options}
        menuIsOpen={isOpen}
        onChange={(e) => setValue(e)}
      />
    </div>
  );
};

export function DateFormatter(date) {
  if (date) {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  }
}

export const TextareaMaker = ({
  label,
  setValue,
  value,
  placeholder,
  row,
  required,
  disabled,
}) => {
  return (
    <Form.Group className="mb-3 w-100">
      <Form.Label className="fw-bold">{label}:</Form.Label>
      <Form.Control
        disabled={disabled}
        required={required}
        onChange={(e) => setValue(e.target.value)}
        as={"textarea"}
        rows={row || 3}
        value={value}
        placeholder={placeholder}
      />
    </Form.Group>
  );
};

export const BorderlessInput = ({
  onChange = null,
  setState,
  placeholder,
  type = "text",
  value,
  className,
  disabled,
  style,
}) => {
  const handler = !!onChange ? onChange : (e) => setState(e.target.value);
  return (
    <input
      style={style}
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled && disabled}
      min={type === "number" ? 0 : ""}
      onChange={handler}
      className={`borderless_input ${className ? className : ""}`}
    />
  );
};

export const BorderlessSelect = ({
  options,
  setState,
  value,
  noSelectOption,
  disabled,
  setOtherState,
  isOtherState = false,
  required = false,
}) => {
  return (
    <Form.Select
      disabled={disabled}
      onChange={(e) => {
        const selectedValue = e.target.value;
        setState(selectedValue);
        if (isOtherState) {
          const selectedOption = options.find(
            (opt) => opt.value === selectedValue,
          );
          if (selectedOption) {
            setOtherState(selectedOption.id);
          }
        }
      }}
      required={required}
      onClick={(e) => {
        if (isOtherState) {
          const selectedValue = e.target.value;
          const selectedOption = options.find(
            (opt) => opt.value === selectedValue,
          );
          if (selectedOption) {
            setOtherState(selectedOption.id);
          }
        }
      }}
      value={value}
    >
      {!noSelectOption && <option value="">Select</option>}
      {options?.map((i) => (
        <option value={i.value} title={i.tooltip} key={i.value}>
          {i.label}
        </option>
      ))}
    </Form.Select>
  );
};

export const DefaultInput = ({ value, isBots = false, label }) => {
  return isBots ? (
    <Form.Group className="mb-3">
      <Form.Label className="fw-bold"> {label} </Form.Label>
      <Form.Control defaultValue={value} disabled />
    </Form.Group>
  ) : (
    <Form.Control defaultValue={value} disabled></Form.Control>
  );
};

export const DefaultCheckBox = ({
  label,
  checked = true,
  readOnly = false,
}) => {
  return (
    <Form.Check
      readOnly={readOnly}
      inline
      type={"checkbox"}
      label={label}
      checked={checked}
    />
  );
};

export const handleKeyDownResidentStrength = (
  event,
  options,
  setOptions,
  selectedOption,
) => {
  if (event.key === "Enter" && event.target.value) {
    const inputValue = event.target.value.trim();

    const optionExists = options.some((option) => option.value === inputValue);

    if (!optionExists) {
      const newOption = { value: inputValue, label: inputValue };

      // Update options array
      const newOptions = [...options, newOption];
      setOptions(newOptions);

      // Update the selected value
      setOptions(newOption);
    }

    // Clear input value
    event.target.value = "";
  }
};

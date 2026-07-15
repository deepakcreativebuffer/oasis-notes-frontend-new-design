/** @format */

/** Single-value creatable select (substance row fields, other-draft). */
export function createSingleSelectCreatableHandlers(staticOptions, setValue) {
  const handleKey = (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();
      const optionExists = staticOptions.some(
        (option) => option.value === inputValue,
      );
      if (!optionExists) {
        setValue({ value: inputValue, label: inputValue });
      }
      event.target.value = "";
    }
  };

  const handler = (optionValue) => {
    setValue(optionValue);
  };

  return { handleKey, handler, options: staticOptions };
}

/** Multi-select: Enter adds a custom option to the current value array. */
export function createMultiSelectEnterHandler(staticOptions, value, setValue) {
  return (event) => {
    if (event.key === "Enter" && event.target.value) {
      const inputValue = event.target.value.trim();
      const optionExists = staticOptions.some(
        (option) => option.value === inputValue,
      );
      if (!optionExists) {
        const current = Array.isArray(value) ? value : [];
        setValue([...current, { value: inputValue, label: inputValue }]);
      }
      event.target.value = "";
    }
  };
}

export function createMultiSelectChangeHandler(setValue) {
  return (selectedOptions) => {
    setValue(selectedOptions);
  };
}

/** Single multi-select change (reason for admission). */
export function createSingleMultiChangeHandler(setValue) {
  return (selectedOption) => {
    setValue(selectedOption);
  };
}

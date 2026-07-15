/** @format */

import { useCallback, useState } from "react";
import { QUALITIES_OPTIONS as DEFAULT_QUALITIES_OPTIONS } from "../config/assessmentFields";

/**
 * Resident strengths multi-select helpers (shared employee + resident forms).
 *
 * @param {object}   [options]
 * @param {Array}    [options.initialOptions] - dropdown option list
 * @param {Function} [options.externalSetResidentStrengths] - when provided,
 *   handleSelectChange will update this external setter instead of a local
 *   state.  Pass the parent form's setResidentStrengths here so the selected
 *   values are written to the state that is actually rendered.
 */
export function useResidentStrengths({
  initialOptions = DEFAULT_QUALITIES_OPTIONS,
  externalSetResidentStrengths,
} = {}) {
  const [qualitiesOptions, setQualitiesOptions] = useState(initialOptions);
  const [residentStrengths, setResidentStrengthsLocal] = useState([]);

  const setResidentStrengths =
    externalSetResidentStrengths || setResidentStrengthsLocal;

  const handleKeyDownResidentStrength = useCallback(
    (event) => {
      if (event.key === "Enter" && event.target.value) {
        const inputValue = event.target.value.trim();
        const optionExists = qualitiesOptions.some(
          (option) => option.value === inputValue,
        );
        if (!optionExists) {
          const newOption = { value: inputValue, label: inputValue };
          setQualitiesOptions((prev) => [...prev, newOption]);
        }
      }
    },
    [qualitiesOptions],
  );

  const handleSelectChange = useCallback(
    (selectedOptions) => {
      setResidentStrengths(selectedOptions);
    },
    [setResidentStrengths],
  );

  return {
    qualitiesOptions,
    residentStrengths,
    setResidentStrengths,
    handleKeyDownResidentStrength,
    handleSelectChange,
  };
}

import { useEffect, useRef } from "react";
import TextEditor from "../TextEditor/TextEditor";
import CustomMultiSelectInput from "../selectors/CustomMultiSelectInput";
import { sanitizeHtml } from "@/utils/security/sanitizeHtml";

const SelectMultiPrint = ({
  value,
  onChange,
  options,
  isCreatable,
  onKeyDown,
}) => {
  return (
    <>
      <span className="show-print-inline hidden">
        {Array.isArray(value)
          ? value?.map((val) => val?.label)?.join(", ")
          : value?.label}
      </span>
      <div className="hidePrint">
        <CustomMultiSelectInput
          multiselect={true}
          value={value}
          showValue={false}
          onChange={onChange}
          options={options}
          className="custom-select"
        />
      </div>
    </>
  );
};

const MultiSelectWithEditor = ({
  multiSelectValue,
  setMultiSelectValue,
  options,
  editorValue,
  setEditorValue,
}) => {
  const prevValueRef = useRef([]);

  const decodeHtml = (str = "") => {
    const txt = document.createElement("textarea");
    txt.innerHTML = sanitizeHtml(str);
    return txt.value.trim();
  };

  useEffect(() => {
    const liRegex = /<li.*?>(.*?)<\/li>/g;
    const existingLis = [];
    let match;
    while ((match = liRegex.exec(editorValue)) !== null) {
      existingLis.push(decodeHtml(match[1]));
    }

    const selectedLabels = multiSelectValue?.map((item) => item.label) || [];

    const customList = existingLis.filter((li) => !selectedLabels.includes(li));

    const finalLis = [
      ...selectedLabels.map((label) => `<li data-source="multi">${label}</li>`),
      ...customList.map((label) => `<li>${label}</li>`),
    ];
    const newBlock = `<ul>${finalLis.join("")}</ul>`;

    setEditorValue((prev) => {
      const regex = /<ul>[\s\S]*?<\/ul>/;
      return regex.test(prev) ? prev.replace(regex, newBlock) : prev + newBlock;
    });

    prevValueRef.current = multiSelectValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiSelectValue]);

  useEffect(() => {
    const liRegex = /<li.*?>(.*?)<\/li>/g;
    const existingLis = [];
    let match;
    while ((match = liRegex.exec(editorValue)) !== null) {
      existingLis.push(decodeHtml(match[1]));
    }

    const missingLabels = multiSelectValue
      ?.map((item) => item.label)
      ?.filter((label) => !existingLis.includes(label));

    if (missingLabels.length > 0) {
      const updatedValues = multiSelectValue.filter(
        (item) => !missingLabels.includes(item.label),
      );
      setMultiSelectValue(updatedValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorValue]);

  return (
    <div>
      <SelectMultiPrint
        value={multiSelectValue}
        onChange={setMultiSelectValue}
        options={options}
      />

      <TextEditor value={editorValue} setValue={setEditorValue} />
    </div>
  );
};

export default MultiSelectWithEditor;

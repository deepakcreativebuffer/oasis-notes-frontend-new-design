/** @format */

import React, { useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { logger } from "@/utils";
const TextEditor = ({
  setValue,
  value,
  read,
  height,
  width,
  defaultBullet = false,
}) => {
  const quillRef = useRef(null);
  const handleRef = React.useCallback((el) => {
    quillRef.current = el;
    // We don't apply the format here anymore, it's handled by useEffect below
    // to prevent focus stealing on every re-render.
  }, []);
  useEffect(() => {
    if (defaultBullet && quillRef.current) {
      try {
        const editor = quillRef.current.getEditor();
        editor.format("list", "bullet");
      } catch (error) {
        logger.warn("Quill editor not ready for bullet formatting", error);
      }
    }
  }, [defaultBullet]);
  const editorStyle =
    width && height
      ? {
          width,
          height,
        }
      : undefined;
  return (
    <ReactQuill
      ref={handleRef}
      theme="snow"
      value={value}
      onChange={setValue}
      readOnly={read}
      style={editorStyle}
    />
  );
};
export default TextEditor;

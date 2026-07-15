/** @format */
import { useState, useCallback, useEffect } from "react";
import { validateFile } from "@/utils/upload/uploadValidation";
import {
  getFilePreview,
  revokeFilePreview,
} from "@/utils/upload/uploadHelpers";
import { showNotification } from "@/utils";
/**
 * Hook to manage file selection, validation, and preview.
 */
export const useFileUpload = (options = {}) => {
  const {
    maxSizeMB = 2,
    allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
    autoClear = true,
  } = options;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clear preview when hook unmounts or file changes
  useEffect(() => {
    return () => {
      if (autoClear && preview) {
        revokeFilePreview(preview);
      }
    };
  }, [preview, autoClear]);
  const handleFileChange = useCallback(
    (selectedFile) => {
      if (!selectedFile) return;
      const validation = validateFile(selectedFile, {
        maxSizeMB,
        allowedTypes,
      });
      if (!validation.isValid) {
        setError(validation.message);
        showNotification({
          message: validation.message,
          type: "danger",
        });
        setFile(null);
        setPreview("");
        return false;
      }
      setError(null);
      setFile(selectedFile);

      // Create preview if it's an image
      if (selectedFile.type.startsWith("image/")) {
        const p = getFilePreview(selectedFile);
        setPreview(p);
      } else {
        setPreview(""); // Clear preview if not an image
      }
      return true;
    },
    [maxSizeMB, allowedTypes],
  );
  const onSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    handleFileChange(selectedFile);
  };
  const clearFile = () => {
    setFile(null);
    setPreview("");
    setError(null);
  };

  // Drag and Drop helpers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => {
    setIsDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const selectedFile = e.dataTransfer.files[0];
    handleFileChange(selectedFile);
  };
  return {
    file,
    preview,
    error,
    isDragging,
    onSelectFile,
    handleFileChange,
    clearFile,
    onDragOver,
    onDragLeave,
    onDrop,
  };
};

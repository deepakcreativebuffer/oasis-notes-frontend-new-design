/** @format */
import React from "react";
import { Form, ProgressBar } from "react-bootstrap";
import { useFileUpload } from "@shared/hooks";

/**
 * A reusable file upload component that handles selection, validation, and layout.
 */
const UnifiedFileUpload = ({
  label = "Choose File",
  accept = ".jpg,.png,.pdf",
  maxSizeMB = 2,
  allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
  onFileSelect,
  uploading = false,
  progress = 0,
  className = "",
  showPreview = true,
  required = false,
}) => {
  const {
    file,
    preview,
    error,
    onSelectFile,
    onDragOver,
    onDragLeave,
    onDrop,
    isDragging,
  } = useFileUpload({ maxSizeMB, allowedTypes });

  // Expose file to parent
  React.useEffect(() => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  }, [file, onFileSelect]);

  return (
    <div
      className={`unified-upload-container ${className} ${isDragging ? "dragging" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {label && (
        <Form.Label className="fw-bold">
          {label} {required && "*"}
        </Form.Label>
      )}

      <div className="upload-input-wrapper mb-3">
        <Form.Control
          type="file"
          accept={accept}
          onChange={onSelectFile}
          isInvalid={!!error}
          disabled={uploading}
        />
        {error && (
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        )}
      </div>

      {showPreview && preview && (
        <div className="upload-preview mb-3">
          <img
            src={preview}
            alt="Upload Preview"
            style={{ maxWidth: "100px", borderRadius: "8px" }}
          />
        </div>
      )}

      {uploading && progress > 0 && (
        <div className="upload-progress mb-3">
          <ProgressBar now={progress} label={`${progress}%`} animated />
        </div>
      )}

      <style jsx="true">{`
        .unified-upload-container {
          border: 2px dashed transparent;
          transition: all 0.3s ease;
          border-radius: 8px;
        }
        .unified-upload-container.dragging {
          border-color: #0c5c75;
          background-color: rgba(12, 92, 117, 0.05);
        }
      `}</style>
    </div>
  );
};

export default UnifiedFileUpload;

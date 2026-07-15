/** @format */
import { useState, memo, useRef } from "react";
import { Modal, Container } from "react-bootstrap";
import { useFileUpload } from "@shared/hooks";
import { employeeService, uploadDocument } from "../../services";
import { FilesNames } from "../../constants";
import { ClipLoader } from "react-spinners";
import CustomSelect from "../selectors/CustomSelect";
import { showNotification } from "@/utils";

export const DocumentUploaderEmployee = memo((props) => {
  const [fileType, setFileType] = useState("");
  const fileUpload = useFileUpload();
  const fileInputRef = useRef(null);
  const [arr, setArr] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const removeFile = (index) => {
    const filterThis = arr?.filter((_, i) => index !== i);
    setArr(filterThis);
  };
  const uploadFiles = async (e) => {
    e.preventDefault();
    if (!fileUpload.file) {
      showNotification({
        message: "Please select a file",
        type: "danger",
      });
      return;
    }
    const filePayload = new FormData();
    filePayload.append("file", fileUpload.file);
    filePayload.append("type", fileType);
    const res = await uploadDocument({
      payload: filePayload,
      setLoading: setUploading,
    });
    if (res?.success) {
      let docUrl = URL.createObjectURL(fileUpload.file);
      if (
        Array.isArray(res.data) &&
        res.data.length > 0 &&
        typeof res.data[0] === "string"
      ) {
        docUrl = res.data[0];
      } else if (res.data?.document) {
        docUrl = res.data.document;
      } else if (typeof res.data === "string") {
        docUrl = res.data;
      }
      setArr((prev) => [
        ...prev,
        {
          ...(typeof res.data === "object" && !Array.isArray(res.data)
            ? res.data
            : {}),
          type: res.data?.type || fileType,
          fileName:
            res.data?.fileName || res.data?.name || fileUpload.file.name,
          document: docUrl,
        },
      ]);
      fileUpload.clearFile();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const payload = {
    data: arr,
  };
  const submitHandler = () => {
    const additionalFunctions = [props.onHide];
    employeeService.uploadDocumentForEmployee(payload, {
      successMsg: "Uploaded !",
      setLoading: setSubmitLoading,
      additionalFunctions,
    });
  };
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="file-upload-modal">
        <Container className="full-width-container">
          <form onSubmit={uploadFiles}>
            <div className="close-header">
              <h5 id="contained-modal-title-vcenter">File Upload</h5>
              <button
                type="button"
                className="bg-transparent border-0 p-0"
                onClick={() => props.onHide()}
                aria-label="Close modal"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="wrapper">
              <div className="flexbox">
                <div className="items">
                  <span className="head">Actions</span>
                  <button type="submit" aria-label="Add additional files">
                    {uploading ? (
                      <ClipLoader color="#fff" />
                    ) : (
                      "Add Additional files"
                    )}
                  </button>
                </div>
                <div className="items">
                  <label className="head" htmlFor="emp-file-type-select">
                    File Type
                  </label>
                  <CustomSelect
                    id="emp-file-type-select"
                    options={FilesNames}
                    onChange={(value) => setFileType(value)}
                  />
                </div>
                <div className="items">
                  <label className="head" htmlFor="emp-file-name-input">
                    File Name
                  </label>
                  <input
                    id="emp-file-name-input"
                    type="file"
                    ref={fileInputRef}
                    onChange={fileUpload.onSelectFile}
                    aria-label="Select file to upload"
                  />
                </div>
              </div>

              <table
                className="colored_table mt-3"
                aria-label="Uploaded files list"
              >
                <thead>
                  <tr>
                    <th className="text-start">Type</th>
                    <th className="text-start">File</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {arr?.map((i, index) => (
                    <tr key={index}>
                      <td className="text-start"> {i.type} </td>
                      <td className="text-start">
                        {" "}
                        {i.fileName || i.name || "Document"}{" "}
                      </td>
                      <td>
                        <div className="icon-joiner d-flex gap-3 align-items-center justify-content-center">
                          <a
                            href={i.document}
                            target="_blank"
                            rel="noreferrer"
                            className="view-btn bg-transparent border-0 p-0 text-decoration-none"
                            aria-label={`View ${i.type} file`}
                          >
                            <i className="fa-solid fa-eye" />
                          </a>
                          <button
                            type="button"
                            className="del-btn cursor-pointer bg-transparent border-0 p-0"
                            onClick={() => removeFile(index)}
                            aria-label={`Delete ${i.type} document`}
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="btn-container">
                <button
                  className="upload_files"
                  onClick={() => submitHandler()}
                  type="button"
                  aria-label="Upload Files"
                >
                  {submitLoading ? <ClipLoader color="#fff" /> : "Upload Files"}
                </button>
              </div>
            </div>
          </form>
        </Container>
      </Modal.Body>
    </Modal>
  );
});

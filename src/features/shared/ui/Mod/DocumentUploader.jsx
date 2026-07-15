/** @format */
import { useState, memo, useRef } from "react";
import { Modal, Row, Col, Form, Button, Table } from "react-bootstrap";
import { useFileUpload } from "@shared/hooks";
import {
  getObjectUrlFromDownloadUrl,
  uploadDocument,
  downloadBlobByUrl,
} from "../../services";
import { FilesNames } from "../../constants";
import { ClipLoader } from "react-spinners";
import CustomSelect from "../selectors/CustomSelect";
import { showNotification } from "@/utils";

export const DocumentUploader = memo((props) => {
  const [fileType, setFileType] = useState("");
  const fileUpload = useFileUpload({
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
  });
  const fileInputRef = useRef(null);
  const [arr, setArr] = useState([]);
  const [uploading, setUploading] = useState(false);
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
      patitentId: props.patitentId,
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
    if (props) {
      props?.fetchDocument();
    }
  };
  const downloadHandler = async (endpoint) => {
    await downloadBlobByUrl(endpoint);
  };
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="file-upload-modal">
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
            <div className="flexbox"></div>

            <Row>
              <Col xs={12} md={12} lg={4}>
                <div className="items mb-3 mb-xl-0">
                  <Form.Label className="fw-bold" htmlFor="file-type-select">
                    File Type
                  </Form.Label>
                  <CustomSelect
                    id="file-type-select"
                    options={FilesNames}
                    onChange={(value) => setFileType(value)}
                  />
                </div>
              </Col>
              <Col xs={12} md={12} lg={4}>
                <div className="items mb-3 mb-xl-0">
                  <Form.Label className="fw-bold" htmlFor="file-name-control">
                    File Name
                  </Form.Label>
                  <Form.Control
                    id="file-name-control"
                    type="file"
                    ref={fileInputRef}
                    onChange={fileUpload.onSelectFile}
                    aria-label="Select file"
                  />
                </div>
              </Col>
              <Col xs={12} md={12} lg={4}>
                <div className="items mb-3 mb-xl-0">
                  <Form.Label className="fw-bold" htmlFor="upload-submit-btn">
                    Upload File
                  </Form.Label>
                  <div>
                    <Button
                      id="upload-submit-btn"
                      className="theme-button w-100"
                      type="submit"
                    >
                      {uploading ? <ClipLoader color="#fff" /> : "Upload File"}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            <Table
              responsive
              bordered
              className="mt-3"
              aria-label="Uploaded documents"
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
                          href={getObjectUrlFromDownloadUrl(i?.document)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-btn bg-transparent border-0 p-0 text-decoration-none"
                          aria-label={`View ${i.type} document`}
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
            </Table>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
});

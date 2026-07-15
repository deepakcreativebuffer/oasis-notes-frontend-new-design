import {
  Modal,
  Button,
  Form,
  Spinner,
  Row,
  Col,
  Container,
  CloseButton,
} from "react-bootstrap";
import ProgressIndicator from "./ProgressIndicator";
import StatusMessage from "./StatusMessage";
import { getSocket } from "@/socket";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { startPdfJob } from "../../services";
import DatePicker from "react-datepicker";
import { formatDateToMMDDYYYY } from "@/utils/utils";
import { PDF_PROCESSING_ERROR_MESSAGE, showNotification } from "@/utils";
const PdfProcessingModal = ({
  open,
  handleClose,
  documents,
  panel,
  isEmployeeSelfForm = false,
  selfEmployeId,
}) => {
  const socket = getSocket();
  const [progressData, setProgressData] = useState({
    currentStep: 0,
    totalSteps: 0,
  });
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [startDownload, setStartDownload] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { id } = useParams();
  const internalHandleClose = () => {
    if (!socket) return;
    socket.emit("terminate");
    handleClose();
    setSelectedDocs([]);
    setIndex(0);
    setStartDownload(false);
    setLoading(false);
  };
  const handleCheckboxChange = useCallback((docValue) => {
    setSelectedDocs((prev) =>
      prev.includes(docValue)
        ? prev.filter((item) => item !== docValue)
        : [...prev, docValue],
    );
  }, []);
  const handleStartDownload = () => {
    if (selectedDocs.length === 0) {
      showNotification({
        message: "Please select at least one form.",
        type: "warning",
      });
      return;
    }
    setStartDownload(true);
    setIndex(0);
    setLoading(true);
  };
  const downloadHandler = async () => {
    if (index >= selectedDocs.length) {
      internalHandleClose();
      return;
    }
    const type = selectedDocs[index];
    const payload = {
      type,
      ...(fromDate && {
        from: fromDate,
      }),
      ...(toDate && {
        to: toDate,
      }),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      socketId: socket.id,
      ...(panel === "Admin"
        ? {
            employeeId: id,
          }
        : isEmployeeSelfForm
          ? {
              employeeId: selfEmployeId,
            }
          : {
              patientId: id,
            }),
    };
    try {
      const result = await startPdfJob(payload);
      if (!result.success) {
        throw result;
      }
    } catch (err) {
      showNotification({
        message: err.message || "Failed to start PDF processing",
        type: "danger",
      });
      internalHandleClose();
    }
  };
  useEffect(() => {
    if (!startDownload || !socket) return;
    socket.on("pdf-progress", (msg) => {
      setLoading(false);
      const { progress } = msg;
      setProgressData((prev) => ({
        ...prev,
        currentStep: progress?.processedCount,
        totalSteps: progress?.totalDocsCount,
      }));
    });
    socket.on("pdf-done", (msg) => {
      const { progress, downloadUrl } = msg;
      setProgressData((prev) => ({
        ...prev,
        currentStep: progress?.processedCount,
        totalSteps: progress?.totalDocsCount,
      }));
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setIndex((i) => i + 1);
    });
    socket.on("pdf-error", (msg) => {
      showNotification({
        message: PDF_PROCESSING_ERROR_MESSAGE,
        type: "danger",
      });
      internalHandleClose();
    });
    return () => {
      socket.off("pdf-progress");
      socket.off("pdf-done");
      socket.off("pdf-error");
      socket.emit("terminate");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDownload]);
  useEffect(() => {
    if (startDownload) downloadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, startDownload]);
  const currentDocLabel =
    documents.find((doc) => doc.value === selectedDocs[index])?.label ||
    "Unknown Document";
  return (
    <Modal
      show={open}
      onHide={internalHandleClose}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>
          {startDownload
            ? `Processing Form ${index + 1} of ${selectedDocs.length}`
            : "Select Forms to Download"}
        </Modal.Title>
        <CloseButton onClick={internalHandleClose} />
      </Modal.Header>
      <Modal.Body>
        {startDownload && (
          <p className="text-muted small mb-3">{`${currentDocLabel}`}</p>
        )}
        {!startDownload ? (
          <>
            <Container>
              <Row className="mb-3">
                <Col xs={12} sm={12} md={4} xl={4} xxl={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">From</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(fromDate)}
                      onChange={(selectedDate) =>
                        setFromDate(
                          new Date(new Date(selectedDate).setHours(0, 0, 0, 0)),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            fromDate
                              ? formatDateToMMDDYYYY(fromDate)
                              : new Date(),
                          ],
                        },
                      ]}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={12} md={4} xl={4} xxl={4}>
                  <Form.Group className="mb-3 d-flex flex-column">
                    <Form.Label className="fw-bold">To</Form.Label>
                    <DatePicker
                      selected={formatDateToMMDDYYYY(toDate)}
                      onChange={(selectedDate) =>
                        setToDate(
                          new Date(
                            new Date(selectedDate).setHours(23, 59, 59, 999),
                          ),
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      placeholderText="MM/DD/YYYY"
                      highlightDates={[
                        {
                          "react-datepicker__day--highlighted-custom": [
                            toDate ? formatDateToMMDDYYYY(toDate) : new Date(),
                          ],
                        },
                      ]}
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Check
                type="checkbox"
                label="Select All"
                checked={selectedDocs.length === documents.length}
                indeterminate={
                  selectedDocs.length > 0 &&
                  selectedDocs.length < documents.length
                }
                onChange={(e) =>
                  setSelectedDocs(
                    e.target.checked ? documents.map((doc) => doc.value) : [],
                  )
                }
              />
              {documents.map((doc) => (
                <Form.Check
                  key={doc.value}
                  type="checkbox"
                  label={doc.label}
                  checked={selectedDocs.includes(doc.value)}
                  onChange={() => handleCheckboxChange(doc.value)}
                />
              ))}
              <div className="text-center mt-3">
                <Button
                  className="theme-button self-end"
                  onClick={handleStartDownload}
                  disabled={selectedDocs.length === 0}
                >
                  Start Download
                </Button>
              </div>
            </Container>
          </>
        ) : loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" className="text-[#1A9FB2]" />
            <p className="mt-3 text-muted">
              Initializing {currentDocLabel} download...
            </p>
          </div>
        ) : (
          <div className="text-center my-4">
            <ProgressIndicator
              currentStep={progressData.currentStep}
              totalSteps={progressData.totalSteps}
            />
            <StatusMessage
              currentStep={progressData.currentStep}
              totalSteps={progressData.totalSteps}
              documentName={currentDocLabel}
            />
            <p className="mt-3 text-muted">
              Please don't quit while we process the documents.
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default PdfProcessingModal;

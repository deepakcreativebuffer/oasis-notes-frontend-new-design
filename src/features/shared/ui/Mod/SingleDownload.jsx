import { getSocket } from "@/socket";
import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { startPdfJob } from "../../services";
import { PDF_PROCESSING_ERROR_MESSAGE, showNotification } from "@/utils";
const SingleDownload = ({
  documents,
  documentId,
  panel,
  isEmployeeSelfForm,
  selfEmployeId,
  isDownloading,
  currentDownloadId,
  setDownloadingId,
  rowId,
}) => {
  const socket = getSocket();
  const { id } = useParams();
  const internalHandleClose = useCallback(() => {
    if (!socket) return;
    socket.emit("terminate");
    socket.off("pdf-progress");
    socket.off("pdf-done");
    socket.off("pdf-error");
    setDownloadingId(null);
  }, [setDownloadingId, socket]);
  const downloadHandler = async () => {
    if (isDownloading) return;
    setDownloadingId(rowId);
    if (!socket) return;
    socket.once("pdf-done", (msg) => {
      const { downloadUrl } = msg;
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      internalHandleClose();
    });
    socket.once("pdf-error", () => {
      showNotification({
        message: PDF_PROCESSING_ERROR_MESSAGE,
        type: "danger",
      });
      internalHandleClose();
    });
    const payload = {
      type: documents,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      socketId: socket.id,
      documentId: documentId,
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
        message: err.message || "Failed to start download",
        type: "danger",
      });
      internalHandleClose();
    }
  };
  return (
    <button
      type="button"
      className="view-btn"
      onClick={(e) => {
        e.preventDefault();
        if (!isDownloading) downloadHandler();
      }}
    >
      <i
        className={`fa-solid ${isDownloading && currentDownloadId === rowId ? "fa-spinner fa-spin" : "fa-download"} ${isDownloading && currentDownloadId !== rowId ? "download-disabled" : ""}`}
      />
    </button>
  );
};
export default SingleDownload;

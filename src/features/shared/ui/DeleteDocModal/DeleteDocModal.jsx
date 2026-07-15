/* eslint-disable react/prop-types */
import { Modal } from "react-bootstrap";
import { removeApi, removeApiForPdf } from "../../services";
import { COMMON_APIS } from "../../services";

/**
 * Confirm-delete modal. Prefer `onDelete` with a domain service method
 * over passing `deleteUrl` (legacy pattern — URLs belong in services).
 */
const DeleteDocModal = ({
  show,
  handleClose,
  fetchHandler,
  deleteUrl,
  onDelete,
  payloadValue = null,
}) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const additionalFunctions = [fetchHandler].filter(Boolean);

    if (onDelete) {
      await onDelete({ additionalFunctions });
      handleClose();
      return;
    }

    if (payloadValue) {
      removeApiForPdf({
        url: COMMON_APIS.GET_BASE_API(deleteUrl),
        successMsg: "Deleted Successfully !",
        payload: {
          type: payloadValue,
        },
        additionalFunctions,
      });
    } else {
      removeApi({
        url: COMMON_APIS.GET_BASE_API(deleteUrl),
        successMsg: "Deleted Successfully !",
        additionalFunctions,
      });
    }
    handleClose();
  };
  return (
    <>
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete ?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleSubmit}
            className="btn btn-danger delete-modal-btn block"
          >
            Delete
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteDocModal;

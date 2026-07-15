import React, { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "react-bootstrap";
import { removeApi, removeApiForPdf } from "../services";
import { ClipLoader } from "react-spinners";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [deleteModalState, setDeleteModalState] = useState({
    show: false,
    deleteUrl: null,
    payloadValue: null,
    onSuccess: null,
    loading: false,
  });

  const openDeleteModal = useCallback(
    ({ url, payloadValue = null, onSuccess = null }) => {
      setDeleteModalState({
        show: true,
        deleteUrl: url,
        payloadValue,
        onSuccess,
        loading: false,
      });
    },
    [],
  );

  const closeDeleteModal = useCallback(() => {
    setDeleteModalState((prev) => ({ ...prev, show: false, loading: false }));
  }, []);

  const handleDeleteSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      const { deleteUrl, payloadValue, onSuccess } = deleteModalState;
      const additionalFunctions = onSuccess ? [onSuccess] : [];

      setDeleteModalState((prev) => ({ ...prev, loading: true }));

      if (payloadValue) {
        await removeApiForPdf({
          url: deleteUrl,
          successMsg: "Deleted Successfully !",
          payload: { type: payloadValue },
          additionalFunctions,
        });
      } else {
        await removeApi({
          url: deleteUrl,
          successMsg: "Deleted Successfully !",
          additionalFunctions,
        });
      }
      closeDeleteModal();
    },
    [deleteModalState, closeDeleteModal],
  );

  return (
    <ModalContext.Provider value={{ openDeleteModal, closeDeleteModal }}>
      {children}
      <Modal
        centered
        show={deleteModalState.show}
        onHide={closeDeleteModal}
        aria-labelledby="confirm-delete-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="confirm-delete-title">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete ?</p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            onClick={handleDeleteSubmit}
            className="btn btn-danger delete-modal-btn block"
            aria-label="Confirm deletion"
            disabled={deleteModalState.loading}
            style={{ position: "relative" }}
          >
            <span style={{ opacity: deleteModalState.loading ? 0 : 1 }}>
              Delete
            </span>
            {deleteModalState.loading && (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClipLoader color="#fff" size={16} />
              </span>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeDeleteModal}
            aria-label="Cancel deletion"
            disabled={deleteModalState.loading}
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

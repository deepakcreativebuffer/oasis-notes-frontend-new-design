import { Col, Form, Modal, Row } from "react-bootstrap";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { removeApi } from "@/features/shared/services/index";
import { COMMON_APIS } from "@/features/shared/services/index";
import { showNotification } from "@/utils";
const DeleteModal = (props) => {
  const [loading, setLoading] = useState(false);
  const deleteHandler = (e) => {
    e.preventDefault();
    if (!props.row._id) {
      props?.tablepayload((prev) => prev.filter((row) => row !== props.row));
      props?.responsetable((prev) => prev.filter((row) => row !== props.row));
      showNotification({
        message: "Removed",
        type: "success",
      });
    } else {
      const additionalFunctions = [props.fetchHandler];
      removeApi({
        url: COMMON_APIS.GET_BASE_API_1(props.url, props.id, props.row._id),
        successMsg: "Removed ",
        setLoading,
        additionalFunctions,
      });
    }
    const rowToDelete = props.row;
    const indexToDelete = props.arr?.findIndex((item) => {
      if (rowToDelete._id && item._id) {
        return item._id === rowToDelete._id;
      }
      return item === rowToDelete;
    });
    const updatedArr = props.arr?.filter((_, idx) => idx !== indexToDelete);
    if (updatedArr?.length > 0) {
      props.setBalance?.(updatedArr[0]?.balance || 0);
      props.setOverAllBalance?.(updatedArr[0]?.balance || 0);
    } else {
      props.setBalance?.(0);
      props.setOverAllBalance?.(0);
    }
    props.onHide();
  };
  return (
    <>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h6 className="fw-bold mb-0">Delete</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="w-100">
            <Row>
              <Col xs={12} md={12} xl={12}>
                <Form.Group className="mb-3">
                  <h5 className="text-danger text-center">
                    This action will permanently delete the table row. Are you
                    sure you want to proceed ?
                  </h5>
                </Form.Group>
              </Col>
            </Row>
            <Row className="justify-content-center mt-3 pt-3 border-top">
              <Col xs={12} sm={12} md={12} xl={12} className="text-center">
                <button className="btn btn-danger mx-1" onClick={deleteHandler}>
                  {loading ? <ClipLoader color="#fff" /> : "Delete"}
                </button>
                <button
                  className="btn theme-button-outline mx-1"
                  onClick={(e) => {
                    e.preventDefault();
                    props.onHide();
                  }}
                >
                  Cancel
                </button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default DeleteModal;

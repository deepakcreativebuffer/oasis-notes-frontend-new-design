import { Col, Modal, Row } from "react-bootstrap";
import { formatDateToMMDDYYYY } from "@/utils/utils";

const AppointmentCardViews = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <h5 className="fw-bold mb-0">Booking Details</h5>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Name : </p>
              <h5 className="view-value mb-0">
                {props?.modalData?.name ? props?.modalData?.name : "-"}
              </h5>
            </div>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">From : </p>
              <h5 className="view-value mb-0">
                {props?.modalData?.time ? props?.modalData?.time : "-"}
              </h5>
            </div>
          </Col>
          <Col xs={12} md={12} lg={6}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Date : </p>
              <h5 className="view-value mb-0">
                {formatDateToMMDDYYYY(
                  props?.modalData?.date
                    ? props?.modalData?.date
                    : props?.modalData?.date,
                )}
              </h5>
            </div>
          </Col>
          <Col xs={12} md={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Contact Number : </p>
              <h5 className="view-value mb-0">
                {props?.modalData?.contactNumber
                  ? props?.modalData?.contactNumber
                  : "-"}
              </h5>
            </div>
          </Col>
          <Col xs={12} md={12} lg={12}>
            <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
              <p className="view-label mb-1">Visit : </p>
              <h5 className="view-value mb-0">
                {props?.modalData?.reasonForVisit
                  ? props?.modalData?.reasonForVisit
                  : "-"}
              </h5>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
export default AppointmentCardViews;

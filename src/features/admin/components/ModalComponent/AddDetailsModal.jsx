import { useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { adminPortalService } from "@/features/shared/services";
const AddDetailsModal = (props) => {
  const payload = {};
  const [adminstratorAndSignature, setAdminstratorAndSignature] = useState();
  const [registeredNurses, setRegisteredNurses] = useState("");
  const [bhp, setBhp] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  useEffect(() => {
    setMonth(props?.month);
    setYear(props?.year);
  }, [props?.month, props?.year]);
  const submitDetails = async (e) => {
    e.preventDefault();
    if (registeredNurses) {
      payload.registeredNurseAndNumber = registeredNurses;
    }
    if (bhp) {
      payload.bhtNameAndNumber = bhp;
    }
    if (adminstratorAndSignature) {
      payload.administratorAndNumber = adminstratorAndSignature;
    }
    if (year < 10) {
      payload.month = `0${month}`;
    } else {
      payload.month = month;
    }
    payload.year = year;
    if (props?.facilityId) {
      payload.facility_id = props.facilityId;
    }
    adminPortalService.addStaffScheduleAdministrator(payload, {
      additionalFunctions: [props.onHide, props.getScheduleAdministrator],
    });
  };
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold" id="contained-modal-title-vcenter">
            Add Details
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitDetails}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Administrator and Number:
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Administrator and Number"
                required
                onChange={(e) => setAdminstratorAndSignature(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                Registered Nurse and Number:{" "}
              </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Registered Nurse and Number"
                onChange={(e) => setRegisteredNurses(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">BHP Name and Number:</Form.Label>
              <Form.Control
                type="text"
                required
                placeholder="BHP Name and Number"
                onChange={(e) => setBhp(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Year:</Form.Label>
                  <Form.Control
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} lg={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Month:</Form.Label>
                  <Form.Control
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button type="submit" className="theme-button">
              Submit
            </Button>
            <Button onClick={props.onHide} className="theme-button-outline">
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default AddDetailsModal;

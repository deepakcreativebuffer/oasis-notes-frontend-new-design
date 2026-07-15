import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

const FilterModal = ({
  show,
  onHide,
  setFilteredValue,
  isActiveUser = true,
}) => {
  const [params, setParams] = useState({
    isActiveUser: isActiveUser,
  });

  const handleIsActveChange = (isActiveUser) => {
    if (isActiveUser)
      setParams((prevParams) => ({
        ...prevParams,
        isActiveUser: isActiveUser,
      }));
    else
      setParams((prevParams) => ({
        ...prevParams,
        isActiveUser: false,
      }));
  };
  const handleApplyFilter = () => {
    onHide();
    setFilteredValue(params);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <h5 className="fw-bold mb-0">Filter</h5>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} md={4}>
            <div className="fileter-btn">
              <Form.Check
                inline
                checked={params.isActiveUser === true}
                onChange={() =>
                  handleIsActveChange(params.isActiveUser === true ? "" : true)
                }
                label="Active"
              />
              <Form.Check
                inline
                checked={params.isActiveUser === false}
                onChange={() =>
                  handleIsActveChange(
                    params.isActiveUser === false ? "" : false,
                  )
                }
                label="Inactive"
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button className="theme-button" onClick={handleApplyFilter}>
          APPLY
        </Button>
        <Button className="theme-button-outline" onClick={onHide}>
          CANCEL
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;

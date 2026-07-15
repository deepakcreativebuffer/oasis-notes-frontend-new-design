import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
  Table,
} from "react-bootstrap";
import {
  formatDateToMMDDYYYY,
  signatureFormat,
  resolveFacilityName,
  formatDateWithoutUTCHandleToMMDDYYYY,
} from "@/utils/utils";
const RefrigeratorTemperatureView = ({
  facilitiesList,
  handleSubmit51,
  componentRef,
  vanEmergency,
  print,
  printRef,
  employeeOptions,
  signers,
  employeeSignature,
  employeeSignatureDate,
  employeeSignatureTime,
  hoursFormat,
  adminSignature,
  adminDateSigned,
  adminSignedTime,
  onHide,
}) => {
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Refrigerator Temperature Monitoring</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit51}>
        <ModalBody>
          <div ref={componentRef}>
            <h1 className="pdfTitle hidden mt-[10px] mb-[10px]">
              Monthly Refrgirator Temperature Monitoring
            </h1>
            <Row className="mb-2">
              <Col xs={12} sm={6} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <span className="view-label mb-1">Date : </span>
                  <span className="view-value mb-0">
                    {formatDateWithoutUTCHandleToMMDDYYYY(vanEmergency?.date)}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <span className="view-label mb-1">Facility : </span>
                  <span className="view-value mb-0">
                    {resolveFacilityName(vanEmergency, facilitiesList)}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={6} md={6} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <span className="view-label mb-1">Facility Address: </span>
                  <span className="view-value mb-0">
                    {vanEmergency?.location}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12}>
                <Form.Label className="fw-bold">
                  Refrigerator temperature should be at 41 degrees Fahrenheit or
                  bellow.
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12}>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Temperature Reading</th>
                      <th>Staff Initials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vanEmergency?.temperature?.map((item, index) => (
                      <tr key={index}>
                        <td>{formatDateToMMDDYYYY(item?.date)}</td>
                        <td>{item?.temperature}</td>
                        <td>{item?.initials}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12}>
                <Card body className="mb-3 view-details-grid">
                  <ul className="list-unstyled">
                    <li className="mb-2 text-[14px]">
                      Refrigerator temperature reading to be at 41 degrees
                      Fahrenheit or lower.{" "}
                    </li>
                    <li className="mb-2 text-[14px]">
                      Frozen foods are stored at temperature of 0 degrees
                      Fahrenheit or bellow.{" "}
                    </li>
                    <li className="mb-2 text-[14px]">
                      Refrigerator contains thermometer that is accurate (plus
                      or minus 3 degrees Fahrenheit) and placed at the warmest
                      part of the refrigerator.{" "}
                    </li>
                  </ul>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignatureDate,
                    time: employeeSignatureTime,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminDateSigned,
                    time: adminSignedTime,
                    hoursFormat,
                  })}
                </div>
                <div className="text-end">
                  {signers?.map(
                    (signer) =>
                      signer.signature && (
                        <div key={signer?.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            time: signer.signedTime,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button className="theme-button" onClick={print}>
            PRINT
          </Button>
          <Button className="theme-button-outline" onClick={onHide}>
            CANCEL
          </Button>
        </Modal.Footer>
      </Form>
    </div>
  );
};

export default RefrigeratorTemperatureView;

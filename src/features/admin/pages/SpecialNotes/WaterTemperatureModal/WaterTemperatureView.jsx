import React from "react";
import {
  Button,
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
} from "@/utils/utils";
const WaterTemperatureView = ({
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
        <h5 className="fw-bold">Water Temperature Log</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit51}>
        <ModalBody>
          <div ref={componentRef}>
            <div>
              <h1 className="pdfTitle hidden mt-[10px]">
                Water Temperature Log
              </h1>

              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Facility : </p>
                <h5 className="view-value mb-0">
                  {resolveFacilityName(vanEmergency, facilitiesList)}
                </h5>
              </div>
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Facility Address :</p>
                <h5 className="view-value mb-0">{vanEmergency?.location}</h5>
              </div>
            </div>
            <Form.Group className="mb-3 mt-3">
              <Form.Label className="fw-bold w-100 text-center">
                Water temperature should be less than 120 degrees.
              </Form.Label>
            </Form.Group>

            <Form.Group>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Water Temperature reading (Kitchen sink)</th>
                    <th>Water Temperature reading (Restroom sink)</th>
                  </tr>
                </thead>
                <tbody>
                  {vanEmergency?.temperatureLog?.map((item, index) => (
                    <tr key={index}>
                      <td>{formatDateToMMDDYYYY(item?.date)}</td>
                      <td>{item?.kitchenSinkReading}</td>
                      <td>{item?.restroomSinkReading}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form.Group>

            <Row>
              <Col>
                <div className="text-end">
                  {signatureFormat({
                    sign: employeeSignature,
                    date: employeeSignatureDate,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: adminSignature,
                    date: adminDateSigned,
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

export default WaterTemperatureView;

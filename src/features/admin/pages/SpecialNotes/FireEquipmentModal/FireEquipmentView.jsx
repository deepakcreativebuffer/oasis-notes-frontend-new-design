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
const FireEquipmentView = ({
  facilitiesList,
  handleSubmit51,
  componentRef,
  vanEmergency,
  print,
  printRef,
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
        <h5 className="fw-bold mb-0">Fire Equipment Monitoring</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit51}>
        <ModalBody>
          <div ref={componentRef}>
            <h1 className="pdfTitle hidden my-2.5">
              Fire Equipment Monitoring
            </h1>
            <div className="view-details mb-2">
              <Row>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Facility : </p>
                    <h5 className="view-value mb-0">
                      {resolveFacilityName(vanEmergency, facilitiesList)}
                    </h5>
                  </div>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Facility Address : </p>
                    <h5 className="view-value mb-0">
                      {vanEmergency?.location}
                    </h5>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Today's Date : </p>
                    <h5 className="view-value mb-0">
                      {formatDateToMMDDYYYY(vanEmergency?.date)}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <Form.Group>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Smoke Alarms</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vanEmergency?.alaram?.map((item, index) => (
                    <tr key={index}>
                      <td>Smoke Alarm {index + 1}</td>
                      <td>
                        {item.working === "RepairAndWork"
                          ? "Repair and Work"
                          : item.working === "working"
                            ? "Working"
                            : item?.working === "NeedRepair"
                              ? "Need Repair"
                              : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Extinguishers </th>
                    <th>Status</th>
                    <th>Expiriation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vanEmergency?.extinguisher?.map((item, index) => (
                    <tr key={index}>
                      <td>Extinguisher {index + 1}</td>
                      <td>
                        {item.working === "RepairAndWork"
                          ? "Repair and Work"
                          : item.working === "working"
                            ? "Working"
                            : item?.working === "NeedRepair"
                              ? "Need Repair"
                              : ""}
                      </td>

                      <td>{formatDateToMMDDYYYY(item.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">Staff Details:</Form.Label>
              {vanEmergency?.staff?.map((item, index) => (
                <div className="view-details mb-2" key={index}>
                  <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Name : </p>
                        <h5 className="view-value mb-0">{item?.staffName}</h5>
                      </div>
                    </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <div className="view-details-grid my-1 my-md-2 p-3">
                        <p className="view-label mb-1">Initials :</p>
                        <h5 className="view-value mb-0">{item?.initial}</h5>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>
            <Col xs={12} className="text-end">
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
            </Col>
            <Col xs={12} md={12} className="text-end">
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
            </Col>
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

export default FireEquipmentView;

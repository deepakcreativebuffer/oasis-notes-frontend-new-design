import React from "react";
import { Button, Form, Modal, ModalBody, Table } from "react-bootstrap";
import {
  formatDateToMMDDYYYY,
  signatureFormat,
  resolveFacilityName,
} from "@/utils/utils";
const InfectousDataView = ({
  handleSubmit6,
  componentRef,
  vanEmergency,
  print2,
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
  facilitiesList,
  onHide,
}) => {
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="fw-bold mb-0">Infectous Data</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit6}>
        <ModalBody>
          <div ref={componentRef}>
            <h1 className="pdfTitle hidden mt-2.5 mb-2.5">
              {" "}
              Monthly Infectious Control Data collection/Tracking Form
            </h1>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Facility Address</th>
                  <th>Date of Data Collection</th>
                  <th>
                    <p className="mb-0">Type of Data Collection</p>
                    <p className="mb-0">(Data Collected)</p>
                  </th>
                  <th>
                    <p className="mb-0">Any Issues Noted</p>
                  </th>
                  <th>
                    <p className="mb-0">Data Collected By</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {vanEmergency?.data?.map((row, index) => (
                  <tr key={index}>
                    <td> {row.employeeName}</td>
                    <td>
                      <div>{resolveFacilityName(row, facilitiesList)}</div>
                      <div>{row?.facilityAddress}</div>
                    </td>
                    <td>{formatDateToMMDDYYYY(row.dateOfDataCollection)}</td>
                    <td> {row.typeOfDataCollection}</td>
                    <td> {row.issuesNoted}</td>
                    <td> {row.dataCollectedBy}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
          </div>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button className="theme-button" onClick={print2}>
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

export default InfectousDataView;

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
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
const VanEmergencyView = ({
  submitHandler5,
  componentRef,
  vanEmergency,
  print2,
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
  patientDetail,
}) => {
  const renderAllergiesTable = (arr) => {
    let yes = null;
    let comment = "";
    if (arr && Array.isArray(arr) && arr.length > 0) {
      const allergy = arr[0];
      if (allergy) {
        yes = allergy.yes;
        comment = allergy.comments || "";
      }
    }

    return (
      <Col md={12} className="mb-3">
        <Table responsive="lg" bordered className="mb-0">
          <thead>
            <tr>
              <th>Condition</th>
              <th className="text-center">Yes</th>
              <th className="text-center">No</th>
              <th className="w-50">Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Allergies</td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === true}
                  readOnly
                  disabled
                />
              </td>
              <td className="text-center">
                <Form.Check
                  type="checkbox"
                  checked={yes === false}
                  readOnly
                  disabled
                />
              </td>
              <td>{comment}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    );
  };

  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Van Emergency Information</h5>
      </Modal.Header>
      <Form onSubmit={submitHandler5}>
        <ModalBody>
          <div ref={componentRef}>
            <h1 className="pdfTitle hidden mt-[10px] mb-[10px]">
              Van Emergency{" "}
            </h1>
            <div className="view-details mb-2">
              <Row>
                <Col xs={12} sm={8} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Resident Name : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.residentName}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> DOB : </span>
                    <span className="view-value mb-0">
                      {formatDateToMMDDYYYY(vanEmergency?.dateOfBirth)}
                    </span>
                  </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Facility Address :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.facilityAddress}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Facility Phone number :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.facilityPhoneNumber}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Gurdian Information :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.guardianInformation}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      BHRF Administrator Information :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.BHRFAdministratorInformation}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Case Manager information :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.caseManagerInformation}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Pharmacy Information :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.pharamacyHospital}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Preferred Hospital :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.preferredHospital}
                    </span>
                  </div>
                </Col>
                {renderAllergiesTable(
                  patientDetail?.allergies ||
                    vanEmergency?.patientId?.allergies ||
                    vanEmergency?.allergiesTable,
                )}
              </Row>
            </div>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="fw-bold d-block">
                  Medication: Facility or pharmacy will be contacted in case of
                  an emergency for updated medication list.
                </Form.Label>
                <Form.Label className="fw-bold d-block">
                  {" "}
                  IN CASE OF AN EMERGENCY NOTIFY THE FOLLOWING AGENCY STAFF
                  MEMBER :{" "}
                </Form.Label>
              </Col>
            </Row>
            <div className="view-details mb-2">
              <Row>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Name : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.staffMemberName}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Phone Number : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.staffMemberPhoneNumber}
                    </span>{" "}
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} md={12} lg={12} className="text-end">
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
              <Col xs={12} md={12} lg={12}>
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
            </Row>
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

export default VanEmergencyView;

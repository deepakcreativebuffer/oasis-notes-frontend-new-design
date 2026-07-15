import React from "react";
import { Button, Col, Form, Modal, ModalBody, Row } from "react-bootstrap";

import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  signatureFormat,
  resolveFacilityName,
} from "@/utils/utils";

const EvacuationAndFireDrillView = ({
  facilitiesList,
  submitHandler3,
  componentRef,
  vanEmergency,
  print,
  printRef,
  employeeOptions,
  residentsOptions,
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
        <h5 className="fw-bold mb-0">Evacuation Drill Report</h5>
      </Modal.Header>
      <Form onSubmit={submitHandler3}>
        <ModalBody>
          <div ref={componentRef}>
            <h1 className="pdfTitle hidden my-2.5">
              {" "}
              Evacuation Drill Report{" "}
            </h1>
            <Form.Label className="fw-bold">
              Evacuation Drill will be conducted once every six (6) months on
              each shift by staff and residents
            </Form.Label>
            <div className="view-details">
              <Row>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Facility : </span>
                    <span className="view-value mb-0">
                      {resolveFacilityName(vanEmergency, facilitiesList)}
                    </span>
                  </div>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Facility Address : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.facititAddress}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Date : </span>
                    <span className="view-value mb-0">
                      {formatDateToMMDDYYYY(vanEmergency?.date)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Start Time : </span>
                    <span className="view-value mb-0">
                      {convertTimeFormat(vanEmergency?.startTime, hoursFormat)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">End Time : </span>
                    <span className="view-value mb-0">
                      {convertTimeFormat(vanEmergency?.endTime, hoursFormat)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Shift From : </span>
                    <span className="view-value mb-0">
                      {convertTimeFormat(vanEmergency?.shiftFrom, hoursFormat)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Shift To : </span>
                    <span className="view-value mb-0">
                      {convertTimeFormat(vanEmergency?.shiftTo, hoursFormat)}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="view-details">
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid d-block my-1 my-md-2 p-3">
                    <p className="view-label mb-1 w-100">
                      Name (s) of Employees Partiacipating in Evacuation Drill
                      :{" "}
                    </p>
                    {vanEmergency?.evacuationParticipatingEmployee?.map(
                      (item, index) => {
                        const matchingOption = employeeOptions.find(
                          (option) => option.value === item,
                        );
                        return (
                          <div key={index}>
                            <span className="view-value w-100 mb-0">
                              {index + 1}. {matchingOption?.label}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Name of Person Conducting the Evacuation Drill :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.evacuationPersonConduct}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid d-block my-1 my-md-2 p-3">
                    <p className="view-label mb-1 w-100">
                      Name(s) of Residents Participating in Evacuation Drill
                      :{" "}
                    </p>
                    {vanEmergency?.residentsInvolved?.map((item, index) => {
                      const matchingOption = residentsOptions.find(
                        (option) => option.value === item,
                      );
                      return (
                        <div key={index}>
                          <span className="view-value w-100 mb-1">
                            {index + 1}. {matchingOption?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid d-block my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Name (s) of Residents requiring Assistance for Evacuation
                      :{" "}
                    </p>
                    {vanEmergency?.residentsAssistanceEmployee?.map(
                      (item, index) => {
                        const matchingOption = residentsOptions.find(
                          (option) => option.value === item,
                        );
                        return (
                          <div key={index}>
                            <span className="view-value w-100 mb-1">
                              {index + 1}. {matchingOption?.label}
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1 ">
                      Fire Alarm Activation Method :{" "}
                    </span>
                    <span className="view-value mb-0 ">
                      {vanEmergency?.fireAlaramActivationMethod}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid d-block my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Unusual Condition :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.unusualConditionText}{" "}
                    </span>
                    <p>
                      {vanEmergency?.unusualConditionText === "Yes" ? (
                        <Form.Label>
                          Unusual Conditions , If yes List:
                        </Form.Label>
                      ) : null}
                      {vanEmergency?.unusualConditionText === "Yes" && (
                        <>
                          <span className="view-value w-100 mb-0">
                            {" "}
                            {vanEmergency?.condition}
                          </span>
                        </>
                      )}
                    </p>
                    <Form.Label className="mb-0 w-100">
                      (Weather, remodeling, temporary exits)
                    </Form.Label>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Number of Occupants Evacuated :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.noOfOccupantsEvacuated}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Total Time of Evacuation Drill :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.totalTimeOfEvacuationDrill}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Problems Encountered During Evacuation Drill :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.problemEncounteredDuringEvacuationDrill}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1 w-100">
                      Recommendation(s) :{" "}
                    </span>
                    <specialNotes className="view-value mb-0 w-100">
                      {vanEmergency?.recommendations}
                    </specialNotes>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Plan Of Actions : </span>
                    <span className="view-value mb-0 ">
                      {vanEmergency?.planAction}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12} sm={12} className="text-end">
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
              <Col xs={12} sm={12} className="text-end">
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

export default EvacuationAndFireDrillView;

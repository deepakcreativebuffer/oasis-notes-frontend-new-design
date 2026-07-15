import React from "react";
import { Button, Col, Form, Modal, ModalBody, Row } from "react-bootstrap";
import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  signatureFormat,
  resolveFacilityName,
} from "@/utils/utils";
const DisasterPlanReviewView = ({
  facilitiesList,
  handleSubmit7,
  componentRef,
  disasterPlanData,
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
  onHide,
}) => {
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Disaster Plan Review</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit7}>
        <ModalBody>
          <div ref={componentRef}>
            <div className="full-width-container">
              <h1 className="pdfTitle hidden my-2.5">Disaster Plan Review</h1>
            </div>
            <Form.Label className="fw-bold">
              (A disaster plan will be reviewed every 12 months and Disaster
              Review Document is maintained for at least 12 months after the
              date of review){" "}
            </Form.Label>
            <Row>
              <Col xs={12} sm={4} md={12} lg={4}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">Facility : </Form.Label>
                  <Form.Label className="ms-lg-1">
                    {resolveFacilityName(vanEmergency, facilitiesList)}
                  </Form.Label>
                </div>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">
                    Facility Address :{" "}
                  </Form.Label>
                  <Form.Label className="ms-lg-1">
                    {vanEmergency?.facilityAddress}
                  </Form.Label>
                </div>
              </Col>
              <Col xs={12} sm={4} md={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">Date : </Form.Label>
                  <span className="fw-bold text-sm">
                    {" "}
                    {formatDateToMMDDYYYY(disasterPlanData.date)}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={4} md={12} lg={4}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">Time : </Form.Label>
                  <Form.Label className="ms-lg-1">
                    {convertTimeFormat(disasterPlanData.shiftTime, hoursFormat)}
                  </Form.Label>
                </div>
              </Col>
              <Col xs={12} sm={4} md={12} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">Shift From : </Form.Label>
                  <Form.Label className="ms-lg-1">
                    {convertTimeFormat(disasterPlanData.shiftFrom, hoursFormat)}
                  </Form.Label>
                </div>
              </Col>
              <Col xs={12} sm={4} md={12} lg={6}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">Shift To : </Form.Label>
                  <Form.Label className="ms-lg-1">
                    {convertTimeFormat(disasterPlanData.shiftTo, hoursFormat)}
                  </Form.Label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className="view-details-grid d-block my-1 my-md-2 p-3">
                  <Form.Label className="fw-bold">
                    Name of staff or volunteer participating in the Disaster
                    Plan Review :
                  </Form.Label>
                  <Form.Label className="w-100">
                    {vanEmergency?.participants?.map((employee, index) => {
                      const matchingOption = employeeOptions.find(
                        (option) => option.value === employee,
                      );
                      const label = matchingOption ? matchingOption.label : "";
                      return (
                        <Form.Label className="w-100" key={index}>
                          {`${index + 1}. ${label}`}
                        </Form.Label>
                      );
                    })}
                  </Form.Label>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <Form.Label className="view-label mb-1">
                    Critique of the Disaster Plan Review (Problems Identified)
                    :{" "}
                  </Form.Label>
                  <Form.Label className="view-value mb-0 ms-lg-1">
                    {vanEmergency?.critiqueProblemsIdentified}
                  </Form.Label>
                </div>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <span className="view-label mb-1 ">
                    Recommendation(s) for Improvement :
                  </span>
                  <span className="view-value mb-0">
                    {" "}
                    {vanEmergency?.recommendationsForImprovement}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <span className="view-label mb-1 ">
                    Date for next disaster annual review Plan :
                  </span>
                  <span className="view-value mb-0">
                    {" "}
                    {formatDateToMMDDYYYY(vanEmergency.nextReviewDate)}
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <span className="view-label mb-1 ">
                    Recommendation(s) for Improvement :{" "}
                  </span>
                  <span className="view-value mb-0">
                    {" "}
                    {vanEmergency?.recommendationsForImprovement}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <span className="view-label mb-1 ">
                    Date for next disaster annual review Plan :{" "}
                  </span>
                  <span className="view-value mb-0">
                    {" "}
                    {formatDateToMMDDYYYY(vanEmergency.nextReviewDate)}
                  </span>
                </div>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12}>
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <span className="view-label mb-1">
                    Review Completed By :{" "}
                  </span>
                  <span className="view-value mb-0">
                    {" "}
                    {vanEmergency.reviewCompletedByName}
                  </span>
                </div>
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
                <div>
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

export default DisasterPlanReviewView;

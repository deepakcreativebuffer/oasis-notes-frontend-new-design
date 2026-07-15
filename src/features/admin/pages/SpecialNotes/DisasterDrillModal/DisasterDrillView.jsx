import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  ModalBody,
  Row,
} from "react-bootstrap";
import {
  convertTimeFormat,
  formatDateToMMDDYYYY,
  signatureFormat,
  resolveFacilityName,
} from "@/utils/utils";

const DisasterDrillView = ({
  facilitiesList,
  handleSubmit4,
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
        <h5 className="fw-bold mb-0">Disaster Drill</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit4}>
        <ModalBody>
          <div ref={componentRef} className="w-full mx-auto">
            <h1 className="pdfTitle hidden my-2.5">Disaster Drill </h1>
            <div className="mb-2">
              <Form.Label className="fw-bold">
                (COMPETED EVERY 3 MONTHS STAFF ONLY on each shift)
              </Form.Label>
              <div className="view-details mb-2">
                <Row>
                  <Col xs={12} sm={6} md={12} lg={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Facility : </span>
                      <span className="view-value mb-0">
                        {resolveFacilityName(vanEmergency, facilitiesList)}{" "}
                      </span>
                    </div>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Facility Address :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.facilityAddress}{" "}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={6} md={12} lg={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Date : </span>
                      <span className="view-value mb-0">
                        {formatDateToMMDDYYYY(vanEmergency?.date)}{" "}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Card body className="mb-2 view-details-grid-inline">
                    <Form.Label className="fw-bold">
                      Disasters covered in the drill :{" "}
                    </Form.Label>
                    <div className="radio-inline">
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Tornado"
                        checked={vanEmergency.tornado}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Structure Damage"
                        checked={vanEmergency.structureDamage}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Storm"
                        checked={vanEmergency.storm}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Fire"
                        checked={vanEmergency.fire}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Earthquake"
                        checked={vanEmergency.earthQuake}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Bomb Threat"
                        checked={vanEmergency.bombThreat}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Terrorist Act"
                        checked={vanEmergency.terroristAct}
                        disabled
                      />
                      <Form.Check
                        inline
                        type="checkbox"
                        label="Other"
                        checked={vanEmergency.other}
                        disabled
                      />
                      {vanEmergency.other && (
                        <span className="d-block text-sm">
                          {" "}
                          {vanEmergency?.otherDetailsData}
                        </span>
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
              <div className="view-details">
                <Row>
                  <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Begin Time : </span>
                      <span className="view-value mb-0">
                        {convertTimeFormat(
                          vanEmergency?.beginTime,
                          hoursFormat,
                        )}{" "}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">End Time : </span>
                      <span className="view-value mb-0">
                        {convertTimeFormat(
                          vanEmergency?.endTime,
                          hoursFormat,
                        )}{" "}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4} xl={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Total Time : </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.totalTime}{" "}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Shift From : </span>
                      <span className="view-value mb-0">
                        {convertTimeFormat(
                          vanEmergency?.shiftFrom,
                          hoursFormat,
                        )}{" "}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Shift To : </span>
                      <span className="view-value mb-0">
                        {convertTimeFormat(
                          vanEmergency?.shiftTo,
                          hoursFormat,
                        )}{" "}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="view-details-grid d-block p-3 my-1 my-md-2">
                      <p className="view-label mb-1">Staff Present : </p>
                      <div className="view-value mb-0">
                        {vanEmergency?.staffPresent?.map((employee, index) => {
                          const matchingOption = employeeOptions.find(
                            (option) => option.value === employee,
                          );
                          return matchingOption ? (
                            <div className="mb-1" key={index}>
                              {index !== 0 && " "} {index + 1}.{" "}
                              {matchingOption.label}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Did you contact Manager or Coordinator :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.contactManagerCoordinator ? (
                          <span className="text-black">Yes</span>
                        ) : (
                          <span className="text-black">No</span>
                        )}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Any Injuries : </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.anyInjuriess ? (
                          <span>Yes</span>
                        ) : (
                          <span>No</span>
                        )}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">was 911 Called : </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.was911Called}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Was fire extinguisher taken to scene :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.extinguisherTaken}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Did you have to relocated the residents? if so where
                        :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.relocatedTheResidentsData}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">& how: </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.relocatedTheResidents}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Did you take resident’s Medication :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.residentMedication}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Was Water / Food Accessible :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.waterFoodAccessible}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Are all resident’s accounted for :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.residentsAccounted}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">
                        Overall, what steps did you take to handle the disaster
                        :{" "}
                      </p>
                      <h5 className="view-value mb-0">
                        {vanEmergency?.handleTheDisaster}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <p className="view-label mb-1">Comments / Concerns : </p>
                      <h5 className="view-value mb-0">
                        {vanEmergency?.commentsConcerns}
                      </h5>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Person Conducting the Disaster Drill :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.conducatingName}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="view-details">
                <Row>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    {" "}
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Print Name : </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.conducatingName}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Title : </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.title}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={4}>
                    <div className="view-details-grid my-1 my-md-2 p-3">
                      <span className="view-label mb-1"> Date : </span>
                      <span className="view-value mb-0">
                        {formatDateToMMDDYYYY(vanEmergency?.conducatingDate)}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>

              <Row>
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
                <Col xs={12} className="text-end">
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

export default DisasterDrillView;

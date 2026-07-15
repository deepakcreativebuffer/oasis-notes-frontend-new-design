import React from "react";
import { Button, Col, Form, Modal, ModalBody, Row } from "react-bootstrap";
import { signatureFormat, resolveFacilityName } from "@/utils/utils";

const WeeklyVehicleInspectionView = ({
  facilitiesList,
  handleSubmit5,
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
  onHide,
}) => {
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="mb-0 fw-bold">Weekly Vehicle Inspection</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit5}>
        <ModalBody>
          <div ref={componentRef} className="print-view-details w-full mx-auto">
            <h1 className="pdfTitle hidden mt-[15px] mb-[15px]">
              Weekly Vehicle Inspection Checklist Details
            </h1>

            <div className="view-details mb-3">
              <Row>
                <Col xs={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Facility : </span>
                    <span className="view-value mb-0">
                      {resolveFacilityName(vanEmergency, facilitiesList)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Year : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.year}
                    </span>
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Facility Address : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.facilityAddress}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Make : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.make}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Model : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.model}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Vehicle License Plate :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.vehicleLicensePlate}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <h6 className="fw-bold">Lights Satisfactory Comments</h6>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">High Beam : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.highBeam ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Low Beam : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.lowBeam ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Brake Lights : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.brakeLights ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Emergency Lights : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.emergencyLights ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      R / L Front Turn Signal :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.rightLeftFrontTurnSignal
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      R / L Back Turn Signal :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.rightLeftBackTurnSignal
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Taillight : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.rightLeftTailLight ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      R / L Emergency Light :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.rightLeftEmergencyLight
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      R / L Front Day Running :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.rightLeftFrontDayRunning
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      R / L Back Day Running :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.lights?.rightLeftBackDayRunning
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <h6 className="fw-bold">Glass Satisfactory Comments</h6>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Windshield : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.glass?.windshield ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Rear : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.glass?.rear ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Front : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.glass?.rightLeftFront ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Middle : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.glass?.rightLeftMiddle ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Back : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.glass?.rightLeftBack ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <h6 className="fw-bold">
              Fluids & Lubricants Satisfactory Comments
            </h6>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Fuel : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.fuel ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Engine Oil : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.engineOil
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Coolant Fluid : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.coolantFluid
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Power Steering Fluid :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.powerSteeringFluid
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Brake Fluid : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.brakeFluid
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Clutch Oil : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.clutchOil
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Battery Fluid : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.batteryFluid
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Windshield Washer Fluid :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.windshieldWasherFluid
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Water : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.fluidsAndLubricants?.water ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <Row>
              <Col>
                <h6 className="fw-bold">Tires Satisfactory Comments</h6>
              </Col>
            </Row>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Spare : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.tires?.spare ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Front : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.tires?.rightLeftFront ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Back : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.tires?.rightLeftBack ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Jack & Wrench : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.tires?.jackAndWrench ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <h6 className="fw-bold">Mirrors Satisfactory Comments</h6>
              </Col>
            </Row>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">R / L Mirror : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.mirrors?.rightLeftMirror ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Middle Interior : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.mirrors?.middleInterior ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col>
                <h6 className="fw-bold">
                  Emergency Equipment Satisfactory Comments
                </h6>
              </Col>
            </Row>
            <div className="view-details mb-3">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">First Aid Kit : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.emergencyEquipment?.firstAidKit
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Gloves : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.emergencyEquipment?.gloves ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Blanket : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.emergencyEquipment?.blanket ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Flashlights : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.emergencyEquipment?.flashlight
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Water : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.emergencyEquipment?.water ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <Row>
              <Col>
                <h6 className="fw-bold">General Satisfactory Comments</h6>
              </Col>
            </Row>
            <div className="view-details">
              <Row>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Wiper Blades / Motor :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.wiperBladesMotor ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Horn : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.horn ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Heater : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.heater ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Air Conditioner : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.airConditioner ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Seat Belts : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.seatBelts ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Hose : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.hose ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Drive Belt : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.driveBelt ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={6} md={6} lg={4}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Battery : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.general?.battery ? "Yes" : "No"}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <Row>
              <Col xs={12}>
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
              </Col>
              <Col xs={12}>
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

export default WeeklyVehicleInspectionView;

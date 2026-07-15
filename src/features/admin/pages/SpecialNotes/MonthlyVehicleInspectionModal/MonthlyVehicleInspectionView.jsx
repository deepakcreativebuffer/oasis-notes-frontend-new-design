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
const MonthlyVehicleInspectionView = ({
  facilitiesList,
  handleSubmit10,
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
}) => {
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <Modal.Header closeButton onHide={onHide}>
        <h5 className="fw-bold mb-0">Monthly Vehicle Inspection</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit10}>
        <ModalBody>
          <div ref={componentRef}>
            <h1 className="pdfTitle hidden mt-2.5 mb-2.5">
              Monthly Vehicle Inspection
            </h1>
            <div className="full-width-container mb-3">
              <Form.Label className="fw-bold">
                Vehicles are inspected weekly for issues. Please report any
                issues with the van to the Administrator.
              </Form.Label>
              <Row className="mb-2">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Facility : </span>
                    <span className="view-value mb-0">
                      {resolveFacilityName(vanEmergency, facilitiesList)}
                    </span>
                  </div>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Facility Address :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.facilityAddress || vanEmergency?.location}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Date (mm/yy) : </span>
                    <span className="view-value mb-0">{`${vanEmergency?.month || ""}/${vanEmergency?.year || ""}`}</span>
                  </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Vehicle : </span>
                    <span className="view-value mb-0">
                      {vanEmergency?.vehicle}
                    </span>
                  </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Date of Last Service :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {formatDateToMMDDYYYY(vanEmergency?.dateOfLastService)}
                    </span>
                  </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      {" "}
                      Date of Next Service :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {" "}
                      {formatDateToMMDDYYYY(vanEmergency?.dateOfNextService)}
                    </span>
                  </div>
                </Col>
              </Row>

              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Status</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lights</td>
                    <td>
                      <Form.Group>{vanEmergency?.itemsLights}</Form.Group>{" "}
                    </td>

                    <td>{vanEmergency?.itemsLightsComment}</td>
                  </tr>
                  <tr>
                    <td>Turn Signals</td>
                    <td>{vanEmergency?.itemsTurnSignals}</td>

                    <td>{vanEmergency?.itemsTurnSignalsComment}</td>
                  </tr>
                  <tr>
                    <td>Horn</td>
                    <td>{vanEmergency?.itemsHorn}</td>

                    <td>{vanEmergency?.itemsHornComment}</td>
                  </tr>
                  <tr>
                    <td>Wipers</td>
                    <td>{vanEmergency?.itemsWipers}</td>

                    <td>{vanEmergency?.itemsWipersComment}</td>
                  </tr>
                  <tr>
                    <td>AC</td>
                    <td>{vanEmergency?.itemsAC}</td>
                    <td>{vanEmergency?.itemsACComment}</td>
                  </tr>
                  <tr>
                    <td>Tires</td>
                    <td>{vanEmergency?.itemsTires}</td>

                    <td>{vanEmergency?.itemsTiresComment}</td>
                  </tr>
                  <tr>
                    <td>Steering</td>
                    <td>{vanEmergency?.itemsSteering}</td>

                    <td>{vanEmergency?.itemsSteeringComment}</td>
                  </tr>
                  <tr>
                    <td>Fluid Leaks / Gas Odour</td>
                    <td>{vanEmergency?.itemsFluidLeaksGasOdor}</td>

                    <td>{vanEmergency?.itemsFluidLeaksGasOdorComment}</td>
                  </tr>
                  <tr>
                    <td>Body Dents</td>
                    <td>{vanEmergency?.itemsBodyDents}</td>

                    <td>{vanEmergency?.itemsBodyDentsComment}</td>
                  </tr>
                  <tr>
                    <td>Mirrors</td>
                    <td>{vanEmergency?.itemsMirrors}</td>
                    <td>{vanEmergency?.itemsMirrorsComment}</td>
                  </tr>
                  <tr>
                    <td>External Cleanliness</td>
                    <td>{vanEmergency?.itemsExternalCleanliness}</td>

                    <td>{vanEmergency?.itemsExternalCleanlinessComment}</td>
                  </tr>
                  <tr>
                    <td>Interior Cleanliness</td>
                    <td>{vanEmergency?.itemsInteriorCleanliness}</td>

                    <td>{vanEmergency?.itemsInteriorCleanlinessComment}</td>
                  </tr>
                  <tr>
                    <td>First Aid Kit</td>
                    <td>{vanEmergency?.itemsFirstAidKit}</td>

                    <td>{vanEmergency?.itemsFirstAidKitComment}</td>
                  </tr>
                  <tr>
                    <td>Water</td>
                    <td>{vanEmergency?.itemsWater}</td>

                    <td>{vanEmergency?.itemsWaterComment}</td>
                  </tr>
                  <tr>
                    <td>Fire Extinguisher</td>
                    <td>{vanEmergency?.itemsFireExtinguisher}</td>

                    <td>{vanEmergency?.itemsFireExtinguisherComment}</td>
                  </tr>
                  <tr>
                    <td>Brakes</td>
                    <td>{vanEmergency?.itemsBrakes}</td>

                    <td>{vanEmergency?.itemsBrakesComment}</td>
                  </tr>
                </tbody>
              </Table>

              <Row>
                <Col>
                  <div className="view-details-grid  view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1"> Comments : </span>
                    <span className="view-value mb-0">
                      {" "}
                      {vanEmergency?.comments}
                    </span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="text-end">
                  <div>
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

export default MonthlyVehicleInspectionView;

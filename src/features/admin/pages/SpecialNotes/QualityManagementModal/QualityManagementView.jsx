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
const QualityManagementView = ({
  facilitiesList,
  handleSubmit8,
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
        <h5 className="fw-bold mb-0">Quality Management Data Reports</h5>
      </Modal.Header>
      <Form onSubmit={handleSubmit8}>
        <ModalBody ref={componentRef}>
          <div className="mb-2">
            <h1 className="pdfTitle hidden mt-[10px] mb-[10px]">
              Quality Management Data Reports
            </h1>
            <div className="view-details mb-2">
              <Row>
                <Col xs={12} sm={8} md={6} lg={6}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    {" "}
                    <span className="view-label mb-1">Report: </span>{" "}
                    <span className="view-value mb-0">
                      {vanEmergency?.type}
                    </span>{" "}
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Date : </span>
                    <span className="view-value mb-0">
                      {" "}
                      {formatDateToMMDDYYYY(vanEmergency?.dateOfBirth)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Facility : </span>
                    <span className="view-value mb-0">
                      {resolveFacilityName(vanEmergency, facilitiesList)}
                    </span>
                  </div>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    {" "}
                    <span className="view-label mb-1">Report: </span>{" "}
                    <span className="view-value mb-0">
                      {vanEmergency?.type}
                    </span>{" "}
                  </div>
                </Col>
                <Col xs={12} sm={4} md={6} lg={6}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Date : </span>
                    <span className="view-value mb-0">
                      {" "}
                      {formatDateToMMDDYYYY(vanEmergency?.dateOfBirth)}
                    </span>
                  </div>
                </Col>
                <Col xs={12} lg={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <span className="view-label mb-1">Facility Address : </span>
                    <span className="view-value mb-0">
                      {" "}
                      {vanEmergency?.facilityAddress}
                    </span>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <span className="view-label mb-1">
                      Areas that have Improved :{" "}
                    </span>
                    <span className="view-value mb-0">
                      {" "}
                      {vanEmergency?.areasImproved}
                    </span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="therapy-container">
              <Form.Label className="w-full font-bold">
                Data Collection :
              </Form.Label>
              <div>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Resident Chart</td>
                      <td>{vanEmergency?.dataCollectionPatientChart}</td>
                    </tr>
                    <tr>
                      <td>Number of Incident Reports</td>
                      <td>{vanEmergency?.dataCollectionIncidentReports}</td>
                    </tr>
                    <tr>
                      <td>Number of Admissions</td>
                      <td>{vanEmergency?.dataCollectionAdmissions}</td>
                    </tr>
                    <tr>
                      <td>Number of Discharges</td>
                      <td>{vanEmergency?.dataCollectionDischarges}</td>
                    </tr>
                    <tr>
                      <td>Number of Clients that visited the Hospital</td>
                      <td>
                        {vanEmergency?.dataCollectionClientsVisitedHospital}
                      </td>
                    </tr>
                    <tr>
                      <td>Number of Falls</td>
                      <td>{vanEmergency?.dataCollectionFalls}</td>
                    </tr>
                    <tr>
                      <td>Number of Medication Errors</td>
                      <td>{vanEmergency?.dataCollectionMedicationErrors}</td>
                    </tr>
                    <tr>
                      <td>Number of Clients refusing Medications</td>
                      <td>
                        {vanEmergency?.dataCollectionClientsRefusingMedications}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Number of clients refusing to attend scheduled
                        appointments
                      </td>
                      <td>
                        {
                          vanEmergency?.dataCollectionClientsRefusingAppointments
                        }
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Number of Opioid medication related death or adverse
                        reaction
                      </td>
                      <td>
                        {
                          vanEmergency?.dataCollectionOpioidMedicationRelatedDeath
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Number of Opioid medication error</td>
                      <td>
                        {vanEmergency?.dataCollectionOpioidMedicationError}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Number of residents experiencing rapid weight loss or
                        excessive gain
                      </td>
                      <td>
                        {
                          vanEmergency?.dataCollectionExperiencingRapidWeightLossGain
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Number of residents with reported relapses</td>
                      <td>
                        {vanEmergency?.dataCollectionResidentsReportedRelapses}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Number of individuals referred to higher or lower level
                        of care
                      </td>
                      <td>
                        {
                          vanEmergency?.dataCollectionReferredHigherLowerLevelCare
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Number of residents reporting the loss of personal
                        property/clothing
                      </td>
                      <td>
                        {
                          vanEmergency?.dataCollectionResidentsReportingLossPersonalProperty
                        }
                      </td>
                    </tr>

                    {vanEmergency?.moreData?.map((data, index) => (
                      <tr key={index}>
                        <td>{data?.text}</td>
                        <td>{data?.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="view-details">
                <Row>
                  <Col xs={12} md={6} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">
                        Areas of non-compliance or Substandard quality :{" "}
                      </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.areasNonCompliance}
                      </span>
                    </div>
                  </Col>
                  <Col xs={12} md={6} lg={6}>
                    <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                      <span className="view-label mb-1">Trends : </span>
                      <span className="view-value mb-0">
                        {vanEmergency?.trends}
                      </span>
                    </div>
                  </Col>
                </Row>
              </div>
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
          </div>
        </ModalBody>
        <Modal.Footer className="justify-content-center">
          <Button className="theme-button" type="button" onClick={print2}>
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

export default QualityManagementView;

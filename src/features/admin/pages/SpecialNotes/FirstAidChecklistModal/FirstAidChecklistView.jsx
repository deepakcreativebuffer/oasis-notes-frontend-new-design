import React from "react";
import {
  Button,
  Card,
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
const FirstAidChecklistView = ({
  facilitiesList,
  month2,
  componentRef,
  vanEmergency,
  print1,
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
        <h5 className="fw-bold mb-0">First Aid Checklist Details</h5>
      </Modal.Header>
      <ModalBody ref={componentRef}>
        <div>
          <h1 className="pdfTitle my-3 hidden">First Aid Checklist</h1>
          <Form>
            <Form.Group className="mb-1 flex gap-2.5">
              <Form.Label className="font-bold">
                Facility : {resolveFacilityName(vanEmergency, facilitiesList)}
              </Form.Label>
            </Form.Group>
            <Form.Group className="mb-1 flex gap-2.5">
              <Form.Label className="font-bold">
                Facility Address : {vanEmergency?.location}
              </Form.Label>
            </Form.Group>
          </Form>
          <Form.Label className="fw-bold">
            Each First Aid Kit Should be Checked Monthly :
          </Form.Label>
          <Table className="table-fix-layout" responsive bordered>
            <thead>
              <tr>
                <th>Items Name</th>
                <th className="text-center">Quantity</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.janDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.febDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.marDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.AprDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.MayDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.JunDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.JulDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.AugDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.SeptDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.OctDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.NovDate)}</th>
                <th>{formatDateToMMDDYYYY(vanEmergency?.DecDate)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Adhesive Strip Bandages</td>
                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.AdhesiveStripBandages?.item}{" "}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.AdhesiveStripBandages?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.AdhesiveStripBandages?.[month] ===
                          "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Adhesive Tap</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.AdhesiveTap?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.AdhesiveTap?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.AdhesiveTap?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>CPR Mouth Guard/Shield</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.CPRMouthGuardShield?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.CPRMouthGuardShield?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.CPRMouthGuardShield?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Disposable Latex Gloves</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.DisposableLatexGloves?.item}{" "}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.DisposableLatexGloves?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.DisposableLatexGloves?.[month] ===
                          "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Non-Stick Sterile Pads</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.NonStickSterilePads?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.NonStickSterilePads?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.NonStickSterilePads?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Roller Gauze</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.RollerGauze?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.RollerGauze?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.RollerGauze?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Scissors</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.Scissors?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.Scissors?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.Scissors?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Sterile Guaze Squares</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.SterileGuazeSquares?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.SterileGuazeSquares?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.SterileGuazeSquares?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Triangular Bandages</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.TriangularBandages?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.TriangularBandages?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.TriangularBandages?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>

              <tr>
                <td>Tweezers</td>

                <td>
                  <div className="flex justify-center gap-4 d-flex align-items-center">
                    {vanEmergency?.Tweezers?.item}
                  </div>
                </td>

                {month2.map((month, index) => (
                  <td key={index}>
                    {vanEmergency?.Tweezers?.[month] === "Present"
                      ? "P"
                      : vanEmergency?.Tweezers?.[month] === "Absent"
                        ? "A"
                        : "N"}
                  </td>
                ))}
              </tr>
              {vanEmergency?.firstAidChecklistData?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <p>{item?.name}</p>
                    </td>
                    <td>
                      <div className="d-flex align-items-center justify-center gap-4">
                        {item?.item}
                      </div>
                    </td>

                    {month2.map((month, index) => (
                      <td key={index}>
                        {item?.[month] === "Present"
                          ? "P"
                          : item?.[month] === "Absent"
                            ? "A"
                            : "N"}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <Row>
            <Col xs={12} sm={3} md={4}>
              <Card body className="mb-3">
                <p className="mb-0 fw-bold mb-2 text-sm text-teal-600 font-sans">
                  P - Present
                </p>
              </Card>
            </Col>
            <Col xs={12} sm={3} md={4}>
              <Card body className="mb-3">
                <p className="mb-0 fw-bold mb-2 text-sm text-teal-600 font-sans">
                  A - Absent
                </p>
              </Card>
            </Col>
          </Row>

          <Card body>
            <h6 className="fw-bold">Staff Details</h6>
            {vanEmergency?.staff?.map((item, index) => (
              <Form key={index}>
                <Row className="mb-2">
                  <Col xs={12} lg={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold mb-0">
                        Staff Name :
                      </Form.Label>{" "}
                      <Form.Label className="mb-0">
                        {" "}
                        {item?.staffName}
                      </Form.Label>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="fw-bold mb-0">
                        Initials :
                      </Form.Label>{" "}
                      <Form.Label className="mb-0"> {item?.initial}</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            ))}
          </Card>
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
      </ModalBody>
      <Modal.Footer className="justify-content-center">
        <Button className="theme-button" onClick={print1}>
          PRINT
        </Button>
        <Button className="theme-button-outline" onClick={onHide}>
          CANCEL
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default FirstAidChecklistView;

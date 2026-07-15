/* eslint-disable eqeqeq */
/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { DashComponent } from "@/features/shared/ui/HelpingComponents";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewInform = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const { id } = useParams();
  const [details, setDetails] = useState({});
  useEffect(() => {
    if (id) {
      getData(setDetails, `employee/getInformedConsentForMedicationById/${id}`);
    }
  }, [id]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        details?.data?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.patientId),
    pageStyle: `
    td ,th {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page {
      margin: 12mm 9mm!important;
      size: landscape !important;
    }     
    .card {
      page-break-inside: avoid;
    }
  `,
  });
  const handlePrint2 = () => {
    downloadReport(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title={"Informed Consent for Medications"} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">
            Informed Consent for Medications
          </h1>
          <Form>
            <div className="view-details">
              <Row>
                <Col
                  xs={12}
                  sm={5}
                  md={12}
                  lg={4}
                  className={`${!details?.data?.patientId?.firstName && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Resident's Name : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientId?.firstName}{" "}
                      {details?.data?.patientId?.lastName}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={3}
                  md={12}
                  lg={4}
                  className={`${!details?.data?.patientId?.ahcccsId && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">AHCCCS ID : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientId?.ahcccsId}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={4}
                  md={12}
                  lg={4}
                  className={`${!details?.data?.patientId?.admitDate && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Admin Date : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientId?.admitDate &&
                        formatDateToMMDDYYYY(
                          details?.data?.patientId?.admitDate,
                        )}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            {details?.data?.tableDate?.length > 0 && (
              <Row className="mt-2">
                <Col xs={12} sm={12}>
                  <Table className="table-fix-layout" bordered responsive>
                    <thead>
                      <tr>
                        <th>Medication</th>
                        <th>Medication Start Date</th>
                        <th>Few Days Only</th>
                        <th>D/C Date</th>
                        <th>Instruction</th>
                        <th>Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.data?.tableDate?.map((i, index) => (
                        <tr key={index}>
                          <td
                            className={`fw-light ${i.medicationInstructions ? "" : "text-center"}`}
                          >
                            {" "}
                            {i.medicationInstructions || <DashComponent />}{" "}
                          </td>
                          <td
                            className={`fw-light ${i.medicationStartDate ? "" : "text-center"}`}
                          >
                            {" "}
                            {(i.medicationStartDate &&
                              formatDateToMMDDYYYY(i.medicationStartDate)) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`fw-light ${i.fewDaysOnly || i.fewDaysOnly == 0 ? "" : "text-center"}`}
                          >
                            {" "}
                            {i.fewDaysOnly || i.fewDaysOnly == 0 ? (
                              i.fewDaysOnly
                            ) : (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`fw-light ${i.dischargeDate ? "" : "text-center"}`}
                          >
                            {(i.dischargeDate &&
                              formatDateToMMDDYYYY(i.dischargeDate)) || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`fw-light text-justify ${i.residentGuardianInitial ? "" : "text-center"} `}
                          >
                            {" "}
                            {i.residentGuardianInitial || (
                              <DashComponent />
                            )}{" "}
                          </td>
                          <td
                            className={`fw-light ${i.signature ? "" : "text-center"}`}
                          >
                            {" "}
                            {i?.signature ? (
                              signatureFormat({
                                sign: i?.signature,
                                date: i?.staffSignedDate,
                                hoursFormat,
                              })
                            ) : (
                              <DashComponent />
                            )}{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            )}
            <Row className="mb-2">
              <Col xs={12}>
                <Form.Label>
                  I,{" "}
                  {details?.data?.patientId?.firstName && (
                    <span className="fw-bold">{`${details?.data?.patientId?.firstName} ${details?.data?.patientId?.lastName}`}</span>
                  )}
                  , have received instruction in the use of the above listed
                  medication(s) including the medication anticipated results,
                  and potential side effect that maybe result from not taking
                  the medication.
                </Form.Label>
              </Col>
            </Row>

            <div className="signature-sections-inline mt-3">
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={details?.data?.signatures?.resident}
                signerNameOverride={
                  details?.data?.patientId?.firstName
                    ? `${details?.data?.patientId?.firstName} ${details?.data?.patientId?.lastName}`
                    : ""
                }
              />
              <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={details?.data?.signatures?.witness}
              />
            </div>

            <Row className="mb-2">
              <Col xs={12} sm={12} md={12} lg={12}>
                <Form.Label className="w-100 text-end mb-0">
                  {signatureFormat({
                    sign: details?.data?.staff?.[0]?.signature,
                    date: details?.data?.staff?.[0]?.signatureDate,
                    time: details?.data?.staff?.[0]?.signatureTime,
                    hoursFormat,
                  })}
                </Form.Label>
                {details?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <Form.Label
                      className="w-100 text-end mb-0"
                      key={signer.signerId}
                    >
                      {signatureFormat({
                        sign: signer?.signature,
                        date: signer?.dateSigned,
                        time: signer?.signedTime,
                        hoursFormat,
                      })}
                    </Form.Label>
                  ) : null,
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="employee_btn_div hidePrint">
                  <button
                    className="employee_create_btn"
                    type="button"
                    onClick={print}
                  >
                    PRINT REPORT
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewInform,
});

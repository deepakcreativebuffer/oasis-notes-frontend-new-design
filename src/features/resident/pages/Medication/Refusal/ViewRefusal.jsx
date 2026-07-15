/** @format */

import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Card } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import { medicationService } from "@/features/shared/services";
import { useParams } from "react-router-dom";
import Loader from "@/features/shared/ui/Loader/Loader";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewRefusal = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const printRef = React.useRef(null);
  useEffect(() => {
    medicationService.refusal.getById(id, {
      setResponse: setDetails,
      setLoading,
    });
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
    @page {
      size:portrait !important;
      margin: 12mm 9mm !important;
    }    
    .card {
      page-break-inside: avoid;
    }
    .view-details-grid {
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
      <NavWrapper title={"Refusal of Medical Treatment Form"} isArrow={true} />
      {loading ? (
        <Loader />
      ) : (
        <Container>
          <div ref={componentRef}>
            <h1 className="pdfTitle my-3 hidden">
              Refusal of Medical treatment form
            </h1>
            <div className="view-details">
              <Row>
                <Col
                  xs={12}
                  sm={5}
                  md={12}
                  lg={4}
                  xl={3}
                  className={`${!details?.data?.patientName && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Resident’s Name : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientName}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={3}
                  md={12}
                  lg={4}
                  xl={3}
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
                  xl={3}
                  className={`${!details?.data?.toDayDate && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Today's Date : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.toDayDate &&
                        formatDateToMMDDYYYY(details?.data?.toDayDate)}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={3}
                  className={`${!details?.data?.patientId?.dateOfBirth && "hidePrint"}`}
                >
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Date of Birth : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.patientId?.dateOfBirth &&
                        formatDateToMMDDYYYY(
                          details?.data?.patientId?.dateOfBirth,
                        )}
                    </h5>
                  </div>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className={`${!details?.data?.describeIllness && "hidePrint"}`}
                >
                  <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                    <p className="view-label mb-1">
                      Describe Illness/Injury :{" "}
                    </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.describeIllness}
                    </h5>
                  </div>
                </Col>
              </Row>
            </div>
            <Card body className="mb-2 mt-2">
              <Form.Label>
                I
                <span className="mx-1 fw-bold d-inline">
                  {details?.data?.patientName}
                </span>
                have been offered the opportunity to have medical care at the
                doctors office,hospital,urgent care for the above
                illness/injury. I feel as though I do not require medical care
                at this time. However, should I feel the need to have medical
                care, I will immediately report this to a staff.
              </Form.Label>
            </Card>

            <div className="signature-sections-inline mt-3">
              <SignatureSection
                role="resident"
                label="Resident/Representative Signature"
                variant="blue"
                mode="view"
                signature={details?.data?.signatures?.resident}
                signerNameOverride={details?.data?.patientName || ""}
              />
              <SignatureSection
                role="witness"
                label="Witness Signature"
                variant="yellow"
                mode="view"
                signature={details?.data?.signatures?.witness}
              />
            </div>

            <Row>
              <Col xs={12} md={12} lg={12} className="text-end">
                {signatureFormat({
                  sign: details?.data?.staffSignature,
                  date: details?.data?.staffDate,
                  time: details?.data?.staffTime,
                  hoursFormat,
                })}
                {signatureFormat({
                  sign: details?.data?.adminSignature,
                  date: details?.data?.adminDateSigned,
                  time: details?.data?.adminSignedTime,
                  hoursFormat,
                })}
                {details?.data?.signers?.map?.((signer) =>
                  signer?.signature?.length ? (
                    <Form.Label
                      className="text-end w-100 mb-0"
                      key={signer?.signerId}
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
                <button
                  className="employee_create_btn hidePrint mt-3 mt-md-4"
                  type="button"
                  onClick={print}
                >
                  PRINT REPORT
                </button>
              </Col>
            </Row>
          </div>
        </Container>
      )}
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewRefusal,
});

/** @format */

import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import HOC from "@/features/shared/layout/Inner/HOC";
import { useParams } from "react-router-dom";
import { therapyNotesService } from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import SignatureSection from "@/features/shared/ui/SignaturePadModal/SignatureSection";
const ViewMilega = () => {
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const [detail, setDetail] = useState({});
  const { id } = useParams();
  const fetchHandler = () => {
    therapyNotesService.mileageLog.getById(id, { setResponse: setDetail });
  };
  useEffect(() => {
    fetchHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        detail?.data?.patientId || detail?.patientId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      detail?.data?.patientId || detail?.patientId,
      profile,
    ),
    pageStyle: `
    @page { 
      size: portrait !important;
      margin: 12mm 9mmm!important;
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
      <NavWrapper title={"Mileage Log"} isArrow={true} />
      <Container>
        <div className="mileage-log" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Mileage Log</h1>
          <div className="view-details">
            <Row>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!detail?.data?.date && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Date : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.date &&
                      formatDateToMMDDYYYY(detail?.data?.date)}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!detail?.data?.beginningMileage && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Beginning Mileage : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.beginningMileage}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!detail?.data?.endingMileage && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Ending Mileage : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.endingMileage}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={3}
                md={12}
                lg={4}
                className={`${!detail?.data?.totalMileage && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Total Mileage : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.totalMileage}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4}
                className={`${!detail?.data?.residentInitials && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Resident Initials : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.residentInitials}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4}
                className={`${!detail?.data?.destination && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Destination : </p>
                  <h5 className="view-value mb-0">
                    {detail?.data?.destination}
                  </h5>
                </div>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                className={`${!detail?.data?.anyIssues && "hidePrint"}`}
              >
                <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Any Issues : </p>
                  <h5 className="view-value mb-0">{detail?.data?.anyIssues}</h5>
                </div>
              </Col>
            </Row>
          </div>

          <div className="signature-sections-inline mt-3">
            <SignatureSection
              role="resident"
              label="Resident/Representative Signature"
              variant="blue"
              mode="view"
              signature={detail?.data?.signatures?.resident}
              signerNameOverride={""}
            />
            <SignatureSection
              role="witness"
              label="Witness Signature"
              variant="yellow"
              mode="view"
              signature={detail?.data?.signatures?.witness}
            />
          </div>

          <Row className="mt-2">
            <Col xs={12} lg={12} className="text-end">
              {signatureFormat({
                sign: detail?.data?.driverSignature,
                time: detail?.data?.signedTime,
                date: detail?.data?.signedDate,
                hoursFormat,
              })}
              {signatureFormat({
                sign: detail?.data?.adminSignature,
                date: detail?.data?.adminDateSigned,
                time: detail?.data?.adminSignedTime,
                hoursFormat,
              })}
              {detail?.data?.signers?.map?.((signer) =>
                signer?.signature?.length ? (
                  <div className="w-100 text-end" key={signer?.signerId}>
                    {signatureFormat({
                      sign: signer?.signature,
                      date: signer?.dateSigned,
                      time: signer?.signedTime,
                      hoursFormat,
                    })}
                  </div>
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
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewMilega,
});

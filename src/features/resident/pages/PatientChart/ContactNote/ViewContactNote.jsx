/** @format */

import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/Inner/HOC";
import NavWrapper from "@/utils/NavWrapper";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  convertTimeFormat,
  fetchPaitentName,
  formatDateToMMDDYYYY,
  signatureFormat,
} from "@/utils/utils";
import "@/assets/styles/Print.css";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
const ViewContactNote = () => {
  const [details, setDetails] = useState({});
  const { id } = useParams();
  const Profile = useSelector(userProfile);
  const hoursFormat = Profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = useRef(null);
  const fetchDetail = () => {
    getData(setDetails, `employee/getContactNoteById/${id}`);
  };
  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        Profile,
        Profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.patientId),
    pageStyle: `
    @page {
      size: portrait !important;
      margin: 12mm 9mm!important;
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
      <NavWrapper title={"Contact Note"} isArrow={true} />
      <Container>
        <div className="contact-note" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Contact Note</h1>
          <Row>
            <Col
              xs={12}
              sm={5}
              md={6}
              lg={4}
              className={`${!details?.data?.patientId && "hidePrint"}`}
            >
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Resident’s Name : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.patientId &&
                    fetchPaitentName(details?.data?.patientId)}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={4}
              md={6}
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
              sm={3}
              md={6}
              lg={4}
              className={`${!details?.data?.patientId?.dateOfBirth && "hidePrint"}`}
            >
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">DOB : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.patientId?.dateOfBirth &&
                    formatDateToMMDDYYYY(details?.data?.patientId?.dateOfBirth)}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={5}
              md={6}
              lg={4}
              className={`${!details?.data?.patientId?.admitDate && "hidePrint"}`}
            >
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Admit Date : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.patientId?.admitDate &&
                    formatDateToMMDDYYYY(details?.data?.patientId?.admitDate)}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={4}
              md={6}
              lg={4}
              className={`${!details?.data?.date && "hidePrint"}`}
            >
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Date : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.date &&
                    formatDateToMMDDYYYY(details?.data?.date)}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={3}
              md={6}
              lg={4}
              className={`${!details?.data?.time && "hidePrint"}`}
            >
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Time : </p>
                <h5 className="view-value mb-0">
                  {convertTimeFormat(details?.data?.time, hoursFormat)}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!details?.data?.patientId?.diagnosis && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">
                  Diagnosis (specify if new or continuing) :{" "}
                </p>
                <h5 className="view-value mb-0">
                  {details?.data?.patientId?.diagnosis}
                </h5>
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={12} sm={12}>
              <h6 className="fw-bold mb-0">Person contacted </h6>
            </Col>
          </Row>
          <Row>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={4}
              className={`${!details?.data?.guardian && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Guardian : </p>
                <h5 className="view-value mb-0">{details?.data?.guardian}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={4}
              className={`${!details?.data?.caseManager && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Case Manager : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.caseManager}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={4}
              className={`${!details?.data?.pharmacy && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Pharmacy : </p>
                <h5 className="view-value mb-0">{details?.data?.pharmacy}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.familyMember && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Family member : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.familyMember}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.doctorsOffice && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Doctors office : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.doctorsOffice}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.personContactedOther && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Other : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.personContactedOther}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.contactName && "hidePrint"}`}
            >
              <div className="view-details-grid my-1 my-md-2 p-3">
                <p className="view-label mb-1">Contact Name : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.contactName}
                </h5>
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col xs={12} sm={12}>
              <h6 className="fw-bold mb-0">Mode of contact </h6>
            </Col>
          </Row>
          <Row>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.email && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Email : </p>
                <h5 className="view-value mb-0">{details?.data?.email}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.textMessage && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Text message : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.textMessage}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.phoneCall && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Phone call : </p>
                <h5 className="view-value mb-0">{details?.data?.phoneCall}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={3}
              className={`${!details?.data?.inPerson && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">In person : </p>
                <h5 className="view-value mb-0">{details?.data?.inPerson}</h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!details?.data?.modeOfContactOther && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Other, please specify : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.modeOfContactOther}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!details?.data?.contactSummaryNote && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Contact Summary Note : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.contactSummaryNote}
                </h5>
              </div>
            </Col>
            <Col
              xs={12}
              sm={12}
              md={12}
              lg={12}
              className={`${!details?.data?.emergencyIssue.length < 0 && "hidePrint"}`}
            >
              <div className="view-details-grid view-details-grid-inline my-1 my-md-2 p-3">
                <p className="view-label mb-1">Emergency issue : </p>
                <h5 className="view-value mb-0">
                  {details?.data?.emergencyIssue ? "Yes" : "No"}
                </h5>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xs={12} sm={12} className="text-end">
              <Form.Label className="w-100 mb-0">
                {signatureFormat({
                  sign: details?.data?.savedSigned,
                  date: details?.data?.savedDate,
                  time: details?.data?.savedTime,
                  hoursFormat,
                })}
                {signatureFormat({
                  sign: details?.data?.adminSignature,
                  date: details?.data?.adminDateSigned,
                  time: details?.data?.adminSignedTime,
                  hoursFormat,
                })}
              </Form.Label>
            </Col>
            <Col xs={12} sm={12} className="text-end">
              {details?.data?.signers?.map?.((signer) =>
                signer?.signature?.length ? (
                  <Form.Label className="w-100 mb-0" key={signer?.signerId}>
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
            <Col xs={12} sm={12}>
              <button
                className="print_btn hidePrint"
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
  Wcomponenet: ViewContactNote,
});

/** @format */

import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { userProfile } from "@/store/authSlice";
import React, { useEffect, useState } from "react";
import { getData } from "@/features/shared/services";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import NavWrapper from "@/utils/NavWrapper";
import { Col, Container, Row, Form } from "react-bootstrap";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { usePrint } from "@shared/hooks";
import { PrintThis } from "@/utils";
const ViewEmployeeTermination = () => {
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  useEffect(() => {
    getData(
      setDetails,
      id ? `admin/termination/${id}` : `admin/termination/${profile._id}`,
    );
  }, [id, profile._id]);
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        details?.data?.employeeId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(details?.data?.employeeId),
    pageStyle: `
     @page {
        size: portrait !important;
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
    PrintThis(handlePrint);
  };
  const print = usePrint(printRef, handlePrint2);
  return (
    <div ref={printRef} tabIndex={0} className="outline-none">
      <NavWrapper isArrow={true} title={"Employee Termination"} />
      <Container>
        <div className="termination-summary" ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">Employee Termination</h1>
          <div className="view-details print-termination-details print-view-details">
            <Row>
              <Col
                col={12}
                sm={12}
                md={4}
                lg={3}
                className={`disp-in-print ${!details?.data?.date && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1 print-underline">Date : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.date &&
                      formatDateToMMDDYYYY(details?.data?.date)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={8}
                lg={8}
                className={`${!details?.data?.employeeName}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1 print-underline">
                    Name of Terminated Employee :
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.employeeId?.firstName}{" "}
                    {details?.data?.employeeId?.lastName}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={4}
                lg={4}
                className={`hide-in-print ${!details?.data?.date && "hidePrint"}`}
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
                col={12}
                sm={12}
                md={6}
                lg={6}
                className={`${!details?.data?.hireDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label print-underline mb-1">
                    Hire Date :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.hireDate &&
                      formatDateToMMDDYYYY(details?.data?.hireDate)}
                  </h5>
                </div>
              </Col>
              <Col
                col={12}
                sm={12}
                md={6}
                lg={6}
                className={`${!details?.data?.terminationDate && "hidePrint"}`}
              >
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label print-underline mb-1">
                    Termination Date :{" "}
                  </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.terminationDate &&
                      formatDateToMMDDYYYY(details?.data?.terminationDate)}
                  </h5>
                </div>
              </Col>
            </Row>
            <Row>
              <Col col={12}>
                <div className="view-details-grid  d-block my-1 my-md-2 p-3">
                  <p className="view-label mb-2 mb-md-3">
                    Reason for Termination{" "}
                  </p>
                  <Row>
                    <Col col={12} sm={6} lg={6}>
                      <div>
                        <p className="view-label mb-1">Voluntary</p>

                        <ul className="ps-3 mt-2 view-value">
                          {details?.data?.selectedVoluntary?.map(
                            (voluntary, index) => (
                              <li className="mb-2 list-disc" key={index}>
                                {voluntary}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </Col>
                    <Col col={12} sm={6} lg={6}>
                      <div>
                        <p className="view-label mb-1">Involuntary</p>

                        <ul className="ps-3 mt-2 view-value">
                          {details?.data?.selectedInvoluntary?.map(
                            (inVoluntary, index) => (
                              <li className="mb-2 list-disc" key={index}>
                                {inVoluntary}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col col={12} lg={6}>
                <div className="view-details-grid print-view-inline d-block my-1 my-md-2 p-3">
                  <p className="view-label mb-1">
                    Disciplinary Actions Prior to Termination{" "}
                  </p>

                  <ul className="ps-3 mt-2 view-value">
                    {details?.data?.disciplinaryAction?.map(
                      (disciplinary, index) => (
                        <li className="mb-2 list-disc" key={index}>
                          {disciplinary}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </Col>
              <Col col={12} lg={6}>
                <div className="view-details-grid print-view-flex d-block my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Copy Provided to Employee</p>

                  <ul className="ps-3 mt-2 view-value copyprovider-other">
                    {details?.data?.copyProvidedTo?.map(
                      (copyProvidedEmployee, index) => (
                        <li className="mb-2 list-disc" key={index}>
                          {copyProvidedEmployee}
                        </li>
                      ),
                    )}
                    {details?.data?.copyProvidedTo.includes("Other") &&
                      details?.data?.copyProvidedOther && (
                        <Form.Label className="d-inline ms-1">
                          {" "}
                          : {details?.data?.copyProvidedOther}
                        </Form.Label>
                      )}
                  </ul>
                </div>
              </Col>
            </Row>
            <Row>
              <Col col={12} sm={12} className="hide-in-print">
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Eligible for Rehire : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.rehireEligibility ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
              <Col col={12} sm={12} className="disp-in-print">
                <div className="view-details-grid my-1 my-md-2 p-3">
                  <p className="view-label mb-1">Eligible for Rehire : </p>
                  <h5 className="view-value mb-0">
                    {details?.data?.rehireEligibility ? "Yes" : "No"}
                  </h5>
                </div>
              </Col>
              {details?.data?.rehireEligibility === true && (
                <Col col={12} sm={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Rehire Date : </p>
                    <h5 className="view-value mb-0">
                      {formatDateToMMDDYYYY(details?.data?.rehireDate)}
                    </h5>
                  </div>
                </Col>
              )}
            </Row>
            <Row>
              {details?.data?.rehireEligibility === false && (
                <Col col={12} sm={12}>
                  <div className="view-details-grid my-1 my-md-2 p-3">
                    <p className="view-label mb-1">Explanation : </p>
                    <h5 className="view-value mb-0">
                      {details?.data?.explanation}
                    </h5>
                  </div>
                </Col>
              )}
            </Row>
            <Row>
              <Col col={12}>
                <p className="text-end mb-0">
                  {signatureFormat({
                    sign: details?.data?.adminSignature,
                    date: details?.data?.adminDateSigned,
                    hoursFormat,
                  })}
                  {signatureFormat({
                    sign: details?.data?.employeeSignature,
                    date: details?.data?.dateSigned,
                    hoursFormat,
                  })}
                  {details?.data?.signers?.map(
                    (signer) =>
                      signer.signature && (
                        <div key={signer?.signerId}>
                          {signatureFormat({
                            sign: signer.signature,
                            date: signer.dateSigned,
                            hoursFormat,
                          })}
                        </div>
                      ),
                  )}
                </p>
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
        </div>
      </Container>
    </div>
  );
};
export default HOC({
  Wcomponenet: ViewEmployeeTermination,
});

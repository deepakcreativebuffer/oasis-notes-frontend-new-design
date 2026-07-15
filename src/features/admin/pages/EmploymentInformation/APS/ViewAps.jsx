/** @format */

import React, { useEffect } from "react";
import { useState } from "react";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import NavWrapper from "@/utils/NavWrapper";
import { getData } from "@/features/shared/services";
import HOC from "@/features/shared/layout/EmployeeBar/HOC";
import { useParams } from "react-router-dom";
import { useReactToPrintWithContent as useReactToPrint } from "@/utils/useReactToPrintWithContent";
import { formatDateToMMDDYYYY, signatureFormat } from "@/utils/utils";
import {
  printDocumentContent,
  printDocumentTitleExceptFirstPage,
} from "@/utils/printHelpers";
import { useSelector } from "react-redux";
import { userProfile } from "@/store/authSlice";
import { usePrint } from "@shared/hooks";
import { downloadReport } from "@/utils";
import { ROLES } from "@/features/shared/constants";
const ViewAps = () => {
  const [data, setData] = useState({});
  const { id, employeeId } = useParams();
  const profile = useSelector(userProfile);
  const hoursFormat = profile?.hoursFormat === "24" ? "HH:mm" : "h:mm A";
  const printRef = React.useRef(null);
  const getProfile = () => {
    getData(
      setData,
      employeeId
        ? `employee/getApsConsentById/${employeeId}`
        : `employee/getApsConsentById/${id}`,
    );
  };
  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const companyName =
    profile?.userType === ROLES.ADMIN
      ? profile?.companyName
      : profile?.adminId?.companyName;

  // Download Report
  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () =>
      printDocumentContent(
        componentRef.current.cloneNode(true),
        data?.data?.employeeId,
        profile,
      ),
    documentTitle: printDocumentTitleExceptFirstPage(
      data?.data?.employeeId,
      profile,
    ),
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
      <NavWrapper title="APS Consent" isArrow={true} />
      <Container>
        <div ref={componentRef}>
          <h1 className="pdfTitle my-3 hidden">APS Consent</h1>
          <Card body className="mb-3">
            <Row>
              <Col xs={12}>
                <Form.Label>
                  <span>{companyName}</span> conducts adult protective service
                  search through the department of health services APS search
                  registry. These searches are conducted randomly and also
                  yearly thereafter.
                </Form.Label>
                <Form.Label>
                  a. Administrator will conduct a search on the APS registry
                  through he department of health services AZ Care Check using
                  employee’s first name, last name and date of birth. Search
                  results will fall into the following categories:
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Card body className="mb-1">
                  <Form.Label className="fw-bold me-2">
                    i. Record Found with (a) Classification :{" "}
                  </Form.Label>
                  <Form.Label className="fw-normal">
                    {data?.data?.classification === "true" ? "Yes" : "No"}
                  </Form.Label>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Card body className="mb-1">
                  <Form.Label className="fw-bold me-2">
                    (b) Date of the incident :{" "}
                  </Form.Label>
                  <Form.Label className="fw-normal">
                    {data?.data?.dateOfIncident &&
                      formatDateToMMDDYYYY(data?.data?.dateOfIncident)}{" "}
                  </Form.Label>
                </Card>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <Card body className="mb-1">
                  <Form.Label className="fw-bold me-2">
                    ii. APS Registry Record Found :{" "}
                  </Form.Label>
                  <Form.Label className="fw-normal">
                    {data?.data?.noRecordFound === true ? "Yes" : "No"}
                  </Form.Label>
                </Card>
              </Col>
            </Row>
          </Card>
          <Card body className="mb-2">
            <Row>
              <Col xs={12}>
                <Form.Label>
                  b. Employees or subcontractors shall be prohibited from
                  providing services to <span>{companyName}</span> residents if
                  the search of the APS Registry contains any substantiated
                  report of abuse, neglect, or exploitation of vulnerable adults
                  or children.
                </Form.Label>
                <Form.Label>
                  By Signing this, Employee gives <span>{companyName}</span>{" "}
                  consent to conduct a search on the AZ Department of Health APS
                  search registry.
                </Form.Label>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={4}>
                <Card body>
                  <Form.Label className="fw-bold me-2">Date : </Form.Label>
                  <Form.Label className="fw-normal">
                    {data?.data?.date && formatDateToMMDDYYYY(data?.data?.date)}
                  </Form.Label>{" "}
                </Card>
              </Col>
            </Row>
          </Card>

          <Row>
            <Col xs={12} lg={12} className="text-end">
              {signatureFormat({
                sign: data?.data?.employeeSignature,
                date: data?.data?.employeeDate,
                time: data?.data?.employeeTime,
                hoursFormat,
              })}
              {signatureFormat({
                sign: data?.data?.adminSignature,
                date: data?.data?.adminDateSigned,
                time: data?.data?.adminSignedTime,
                hoursFormat,
              })}

              {data?.data?.signers?.map(
                (signer) =>
                  signer.signature && (
                    <Form.Label
                      key={signer?.signerId}
                      className="text-end w-100 mb-0"
                    >
                      {signatureFormat({
                        sign: signer.signature,
                        date: signer.dateSigned,
                        time: signer.signedTime,
                        hoursFormat,
                      })}
                    </Form.Label>
                  ),
              )}
            </Col>
          </Row>
          <Row className="mt-3 mt-md-4 text-center hidePrint">
            <Col xs={12}>
              <button className="employee_create_btn" onClick={print}>
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
  Wcomponenet: ViewAps,
});
